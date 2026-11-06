// Confere se toda pergunta da triagem é usada pela base e se toda condição usa uma pergunta que existe.
// Uso: npm run auditar-perguntas
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { auditarPerguntas } from '../src/core/auditoria.ts';
import { PERGUNTAS, validarPerguntas } from '../src/core/perguntas.ts';

const ler = (nome: string): unknown => JSON.parse(readFileSync(fileURLToPath(new URL(`../data/${nome}`, import.meta.url)), 'utf8'));

const errosPerguntas = validarPerguntas(ler('perguntas.json'));
if (errosPerguntas.length) {
  console.error(`${errosPerguntas.length} problema(s) em data/perguntas.json:\n`);
  for (const e of errosPerguntas) console.error(`  - ${e}`);
  process.exit(1);
}

const r = auditarPerguntas(PERGUNTAS, ler('kb.json') as { id?: unknown; condicoes?: unknown }[]);
if (r.inexistentes.length) {
  console.error('Condições que usam pergunta inexistente:');
  for (const i of r.inexistentes) console.error(`  - ${i}`);
}
if (r.semUso.length) {
  console.error('Perguntas que nenhuma condição da base usa (remova a pergunta ou use-a numa condição):');
  for (const id of r.semUso) console.error(`  - ${id}`);
}
if (!r.ok) process.exit(1);
console.log(`Auditoria ok: ${PERGUNTAS.length} pergunta(s), todas usadas pela base.`);
