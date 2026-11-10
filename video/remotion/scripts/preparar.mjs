// Copia (e reduz) as peças de video/ e design-system/ para public/, que o Remotion lê.
// public/ não vai para o git: é refeito a cada `npm run studio`, `quadros` ou `render`.
import { cpSync, existsSync, mkdirSync, readdirSync, readFileSync, statSync, writeFileSync } from 'node:fs';
import { execFileSync } from 'node:child_process';
import { dirname, join, basename } from 'node:path';
import { fileURLToPath } from 'node:url';

const raiz = join(dirname(fileURLToPath(import.meta.url)), '..');
const video = join(raiz, '..');
const ds = join(video, '..', 'design-system');
const pub = join(raiz, 'public');

const novo = (orig, dest) => !existsSync(dest) || statSync(orig).mtimeMs > statSync(dest).mtimeMs;
function copiar(orig, dest) {
  mkdirSync(dirname(dest), { recursive: true });
  if (novo(orig, dest)) cpSync(orig, dest);
}
// Reduz a imagem com o ffmpeg, se ele estiver instalado. Sem ffmpeg (comum no Windows), copia no tamanho original:
// o vídeo fica igual, só o Studio e o render ficam um pouco mais lentos.
let temFfmpeg = true;
function reduzir(orig, dest, largura) {
  mkdirSync(dirname(dest), { recursive: true });
  if (!novo(orig, dest)) return;
  if (temFfmpeg) {
    try {
      execFileSync('ffmpeg', ['-v', 'error', '-y', '-i', orig, '-vf', `scale=${largura}:-1:flags=lanczos`, dest]);
      return;
    } catch (e) {
      if (e.code !== 'ENOENT') throw e;
      temFfmpeg = false;
      console.log('ffmpeg não encontrado: as imagens vão no tamanho original.');
    }
  }
  cpSync(orig, dest);
}
const pasta = (p, filtro = () => true) => readdirSync(p).filter(filtro).map((f) => join(p, f));

for (const f of pasta(join(video, 'mapi-3d'), (f) => f.endsWith('.png') && !f.startsWith('comparacao'))) reduzir(f, join(pub, 'mapi', basename(f)), 900);
for (const f of pasta(join(video, 'objetos-3d'), (f) => f.endsWith('.png') && !f.startsWith('comparacao'))) reduzir(f, join(pub, 'objetos', basename(f)), 1000);
for (const f of pasta(join(video, 'ods'), (f) => f.endsWith('.png'))) reduzir(f, join(pub, 'ods', basename(f)), 840);
for (const f of pasta(join(video, 'quadros', 'camera-nomes'))) copiar(f, join(pub, 'camera', basename(f)));
copiar(join(video, 'quadros', 'camera-moldura.png'), join(pub, 'camera', 'moldura.png'));
for (const f of pasta(join(video, 'quadros', 'relogio'), (f) => /^\d+\.png$/.test(f))) copiar(f, join(pub, 'relogio', basename(f)));
copiar(join(video, 'mapa', 'mundo.svg'), join(pub, 'mapa', 'mundo.svg'));
for (const f of pasta(join(video, 'sons'), (f) => /\.(wav|mp3|flac)$/.test(f))) copiar(f, join(pub, 'sons', basename(f)));
for (const f of pasta(join(ds, 'assets', 'logo'), (f) => f.endsWith('.svg'))) copiar(f, join(pub, 'logo', basename(f)));
for (const f of pasta(join(ds, 'fonts'), (f) => f.endsWith('.woff2'))) copiar(f, join(pub, 'fontes', basename(f)));
// Gravações (câmera, app e narração) entram aqui quando existirem; ver video/README.md, seção 6.
for (const sub of ['camera-gravada', 'app', 'narracao']) {
  const p = join(video, 'gravacoes', sub);
  if (existsSync(p)) for (const f of pasta(p)) copiar(f, join(pub, sub, basename(f)));
}

// Ícones do design system viram um módulo TS (só os traços, sem metadados).
const icones = {};
for (const f of pasta(join(ds, 'assets', 'icons'), (f) => f.endsWith('.svg'))) {
  const svg = readFileSync(f, 'utf8').replace(/<metadata>[\s\S]*?<\/metadata>/, '');
  const corpo = svg.replace(/^[\s\S]*?<svg[^>]*>/, '').replace(/<\/svg>\s*$/, '').trim();
  icones[basename(f, '.svg').replace(/-/g, '_')] = corpo;
}
const saida = join(raiz, 'src', 'gerado-icones.ts');
const texto = `// Gerado por scripts/preparar.mjs a partir de design-system/assets/icons. Não edite à mão.\nexport const ICONES: Record<string, string> = ${JSON.stringify(icones, null, 1)};\n`;
if (!existsSync(saida) || readFileSync(saida, 'utf8') !== texto) writeFileSync(saida, texto);
// Lista do que existe em public/ (as cenas usam a gravação só se ela estiver lá).
const lista = [];
const andar = (dir, pre = '') => { for (const f of readdirSync(dir)) { const p = join(dir, f); if (statSync(p).isDirectory()) andar(p, `${pre}${f}/`); else lista.push(`${pre}${f}`); } };
andar(pub);
lista.sort();
const saidaLista = join(raiz, 'src', 'gerado-arquivos.json');
const textoLista = JSON.stringify(lista, null, 1) + '\n';
if (!existsSync(saidaLista) || readFileSync(saidaLista, 'utf8') !== textoLista) writeFileSync(saidaLista, textoLista);
console.log('public/ pronto.');
