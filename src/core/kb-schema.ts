// Esquema da base de conhecimento (data/kb.json). Documentado em data/README.md.
// Usado pelo app, por tests/kb.test.ts e por `npm run validar-kb`.
import { PERGUNTAS, perguntaPorId, valoresAceitos, type Pergunta } from './perguntas.ts';

export const TIPOS = ['direito', 'servico', 'norma'] as const;
export const TIPOS_FONTE = ['oficial', 'secundaria', 'desatualizada'] as const;
export const CIDADES = ['SP'] as const;

export type TipoEntrada = (typeof TIPOS)[number];
export type TipoFonte = (typeof TIPOS_FONTE)[number];

/**
 * `campo` é o id de uma pergunta de data/perguntas.json. A regra vale quando a resposta
 * (ou alguma das respostas, em pergunta de múltipla escolha) é um dos valores de `em`.
 */
export interface Regra {
  campo: string;
  em: string[];
}

/**
 * Regras de elegibilidade sobre as respostas da triagem.
 * - todas: cada regra precisa valer.
 * - alguma: pelo menos uma precisa valer.
 * - nenhuma: se alguma valer, a entrada provavelmente não se aplica.
 */
export interface Condicoes {
  todas?: Regra[];
  alguma?: Regra[];
  nenhuma?: Regra[];
}

export interface Onde {
  texto: string;
  link?: string;
}

export interface Entrada {
  id: string;
  tipo: TipoEntrada;
  titulo: string;
  resumo: string;
  publico: string[];
  cidade: (typeof CIDADES)[number];
  condicoes?: Condicoes;
  documentos?: string[];
  onde?: Onde;
  prazo_tipico?: string;
  passos?: string[];
  se_negarem?: string[];
  perguntas_exemplo: string[];
  palavras_chave: string[];
  fonte_nome: string;
  fonte_url: string;
  tipo_fonte: TipoFonte;
  verificado_em: string;
  limitacao: string;
}

const COMUNS = [
  'id', 'tipo', 'titulo', 'resumo', 'publico', 'cidade', 'perguntas_exemplo', 'palavras_chave',
  'fonte_nome', 'fonte_url', 'tipo_fonte', 'verificado_em', 'limitacao'
];
// Direito e serviço entram na Rota dos Direitos: precisam dizer o que levar, onde ir, prazo e o que fazer se negarem.
const SO_DIREITO_SERVICO = ['condicoes', 'documentos', 'onde', 'prazo_tipico', 'se_negarem'];
const OPCIONAIS = ['passos'];
const CONHECIDOS = new Set([...COMUNS, ...SO_DIREITO_SERVICO, ...OPCIONAIS]);

/** Conferência mais velha que isso conta como desatualizada na tela. */
export const MESES_PARA_DESATUALIZAR = 6;

const texto = (v: unknown): v is string => typeof v === 'string' && v.trim().length > 0;
const listaDeTextos = (v: unknown): v is string[] => Array.isArray(v) && v.length > 0 && v.every(texto);
const objeto = (v: unknown): v is Record<string, unknown> => !!v && typeof v === 'object' && !Array.isArray(v);

function dataValida(v: unknown, hoje: Date): boolean {
  if (typeof v !== 'string' || !/^\d{4}-\d{2}-\d{2}$/.test(v)) return false;
  const d = new Date(`${v}T00:00:00Z`);
  if (Number.isNaN(d.getTime()) || d.toISOString().slice(0, 10) !== v) return false;
  return d.getTime() <= hoje.getTime();
}

function urlHttps(v: unknown): boolean {
  if (!texto(v)) return false;
  try {
    return new URL(v).protocol === 'https:';
  } catch {
    return false;
  }
}

function validarCondicoes(c: unknown, erro: (m: string) => void, perguntas: Pergunta[]) {
  if (!objeto(c)) return erro('condicoes precisa ser um objeto com "todas", "alguma" e/ou "nenhuma".');
  const grupos = Object.keys(c);
  for (const g of grupos) {
    if (!['todas', 'alguma', 'nenhuma'].includes(g)) erro(`condicoes: grupo desconhecido "${g}" (use todas, alguma ou nenhuma).`);
  }
  let regras = 0;
  for (const g of ['todas', 'alguma', 'nenhuma']) {
    const lista = c[g];
    if (lista === undefined) continue;
    if (!Array.isArray(lista) || !lista.length) {
      erro(`condicoes.${g}, quando existir, precisa ser uma lista com ao menos 1 regra.`);
      continue;
    }
    lista.forEach((r: unknown, i) => {
      const onde = `condicoes.${g}[${i}]`;
      if (!objeto(r)) return erro(`${onde} precisa ser {"campo": ..., "em": [...]}.`);
      for (const k of Object.keys(r)) if (k !== 'campo' && k !== 'em') erro(`${onde}: chave desconhecida "${k}".`);
      const pergunta = typeof r.campo === 'string' ? perguntaPorId(r.campo, perguntas) : undefined;
      if (!pergunta) {
        return erro(`${onde}: campo "${String(r.campo)}" não é uma pergunta de data/perguntas.json (campo precisa ser um id como p_objetivo).`);
      }
      const validos = valoresAceitos(pergunta);
      if (!listaDeTextos(r.em)) return erro(`${onde}: "em" precisa ser uma lista de valores.`);
      const errados = r.em.filter((v) => !validos.includes(v));
      if (errados.length) erro(`${onde}: valor(es) ${errados.join(', ')} não existem em ${r.campo}. Use: ${validos.join(', ')}.`);
      regras++;
    });
  }
  if (!regras) erro('condicoes precisa ter ao menos 1 regra.');
}

