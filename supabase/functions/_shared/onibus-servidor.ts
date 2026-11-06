// Lógica da Edge Function `onibus`, separada do Deno para ser testada no Node com a API simulada.
// O index.ts só lê o ambiente e chama `criarServico`.
//
// Regras:
// - Só quatro ações: "linhas" (buscar linha), "veiculos" (veículos de uma linha), "paradas" (buscar ponto)
//   e "previsao" (chegadas previstas num ponto). Nenhuma URL vem do app.
// - O token da SPTrans (SPTRANS_TOKEN) só existe aqui. Nunca vai na resposta nem nos logs.
// - Login reaproveitado entre pedidos; se a API recusar a sessão (401/403), faz login de novo uma vez.
// - Cache de 15 s por linha e por busca, limite de pedidos por minuto por IP, tempo limite de 6 s por chamada.
// - Não registra IP nem termo buscado. O IP vira um hash com sal aleatório, só em memória, só para o limite.
import {
  OLHO_VIVO_BASE,
  falha,
  falhaDoStatus,
  lerBuscaLinhas,
  lerBuscaParadas,
  lerPosicaoLinha,
  lerPrevisaoParada,
  validarCodigoLinha,
  validarTermoLinha,
  validarTermoParada,
  type Falha,
  type RespostaOnibus,
  type RespostaPonto
} from './embarque.ts';

/** O que a função devolve: as respostas por linha e as por ponto. */
export type RespostaServico = RespostaOnibus | RespostaPonto;

export interface Dependencias {
  fetch: typeof fetch;
  token: string | undefined;
  /** Relógio em ms (injetado nos testes). */
  agora?: () => number;
  base?: string;
  tempoLimiteMs?: number;
  cacheMs?: number;
  limitePorMinuto?: number;
  /** Origens que podem chamar a função; ["*"] libera todas. */
  origens?: string[];
  /** Log sem dados pessoais: só códigos de situação. */
  log?: (mensagem: string) => void;
}

const MAX_CORPO = 1024;

type Corpo = { acao: 'linhas'; termo: string } | { acao: 'veiculos'; codigo: number } | { acao: 'paradas'; termo: string } | { acao: 'previsao'; codigo: number };

/** Lê o corpo do pedido aceitando só as quatro ações e as chaves esperadas. */
export function lerPedido(dados: unknown): { ok: true; pedido: Corpo } | { ok: false; resposta: RespostaServico } {
  const invalido = { ok: false as const, resposta: falha('termo_invalido') };
  if (!dados || typeof dados !== 'object' || Array.isArray(dados)) return invalido;
  const o = dados as Record<string, unknown>;
  const chaves = Object.keys(o).sort().join(',');
  if (o.acao === 'linhas' && chaves === 'acao,termo') {
    const t = validarTermoLinha(o.termo);
    return t.ok ? { ok: true, pedido: { acao: 'linhas', termo: t.termo } } : { ok: false, resposta: { ok: false, erro: 'termo_invalido', mensagem: t.mensagem } };
  }
  if (o.acao === 'veiculos' && chaves === 'acao,codigo') {
    const codigo = validarCodigoLinha(o.codigo);
    return codigo === null ? invalido : { ok: true, pedido: { acao: 'veiculos', codigo } };
  }
  if (o.acao === 'paradas' && chaves === 'acao,termo') {
    const t = validarTermoParada(o.termo);
    return t.ok ? { ok: true, pedido: { acao: 'paradas', termo: t.termo } } : { ok: false, resposta: { ok: false, erro: 'termo_invalido', mensagem: t.mensagem } };
  }
  if (o.acao === 'previsao' && chaves === 'acao,codigo') {
    const codigo = validarCodigoLinha(o.codigo);
    return codigo === null ? invalido : { ok: true, pedido: { acao: 'previsao', codigo } };
  }
  return invalido;
}

