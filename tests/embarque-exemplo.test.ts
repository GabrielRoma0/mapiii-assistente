import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { test as teste } from 'vitest';
import { consultarExemplo, validarExemplo, SELO_EXEMPLO, type DadosExemplo } from '../src/app/embarque/exemplo.ts';
import { resumirVeiculos } from '../supabase/functions/_shared/embarque.ts';

const DADOS = JSON.parse(readFileSync(fileURLToPath(new URL('../data/embarque-exemplo.json', import.meta.url)), 'utf8')) as DadosExemplo;
const AGORA = new Date('2026-11-05T15:00:00Z');

teste('embarque-exemplo.json: válido e claramente fictício', () => {
  assert.deepEqual(validarExemplo(DADOS), []);
  assert.equal(SELO_EXEMPLO, 'EXEMPLO, não é dado real');
});

teste('validarExemplo: recusa letreiro que pareça linha real e descrição sem EXEMPLO', () => {
  const ruim = structuredClone(DADOS);
  ruim.linhas[0].letreiro = '8000-10';
  ruim.linhas[1].descricao = 'TERMINAL LAPA';
  ruim.aviso = 'Dados da SPTrans.';
  const e = validarExemplo(ruim).join(' | ');
  for (const t of ['letreiro', 'descricao', 'aviso']) assert.ok(e.includes(t), t);
});

teste('consultarExemplo: busca pelo letreiro, pela descrição ou pela palavra "exemplo", sem acento', () => {
  const porLetreiro = consultarExemplo({ acao: 'linhas', termo: 'ex01' }, DADOS, AGORA);
  assert.ok(porLetreiro.ok && porLetreiro.acao === 'linhas' && porLetreiro.linhas.length === 2);
  const porNome = consultarExemplo({ acao: 'linhas', termo: 'estacao' }, DADOS, AGORA);
  assert.ok(porNome.ok && porNome.acao === 'linhas' && porNome.linhas[0].letreiro === 'EX03-10');
  const todas = consultarExemplo({ acao: 'linhas', termo: 'exemplo' }, DADOS, AGORA);
  assert.ok(todas.ok && todas.acao === 'linhas' && todas.linhas.length === DADOS.linhas.length);
  assert.equal(JSON.stringify(todas).includes('segundos_atras'), false);
  assert.equal((consultarExemplo({ acao: 'linhas', termo: '8000' }, DADOS, AGORA) as { erro: string }).erro, 'linha_inexistente');
});

teste('consultarExemplo: veículos com horários relativos a agora, e os cenários de demonstração', () => {
  const r = consultarExemplo({ acao: 'veiculos', codigo: 900001 }, DADOS, AGORA);
  assert.ok(r.ok && r.acao === 'veiculos');
  const resumo = resumirVeiculos(r.veiculos, AGORA)!;
  assert.equal(`${resumo.acessiveis} de ${resumo.total}`, '3 de 5');
  assert.equal(resumo.desatualizado, false);
  assert.equal(resumo.lista.filter((v) => v.desatualizado).length, 1, 'um veículo com posição velha');
  const velha = consultarExemplo({ acao: 'veiculos', codigo: 900003 }, DADOS, AGORA);
  assert.ok(velha.ok && velha.acao === 'veiculos' && resumirVeiculos(velha.veiculos, AGORA)!.desatualizado, 'linha com dado desatualizado');
  assert.equal((consultarExemplo({ acao: 'veiculos', codigo: 900004 }, DADOS, AGORA) as { erro: string }).erro, 'sem_veiculos');
  assert.equal((consultarExemplo({ acao: 'veiculos', codigo: 1 }, DADOS, AGORA) as { erro: string }).erro, 'linha_inexistente');
});
