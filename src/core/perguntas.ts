// Perguntas da triagem (data/perguntas.json). As `condicoes` da base usam os ids daqui.
// As respostas ficam só na memória do app: nunca na URL, em armazenamento local nem em registros.
// Só vão para a conta se a pessoa logada marcar "Salvar meu perfil".
// Nunca perguntar nome, diagnóstico, idade exata, renda exata ou endereço.
import dadosPerguntas from '../../data/perguntas.json';

export const TIPOS_PERGUNTA = ['unica', 'multipla', 'lista'] as const;
export type TipoPergunta = (typeof TIPOS_PERGUNTA)[number];

/** Toda pergunta ganha esta opção no fim, sem precisar escrever no JSON. */
export const PREFIRO_NAO = { valor: 'prefiro_nao_responder', texto: 'Prefiro não responder' } as const;

/** Respostas que não dizem nada: a regra que depende delas fica em "Talvez". */
export const VALORES_INCERTOS = new Set(['nao_sei', PREFIRO_NAO.valor]);

export interface Opcao {
  valor: string;
  texto: string;
}

export interface Pergunta {
  id: string;
  texto: string;
  /** Texto no modo "Sou a pessoa" (falando com você). Sem ele, vale `texto`. */
  texto_eu?: string;
  por_que_perguntamos: string;
  /** Fala do Mapi (estado "Ouvindo") acima da pergunta. */
  fala?: string;
  tipo: TipoPergunta;
  opcoes: Opcao[];
  /** Saúde, renda ou benefício: só vai para a conta com "Salvar meu perfil". */
  sensivel?: boolean;
  /** Só aparece se a resposta de outra pergunta estiver na lista. */
  mostrar_se?: { campo: string; em: string[] };
  /** Em "multipla": opções que não combinam com as outras (ex.: "Nenhum"). */
  exclusivas?: string[];
}

/** Respostas da pessoa. "multipla" guarda uma lista; ausente = não respondeu. */
export type Respostas = Partial<Record<string, string | string[]>>;

const CHAVES = new Set(['id', 'texto', 'texto_eu', 'por_que_perguntamos', 'fala', 'tipo', 'opcoes', 'sensivel', 'mostrar_se', 'exclusivas']);
const texto = (v: unknown): v is string => typeof v === 'string' && v.trim().length > 0;
const objeto = (v: unknown): v is Record<string, unknown> => !!v && typeof v === 'object' && !Array.isArray(v);

/** Lista de erros em português; vazia quando o arquivo de perguntas é válido. */
export function validarPerguntas(dados: unknown): string[] {
  if (!Array.isArray(dados)) return ['perguntas.json precisa ser uma lista.'];
  const erros: string[] = [];
  const ids = new Set<string>();
  const valoresPorId = new Map<string, Set<string>>();

  dados.forEach((p: unknown, i) => {
    const nome = objeto(p) && texto(p.id) ? p.id : `pergunta #${i + 1}`;
    const erro = (m: string) => erros.push(`${nome}: ${m}`);
    if (!objeto(p)) return erro('precisa ser um objeto.');

    if (!texto(p.id) || !/^p_[a-z0-9_]+$/.test(p.id)) erro('id precisa começar com "p_" e ter só minúsculas, números e _.');
    else if (ids.has(p.id)) erro('id repetido.');
    else ids.add(p.id);

    if (!texto(p.texto)) erro('texto obrigatório.');
    if (p.texto_eu !== undefined && !texto(p.texto_eu)) erro('texto_eu, quando existir, não pode ser vazio.');
    if (!texto(p.por_que_perguntamos)) erro('por_que_perguntamos obrigatório: toda pergunta explica por que é feita.');
    if (p.fala !== undefined && !texto(p.fala)) erro('fala, quando existir, não pode ser vazia.');
    if (!TIPOS_PERGUNTA.includes(p.tipo as TipoPergunta)) erro(`tipo precisa ser: ${TIPOS_PERGUNTA.join(', ')}.`);
    if (p.sensivel !== undefined && typeof p.sensivel !== 'boolean') erro('sensivel precisa ser true ou false.');

    const valores = new Set<string>();
    if (!Array.isArray(p.opcoes) || p.opcoes.length < 2) erro('opcoes precisa ter ao menos 2 opções.');
    else {
      p.opcoes.forEach((o: unknown, j) => {
        if (!objeto(o) || !texto(o.valor) || !texto(o.texto)) return erro(`opcoes[${j}] precisa ser {"valor": "...", "texto": "..."}.`);
        if (!/^[a-z0-9_]+$/.test(o.valor)) erro(`opcoes[${j}]: valor "${o.valor}" só pode ter minúsculas, números e _.`);
        if (o.valor === PREFIRO_NAO.valor) erro(`opcoes[${j}]: não escreva "${PREFIRO_NAO.texto}", o app já põe essa opção.`);
        if (valores.has(o.valor)) erro(`opcoes[${j}]: valor "${o.valor}" repetido.`);
        valores.add(o.valor);
      });
    }
    if (texto(p.id)) valoresPorId.set(p.id, valores);

    if (p.exclusivas !== undefined) {
      if (p.tipo !== 'multipla') erro('exclusivas só vale para tipo "multipla".');
      if (!Array.isArray(p.exclusivas) || !p.exclusivas.every((v) => valores.has(v))) erro('exclusivas precisa listar valores das opções.');
    }

    for (const k of Object.keys(p)) if (!CHAVES.has(k)) erro(`campo desconhecido: ${k}.`);
  });

  // mostrar_se depende de outras perguntas: confere depois de ler todas.
  dados.forEach((p: unknown) => {
    if (!objeto(p) || p.mostrar_se === undefined) return;
    const erro = (m: string) => erros.push(`${String(p.id)}: ${m}`);
    const m = p.mostrar_se;
    if (!objeto(m) || !texto(m.campo) || !Array.isArray(m.em) || !m.em.length) {
      return erro('mostrar_se precisa ser {"campo": "p_...", "em": ["..."]}.');
    }
    const alvo = valoresPorId.get(m.campo);
    if (!alvo) return erro(`mostrar_se aponta para pergunta inexistente: ${m.campo}.`);
    if (m.campo === p.id) return erro('mostrar_se não pode apontar para a própria pergunta.');
    const errados = m.em.filter((v: unknown) => typeof v !== 'string' || !alvo.has(v));
    if (errados.length) erro(`mostrar_se: valor(es) ${errados.join(', ')} não existem em ${m.campo}.`);
  });

  return erros;
}

