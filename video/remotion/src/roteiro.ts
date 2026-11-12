// Roteiro do vídeo em código: as 18 cenas de video/README.md (seção 4) e as 3 das telas do app, com o tempo e a locução de cada uma.
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
  { n: 8, inicio: 49.5, fim: 58.333, quem: 'off', camera: false, locucao: 'Nunca diz "você tem direito". Diz "pode ter direito". E mostra a fonte oficial, com a data em que foi conferida.' },
  { n: 9, inicio: 58.333, fim: 66.967, quem: 'off', camera: false, locucao: 'Na rua, se o motorista disser que não pode, você vira a tela: letra grande, a lei, e um código que abre o texto oficial.' },
  { n: 10, inicio: 66.967, fim: 73.433, quem: 'off', camera: false, locucao: 'E com o celular no bolso, ele pode avisar em voz alta quando o próximo ônibus acessível está chegando.' },
  { n: 11, inicio: 81.433, fim: 89.0, quem: 'off', camera: false, locucao: 'Ele também sabe dizer não. Remédio ou processo? Mostra quem pode ajudar. Emergência? Ligue 192.' },
  { n: 12, inicio: 89.0, fim: 97.367, quem: 'off', camera: false, locucao: 'E a gente mediu. Das doze perguntas que ele precisava recusar, recusou as doze. E nota máxima de acessibilidade.' },
  { n: 13, inicio: 97.367, fim: 102.733, quem: 'off', camera: false, locucao: 'E ainda: funciona sem internet, com um toque, e lê a resposta em voz alta.' },
  { n: 14, inicio: 108.233, fim: 111.433, quem: 'Gabriel', camera: true, locucao: 'Começamos por São Paulo. A SPTrans é só o primeiro exemplo.' },
  { n: 15, inicio: 111.433, fim: 119.467, quem: 'off', camera: false, locucao: 'O Mapiii é feito de fichas com fonte oficial. Troque a base, e ele pode funcionar em outra cidade. Em outro estado. Em outro país.' },
  { n: 16, inicio: 119.467, fim: 123.833, quem: 'off', camera: false, locucao: 'Menos desigualdade. Cidades que funcionam para todo mundo.' },
  { n: 17, inicio: 123.833, fim: 129.0, quem: 'Thor e Gabriel', camera: true, locucao: 'Ninguém deveria ficar no ponto. Você pode ter direito. Agora, você sabe onde ir.' },
  { n: 18, inicio: 129.0, fim: 133.333, quem: 'off', camera: false, locucao: 'Mapiii. O mapa dos seus direitos.' },
  // Cenas 19 e 20: gravações da tela do app real (video/gravacoes/app/), logo depois das cenas 7 (triagem) e 13 (conferir se é oficial).
  // Ficam no fim da lista para não mudar o número das outras; a ordem no vídeo é a do tempo (inicio).
  // Narração gravada pela dupla em 12/11 (narracao/cena-19.mp3 e cena-20.mp3).
  { n: 19, inicio: 43.5, fim: 49.5, quem: 'off', camera: false, locucao: 'Olha o app de verdade: poucos toques, e ele mostra o que pode se aplicar, com fonte oficial.' },
  { n: 20, inicio: 102.733, fim: 108.233, quem: 'off', camera: false, locucao: 'Recebeu ou achou um link estranho? Ele avisa quando parecer suspeito.' },
  // Cena 21: o Leco como assistente (pergunta livre e resposta), depois da cena 10 e antes de "Ele também sabe dizer não".
  // Narração gravada pelo Thor em 12/11 (narracao/cena-21.mp3).
  { n: 21, inicio: 73.433, fim: 81.433, quem: 'off', camera: false, locucao: 'Ou pergunte do seu jeito, escrevendo ou falando. O Leco procura na base e responde com o resumo, o passo a passo e a fonte.' }
];

export const DURACAO_TOTAL = Math.round(Math.max(...CENAS.map((c) => c.fim)) * FPS);

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
