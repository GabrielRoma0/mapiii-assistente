// Roteiro do vídeo em código: as 18 cenas de video/README.md (seção 4), com o tempo e a locução de cada uma.
// O tempo de cada palavra vem de src/tempos-narracao.json (scripts/alinhar.py); sem ele, é estimado.
// Quando houver narração, src/tempos-narracao.json (gerado pela transcrição) substitui a estimativa.
import temposGravados from './tempos-narracao.json';

export const FPS = 30;
export const LARGURA = 1920;
export const ALTURA = 1080;

export type Quem = 'off' | 'Thor' | 'Gabriel' | 'Thor e Gabriel';

export interface Cena {
  n: number;
  inicio: number; // segundos
  fim: number;
  quem: Quem;
  camera: boolean; // cena gravada na câmera (espaço reservado até a gravação chegar)
  locucao: string;
}

export const CENAS: Cena[] = [
  { n: 1, inicio: 0.0, fim: 8.133, quem: 'off', camera: false, locucao: 'Sete e quarenta. O ônibus chegou. A rampa, não.' },
  { n: 2, inicio: 8.133, fim: 15.433, quem: 'Thor', camera: true, locucao: 'Para quem usa cadeira de rodas, essa cena é real. E quem cuida de alguém conhece a pergunta que vem depois: o que eu posso pedir? Onde? O que eu levo?' },
  { n: 3, inicio: 15.433, fim: 21.433, quem: 'Gabriel', camera: true, locucao: 'A resposta existe. Só que está espalhada, em linguagem difícil, e no meio de golpe.' },
  { n: 4, inicio: 21.433, fim: 28.967, quem: 'off', camera: false, locucao: 'No Brasil, são catorze vírgula quatro milhões de pessoas com deficiência, segundo o Censo de 2022.' },
  { n: 5, inicio: 28.967, fim: 31.867, quem: 'Thor', camera: true, locucao: 'E se o caminho coubesse no bolso, com a fonte junto?' },
  { n: 6, inicio: 31.867, fim: 37.133, quem: 'off', camera: false, locucao: 'Esse é o Mapiii. O mapa dos seus direitos. E esse é o Leco.' },
  { n: 7, inicio: 37.133, fim: 43.5, quem: 'off', camera: false, locucao: 'Você responde poucas perguntas, sem nome e sem CPF. Ele mostra o que você pode pedir, e por quê.' },
  { n: 8, inicio: 43.5, fim: 52.333, quem: 'off', camera: false, locucao: 'Nunca diz "você tem direito". Diz "pode ter direito". E mostra a fonte oficial, com a data em que foi conferida.' },
  { n: 9, inicio: 52.333, fim: 60.967, quem: 'off', camera: false, locucao: 'Na rua, se o motorista disser que não pode, você vira a tela: letra grande, a lei, e um código que abre o texto oficial.' },
  { n: 10, inicio: 60.967, fim: 67.433, quem: 'off', camera: false, locucao: 'E com o celular no bolso, ele pode avisar em voz alta quando o próximo ônibus acessível está chegando.' },
  { n: 11, inicio: 67.433, fim: 75.0, quem: 'off', camera: false, locucao: 'Ele também sabe dizer não. Remédio ou processo? Mostra quem pode ajudar. Emergência? Ligue 192.' },
  { n: 12, inicio: 75.0, fim: 83.367, quem: 'off', camera: false, locucao: 'E a gente mediu. Das doze perguntas que ele precisava recusar, recusou as doze. E nota máxima de acessibilidade.' },
  { n: 13, inicio: 83.367, fim: 88.733, quem: 'off', camera: false, locucao: 'E ainda: funciona sem internet, com um toque, e lê a resposta em voz alta.' },
  { n: 14, inicio: 88.733, fim: 91.933, quem: 'Gabriel', camera: true, locucao: 'Começamos por São Paulo. A SPTrans é só o primeiro exemplo.' },
  { n: 15, inicio: 91.933, fim: 99.967, quem: 'off', camera: false, locucao: 'O Mapiii é feito de fichas com fonte oficial. Troque a base, e ele pode funcionar em outra cidade. Em outro estado. Em outro país.' },
  { n: 16, inicio: 99.967, fim: 104.333, quem: 'off', camera: false, locucao: 'Menos desigualdade. Cidades que funcionam para todo mundo.' },
  { n: 17, inicio: 104.333, fim: 109.5, quem: 'Thor e Gabriel', camera: true, locucao: 'Ninguém deveria ficar no ponto. Você pode ter direito. Agora, você sabe onde ir.' },
  { n: 18, inicio: 109.5, fim: 113.833, quem: 'off', camera: false, locucao: 'Mapiii. O mapa dos seus direitos.' }
];

export const DURACAO_TOTAL = Math.round(CENAS[CENAS.length - 1].fim * FPS);

export const cena = (n: number): Cena => CENAS[n - 1];
export const quadrosDa = (c: Cena) => Math.round((c.fim - c.inicio) * FPS);
export const inicioEmQuadros = (c: Cena) => Math.round(c.inicio * FPS);

export const palavrasDe = (texto: string) => texto.split(/\s+/).filter(Boolean);

// Tempo de cada palavra, em quadros a partir do início da cena.
// Gravado: [{ cena, palavras: [{ texto, inicio, fim }] }] com segundos absolutos do vídeo.
interface PalavraGravada { texto: string; inicio: number; fim: number }
const gravados = temposGravados as unknown as { cena: number; palavras: PalavraGravada[] }[];

export interface TempoPalavra { texto: string; de: number; ate: number }

export function temposDasPalavras(n: number): TempoPalavra[] {
  const c = cena(n);
  const g = gravados.find((x) => x.cena === n);
  if (g && g.palavras.length) {
    return g.palavras.map((p) => ({ texto: p.texto, de: Math.round((p.inicio - c.inicio) * FPS), ate: Math.round((p.fim - c.inicio) * FPS) }));
  }
  // Estimativa: 0,4 s de folga no começo e 0,5 s no fim; palavras longas e pontuação pesam mais.
  const palavras = palavrasDe(c.locucao);
  const pesos = palavras.map((p) => 1 + p.replace(/[^\p{L}\d]/gu, '').length / 7 + (/[.?!:]$/.test(p) ? 0.9 : /,$/.test(p) ? 0.4 : 0));
  const total = pesos.reduce((a, b) => a + b, 0);
  const ini = 0.4 * FPS;
  const util = quadrosDa(c) - ini - 0.5 * FPS;
  let t = ini;
  return palavras.map((texto, i) => {
    const d = (pesos[i] / total) * util;
    const r = { texto, de: Math.round(t), ate: Math.round(t + d) };
    t += d;
    return r;
  });
}

// Quadro (relativo à cena) em que começa a palavra que contém `alvo` (a k-ésima ocorrência, a partir de 0).
export function naPalavra(n: number, alvo: string, k = 0): number {
  const norm = (s: string) => s.toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '').replace(/[^a-z0-9]/g, '');
  const a = norm(alvo);
  const ps = temposDasPalavras(n).filter((p) => norm(p.texto) === a || norm(p.texto).startsWith(a));
  const p = ps[Math.min(k, ps.length - 1)];
  if (!p) throw new Error(`Palavra "${alvo}" não está na locução da cena ${n}`);
  return p.de;
}
