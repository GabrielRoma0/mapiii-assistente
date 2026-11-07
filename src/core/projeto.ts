// Página "Sobre o projeto" (P2): o conteúdo vem de data/projeto.json, escrito pela dupla.
// Nenhum número sem fonte, nenhum dado pessoal e nunca "você tem direito".
import { temDadosPessoais } from './validar.ts';

export interface NumeroDoTeste {
  /** O que foi medido, ex.: "Acerto das orientações". */
  rotulo: string;
  /** O resultado como vai na tela, ex.: "11 de 12". Inclusive os ruins. */
  valor: string;
  /** De onde vem: arquivo, planilha ou seção da folha de teste. */
  fonte: string;
}

export interface Projeto {
  problema: string;
  /** Persona das entrevistas, sem nada que identifique a pessoa. null enquanto não houver. */
  persona: string | null;
  como_testamos: string[];
  numeros: NumeroDoTeste[];
  equipe: string[];
  visao_de_futuro: string;
}

const CAMPOS = ['problema', 'persona', 'como_testamos', 'numeros', 'equipe', 'visao_de_futuro'];
const texto = (v: unknown): v is string => typeof v === 'string' && v.trim().length > 0;
const listaDeTextos = (v: unknown): v is string[] => Array.isArray(v) && v.every(texto);

export function validarProjeto(dados: unknown): string[] {
  if (typeof dados !== 'object' || dados === null || Array.isArray(dados)) return ['data/projeto.json precisa ser um objeto.'];
  const d = dados as Record<string, unknown>;
  const erros: string[] = [];

  for (const k of Object.keys(d)) if (!CAMPOS.includes(k)) erros.push(`campo desconhecido: "${k}".`);
  if (!texto(d.problema)) erros.push('"problema" precisa de um texto.');
  if (d.persona !== null && !texto(d.persona)) erros.push('"persona" precisa ser um texto ou null.');
  if (!listaDeTextos(d.como_testamos)) erros.push('"como_testamos" precisa ser uma lista de textos.');
  if (!listaDeTextos(d.equipe) || !d.equipe.length) erros.push('"equipe" precisa ser uma lista de nomes.');
  if (!texto(d.visao_de_futuro)) erros.push('"visao_de_futuro" precisa de um texto.');

  if (!Array.isArray(d.numeros)) erros.push('"numeros" precisa ser uma lista (vazia até o teste com pessoas).');
  else
    d.numeros.forEach((n, i) => {
      const num = (n ?? {}) as Record<string, unknown>;
      for (const k of Object.keys(num)) if (!['rotulo', 'valor', 'fonte'].includes(k)) erros.push(`numeros[${i}]: campo desconhecido "${k}".`);
      if (!texto(num.rotulo)) erros.push(`numeros[${i}]: falta "rotulo".`);
      if (!texto(num.valor)) erros.push(`numeros[${i}]: falta "valor".`);
      if (!texto(num.fonte)) erros.push(`numeros[${i}]: falta a fonte (de onde vem o número).`);
    });

  const todos = JSON.stringify(d);
  if (/voc[eê] tem direito/i.test(todos)) erros.push('nunca escreva "você tem direito": use "pode ter direito".');
  if (temDadosPessoais(todos.replace(/"fonte":"[^"]*"/g, ''))) erros.push('há dado pessoal (e-mail, telefone ou CPF) no texto.');
  return erros;
}
