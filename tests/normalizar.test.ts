import assert from 'node:assert/strict';
import { test as teste } from 'vitest';
import { normalizar, tokenizar } from '../src/core/normalizar.ts';

teste('normalizar: põe em minúsculas e remove acentos', () => {
  assert.equal(normalizar('Calçada ÀS Árvores'), 'calcada as arvores');
});

teste('normalizar: remove cedilha, til e trema', () => {
  assert.equal(normalizar('ação ônibus pinguim lingüiça'), 'acao onibus pinguim linguica');
});

teste('normalizar: troca pontuação por espaço e junta espaços repetidos', () => {
  assert.equal(normalizar('  rampa,  de   acesso!? '), 'rampa de acesso');
});

teste('normalizar: mantém números', () => {
  assert.equal(normalizar('NBR 9050'), 'nbr 9050');
});

teste('normalizar: valor que não é texto vira string vazia', () => {
  assert.equal(normalizar(null), '');
  assert.equal(normalizar(undefined), '');
  assert.equal(normalizar(42), '');
});

teste('tokenizar: tira palavras vazias do português', () => {
  assert.deepEqual(tokenizar('Qual é a largura da calçada?'), ['largura', 'calcada']);
});

teste('tokenizar: mantém "sem" e "não", que mudam o sentido', () => {
  assert.deepEqual(tokenizar('calçada sem rampa'), ['calcada', 'sem', 'rampa']);
  assert.ok(tokenizar('não pode').includes('nao'));
});

teste('tokenizar: reduz plural simples ao singular', () => {
  assert.deepEqual(tokenizar('calçadas rampas veículos'), ['calcada', 'rampa', 'veiculo']);
});

teste('tokenizar: reduz plural em -ões e -ns', () => {
  assert.deepEqual(tokenizar('obrigações ordens'), ['obrigacao', 'ordem']);
});

teste('tokenizar: não corta o s de palavras como ônibus', () => {
  assert.deepEqual(tokenizar('ônibus'), ['onibus']);
});

teste('tokenizar: mantém números como token', () => {
  assert.deepEqual(tokenizar('norma NBR 9050'), ['norma', 'nbr', '9050']);
});

teste('tokenizar: descarta letra solta', () => {
  assert.deepEqual(tokenizar('rampa x'), ['rampa']);
});

teste('tokenizar: texto vazio ou inválido dá lista vazia', () => {
  assert.deepEqual(tokenizar(''), []);
  assert.deepEqual(tokenizar(null), []);
  assert.deepEqual(tokenizar('?!...'), []);
});

teste('tokenizar: ignora abreviações de mensagem e o nome da cidade', () => {
  assert.deepEqual(tokenizar('q tbm pq mto qm vc kkk pro sp São Paulo ônibus'), ['onibus']);
});

teste('tokenizar: junta formas da mesma palavra', () => {
  assert.deepEqual(tokenizar('deficiente PcD deficiência'), ['deficiencia', 'deficiencia', 'deficiencia']);
  assert.deepEqual(tokenizar('de graça grátis gratuita gratuidade'), ['gratuito', 'gratuito', 'gratuito', 'gratuito']);
  assert.deepEqual(tokenizar('renova renovação denuncio denúncia reclamo reclamação'), ['renovar', 'renovar', 'denunciar', 'denunciar', 'reclamar', 'reclamar']);
});
