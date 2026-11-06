// Auditoria entre data/perguntas.json e data/kb.json (npm run auditar-perguntas).
// Regra: só perguntar o que alguma condição da base usa, e nenhuma condição usa pergunta inexistente.
import type { Pergunta } from './perguntas.ts';

export interface ResultadoAuditoria {
  /** Perguntas que nenhuma condição usa (nem indiretamente, por mostrar_se). */
  semUso: string[];
  /** Condições que citam uma pergunta que não existe: "id-da-entrada → p_x". */
  inexistentes: string[];
  ok: boolean;
}

interface EntradaComCondicoes {
  id?: unknown;
  condicoes?: unknown;
}

/** Ids de pergunta citados em `condicoes` de cada entrada. */
export function camposUsados(kb: EntradaComCondicoes[]): Map<string, string[]> {
  const usos = new Map<string, string[]>();
  for (const e of kb) {
    const c = e?.condicoes;
    if (!c || typeof c !== 'object') continue;
    for (const grupo of Object.values(c as Record<string, unknown>)) {
      if (!Array.isArray(grupo)) continue;
      for (const r of grupo) {
        const campo = (r as { campo?: unknown })?.campo;
        if (typeof campo !== 'string') continue;
        usos.set(campo, [...(usos.get(campo) ?? []), String(e.id)]);
      }
    }
  }
  return usos;
}

export function auditarPerguntas(perguntas: Pergunta[], kb: EntradaComCondicoes[]): ResultadoAuditoria {
  const usos = camposUsados(kb);
  const ids = new Set(perguntas.map((p) => p.id));

  const usadas = new Set([...usos.keys()].filter((c) => ids.has(c)));
  // Pergunta que só serve para mostrar outra (mostrar_se) conta como usada se a outra for usada.
  for (const p of perguntas) if (usadas.has(p.id) && p.mostrar_se) usadas.add(p.mostrar_se.campo);

  const semUso = perguntas.filter((p) => !usadas.has(p.id)).map((p) => p.id);
  const inexistentes = [...usos.entries()]
    .filter(([campo]) => !ids.has(campo))
    .flatMap(([campo, entradas]) => entradas.map((id) => `${id} → ${campo}`));

  return { semUso, inexistentes, ok: !semUso.length && !inexistentes.length };
}
