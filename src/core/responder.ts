// Pergunta livre: junta validação, busca e "fora do tema" numa resposta só.
// O texto da pergunta não aparece em nenhum resultado e não é guardado.
import { CONFIG, type ConfigBusca } from './config.ts';
import { buscar, type Indice, type Pontuado } from './busca.ts';
import { foraDoTema, validarEntrada, type MotivoRecusa } from './validar.ts';
import type { Entrada } from './kb-schema.ts';
import { normalizar } from './normalizar.ts';

export const MENSAGEM_NAO_ENCONTREI = 'Não encontrei isso na minha base. Para não arriscar uma resposta errada, procure o canal oficial.';
export const MENSAGEM_ACOLHIMENTO = 'Sinto muito. Receber um não é difícil. Você não precisa resolver tudo hoje.';
// Pedido negado ou cancelado: o Leco acolhe antes de responder (estado "Acolhimento" do design).
const RE_ASSUNTO_DIFICIL = /\b(negaram|negado|negada|negou|indeferid[oa]|indeferiram|recusaram|cancelaram|cortaram|suspenderam)\b/;

export function ehAssuntoDificil(texto: string): boolean {
  return RE_ASSUNTO_DIFICIL.test(normalizar(texto));
}

/** Passos para mostrar na resposta: os da entrada ou, se não houver, os montados a partir de documentos e onde. */
export function passosDaEntrada(e: Entrada): string[] {
  if (e.passos?.length) return e.passos;
  const passos: string[] = [];
  if (e.documentos?.length) passos.push(`Separe: ${e.documentos.join(', ')}.`);
  if (e.onde) passos.push(`Faça o pedido: ${e.onde.texto}`);
  return passos;
}

export const MENSAGEM_FORA_DO_TEMA = 'Esse assunto fica fora do que eu sei. Eu ajudo com direitos e serviços públicos em São Paulo.';

export type RespostaPergunta =
  | { tipo: 'recusa'; motivo: MotivoRecusa; mensagem: string }
  | { tipo: 'fora_do_tema'; mensagem: string; canal: Entrada | null }
  | { tipo: 'nao_encontrei'; mensagem: string; sugestoes: Pontuado<Entrada>[]; canal: Entrada | null; acolher: boolean }
  | { tipo: 'resposta'; entrada: Entrada; pontuacao: number; sugestoes: Pontuado<Entrada>[]; acolher: boolean };

export interface OpcoesResponder {
  busca?: Partial<ConfigBusca>;
  canalOficialId?: string | null;
}

export function responderPergunta(pergunta: unknown, indice: Indice<Entrada>, opcoes: OpcoesResponder = {}): RespostaPergunta {
  const v = validarEntrada(pergunta);
  // Emergência, dados pessoais e pedidos de conselho param aqui: a busca nem roda.
  if (!v.ok) return { tipo: 'recusa', motivo: v.motivo, mensagem: v.mensagem };

  const idCanal = opcoes.canalOficialId === undefined ? CONFIG.canalOficialId : opcoes.canalOficialId;
  const canal = idCanal ? (indice.entradas.find((i) => i.entrada.id === idCanal)?.entrada ?? null) : null;

  const r = buscar(v.texto, indice, opcoes.busca);
  const acolher = ehAssuntoDificil(v.texto);
  if (r.melhor) {
    return { tipo: 'resposta', entrada: r.melhor.entrada, pontuacao: r.melhor.pontuacao, sugestoes: r.sugestoes, acolher };
  }
  if (foraDoTema(v.texto, indice)) return { tipo: 'fora_do_tema', mensagem: MENSAGEM_FORA_DO_TEMA, canal };
  return { tipo: 'nao_encontrei', mensagem: MENSAGEM_NAO_ENCONTREI, sugestoes: r.sugestoes, canal, acolher };
}
