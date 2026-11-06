// Motor de regras da Rota dos Direitos: avalia as `condicoes` de cada entrada sobre as respostas da triagem.
// Funções puras: as respostas entram como argumento e não são guardadas em lugar nenhum.
// Nunca afirma "você tem direito": a classificação é "Pode ter direito", "Talvez" ou "Provavelmente não se aplica".
import type { Entrada, Regra } from './kb-schema.ts';
import { PERGUNTAS, VALORES_INCERTOS, comoLista, perguntaPorId, textoDaOpcao, type Pergunta, type Respostas } from './perguntas.ts';

export type Classe = 'pode' | 'talvez' | 'nao';

/** vale: a resposta está em `em` · falha: respondeu outra coisa · incerta: sem resposta, "não sei" ou "prefiro não responder". */
export type EstadoRegra = 'vale' | 'falha' | 'incerta';

export interface Avaliacao {
  classe: Classe;
  /** Uma frase explicando a classificação, montada com os textos das perguntas e das respostas. */
  porque: string;
}

export interface ItemRota extends Avaliacao {
  entrada: Entrada;
}

export function avaliarRegra(regra: Regra, respostas: Respostas): EstadoRegra {
  const dadas = comoLista(respostas[regra.campo]);
  if (dadas.some((v) => regra.em.includes(v))) return 'vale';
  if (!dadas.length || dadas.every((v) => VALORES_INCERTOS.has(v))) return 'incerta';
  return 'falha';
}

// ---- textos ----

const aspas = (t: string) => `“${t}”`;

function juntar(itens: string[], conector: 'e' | 'ou'): string {
  if (itens.length <= 1) return itens.join('');
  return `${itens.slice(0, -1).join(', ')} ${conector} ${itens[itens.length - 1]}`;
}

function pergunta(campo: string, perguntas: Pergunta[]): Pergunta {
  // O validador da base garante que o campo existe; o fallback só evita quebrar a tela.
  return perguntaPorId(campo, perguntas) ?? { id: campo, texto: campo, por_que_perguntamos: '', tipo: 'unica', opcoes: [] };
}

/** “Mobilidade ou cadeira de rodas” ou “Visual” em “Que tipo de apoio...?” */
function aceitas(regra: Regra, perguntas: Pergunta[]): string {
  const p = pergunta(regra.campo, perguntas);
  return `${juntar(regra.em.map((v) => aspas(textoDaOpcao(p, v))), 'ou')} em ${aspas(p.texto)}`;
}

// "Sim", "Não" e "Não sei" não se explicam sozinhos: vêm com a pergunta.
const RESPOSTAS_CURTAS = new Set(['sim', 'nao', 'nao_sei']);

/** Textos das respostas dadas que fazem a regra valer. */
function respostasQueValem(regra: Regra, respostas: Respostas, perguntas: Pergunta[]): string[] {
  const p = pergunta(regra.campo, perguntas);
  return comoLista(respostas[regra.campo])
    .filter((v) => regra.em.includes(v))
    .map((v) => (RESPOSTAS_CURTAS.has(v) ? `${aspas(textoDaOpcao(p, v))} para ${aspas(p.texto)}` : aspas(textoDaOpcao(p, v))));
}

function respondeu(regra: Regra, respostas: Respostas, perguntas: Pergunta[]): string {
  const p = pergunta(regra.campo, perguntas);
  return juntar(comoLista(respostas[regra.campo]).map((v) => aspas(textoDaOpcao(p, v))), 'e');
}

function semDuplicar(lista: string[]): string[] {
  return [...new Set(lista)];
}

// ---- avaliação ----

export function avaliarEntrada(entrada: Pick<Entrada, 'condicoes'>, respostas: Respostas, perguntas: Pergunta[] = PERGUNTAS): Avaliacao {
  const c = entrada.condicoes ?? {};
  const todas = c.todas ?? [];
  const alguma = c.alguma ?? [];
  const nenhuma = c.nenhuma ?? [];
  const estado = (r: Regra) => avaliarRegra(r, respostas);

  // 1. "Provavelmente não se aplica" vence: basta uma regra que falha de verdade.
  const impede = nenhuma.find((r) => estado(r) === 'vale');
  if (impede) {
    return {
      classe: 'nao',
      porque: `Costuma não valer para quem respondeu ${respostasQueValem(impede, respostas, perguntas).join(' e ')} em ${aspas(pergunta(impede.campo, perguntas).texto)}.`
    };
  }
  const falhou = todas.find((r) => estado(r) === 'falha');
  if (falhou) {
    return {
      classe: 'nao',
      porque: `Vale para quem respondeu ${aceitas(falhou, perguntas)}, e você respondeu ${respondeu(falhou, respostas, perguntas)}.`
    };
  }
  if (alguma.length && alguma.every((r) => estado(r) === 'falha')) {
    return {
      classe: 'nao',
      porque: `Vale para quem respondeu ${juntar(alguma.map((r) => aceitas(r, perguntas)), 'ou')}, e suas respostas foram outras.`
    };
  }

  // 2. "Talvez": nada falhou, mas falta alguma resposta para decidir.
  const algumaVale = alguma.some((r) => estado(r) === 'vale');
  const faltam = [
    ...todas.filter((r) => estado(r) === 'incerta'),
    ...nenhuma.filter((r) => estado(r) === 'incerta'),
    ...(algumaVale ? [] : alguma.filter((r) => estado(r) === 'incerta'))
  ];
  if (faltam.length) {
    const perguntasQueFaltam = semDuplicar(faltam.map((r) => aspas(pergunta(r.campo, perguntas).texto)));
    return {
      classe: 'talvez',
      porque: `Depende da resposta para ${juntar(perguntasQueFaltam, 'e')}, que ficou sem resposta ou como “Não sei”.`
    };
  }

  // 3. "Pode ter direito": tudo o que precisava valer valeu.
  const combina = semDuplicar([
    ...todas.flatMap((r) => respostasQueValem(r, respostas, perguntas)),
    ...alguma.filter((r) => estado(r) === 'vale').flatMap((r) => respostasQueValem(r, respostas, perguntas))
  ]);
  return {
    classe: 'pode',
    porque: combina.length
      ? `Combina com o que você respondeu: ${juntar(combina, 'e')}.`
      : 'Nenhuma das suas respostas impede este caminho.'
  };
}

const ORDEM: Record<Classe, number> = { pode: 0, talvez: 1, nao: 2 };

/**
 * Rota dos Direitos: avalia cada direito e serviço da base (normas ficam de fora)
 * e ordena "Pode ter direito" → "Talvez" → "Provavelmente não se aplica", mantendo a ordem da base no empate.
 */
export function montarRota(kb: Entrada[], respostas: Respostas, perguntas: Pergunta[] = PERGUNTAS): ItemRota[] {
  return kb
    .filter((e) => (e.tipo === 'direito' || e.tipo === 'servico') && e.condicoes)
    .map((entrada, posicao) => ({ entrada, posicao, ...avaliarEntrada(entrada, respostas, perguntas) }))
    .sort((a, b) => ORDEM[a.classe] - ORDEM[b.classe] || a.posicao - b.posicao)
    .map(({ posicao: _posicao, ...item }) => item);
}