// Hash FNV-1a de 32 bits, só para não guardar o IP em memória como texto.
function hashComSal(texto: string, sal: string): string {
  let h = 0x811c9dc5;
  for (const c of sal + texto) {
    h ^= c.codePointAt(0)!;
    h = Math.imul(h, 0x01000193);
  }
  return (h >>> 0).toString(36);
}

function ipDoPedido(req: Request): string {
  return (req.headers.get('cf-connecting-ip') || req.headers.get('x-forwarded-for')?.split(',')[0] || req.headers.get('x-real-ip') || 'desconhecido').trim();
}

/** Guarda só o par nome=valor dos cookies de sessão devolvidos pelo login. */
function cookiesDaResposta(res: Response): string | null {
  const brutos = typeof res.headers.getSetCookie === 'function' ? res.headers.getSetCookie() : [res.headers.get('set-cookie') ?? ''];
  const pares = brutos.map((c) => c.split(';')[0].trim()).filter((c) => /^[^=\s]+=/.test(c));
  return pares.length ? pares.join('; ') : null;
}

class FalhaApi extends Error {
  constructor(readonly falha: Falha) {
    super(falha);
  }
}

export function criarServico(dep: Dependencias): (req: Request) => Promise<Response> {
  const agora = dep.agora ?? (() => Date.now());
  const base = dep.base ?? OLHO_VIVO_BASE;
  const tempoLimiteMs = dep.tempoLimiteMs ?? 6000;
  const cacheMs = dep.cacheMs ?? 15_000;
  const limitePorMinuto = dep.limitePorMinuto ?? 30;
  const origens = dep.origens ?? ['*'];
  const log = dep.log ?? (() => {});

  // Sal do hash de IP: novo a cada vez que a função sobe; nunca sai daqui.
  const sal = Array.from(crypto.getRandomValues(new Uint8Array(16)), (b) => b.toString(16)).join('');
  const pedidosPorIp = new Map<string, { inicio: number; total: number }>();
  const cache = new Map<string, { expira: number; resposta: RespostaServico }>();
  let sessao: string | null | undefined; // undefined = sem login; null = login sem cookie

  const cabecalhos = (req: Request): Headers => {
    const h = new Headers({ 'content-type': 'application/json; charset=utf-8', 'cache-control': 'no-store', vary: 'Origin' });
    const origem = req.headers.get('origin');
    if (origens.includes('*')) h.set('access-control-allow-origin', '*');
    else if (origem && origens.includes(origem)) h.set('access-control-allow-origin', origem);
    h.set('access-control-allow-methods', 'POST, OPTIONS');
    h.set('access-control-allow-headers', 'content-type, authorization, apikey, x-client-info');
    return h;
  };
  const responder = (req: Request, corpo: RespostaServico, status = 200) => new Response(JSON.stringify(corpo), { status, headers: cabecalhos(req) });

  const passouDoLimite = (req: Request): boolean => {
    const chave = hashComSal(ipDoPedido(req), sal);
    const t = agora();
    if (pedidosPorIp.size > 5000) for (const [k, v] of pedidosPorIp) if (t - v.inicio >= 60_000) pedidosPorIp.delete(k);
    const atual = pedidosPorIp.get(chave);
    if (!atual || t - atual.inicio >= 60_000) {
      pedidosPorIp.set(chave, { inicio: t, total: 1 });
      return false;
    }
    atual.total++;
    return atual.total > limitePorMinuto;
  };

  async function comTempoLimite(url: string, init: RequestInit): Promise<Response> {
    const controle = new AbortController();
    const relogio = setTimeout(() => controle.abort(), tempoLimiteMs);
    try {
      return await dep.fetch(url, { ...init, signal: controle.signal });
    } catch (e) {
      throw new FalhaApi(falhaDoStatus(controle.signal.aborted ? 'tempo' : 'rede'));
    } finally {
      clearTimeout(relogio);
    }
  }

  async function entrar(): Promise<void> {
    if (!dep.token) {
      log('onibus: SPTRANS_TOKEN ausente');
      throw new FalhaApi('api_fora');
    }
    const res = await comTempoLimite(`${base}/Login/Autenticar?token=${encodeURIComponent(dep.token)}`, { method: 'POST' });
    const texto = res.ok ? (await res.text()).trim() : '';
    if (texto !== 'true') {
      sessao = undefined;
      log(`onibus: login recusado (status ${res.status})`);
      throw new FalhaApi(res.status === 429 ? 'limite' : 'api_fora');
    }
    sessao = cookiesDaResposta(res);
  }

  async function consultar(caminho: string): Promise<unknown> {
    for (let tentativa = 0; tentativa < 2; tentativa++) {
      if (sessao === undefined) await entrar();
      const res = await comTempoLimite(`${base}${caminho}`, { headers: sessao ? { cookie: sessao } : {} });
      if ((res.status === 401 || res.status === 403) && tentativa === 0) {
        sessao = undefined; // sessão vencida: entra de novo uma vez
        continue;
      }
      if (!res.ok) {
        log(`onibus: API respondeu ${res.status}`);
        throw new FalhaApi(falhaDoStatus(res.status));
      }
      try {
        return await res.json();
      } catch {
        throw new FalhaApi('api_fora');
      }
    }
    throw new FalhaApi('api_fora');
  }

  async function executar(pedido: Corpo): Promise<RespostaServico> {
    const chave =
      pedido.acao === 'linhas' || pedido.acao === 'paradas' ? `${pedido.acao}:${pedido.termo.toLowerCase()}` : `${pedido.acao}:${pedido.codigo}`;
    const guardado = cache.get(chave);
    if (guardado && guardado.expira > agora()) return guardado.resposta;
    let resposta: RespostaServico;
    try {
      if (pedido.acao === 'linhas') resposta = lerBuscaLinhas(await consultar(`/Linha/Buscar?termosBusca=${encodeURIComponent(pedido.termo)}`));
      else if (pedido.acao === 'veiculos') resposta = lerPosicaoLinha(await consultar(`/Posicao/Linha?codigoLinha=${pedido.codigo}`), pedido.codigo, new Date(agora()));
      else if (pedido.acao === 'paradas') resposta = lerBuscaParadas(await consultar(`/Parada/Buscar?termosBusca=${encodeURIComponent(pedido.termo)}`));
      else resposta = lerPrevisaoParada(await consultar(`/Previsao/Parada?codigoParada=${pedido.codigo}`), pedido.codigo, new Date(agora()));
    } catch (e) {
      if (e instanceof FalhaApi) return falha(e.falha);
      log('onibus: erro inesperado');
      return falha('api_fora');
    }
    // Só guarda respostas que dizem algo sobre a linha (inclusive "sem veículos"), nunca falhas da API.
    if (resposta.ok || resposta.erro === 'linha_inexistente' || resposta.erro === 'sem_veiculos') {
      if (cache.size > 2000) cache.clear();
      cache.set(chave, { expira: agora() + cacheMs, resposta });
    }
    return resposta;
  }

  return async (req: Request): Promise<Response> => {
    if (req.method === 'OPTIONS') return new Response(null, { status: 204, headers: cabecalhos(req) });
    if (req.method !== 'POST') return responder(req, falha('termo_invalido'), 405);
    if (passouDoLimite(req)) return responder(req, falha('limite'), 429);

    const texto = await req.text();
    if (texto.length > MAX_CORPO) return responder(req, falha('termo_invalido'), 400);
    let dados: unknown;
    try {
      dados = JSON.parse(texto);
    } catch {
      return responder(req, falha('termo_invalido'), 400);
    }
    const lido = lerPedido(dados);
    if (!lido.ok) return responder(req, lido.resposta, 400);

    const resposta = await executar(lido.pedido);
    const status = resposta.ok ? 200 : resposta.erro === 'limite' ? 429 : resposta.erro === 'api_fora' || resposta.erro === 'tempo_esgotado' ? 502 : 200;
    return responder(req, resposta, status);
  };
}
