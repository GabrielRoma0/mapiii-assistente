// Normalização de texto para a busca: minúsculas, sem acentos, sem palavras vazias.
// Funciona igual no navegador e no Node (testes e eval/avaliar.ts).

// Palavras vazias do português (já sem acento). "sem" e "nao" ficam de fora de propósito:
// "calçada sem rampa" e "não pode" mudam de sentido se elas somem.
export const PALAVRAS_VAZIAS = new Set([
  'a', 'o', 'as', 'os', 'um', 'uma', 'uns', 'umas',
  'de', 'do', 'da', 'dos', 'das', 'dum', 'duma',
  'em', 'no', 'na', 'nos', 'nas', 'num', 'numa',
  'ao', 'aos', 'pelo', 'pela', 'pelos', 'pelas',
  'por', 'para', 'pra', 'com', 'ate', 'entre', 'sobre', 'sob',
  'e', 'ou', 'mas', 'que', 'se', 'ja', 'mais', 'muito', 'tambem',
  'qual', 'quais', 'como', 'quando', 'onde', 'quem', 'quanto', 'quanta', 'porque',
  'eu', 'meu', 'minha', 'meus', 'minhas', 'me', 'voce', 'seu', 'sua', 'nosso', 'nossa',
  'ele', 'ela', 'eles', 'elas', 'lhe', 'isso', 'isto', 'esse', 'essa', 'este', 'esta', 'aquele', 'aquela',
  'ser', 'sao', 'foi', 'era', 'sou', 'estao', 'estar',
  'ter', 'tem', 'tenho', 'tinha', 'ha',
  'posso', 'pode', 'podem', 'poder', 'preciso', 'quero', 'queria', 'gostaria', 'saber',
  'fazer', 'faco', 'faz', 'ola', 'oi', 'obrigado', 'obrigada',
  // Escrita informal (WhatsApp) e a cidade, que vale para a base inteira (C4, 10/11/2026).
  'q', 'tb', 'tbm', 'pq', 'mto', 'mt', 'qm', 'vc', 'ta', 'ne', 'kk', 'kkk', 'kkkk', 'pro', 'pros', 'pras',
  'algum', 'alguma', 'alguns', 'algumas', 'coisa', 'tipo', 'gente', 'la', 'ai', 'sp', 'paulo'
]);

// Formas da mesma palavra que a busca deve tratar como iguais (aplicado depois do singular, igual na base e na pergunta).
// Só variações de escrita e de flexão; nenhum sinônimo muda o assunto.
export const FORMAS_IGUAIS: Record<string, string> = {
  deficiente: 'deficiencia', pcd: 'deficiencia',
  gratis: 'gratuito', graca: 'gratuito', gratuita: 'gratuito', gratuidade: 'gratuito',
  renova: 'renovar', renovacao: 'renovar', renovo: 'renovar',
  denuncio: 'denunciar', denuncia: 'denunciar', denuncie: 'denunciar',
  reclamo: 'reclamar', reclamacao: 'reclamar', reclamei: 'reclamar', reclame: 'reclamar'
};

export function normalizar(texto: unknown): string {
  if (typeof texto !== 'string') return '';
  return texto
    .toLowerCase()
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .replace(/[^a-z0-9]+/g, ' ')
    .trim();
}

// Redução simples de plural. Aplicada igual à base e à pergunta, então só precisa ser consistente.
function singular(palavra: string): string {
  if (/^\d+$/.test(palavra) || palavra.length <= 3) return palavra;
  if (palavra.length > 4 && palavra.endsWith('oes')) return palavra.slice(0, -3) + 'ao';
  if (palavra.endsWith('ns')) return palavra.slice(0, -2) + 'm';
  if (palavra.endsWith('s') && !'uis'.includes(palavra[palavra.length - 2])) return palavra.slice(0, -1);
  return palavra;
}

export function tokenizar(texto: unknown): string[] {
  const normal = normalizar(texto);
  if (!normal) return [];
  return normal
    .split(' ')
    .filter((p) => p.length >= 2 && !PALAVRAS_VAZIAS.has(p))
    .map(singular)
    .map((p) => FORMAS_IGUAIS[p] ?? p);
}