/** Lista de erros em português; vazia quando a base é válida. */
export function validarKb(kb: unknown, hoje: Date = new Date(), perguntas: Pergunta[] = PERGUNTAS): string[] {
  if (!Array.isArray(kb)) return ['A base precisa ser uma lista de entradas.'];

  const erros: string[] = [];
  const ids = new Set<string>();

  kb.forEach((item: unknown, i) => {
    const nomeProvisorio = objeto(item) && texto(item.id) ? item.id : `entrada #${i + 1}`;
    const erro = (msg: string) => erros.push(`${nomeProvisorio}: ${msg}`);
    if (!objeto(item)) return erro('precisa ser um objeto.');
    const e = item;

    if (!texto(e.id) || !/^[a-z0-9]+(-[a-z0-9]+)*$/.test(e.id)) {
      erro('id obrigatório, em minúsculas, números e hífen (ex.: bilhete-unico-especial).');
    } else if (ids.has(e.id)) {
      erro('id repetido.');
    } else {
      ids.add(e.id);
    }

    if (!TIPOS.includes(e.tipo as TipoEntrada)) erro(`tipo precisa ser: ${TIPOS.join(', ')}.`);
    if (!texto(e.titulo)) erro('titulo obrigatório.');
    if (!texto(e.resumo)) erro('resumo obrigatório.');
    if (!listaDeTextos(e.publico)) erro('publico precisa ter ao menos 1 texto.');
    if (!CIDADES.includes(e.cidade as 'SP')) erro(`cidade precisa ser: ${CIDADES.join(', ')}.`);
    if (!listaDeTextos(e.perguntas_exemplo)) erro('perguntas_exemplo precisa ter ao menos 1 texto.');
    if (!listaDeTextos(e.palavras_chave)) erro('palavras_chave precisa ter ao menos 1 texto.');
    if (!texto(e.fonte_nome)) erro('fonte_nome obrigatório: nenhuma entrada sem fonte.');
    if (!urlHttps(e.fonte_url)) erro('fonte_url obrigatória e precisa ser um link https válido.');
    if (!TIPOS_FONTE.includes(e.tipo_fonte as TipoFonte)) erro(`tipo_fonte precisa ser: ${TIPOS_FONTE.join(', ')}.`);
    if (!dataValida(e.verificado_em, hoje)) erro('verificado_em precisa ser uma data real e passada, no formato AAAA-MM-DD.');
    if (!texto(e.limitacao)) erro('limitacao obrigatória: diga o que a resposta não cobre.');

    const rota = e.tipo === 'direito' || e.tipo === 'servico';
    // Na norma esses campos são opcionais, mas, se vierem, seguem o mesmo formato.
    if (rota || e.condicoes !== undefined) {
      if (e.condicoes === undefined) erro('condicoes obrigatória para direito e serviço.');
      else validarCondicoes(e.condicoes, erro, perguntas);
    }
    if (rota || e.documentos !== undefined) {
      if (!listaDeTextos(e.documentos)) erro('documentos precisa ter ao menos 1 texto.');
    }
    if (rota || e.onde !== undefined) {
      if (!objeto(e.onde) || !texto(e.onde.texto)) erro('onde precisa ser {"texto": "...", "link": "https://..."}; o texto é obrigatório.');
      else {
        if (e.onde.link !== undefined && !urlHttps(e.onde.link)) erro('onde.link, quando existir, precisa ser um link https válido.');
        for (const k of Object.keys(e.onde)) if (k !== 'texto' && k !== 'link') erro(`onde: chave desconhecida "${k}".`);
      }
    }
    if (rota || e.prazo_tipico !== undefined) {
      if (!texto(e.prazo_tipico)) erro('prazo_tipico obrigatório (ex.: "Algumas semanas.").');
    }
    if (rota || e.se_negarem !== undefined) {
      if (!listaDeTextos(e.se_negarem)) erro('se_negarem precisa ter ao menos 1 passo.');
    }
    if (e.passos !== undefined && !listaDeTextos(e.passos)) {
      erro('passos, quando existir, precisa ser uma lista de textos não vazios.');
    }

    for (const campo of Object.keys(e)) {
      if (!CONHECIDOS.has(campo)) erro(`campo desconhecido: ${campo}.`);
    }
  });

  return erros;
}

/**
 * Tipo de fonte mostrado na tela: uma fonte conferida há mais de MESES_PARA_DESATUALIZAR meses
 * aparece como "Pode estar desatualizada", mesmo que seja oficial.
 */
export function tipoFonteNaTela(entrada: Pick<Entrada, 'tipo_fonte' | 'verificado_em'>, hoje: Date = new Date()): TipoFonte {
  if (entrada.tipo_fonte === 'desatualizada') return 'desatualizada';
  const limite = new Date(Date.UTC(hoje.getUTCFullYear(), hoje.getUTCMonth() - MESES_PARA_DESATUALIZAR, hoje.getUTCDate()));
  const conferida = new Date(`${entrada.verificado_em}T00:00:00Z`);
  return conferida < limite ? 'desatualizada' : entrada.tipo_fonte;
}
