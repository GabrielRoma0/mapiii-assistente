// O que fica por cima das cenas: legenda, relógio, câmera reservada e a linha de rota.
import React from 'react';
import { AbsoluteFill, Img, interpolate, OffthreadVideo, staticFile, useCurrentFrame } from 'remotion';
import { chegada, COR, mix, partida, r2, SANS } from './base';
import { arquivoExiste } from './arquivos';
import { blocosDeLegenda } from './legendas';
import { cena, inicioEmQuadros, quadrosDa } from './roteiro';

// ---------- Legenda ----------
// Lugar do balão de fala do Leco no fecho (o Leco fica à direita dele; ver Cena18).
export const BALAO_18 = { direita: 500, topo: 372 };
export const Legenda: React.FC = () => {
  const f = useCurrentFrame();
  const b = blocosDeLegenda().find((x) => f >= x.de && f <= x.ate);
  if (!b) return null;
  // No fecho (cena 18) quem fala é o Leco: a legenda vira o balão de fala dele, com a ponta virada para ele.
  if (f >= inicioEmQuadros(cena(18))) {
    const t = chegada(f, b.de, 8);
    return (
      <div style={{ position: 'absolute', right: BALAO_18.direita, top: BALAO_18.topo, transform: `translateX(${r2(mix(40, 0, t))}px)`, pointerEvents: 'none' }}>
        <div style={{ position: 'absolute', right: -14, top: '50%', width: 34, height: 34, marginTop: -17, background: COR.indigo, borderRadius: 6, transform: 'rotate(45deg)' }} />
        <div style={{ position: 'relative', padding: '14px 34px', borderRadius: 20, background: COR.indigo, color: COR.seashell, fontFamily: SANS, fontWeight: 800, fontSize: 44, lineHeight: 1.25, whiteSpace: 'nowrap' }}>
          {b.texto}
        </div>
      </div>
    );
  }
  return (
    <AbsoluteFill style={{ justifyContent: 'flex-end', alignItems: 'center', paddingBottom: 64, pointerEvents: 'none' }}>
      <div style={{ maxWidth: 1240, padding: '14px 34px', borderRadius: 20, background: COR.indigo, color: COR.seashell, fontFamily: SANS, fontWeight: 800, fontSize: 44, lineHeight: 1.25, textAlign: 'center' }}>
        {b.texto}
      </div>
    </AbsoluteFill>
  );
};

// ---------- Relógio (cenas 1 a 3; sai na cena 4) ----------
export const Relogio: React.FC = () => {
  const f = useCurrentFrame();
  const entra = Math.round(0.55 * 30); // "Sete e quarenta"
  const sai = inicioEmQuadros(cena(4)) + 4;
  if (f < entra || f > sai + 10) return null;
  const minuto = f < inicioEmQuadros(cena(2)) + 20 ? '0740' : f < inicioEmQuadros(cena(3)) ? '0741' : '0742';
  const t = chegada(f, entra, 10) * (1 - partida(f, sai, 8));
  return (
    <Img src={staticFile(`relogio/${minuto}.png`)} style={{ position: 'absolute', right: 64, top: 56, width: 212, height: 72, transform: `translateY(${r2(mix(-140, 0, t))}px)` }} />
  );
};

// ---------- Câmera (cenas 2, 3, 5, 14 e 17) ----------
// Se existir public/camera-gravada/cena-NN.mp4, entra o vídeo (sem som: a voz vem de narracao/cena-NN.mp3);
// senão, um espaço reservado com a moldura.
// Zoom: trechos { em, de, ate }. Em `em` a imagem se aproxima rápido (6 quadros) até `de` e segue devagar até `ate`
// (no máximo 1,5×, seção 3). `foco` é o ponto que fica parado (o rosto), em % da imagem.
export interface TrechoDeZoom { em: number; de: number; ate: number }
function zoomEm(f: number, trechos: TrechoDeZoom[], fim: number) {
  let i = 0;
  while (i < trechos.length - 1 && f >= trechos[i + 1].em) i++;
  const t = trechos[i];
  const ate = i < trechos.length - 1 ? trechos[i + 1].em : fim;
  const lento = mix(t.de, t.ate, interpolate(f, [t.em, ate], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }));
  return i > 0 ? mix(trechos[i - 1].ate, lento, chegada(f, t.em, 6)) : lento;
}

