// "Lembrar minhas respostas neste aparelho" (decidido pela dupla em 06/11/2026).
// Desligado por padrão. Só com a caixa marcada, as respostas da triagem e o modo ficam no navegador
// (localStorage, sem rede, sem conta). Desmarcar apaga. Nada além de ids e valores de data/perguntas.json é guardado:
// o que não for uma opção válida de uma pergunta existente é descartado ao gravar e ao ler.
import { PERGUNTAS, comoLista, valoresAceitos, type Modo, type Pergunta, type Respostas } from './perguntas.ts';
import type { Armazenamento } from './registro.ts';

export const CHAVE_RESPOSTAS = 'mapiii.respostas.v1';

export const AVISO_LEMBRAR =
  'Fica só neste aparelho, sem enviar nada. Quem usar este aparelho poderá ver as respostas. Desmarque para apagar.';

export interface Guardado {
  respostas: Respostas;
  modo: Modo | null;
}

/** Só perguntas que existem e só valores que são opções delas; "única" vira texto, "múltipla" vira lista. */
export function limparRespostasGuardadas(r: unknown, perguntas: Pergunta[] = PERGUNTAS): Respostas {
  if (!r || typeof r !== 'object' || Array.isArray(r)) return {};
  const saida: Respostas = {};
  for (const p of perguntas) {
    const bruto = (r as Record<string, unknown>)[p.id];
    if (bruto === undefined) continue;
    const valores = (Array.isArray(bruto) ? bruto : [bruto]).filter((v): v is string => typeof v === 'string' && valoresAceitos(p).includes(v));
    if (!valores.length) continue;
    if (p.tipo === 'multipla') saida[p.id] = [...new Set(valores)];
    else saida[p.id] = valores[0];
  }
  return saida;
}

const modoValido = (m: unknown): Modo | null => (m === 'pessoa' || m === 'cuidador' ? m : null);

/** null quando não há nada guardado (a caixa estava desmarcada) ou o armazenamento está bloqueado. */
export function lerRespostasGuardadas(arm: Armazenamento | null, perguntas: Pergunta[] = PERGUNTAS): Guardado | null {
  try {
    const bruto = arm?.getItem(CHAVE_RESPOSTAS);
    if (!bruto) return null;
    const o = JSON.parse(bruto) as Record<string, unknown>;
    if (!o || typeof o !== 'object') return null;
    return { respostas: limparRespostasGuardadas(o.respostas, perguntas), modo: modoValido(o.modo) };
  } catch {
    return null;
  }
}

export function guardarRespostas(arm: Armazenamento | null, g: Guardado, perguntas: Pergunta[] = PERGUNTAS): boolean {
  if (!arm) return false;
  try {
    arm.setItem(CHAVE_RESPOSTAS, JSON.stringify({ respostas: limparRespostasGuardadas(g.respostas, perguntas), modo: modoValido(g.modo) }));
    return true;
  } catch {
    return false;
  }
}

export function apagarRespostasGuardadas(arm: Armazenamento | null): void {
  try {
    arm?.removeItem(CHAVE_RESPOSTAS);
  } catch {
    /* bloqueado */
  }
}

/** Quantas perguntas têm resposta (para a tela dizer o que está guardado). */
export const quantasRespondidas = (r: Respostas) => Object.values(r).filter((v) => comoLista(v).length > 0).length;
