import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { test as teste } from 'vitest';
import { validarProjeto, type Projeto } from '../src/core/projeto.ts';

const valido: Projeto = {
  problema: 'A informação existe, mas está espalhada.',
  persona: null,
  como_testamos: ['Teste com 5 a 8 pessoas.'],
  numeros: [{ rotulo: 'Recusas corretas', valor: '12 de 12', fonte: 'eval/resultados.csv' }],
  equipe: ['Thor', 'Gabriel'],
  visao_de_futuro: 'Mapa de calçadas feito por quem passa por elas.'
};

teste('projeto: dados completos e corretos passam', () => {
  assert.deepEqual(validarProjeto(valido), []);
});

teste('projeto: o arquivo data/projeto.json é válido', () => {
  const dados = JSON.parse(readFileSync(new URL('../data/projeto.json', import.meta.url), 'utf8'));
  assert.deepEqual(validarProjeto(dados), []);
});

teste('projeto: número sem fonte é recusado (nenhum número sem origem)', () => {
  const erros = validarProjeto({ ...valido, numeros: [{ rotulo: 'Acerto', valor: '90%', fonte: '' }] });
  assert.ok(erros.some((e) => e.includes('fonte')), erros.join('; '));
});

teste('projeto: "você tem direito" é recusado em qualquer campo', () => {
  const erros = validarProjeto({ ...valido, visao_de_futuro: 'Aqui você tem direito a tudo.' });
  assert.ok(erros.some((e) => e.includes('tem direito')), erros.join('; '));
});

teste('projeto: texto com dado pessoal (e-mail, telefone ou CPF) é recusado', () => {
  const erros = validarProjeto({ ...valido, persona: 'Maria, maria@exemplo.com.br' });
  assert.ok(erros.some((e) => e.includes('pessoal')), erros.join('; '));
});

teste('projeto: campo desconhecido ou de tipo errado é erro', () => {
  assert.ok(validarProjeto({ ...valido, extra: 1 }).length > 0);
  assert.ok(validarProjeto({ ...valido, equipe: 'Thor' }).length > 0);
  assert.ok(validarProjeto(null).length > 0);
});
