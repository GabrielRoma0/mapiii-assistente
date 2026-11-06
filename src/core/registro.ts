// Registro local anônimo das perguntas livres (localStorage deste aparelho, sem rede).
// Cada linha tem só quatro campos: tema, se achou resposta, segundos até a resposta e o voto "ajudou?".
// Sem texto da pergunta, sem identificador, sem data. Recusas (emergência, dado pessoal, conselho) não entram.
import type { Entrada } from './kb-schema.ts';

export interface Registro {
  tema: string;
  achou: boolean;
  segundos: number;
  /** null = não votou. */
  ajudou: boolean | null;
}

/** Armazenamento mínimo (localStorage tem esse formato; os testes usam um falso). */
export interface Armazenamento {
  getItem(chave: string): string | null;
  setItem(chave: string, valor: string): void;
  removeItem(chave: string): void;
}

export const CHAVE_REGISTRO = 'mapiii.registro.v1';
export const MAX_REGISTROS = 1000;
export const TEMA_SEM_RESPOSTA = 'sem_resposta';
export const TEMA_FORA_DO_TEMA = 'fora_do_tema';

/**
 * Tema de uma entrada da base: o primeiro objetivo (p_objetivo) que as condições aceitam,
 * para agrupar como na triagem. Sem objetivo, usa o tipo (direito, servico, norma).
 */
export function temaDaEntrada(e: Pick<Entrada, 'tipo' | 'condicoes'>): string {
  const regras = [...(e.condicoes?.todas ?? []), ...(e.condicoes?.alguma ?? [])];
  return regras.find((r) => r.campo === 'p_objetivo')?.em[0] ?? e.tipo;
}

const ehRegistro = (r: unknown): r is Registro => {
  if (!r || typeof r !== 'object') return false;
  const o = r as Record<string, unknown>;
  return (
    typeof o.tema === 'string' &&
    /^[a-z0-9_-]{1,60}$/.test(o.tema) &&
    typeof o.achou === 'boolean' &&
    typeof o.segundos === 'number' &&
    Number.isFinite(o.segundos) &&
    o.segundos >= 0 &&
    (o.ajudou === null || typeof o.ajudou === 'boolean') &&
    Object.keys(o).length === 4
  );
};

/** Lê os registros. Se o armazenamento estiver bloqueado ou corrompido, devolve lista vazia sem quebrar. */
export function lerRegistros(arm: Armazenamento | null): Registro[] {
  if (!arm) return [];
  try {
    const dados = JSON.parse(arm.getItem(CHAVE_REGISTRO) ?? '[]');
    return Array.isArray(dados) ? dados.filter(ehRegistro) : [];
  } catch {
    return [];
  }
}

function gravar(arm: Armazenamento | null, registros: Registro[]): boolean {
  if (!arm) return false;
  try {
    arm.setItem(CHAVE_REGISTRO, JSON.stringify(registros.slice(-MAX_REGISTROS)));
    return true;
  } catch {
    return false;
  }
}

/**
 * Acrescenta um registro e devolve a posição dele (para gravar o voto depois), ou null se não deu para gravar.
 * Só os quatro campos são copiados: nada mais entra, mesmo que venha no objeto.
 */
export function registrar(arm: Armazenamento | null, r: Omit<Registro, 'ajudou'>): number | null {
  const novo: Registro = { tema: r.tema, achou: r.achou, segundos: Math.round(Math.max(0, r.segundos) * 10) / 10, ajudou: null };
  if (!ehRegistro(novo)) return null;
  const lista = [...lerRegistros(arm), novo].slice(-MAX_REGISTROS);
  return gravar(arm, lista) ? lista.length - 1 : null;
}

export function registrarVoto(arm: Armazenamento | null, posicao: number, ajudou: boolean): boolean {
  const lista = lerRegistros(arm);
  if (!Number.isInteger(posicao) || posicao < 0 || posicao >= lista.length) return false;
  lista[posicao] = { ...lista[posicao], ajudou };
  return gravar(arm, lista);
}

export function apagarRegistros(arm: Armazenamento | null): void {
  try {
    arm?.removeItem(CHAVE_REGISTRO);
  } catch {
    /* armazenamento bloqueado: nada a apagar */
  }
}

// ---------- números ----------

export interface Resumo {
  total: number;
  achou: number;
  /** 0 a 1; null sem registros. */
  taxaAchou: number | null;
  mediaSegundos: number | null;
  medianaSegundos: number | null;
  votosSim: number;
  votosNao: number;
  semVoto: number;
  /** Entre quem votou; null sem votos. */
  taxaAjudou: number | null;
}

export function resumir(registros: Registro[]): Resumo {
  const total = registros.length;
  const achou = registros.filter((r) => r.achou).length;
  const tempos = registros.map((r) => r.segundos).sort((a, b) => a - b);
  const meio = Math.floor(tempos.length / 2);
  const mediana = !tempos.length ? null : tempos.length % 2 ? tempos[meio] : (tempos[meio - 1] + tempos[meio]) / 2;
  const votosSim = registros.filter((r) => r.ajudou === true).length;
  const votosNao = registros.filter((r) => r.ajudou === false).length;
  const arred = (v: number) => Math.round(v * 10) / 10;
  return {
    total,
    achou,
    taxaAchou: total ? achou / total : null,
    mediaSegundos: total ? arred(tempos.reduce((s, t) => s + t, 0) / total) : null,
    medianaSegundos: mediana === null ? null : arred(mediana),
    votosSim,
    votosNao,
    semVoto: total - votosSim - votosNao,
    taxaAjudou: votosSim + votosNao ? votosSim / (votosSim + votosNao) : null
  };
}

