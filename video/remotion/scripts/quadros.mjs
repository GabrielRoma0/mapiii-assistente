// Tira um quadro (PNG) de momentos de cada cena para conferir antes do render: out/quadros/cena-NN-x.png
// Uso: npm run quadros            (todas as cenas)
//      npm run quadros -- 4 9     (só as cenas 4 e 9)
import { bundle } from '@remotion/bundler';
import { renderStill, selectComposition, openBrowser } from '@remotion/renderer';
import { existsSync, mkdirSync, readFileSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const raiz = join(dirname(fileURLToPath(import.meta.url)), '..');
const saida = join(raiz, 'out', 'quadros');
mkdirSync(saida, { recursive: true });
const chrome = process.env.REMOTION_CHROME ?? '/opt/pw-browsers/chromium_headless_shell-1243/chrome-headless-shell-linux64/chrome-headless-shell';
const browserExecutable = existsSync(chrome) ? chrome : null;

// Momentos (em fração da cena) para olhar.
const MOMENTOS = [0.12, 0.5, 0.92];
const pedidas = process.argv.slice(2).map(Number).filter(Boolean);
const escala = Number(process.env.ESCALA ?? 0.5);

const serveUrl = await bundle({ entryPoint: join(raiz, 'src', 'index.ts'), publicDir: join(raiz, 'public') });
const browser = await openBrowser('chrome', { browserExecutable });
const comp = await selectComposition({ serveUrl, id: 'Pitch', puppeteerInstance: browser });
// Tempos das cenas lidos de src/roteiro.ts (n, inicio, fim).
const CENAS = [...readFileSync(join(raiz, 'src', 'roteiro.ts'), 'utf8').matchAll(/\{ n: (\d+), inicio: ([\d.]+), fim: ([\d.]+)/g)]
  .map((m) => ({ n: Number(m[1]), inicio: Number(m[2]), fim: Number(m[3]) }));
for (const c of CENAS) {
  if (pedidas.length && !pedidas.includes(c.n)) continue;
  for (const [i, m] of MOMENTOS.entries()) {
    const frame = Math.round((c.inicio + (c.fim - c.inicio) * m) * 30);
    const arquivo = join(saida, `cena-${String(c.n).padStart(2, '0')}-${i + 1}.png`);
    await renderStill({ composition: comp, serveUrl, frame, output: arquivo, scale: escala, puppeteerInstance: browser, imageFormat: 'png' });
    console.log(arquivo, 'quadro', frame);
  }
}
await browser.close({ silent: true });
