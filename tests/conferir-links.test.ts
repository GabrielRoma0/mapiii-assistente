import assert from 'node:assert/strict';
import { test as teste } from 'vitest';
import { coletarLinks, conferirLinks } from '../src/core/links.ts';

const kb = [
  { id: 'a', fonte_url: 'https://a.gov.br/f', onde: { texto: 'x', link: 'https://a.gov.br/pedido' }, base_legal: [{ norma: 'Lei', url: 'https://lei.gov.br/1' }] },
  { id: 'b', fonte_url: 'https://a.gov.br/f' }
];
const dominios = { sufixos: [{ fonte_url: 'https://registro.br/x' }], dominios: [{ fonte_url: 'https://sptrans.com.br/' }] };
const servicos = [{ id: 's', fonte_url: 'https://s.gov.br/precos' }];

teste('coletarLinks: junta fontes, links de pedido e leis, sem repetir, dizendo onde cada um aparece', () => {
  assert.deepEqual(coletarLinks(kb, dominios, servicos), [
    { url: 'https://a.gov.br/f', onde: ['kb.json: a (fonte)', 'kb.json: b (fonte)'] },
    { url: 'https://a.gov.br/pedido', onde: ['kb.json: a (onde.link)'] },
    { url: 'https://lei.gov.br/1', onde: ['kb.json: a (base_legal)'] },
    { url: 'https://registro.br/x', onde: ['dominios-oficiais.json'] },
    { url: 'https://sptrans.com.br/', onde: ['dominios-oficiais.json'] },
    { url: 'https://s.gov.br/precos', onde: ['servicos-valores.json: s'] }
  ]);
});

teste('conferirLinks: 2xx e 3xx passam; 4xx, 5xx e falha de rede viram problema', async () => {
  const f = (async (u: string) => {
    if (u.includes('quebrado')) return new Response('', { status: 404 });
    if (u.includes('fora')) throw new TypeError('fetch failed');
    return new Response('', { status: u.includes('redir') ? 301 : 200 });
  }) as unknown as typeof fetch;
  const r = await conferirLinks(
    [{ url: 'https://ok.gov.br', onde: ['x'] }, { url: 'https://redir.gov.br', onde: ['x'] }, { url: 'https://quebrado.gov.br', onde: ['y'] }, { url: 'https://fora.gov.br', onde: ['z'] }],
    f
  );
  assert.deepEqual(r.map((p) => [p.url, p.situacao]), [
    ['https://quebrado.gov.br', 'status 404'],
    ['https://fora.gov.br', 'sem resposta']
  ]);
});
