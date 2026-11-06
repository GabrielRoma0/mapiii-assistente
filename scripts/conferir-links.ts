// Abre todos os links oficiais de data/ e lista os que não respondem. Uso: npm run conferir-links
// Roda toda segunda no GitHub (.github/workflows/conferir-links.yml); se algum falhar, o GitHub avisa por e-mail.
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { coletarLinks, conferirLinks } from '../src/core/links.ts';

const ler = (nome: string) => JSON.parse(readFileSync(fileURLToPath(new URL(`../data/${nome}`, import.meta.url)), 'utf8'));
const links = coletarLinks(ler('kb.json'), ler('dominios-oficiais.json'), ler('servicos-valores.json'));
console.log(`Conferindo ${links.length} link(s)...`);
const problemas = await conferirLinks(links);
for (const p of problemas) console.error(`- ${p.url} (${p.situacao}) em: ${p.onde.join('; ')}`);
if (problemas.length) {
  console.error(`\n${problemas.length} link(s) com problema. Abra cada um, confira a fonte e atualize a ficha (e o verificado_em).`);
  process.exit(1);
}
console.log('Todos os links responderam.');
