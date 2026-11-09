import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { test as teste } from 'vitest';
import {
  avaliarCenarios,
  avaliarPerguntas,
  lerCsv,
  metricasCenarios,
  metricasPerguntas,
  resultadosCsv,
  validarCenarios,
  validarGabaritoPerguntas,
  type Cenario
} from '../src/core/avaliacao.ts';
import type { Entrada } from '../src/core/kb-schema.ts';

const ler = (rel: string) => readFileSync(fileURLToPath(new URL(`../${rel}`, import.meta.url)), 'utf8');

// Base fictícia de teste.
const entrada = (id: string, perguntas: string[], chaves: string[], objetivo: string, extra: Partial<Entrada> = {}): Entrada => ({
  id,
  tipo: 'direito',
  titulo: id,
  resumo: 'Resumo.',
  publico: ['pessoa com deficiência'],
  cidade: 'SP',
  condicoes: { todas: [{ campo: 'p_objetivo', em: [objetivo] }] },
  perguntas_exemplo: perguntas,
  palavras_chave: chaves,
  fonte_nome: 'Fonte',
  fonte_url: 'https://exemplo.gov.br',
  tipo_fonte: 'oficial',
  verificado_em: '2026-10-01',
  limitacao: 'Limitação.',
  ...extra
});
const KB = [
  entrada('passe', ['Como peço o passe livre no ônibus?'], ['passe livre', 'ônibus'], 'transporte'),
  entrada('beneficio', ['Quem pode receber o benefício mensal?'], ['benefício mensal', 'renda'], 'beneficio_financeiro', {
    condicoes: { todas: [{ campo: 'p_objetivo', em: ['beneficio_financeiro'] }, { campo: 'p_renda', em: ['ate_um_quarto', 'ate_meio'] }] }
  })
];
const IDS = new Set(KB.map((e) => e.id));

// ---------- CSV ----------

teste('lerCsv: aspas, vírgula dentro de aspas, aspas dobradas, comentários e BOM', () => {
  const t = '﻿pergunta,id_esperado,grupo\n# comentário\n"Olá, tudo bem?",RECUSAR,ajuste\n"Ele disse ""oi""",passe,teste\n\n';
  assert.deepEqual(lerCsv(t), [
    { pergunta: 'Olá, tudo bem?', id_esperado: 'RECUSAR', grupo: 'ajuste' },
    { pergunta: 'Ele disse "oi"', id_esperado: 'passe', grupo: 'teste' }
  ]);
});

// ---------- arquivos reais ----------

teste('gabaritos reais: são válidos para a base atual', () => {
  const kb = JSON.parse(ler('data/kb.json')) as Entrada[];
  const ids = new Set(kb.map((e) => e.id));
  assert.deepEqual(validarGabaritoPerguntas(lerCsv(ler('eval/gabarito_perguntas.csv')), ids).erros, []);
  assert.deepEqual(validarCenarios(JSON.parse(ler('eval/gabarito_cenarios.json')), ids).erros, []);
});

// ---------- (a) perguntas ----------

teste('validarGabaritoPerguntas: id inexistente, grupo errado e linha vazia são apontados', () => {
  const { erros } = validarGabaritoPerguntas(
    [
      { pergunta: 'x', id_esperado: 'nao-existe', grupo: 'teste' },
      { pergunta: 'y', id_esperado: 'passe', grupo: 'treino' },
      { pergunta: '', id_esperado: '', grupo: 'ajuste' }
    ],
    IDS
  );
  assert.equal(erros.length, 4);
  assert.match(erros[0], /linha 2.*nao-existe/);
});

teste('avaliarPerguntas e métricas: acerto geral, por grupo, por tema, recusas e erros', () => {
  const casos = [
    { pergunta: 'como peço o passe livre no ônibus', esperado: 'passe', grupo: 'ajuste' as const },
    { pergunta: 'quem pode receber o benefício mensal', esperado: 'beneficio', grupo: 'teste' as const },
    { pergunta: 'quem pode receber o benefício mensal', esperado: 'passe', grupo: 'teste' as const },
    { pergunta: 'ele desmaiou', esperado: 'RECUSAR', grupo: 'ajuste' as const },
    { pergunta: 'como peço o passe livre', esperado: 'RECUSAR', grupo: 'teste' as const }
  ];
  const rs = avaliarPerguntas(casos, KB);
  assert.deepEqual(rs.map((r) => [r.obtido, r.acertou]), [
    ['passe', true],
    ['beneficio', true],
    ['beneficio', false],
    ['recusa:emergencia', true],
    ['passe', false]
  ]);
  const m = metricasPerguntas(rs);
  assert.deepEqual(m.geral, { acertos: 3, total: 5, taxa: 0.6 });
  assert.deepEqual(m.porGrupo.teste, { acertos: 1, total: 3, taxa: 1 / 3 });
  assert.deepEqual(m.porTema.transporte, { acertos: 1, total: 2, taxa: 0.5 });
  assert.deepEqual(m.recusasCorretas, { acertos: 1, total: 2, taxa: 0.5 });
  assert.equal(m.erros.length, 2);
});

