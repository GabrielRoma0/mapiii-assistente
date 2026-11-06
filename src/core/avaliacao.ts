// Avaliação offline do assistente (npm run eval). Funções puras: o script eval/avaliar.ts só lê e grava arquivos.
// (a) Pergunta livre: gabarito_perguntas.csv → acerto geral, por grupo e por tema, recusas corretas e erros.
// (b) Rota dos Direitos: gabarito_cenarios.json → precisão e cobertura do motor de regras.
import { criarIndice } from './busca.ts';
import type { Entrada } from './kb-schema.ts';
import { PERGUNTAS, perguntaPorId, valoresAceitos, type Pergunta, type Respostas } from './perguntas.ts';
import { temaDaEntrada } from './registro.ts';
import { montarRota } from './regras.ts';
import { responderPergunta, type RespostaPergunta } from './responder.ts';

export const RECUSAR = 'RECUSAR';
export const GRUPOS = ['ajuste', 'teste'] as const;
export type Grupo = (typeof GRUPOS)[number];

// ---------- CSV ----------

/** Lê CSV com cabeçalho (vírgula, aspas duplas, "" dentro de aspas). Linhas vazias e começadas por # são ignoradas. */
export function lerCsv(texto: string): Record<string, string>[] {
  const linhas: string[][] = [];
  let campo = '';
  let linha: string[] = [];
  let aspas = false;
  const fecharLinha = () => {
    linha.push(campo);
    campo = '';
    if (linha.some((c) => c.trim()) && !linha[0].trimStart().startsWith('#')) linhas.push(linha);
    linha = [];
  };
  const t = texto.replace(/^﻿/, '');
  for (let i = 0; i < t.length; i++) {
    const c = t[i];
    if (aspas) {
      if (c === '"' && t[i + 1] === '"') {
        campo += '"';
        i++;
      } else if (c === '"') aspas = false;
      else campo += c;
    } else if (c === '"') aspas = true;
    else if (c === ',') {
      linha.push(campo);
      campo = '';
    } else if (c === '\n') fecharLinha();
    else if (c !== '\r') campo += c;
  }
  if (campo || linha.length) fecharLinha();
  const [cabecalho, ...resto] = linhas;
  if (!cabecalho) return [];
  const nomes = cabecalho.map((n) => n.trim());
  return resto.map((l) => Object.fromEntries(nomes.map((n, i) => [n, (l[i] ?? '').trim()])));
}

