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
  { n: 1, inicio: 0.0, fim: 6.71, quem: 'off', camera: false, locucao: 'Sete e quarenta. O ônibus chegou. A rampa, não.' },
  { n: 2, inicio: 6.71, fim: 14.01, quem: 'Thor', camera: true, locucao: 'Para quem usa cadeira de rodas, essa cena é real. E quem cuida de alguém conhece a pergunta que vem depois: o que eu posso pedir? Onde? O que eu levo?' },
  { n: 3, inicio: 14.01, fim: 19.53, quem: 'Gabriel', camera: true, locucao: 'A resposta existe. Só que está espalhada, em linguagem difícil, e no meio de golpe.' },
  { n: 4, inicio: 19.53, fim: 25.45, quem: 'off', camera: false, locucao: 'No Brasil, são catorze vírgula quatro milhões de pessoas com deficiência, segundo o Censo de 2022.' },
  { n: 5, inicio: 25.45, fim: 28.35, quem: 'Thor', camera: true, locucao: 'E se o caminho coubesse no bolso, com a fonte junto?' },
  { n: 6, inicio: 28.35, fim: 37.922, quem: 'off', camera: false, locucao: 'Esse é o Mapiii. O mapa dos seus direitos. E esse é o Leco. Ele começa pela mobilidade: ônibus, carro, calçada e reclamação.' },
  { n: 7, inicio: 37.922, fim: 44.002, quem: 'off', camera: false, locucao: 'Você responde poucas perguntas, sem nome e sem CPF. Ele mostra o que você pode pedir, e por quê.' },
  { n: 8, inicio: 57.286, fim: 65.096, quem: 'off', camera: false, locucao: 'Nunca diz "você tem direito". Diz "pode ter direito". E mostra a fonte oficial, com a data em que foi conferida.' },
  { n: 9, inicio: 103.686, fim: 112.026, quem: 'off', camera: false, locucao: 'Na rua, se o motorista disser que não pode, você vira a tela: letra grande, a lei, e um código que abre o texto oficial.' },
  { n: 10, inicio: 65.096, fim: 70.766, quem: 'off', camera: false, locucao: 'E com o celular no bolso, ele pode avisar em voz alta quando o próximo ônibus acessível está chegando.' },
  { n: 11, inicio: 121.986, fim: 128.416, quem: 'off', camera: false, locucao: 'Ele também sabe dizer não. Remédio ou processo? Mostra quem pode ajudar. Emergência? Ligue 192.' },
  { n: 12, inicio: 135.22, fim: 143.23, quem: 'off', camera: false, locucao: 'E a gente mediu. Das doze perguntas que ele precisava recusar, recusou as doze. E nota máxima de acessibilidade.' },
  { n: 13, inicio: 143.23, fim: 148.02, quem: 'off', camera: false, locucao: 'E ainda: funciona sem internet, com um toque, e lê a resposta em voz alta.' },
  { n: 14, inicio: 148.02, fim: 151.22, quem: 'Gabriel', camera: true, locucao: 'Começamos por São Paulo. A SPTrans é só o primeiro exemplo.' },
  { n: 15, inicio: 151.22, fim: 158.87, quem: 'off', camera: false, locucao: 'O Mapiii é feito de fichas com fonte oficial. Troque a base, e ele pode funcionar em outra cidade. Em outro estado. Em outro país.' },
  { n: 16, inicio: 165.534, fim: 169.074, quem: 'off', camera: false, locucao: 'Menos desigualdade. Cidades que funcionam para todo mundo.' },
  { n: 17, inicio: 169.074, fim: 173.774, quem: 'Thor e Gabriel', camera: true, locucao: 'Ninguém deveria ficar no ponto. Você pode ter direito. Agora, você sabe onde ir.' },
  { n: 18, inicio: 173.774, fim: 177.107, quem: 'off', camera: false, locucao: 'Mapiii. O mapa dos seus direitos.' },
  // Cenas 19 e 20: gravações da tela do app real (video/gravacoes/app/), logo depois das cenas 7 (triagem) e 13 (conferir se é oficial).
  // Ficam no fim da lista para não mudar o número das outras; a ordem no vídeo é a do tempo (inicio).
  // Narração gravada pela dupla em 12/11 (narracao/cena-19.mp3 e cena-20.mp3).
  { n: 19, inicio: 44.002, fim: 49.558, quem: 'off', camera: false, locucao: 'Olha o app de verdade: poucos toques, e ele mostra o que pode se aplicar, com fonte oficial.' },
  { n: 20, inicio: 117.606, fim: 121.986, quem: 'off', camera: false, locucao: 'Recebeu ou achou um link estranho? Ele avisa quando parecer suspeito.' },
  // Cena 21: o Leco como assistente (pergunta livre e resposta), depois da cena 10 e antes de "Ele também sabe dizer não".
  // Narração gravada pelo Thor em 12/11 (narracao/cena-21.mp3).
  { n: 21, inicio: 49.558, fim: 57.286, quem: 'off', camera: false, locucao: 'Ou pergunte do seu jeito, escrevendo ou falando. O Leco procura na base e responde com o resumo, o passo a passo e a fonte.' },
  // Cenas 22 a 24 (16/11, feedback do André): diferencial e Reclamação pronta (telas reais do app) e viabilidade (visão de futuro).
  { n: 22, inicio: 128.416, fim: 135.22, quem: 'off', camera: false, locucao: 'Por que não perguntar para qualquer IA? Porque ela pode inventar uma lei. O Mapiii só responde o que está na base, com a fonte oficial.' },
  { n: 23, inicio: 112.026, fim: 117.606, quem: 'off', camera: false, locucao: 'E se negarem o embarque, ele monta a reclamação pronta, só com os fatos, e mostra onde enviar.' },
  { n: 24, inicio: 158.87, fim: 165.534, quem: 'off', camera: false, locucao: 'É leve, sem cadastro e sem guardar dados pessoais. Uma prefeitura ou uma ONG pode adotar e manter.' },
  // Cenas 25 (comparação sem × com, depois da 6) e 26 (3 pilares, sem fala, depois da 16), ideias do vídeo de referência (18/11).
  // Cena 27 (18/11): a mini-história da consulta (Carla e Letícia), depois da 10. A cena 25 (comparação) saiu do vídeo.
  { n: 27, inicio: 70.766, fim: 103.686, quem: 'off', camera: false, locucao: 'Essa é a Carla, e essa é a Letícia. As duas usam cadeira de rodas, e as duas têm consulta marcada amanhã, às nove. A Letícia vai para o ponto cedo, sem saber quando passa um ônibus com rampa. Passa um… sem rampa. Passa outro… lotado. Às nove e vinte, ela ainda está no ponto. A consulta, que levou meses para marcar, ficou para depois. A Carla abre o Mapiii. Com o celular no bolso, ela espera em casa, até o aviso: o ônibus acessível está chegando. Ela sai na hora certa, a rampa desce, e às oito e cinquenta e cinco ela está na clínica. Mesma cidade. Mesmo ônibus. Dias diferentes.' }
];

