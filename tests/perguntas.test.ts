import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { test as teste } from 'vitest';
import {
  PERGUNTAS,
  PREFIRO_NAO,
  opcoesNaTela,
  perguntasDaTriagem,
  semSensiveis,
  validarPerguntas,
  type Pergunta
} from '../src/core/perguntas.ts';
import { auditarPerguntas } from '../src/core/auditoria.ts';

const dados = JSON.parse(readFileSync(fileURLToPath(new URL('../data/perguntas.json', import.meta.url)), 'utf8'));

const p = (id: string, extra: Partial<Pergunta> = {}): Pergunta => ({
  id,
  texto: 'Pergunta?',
  por_que_perguntamos: 'Motivo.',
  tipo: 'unica',
  opcoes: [
    { valor: 'sim', texto: 'Sim' },
    { valor: 'nao', texto: 'Não' }
  ],
  ...extra
});
const soErro = (lista: unknown, trecho: string) => {
  const e = validarPerguntas(lista);
  assert.ok(e.some((m) => m.includes(trecho)), `esperava erro sobre "${trecho}", veio: ${JSON.stringify(e)}`);
};

// ---- data/perguntas.json ----

teste('perguntas.json: o arquivo real é válido', () => {
  assert.deepEqual(validarPerguntas(dados), []);
});

teste('perguntas.json: tem as 11 perguntas pedidas, mais a subprefeitura opcional', () => {
  const pedidas = ['p_quem', 'p_faixa', 'p_necessidade', 'p_equipamento', 'p_laudo', 'p_cidade', 'p_renda', 'p_cadunico', 'p_beneficios', 'p_transporte', 'p_objetivo'];
  const ids = PERGUNTAS.map((q) => q.id);
  for (const id of pedidas) assert.ok(ids.includes(id), id);
  assert.deepEqual(ids.filter((id) => !pedidas.includes(id)), ['p_subprefeitura']);
});

teste('perguntas.json: saúde, renda, idade e benefícios são marcados como sensíveis', () => {
  const sensiveis = PERGUNTAS.filter((q) => q.sensivel).map((q) => q.id).sort();
  assert.deepEqual(sensiveis, ['p_beneficios', 'p_cadunico', 'p_equipamento', 'p_faixa', 'p_laudo', 'p_necessidade', 'p_renda']);
});

teste('perguntas.json: nenhuma pergunta pede dado exato (idade, renda, endereço, diagnóstico)', () => {
  for (const q of PERGUNTAS) {
    assert.ok(q.opcoes.length >= 2, `${q.id} precisa ser de escolha, não texto livre`);
    assert.doesNotMatch(q.texto, /qual (é )?(a|o) (idade|renda|endereço|diagnóstico|cep)/i, q.id);
  }
});

// ---- validarPerguntas ----

teste('validarPerguntas: toda pergunta precisa de "por que perguntamos"', () => {
  soErro([p('p_a', { por_que_perguntamos: '' })], 'por_que_perguntamos');
});

teste('validarPerguntas: id começa com p_ e é único', () => {
  soErro([p('a')], 'id');
  soErro([p('p_a'), p('p_a')], 'repetido');
});

teste('validarPerguntas: tipo e opções', () => {
  soErro([p('p_a', { tipo: 'texto' as never })], 'tipo');
  soErro([p('p_a', { opcoes: [{ valor: 'sim', texto: 'Sim' }] })], 'ao menos 2');
  soErro([p('p_a', { opcoes: [{ valor: 'Sim!', texto: 'Sim' }, { valor: 'nao', texto: 'Não' }] })], 'minúsculas');
  soErro([p('p_a', { opcoes: [{ valor: 'sim', texto: 'Sim' }, { valor: 'sim', texto: 'Sim' }] })], 'repetido');
});

teste('validarPerguntas: "Prefiro não responder" não é escrito à mão, o app já põe', () => {
  soErro([p('p_a', { opcoes: [{ valor: 'sim', texto: 'Sim' }, PREFIRO_NAO] })], 'já põe');
  assert.deepEqual(opcoesNaTela(p('p_a')).at(-1), PREFIRO_NAO);
});

teste('validarPerguntas: mostrar_se aponta para pergunta e valor que existem', () => {
  soErro([p('p_a', { mostrar_se: { campo: 'p_x', em: ['sim'] } })], 'inexistente');
  soErro([p('p_a'), p('p_b', { mostrar_se: { campo: 'p_a', em: ['talvez'] } })], 'talvez');
  assert.deepEqual(validarPerguntas([p('p_a'), p('p_b', { mostrar_se: { campo: 'p_a', em: ['sim'] } })]), []);
});

