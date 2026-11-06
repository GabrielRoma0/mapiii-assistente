// Chamada do app à Edge Function `onibus`. O app nunca fala direto com a SPTrans nem conhece o token.
import { MENSAGENS_FALHA, type RespostaOnibus } from '../../../supabase/functions/_shared/embarque';

export type PedidoOnibus = { acao: 'linhas'; termo: string } | { acao: 'veiculos'; codigo: number };
export type RespostaCliente = RespostaOnibus | { ok: false; erro: 'nao_configurado'; mensagem: string };

export const MENSAGEM_NAO_CONFIGURADO =
  'A consulta em tempo real ainda não está configurada neste app. Use o exemplo ou os canais da SPTrans.';

export interface ConfigCliente {
  url: string;
  chave: string;
  fetch?: typeof fetch;
  tempoLimiteMs?: number;
}

const ERROS = new Set(Object.keys(MENSAGENS_FALHA));

/** Confere o formato da resposta: se a função devolver algo estranho, é tratado como "SPTrans fora do ar". */
function respostaValida(r: unknown): r is RespostaOnibus {
  if (!r || typeof r !== 'object') return false;
  const o = r as Record<string, unknown>;
  if (o.ok === false) return typeof o.erro === 'string' && ERROS.has(o.erro) && typeof o.mensagem === 'string';
  if (o.ok !== true) return false;
  if (o.acao === 'linhas') return Array.isArray(o.linhas);
  if (o.acao === 'veiculos') return Array.isArray(o.veiculos) && typeof o.consultadoEm === 'string';
  return false;
}

export async function consultarOnibus(pedido: PedidoOnibus, cfg: ConfigCliente): Promise<RespostaCliente> {
  if (!cfg.url || !cfg.chave) return { ok: false, erro: 'nao_configurado', mensagem: MENSAGEM_NAO_CONFIGURADO };
  const controle = new AbortController();
  // Um pouco acima dos 6 s da função, para a mensagem dela chegar antes.
  const relogio = setTimeout(() => controle.abort(), cfg.tempoLimiteMs ?? 8000);
  try {
    const res = await (cfg.fetch ?? fetch)(`${cfg.url}/functions/v1/onibus`, {
      method: 'POST',
      headers: { 'content-type': 'application/json', apikey: cfg.chave, authorization: `Bearer ${cfg.chave}` },
      body: JSON.stringify(pedido),
      signal: controle.signal
    });
    const corpo: unknown = await res.json().catch(() => null);
    if (respostaValida(corpo)) return corpo;
    return { ok: false, erro: res.status === 429 ? 'limite' : 'api_fora', mensagem: MENSAGENS_FALHA[res.status === 429 ? 'limite' : 'api_fora'] };
  } catch {
    const erro = controle.signal.aborted ? 'tempo_esgotado' : 'api_fora';
    return { ok: false, erro, mensagem: MENSAGENS_FALHA[erro] };
  } finally {
    clearTimeout(relogio);
  }
}
