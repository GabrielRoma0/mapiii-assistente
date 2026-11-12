// Grava as telas do app real para o vídeo (cenas 7, 8 e 9), em formato de celular e nítidas (2× a densidade).
// Usa o BUILD do app (nunca `npm run dev`, que mostra a base fictícia). Antes, na raiz do repositório:
//   npm run build && npx vite preview --port 4173
// Depois, em video/remotion:  node scripts/gravar-app.cjs
// Saída: video/gravacoes/app-bruto/{triagem,pergunta,motorista,conferir}.mp4 (sem som) e um PNG do fim de cada uma em out/app/.
// O ponto rosa que aparece em cada toque é desenhado por este script (como o "mostrar toques" do celular); não é do app.
const { chromium } = require('playwright');
const { execFileSync } = require('node:child_process');
const fs = require('node:fs');
const path = require('node:path');

const URL = process.env.APP_URL ?? 'http://localhost:4173/';
const raiz = path.join(__dirname, '..');
const saida = path.join(raiz, '..', 'gravacoes', 'app-bruto'); // gravação inteira; o corte usado no vídeo vai para gravacoes/app/
const tmp = path.join(raiz, 'out', 'app');
const L = 390, A = 844, DENS = 2;
// Na nuvem do Claude Code o Chromium já vem instalado; no computador da dupla o Playwright usa o dele.
const CHROME = [process.env.REMOTION_CHROME, '/opt/pw-browsers/chromium_headless_shell-1243/chrome-headless-shell-linux64/chrome-headless-shell'].find((c) => c && fs.existsSync(c));
const espera = (p, ms) => p.waitForTimeout(ms);

async function gravar(nome, roteiro) {
  const b = await chromium.launch(CHROME ? { executablePath: CHROME } : {});
  const ctx = await b.newContext({ viewport: { width: L, height: A }, deviceScaleFactor: DENS, hasTouch: true, isMobile: true, locale: 'pt-BR', colorScheme: 'light' });
  const p = await ctx.newPage();
  await p.addInitScript(() => {
    addEventListener('pointerdown', (e) => {
      const d = document.createElement('div');
      d.style.cssText = `position:fixed;left:${e.clientX - 22}px;top:${e.clientY - 22}px;width:44px;height:44px;border-radius:50%;background:#CF7A93;opacity:.55;pointer-events:none;z-index:99999;transition:opacity .45s,transform .45s`;
      document.documentElement.appendChild(d);
      requestAnimationFrame(() => { d.style.opacity = '0'; d.style.transform = 'scale(1.8)'; });
      setTimeout(() => d.remove(), 500);
    }, true);
  });
  const quadros = [];
  const dir = path.join(tmp, nome);
  fs.rmSync(dir, { recursive: true, force: true });
  fs.mkdirSync(dir, { recursive: true });
  const cdp = await ctx.newCDPSession(p);
  let gravando = false;
  cdp.on('Page.screencastFrame', async (f) => {
    cdp.send('Page.screencastFrameAck', { sessionId: f.sessionId }).catch(() => {});
    if (!gravando) return;
    const arq = path.join(dir, `q${String(quadros.length).padStart(5, '0')}.jpg`);
    fs.writeFileSync(arq, Buffer.from(f.data, 'base64'));
    quadros.push({ arq, t: f.metadata.timestamp });
  });
  await cdp.send('Page.startScreencast', { format: 'jpeg', quality: 92, everyNthFrame: 1 });
  const tocar = async (alvo) => { const l = typeof alvo === 'string' ? p.locator(alvo).first() : alvo.first(); await l.scrollIntoViewIfNeeded(); await espera(p, 350); await l.tap(); };
  const comecar = async () => { gravando = true; await p.evaluate(() => { document.documentElement.style.outline = '0'; }); };
  await roteiro({ p, tocar, comecar });
  await espera(p, 1500);
  // um último quadro, para o fim ter duração
  await p.evaluate(() => { document.body.style.outline = '0 solid transparent'; });
  await espera(p, 300);
  gravando = false;
  await p.screenshot({ path: path.join(tmp, `${nome}-fim.png`) });
  await b.close();
  // Junta os quadros com a duração real de cada um.
  const fim = quadros[quadros.length - 1].t + 0.5;
  const lista = quadros.map((q, i) => `file '${q.arq}'\nduration ${Math.max(0.01, ((quadros[i + 1]?.t ?? fim) - q.t)).toFixed(3)}`).join('\n') + `\nfile '${quadros[quadros.length - 1].arq}'\n`;
  fs.writeFileSync(path.join(dir, 'lista.txt'), lista);
  fs.mkdirSync(saida, { recursive: true });
  execFileSync('ffmpeg', ['-v', 'error', '-y', '-f', 'concat', '-safe', '0', '-i', path.join(dir, 'lista.txt'), '-vf', `fps=30,scale=${L * DENS}:${A * DENS}:flags=lanczos`, '-c:v', 'libx264', '-crf', '18', '-pix_fmt', 'yuv420p', '-an', path.join(saida, `${nome}.mp4`)]);
  console.log(nome, quadros.length, 'quadros,', (fim - quadros[0].t).toFixed(1), 's');
}

