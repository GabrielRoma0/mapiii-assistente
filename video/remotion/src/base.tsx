// Peças comuns do vídeo: cores, fontes, movimento, Mapi 3D, ícones, títulos e efeitos.
import React from 'react';
import { AbsoluteFill, Easing, Img, interpolate, staticFile, useCurrentFrame } from 'remotion';
import { ICONES } from './gerado-icones';

export const COR = {
  indigo: '#22223B',
  grape: '#4A4E69',
  lilac: '#9A8C98',
  almond: '#C9ADA7',
  seashell: '#F2E9E4',
  rosa: '#CF7A93',
  lilac100: '#E6DCE0',
  borda: '#DCCFC8',
  chao: '#E3D6CF',
  branco: '#FFFFFF',
  verde700: '#36704A',
  verde800: '#2F5A3C',
  coral700: '#A0402F'
};

export const FONTES_CSS = `
@font-face{font-family:"Nunito";font-weight:200 1000;font-style:normal;font-display:block;src:url(${staticFile('fontes/nunito-latin-wght-normal.woff2')}) format("woff2")}
@font-face{font-family:"IBM Plex Mono";font-weight:400;font-style:normal;font-display:block;src:url(${staticFile('fontes/ibm-plex-mono-latin-400-normal.woff2')}) format("woff2")}
@font-face{font-family:"IBM Plex Mono";font-weight:600;font-style:normal;font-display:block;src:url(${staticFile('fontes/ibm-plex-mono-latin-600-normal.woff2')}) format("woff2")}
`;
export const SANS = '"Nunito", system-ui, sans-serif';
export const MONO = '"IBM Plex Mono", ui-monospace, monospace';

// Arredonda a 2 casas (regra do README: transforms com 2 casas).
export const r2 = (v: number) => Math.round(v * 100) / 100;

const sai = Easing.bezier(0.16, 1, 0.3, 1); // entra desacelerando: quase todo o caminho nos primeiros quadros
const entraSaindo = Easing.bezier(0.7, 0, 0.84, 0); // sai acelerando

// 0 → 1 entre `de` e `de + dur`, desacelerando.
export function chegada(frame: number, de: number, dur = 10) {
  return interpolate(frame, [de, de + dur], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: sai });
}
// 0 → 1 entre `de` e `de + dur`, acelerando (para sair).
export function partida(frame: number, de: number, dur = 8) {
  return interpolate(frame, [de, de + dur], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: entraSaindo });
}
export const mix = (a: number, b: number, t: number) => a + (b - a) * t;

// Balanço curto depois de um impacto (4 a 8 px, 6 a 10 quadros), na direção do impacto.
export function impacto(frame: number, em: number, dx: number, dy: number) {
  const t = frame - em;
  if (t < 0 || t > 10) return { x: 0, y: 0 };
  const k = Math.sin((t / 10) * Math.PI * 2) * (1 - t / 10);
  return { x: r2(dx * k), y: r2(dy * k) };
}

// Entrada da cena: vem da direita com borrão horizontal curto (5 quadros ≈ 170 ms).
export const EntradaDeCena: React.FC<{ children: React.ReactNode; semEntrada?: boolean }> = ({ children, semEntrada }) => {
  const f = useCurrentFrame();
  const t = semEntrada ? 1 : chegada(f, 0, 5);
  return (
    <AbsoluteFill style={{ transform: `translateX(${r2(mix(90, 0, t))}px)`, filter: t < 1 ? `blur(${r2(mix(14, 0, t))}px)` : undefined }}>
      {children}
    </AbsoluteFill>
  );
};

// Fundo de cena animada. Tem uma aproximação lenta e contínua da câmera (cerca de 3,6% em 10 s),
// para nenhum trecho ficar morto (regra de tempo da seção 3: no máximo 3 quadros parados).
export const Fundo: React.FC<{ children?: React.ReactNode; style?: React.CSSProperties }> = ({ children, style }) => {
  const f = useCurrentFrame();
  const z = 1 + f * 0.00012;
  return (
    <AbsoluteFill style={{ background: COR.seashell, color: COR.indigo, fontFamily: SANS, overflow: 'hidden', ...style }}>
      <AbsoluteFill style={{ transform: `scale(${z.toFixed(5)})`, transformOrigin: '50% 45%' }}>{children}</AbsoluteFill>
    </AbsoluteFill>
  );
};

// Sublinhado rosa que se desenha da esquerda para a direita a partir de `de`.
export const Destaque: React.FC<{ children: React.ReactNode; de: number; cor?: string; escuro?: boolean }> = ({ children, de, cor = COR.rosa, escuro }) => {
  const f = useCurrentFrame();
  const t = chegada(f, de, 12);
  return (
    <span style={{ position: 'relative', display: 'inline-block', color: escuro ? COR.seashell : undefined }}>
      {children}
      <span style={{ position: 'absolute', left: 0, bottom: '-0.04em', height: '0.12em', width: `${r2(t * 100)}%`, background: cor, borderRadius: 4 }} />
    </span>
  );
};

