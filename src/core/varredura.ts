// Modo varredura ("usar com um toque"), para quem tem mobilidade muito reduzida: as opções da tela se
// destacam uma por vez e um toque em qualquer lugar (ou Espaço/Enter, ou um acionador) escolhe a destacada.
import type { Armazenamento } from './registro.ts';

export type Velocidade = 'lenta' | 'media' | 'rapida';
export const VELOCIDADES: Record<Velocidade, number> = { lenta: 4000, media: 2500, rapida: 1500 };
export const NOMES_VELOCIDADE: Record<Velocidade, string> = { lenta: 'Devagar (4 s)', media: 'Médio (2,5 s)', rapida: 'Rápido (1,5 s)' };
export const CHAVE_VELOCIDADE = 'mapiii.varredura.v1';

/** Próximo item a destacar; -1 se não há itens. */
export function proximoIndice(atual: number, total: number): number {
  if (total <= 0) return -1;
  return atual + 1 >= total || atual < -1 ? 0 : atual + 1;
}

export function lerVelocidade(arm: Armazenamento | null): Velocidade {
  try {
    const v = arm?.getItem(CHAVE_VELOCIDADE);
    return v === 'lenta' || v === 'rapida' ? v : 'media';
  } catch {
    return 'media';
  }
}

export function guardarVelocidade(arm: Armazenamento | null, v: Velocidade): void {
  try {
    arm?.setItem(CHAVE_VELOCIDADE, v);
  } catch {
    /* bloqueado */
  }
}
