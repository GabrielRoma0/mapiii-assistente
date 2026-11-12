// Ajusta o volume final do vídeo (seção 8 do video/README.md): −14 LUFS integrado e pico real de no máximo −1 dBTP.
// Mede com o loudnorm do ffmpeg e aplica o ganho com um limitador; o vídeo é copiado sem recompressão.
// Uso: node scripts/masterizar.mjs out/mapiii-pitch-gs2026.mp4
import { execFileSync, spawnSync } from 'node:child_process';
import { renameSync } from 'node:fs';

const arq = process.argv[2];
if (!arq) throw new Error('Diga qual arquivo: node scripts/masterizar.mjs out/arquivo.mp4');
const alvo = 'I=-14:TP=-1.5:LRA=11';
const med = spawnSync('ffmpeg', ['-hide_banner', '-nostats', '-i', arq, '-af', `loudnorm=${alvo}:print_format=json`, '-f', 'null', '-'], { encoding: 'utf8' }).stderr;
const j = JSON.parse(med.slice(med.lastIndexOf('{')));
// Ganho fixo até −14 LUFS e um limitador que segura os picos em −3 dBFS (sobra para a compressão AAC).
const ganho = (-14 - Number(j.input_i)).toFixed(2);
const filtro = `aresample=48000,volume=${ganho}dB,alimiter=limit=0.71:level=false:attack=1:release=50:asc=1`;
const tmp = arq.replace(/\.mp4$/, '.tmp.mp4');
execFileSync('ffmpeg', ['-v', 'error', '-y', '-i', arq, '-c:v', 'copy', '-af', filtro, '-ar', '48000', '-c:a', 'aac', '-b:a', '192k', tmp]);
renameSync(tmp, arq);
console.log(`Volume ajustado: era ${j.input_i} LUFS, pico ${j.input_tp} dBTP.`);
