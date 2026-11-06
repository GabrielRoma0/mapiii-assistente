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

// ---------- Embarque por ponto (guia v2): próximo ônibus acessível com previsão de chegada ----------
// Endpoints conferidos na documentação v2.1 em 06/11/2026 (data/README.md):
//   GET /Parada/Buscar?termosBusca=   → [{ cp, np, ed, py, px }]
//   GET /Previsao/Parada?codigoParada= → { hr, p: { cp, np, py, px, l: [{ c, cl, sl, lt0, lt1, qv, vs: [{ p, t, a, ta, py, px }] }] } }
// Latitude e longitude (da parada e dos veículos) são descartadas: o app não precisa delas.

/** Nome do ponto ou da rua: letras, números, espaço, ponto, barra e hífen, de 2 a 40 caracteres. */
export function validarTermoParada(entrada: unknown): ResultadoTermo {
  const termo = typeof entrada === 'string' ? entrada.trim().replace(/\s+/g, ' ') : '';
  if (termo.length < 2) return { ok: false, mensagem: 'Digite o nome do ponto ou da rua. Por exemplo: Paulista ou Afonso Braz.' };
  if (termo.length > 40) return { ok: false, mensagem: 'Use até 40 caracteres. Por exemplo: Avenida Paulista.' };
  if (!/^[\p{L}\p{N} ./-]+$/u.test(termo)) return { ok: false, mensagem: 'Use só letras, números, espaço e hífen. Por exemplo: Paulista.' };
  return { ok: true, termo };
}

export interface Parada {
  /** `cp`: código da parada. */
  codigo: number;
  /** `np`: nome da parada. */
  nome: string;
  /** `ed`: endereço de localização da parada (pode vir vazio). */
  endereco: string;
}

export interface ChegadaVeiculo {
  prefixo: string;
  acessivel: boolean;
  /** `t`: horário previsto de chegada no ponto (HH:MM, no mesmo relógio do `hr`). */
  previsto: string;
}

export interface LinhaNoPonto {
  /** `cl` */
  codigo: number;
  /** `c`: letreiro completo (ex.: "675K-10"). */
  letreiro: string;
  /** `sl` */
  sentido: 1 | 2;
  /** `lt0`: letreiro de destino. */
  destino: string;
  veiculos: ChegadaVeiculo[];
}

export type RespostaPonto =
  | { ok: true; acao: 'paradas'; paradas: Parada[] }
  | { ok: true; acao: 'previsao'; parada: { codigo: number; nome: string }; horaReferencia: string | null; linhas: LinhaNoPonto[]; consultadoEm: string }
  | { ok: false; erro: Falha; mensagem: string };

export const MENSAGEM_PARADA_INEXISTENTE = 'Não encontrei esse ponto na SPTrans. Tente outro nome, como o da rua ou da avenida.';
export const MENSAGEM_SEM_PREVISAO = 'A SPTrans não mostra nenhum ônibus chegando a este ponto agora.';

const HHMM = /^([01]\d|2[0-3]):[0-5]\d$/;

/** `GET /Parada/Buscar`: só código, nome e endereço. Nada válido = parada inexistente. */
export function lerBuscaParadas(json: unknown): RespostaPonto {
  if (!Array.isArray(json)) return { ok: false, erro: 'api_fora', mensagem: MENSAGENS_FALHA.api_fora };
  const paradas: Parada[] = [];
  for (const item of json) {
    if (!objeto(item)) continue;
    const { cp, np, ed } = item;
    if (typeof cp !== 'number' || !Number.isInteger(cp) || cp <= 0 || typeof np !== 'string' || !np.trim()) continue;
    paradas.push({ codigo: cp, nome: np.trim(), endereco: typeof ed === 'string' ? ed.trim() : '' });
  }
  return paradas.length
    ? { ok: true, acao: 'paradas', paradas: paradas.slice(0, 20) }
    : { ok: false, erro: 'linha_inexistente', mensagem: MENSAGEM_PARADA_INEXISTENTE };
}

/** `GET /Previsao/Parada`: linhas do ponto e veículos com horário previsto. Sem veículos = "sem veículos". */
export function lerPrevisaoParada(json: unknown, codigo: number, agora: Date): RespostaPonto {
  if (!objeto(json) || !objeto(json.p)) return { ok: false, erro: 'api_fora', mensagem: MENSAGENS_FALHA.api_fora };
  const p = json.p;
  const ls = Array.isArray(p.l) ? p.l : [];
  const linhas: LinhaNoPonto[] = [];
  for (const l of ls) {
    if (!objeto(l)) continue;
    const { c, cl, sl, lt0, vs } = l;
    if (typeof cl !== 'number' || !Number.isInteger(cl) || typeof c !== 'string' || (sl !== 1 && sl !== 2) || !Array.isArray(vs)) continue;
    const veiculos: ChegadaVeiculo[] = [];
    for (const v of vs) {
      if (!objeto(v)) continue;
      const prefixo = typeof v.p === 'number' || typeof v.p === 'string' ? String(v.p).trim() : '';
      if (!/^[A-Za-z0-9-]{1,12}$/.test(prefixo) || typeof v.a !== 'boolean' || typeof v.t !== 'string' || !HHMM.test(v.t)) continue;
      veiculos.push({ prefixo, acessivel: v.a, previsto: v.t });
    }
    if (veiculos.length) linhas.push({ codigo: cl, letreiro: c.trim(), sentido: sl, destino: typeof lt0 === 'string' ? lt0.trim() : '', veiculos });
  }
  if (!linhas.length) return { ok: false, erro: 'sem_veiculos', mensagem: MENSAGEM_SEM_PREVISAO };
  const hr = typeof json.hr === 'string' && HHMM.test(json.hr) ? json.hr : null;
  const nome = typeof p.np === 'string' ? p.np.trim() : '';
  return { ok: true, acao: 'previsao', parada: { codigo, nome }, horaReferencia: hr, linhas, consultadoEm: agora.toISOString() };
}

