import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { test as teste } from 'vitest';
import {
  frasePonto,
  lerBuscaParadas,
  lerPrevisaoParada,
  minutosAte,
  resumirPonto,
  validarTermoParada,
  type LinhaNoPonto
} from '../supabase/functions/_shared/embarque.ts';
import { criarServico, lerPedido } from '../supabase/functions/_shared/onibus-servidor.ts';
import { consultarExemplo, validarExemplo, type DadosExemplo } from '../src/app/embarque/exemplo.ts';
import { consultarOnibus } from '../src/app/embarque/cliente.ts';

const AGORA = new Date('2026-11-06T15:00:00Z');

// Formato da documentação oficial v2.1 (data/README.md), com valores fictícios.
const BUSCA_PARADA = [{ cp: 340015329, np: 'PONTO FICTÍCIO B/C1', ed: 'R FICTÍCIA/ R OUTRA', py: -23.59, px: -46.67 }];
const PREVISAO = {
  hr: '20:20',
  p: {
    cp: 4200953,
    np: 'PONTO FICTÍCIO B/C',
    py: -23.67,
    px: -46.75,
    l: [
      { c: '675K-10', cl: 198, sl: 1, lt0: 'DESTINO FICTÍCIO', lt1: 'ORIGEM FICTÍCIA', qv: 2, vs: [
        { p: '73651', t: '20:34', a: true, ta: '2026-11-06T23:20:06Z', py: -23.6, px: -46.7 },
        { p: 73652, t: '20:24', a: false, ta: '2026-11-06T23:20:06Z', py: -23.6, px: -46.7 }
      ] },
      { c: '669A-10', cl: 200, sl: 2, lt0: 'OUTRO DESTINO', lt1: 'X', qv: 1, vs: [{ p: '11111', t: '20:29', a: false, ta: '2026-11-06T23:20:06Z', py: 0, px: 0 }] }
    ]
  }
};

// ---------- entrada ----------

teste('validarTermoParada: aceita nome de rua com espaço; recusa curto, longo e símbolos', () => {
  assert.deepEqual(validarTermoParada('  Avenida   Paulista '), { ok: true, termo: 'Avenida Paulista' });
  for (const t of ['Afonso Braz', 'R. Augusta', 'Paulista 1000', 'Sé']) assert.equal(validarTermoParada(t).ok, true, t);
  for (const t of ['', 'a', 'x'.repeat(41), 'Paulista&x=1', '<b>', null, 42]) assert.equal(validarTermoParada(t).ok, false, String(t));
});

// ---------- leitura da API ----------

teste('lerBuscaParadas: lê código, nome e endereço e descarta latitude e longitude', () => {
  const r = lerBuscaParadas(BUSCA_PARADA);
  assert.deepEqual(r, { ok: true, acao: 'paradas', paradas: [{ codigo: 340015329, nome: 'PONTO FICTÍCIO B/C1', endereco: 'R FICTÍCIA/ R OUTRA' }] });
  assert.equal(JSON.stringify(r).includes('-23'), false);
  assert.equal((lerBuscaParadas([]) as { erro: string }).erro, 'linha_inexistente');
  assert.equal((lerBuscaParadas({ x: 1 }) as { erro: string }).erro, 'api_fora');
});

teste('lerPrevisaoParada: lê letreiro, destino, prefixo, acessível e horário previsto, sem localização', () => {
  const r = lerPrevisaoParada(PREVISAO, 4200953, AGORA);
  assert.ok(r.ok && r.acao === 'previsao');
  assert.equal(r.horaReferencia, '20:20');
  assert.deepEqual(r.parada, { codigo: 4200953, nome: 'PONTO FICTÍCIO B/C' });
  assert.deepEqual(r.linhas[0], {
    codigo: 198,
    letreiro: '675K-10',
    sentido: 1,
    destino: 'DESTINO FICTÍCIO',
    veiculos: [
      { prefixo: '73651', acessivel: true, previsto: '20:34' },
      { prefixo: '73652', acessivel: false, previsto: '20:24' }
    ]
  });
  for (const proibido of ['py', 'px', '-23', '-46']) assert.equal(JSON.stringify(r).includes(proibido), false, proibido);
});