export const PERGUNTAS: Pergunta[] = dadosPerguntas as Pergunta[];

export function perguntaPorId(id: string, perguntas: Pergunta[] = PERGUNTAS): Pergunta | undefined {
  return perguntas.find((p) => p.id === id);
}

/** Opções na tela: as do JSON mais "Prefiro não responder". */
export function opcoesNaTela(p: Pergunta): Opcao[] {
  return [...p.opcoes, PREFIRO_NAO];
}

/** Valores aceitos numa regra de `condicoes` (inclui "prefiro não responder"). */
export function valoresAceitos(p: Pergunta): string[] {
  return opcoesNaTela(p).map((o) => o.valor);
}

export function textoDaOpcao(p: Pergunta, valor: string): string {
  return opcoesNaTela(p).find((o) => o.valor === valor)?.texto ?? valor;
}

/** Respostas como lista, para "unica" e "multipla" serem tratadas igual. */
export function comoLista(resposta: string | string[] | undefined): string[] {
  if (resposta === undefined) return [];
  return Array.isArray(resposta) ? resposta : [resposta];
}

/**
 * Perguntas que a triagem mostra: só as que alguma condição da base usa, mais as perguntas
 * de que elas dependem por `mostrar_se`, na ordem do JSON. Some quando `mostrar_se` não é atendido.
 */
export function perguntasDaTriagem(usadas: Set<string>, respostas: Respostas, perguntas: Pergunta[] = PERGUNTAS): Pergunta[] {
  const necessarias = new Set(usadas);
  for (const p of perguntas) if (usadas.has(p.id) && p.mostrar_se) necessarias.add(p.mostrar_se.campo);
  return perguntas.filter((p) => {
    if (!necessarias.has(p.id)) return false;
    if (!p.mostrar_se) return true;
    return comoLista(respostas[p.mostrar_se.campo]).some((v) => p.mostrar_se!.em.includes(v));
  });
}

/** Separa o que pode ir para a conta sem "Salvar meu perfil" (nada sensível) do que só vai com ele. */
export function semSensiveis(respostas: Respostas, perguntas: Pergunta[] = PERGUNTAS): Respostas {
  const sensiveis = new Set(perguntas.filter((p) => p.sensivel).map((p) => p.id));
  return Object.fromEntries(Object.entries(respostas).filter(([id]) => !sensiveis.has(id)));
}

/** "Sou a pessoa" fala com você; "Cuido de alguém" fala da pessoa. Sem escolha, vale o texto padrão (da pessoa). */
export type Modo = 'pessoa' | 'cuidador';

/** Perguntas com o texto do modo escolhido. As frases do motor de regras usam o mesmo texto. */
export function perguntasNoModo(modo: Modo | null, perguntas: Pergunta[] = PERGUNTAS): Pergunta[] {
  if (modo !== 'pessoa') return perguntas;
  return perguntas.map((p) => (p.texto_eu ? { ...p, texto: p.texto_eu } : p));
}