// Palavras que entram uma a uma, subindo, no ritmo da fala (cada uma no seu quadro).
export const Palavras: React.FC<{ itens: { texto: React.ReactNode; em: number }[]; estilo?: React.CSSProperties }> = ({ itens, estilo }) => {
  const f = useCurrentFrame();
  return (
    <span style={estilo}>
      {itens.map((it, i) => {
        const t = chegada(f, it.em, 10);
        return (
          <span key={i} style={{ display: 'inline-block', opacity: t > 0 ? 1 : 0, transform: `translateY(${r2(mix(60, 0, t))}px)`, marginRight: '0.24em' }}>
            {it.texto}
          </span>
        );
      })}
    </span>
  );
};

// Ícone do design system (traço), na cor e no tamanho pedidos.
export const Icone: React.FC<{ nome: string; tamanho: number; cor: string; traco?: number }> = ({ nome, tamanho, cor, traco = 2 }) => {
  const corpo = ICONES[nome];
  if (!corpo) throw new Error(`Ícone ${nome} não existe em design-system/assets/icons`);
  return (
    <svg viewBox="0 0 24 24" width={tamanho} height={tamanho} fill="none" stroke={cor} strokeWidth={traco} strokeLinecap="round" strokeLinejoin="round" aria-hidden
      dangerouslySetInnerHTML={{ __html: corpo }} />
  );
};

export type PoseMapi = 'bom' | 'atencao' | 'procurando' | 'verificado' | 'ouvindo' | 'recusa' | 'comemorando';

// Mapi 3D: entra subindo suave a partir de `em`, com sombra em elipse sólida; depois flutua de leve. Nunca deforma.
export const Mapi: React.FC<{ pose: PoseMapi; x: number; y: number; tamanho: number; em: number; balanco?: number; sombra?: boolean }> = ({ pose, x, y, tamanho, em, balanco, sombra = true }) => {
  const f = useCurrentFrame();
  const t = chegada(f, em, 14);
  const vivo = Math.max(0, f - em);
  const flutua = Math.sin((vivo / 30) * Math.PI * 2 * 0.35) * 7 * t; // ciclo lento (~2,9 s), 7 px
  const sobe = mix(160, 0, t);
  let gira = 0;
  if (balanco !== undefined) {
    const b = f - balanco;
    if (b >= 0 && b <= 18) gira = Math.sin((b / 18) * Math.PI * 2) * 6 * (1 - b / 18);
  }
  return (
    <div style={{ position: 'absolute', left: x, top: y, width: tamanho, height: tamanho, opacity: f >= em ? 1 : 0 }}>
      {sombra && (
        <div style={{
          position: 'absolute', left: '28%', width: '44%', top: '90%', height: '6%', borderRadius: '50%', background: COR.almond,
          transform: `scale(${r2(mix(0.6, 1, t) * (1 - flutua / 140))})`
        }} />
      )}
      <Img src={staticFile(`mapi/${pose}.png`)} style={{
        position: 'absolute', inset: 0, width: '100%', height: '100%',
        transform: `translateY(${r2(sobe + flutua)}px) rotate(${r2(gira)}deg)`, transformOrigin: '50% 90%'
      }} />
    </div>
  );
};

export const Logo: React.FC<{ largura: number; style?: React.CSSProperties }> = ({ largura, style }) => (
  <Img src={staticFile('logo/logo-horizontal.svg')} style={{ width: largura, display: 'block', ...style }} />
);

export const Cartao: React.FC<{ children: React.ReactNode; style?: React.CSSProperties }> = ({ children, style }) => (
  <div style={{ position: 'absolute', display: 'flex', flexDirection: 'column', background: COR.branco, borderRadius: 48, ...style }}>{children}</div>
);

export const Selo: React.FC<{ texto: string; tamanho?: number }> = ({ texto, tamanho = 32 }) => (
  <span style={{ display: 'inline-flex', alignItems: 'center', gap: 12, padding: '14px 26px 14px 18px', borderRadius: 999, background: COR.branco, border: `3px solid ${COR.verde700}`, color: COR.verde800, fontSize: tamanho, fontWeight: 800 }}>
    <Icone nome="escudo_check" tamanho={tamanho * 0.95} cor={COR.verde800} />{texto}
  </span>
);

// Aviso fixo de protótipo (fecho).
export const AvisoPrototipo: React.FC<{ style?: React.CSSProperties }> = ({ style }) => (
  <div style={{ position: 'absolute', fontSize: 32, fontWeight: 700, color: COR.grape, ...style }}>Protótipo de estudo, não é canal oficial. · FIAP Global Solution 2026</div>
);
