// Gera out/mapiii-pitch-gs2026.srt com os mesmos blocos da legenda queimada.
// Uso: npm run srt
import { mkdirSync, writeFileSync } from 'node:fs';
import { blocosDeLegenda } from '../src/legendas';
import { FPS } from '../src/roteiro';

const tempo = (q: number) => {
  const ms = Math.max(0, Math.round((q / FPS) * 1000));
  const h = Math.floor(ms / 3600000), m = Math.floor((ms % 3600000) / 60000), s = Math.floor((ms % 60000) / 1000), r = ms % 1000;
  const p = (n: number, k = 2) => String(n).padStart(k, '0');
  return `${p(h)}:${p(m)}:${p(s)},${p(r, 3)}`;
};
const texto = blocosDeLegenda().map((b, i) => `${i + 1}\n${tempo(b.de)} --> ${tempo(b.ate)}\n${b.texto}\n`).join('\n');
mkdirSync('out', { recursive: true });
writeFileSync('out/mapiii-pitch-gs2026.srt', texto);
console.log(`out/mapiii-pitch-gs2026.srt: ${blocosDeLegenda().length} blocos`);