teste('lerPrevisaoParada: ponto sem veículos vira "sem veículos"; formato errado vira "API fora"', () => {
  assert.equal((lerPrevisaoParada({ hr: '10:00', p: { cp: 1, np: 'X', l: [] } }, 1, AGORA) as { erro: string }).erro, 'sem_veiculos');
  assert.equal((lerPrevisaoParada({ hr: '10:00', p: { cp: 1, l: [{ c: 'A', cl: 1, sl: 1, vs: [{ p: '1', a: true, t: '25:99' }] }] } }, 1, AGORA) as { erro: string }).erro, 'sem_veiculos');
  assert.equal((lerPrevisaoParada([], 1, AGORA) as { erro: string }).erro, 'api_fora');
});

// ---------- cálculo ----------

teste('minutosAte: diferença no mesmo relógio, inclusive passando da meia-noite', () => {
  assert.equal(minutosAte('20:20', '20:34'), 14);
  assert.equal(minutosAte('23:58', '00:03'), 5);
  assert.equal(minutosAte('10:05', '10:03'), 0, 'previsão um pouco no passado vira "chegando agora"');
});

teste('resumirPonto e frasePonto: próximo acessível e quantos sem acessibilidade passam antes', () => {
  const r = lerPrevisaoParada(PREVISAO, 4200953, AGORA);
  assert.ok(r.ok && r.acao === 'previsao');
  const resumo = resumirPonto(r.linhas, r.horaReferencia!);
  assert.deepEqual(resumo.chegadas.map((c) => [c.letreiro, c.minutos, c.acessivel]), [
    ['675K-10', 4, false],
    ['669A-10', 9, false],
    ['675K-10', 14, true]
  ]);
  assert.equal(resumo.naoAcessiveisAntes, 2);
  assert.equal(frasePonto(resumo), 'Próximo acessível: 675K-10, em 14 min. Antes dele passam 2 ônibus sem acessibilidade.');
});

teste('frasePonto: singular, "chegando agora" e nenhum acessível', () => {
  const linha = (vs: [boolean, string][]): LinhaNoPonto[] => [{ codigo: 1, letreiro: 'A-10', sentido: 1, destino: 'D', veiculos: vs.map(([a, t], i) => ({ prefixo: `${100 + i}`, acessivel: a, previsto: t })) }];
  assert.equal(frasePonto(resumirPonto(linha([[true, '10:00']]), '10:00')), 'Próximo acessível: A-10, chegando agora.');
  assert.equal(frasePonto(resumirPonto(linha([[false, '10:01'], [true, '10:05']]), '10:00')), 'Próximo acessível: A-10, em 5 min. Antes dele passa 1 ônibus sem acessibilidade.');
  assert.equal(frasePonto(resumirPonto(linha([[false, '10:01']]), '10:00')), 'O único ônibus previsto não é acessível.');
  assert.equal(frasePonto(resumirPonto(linha([[false, '10:01'], [false, '10:02']]), '10:00')), 'Nenhum dos 2 ônibus previstos é acessível.');
});

// ---------- Edge Function ----------

teste('lerPedido: aceita "paradas" e "previsao" só com as chaves certas', () => {
  assert.equal(lerPedido({ acao: 'paradas', termo: 'Paulista' }).ok, true);
  assert.equal(lerPedido({ acao: 'previsao', codigo: 4200953 }).ok, true);
  for (const p of [{ acao: 'paradas', termo: 'x' }, { acao: 'previsao', codigo: 'a' }, { acao: 'paradas', termo: 'Paulista', lat: 1 }]) assert.equal(lerPedido(p).ok, false, JSON.stringify(p));
});