// Silêncio do começo da voz pulado em cada cena (segundos), para as falas ficarem mais encostadas (16/11).
export const CORTE_INICIO_VOZ: Record<number, number> = {"4": 0.57, "8": 0.38, "11": 0.5, "16": 0.43};

// Ordem no vídeo (16/11): Descubra 7-19-21-8; Na rua 10-9-23; Confiança 20-11-22-12-13; Escala 14-15-24.
export const DURACAO_TOTAL = Math.round(Math.max(...CENAS.map((c) => c.fim)) * FPS);

export const cena = (n: number): Cena => { const c = CENAS.find((x) => x.n === n); if (!c) throw new Error(`Cena ${n} não está no roteiro`); return c; };
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
// Como naPalavra, mas devolve `padrao` quando a palavra ainda não está na locução (por exemplo, antes de gravar uma fala nova).
export function quandoFala(n: number, alvo: string, padrao: number): number {
  try { return naPalavra(n, alvo); } catch { return padrao; }
}

export function naPalavra(n: number, alvo: string, k = 0): number {
  const norm = (s: string) => s.toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '').replace(/[^a-z0-9]/g, '');
  const a = norm(alvo);
  const ps = temposDasPalavras(n).filter((p) => norm(p.texto) === a || norm(p.texto).startsWith(a));
  const p = ps[Math.min(k, ps.length - 1)];
  if (!p) throw new Error(`Palavra "${alvo}" não está na locução da cena ${n}`);
  return p.de;
}