/** Resumo por tema, do mais buscado para o menos (empate em ordem alfabética). */
export function resumirPorTema(registros: Registro[]): { tema: string; resumo: Resumo }[] {
  const grupos = new Map<string, Registro[]>();
  for (const r of registros) grupos.set(r.tema, [...(grupos.get(r.tema) ?? []), r]);
  return [...grupos.entries()]
    .map(([tema, lista]) => ({ tema, resumo: resumir(lista) }))
    .sort((a, b) => b.resumo.total - a.resumo.total || a.tema.localeCompare(b.tema));
}

/** CSV com uma linha por busca. Separador vírgula, decimal com ponto, voto como sim/nao/vazio. */
export function paraCsv(registros: Registro[]): string {
  const celula = (v: string) => (/[",\n]/.test(v) ? `"${v.replace(/"/g, '""')}"` : v);
  const linhas = registros.map((r) =>
    [celula(r.tema), r.achou ? 'sim' : 'nao', String(r.segundos), r.ajudou === null ? '' : r.ajudou ? 'sim' : 'nao'].join(',')
  );
  return ['tema,achou_resposta,segundos_ate_resposta,ajudou', ...linhas].join('\n') + '\n';
}

/** localStorage do navegador, ou null se não existir ou estiver bloqueado (modo privado, Node). */
export function armazenamentoDoNavegador(): Armazenamento | null {
  try {
    const ls = globalThis.localStorage;
    if (!ls) return null;
    const teste = '__mapiii_teste__';
    ls.setItem(teste, '1');
    ls.removeItem(teste);
    return ls;
  } catch {
    return null;
  }
}

// ---------- Embarque garantido (Fase 3, só com a flag EMBARQUE_ATIVO) ----------
// Indicador "tempo até achar o ônibus certo": do abrir a tela do Embarque até ver o resumo de veículos.
// Cada linha tem só três campos: modo (real ou exemplo), segundos e achou. Sem identificador, sem data.

export interface RegistroEmbarque {
  modo: 'real' | 'exemplo';
  segundos: number;
  achou: boolean;
}

export const CHAVE_REGISTRO_EMBARQUE = 'mapiii.embarque.v1';

const ehRegistroEmbarque = (r: unknown): r is RegistroEmbarque => {
  if (!r || typeof r !== 'object') return false;
  const o = r as Record<string, unknown>;
  return (
    (o.modo === 'real' || o.modo === 'exemplo') &&
    typeof o.segundos === 'number' &&
    Number.isFinite(o.segundos) &&
    o.segundos >= 0 &&
    typeof o.achou === 'boolean' &&
    Object.keys(o).length === 3
  );
};

export function lerRegistrosEmbarque(arm: Armazenamento | null): RegistroEmbarque[] {
  if (!arm) return [];
  try {
    const dados = JSON.parse(arm.getItem(CHAVE_REGISTRO_EMBARQUE) ?? '[]');
    return Array.isArray(dados) ? dados.filter(ehRegistroEmbarque) : [];
  } catch {
    return [];
  }
}

/** Acrescenta uma medição. Só os três campos entram, mesmo que venha mais coisa no objeto. */
export function registrarEmbarque(arm: Armazenamento | null, r: RegistroEmbarque): boolean {
  const novo: RegistroEmbarque = { modo: r.modo, segundos: Math.round(Math.max(0, r.segundos) * 10) / 10, achou: r.achou };
  if (!arm || !ehRegistroEmbarque(novo)) return false;
  try {
    arm.setItem(CHAVE_REGISTRO_EMBARQUE, JSON.stringify([...lerRegistrosEmbarque(arm), novo].slice(-MAX_REGISTROS)));
    return true;
  } catch {
    return false;
  }
}

export function apagarRegistrosEmbarque(arm: Armazenamento | null): void {
  try {
    arm?.removeItem(CHAVE_REGISTRO_EMBARQUE);
  } catch {
    /* armazenamento bloqueado */
  }
}

export interface ResumoEmbarque {
  tentativas: number;
  achou: number;
  taxaAchou: number | null;
  /** Só das tentativas em que a pessoa achou o resumo da linha. */
  medianaSegundos: number | null;
  mediaSegundos: number | null;
}

/** Números por modo. O tempo considera só quem chegou ao resumo: quem desistiu entra só na taxa. */
export function resumirEmbarque(registros: RegistroEmbarque[]): Record<'real' | 'exemplo', ResumoEmbarque> {
  const arred = (v: number) => Math.round(v * 10) / 10;
  const porModo = (modo: 'real' | 'exemplo'): ResumoEmbarque => {
    const lista = registros.filter((r) => r.modo === modo);
    const tempos = lista.filter((r) => r.achou).map((r) => r.segundos).sort((a, b) => a - b);
    const meio = Math.floor(tempos.length / 2);
    return {
      tentativas: lista.length,
      achou: tempos.length,
      taxaAchou: lista.length ? tempos.length / lista.length : null,
      medianaSegundos: !tempos.length ? null : arred(tempos.length % 2 ? tempos[meio] : (tempos[meio - 1] + tempos[meio]) / 2),
      mediaSegundos: tempos.length ? arred(tempos.reduce((s, t) => s + t, 0) / tempos.length) : null
    };
  };
  return { real: porModo('real'), exemplo: porModo('exemplo') };
}

export function paraCsvEmbarque(registros: RegistroEmbarque[]): string {
  return ['modo,segundos_ate_resumo,achou', ...registros.map((r) => `${r.modo},${r.segundos},${r.achou ? 'sim' : 'nao'}`)].join('\n') + '\n';
}
