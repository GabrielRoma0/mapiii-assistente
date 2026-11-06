import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { test as teste } from 'vitest';
import { deveAvisar, mudouOProximo, resumirPonto, type LinhaNoPonto } from '../supabase/functions/_shared/embarque.ts';
import { guardarUltimoPonto, lerUltimosPontos } from '../src/core/lembrar.ts';
import { consultarExemplo, type DadosExemplo } from '../src/app/embarque/exemplo.ts';
import type { Armazenamento } from '../src/core/registro.ts';

const linhas = (vs: [string, string, boolean, string][]): LinhaNoPonto[] =>
  vs.map(([letreiro, prefixo, acessivel, previsto]) => ({ codigo: 1, letreiro, sentido: 1, destino: 'D', veiculos: [{ prefixo, acessivel, previsto }] }));

teste('mudouOProximo: só quando o próximo acessível é outro ônibus (ou aparece/some)', () => {
  const a = resumirPonto(linhas([['8000-10', '111', true, '10:10']]), '10:00');
  const mesmoMaisPerto = resumirPonto(linhas([['8000-10', '111', true, '10:10']]), '10:01');
  const outro = resumirPonto(linhas([['9000-10', '222', true, '10:05']]), '10:00');
  const nenhum = resumirPonto(linhas([['9000-10', '222', false, '10:05']]), '10:00');
  assert.equal(mudouOProximo(a, mesmoMaisPerto), false);
  assert.equal(mudouOProximo(a, outro), true);
  assert.equal(mudouOProximo(a, nenhum), true);
  assert.equal(mudouOProximo(null, a), true);
});

teste('deveAvisar: avisa uma vez por ônibus, só a 2 minutos ou menos', () => {
  const longe = resumirPonto(linhas([['8000-10', '111', true, '10:05']]), '10:00');
  const perto = resumirPonto(linhas([['8000-10', '111', true, '10:02']]), '10:00');
  const agora = resumirPonto(linhas([['8000-10', '111', true, '10:00']]), '10:00');
  assert.equal(deveAvisar(longe, null), null);
  const aviso = deveAvisar(perto, null)!;
  assert.deepEqual(aviso, { chave: '8000-10|111', frase: 'O ônibus 8000-10 acessível chega em 2 min.' });
  assert.equal(deveAvisar(perto, aviso.chave), null, 'não repete para o mesmo ônibus');
  assert.equal(deveAvisar(agora, null)!.frase, 'O ônibus 8000-10 acessível está chegando agora.');
  assert.equal(deveAvisar(resumirPonto(linhas([['8000-10', '111', false, '10:01']]), '10:00'), null), null);
});

function falso(): Armazenamento {
  const d = new Map<string, string>();
  return { getItem: (k) => d.get(k) ?? null, setItem: (k, v) => void d.set(k, v), removeItem: (k) => void d.delete(k) };
}

teste('últimos pontos: o mais recente primeiro, sem repetir, no máximo 3; bloqueado não quebra', () => {
  const arm = falso();
  for (const [codigo, nome] of [[1, 'A'], [2, 'B'], [3, 'C'], [2, 'B'], [4, 'D']] as const) guardarUltimoPonto(arm, { codigo, nome });
  assert.deepEqual(lerUltimosPontos(arm), [{ codigo: 4, nome: 'D' }, { codigo: 2, nome: 'B' }, { codigo: 3, nome: 'C' }]);
  arm.setItem('mapiii.pontos.v1', '[{"codigo":"x"},{"codigo":5,"nome":"E","lat":1}]');
  assert.deepEqual(lerUltimosPontos(arm), [{ codigo: 5, nome: 'E' }]);
  assert.deepEqual(lerUltimosPontos(null), []);
  const bloqueado: Armazenamento = { getItem: () => { throw new Error(); }, setItem: () => { throw new Error(); }, removeItem: () => {} };
  assert.doesNotThrow(() => guardarUltimoPonto(bloqueado, { codigo: 1, nome: 'A' }));
});

const DADOS = JSON.parse(readFileSync(fileURLToPath(new URL('../data/embarque-exemplo.json', import.meta.url)), 'utf8')) as DadosExemplo;

teste('exemplo: com a âncora no início da consulta, os minutos diminuem com o tempo', () => {
  const inicio = new Date('2026-11-06T15:00:00Z');
  const depois = new Date('2026-11-06T15:03:00Z');
  const r = consultarExemplo({ acao: 'previsao', codigo: 900101 }, DADOS, depois, inicio);
  assert.ok(r.ok && r.acao === 'previsao');
  assert.equal(resumirPonto(r.linhas, r.horaReferencia!).proximaAcessivel!.minutos, 11);
});
