// Embarque Garantido: regras puras, sem rede e sem dependências.
// Usado igual pela Edge Function `onibus` (Deno), pelo app (Vite) e pelos testes (Vitest).
// O que cada campo da API significa está em data/README.md ("API Olho Vivo: o que foi confirmado").

export const OLHO_VIVO_BASE = 'https://api.olhovivo.sptrans.com.br/v2.1';
/** Dia em que a documentação da API foi conferida (data/README.md). */
export const DOC_CONFERIDA_EM = '2026-11-05';
export const FONTE_OLHO_VIVO = 'https://www.sptrans.com.br/desenvolvedores/api-do-olho-vivo-guia-de-referencia/documentacao-api/';

/** Posição capturada há mais que isso conta como desatualizada. */
export const LIMITE_DESATUALIZADO_MS = 2 * 60 * 1000;

export const SELO_TEMPO_REAL =
  'Dado em tempo real da SPTrans. Pode mudar a qualquer momento e não garante que o próximo ônibus seja acessível.';

// ---------- entrada ----------

export type ResultadoTermo = { ok: true; termo: string } | { ok: false; mensagem: string };

/** Número ou nome da linha: só letras, números e hífen, de 1 a 10 caracteres (validado também no servidor). */
export function validarTermoLinha(entrada: unknown): ResultadoTermo {
  const termo = typeof entrada === 'string' ? entrada.trim() : '';
  if (!termo) return { ok: false, mensagem: 'Digite o número ou o nome da linha. Por exemplo: 8000 ou Lapa.' };
  if (termo.length > 10) return { ok: false, mensagem: 'Use até 10 caracteres. Por exemplo: 8000-10.' };
  if (!/^[\p{L}\p{N}-]+$/u.test(termo)) {
    return { ok: false, mensagem: 'Use só letras, números e hífen, sem espaço. Por exemplo: 8000 ou Lapa.' };
  }
  return { ok: true, termo };
}

/** Código da linha (`cl`) recebido do app: inteiro positivo. */
export function validarCodigoLinha(entrada: unknown): number | null {
  const n = typeof entrada === 'number' ? entrada : typeof entrada === 'string' && /^\d{1,9}$/.test(entrada) ? Number(entrada) : NaN;
  return Number.isInteger(n) && n > 0 && n < 1e9 ? n : null;
}

// ---------- contrato entre a Edge Function e o app ----------

export interface Linha {
  /** `cl`: código único da linha por sentido. */
  codigo: number;
  /** `lt` + `tl`, como no letreiro (ex.: "8000-10"). */
  letreiro: string;
  /** `sl`: 1 = Terminal Principal → Secundário, 2 = Secundário → Principal. */
  sentido: 1 | 2;
  /** Texto do sentido montado com `tp` e `ts`. */
  descricao: string;
  circular: boolean;
}

export interface Veiculo {
  /** `p`: prefixo do veículo (texto; a documentação diverge entre número e texto). */
  prefixo: string;
  /** `a`: "acessível para pessoas com deficiência" segundo a SPTrans. */
  acessivel: boolean;
  /** `ta`: horário UTC em que a posição foi capturada (ISO 8601). */
  capturadoEm: string;
}

export type Falha = 'termo_invalido' | 'linha_inexistente' | 'sem_veiculos' | 'limite' | 'tempo_esgotado' | 'api_fora';

export type RespostaOnibus =
  | { ok: true; acao: 'linhas'; linhas: Linha[] }
  | { ok: true; acao: 'veiculos'; codigo: number; horaReferencia: string | null; veiculos: Veiculo[]; consultadoEm: string }
  | { ok: false; erro: Falha; mensagem: string };

export const MENSAGENS_FALHA: Record<Falha, string> = {
  termo_invalido: 'Use só letras, números e hífen, de 1 a 10 caracteres. Por exemplo: 8000 ou Lapa.',
  linha_inexistente: 'Não encontrei essa linha na SPTrans. Confira o número no ponto ou no letreiro do ônibus.',
  sem_veiculos: 'A SPTrans não mostra nenhum ônibus dessa linha em operação agora.',
  limite: 'Muitas consultas em pouco tempo. Espere um minuto e tente de novo.',
  tempo_esgotado: 'A SPTrans demorou demais para responder. Tente de novo em instantes.',
  api_fora: 'Não consegui falar com a SPTrans agora. Tente de novo mais tarde ou use os canais da SPTrans.'
};

export function falha(erro: Falha): RespostaOnibus {
  return { ok: false, erro, mensagem: MENSAGENS_FALHA[erro] };
}

/**
 * Status HTTP da API (ou falha de rede / tempo) → falha mostrada à pessoa.
 * A documentação não lista códigos de erro: 429 vira "limite", 401/403 (token ou sessão) e o resto viram "fora do ar".
 */
