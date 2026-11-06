import assert from 'node:assert/strict';
import { test as teste } from 'vitest';
import { avaliarEntrada, avaliarRegra, montarRota } from '../src/core/regras.ts';
import type { Condicoes, Entrada } from '../src/core/kb-schema.ts';

// Usa os ids e textos reais de data/perguntas.json. As entradas são fictícias.
const entrada = (id: string, condicoes: Condicoes, tipo: Entrada['tipo'] = 'direito'): Entrada => ({
  id,
  tipo,
  titulo: id,
  resumo: 'Resumo.',
  publico: ['pessoa com deficiência'],
  cidade: 'SP',
  condicoes,
  perguntas_exemplo: ['x'],
  palavras_chave: ['x'],
  fonte_nome: 'Fonte',
  fonte_url: 'https://exemplo.gov.br',
  tipo_fonte: 'oficial',
  verificado_em: '2026-10-01',
  limitacao: 'Limitação.'
});

const TRANSPORTE: Condicoes = {
  todas: [{ campo: 'p_objetivo', em: ['transporte'] }],
  alguma: [
    { campo: 'p_necessidade', em: ['mobilidade'] },
    { campo: 'p_equipamento', em: ['sim'] }
  ],
  nenhuma: [{ campo: 'p_beneficios', em: ['passe_livre'] }]
};
const avaliar = (c: Condicoes, r: Record<string, string | string[]>) => avaliarEntrada({ condicoes: c }, r);

// ---- avaliarRegra ----

teste('avaliarRegra: resposta dentro de "em" vale; outra resposta falha', () => {
  const regra = { campo: 'p_objetivo', em: ['transporte'] };
  assert.equal(avaliarRegra(regra, { p_objetivo: 'transporte' }), 'vale');
  assert.equal(avaliarRegra(regra, { p_objetivo: 'escola' }), 'falha');
});

teste('avaliarRegra: sem resposta, "não sei" ou "prefiro não responder" fica incerta', () => {
  const regra = { campo: 'p_laudo', em: ['sim'] };
  assert.equal(avaliarRegra(regra, {}), 'incerta');
  assert.equal(avaliarRegra(regra, { p_laudo: 'nao_sei' }), 'incerta');
  assert.equal(avaliarRegra(regra, { p_laudo: 'prefiro_nao_responder' }), 'incerta');
});

teste('avaliarRegra: "não sei" vale quando a própria regra pede "não sei"', () => {
  assert.equal(avaliarRegra({ campo: 'p_cadunico', em: ['nao_sei'] }, { p_cadunico: 'nao_sei' }), 'vale');
});

teste('avaliarRegra: em múltipla escolha, basta uma resposta dentro de "em"', () => {
  const regra = { campo: 'p_necessidade', em: ['mobilidade'] };
  assert.equal(avaliarRegra(regra, { p_necessidade: ['visual', 'mobilidade'] }), 'vale');
  assert.equal(avaliarRegra(regra, { p_necessidade: ['visual'] }), 'falha');
  assert.equal(avaliarRegra(regra, { p_necessidade: [] }), 'incerta');
});

// ---- avaliarEntrada ----

teste('avaliarEntrada: tudo combina → "pode", explicando com os textos das respostas', () => {
  const r = avaliar(TRANSPORTE, { p_objetivo: 'transporte', p_necessidade: ['mobilidade'], p_beneficios: ['nenhum'] });
  assert.equal(r.classe, 'pode');
  assert.equal(r.porque, 'Combina com o que você respondeu: “Transporte e passe livre” e “Mobilidade ou cadeira de rodas”.');
});

teste('avaliarEntrada: regra de "todas" que falha → "nao", dizendo para quem vale e o que foi respondido', () => {
  const r = avaliar(TRANSPORTE, { p_objetivo: 'escola', p_necessidade: ['mobilidade'], p_beneficios: ['nenhum'] });
  assert.equal(r.classe, 'nao');
  assert.equal(r.porque, 'Vale para quem respondeu “Transporte e passe livre” em “O que você quer resolver?”, e você respondeu “Escola e apoio na sala de aula”.');
});

teste('avaliarEntrada: nenhuma regra de "alguma" vale → "nao"', () => {
  const r = avaliar(TRANSPORTE, { p_objetivo: 'transporte', p_necessidade: ['visual'], p_equipamento: 'nao', p_beneficios: ['nenhum'] });
  assert.equal(r.classe, 'nao');
  assert.match(r.porque, /^Vale para quem respondeu “Mobilidade ou cadeira de rodas” em .* ou “Sim” em .*, e suas respostas foram outras\.$/);
});

teste('avaliarEntrada: regra de "nenhuma" que vale → "nao" (ex.: já recebe)', () => {
  const r = avaliar(TRANSPORTE, { p_objetivo: 'transporte', p_necessidade: ['mobilidade'], p_beneficios: ['passe_livre'] });
  assert.equal(r.classe, 'nao');
  assert.equal(r.porque, 'Costuma não valer para quem respondeu “Passe livre” em “A pessoa já recebe algum destes?”.');
});

