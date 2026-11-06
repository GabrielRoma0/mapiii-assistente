// Tamanho do texto do app (A, A+, A++), para quem lê com dificuldade. Preferência visual, sem dado pessoal:
// fica no aparelho como o tema. Aplicado com CSS zoom na casca do app (o CSS usa px, então zoom é o que escala tudo).
import type { Armazenamento } from './registro.ts';

export type Tamanho = 'normal' | 'grande' | 'maior';
export const ESCALAS: Record<Tamanho, number> = { normal: 1, grande: 1.15, maior: 1.3 };
export const ROTULOS_TAMANHO: Record<Tamanho, string> = { normal: 'A', grande: 'A+', maior: 'A++' };
export const CHAVE_TAMANHO = 'mapiii.tamanho.v1';

export function lerTamanho(arm: Armazenamento | null): Tamanho {
  try {
    const v = arm?.getItem(CHAVE_TAMANHO);
    return v === 'grande' || v === 'maior' ? v : 'normal';
  } catch {
    return 'normal';
  }
}

export function guardarTamanho(arm: Armazenamento | null, t: Tamanho): void {
  try {
    arm?.setItem(CHAVE_TAMANHO, t);
  } catch {
    /* bloqueado: vale só nesta visita */
  }
}
