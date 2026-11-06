// Cartão da cadeira (guia v2): a pessoa responde uma vez e o app monta uma mensagem educada para o chat
// do motorista de app ou táxi, para ele saber o que esperar antes de chegar.
// Só escolhas fixas, sem texto livre: não cabe nome, endereço nem diagnóstico.
// Fica só na memória da página, a não ser que a pessoa marque "Guardar neste aparelho" (localStorage, sem rede).
import type { Armazenamento } from './registro.ts';

export const OPCOES_CARTAO = {
  cadeira: { dobravel: 'Dobrável', motorizada: 'Motorizada', rigida: 'Não dobra' },
  peso: { ate_15: 'Até 15 kg', de_15_a_30: 'De 15 a 30 kg', mais_30: 'Mais de 30 kg', nao_sei: 'Não sei' },
  portaMalas: { sim: 'Sim', nao: 'Não', nao_sei: 'Não sei' },
  transferencia: { sozinha: 'Sem ajuda', pouca_ajuda: 'Com um pouco de ajuda', ajuda: 'Preciso de ajuda', nao_faco: 'Não faço: fico na cadeira' },
  acompanhante: { sim: 'Sim', nao: 'Não' }
} as const;

export type CampoCartao = keyof typeof OPCOES_CARTAO;
export type Cartao = { [C in CampoCartao]: keyof (typeof OPCOES_CARTAO)[C] };

export const PERGUNTAS_CARTAO: Record<CampoCartao, string> = {
  cadeira: 'Que tipo de cadeira?',
  peso: 'Peso aproximado da cadeira',
  portaMalas: 'Cabe no porta-malas de um carro pequeno?',
  transferencia: 'Passar da cadeira para o banco do carro',
  acompanhante: 'Vai com acompanhante?'
};

export const CHAVE_CARTAO = 'mapiii.cartao.v1';

export function cartaoValido(c: unknown): c is Cartao {
  if (!c || typeof c !== 'object' || Array.isArray(c)) return false;
  const o = c as Record<string, unknown>;
  const campos = Object.keys(OPCOES_CARTAO) as CampoCartao[];
  return Object.keys(o).length === campos.length && campos.every((k) => typeof o[k] === 'string' && (o[k] as string) in OPCOES_CARTAO[k]);
}

const FRASE_CADEIRA: Record<Cartao['cadeira'], string> = {
  dobravel: 'Uso cadeira de rodas dobrável',
  motorizada: 'Uso cadeira de rodas motorizada',
  rigida: 'Uso cadeira de rodas que não dobra'
};
const FRASE_PESO: Record<Cartao['peso'], string> = { ate_15: ', de até 15 kg', de_15_a_30: ', de 15 a 30 kg', mais_30: ', de mais de 30 kg', nao_sei: '' };
const FRASE_PORTA_MALAS: Record<Cartao['portaMalas'], string> = {
  sim: ', que cabe no porta-malas de carro pequeno.',
  nao: '. Ela não cabe no porta-malas de carro pequeno: preciso de carro maior ou adaptado.',
  nao_sei: '.'
};
const FRASE_TRANSFERENCIA: Record<Cartao['transferencia'], string> = {
  sozinha: 'Faço a transferência para o banco sem ajuda.',
  pouca_ajuda: 'Faço a transferência para o banco com um pouco de ajuda.',
  ajuda: 'Preciso de ajuda para passar para o banco.',
  nao_faco: 'Viajo na própria cadeira: preciso de veículo adaptado.'
};

/** Mensagem pronta para colar no chat do motorista. Só frases fixas, nenhum dado pessoal. */
export function mensagemDoCartao(c: Cartao): string {
  return [
    'Olá!',
    `${FRASE_CADEIRA[c.cadeira]}${FRASE_PESO[c.peso]}${FRASE_PORTA_MALAS[c.portaMalas]}`,
    FRASE_TRANSFERENCIA[c.transferencia],
    c.acompanhante === 'sim' ? 'Estou com um acompanhante.' : '',
    'Agradeço!'
  ]
    .filter(Boolean)
    .join(' ');
}

export function lerCartao(arm: Armazenamento | null): Cartao | null {
  try {
    const c = JSON.parse(arm?.getItem(CHAVE_CARTAO) ?? 'null');
    return cartaoValido(c) ? c : null;
  } catch {
    return null;
  }
}

/** Guarda só os cinco campos validados. Devolve false se o armazenamento estiver bloqueado. */
export function guardarCartao(arm: Armazenamento | null, c: Cartao): boolean {
  if (!arm || !cartaoValido(c)) return false;
  const limpo = Object.fromEntries((Object.keys(OPCOES_CARTAO) as CampoCartao[]).map((k) => [k, c[k]]));
  try {
    arm.setItem(CHAVE_CARTAO, JSON.stringify(limpo));
    return true;
  } catch {
    return false;
  }
}

export function apagarCartao(arm: Armazenamento | null): void {
  try {
    arm?.removeItem(CHAVE_CARTAO);
  } catch {
    /* bloqueado */
  }
}