export const Camera: React.FC<{ n: number; nomes: ('thor' | 'gabriel')[]; zoom?: TrechoDeZoom[]; foco?: string }> = ({ n, nomes, zoom, foco = '50% 40%' }) => {
  const f = useCurrentFrame();
  const escala = zoom ? zoomEm(f, zoom, quadrosDa(cena(n))) : 1;
  const c = cena(n);
  const gravado = `camera-gravada/cena-${String(n).padStart(2, '0')}.mp4`;
  const arquivo = arquivoExiste(gravado) ? gravado : undefined;
  return (
    <AbsoluteFill style={{ background: COR.seashell, fontFamily: SANS }}>
      <div style={{ position: 'absolute', left: 52, top: 52, width: 1816, height: 976, borderRadius: 58, overflow: 'hidden', background: COR.grape }}>
        {arquivo ? (
          <div style={{ position: 'absolute', inset: 0, transform: `scale(${escala.toFixed(4)})`, transformOrigin: foco }}>
            <OffthreadVideo src={staticFile(arquivo)} muted style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
          </div>
        ) : (
          <AbsoluteFill style={{ alignItems: 'center', justifyContent: 'center', color: COR.seashell, gap: 18 }}>
            <div style={{ fontSize: 40, fontWeight: 900, letterSpacing: '0.04em' }}>CÂMERA · CENA {n}</div>
            <div style={{ fontSize: 34, fontWeight: 700, opacity: 0.85 }}>{c.quem} fala para a câmera (espaço reservado)</div>
          </AbsoluteFill>
        )}
      </div>
      <div style={{ position: 'absolute', left: 104, top: 96, display: 'flex', gap: 14 }}>
        {nomes.map((nome, i) => {
          const t = chegada(f, 12 + i * 5, 10);
          return <Img key={nome} src={staticFile(`camera/${nome}.png`)} style={{ height: 96, transform: `translateX(${r2(mix(-260, 0, t))}px)` }} />;
        })}
      </div>
    </AbsoluteFill>
  );
};

// ---------- Linha de rota ----------
// Tracejado Dusty Grape (traço 6 px, 18/14) que se desenha de uma cena para a outra, das cenas 6 a 15.
// Cada trecho fica nas margens, longe do texto e do Leco.
export const TRECHOS: Record<number, string> = {
  6: 'M 300 300 C 300 520, 120 640, 90 1080',
  7: 'M 1880 0 C 1840 260, 1880 520, 1860 1080',
  8: 'M 0 1000 C 420 1040, 820 990, 1240 1040',
  9: 'M 1880 1080 C 1890 760, 1870 360, 1900 0',
  10: 'M 0 1050 C 300 1010, 520 1060, 860 1030',
  12: 'M 0 980 C 500 1030, 1300 960, 1920 1010',
  13: 'M 60 1080 C 60 980, 40 900, 70 0',
  15: 'M -20 1000 C 300 1040, 700 980, 975 852'
};

export const LinhaDeRota: React.FC<{ n: number; chega?: number }> = ({ n, chega }) => {
  const f = useCurrentFrame();
  const d = TRECHOS[n];
  if (!d) return null;
  const dur = chega ?? Math.min(quadrosDa(cena(n)) - 10, 90);
  const t = interpolate(f, [4, dur], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
  const tamanho = 2600;
  return (
    <svg width={1920} height={1080} viewBox="0 0 1920 1080" style={{ position: 'absolute', inset: 0, pointerEvents: 'none' }}>
      <defs>
        <mask id={`rota-${n}`}>
          <path d={d} fill="none" stroke="#fff" strokeWidth={14} strokeDasharray={`${tamanho} ${tamanho}`} strokeDashoffset={r2(tamanho * (1 - t))} />
        </mask>
      </defs>
      <path d={d} fill="none" stroke={COR.grape} strokeWidth={6} strokeDasharray="18 14" strokeLinecap="round" mask={`url(#rota-${n})`} opacity={0.75} />
    </svg>
  );
};
