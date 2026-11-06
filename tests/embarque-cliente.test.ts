import assert from 'node:assert/strict';
import { test as teste } from 'vitest';
import { consultarOnibus, MENSAGEM_NAO_CONFIGURADO } from '../src/app/embarque/cliente.ts';

const cfg = (f: typeof fetch, extra = {}) => ({ url: 'https://projeto.invalid', chave: 'chave-publicavel', fetch: f, ...extra });
const resposta = (corpo: unknown, status = 200) => (async () => new Response(JSON.stringify(corpo), { status })) as typeof fetch;

teste('consultarOnibus: sem URL ou chave do Supabase → "não configurado", sem chamar nada', async () => {
  let chamou = false;
  const f = (async () => {
    chamou = true;
    return new Response('{}');
  }) as typeof fetch;
  assert.deepEqual(await consultarOnibus({ acao: 'linhas', termo: '8000' }, { url: '', chave: '', fetch: f }), {
    ok: false,
    erro: 'nao_configurado',
    mensagem: MENSAGEM_NAO_CONFIGURADO
  });
  assert.equal(chamou, false);
});

teste('consultarOnibus: chama só a função onibus, com POST, chave publicável e o pedido em JSON', async () => {
  let visto: { url: string; init: RequestInit } | null = null;
  const f = (async (url: RequestInfo | URL, init: RequestInit = {}) => {
    visto = { url: String(url), init };
    return new Response(JSON.stringify({ ok: true, acao: 'linhas', linhas: [] }));
  }) as typeof fetch;
  const r = await consultarOnibus({ acao: 'linhas', termo: '8000' }, cfg(f));
  assert.equal(r.ok, true);
  assert.equal(visto!.url, 'https://projeto.invalid/functions/v1/onibus');
  assert.equal(visto!.init.method, 'POST');
  assert.equal(new Headers(visto!.init.headers).get('apikey'), 'chave-publicavel');
  assert.equal(visto!.init.body, '{"acao":"linhas","termo":"8000"}');
});

teste('consultarOnibus: repassa as falhas da função (linha inexistente, limite...)', async () => {
  const r = await consultarOnibus({ acao: 'linhas', termo: 'xyz' }, cfg(resposta({ ok: false, erro: 'linha_inexistente', mensagem: 'Não encontrei.' })));
  assert.deepEqual(r, { ok: false, erro: 'linha_inexistente', mensagem: 'Não encontrei.' });
});

teste('consultarOnibus: resposta estranha vira "API fora"; 429 sem corpo vira "limite"', async () => {
  assert.equal(((await consultarOnibus({ acao: 'veiculos', codigo: 1 }, cfg(resposta({ qualquer: 1 })))) as { erro: string }).erro, 'api_fora');
  assert.equal(((await consultarOnibus({ acao: 'veiculos', codigo: 1 }, cfg(resposta({ ok: false, erro: 'inventado', mensagem: 'x' })))) as { erro: string }).erro, 'api_fora');
  const html429 = (async () => new Response('<html>', { status: 429 })) as typeof fetch;
  assert.equal(((await consultarOnibus({ acao: 'veiculos', codigo: 1 }, cfg(html429))) as { erro: string }).erro, 'limite');
});

teste('consultarOnibus: rede fora → "API fora"; demora → "tempo esgotado"', async () => {
  const rede = (async () => {
    throw new TypeError('fetch failed');
  }) as typeof fetch;
  assert.equal(((await consultarOnibus({ acao: 'linhas', termo: '8000' }, cfg(rede))) as { erro: string }).erro, 'api_fora');
  const lento = ((_u: RequestInfo | URL, init: RequestInit = {}) =>
    new Promise((_, rej) => init.signal?.addEventListener('abort', () => rej(new DOMException('abort', 'AbortError'))))) as typeof fetch;
  assert.equal(((await consultarOnibus({ acao: 'linhas', termo: '8000' }, cfg(lento, { tempoLimiteMs: 30 }))) as { erro: string }).erro, 'tempo_esgotado');
});
