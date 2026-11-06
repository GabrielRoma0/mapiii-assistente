// Dados do app, empacotados no build: funcionam offline e não fazem requisição de rede.
import kbJson from '../../data/kb.json';
import dominiosJson from '../../data/dominios-oficiais.json';
import servicosJson from '../../data/servicos-valores.json';
import { criarIndice } from '../core/busca.ts';
import { CONFIG } from '../core/config.ts';
import { camposUsados } from '../core/auditoria.ts';
import type { Entrada } from '../core/kb-schema.ts';
import type { ListaDominios, ServicoValor } from '../core/oficial.ts';
import { KB_EXEMPLO } from './kb-exemplo.ts';

const kbReal = kbJson as Entrada[];

/**
 * true só em `npm run dev`: com a base vazia, ou com VITE_BASE_EXEMPLO=true (os testes de tela usam a base fictícia
 * para não depender do conteúdo real). Nunca no build de produção.
 */
export const USANDO_EXEMPLO = import.meta.env.DEV && (kbReal.length === 0 || import.meta.env.VITE_BASE_EXEMPLO === 'true');

export const KB: Entrada[] = USANDO_EXEMPLO ? KB_EXEMPLO : kbReal;
export const INDICE = criarIndice(KB);
export const CAMPOS_USADOS = new Set(camposUsados(KB).keys());
export const DOMINIOS = dominiosJson as ListaDominios;
export const SERVICOS = servicosJson as ServicoValor[];
export const CANAL_OFICIAL_ID: string | null = USANDO_EXEMPLO ? 'exemplo-central' : CONFIG.canalOficialId;

export function entradaPorId(id: string): Entrada | undefined {
  return KB.find((e) => e.id === id);
}
