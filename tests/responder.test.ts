import assert from 'node:assert/strict';
import { test as teste } from 'vitest';
import { criarIndice, buscar } from '../src/core/busca.ts';
import { responderPergunta, ehAssuntoDificil, passosDaEntrada, MENSAGEM_NAO_ENCONTREI, MENSAGEM_FORA_DO_TEMA } from '../src/core/responder.ts';
import { MENSAGEM_EMERGENCIA } from '../src/core/validar.ts';
import type { Entrada } from '../src/core/kb-schema.ts';

// Base fictícia: os textos não são informação sobre direitos.
const entrada = (id: string, titulo: string, perguntas: string[], chaves: string[], tipo: Entrada['tipo'] = 'direito'): Entrada => ({
  id,
  tipo,
  titulo,
  resumo: 'Resumo de exemplo.',
  publico: ['pessoa com deficiência'],
  cidade: 'SP',
  perguntas_exemplo: perguntas,
  palavras_chave: chaves,
  fonte_nome: 'Fonte',
  fonte_url: 'https://exemplo.gov.br',
  tipo_fonte: 'oficial',
  verificado_em: '2026-10-01',
  limitacao: 'Limitação de exemplo.'
});

const KB = [
  entrada('passe', 'Passe de exemplo', ['Como peço o passe livre no ônibus?', 'Cadeirante paga ônibus?'], ['passe livre', 'ônibus', 'gratuidade']),
  entrada('beneficio', 'Benefício de exemplo', ['Quem pode receber o benefício mensal?'], ['benefício', 'salário mínimo', 'renda']),
  entrada('central', 'Central de atendimento de exemplo', ['Onde peço ajuda da prefeitura?'], ['central', 'atendimento'], 'servico')
];
const indice = criarIndice(KB);

teste('responderPergunta: acha a entrada certa e devolve até 2 sugestões', () => {
  const r = responderPergunta('cadeirante paga ônibus?', indice);
  assert.equal(r.tipo, 'resposta');
  assert.equal(r.tipo === 'resposta' && r.entrada.id, 'passe');
  assert.ok(r.tipo === 'resposta' && r.sugestoes.length <= 2);
});

teste('responderPergunta: o título da entrada também conta na busca', () => {
  const idx = criarIndice([entrada('sem-chave', 'Isenção de exemplo', ['x'], ['zzz'])]);
  assert.equal(buscar('isenção', idx).melhor?.entrada.id, 'sem-chave');
});

teste('responderPergunta: emergência devolve só a mensagem do 192, sem busca nem sugestão', () => {
  assert.deepEqual(responderPergunta('socorro, ele desmaiou no ônibus', indice), {
    tipo: 'recusa',
    motivo: 'emergencia',
    mensagem: MENSAGEM_EMERGENCIA
  });
});

teste('responderPergunta: dados pessoais são recusados e o texto não volta', () => {
  const r = responderPergunta('meu cpf é 123.456.789-09, posso pedir o passe livre?', indice);
  assert.equal(r.tipo, 'recusa');
  assert.equal(JSON.stringify(r).includes('123'), false);
  assert.equal(JSON.stringify(r).includes('passe livre?'), false);
});

teste('responderPergunta: fora do tema tem mensagem própria', () => {
  const r = responderPergunta('receita de bolo de cenoura', indice);
  assert.equal(r.tipo, 'fora_do_tema');
  assert.equal(r.tipo === 'fora_do_tema' && r.mensagem, MENSAGEM_FORA_DO_TEMA);
});

teste('responderPergunta: do tema, mas fora da base → "Não encontrei isso na minha base"', () => {
  const r = responderPergunta('como funciona a isenção de IPVA para carro adaptado', indice);
  assert.equal(r.tipo, 'nao_encontrei');
  assert.equal(r.tipo === 'nao_encontrei' && r.mensagem, MENSAGEM_NAO_ENCONTREI);
});

teste('responderPergunta: o canal oficial vem da base, pelo id configurado', () => {
  const comCanal = responderPergunta('como funciona a isenção de IPVA', indice, { canalOficialId: 'central' });
  assert.equal(comCanal.tipo === 'nao_encontrei' && comCanal.canal?.id, 'central');
  const semCanal = responderPergunta('como funciona a isenção de IPVA', indice, { canalOficialId: null });
  assert.equal(semCanal.tipo === 'nao_encontrei' && semCanal.canal, null);
  const idErrado = responderPergunta('como funciona a isenção de IPVA', indice, { canalOficialId: 'nao-existe' });
  assert.equal(idErrado.tipo === 'nao_encontrei' && idErrado.canal, null);
});

teste('responderPergunta: o limite de resposta é configurável', () => {
  assert.equal(responderPergunta('cadeirante paga ônibus?', indice, { busca: { limiteResposta: 0.99 } }).tipo, 'nao_encontrei');
});

teste('responderPergunta: nenhum resultado carrega o texto da pergunta', () => {
  const pergunta = 'cadeirante paga ônibus mesmo? xyzpalavraunica';
  for (const busca of [{}, { limiteResposta: 0.99 }]) {
    const r = responderPergunta(pergunta, indice, { busca });
    assert.equal(JSON.stringify(r).includes('xyzpalavraunica'), false);
  }
});

teste('responderPergunta: base vazia não quebra', () => {
  assert.equal(responderPergunta('quem pode pedir o BPC?', criarIndice<Entrada>([])).tipo, 'nao_encontrei');
});

teste('ehAssuntoDificil: pedido negado ou cortado pede acolhimento antes da resposta', () => {
  assert.equal(ehAssuntoDificil('Negaram o BPC da minha mãe'), true);
  assert.equal(ehAssuntoDificil('meu pedido foi indeferido'), true);
  assert.equal(ehAssuntoDificil('Como peço o passe livre?'), false);
  const r = responderPergunta('negaram o passe livre no ônibus, e agora?', indice);
  assert.equal(r.tipo === 'resposta' && r.acolher, true);
});

teste('passosDaEntrada: usa passos da entrada; sem eles, monta com documentos e onde', () => {
  const base = KB[0];
  assert.deepEqual(passosDaEntrada({ ...base, passos: ['Um.'] }), ['Um.']);
  assert.deepEqual(passosDaEntrada({ ...base, documentos: ['RG', 'CPF'], onde: { texto: 'Posto de exemplo.' } }), [
    'Separe: RG, CPF.',
    'Faça o pedido: Posto de exemplo.'
  ]);
  assert.deepEqual(passosDaEntrada(base), []);
});
