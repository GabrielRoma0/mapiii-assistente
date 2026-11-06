import assert from 'node:assert/strict';
import { test as teste } from 'vitest';
import { canaisDeReclamacao, gerarTextoReclamacao, validarReclamacao, OCORRIDOS, type DadosReclamacao, type Ocorrido } from '../src/core/reclamacao.ts';
import type { Entrada } from '../src/core/kb-schema.ts';

const HOJE = new Date('2026-11-05T15:00:00Z');
const base: DadosReclamacao = { linha: '8000-10', data: '2026-11-04', hora: '14:30', prefixo: '11433', ocorrido: 'rampa_elevador' };

// ---------- validação ----------

teste('validarReclamacao: dados completos passam; hora e prefixo são opcionais', () => {
  assert.deepEqual(validarReclamacao(base, HOJE), {});
  assert.deepEqual(validarReclamacao({ ...base, hora: '', prefixo: '' }, HOJE), {});
  assert.deepEqual(validarReclamacao({ linha: 'Lapa', data: '2026-11-05', ocorrido: 'outro' }, HOJE), {});
});

teste('validarReclamacao: aponta cada campo errado com mensagem simples', () => {
  const e = validarReclamacao({ linha: '', data: '2026-11-06', hora: '25:00', prefixo: 'ABC', ocorrido: 'xingou' }, HOJE);
  assert.deepEqual(Object.keys(e).sort(), ['data', 'hora', 'linha', 'ocorrido', 'prefixo']);
  assert.match(e.data!, /futuro/);
  assert.match(validarReclamacao({ ...base, data: '2025-01-01' }, HOJE).data!, /último ano/);
  assert.ok(validarReclamacao({ ...base, data: '2026-02-31' }, HOJE).data);
});

teste('validarReclamacao: não há campo onde caiba nome, CPF, telefone ou e-mail', () => {
  for (const linha of ['Maria Silva', '123.456.789-09', 'a@b.com', '(11)91234-5678']) assert.ok(validarReclamacao({ ...base, linha }, HOJE).linha, linha);
  for (const prefixo of ['12345678909', 'Maria', '123.456']) assert.ok(validarReclamacao({ ...base, prefixo }, HOJE).prefixo, prefixo);
  assert.deepEqual(Object.keys(validarReclamacao(base, HOJE)), []);
  assert.deepEqual(Object.keys(base).sort(), ['data', 'hora', 'linha', 'ocorrido', 'prefixo']);
});

// ---------- texto ----------

teste('gerarTextoReclamacao: texto completo, factual e com espaço para nome e contato preenchidos fora do app', () => {
  assert.equal(
    gerarTextoReclamacao(base),
    [
      'Assunto: Problema de acessibilidade no ônibus da linha 8000-10',
      '',
      'Em 04/11/2026, por volta das 14h30, na linha 8000-10 (veículo de prefixo 11433), a rampa ou o elevador de acesso do veículo não funcionou no momento do embarque de uma pessoa com deficiência.',
      '',
      'Peço que a ocorrência seja registrada e verificada, e que eu receba um retorno sobre as providências tomadas.',
      '',
      'Nome: (preencha ao enviar)',
      'Contato para resposta: (preencha ao enviar)'
    ].join('\n')
  );
});

teste('gerarTextoReclamacao: sem hora e sem prefixo, a frase continua correta', () => {
  const t = gerarTextoReclamacao({ linha: 'Lapa', data: '2026-11-05', ocorrido: 'nao_parou' });
  assert.match(t, /^Assunto: .* linha Lapa\n\nEm 05\/11\/2026, na linha Lapa, o veículo não parou no ponto/);
});

teste('gerarTextoReclamacao: nunca cita lei, nunca acusa e nunca traz dado pessoal', () => {
  for (const ocorrido of Object.keys(OCORRIDOS) as Ocorrido[]) {
    const t = gerarTextoReclamacao({ ...base, ocorrido });
    assert.doesNotMatch(t, /\b(lei|decreto|portaria|resolução|art\.|artigo|constituição|estatuto|LBI|13\.146)\b/i, ocorrido);
    assert.doesNotMatch(t, /\b(culpa|negligên|descaso|absurd|desrespeit|motorista|cobrador|crime|ilegal|irregular)\w*/i, ocorrido);
    assert.doesNotMatch(t, /\d{3}\.?\d{3}\.?\d{3}-?\d{2}|@|\(\d{2}\)/, ocorrido);
  }
});

// ---------- onde enviar ----------

const ficha = (id: string, extra: Partial<Entrada> = {}): Entrada => ({
  id,
  tipo: 'servico',
  titulo: `Canal ${id}`,
  resumo: 'Resumo.',
  publico: ['cidadãos em geral'],
  cidade: 'SP',
  perguntas_exemplo: ['x'],
  palavras_chave: ['x'],
  onde: { texto: 'Atendimento de exemplo.', link: 'https://exemplo.gov.br/reclamar' },
  fonte_nome: 'Fonte',
  fonte_url: 'https://exemplo.gov.br',
  tipo_fonte: 'oficial',
  verificado_em: '2026-10-01',
  limitacao: 'Limitação.',
  ...extra
});

teste('canaisDeReclamacao: só fichas oficiais e verificadas, na ordem configurada', () => {
  const kb = [
    ficha('oficial-a'),
    ficha('secundaria', { tipo_fonte: 'secundaria' }),
    ficha('desatualizada', { tipo_fonte: 'desatualizada' }),
    ficha('velha', { verificado_em: '2025-01-10' }),
    ficha('sem-onde', { onde: undefined }),
    ficha('oficial-b')
  ];
  const ids = ['oficial-b', 'secundaria', 'desatualizada', 'velha', 'sem-onde', 'nao-existe', 'oficial-a'];
  assert.deepEqual(canaisDeReclamacao(kb, ids, HOJE).map((e) => e.id), ['oficial-b', 'oficial-a']);
});

teste('canaisDeReclamacao: sem ids configurados ou sem ficha oficial, nada aparece (a tela desabilita)', () => {
  assert.deepEqual(canaisDeReclamacao([ficha('a')], [], HOJE), []);
  assert.deepEqual(canaisDeReclamacao([ficha('a', { tipo_fonte: 'secundaria' })], ['a'], HOJE), []);
});
