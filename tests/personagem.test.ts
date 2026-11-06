import assert from 'node:assert/strict';
import { test as teste } from 'vitest';
import { ESTADOS_MAPI, estadoMapi, personagemSVG } from '../src/ui/MapiPersonagem.tsx';

const PEDIDOS = ['ola', 'ouvindo', 'procurando', 'achei', 'verificado', 'duvida', 'atencao', 'recusa', 'acolhimento', 'comemorando', 'esperando'];

teste('personagem: os 11 estados pedidos existem, com rótulo', () => {
  assert.deepEqual(Object.keys(ESTADOS_MAPI).sort(), [...PEDIDOS].sort());
  for (const e of PEDIDOS) assert.ok(estadoMapi(e).rotulo.length > 0, e);
});

teste('personagem: Olá e Acolhimento usam as poses definidas no design (bom e agradecendo)', () => {
  assert.equal(estadoMapi('ola').pose, 'bom');
  assert.equal(estadoMapi('acolhimento').pose, 'agradecendo');
});

teste('personagem: estado desconhecido cai na pose neutra', () => {
  assert.equal(estadoMapi('inexistente'), ESTADOS_MAPI.ola);
  assert.equal(personagemSVG('inexistente', 64), personagemSVG('ola', 64));
});

teste('personagem: o SVG é decorativo e sem animação', () => {
  for (const e of PEDIDOS) {
    const svg = personagemSVG(e, 44);
    assert.match(svg, /^<svg[^>]*aria-hidden="true"/, e);
    assert.doesNotMatch(svg, /<animate|@keyframes|animation/, e);
  }
});

teste('personagem: altura proporcional ao tamanho (140 x 170)', () => {
  assert.match(personagemSVG('ola', 140), /width="140" height="170"/);
});