export function celulaCsv(v: string | number | boolean | null | undefined): string {
  const s = v === null || v === undefined ? '' : typeof v === 'number' ? String(Math.round(v * 1000) / 1000) : String(v);
  return /[",\n]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s;
}

// ---------- (a) perguntas ----------

export interface CasoPergunta {
  pergunta: string;
  esperado: string;
  grupo: Grupo;
}

export function validarGabaritoPerguntas(linhas: Record<string, string>[], idsDaBase: Set<string>): { casos: CasoPergunta[]; erros: string[] } {
  const erros: string[] = [];
  const casos: CasoPergunta[] = [];
  linhas.forEach((l, i) => {
    const onde = `gabarito_perguntas.csv linha ${i + 2}`;
    const pergunta = l.pergunta ?? '';
    const esperado = l.id_esperado ?? '';
    const grupo = (l.grupo ?? '') as Grupo;
    if (!pergunta) erros.push(`${onde}: pergunta vazia.`);
    if (!esperado) erros.push(`${onde}: id_esperado vazio (use o id de uma entrada ou ${RECUSAR}).`);
    else if (esperado !== RECUSAR && !idsDaBase.has(esperado)) erros.push(`${onde}: id_esperado "${esperado}" não existe em kb.json.`);
    if (!GRUPOS.includes(grupo)) erros.push(`${onde}: grupo precisa ser ${GRUPOS.join(' ou ')}.`);
    if (pergunta && esperado && GRUPOS.includes(grupo)) casos.push({ pergunta, esperado, grupo });
  });
  return { casos, erros };
}

/** O que o assistente "respondeu", numa palavra: o id da entrada ou o tipo de não-resposta. */
export function obtido(r: RespostaPergunta): string {
  if (r.tipo === 'resposta') return r.entrada.id;
  if (r.tipo === 'recusa') return `recusa:${r.motivo}`;
  return r.tipo;
}

export interface ResultadoPergunta extends CasoPergunta {
  tema: string;
  obtido: string;
  acertou: boolean;
  /** O esperado apareceu como resposta ou como uma das sugestões. */
  acertouNoTop3: boolean;
  pontuacao: number | null;
}

export function avaliarPerguntas(casos: CasoPergunta[], kb: Entrada[], canalOficialId: string | null = null): ResultadoPergunta[] {
  const indice = criarIndice(kb);
  const porId = new Map(kb.map((e) => [e.id, e]));
  return casos.map((c) => {
    const r = responderPergunta(c.pergunta, indice, { canalOficialId });
    const o = obtido(r);
    const respondeu = r.tipo === 'resposta';
    const acertou = c.esperado === RECUSAR ? !respondeu : o === c.esperado;
    const top3 = respondeu ? [r.entrada.id, ...r.sugestoes.map((s) => s.entrada.id)] : r.tipo === 'nao_encontrei' ? r.sugestoes.map((s) => s.entrada.id) : [];
    const entrada = porId.get(c.esperado);
    return {
      ...c,
      tema: c.esperado === RECUSAR ? 'recusar' : entrada ? temaDaEntrada(entrada) : 'desconhecido',
      obtido: o,
      acertou,
      acertouNoTop3: c.esperado === RECUSAR ? acertou : top3.includes(c.esperado),
      pontuacao: respondeu ? r.pontuacao : null
    };
  });
}

export interface Taxa {
  acertos: number;
  total: number;
  /** null quando não há casos. */
  taxa: number | null;
}

const taxa = (acertos: number, total: number): Taxa => ({ acertos, total, taxa: total ? acertos / total : null });

export interface MetricasPerguntas {
  geral: Taxa;
  top3: Taxa;
  porGrupo: Record<Grupo, Taxa>;
  porTema: Record<string, Taxa>;
  /** Entre os casos RECUSAR: quantos não receberam resposta. */
  recusasCorretas: Taxa;
  /** Entre os casos com id esperado: quantos ficaram sem resposta (recusa ou "não encontrei" indevido). */
  recusasIndevidas: Taxa;
  erros: ResultadoPergunta[];
}

export function metricasPerguntas(rs: ResultadoPergunta[]): MetricasPerguntas {
  const conta = (lista: ResultadoPergunta[], f: (r: ResultadoPergunta) => boolean = (r) => r.acertou) => taxa(lista.filter(f).length, lista.length);
  const temas = [...new Set(rs.map((r) => r.tema))].sort();
  const recusar = rs.filter((r) => r.esperado === RECUSAR);
  const comId = rs.filter((r) => r.esperado !== RECUSAR);
  return {
    geral: conta(rs),
    top3: conta(rs, (r) => r.acertouNoTop3),
    porGrupo: { ajuste: conta(rs.filter((r) => r.grupo === 'ajuste')), teste: conta(rs.filter((r) => r.grupo === 'teste')) },
    porTema: Object.fromEntries(temas.map((t) => [t, conta(rs.filter((r) => r.tema === t))])),
    recusasCorretas: conta(recusar),
    recusasIndevidas: conta(comId, (r) => !houveResposta(r)),
    erros: rs.filter((r) => !r.acertou)
  };
}

const houveResposta = (r: ResultadoPergunta) => !r.obtido.startsWith('recusa:') && r.obtido !== 'nao_encontrei' && r.obtido !== 'fora_do_tema';

// ---------- (b) cenários ----------

export interface Cenario {
  id: string;
  descricao: string;
  respostas: Respostas;
  /** Ids que deveriam aparecer como "Pode ter direito". */
  esperados: string[];
  grupo: Grupo;
}

export function validarCenarios(dados: unknown, idsDaBase: Set<string>, perguntas: Pergunta[] = PERGUNTAS): { cenarios: Cenario[]; erros: string[] } {
  if (!Array.isArray(dados)) return { cenarios: [], erros: ['gabarito_cenarios.json precisa ser uma lista.'] };
  const erros: string[] = [];
  const cenarios: Cenario[] = [];
  const ids = new Set<string>();
  dados.forEach((c: unknown, i) => {
    const o = (c ?? {}) as Record<string, unknown>;
    const nome = typeof o.id === 'string' && o.id ? o.id : `cenário #${i + 1}`;
    const antes = erros.length;
    const erro = (m: string) => erros.push(`${nome}: ${m}`);
    if (typeof o.id !== 'string' || !/^[a-z0-9-]+$/.test(o.id)) erro('id em minúsculas, números e hífen.');
    else if (ids.has(o.id)) erro('id repetido.');
    else ids.add(o.id);
    if (typeof o.descricao !== 'string' || !o.descricao.trim()) erro('descricao obrigatória.');
    if (!GRUPOS.includes(o.grupo as Grupo)) erro(`grupo precisa ser ${GRUPOS.join(' ou ')}.`);
    if (!o.respostas || typeof o.respostas !== 'object' || Array.isArray(o.respostas)) erro('respostas precisa ser um objeto {"p_...": "valor"}.');
    else
      for (const [campo, valor] of Object.entries(o.respostas)) {
        const p = perguntaPorId(campo, perguntas);
        if (!p) {
          erro(`respostas: pergunta inexistente ${campo}.`);
          continue;
        }
        const lista = Array.isArray(valor) ? valor : [valor];
        if (p.tipo !== 'multipla' && Array.isArray(valor)) erro(`respostas.${campo}: pergunta de escolha única não aceita lista.`);
        const errados = lista.filter((v) => typeof v !== 'string' || !valoresAceitos(p).includes(v));
        if (errados.length) erro(`respostas.${campo}: valor(es) ${errados.join(', ')} não existem.`);
      }
    if (!Array.isArray(o.esperados) || !o.esperados.every((x) => typeof x === 'string')) erro('esperados precisa ser uma lista de ids (pode ser vazia).');
    else for (const id of o.esperados) if (!idsDaBase.has(id)) erro(`esperados: "${id}" não existe em kb.json.`);
    if (erros.length === antes) cenarios.push(o as unknown as Cenario);
  });
  return { cenarios, erros };
}

export interface ResultadoCenario {
  cenario: Cenario;
  previstos: string[];
  /** Previstos que estão nos esperados. */
  certos: string[];
  /** null quando não previu nada (precisão indefinida). */
  precisao: number | null;
  /** null quando não esperava nada (cobertura indefinida). */
  cobertura: number | null;
}

/** Previstos = entradas que o motor classifica como "Pode ter direito" (com incluirTalvez, também "Talvez"). */
export function avaliarCenarios(cenarios: Cenario[], kb: Entrada[], incluirTalvez = false): ResultadoCenario[] {
  return cenarios.map((cenario) => {
    const previstos = montarRota(kb, cenario.respostas)
      .filter((i) => i.classe === 'pode' || (incluirTalvez && i.classe === 'talvez'))
      .map((i) => i.entrada.id);
    const esperados = new Set(cenario.esperados);
    const certos = previstos.filter((id) => esperados.has(id));
    return {
      cenario,
      previstos,
      certos,
      precisao: previstos.length ? certos.length / previstos.length : null,
      cobertura: esperados.size ? certos.length / esperados.size : null
    };
  });
}

export interface MetricasCenarios {
  cenarios: number;
  /** Micro: soma de certos / soma de previstos e de esperados em todos os cenários. */
  precisao: number | null;
  cobertura: number | null;
  /** Cenários em que o conjunto previsto é igual ao esperado. */
  exatos: Taxa;
}

export function metricasCenarios(rs: ResultadoCenario[]): MetricasCenarios {
  const certos = rs.reduce((s, r) => s + r.certos.length, 0);
  const previstos = rs.reduce((s, r) => s + r.previstos.length, 0);
  const esperados = rs.reduce((s, r) => s + r.cenario.esperados.length, 0);
  const igual = (r: ResultadoCenario) => r.previstos.length === r.cenario.esperados.length && r.certos.length === r.previstos.length;
  return {
    cenarios: rs.length,
    precisao: previstos ? certos / previstos : null,
    cobertura: esperados ? certos / esperados : null,
    exatos: taxa(rs.filter(igual).length, rs.length)
  };
}

// ---------- resultados.csv ----------

export function resultadosCsv(perguntas: ResultadoPergunta[], cenarios: ResultadoCenario[], cenariosComTalvez: ResultadoCenario[]): string {
  const cab = 'tipo,id_ou_pergunta,grupo,tema,esperado,obtido,acertou,pontuacao,precisao,cobertura';
  const linhasP = perguntas.map((r) =>
    ['pergunta', r.pergunta, r.grupo, r.tema, r.esperado, r.obtido, r.acertou ? 'sim' : 'nao', r.pontuacao, '', ''].map(celulaCsv).join(',')
  );
  const linhaC = (tipo: string) => (r: ResultadoCenario) =>
    [
      tipo,
      r.cenario.id,
      r.cenario.grupo,
      '',
      r.cenario.esperados.join(';'),
      r.previstos.join(';'),
      r.previstos.length === r.cenario.esperados.length && r.certos.length === r.previstos.length ? 'sim' : 'nao',
      '',
      r.precisao,
      r.cobertura
    ]
      .map(celulaCsv)
      .join(',');
  return [cab, ...linhasP, ...cenarios.map(linhaC('cenario_pode')), ...cenariosComTalvez.map(linhaC('cenario_pode_ou_talvez'))].join('\n') + '\n';
}
