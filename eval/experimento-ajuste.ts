// Calibração da busca (C4): npx tsx eval/experimento-ajuste.ts
// Mostra, para cada pergunta do grupo AJUSTE, a melhor nota, a segunda e os tokens. Não olha o grupo teste.
import { readFileSync } from 'node:fs';
import { lerCsv } from '../src/core/avaliacao.ts';
import { criarIndice, buscar } from '../src/core/busca.ts';
import { tokenizar } from '../src/core/normalizar.ts';
import type { Entrada } from '../src/core/kb-schema.ts';
const kb = JSON.parse(readFileSync('data/kb.json', 'utf8')) as Entrada[];
const ind = criarIndice(kb);
const linhas = lerCsv(readFileSync('eval/gabarito_perguntas.csv', 'utf8')).filter((l) => l.grupo === 'ajuste');
for (const l of linhas) {
  const r = buscar(l.pergunta, ind, { limiteResposta: 0 });
  const [a, b] = r.ranking;
  const ok = l.id_esperado === 'RECUSAR' ? '' : a.entrada.id === l.id_esperado ? 'top1' : 'ERRO';
  console.log(`${a.pontuacao.toFixed(2)} ${b.pontuacao.toFixed(2)} ${ok.padEnd(4)} ${l.id_esperado.slice(0, 22).padEnd(22)} ${tokenizar(l.pergunta).join(' ')}`);
}
