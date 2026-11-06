// Confere os arquivos de data/ contra os esquemas. Uso: npm run validar-kb
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { validarKb } from '../src/core/kb-schema.ts';
import { validarDominios, validarServicosValores } from '../src/core/oficial.ts';
import { validarExemplo } from '../src/app/embarque/exemplo.ts';

function ler(nome: string): unknown {
  try {
    return JSON.parse(readFileSync(fileURLToPath(new URL(`../data/${nome}`, import.meta.url)), 'utf8'));
  } catch (erro) {
    console.error(`Não consegui ler data/${nome}: ${(erro as Error).message}`);
    process.exit(1);
  }
}

const kb = ler('kb.json');
const ids = new Set(Array.isArray(kb) ? kb.map((e) => String((e as { id?: unknown })?.id)) : []);
const arquivos: [string, string[], string][] = [
  ['kb.json', validarKb(kb), `${Array.isArray(kb) ? kb.length : 0} entrada(s)`],
  ['dominios-oficiais.json', validarDominios(ler('dominios-oficiais.json')), 'lista de domínios'],
  ['servicos-valores.json', validarServicosValores(ler('servicos-valores.json'), ids), 'valores de serviços'],
  ['embarque-exemplo.json', validarExemplo(ler('embarque-exemplo.json')), 'exemplo do Embarque (fictício)']
];

let falhou = false;
for (const [nome, erros, resumo] of arquivos) {
  if (erros.length) {
    falhou = true;
    console.error(`${erros.length} problema(s) em data/${nome}:`);
    for (const e of erros) console.error(`  - ${e}`);
  } else {
    console.log(`data/${nome} válido: ${resumo}.`);
  }
}
if (falhou) process.exit(1);
