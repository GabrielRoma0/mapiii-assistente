import assert from 'node:assert/strict';
import { test as teste } from 'vitest';
import { CHAVE_TAMANHO, ESCALAS, guardarTamanho, lerTamanho } from '../src/core/tamanho.ts';
import type { Armazenamento } from '../src/core/registro.ts';

function falso(): Armazenamento & { d: Map<string, string> } {
  const d = new Map<string, string>();
  return { d, getItem: (k) => d.get(k) ?? null, setItem: (k, v) => void d.set(k, v), removeItem: (k) => void d.delete(k) };
}

teste('tamanho do texto: A, A+ e A++ valem 100%, 115% e 130%', () => {
  assert.deepEqual(ESCALAS, { normal: 1, grande: 1.15, maior: 1.3 });
});

teste('tamanho do texto: guarda só a escolha; valor estranho ou bloqueado volta ao normal', () => {
  const arm = falso();
  assert.equal(lerTamanho(arm), 'normal');
  guardarTamanho(arm, 'maior');
  assert.equal(arm.d.get(CHAVE_TAMANHO), 'maior');
  assert.equal(lerTamanho(arm), 'maior');
  arm.setItem(CHAVE_TAMANHO, 'gigante');
  assert.equal(lerTamanho(arm), 'normal');
  assert.equal(lerTamanho(null), 'normal');
  const bloqueado: Armazenamento = { getItem: () => { throw new Error(); }, setItem: () => { throw new Error(); }, removeItem: () => {} };
  assert.equal(lerTamanho(bloqueado), 'normal');
  assert.doesNotThrow(() => guardarTamanho(bloqueado, 'grande'));
});