teste('validarPerguntas: exclusivas só em múltipla e com valores das opções', () => {
  soErro([p('p_a', { exclusivas: ['nao'] })], 'multipla');
  soErro([p('p_a', { tipo: 'multipla', exclusivas: ['nenhum'] })], 'exclusivas');
});

teste('validarPerguntas: campo desconhecido é apontado', () => {
  soErro([{ ...p('p_a'), obrigatoria: true }], 'obrigatoria');
});

// ---- triagem ----

const LISTA = [p('p_a'), p('p_b'), p('p_c', { mostrar_se: { campo: 'p_a', em: ['sim'] } })];

teste('perguntasDaTriagem: só mostra o que a base usa, na ordem do arquivo', () => {
  assert.deepEqual(perguntasDaTriagem(new Set(['p_b']), {}, LISTA).map((q) => q.id), ['p_b']);
  assert.deepEqual(perguntasDaTriagem(new Set(), {}, LISTA), []);
});

teste('perguntasDaTriagem: pergunta com mostrar_se puxa a pergunta de que depende e só aparece quando atendida', () => {
  assert.deepEqual(perguntasDaTriagem(new Set(['p_c']), {}, LISTA).map((q) => q.id), ['p_a']);
  assert.deepEqual(perguntasDaTriagem(new Set(['p_c']), { p_a: 'sim' }, LISTA).map((q) => q.id), ['p_a', 'p_c']);
  assert.deepEqual(perguntasDaTriagem(new Set(['p_c']), { p_a: 'nao' }, LISTA).map((q) => q.id), ['p_a']);
});

teste('semSensiveis: tira saúde e renda do que pode ir para a conta sem "Salvar meu perfil"', () => {
  const r = semSensiveis({ p_quem: 'eu', p_renda: 'sim', p_necessidade: ['mobilidade'], p_objetivo: 'transporte' });
  assert.deepEqual(r, { p_quem: 'eu', p_objetivo: 'transporte' });
});

// ---- auditoria ----

const regra = (campo: string) => ({ todas: [{ campo, em: ['sim'] }] });

teste('auditarPerguntas: tudo usado e nada inexistente passa', () => {
  const r = auditarPerguntas([p('p_a'), p('p_b')], [{ id: 'x', condicoes: regra('p_a') }, { id: 'y', condicoes: regra('p_b') }]);
  assert.deepEqual(r, { semUso: [], inexistentes: [], ok: true });
});

teste('auditarPerguntas: falha com pergunta sem uso', () => {
  const r = auditarPerguntas([p('p_a'), p('p_b')], [{ id: 'x', condicoes: regra('p_a') }]);
  assert.equal(r.ok, false);
  assert.deepEqual(r.semUso, ['p_b']);
});

teste('auditarPerguntas: falha com condição que usa pergunta inexistente e diz qual entrada', () => {
  const r = auditarPerguntas([p('p_a')], [{ id: 'x', condicoes: { alguma: [{ campo: 'p_a', em: ['sim'] }, { campo: 'p_z', em: ['sim'] }] } }]);
  assert.equal(r.ok, false);
  assert.deepEqual(r.inexistentes, ['x → p_z']);
});

teste('auditarPerguntas: pergunta usada só por mostrar_se conta como usada', () => {
  const r = auditarPerguntas(LISTA, [{ id: 'x', condicoes: regra('p_c') }, { id: 'y', condicoes: regra('p_b') }]);
  assert.deepEqual(r.semUso, []);
});

teste('auditarPerguntas: base vazia deixa todas as perguntas sem uso', () => {
  assert.deepEqual(auditarPerguntas(LISTA, []).semUso, ['p_a', 'p_b', 'p_c']);
});

import { resumoEditavel } from '../src/core/perguntas.ts';

teste('resumoEditavel: uma linha por pergunta respondida, na ordem do arquivo, com os textos das opções', () => {
  const r = resumoEditavel({ p_objetivo: 'transporte', p_necessidade: ['mobilidade', 'visual'], p_cidade: 'sim', p_xyz: 'a' });
  assert.deepEqual(r, [
    { id: 'p_necessidade', pergunta: 'Que tipo de apoio a pessoa precisa no dia a dia?', resposta: 'Mobilidade ou cadeira de rodas, Visual' },
    { id: 'p_objetivo', pergunta: 'O que você quer resolver?', resposta: 'Transporte e passe livre' },
    { id: 'p_cidade', pergunta: 'A pessoa mora na cidade de São Paulo?', resposta: 'Sim' }
  ]);
  assert.deepEqual(resumoEditavel({}), []);
});
