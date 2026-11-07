import assert from 'node:assert/strict';
import { test as teste } from 'vitest';
import { criarServico, lerPedido } from '../supabase/functions/_shared/onibus-servidor.ts';

const BASE = 'https://api.exemplo.invalid/v2.1';
const TOKEN = 'token-secreto-de-teste-123';

type Rota = (url: URL, init: RequestInit) => Response | Promise<Response>;

/** API Olho Vivo simulada: registra cada chamada e responde conforme a rota. */
function apiSimulada(rotas: Record<string, Rota>) {
  const chamadas: { caminho: string; cookie: string | null }[] = [];
  const fetchFalso = (async (entrada: RequestInfo | URL, init: RequestInit = {}) => {
    const url = new URL(String(entrada));
    const caminho = url.pathname.replace('/v2.1', '');
    chamadas.push({ caminho, cookie: new Headers(init.headers).get('cookie') });
    const rota = rotas[caminho];
    if (!rota) return new Response('não encontrado', { status: 404 });
    return rota(url, init);
  }) as typeof fetch;
  return { fetchFalso, chamadas };
}

const loginOk: Rota = () => new Response('true', { headers: { 'set-cookie': 'apiCredentials=abc123; Path=/; HttpOnly' } });
const json = (dados: unknown, status = 200) => new Response(JSON.stringify(dados), { status, headers: { 'content-type': 'application/json' } });
const BUSCA = [{ cl: 1273, lc: false, lt: '8000', sl: 1, tl: 10, tp: 'PCA.RAMOS DE AZEVEDO', ts: 'TERMINAL LAPA' }];
const POSICAO = { hr: '11:58', vs: [{ p: '11433', a: true, ta: '2026-11-05T14:59:30Z', py: -23.5, px: -46.6 }] };

function servico(rotas: Record<string, Rota>, extra: Partial<Parameters<typeof criarServico>[0]> = {}) {
  const api = apiSimulada(rotas);
  let relogio = Date.parse('2026-11-05T15:00:00Z');
  const logs: string[] = [];
  const atender = criarServico({ fetch: api.fetchFalso, token: TOKEN, base: BASE, agora: () => relogio, log: (m) => logs.push(m), ...extra });
  const pedir = async (corpo: unknown, ip = '200.1.2.3', metodo = 'POST') => {
    const res = await atender(
      new Request('https://funcao.invalid/onibus', {
        method: metodo,
        headers: { 'content-type': 'application/json', 'x-forwarded-for': ip, origin: 'https://app.invalid' },
        body: metodo === 'POST' ? (typeof corpo === 'string' ? corpo : JSON.stringify(corpo)) : undefined
      })
    );
    return { status: res.status, corpo: res.status === 204 ? null : await res.json(), cabecalhos: res.headers };
  };
  return { pedir, chamadas: api.chamadas, logs, avancar: (ms: number) => (relogio += ms) };
}

// ---------- sucesso e sessão ----------

teste('onibus: login vai com corpo vazio (a SPTrans recusa POST sem tamanho com erro 411)', async () => {
  let corpoDoLogin: BodyInit | null | undefined;
  const s = servico({
    '/Login/Autenticar': (_url, init) => {
      corpoDoLogin = init.body;
      return loginOk(_url, init);
    },
    '/Linha/Buscar': () => json(BUSCA)
  });
  await s.pedir({ acao: 'linhas', termo: '8000' });
  assert.equal(corpoDoLogin, '');
});

teste('onibus: busca linha com login e devolve só o contrato do app', async () => {
  const s = servico({ '/Login/Autenticar': loginOk, '/Linha/Buscar': () => json(BUSCA) });
  const r = await s.pedir({ acao: 'linhas', termo: '8000' });
  assert.equal(r.status, 200);
  assert.equal(r.corpo.ok, true);
  assert.equal(r.corpo.linhas[0].letreiro, '8000-10');
  assert.deepEqual(s.chamadas.map((c) => c.caminho), ['/Login/Autenticar', '/Linha/Buscar']);
  assert.equal(s.chamadas[1].cookie, 'apiCredentials=abc123');
});

teste('onibus: reaproveita a sessão entre pedidos (um login só)', async () => {
  const s = servico({ '/Login/Autenticar': loginOk, '/Linha/Buscar': () => json(BUSCA), '/Posicao/Linha': () => json(POSICAO) });
  await s.pedir({ acao: 'linhas', termo: '8000' });
  await s.pedir({ acao: 'veiculos', codigo: 1273 });
  assert.equal(s.chamadas.filter((c) => c.caminho === '/Login/Autenticar').length, 1);
});

teste('onibus: veículos sem latitude, longitude nem token na resposta', async () => {
  const s = servico({ '/Login/Autenticar': loginOk, '/Posicao/Linha': () => json(POSICAO) });
  const r = await s.pedir({ acao: 'veiculos', codigo: 1273 });
  assert.equal(r.status, 200);
  assert.deepEqual(r.corpo.veiculos, [{ prefixo: '11433', acessivel: true, capturadoEm: '2026-11-05T14:59:30.000Z' }]);
  const texto = JSON.stringify(r.corpo);
  for (const proibido of ['-23.5', '-46.6', 'py', 'px', TOKEN, 'apiCredentials']) assert.equal(texto.includes(proibido), false, proibido);
});