teste('onibus: busca ponto e previsão pela API, com login e sem localização na resposta', async () => {
  const caminhos: string[] = [];
  const fetchFalso = (async (u: RequestInfo | URL) => {
    const url = new URL(String(u));
    const caminho = url.pathname.replace('/v2.1', '');
    caminhos.push(`${caminho}${url.search}`);
    if (caminho === '/Login/Autenticar') return new Response('true', { headers: { 'set-cookie': 'apiCredentials=x; Path=/' } });
    if (caminho === '/Parada/Buscar') return new Response(JSON.stringify(BUSCA_PARADA));
    if (caminho === '/Previsao/Parada') return new Response(JSON.stringify(PREVISAO));
    return new Response('', { status: 404 });
  }) as typeof fetch;
  const atender = criarServico({ fetch: fetchFalso, token: 't', base: 'https://api.invalid/v2.1', agora: () => AGORA.getTime() });
  const pedir = async (corpo: unknown) =>
    (await atender(new Request('https://f.invalid/onibus', { method: 'POST', headers: { 'x-forwarded-for': '1.1.1.1' }, body: JSON.stringify(corpo) }))).json();
  const paradas = await pedir({ acao: 'paradas', termo: 'Rua Fictícia' });
  assert.equal(paradas.paradas[0].codigo, 340015329);
  const previsao = await pedir({ acao: 'previsao', codigo: 4200953 });
  assert.equal(previsao.linhas.length, 2);
  assert.equal(JSON.stringify(previsao).includes('-23'), false);
  assert.deepEqual(caminhos.slice(1), ['/Parada/Buscar?termosBusca=Rua%20Fict%C3%ADcia', '/Previsao/Parada?codigoParada=4200953']);
});

teste('consultarOnibus: aceita as respostas de ponto e previsão da função', async () => {
  const f = (async () => new Response(JSON.stringify({ ok: true, acao: 'paradas', paradas: [] }))) as typeof fetch;
  assert.equal((await consultarOnibus({ acao: 'paradas', termo: 'Paulista' }, { url: 'https://p.invalid', chave: 'k', fetch: f })).ok, true);
  const ruim = (async () => new Response(JSON.stringify({ ok: true, acao: 'previsao' }))) as typeof fetch;
  assert.equal(((await consultarOnibus({ acao: 'previsao', codigo: 1 }, { url: 'https://p.invalid', chave: 'k', fetch: ruim })) as { erro: string }).erro, 'api_fora');
});

// ---------- modo exemplo ----------

const DADOS = JSON.parse(readFileSync(fileURLToPath(new URL('../data/embarque-exemplo.json', import.meta.url)), 'utf8')) as DadosExemplo;

teste('exemplo: pontos fictícios válidos e com a palavra EXEMPLO', () => {
  assert.deepEqual(validarExemplo(DADOS), []);
  const ruim = structuredClone(DADOS);
  ruim.paradas[0].nome = 'AV PAULISTA';
  assert.ok(validarExemplo(ruim).some((e) => e.includes('nome')));
});

teste('exemplo: busca de ponto e previsão com horários relativos a agora', () => {
  const p = consultarExemplo({ acao: 'paradas', termo: 'central' }, DADOS, AGORA);
  assert.ok(p.ok && p.acao === 'paradas' && p.paradas[0].codigo === 900101);
  const r = consultarExemplo({ acao: 'previsao', codigo: 900101 }, DADOS, AGORA);
  assert.ok(r.ok && r.acao === 'previsao');
  const resumo = resumirPonto(r.linhas, r.horaReferencia!);
  assert.equal(frasePonto(resumo), 'Próximo acessível: EX01-10, em 14 min. Antes dele passam 2 ônibus sem acessibilidade.');
  assert.equal((consultarExemplo({ acao: 'previsao', codigo: 900103 }, DADOS, AGORA) as { erro: string }).erro, 'sem_veiculos');
  assert.equal((consultarExemplo({ acao: 'paradas', termo: 'paulista' }, DADOS, AGORA) as { erro: string }).erro, 'linha_inexistente');
});
