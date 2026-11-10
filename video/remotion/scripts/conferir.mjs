// Confere o vídeo renderizado (seções 3 e 8 do video/README.md):
//  - trechos parados: sequências de quadros iguais (mais de 3 seguidos) nas cenas animadas;
//  - quanto tempo o final fica parado (máximo 1,4 s);
//  - som: loudness integrado (meta −14 LUFS) e pico real (máximo −1 dBTP).
// Uso: npm run conferir -- out/previa.mp4
import { execFileSync } from 'node:child_process';
import { readFileSync } from 'node:fs';

const arquivo = process.argv[2] ?? 'out/mapiii-pitch-gs2026.mp4';
const FPS = 30;
const cenas = [...readFileSync('src/roteiro.ts', 'utf8').matchAll(/\{ n: (\d+), inicio: ([\d.]+), fim: ([\d.]+), quem: '[^']+', camera: (true|false)/g)]
  .map((m) => ({ n: +m[1], inicio: +m[2], fim: +m[3], camera: m[4] === 'true' }));

// Diferença média entre quadros seguidos (0 = idênticos).
const saida = execFileSync('ffmpeg', ['-v', 'error', '-i', arquivo, '-vf', 'scale=480:-1,format=gray,tblend=all_mode=difference,signalstats,metadata=print:key=lavfi.signalstats.YAVG:file=-', '-f', 'null', '-'], { maxBuffer: 1 << 28 }).toString();
const difs = [...saida.matchAll(/YAVG=([\d.]+)/g)].map((m) => +m[1]);
const LIMIAR = 0.02;
const pior = [];
for (const c of cenas) {
  if (c.camera) continue;
  let run = 0, maior = 0, onde = 0;
  for (let q = Math.round(c.inicio * FPS); q < Math.round(c.fim * FPS) - 1 && q < difs.length; q++) {
    run = difs[q] < LIMIAR ? run + 1 : 0;
    if (run > maior) { maior = run; onde = q; }
  }
  pior.push({ cena: c.n, quadrosParados: maior, ate: (onde / FPS).toFixed(2) + ' s' });
}
console.log('Maior trecho parado por cena animada (quadros seguidos iguais):');
for (const p of pior) console.log(`  cena ${String(p.cena).padStart(2)}: ${p.quadrosParados}${p.quadrosParados > 3 ? '  ← acima de 3' : ''} (termina em ${p.ate})`);
let fim = 0;
for (let q = difs.length - 1; q >= 0 && difs[q] < LIMIAR; q--) fim++;
console.log(`Final parado: ${(fim / FPS).toFixed(2)} s (máximo 1,4 s)${fim / FPS > 1.4 ? '  ← acima' : ''}`);

const err = execFileSync('sh', ['-c', `ffmpeg -nostats -i "${arquivo}" -af ebur128=peak=true -f null - 2>&1 | tail -14`]).toString();
const I = err.match(/I:\s+(-?[\d.]+) LUFS/);
const P = err.match(/Peak:\s+(-?[\d.]+) dBFS/);
console.log(`Som: ${I ? I[1] : '?'} LUFS integrado (meta −14), pico real ${P ? P[1] : '?'} dBTP (máximo −1)`);