// ---------- respostas simuladas da API ----------

teste('onibus: API vazia → "linha inexistente" e "sem veículos"', async () => {
  const s = servico({ '/Login/Autenticar': loginOk, '/Linha/Buscar': () => json([]), '/Posicao/Linha': () => json({ hr: '12:00', vs: [] }) });
  assert.equal((await s.pedir({ acao: 'linhas', termo: 'xyz' })).corpo.erro, 'linha_inexistente');
  assert.equal((await s.pedir({ acao: 'veiculos', codigo: 1 })).corpo.erro, 'sem_veiculos');
});

teste('onibus: 401 numa consulta → faz login de novo uma vez e tenta outra vez', async () => {
  let primeira = true;
  const s = servico({
    '/Login/Autenticar': loginOk,
    '/Linha/Buscar': () => {
      if (primeira) {
        primeira = false;
        return new Response('', { status: 401 });
      }
      return json(BUSCA);
    }
  });
  const r = await s.pedir({ acao: 'linhas', termo: '8000' });
  assert.equal(r.corpo.ok, true);
  assert.deepEqual(s.chamadas.map((c) => c.caminho), ['/Login/Autenticar', '/Linha/Buscar', '/Login/Autenticar', '/Linha/Buscar']);
});

teste('onibus: 401 de novo depois do novo login → "API fora", sem laço infinito', async () => {
  const s = servico({ '/Login/Autenticar': loginOk, '/Linha/Buscar': () => new Response('', { status: 401 }) });
  const r = await s.pedir({ acao: 'linhas', termo: '8000' });
  assert.equal(r.status, 502);
  assert.equal(r.corpo.erro, 'api_fora');
  assert.equal(s.chamadas.length, 4);
});

teste('onibus: login recusado (false) → "API fora" e o log não mostra o token', async () => {
  const s = servico({ '/Login/Autenticar': () => new Response('false') });
  const r = await s.pedir({ acao: 'linhas', termo: '8000' });
  assert.equal(r.corpo.erro, 'api_fora');
  assert.equal(s.logs.join(' ').includes(TOKEN), false);
});

teste('onibus: 429 da API → "limite" com status 429', async () => {
  const s = servico({ '/Login/Autenticar': loginOk, '/Linha/Buscar': () => new Response('', { status: 429 }) });
  const r = await s.pedir({ acao: 'linhas', termo: '8000' });
  assert.equal(r.status, 429);
  assert.equal(r.corpo.erro, 'limite');
});

teste('onibus: API que não responde → "tempo esgotado" dentro do tempo limite', async () => {
  const pendurada: Rota = (_url, init) =>
    new Promise((_, rejeitar) => init.signal?.addEventListener('abort', () => rejeitar(new DOMException('abort', 'AbortError'))));
  const s = servico({ '/Login/Autenticar': loginOk, '/Linha/Buscar': pendurada }, { tempoLimiteMs: 50 });
  const inicio = Date.now();
  const r = await s.pedir({ acao: 'linhas', termo: '8000' });
  assert.equal(r.corpo.erro, 'tempo_esgotado');
  assert.ok(Date.now() - inicio < 1000);
});

teste('onibus: falha de rede e resposta que não é JSON → "API fora"', async () => {
  const rede = servico({ '/Login/Autenticar': () => Promise.reject(new TypeError('fetch failed')) });
  assert.equal((await rede.pedir({ acao: 'linhas', termo: '8000' })).corpo.erro, 'api_fora');
  const html = servico({ '/Login/Autenticar': loginOk, '/Linha/Buscar': () => new Response('<html>manutenção</html>') });
  assert.equal((await html.pedir({ acao: 'linhas', termo: '8000' })).corpo.erro, 'api_fora');
});

teste('onibus: sem SPTRANS_TOKEN → "API fora", nenhuma chamada à API e log só com o nome do segredo', async () => {
  const s = servico({ '/Login/Autenticar': loginOk }, { token: undefined });
  const r = await s.pedir({ acao: 'linhas', termo: '8000' });
  assert.equal(r.corpo.erro, 'api_fora');
  assert.equal(s.chamadas.length, 0);
  assert.deepEqual(s.logs, ['onibus: SPTRANS_TOKEN ausente']);
});

// ---------- entrada ----------

teste('onibus: termo inválido é recusado no servidor, sem chamar a API', async () => {
  const s = servico({ '/Login/Autenticar': loginOk, '/Linha/Buscar': () => json(BUSCA) });
  for (const termo of ['', 'Terminal Lapa', '8000&x=1', '../Login', 'a'.repeat(11)]) {
    const r = await s.pedir({ acao: 'linhas', termo });
    assert.equal(r.status, 400, termo);
    assert.equal(r.corpo.erro, 'termo_invalido');
  }
  assert.equal(s.chamadas.length, 0);
});

