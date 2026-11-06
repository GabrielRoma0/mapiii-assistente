import assert from 'node:assert/strict';
import { test as teste } from 'vitest';
import { boasVindasVistas, marcarBoasVindas } from '../src/core/preferencias.ts';
import type { Armazenamento } from '../src/core/registro.ts';

teste('boas-vindas: aparecem até a pessoa tocar em Entendi; bloqueado não quebra (aparecem de novo)', () => {
  const d = new Map<string, string>();
  const arm: Armazenamento = { getItem: (k) => d.get(k) ?? null, setItem: (k, v) => void d.set(k, v), removeItem: (k) => void d.delete(k) };
  assert.equal(boasVindasVistas(arm), false);
  marcarBoasVindas(arm);
  assert.equal(boasVindasVistas(arm), true);
  assert.equal(boasVindasVistas(null), false);
  const bloqueado: Armazenamento = { getItem: () => { throw new Error(); }, setItem: () => { throw new Error(); }, removeItem: () => {} };
  assert.equal(boasVindasVistas(bloqueado), false);
  assert.doesNotThrow(() => marcarBoasVindas(bloqueado));
});
