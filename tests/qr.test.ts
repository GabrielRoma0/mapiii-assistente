import assert from 'node:assert/strict';
import { test as teste } from 'vitest';
import { gerarQr, qrParaSvg } from '../src/core/qr.ts';

// A leitura real foi conferida com um leitor de QR (jsQR) nas versões 1 a 10, com acentos;
// aqui ficam as propriedades estruturais da norma, que não dependem de leitor.

const finder = (m: boolean[][], x0: number, y0: number) => {
  for (let dy = 0; dy < 7; dy++)
    for (let dx = 0; dx < 7; dx++) {
      const d = Math.max(Math.abs(dx - 3), Math.abs(dy - 3));
      assert.equal(m[y0 + dy][x0 + dx], d !== 2, `finder em ${x0},${y0}`);
    }
};

teste('gerarQr: tamanho 17 + 4×versão e os três padrões de canto', () => {
  const curto = gerarQr('a');
  assert.equal(curto.length, 21);
  const link = gerarQr('https://www.exemplo.gov.br/lei/l13146.htm');
  assert.equal(link.length, 29); // 41 bytes cabem na versão 3
  for (const m of [curto, link]) {
    const t = m.length;
    finder(m, 0, 0);
    finder(m, t - 7, 0);
    finder(m, 0, t - 7);
    for (let i = 8; i < t - 8; i++) assert.equal(m[6][i], i % 2 === 0, 'linha de tempo');
    assert.equal(m[t - 8][8], true, 'módulo escuro fixo');
  }
});

teste('gerarQr: mesmo texto gera sempre a mesma matriz', () => {
  assert.deepEqual(gerarQr('https://exemplo.gov.br'), gerarQr('https://exemplo.gov.br'));
});

teste('gerarQr: até 213 bytes (versão 10); acima disso avisa', () => {
  assert.equal(gerarQr('y'.repeat(213)).length, 57);
  assert.throws(() => gerarQr('y'.repeat(214)), /longo demais/);
});

teste('qrParaSvg: margem de 4 módulos e um quadrado por módulo escuro', () => {
  const { lado, caminho } = qrParaSvg('a');
  assert.equal(lado, 29);
  const escuros = gerarQr('a').flat().filter(Boolean).length;
  assert.equal((caminho.match(/M/g) ?? []).length, escuros);
});
