import assert from 'node:assert/strict';
import { test as teste } from 'vitest';
import { jaccard, criarIndice, buscar, type EntradaBuscavel } from '../src/core/busca.ts';

// Base fictícia só para os testes: não depende de data/kb.json.
const KB = [
  {
    id: 'largura-calcada',
    tema: 'Normas e medidas',
    perguntas_exemplo: ['Qual a largura mínima de uma calçada?', 'Quanto a calçada precisa medir de largura?'],
    palavras_chave: ['largura', 'medida', 'faixa livre', 'calçada']
  },
  {
    id: 'estacionar-calcada',
    tema: 'Obstáculo e veículo',
    perguntas_exemplo: ['Posso estacionar o carro na calçada?', 'Carro parado na calçada é infração?'],
    palavras_chave: ['estacionar', 'carro', 'veículo', 'multa', 'calçada']
  },
  {
    id: 'piso-tatil',
    tema: 'Calçada e rampa',
    perguntas_exemplo: ['Para que serve o piso tátil?'],
    palavras_chave: ['piso tátil', 'deficiência visual', 'calçada']
  },
  {
    id: 'pedir-reparo',
    tema: 'Como pedir reparo',
    perguntas_exemplo: ['Como peço o conserto de um buraco na calçada?', 'Onde reclamo de calçada quebrada?'],
    palavras_chave: ['reparo', 'conserto', 'buraco', 'reclamar', 'prefeitura', 'calçada']
  }
];
const indice = criarIndice(KB);

teste('jaccard: conjuntos iguais dão 1 e disjuntos dão 0', () => {
  assert.equal(jaccard(['a', 'b'], ['b', 'a']), 1);
  assert.equal(jaccard(['a'], ['b']), 0);
});

teste('jaccard: {a,b} contra {b,c} dá 1/3', () => {
  assert.equal(jaccard(['a', 'b'], ['b', 'c']), 1 / 3);
});

teste('jaccard: listas vazias dão 0, sem dividir por zero', () => {
  assert.equal(jaccard([], []), 0);
  assert.equal(jaccard(['a'], []), 0);
});

teste('buscar: pergunta igual a um exemplo acha a entrada certa', () => {
  const r = buscar('Posso estacionar o carro na calçada?', indice);
  assert.equal(r.encontrou, true);
  assert.equal(r.melhor!.entrada.id, 'estacionar-calcada');
});

teste('buscar: pergunta parafraseada acha a entrada pelas palavras-chave', () => {
  const r = buscar('onde reclamar na prefeitura de um buraco', indice);
  assert.equal(r.melhor!.entrada.id, 'pedir-reparo');
});

teste('buscar: ignora caixa, acento e plural', () => {
  const r = buscar('QUAL A LARGURA DAS CALCADAS?', indice);
  assert.equal(r.melhor!.entrada.id, 'largura-calcada');
});

teste('buscar: palavra-chave com duas palavras casa com a pergunta sem acento', () => {
  const r = buscar('piso tatil', indice);
  assert.equal(r.melhor!.entrada.id, 'piso-tatil');
});

teste('buscar: palavra rara pesa mais que a palavra que está em quase todas as entradas', () => {
  // Sem perguntas de exemplo, só o IDF decide. A entrada comum vem primeiro na base:
  // se o IDF fosse ignorado, o empate a favoriria.
  const comum = (id: string) => ({ id, tema: 't', perguntas_exemplo: [] as string[], palavras_chave: ['calçada'] });
  const idx = criarIndice([
    comum('comum-1'),
    { id: 'rara', tema: 't', perguntas_exemplo: [], palavras_chave: ['semáforo'] },
    comum('comum-2'),
    comum('comum-3')
  ]);
  const r = buscar('semáforo calçada', idx, { limiteResposta: 0 });
  assert.equal(r.melhor!.entrada.id, 'rara');
});

teste('buscar: pergunta sem relação com a base não é encontrada', () => {
  const r = buscar('receita de bolo de cenoura', indice);
  assert.equal(r.encontrou, false);
  assert.equal(r.melhor, null);
});

teste('buscar: a pontuação fica entre 0 e 1', () => {
  for (const q of ['Posso estacionar o carro na calçada?', 'calçada', 'bolo']) {
    const r = buscar(q, indice);
    for (const s of r.ranking) assert.ok(s.pontuacao >= 0 && s.pontuacao <= 1, `${q}: ${s.pontuacao}`);
  }
});

teste('buscar: devolve até 2 sugestões, sem repetir a melhor e em ordem decrescente', () => {
  const r = buscar('calçada', indice);
  assert.ok(r.sugestoes.length <= 2);
  assert.ok(r.sugestoes.every((s) => s.entrada.id !== r.melhor?.entrada.id));
  for (let i = 1; i < r.sugestoes.length; i++) {
    assert.ok(r.sugestoes[i - 1].pontuacao >= r.sugestoes[i].pontuacao);
  }
});

teste('buscar: o limite de resposta é configurável', () => {
  const pergunta = 'carro na calçada';
  const frouxo = buscar(pergunta, indice, { limiteResposta: 0.05 });
  const rigido = buscar(pergunta, indice, { limiteResposta: 0.95 });
  assert.equal(frouxo.encontrou, true);
  assert.equal(rigido.encontrou, false);
});

teste('buscar: abaixo do limite ainda oferece sugestões acima do limite de sugestão', () => {
  const r = buscar('carro na calçada', indice, { limiteResposta: 0.95, limiteSugestao: 0.05 });
  assert.equal(r.encontrou, false);
  assert.ok(r.sugestoes.length >= 1);
});

teste('buscar: em empate, vence a entrada que aparece primeiro na base', () => {
  const dupla = criarIndice([
    { id: 'primeira', tema: 't', perguntas_exemplo: ['rampa'], palavras_chave: ['rampa'] },
    { id: 'segunda', tema: 't', perguntas_exemplo: ['rampa'], palavras_chave: ['rampa'] }
  ]);
  assert.equal(buscar('rampa', dupla).melhor!.entrada.id, 'primeira');
});

teste('buscar: base vazia não quebra', () => {
  const r = buscar('rampa', criarIndice([]));
  assert.equal(r.encontrou, false);
  assert.deepEqual(r.sugestoes, []);
});

teste('buscar: entrada sem perguntas_exemplo ou palavras_chave não quebra', () => {
  const parcial = criarIndice<{ id: string } & EntradaBuscavel>([{ id: 'x' }]);
  assert.equal(buscar('rampa', parcial).encontrou, false);
});
