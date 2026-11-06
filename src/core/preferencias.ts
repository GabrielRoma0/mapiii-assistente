// Preferências simples do aparelho, sem dado pessoal: se a pessoa já viu as boas-vindas.
import type { Armazenamento } from './registro.ts';

export const CHAVE_BOAS_VINDAS = 'mapiii.boasvindas.v1';

export function boasVindasVistas(arm: Armazenamento | null): boolean {
  try {
    return arm?.getItem(CHAVE_BOAS_VINDAS) === 'vista';
  } catch {
    return false;
  }
}

export function marcarBoasVindas(arm: Armazenamento | null): void {
  try {
    arm?.setItem(CHAVE_BOAS_VINDAS, 'vista');
  } catch {
    /* bloqueado: vale só nesta visita */
  }
}
