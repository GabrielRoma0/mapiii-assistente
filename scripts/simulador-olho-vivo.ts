// SÓ PARA DESENVOLVIMENTO (npm run dev). Não entra no build.
// Roda a lógica real da Edge Function `onibus` contra uma SPTrans FICTÍCIA, para testar a tela do Embarque sem token.
// Para usar, crie .env.local com:
//   VITE_EMBARQUE_ATIVO=true
//   VITE_SUPABASE_URL=http://localhost:5173/__simulador
//   VITE_SUPABASE_PUBLISHABLE_KEY=simulador
// Cenários pelo termo buscado: "8000" (dois sentidos, um com dado velho), "999" (sem veículos), "vazia" (linha inexistente),
// "fora" (API fora), "limite" (429), "lento" (tempo esgotado).
import type { Plugin } from 'vite';
import { criarServico } from '../supabase/functions/_shared/onibus-servidor';

const json = (d: unknown, status = 200) => new Response(JSON.stringify(d), { status, headers: { 'content-type': 'application/json' } });
const atras = (s: number) => new Date(Date.now() - s * 1000).toISOString();

const fetchFicticio = (async (entrada: RequestInfo | URL, init: RequestInit = {}) => {
  const url = new URL(String(entrada));
  const caminho = url.pathname.replace('/v2.1', '');
  if (caminho === '/Login/Autenticar') return new Response('true', { headers: { 'set-cookie': 'apiCredentials=simulado; Path=/' } });
  if (caminho === '/Linha/Buscar') {
    const termo = (url.searchParams.get('termosBusca') ?? '').toLowerCase();
    if (termo === 'fora') return new Response('', { status: 500 });
    if (termo === 'limite') return new Response('', { status: 429 });
    if (termo === 'lento') return new Promise<Response>((_, rej) => init.signal?.addEventListener('abort', () => rej(new DOMException('abort', 'AbortError'))));
    if (termo === '999') return json([{ cl: 3, lc: true, lt: '999', sl: 1, tl: 10, tp: 'LINHA FICTÍCIA CIRCULAR', ts: '' }]);
    if (termo.startsWith('8')) {
      return json([
        { cl: 1, lc: false, lt: '8000', sl: 1, tl: 10, tp: 'TERMINAL FICTÍCIO A', ts: 'TERMINAL FICTÍCIO B' },
        { cl: 2, lc: false, lt: '8000', sl: 2, tl: 10, tp: 'TERMINAL FICTÍCIO A', ts: 'TERMINAL FICTÍCIO B' }
      ]);
    }
    return json([]);
  }
  if (caminho === '/Posicao/Linha') {
    const cl = url.searchParams.get('codigoLinha');
    if (cl === '1') {
      return json({
        hr: '12:00',
        vs: [
          { p: '11001', a: true, ta: atras(25), py: 0, px: 0 },
          { p: '11002', a: false, ta: atras(40), py: 0, px: 0 },
          { p: '11003', a: true, ta: atras(70), py: 0, px: 0 },
          { p: '11004', a: false, ta: atras(400), py: 0, px: 0 }
        ]
      });
    }
    if (cl === '2') return json({ hr: '12:00', vs: [{ p: '22001', a: false, ta: atras(300), py: 0, px: 0 }] });
    return json({ hr: '12:00', vs: [] });
  }
  return new Response('', { status: 404 });
}) as typeof fetch;

export function simuladorOlhoVivo(): Plugin {
  const atender = criarServico({ fetch: fetchFicticio, token: 'simulado', base: 'https://simulador.invalid/v2.1', limitePorMinuto: 60, cacheMs: 0 });
  return {
    name: 'mapiii-simulador-olho-vivo',
    apply: 'serve',
    configureServer(server) {
      server.middlewares.use('/__simulador/functions/v1/onibus', async (req, res) => {
        const partes: Buffer[] = [];
        for await (const p of req) partes.push(p as Buffer);
        const resposta = await atender(
          new Request('http://localhost/onibus', {
            method: req.method,
            headers: { 'content-type': 'application/json', 'x-forwarded-for': req.socket.remoteAddress ?? '' },
            body: req.method === 'POST' ? Buffer.concat(partes).toString('utf8') : undefined
          })
        );
        res.statusCode = resposta.status;
        resposta.headers.forEach((v, k) => res.setHeader(k, v));
        res.end(await resposta.text());
      });
    }
  };
}
