// Avaliação offline: npm run eval
// Lê data/kb.json e os gabaritos de eval/, mostra os números e grava eval/resultados.csv.
// Não usa a base de exemplo: mede só o que está em data/kb.json.
import { readFileSync, writeFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import {
  avaliarCenarios,
  avaliarPerguntas,
  lerCsv,
  metricasCenarios,
  metricasPerguntas,
  resultadosCsv,
  validarCenarios,
  validarGabaritoPerguntas,
  type Taxa
} from '../src/core/avaliacao.ts';
import { CONFIG } from '../src/core/config.ts';
import type { Entrada } from '../src/core/kb-schema.ts';

const caminho = (rel: string) => fileURLToPath(new URL(`../${rel}`, import.meta.url));
const kb = JSON.parse(readFileSync(caminho('data/kb.json'), 'utf8')) as Entrada[];
const ids = new Set(kb.map((e) => e.id));

const { casos, erros: errosP } = validarGabaritoPerguntas(lerCsv(readFileSync(caminho('eval/gabarito_perguntas.csv'), 'utf8')), ids);
const { cenarios, erros: errosC } = validarCenarios(JSON.parse(readFileSync(caminho('eval/gabarito_cenarios.json'), 'utf8')), ids);
if (errosP.length || errosC.length) {
  console.error('Gabarito com problema (corrija antes de avaliar):');
  for (const e of [...errosP, ...errosC]) console.error(`  - ${e}`);
  process.exit(1);
}

const pct = (t: Taxa | number | null) => {
  const v = t === null ? null : typeof t === 'number' ? t : t.taxa;
  const sufixo = t !== null && typeof t === 'object' ? ` (${t.acertos}/${t.total})` : '';
  return v === null ? '—' : `${(v * 100).toFixed(1).replace('.', ',')}%${sufixo}`;
};

console.log(`Base: ${kb.length} entrada(s). Limite de resposta da busca: ${CONFIG.busca.limiteResposta}.`);
if (!kb.length) console.log('Aviso: data/kb.json está vazio. Só os casos RECUSAR medem algo, e eles passam porque nada é respondido.');

// (a) pergunta livre
const rp = avaliarPerguntas(casos, kb, CONFIG.canalOficialId);
const mp = metricasPerguntas(rp);
console.log(`\n(a) Pergunta livre: ${casos.length} pergunta(s)`);
console.log(`  Acerto geral ........ ${pct(mp.geral)}`);
console.log(`  Acerto no grupo teste ${pct(mp.porGrupo.teste)}   ← número honesto`);
console.log(`  Acerto no grupo ajuste ${pct(mp.porGrupo.ajuste)}`);
console.log(`  Esperado entre a resposta e as 2 sugestões: ${pct(mp.top3)}`);
console.log(`  Recusas corretas (RECUSAR sem resposta): ${pct(mp.recusasCorretas)}`);
console.log(`  Ficou sem resposta quando havia (recusa indevida): ${pct(mp.recusasIndevidas)}`);
console.log('  Por tema:');
for (const [tema, t] of Object.entries(mp.porTema)) console.log(`    ${tema.padEnd(24)} ${pct(t)}`);
if (mp.erros.length) {
  console.log('  Erros:');
  for (const e of mp.erros) console.log(`    - [${e.grupo}] "${e.pergunta}" → esperado ${e.esperado}, veio ${e.obtido}${e.pontuacao !== null ? ` (${e.pontuacao.toFixed(2)})` : ''}`);
}

// (b) Rota dos Direitos
const rc = avaliarCenarios(cenarios, kb);
const rcTalvez = avaliarCenarios(cenarios, kb, true);
const mc = metricasCenarios(rc);
const mcTalvez = metricasCenarios(rcTalvez);
console.log(`\n(b) Rota dos Direitos: ${cenarios.length} cenário(s)`);
console.log(`  Só "Pode ter direito" ........ precisão ${pct(mc.precisao)} · cobertura ${pct(mc.cobertura)} · conjunto exato ${pct(mc.exatos)}`);
console.log(`  "Pode ter direito" + "Talvez" . precisão ${pct(mcTalvez.precisao)} · cobertura ${pct(mcTalvez.cobertura)} · conjunto exato ${pct(mcTalvez.exatos)}`);
for (const r of rc.filter((r) => r.precisao !== 1 || r.cobertura !== 1)) {
  if (!r.previstos.length && !r.cenario.esperados.length) continue;
  console.log(`    - ${r.cenario.id}: esperado [${r.cenario.esperados.join(', ')}], previsto [${r.previstos.join(', ')}]`);
}

writeFileSync(caminho('eval/resultados.csv'), resultadosCsv(rp, rc, rcTalvez));
console.log('\nGravado: eval/resultados.csv');
