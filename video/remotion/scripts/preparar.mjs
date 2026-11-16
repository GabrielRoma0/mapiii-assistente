// Copia (e reduz) as peças de video/ e design-system/ para public/, que o Remotion lê.
// public/ não vai para o git: é refeito a cada `npm run studio`, `quadros` ou `render`.
import { cpSync, existsSync, mkdirSync, readdirSync, readFileSync, statSync, writeFileSync } from 'node:fs';
import { execFileSync, spawnSync } from 'node:child_process';
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
for (const sub of ['camera-gravada', 'app']) {
  const p = join(video, 'gravacoes', sub);
  if (existsSync(p)) for (const f of pasta(p)) copiar(f, join(pub, sub, basename(f)));
}
// Narração: cada voz é tratada antes de entrar no vídeo (o arquivo de gravacoes/ não muda).
//  - corta o grave de fundo (abaixo de 80 Hz) e reduz o chiado; realça de leve a faixa da fala;
//  - compressor suave, para as palavras fracas não sumirem; entrada e saída sem estalo (fade de 20 e 60 ms);
//  - volume igualado em −16 LUFS, com limitador em −1,5 dB.
// Sem ffmpeg, a voz entra como foi gravada.
function tratarVoz(orig, dest) {
  mkdirSync(dirname(dest), { recursive: true });
  if (!novo(orig, dest) && statSync(dest).mtimeMs > statSync(fileURLToPath(import.meta.url)).mtimeMs) return true;
  try {
    const dur = Number(execFileSync('ffprobe', ['-v', 'error', '-show_entries', 'format=duration', '-of', 'csv=p=0', orig]).toString());
    const cadeia = `highpass=f=80,afftdn=nr=10:nf=-48,equalizer=f=220:t=q:w=1:g=-1.5,equalizer=f=3400:t=q:w=1.2:g=2,acompressor=threshold=-22dB:ratio=2.5:attack=8:release=140:makeup=1.5,afade=t=in:d=0.02,afade=t=out:st=${(dur - 0.06).toFixed(3)}:d=0.06`;
    const med = spawnSync('ffmpeg', ['-hide_banner', '-nostats', '-i', orig, '-af', `${cadeia},ebur128`, '-f', 'null', '-'], { encoding: 'utf8' }).stderr;
    const lufs = Number((med.match(/I:\s+(-?[\d.]+) LUFS/g) ?? []).pop()?.match(/-?[\d.]+/)?.[0] ?? -16);
    execFileSync('ffmpeg', ['-v', 'error', '-y', '-i', orig, '-af', `${cadeia},volume=${(-16 - lufs).toFixed(2)}dB,alimiter=limit=0.84:level=false:attack=2:release=60`, '-ar', '48000', dest]);
    return true;
  } catch (e) {
    if (e.code !== 'ENOENT') throw e;
    return false;
  }
}
{
  const p = join(video, 'gravacoes', 'narracao');
  if (existsSync(p)) for (const f of pasta(p)) {
    const wav = join(pub, 'narracao', basename(f).replace(/\.mp3$/, '.wav'));
    if (!/cena-\d+\.mp3$/.test(f) || !tratarVoz(f, wav)) copiar(f, join(pub, 'narracao', basename(f)));
  }
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
