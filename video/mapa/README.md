# Mapa-múndi da cena 15

- `mundo.svg`: contorno das terras, 1920 × 960, projeção equiretangular, sem a Antártida (latitudes de 84° a −60°). Cor Lilac Ash `#9A8C98`; trocar no Remotion se precisar.
- **Pino de São Paulo** (−46,63; −23,55): x **711**, y **717** no `mundo.svg`.
- Fonte: **Natural Earth**, 1:110m, domínio público (naturalearthdata.com), pela redistribuição `world-atlas` 2.0.2 (Natural Earth 4.1.0; licença ISC de Michael Bostock) em `land-110m.json`. O site do Natural Earth está bloqueado para o Claude Code; os dados são os mesmos do "Land" da página 1:110m.
- Gerado em 10/11/2026 pelo Claude Code com `gerar-mapa.mjs` (precisa do `topojson-client` 3.1.0):
  `node gerar-mapa.mjs <caminho do topojson-client.js> land-110m.json mundo.svg`