export function falhaDoStatus(status: number | 'tempo' | 'rede'): Falha {
  if (status === 'tempo') return 'tempo_esgotado';
  if (status === 429) return 'limite';
  return 'api_fora';
}

// ---------- leitura das respostas da API ----------

const objeto = (v: unknown): v is Record<string, unknown> => !!v && typeof v === 'object' && !Array.isArray(v);

/** `GET /Linha/Buscar`: lista de linhas. Itens fora do formato são descartados; nada válido = linha inexistente. */
export function lerBuscaLinhas(json: unknown): RespostaOnibus {
  if (!Array.isArray(json)) return falha('api_fora');
  const linhas: Linha[] = [];
  for (const item of json) {
    if (!objeto(item)) continue;
    const { cl, lc, lt, tl, sl, tp, ts } = item;
    if (typeof cl !== 'number' || !Number.isInteger(cl) || typeof lt !== 'string' || (sl !== 1 && sl !== 2)) continue;
    const ida = typeof tp === 'string' ? tp.trim() : '';
    const volta = typeof ts === 'string' ? ts.trim() : '';
    linhas.push({
      codigo: cl,
      letreiro: typeof tl === 'number' ? `${lt}-${tl}` : lt,
      sentido: sl,
      descricao: ida && volta ? (sl === 1 ? `${ida} → ${volta}` : `${volta} → ${ida}`) : ida || volta,
      circular: lc === true
    });
  }
  return linhas.length ? { ok: true, acao: 'linhas', linhas: linhas.slice(0, 20) } : falha('linha_inexistente');
}

/**
 * `GET /Posicao/Linha`: veículos da linha. Latitude e longitude (`py`, `px`) são descartadas aqui:
 * o app não precisa da posição e nada de localização sai do servidor.
 */
export function lerPosicaoLinha(json: unknown, codigo: number, agora: Date): RespostaOnibus {
  if (!objeto(json)) return falha('api_fora');
  const vs = Array.isArray(json.vs) ? json.vs : null;
  if (!vs) return falha('api_fora');
  const veiculos: Veiculo[] = [];
  for (const v of vs) {
    if (!objeto(v)) continue;
    const prefixo = typeof v.p === 'number' || typeof v.p === 'string' ? String(v.p).trim() : '';
    const capturado = typeof v.ta === 'string' ? new Date(v.ta) : null;
    if (!/^[A-Za-z0-9-]{1,12}$/.test(prefixo) || typeof v.a !== 'boolean' || !capturado || Number.isNaN(capturado.getTime())) continue;
    veiculos.push({ prefixo, acessivel: v.a, capturadoEm: capturado.toISOString() });
  }
  if (!veiculos.length) return falha('sem_veiculos');
  const hr = typeof json.hr === 'string' && /^\d{2}:\d{2}$/.test(json.hr) ? json.hr : null;
  return { ok: true, acao: 'veiculos', codigo, horaReferencia: hr, veiculos, consultadoEm: agora.toISOString() };
}

// ---------- resumo para a tela ----------

export interface ResumoVeiculos {
  total: number;
  acessiveis: number;
  /** Posição mais recente entre os veículos. */
  ultimaPosicao: Date;
  /** A posição mais recente tem mais de 2 minutos. */
  desatualizado: boolean;
  /** Veículos acessíveis primeiro, depois por prefixo; cada um diz se a própria posição está velha. */
  lista: (Veiculo & { desatualizado: boolean })[];
}

export function resumirVeiculos(veiculos: Veiculo[], agora: Date): ResumoVeiculos | null {
  if (!veiculos.length) return null;
  const velho = (v: Veiculo) => agora.getTime() - new Date(v.capturadoEm).getTime() > LIMITE_DESATUALIZADO_MS;
  const ultima = new Date(Math.max(...veiculos.map((v) => new Date(v.capturadoEm).getTime())));
  return {
    total: veiculos.length,
    acessiveis: veiculos.filter((v) => v.acessivel).length,
    ultimaPosicao: ultima,
    desatualizado: agora.getTime() - ultima.getTime() > LIMITE_DESATUALIZADO_MS,
    lista: [...veiculos]
      .sort((a, b) => Number(b.acessivel) - Number(a.acessivel) || a.prefixo.localeCompare(b.prefixo, 'pt-BR', { numeric: true }))
      .map((v) => ({ ...v, desatualizado: velho(v) }))
  };
}

/** "3 de 5 veículos em operação são acessíveis.", com singular, plural e "nenhum" certos. */
export function fraseResumo(r: Pick<ResumoVeiculos, 'total' | 'acessiveis'>): string {
  if (r.total === 1) return r.acessiveis ? 'O único veículo em operação é acessível.' : 'O único veículo em operação não é acessível.';
  if (r.acessiveis === 0) return `Nenhum dos ${r.total} veículos em operação é acessível.`;
  return `${r.acessiveis} de ${r.total} veículos em operação ${r.acessiveis === 1 ? 'é acessível' : 'são acessíveis'}.`;
}