teste('lerPedido: só as duas ações, com as chaves certas (sem URL livre)', () => {
  assert.equal(lerPedido({ acao: 'linhas', termo: '8000' }).ok, true);
  assert.equal(lerPedido({ acao: 'veiculos', codigo: 1273 }).ok, true);
  for (const p of [
    { acao: 'url', url: 'https://outra.api/x' },
    { acao: 'linhas', termo: '8000', url: '/Login/Autenticar' },
    { acao: 'veiculos', codigo: '1273; drop' },
    { acao: 'Posicao' },
    [],
    null
  ]) {
    assert.equal(lerPedido(p).ok, false, JSON.stringify(p));
  }
});

teste('onibus: só POST (e OPTIONS para o navegador); corpo grande ou não-JSON é recusado', async () => {
  const s = servico({});
  assert.equal((await s.pedir(null, '1.1.1.1', 'GET')).status, 405);
  const opcoes = await s.pedir(null, '1.1.1.1', 'OPTIONS');
  assert.equal(opcoes.status, 204);
  assert.equal(opcoes.cabecalhos.get('access-control-allow-origin'), '*');
  assert.equal((await s.pedir('não é json')).status, 400);
  assert.equal((await s.pedir(JSON.stringify({ acao: 'linhas', termo: '8000', x: 'a'.repeat(2000) }))).status, 400);
});

teste('onibus: com lista de origens, só libera CORS para elas', async () => {
  const s = servico({ '/Login/Autenticar': loginOk, '/Linha/Buscar': () => json(BUSCA) }, { origens: ['https://outra.invalid'] });
  const r = await s.pedir({ acao: 'linhas', termo: '8000' });
  assert.equal(r.cabecalhos.get('access-control-allow-origin'), null);
});

// ---------- cache e limite ----------

teste('onibus: cache de 15 s por linha', async () => {
  const s = servico({ '/Login/Autenticar': loginOk, '/Posicao/Linha': () => json(POSICAO) });
  await s.pedir({ acao: 'veiculos', codigo: 1273 });
  s.avancar(14_000);
  await s.pedir({ acao: 'veiculos', codigo: 1273 });
  assert.equal(s.chamadas.filter((c) => c.caminho === '/Posicao/Linha').length, 1);
  s.avancar(2_000);
  await s.pedir({ acao: 'veiculos', codigo: 1273 });
  assert.equal(s.chamadas.filter((c) => c.caminho === '/Posicao/Linha').length, 2);
  await s.pedir({ acao: 'veiculos', codigo: 9999 });
  assert.equal(s.chamadas.filter((c) => c.caminho === '/Posicao/Linha').length, 3);
});

teste('onibus: falha da API não entra no cache', async () => {
  let falhar = true;
  const s = servico({ '/Login/Autenticar': loginOk, '/Posicao/Linha': () => (falhar ? new Response('', { status: 500 }) : json(POSICAO)) });
  assert.equal((await s.pedir({ acao: 'veiculos', codigo: 1273 })).corpo.erro, 'api_fora');
  falhar = false;
  assert.equal((await s.pedir({ acao: 'veiculos', codigo: 1273 })).corpo.ok, true);
});

teste('onibus: limite de pedidos por minuto por IP, sem guardar nem registrar o IP', async () => {
  const s = servico({ '/Login/Autenticar': loginOk, '/Linha/Buscar': () => json(BUSCA) }, { limitePorMinuto: 3 });
  for (let i = 0; i < 3; i++) assert.equal((await s.pedir({ acao: 'linhas', termo: '8000' }, '200.9.9.9')).status, 200);
  const bloqueado = await s.pedir({ acao: 'linhas', termo: '8000' }, '200.9.9.9');
  assert.equal(bloqueado.status, 429);
  assert.equal(bloqueado.corpo.erro, 'limite');
  assert.equal((await s.pedir({ acao: 'linhas', termo: '8000' }, '200.8.8.8')).status, 200, 'outro IP segue livre');
  s.avancar(60_000);
  assert.equal((await s.pedir({ acao: 'linhas', termo: '8000' }, '200.9.9.9')).status, 200, 'depois de um minuto libera');
  const tudo = s.logs.join(' ');
  for (const proibido of ['200.9.9.9', '200.8.8.8', '8000']) assert.equal(tudo.includes(proibido), false, proibido);
});

teste('onibus: resposta da API em formato errado também não entra no cache', async () => {
  let quebrada = true;
  const s = servico({ '/Login/Autenticar': loginOk, '/Linha/Buscar': () => json(quebrada ? { mensagem: 'manutenção' } : BUSCA) });
  assert.equal((await s.pedir({ acao: 'linhas', termo: '8000' })).corpo.erro, 'api_fora');
  quebrada = false;
  assert.equal((await s.pedir({ acao: 'linhas', termo: '8000' })).corpo.ok, true);
});