// Começo igual para todas: do zero, tema claro, texto em A+, "Cuido de alguém".
async function preparar(p, tocar) {
  await p.goto(URL);
  await espera(p, 900);
  await tocar(p.locator('button', { hasText: 'Entendi' }));
  await tocar(p.locator('button', { hasText: /^A\+$/ }));
  await tocar(p.locator('button', { hasText: 'Cuido de alguém' }));
  await p.evaluate(() => scrollTo(0, 0));
  await espera(p, 500);
}

// Respostas da triagem: quem cuida de alguém em cadeira de rodas, em São Paulo, que anda de ônibus.
const RESPOSTAS = [
  [/tipo de apoio/, 'Mobilidade ou cadeira de rodas'], [/quer resolver/, 'Transporte e passe livre'], [/faixa de idade/, 'De 18 a 59 anos'],
  [/cadeira de rodas, andador/, 'Sim'], [/laudo ou relatório/, 'Sim'], [/mora na cidade/, 'Sim'], [/renda da casa/, 'Não sei'], [/Cadastro Único/, 'Não sei'],
  [/já recebe/, 'Nenhum'], [/costuma se deslocar/, 'Ônibus'], [/Para quem/, 'Para alguém que eu acompanho']
];

const ROTEIROS = {
  triagem: async ({ p, tocar, comecar }) => {
    await preparar(p, tocar);
    await comecar();
    await espera(p, 600);
    await tocar(p.locator('a', { hasText: 'Descobrir o que posso pedir' }));
    for (let i = 0; i < 14; i++) {
      await espera(p, 900);
      if (!/situacao/.test(p.url())) break;
      const pergunta = await p.locator('main').innerText();
      const r = RESPOSTAS.find(([re]) => re.test(pergunta));
      const opcao = r && p.locator('main label, main button', { hasText: r[1] });
      // Pergunta sem resposta combinada (ou opção que não existe): "Prefiro não responder".
      if (opcao && await opcao.count()) await tocar(opcao);
      else await tocar(p.locator('main label, main button', { hasText: 'Prefiro não responder' }));
      await espera(p, 450);
      await tocar(p.locator('main button', { hasText: /^(Continuar|Ver .*)$/ }));
    }
    await espera(p, 1800);
    await p.mouse.wheel(0, 380);
    await espera(p, 1600);
  },
  pergunta: async ({ p, tocar, comecar }) => {
    await preparar(p, tocar);
    await comecar();
    await espera(p, 500);
    await tocar(p.locator('a', { hasText: 'Fazer uma pergunta' }));
    await espera(p, 900);
    const campo = p.locator('main textarea').first();
    await campo.tap();
    // Uma das perguntas que o próprio app sugere.
    await campo.pressSequentially(process.env.PERGUNTA ?? 'Cadeirante paga ônibus em São Paulo?', { delay: 60 });
    await espera(p, 600);
    await tocar(p.locator('main button[type=submit]'));
    await espera(p, 3200);
    await p.mouse.wheel(0, 260);
    await espera(p, 2400);
  },
  motorista: async ({ p, tocar, comecar }) => {
    await preparar(p, tocar);
    await comecar();
    await espera(p, 500);
    await tocar(p.locator('a', { hasText: 'Garanta na rua' }));
    await espera(p, 1200);
    await tocar(p.locator('main a[href="#/motorista"]'));
    await espera(p, 2600);
    await p.mouse.wheel(0, 520);
    await espera(p, 2600);
  }
  ,
  // "Conferir se é oficial" com um endereço inventado (example.com é reservado para exemplos; não é site de ninguém).
  conferir: async ({ p, tocar, comecar }) => {
    await preparar(p, tocar);
    await p.goto(URL + '#/conferir');
    await espera(p, 900);
    await comecar();
    await espera(p, 500);
    const campo = p.locator('main textarea, main input').first();
    await campo.tap();
    await campo.pressSequentially(process.env.LINK ?? 'sptrans-cartao-gratis.example.com', { delay: 45 });
    await espera(p, 500);
    await tocar(p.locator('main button[type=submit]'));
    await espera(p, 3000);
  }
};

(async () => {
  const pedidos = process.argv.slice(2);
  for (const nome of Object.keys(ROTEIROS)) if (!pedidos.length || pedidos.includes(nome)) await gravar(nome, ROTEIROS[nome]);
})();