const minutosDoDia = (hhmm: string) => Number(hhmm.slice(0, 2)) * 60 + Number(hhmm.slice(3, 5));

/** Hora atual em São Paulo (HH:MM), para quando a API não mandar o `hr`. */
export function horaSP(agora: Date): string {
  return new Intl.DateTimeFormat('pt-BR', { hour: '2-digit', minute: '2-digit', hour12: false, timeZone: 'America/Sao_Paulo' }).format(agora);
}

/**
 * Minutos entre a hora de referência e a chegada prevista, no mesmo relógio (não depende de fuso).
 * Passa da meia-noite: 23:58 → 00:03 dá 5. Previsão um pouco no passado (até 60 min) vira 0.
 */
export function minutosAte(referencia: string, previsto: string): number {
  let d = minutosDoDia(previsto) - minutosDoDia(referencia);
  if (d < -60) d += 24 * 60;
  return Math.max(0, d);
}

export interface Chegada extends ChegadaVeiculo {
  letreiro: string;
  destino: string;
  minutos: number;
}

export interface ResumoPonto {
  /** Todas as chegadas, da mais próxima para a mais distante. */
  chegadas: Chegada[];
  /** Primeira chegada acessível, ou null. */
  proximaAcessivel: Chegada | null;
  /** Quantos ônibus sem acessibilidade chegam antes do primeiro acessível (ou no total, se não houver acessível). */
  naoAcessiveisAntes: number;
}

export function resumirPonto(linhas: LinhaNoPonto[], referencia: string): ResumoPonto {
  const chegadas = linhas
    .flatMap((l) => l.veiculos.map((v) => ({ ...v, letreiro: l.letreiro, destino: l.destino, minutos: minutosAte(referencia, v.previsto) })))
    .sort((a, b) => a.minutos - b.minutos || Number(b.acessivel) - Number(a.acessivel) || a.letreiro.localeCompare(b.letreiro, 'pt-BR'));
  const i = chegadas.findIndex((c) => c.acessivel);
  return { chegadas, proximaAcessivel: i >= 0 ? chegadas[i] : null, naoAcessiveisAntes: i >= 0 ? i : chegadas.length };
}

export const emMinutos = (m: number) => (m === 0 ? 'chegando agora' : m === 1 ? 'em 1 min' : `em ${m} min`);

/** Frase principal da tela, com singular, plural e "nenhum" certos. */
export function frasePonto(r: ResumoPonto): string {
  if (!r.chegadas.length) return MENSAGEM_SEM_PREVISAO;
  if (!r.proximaAcessivel) {
    return r.chegadas.length === 1 ? 'O único ônibus previsto não é acessível.' : `Nenhum dos ${r.chegadas.length} ônibus previstos é acessível.`;
  }
  const p = r.proximaAcessivel;
  const antes = r.naoAcessiveisAntes;
  const complemento = antes === 0 ? '' : antes === 1 ? ' Antes dele passa 1 ônibus sem acessibilidade.' : ` Antes dele passam ${antes} ônibus sem acessibilidade.`;
  return `Próximo acessível: ${p.letreiro}, ${emMinutos(p.minutos)}.${complemento}`;
}

// ---------- Embarque ao vivo (fase C do plano de melhorias) ----------

const chaveDo = (c: Chegada) => `${c.letreiro}|${c.prefixo}`;

/** O próximo ônibus acessível passou a ser outro (ou apareceu, ou sumiu)? Só aí o leitor de tela é avisado. */
export function mudouOProximo(antes: ResumoPonto | null, depois: ResumoPonto): boolean {
  const a = antes?.proximaAcessivel;
  const d = depois.proximaAcessivel;
  if (!a || !d) return Boolean(a) !== Boolean(d) || !antes;
  return chaveDo(a) !== chaveDo(d);
}

/**
 * Aviso de chegada (falado e com vibração): quando o próximo acessível está a `limite` minutos ou menos.
 * Uma vez por ônibus: devolve a chave para a tela lembrar que já avisou.
 */
export function deveAvisar(r: ResumoPonto, avisado: string | null, limite = 2): { chave: string; frase: string } | null {
  const p = r.proximaAcessivel;
  if (!p || p.minutos > limite) return null;
  const chave = chaveDo(p);
  if (chave === avisado) return null;
  const frase = p.minutos === 0 ? `O ônibus ${p.letreiro} acessível está chegando agora.` : `O ônibus ${p.letreiro} acessível chega ${emMinutos(p.minutos)}.`;
  return { chave, frase };
}
