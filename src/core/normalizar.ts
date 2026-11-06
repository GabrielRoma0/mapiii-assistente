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
  'fazer', 'faco', 'faz', 'ola', 'oi', 'obrigado', 'obrigada'
]);

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
    .map(singular);
}
