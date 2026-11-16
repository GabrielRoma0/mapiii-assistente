// Blocos da legenda, calculados das palavras da locução. Usado pela legenda queimada e pelo .srt.
import { CENAS, inicioEmQuadros, temposDasPalavras } from './roteiro';

// Blocos de até ~7 palavras, quebrando na pontuação. Mesmo texto do .srt (scripts/srt.mjs).
export interface BlocoLegenda { de: number; ate: number; texto: string } // quadros absolutos

export function blocosDeLegenda(): BlocoLegenda[] {
  const blocos: BlocoLegenda[] = [];
  for (const c of CENAS) {
    const ps = temposDasPalavras(c.n);
    const base = inicioEmQuadros(c);
    let atual: typeof ps = [];
    const fechar = () => {
      if (!atual.length) return;
      blocos.push({ de: base + atual[0].de - 3, ate: base + atual[atual.length - 1].ate + 6, texto: atual.map((p) => p.texto).join(' ') });
      atual = [];
    };
    ps.forEach((p, i) => {
      atual.push(p);
      const fimFrase = /[.?!:]$/.test(p.texto);
      const virgula = /,$/.test(p.texto) && atual.length >= 4;
      if (fimFrase || virgula || atual.length >= 7 || i === ps.length - 1) fechar();
    });
  }
  blocos.sort((a, b) => a.de - b.de); // as cenas 19 e 20 estão no fim da lista, mas no meio do vídeo
  // Sem sobreposição: cada bloco termina antes do próximo.
  for (let i = 0; i < blocos.length - 1; i++) blocos[i].ate = Math.min(blocos[i].ate, blocos[i + 1].de - 1);
  return blocos;
}

