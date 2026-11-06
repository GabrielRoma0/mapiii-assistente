import assert from 'node:assert/strict';
import { test as teste } from 'vitest';
import { VELOCIDADES, guardarVelocidade, lerVelocidade, proximoIndice } from '../src/core/varredura.ts';
import type { Armazenamento } from '../src/core/registro.ts';

teste('proximoIndice: avança e volta ao primeiro depois do último; lista vazia não quebra', () => {
  assert.equal(proximoIndice(-1, 3), 0);
  assert.equal(proximoIndice(0, 3), 1);
  assert.equal(proximoIndice(2, 3), 0);
  assert.equal(proximoIndice(7, 3), 0, 'a tela mudou e ficou com menos itens');
  assert.equal(proximoIndice(0, 0), -1);
});

teste('velocidade: lenta, média e rápida (4 s, 2,5 s, 1,5 s); padrão média; guardada no aparelho', () => {
  assert.deepEqual(VELOCIDADES, { lenta: 4000, media: 2500, rapida: 1500 });
  const d = new Map<string, string>();
  const arm: Armazenamento = { getItem: (k) => d.get(k) ?? null, setItem: (k, v) => void d.set(k, v), removeItem: (k) => void d.delete(k) };
  assert.equal(lerVelocidade(arm), 'media');
  guardarVelocidade(arm, 'lenta');
  assert.equal(lerVelocidade(arm), 'lenta');
  d.set('mapiii.varredura.v1', 'turbo');
  assert.equal(lerVelocidade(arm), 'media');
  assert.equal(lerVelocidade(null), 'media');
});
