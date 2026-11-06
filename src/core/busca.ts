// Busca na base de conhecimento, sem biblioteca externa.
//
// Pontuação de cada entrada (0 a 1) = pesoPalavrasChave * cobertura + pesoSimilaridade * similaridade
//  - cobertura: parte da pergunta (ponderada por IDF) que aparece nas palavras-chave ou no título da entrada.
//    Palavras raras na base pesam mais que palavras que estão em quase todas as entradas.
//    Palavras que não existem na base entram no denominador: ruído derruba a nota.
//  - similaridade: maior Jaccard entre a pergunta e cada pergunta_exemplo da entrada.
import { CONFIG, type ConfigBusca } from './config.ts';
import { tokenizar } from './normalizar.ts';

// O mínimo que a busca precisa de uma entrada. O resto dos campos passa direto.
export interface EntradaBuscavel {
  titulo?: string;
  perguntas_exemplo?: string[];
  palavras_chave?: string[];
}

interface ItemIndice<T> {
  entrada: T;
  perguntas: string[][];
  chaves: Set<string>;
  vocabulario: Set<string>;
}

export interface Indice<T> {
  entradas: ItemIndice<T>[];
  idf: (token: string) => number;
}

export interface Pontuado<T> {
  entrada: T;
  pontuacao: number;
}

export interface ResultadoBusca<T> {
  encontrou: boolean;
  /** null quando a melhor nota fica abaixo de limiteResposta. */
  melhor: Pontuado<T> | null;
  /** "Você quis dizer?", até maxSugestoes. */
  sugestoes: Pontuado<T>[];
  /** Todas as entradas, da maior para a menor nota. */
  ranking: Pontuado<T>[];
}

export function jaccard(a: string[], b: string[]): number {
  const A = new Set(a);
  const B = new Set(b);
  if (!A.size || !B.size) return 0;
  let comum = 0;
  for (const t of A) if (B.has(t)) comum++;
  return comum / (A.size + B.size - comum);
}

// Pré-calcula os tokens de cada entrada e o IDF do vocabulário da base.
export function criarIndice<T extends EntradaBuscavel>(kb: T[]): Indice<T> {
  const entradas = kb.map((entrada) => {
    const perguntas = (entrada.perguntas_exemplo ?? []).map(tokenizar);
    const chaves = new Set([...(entrada.palavras_chave ?? []), entrada.titulo ?? ''].flatMap(tokenizar));
    const vocabulario = new Set([...chaves, ...perguntas.flat()]);
    return { entrada, perguntas, chaves, vocabulario };
  });

  const df = new Map<string, number>();
  for (const { vocabulario } of entradas) {
    for (const t of vocabulario) df.set(t, (df.get(t) ?? 0) + 1);
  }
  const n = entradas.length;
  const idf = (t: string) => Math.log(1 + n / (1 + (df.get(t) ?? 0)));

  return { entradas, idf };
}

function pontuar<T>(consulta: string[], item: ItemIndice<T>, idf: (t: string) => number, cfg: ConfigBusca): number {
  if (!consulta.length) return 0;
  let total = 0;
  let casado = 0;
  for (const t of consulta) {
    const peso = idf(t);
    total += peso;
    if (item.chaves.has(t)) casado += peso;
  }
  const cobertura = total ? casado / total : 0;
  const similaridade = Math.max(0, ...item.perguntas.map((p) => jaccard(consulta, p)));
  const nota = cfg.pesoPalavrasChave * cobertura + cfg.pesoSimilaridade * similaridade;
  return Math.min(1, Math.max(0, nota));
}

export function buscar<T>(pergunta: string, indice: Indice<T>, opcoes: Partial<ConfigBusca> = {}): ResultadoBusca<T> {
  const cfg = { ...CONFIG.busca, ...opcoes };
  const consulta = [...new Set(tokenizar(pergunta))];

  const ranking = indice.entradas
    .map((item, posicao) => ({
      entrada: item.entrada,
      pontuacao: pontuar(consulta, item, indice.idf, cfg),
      posicao
    }))
    // Em empate vence quem aparece primeiro na base (resultado sempre igual).
    .sort((a, b) => b.pontuacao - a.pontuacao || a.posicao - b.posicao)
    .map(({ entrada, pontuacao }) => ({ entrada, pontuacao }));

  const topo = ranking[0];
  const encontrou = Boolean(topo) && topo.pontuacao >= cfg.limiteResposta && topo.pontuacao > 0;
  const melhor = encontrou ? topo : null;

  const sugestoes = ranking
    .filter((r) => r !== melhor && r.pontuacao > 0 && r.pontuacao >= cfg.limiteSugestao)
    .slice(0, cfg.maxSugestoes);

  return { encontrou, melhor, sugestoes, ranking };
}