teste('avaliarEntrada: falta resposta → "talvez", citando a pergunta que falta', () => {
  const r = avaliar(TRANSPORTE, { p_objetivo: 'transporte', p_necessidade: ['mobilidade'] });
  assert.equal(r.classe, 'talvez');
  assert.equal(r.porque, 'Depende da resposta para “A pessoa já recebe algum destes?”, que ficou sem resposta ou como “Não sei”.');
});

teste('avaliarEntrada: "prefiro não responder" leva a "talvez", nunca a "nao"', () => {
  const r = avaliar(TRANSPORTE, {
    p_objetivo: 'transporte',
    p_necessidade: ['prefiro_nao_responder'],
    p_equipamento: 'prefiro_nao_responder',
    p_beneficios: ['nenhum']
  });
  assert.equal(r.classe, 'talvez');
  assert.match(r.porque, /“Que tipo de apoio a pessoa precisa no dia a dia\?” e “A pessoa usa cadeira de rodas/);
});

teste('avaliarEntrada: em "alguma", uma regra que vale basta, mesmo com outra incerta', () => {
  const r = avaliar(TRANSPORTE, { p_objetivo: 'transporte', p_necessidade: ['mobilidade'], p_beneficios: ['nenhum'] });
  assert.equal(r.classe, 'pode');
});

teste('avaliarEntrada: "nao" vence "talvez" quando uma regra falha e outra está incerta', () => {
  const r = avaliar(TRANSPORTE, { p_objetivo: 'escola' });
  assert.equal(r.classe, 'nao');
});

teste('avaliarEntrada: entrada só com "nenhuma" e nada impedindo → "pode"', () => {
  const r = avaliar({ nenhuma: [{ campo: 'p_cidade', em: ['nao'] }] }, { p_cidade: 'sim' });
  assert.deepEqual(r, { classe: 'pode', porque: 'Nenhuma das suas respostas impede este caminho.' });
});

teste('avaliarEntrada: nunca diz "você tem direito"', () => {
  const casos: Record<string, string | string[]>[] = [
    { p_objetivo: 'transporte', p_necessidade: ['mobilidade'], p_beneficios: ['nenhum'] },
    { p_objetivo: 'escola' },
    {},
    { p_objetivo: 'transporte', p_beneficios: ['passe_livre'] }
  ];
  for (const respostas of casos) {
    const r = avaliar(TRANSPORTE, respostas);
    assert.doesNotMatch(r.porque, /voc[eê] tem direito/i);
    assert.ok(r.porque.endsWith('.'), r.porque);
  }
});

teste('avaliarEntrada: não altera nem guarda as respostas', () => {
  const respostas = { p_objetivo: 'transporte', p_necessidade: ['mobilidade'] };
  const copia = structuredClone(respostas);
  avaliar(TRANSPORTE, respostas);
  assert.deepEqual(respostas, copia);
});

// ---- montarRota ----

teste('montarRota: ordena pode → talvez → nao e mantém a ordem da base no empate', () => {
  const kb = [
    entrada('nao-1', { todas: [{ campo: 'p_objetivo', em: ['escola'] }] }),
    entrada('talvez-1', { todas: [{ campo: 'p_laudo', em: ['sim'] }] }),
    entrada('pode-1', { todas: [{ campo: 'p_objetivo', em: ['transporte'] }] }),
    entrada('pode-2', { alguma: [{ campo: 'p_objetivo', em: ['transporte'] }] })
  ];
  const rota = montarRota(kb, { p_objetivo: 'transporte' });
  assert.deepEqual(rota.map((i) => [i.entrada.id, i.classe]), [
    ['pode-1', 'pode'],
    ['pode-2', 'pode'],
    ['talvez-1', 'talvez'],
    ['nao-1', 'nao']
  ]);
});

teste('montarRota: normas e entradas sem condicoes ficam de fora', () => {
  const kb = [
    entrada('norma', { todas: [{ campo: 'p_objetivo', em: ['transporte'] }] }, 'norma'),
    { ...entrada('sem', {}), condicoes: undefined },
    entrada('servico', { todas: [{ campo: 'p_objetivo', em: ['transporte'] }] }, 'servico')
  ];
  assert.deepEqual(montarRota(kb, { p_objetivo: 'transporte' }).map((i) => i.entrada.id), ['servico']);
});

teste('montarRota: base vazia dá rota vazia', () => {
  assert.deepEqual(montarRota([], { p_objetivo: 'transporte' }), []);
});

teste('avaliarEntrada: resposta "Sim" vem acompanhada da pergunta na frase', () => {
  const r = avaliar({ todas: [{ campo: 'p_cidade', em: ['sim'] }] }, { p_cidade: 'sim' });
  assert.equal(r.porque, 'Combina com o que você respondeu: “Sim” para “A pessoa mora na cidade de São Paulo?”.');
});