teste('avaliarPerguntas: o esperado entre as sugestões conta no top-3, não no acerto', () => {
  const kb = [
    entrada('a', ['passe livre ônibus metrô'], ['passe livre'], 'transporte'),
    entrada('b', ['passe livre ônibus'], ['passe livre', 'ônibus'], 'transporte')
  ];
  const [r] = avaliarPerguntas([{ pergunta: 'passe livre no ônibus', esperado: 'a', grupo: 'teste' }], kb);
  assert.equal(r.obtido, 'b');
  assert.equal(r.acertou, false);
  assert.equal(r.acertouNoTop3, true);
});

teste('metricasPerguntas: recusa indevida conta quando havia resposta e o assistente não respondeu', () => {
  const rs = avaliarPerguntas([{ pergunta: 'isenção de IPVA para carro', esperado: 'passe', grupo: 'teste' }], KB);
  assert.equal(rs[0].obtido, 'nao_encontrei');
  assert.deepEqual(metricasPerguntas(rs).recusasIndevidas, { acertos: 1, total: 1, taxa: 1 });
});

teste('métricas sem casos ficam null, não 0', () => {
  const m = metricasPerguntas([]);
  assert.equal(m.geral.taxa, null);
  assert.equal(m.porGrupo.teste.taxa, null);
});

// ---------- (b) cenários ----------

const cenario = (id: string, respostas: Cenario['respostas'], esperados: string[]): Cenario => ({ id, descricao: id, respostas, esperados, grupo: 'teste' });

teste('validarCenarios: pergunta, valor e id esperado precisam existir', () => {
  const { erros, cenarios } = validarCenarios(
    [
      { id: 'ok', descricao: 'ok', grupo: 'teste', respostas: { p_objetivo: 'transporte', p_necessidade: ['mobilidade'] }, esperados: ['passe'] },
      { id: 'ruim', descricao: 'x', grupo: 'teste', respostas: { p_idade: '30', p_objetivo: 'viajar', p_quem: ['eu'] }, esperados: ['nao-existe'] }
    ],
    IDS
  );
  assert.equal(cenarios.length, 1);
  const texto = erros.join(' | ');
  for (const t of ['p_idade', 'viajar', 'escolha única', 'nao-existe']) assert.ok(texto.includes(t), t);
});

teste('avaliarCenarios: precisão e cobertura por cenário e no total (micro)', () => {
  const cs = [
    cenario('so-transporte', { p_objetivo: 'transporte' }, ['passe']),
    cenario('beneficio-renda', { p_objetivo: 'beneficio_financeiro', p_renda: 'ate_meio' }, ['beneficio', 'passe']),
    cenario('nada', { p_objetivo: 'escola' }, [])
  ];
  const rs = avaliarCenarios(cs, KB);
  assert.deepEqual(rs.map((r) => [r.previstos, r.precisao, r.cobertura]), [
    [['passe'], 1, 1],
    [['beneficio'], 1, 0.5],
    [[], null, null]
  ]);
  const m = metricasCenarios(rs);
  assert.equal(m.precisao, 1);
  assert.equal(m.cobertura, 2 / 3);
  assert.deepEqual(m.exatos, { acertos: 2, total: 3, taxa: 2 / 3 });
});

teste('avaliarCenarios: com "Talvez" incluído, a resposta "Não sei" entra nos previstos', () => {
  const cs = [cenario('renda-nao-sei', { p_objetivo: 'beneficio_financeiro', p_renda: 'nao_sei' }, ['beneficio'])];
  assert.deepEqual(avaliarCenarios(cs, KB)[0].previstos, []);
  assert.deepEqual(avaliarCenarios(cs, KB, true)[0].previstos, ['beneficio']);
});

teste('resultadosCsv: uma linha por pergunta e por cenário, com cabeçalho', () => {
  const rp = avaliarPerguntas([{ pergunta: 'Olá, "passe livre" no ônibus', esperado: 'passe', grupo: 'ajuste' }], KB);
  const rc = avaliarCenarios([cenario('c1', { p_objetivo: 'transporte' }, ['passe'])], KB);
  const csv = resultadosCsv(rp, rc, rc).trim().split('\n');
  assert.equal(csv[0], 'tipo,id_ou_pergunta,grupo,tema,esperado,obtido,acertou,pontuacao,precisao,cobertura');
  assert.match(csv[1], /^pergunta,"Olá, ""passe livre"" no ônibus",ajuste,transporte,passe,passe,sim,/);
  assert.equal(csv[2], 'cenario_pode,c1,teste,,passe,passe,sim,,1,1');
  assert.equal(csv.length, 4);
});

teste('avaliarPerguntas: RECUSAR também acerta com "fora do tema" e "não encontrei"', () => {
  const rs = avaliarPerguntas(
    [
      { pergunta: 'receita de bolo de cenoura', esperado: 'RECUSAR', grupo: 'teste' },
      { pergunta: 'isenção de IPVA para carro', esperado: 'RECUSAR', grupo: 'teste' }
    ],
    KB
  );
  assert.deepEqual(rs.map((r) => [r.obtido, r.acertou]), [
    ['fora_do_tema', true],
    ['nao_encontrei', true]
  ]);
});
