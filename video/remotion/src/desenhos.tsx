// Desenhos vetoriais dos quadros (design-system/Mapiii Pitch Quadros 16x9.html), separados para animar.
import React from 'react';
import { COR } from './base';

// Pessoa em cadeira de rodas (viewBox 420 × 340). `bolso`: versão da cena 10, com o celular no bolso.
export const Pessoa: React.FC<{ largura: number; bolso?: boolean; ondas?: number }> = ({ largura, bolso, ondas = 0 }) => (
  <svg viewBox="0 0 420 340" width={largura} height={(largura * 340) / 420} aria-hidden style={{ overflow: 'visible', display: 'block' }}>
    <path d="M112 182L98 92L72 92" fill="none" stroke={COR.indigo} strokeWidth="12" strokeLinecap="round" strokeLinejoin="round" />
    <circle cx="140" cy="250" r="76" fill="none" stroke={COR.indigo} strokeWidth="14" />
    <circle cx="140" cy="250" r="11" fill={COR.indigo} />
    <path d="M140 250L140 180M140 250L200 285M140 250L80 285" stroke={COR.indigo} strokeWidth="5" opacity="0.5" strokeLinecap="round" />
    <path d="M110 180H250L268 294" fill="none" stroke={COR.indigo} strokeWidth="12" strokeLinecap="round" strokeLinejoin="round" />
    <circle cx="268" cy="312" r="16" fill="none" stroke={COR.indigo} strokeWidth="10" />
    <path d="M252 300H294" stroke={COR.indigo} strokeWidth="10" strokeLinecap="round" />
    <circle cx="150" cy="46" r="30" fill={COR.grape} />
    <path d="M142 94L128 168" stroke={COR.grape} strokeWidth="56" strokeLinecap="round" />
    <path d="M132 172H236" stroke={COR.grape} strokeWidth="44" strokeLinecap="round" />
    <path d="M236 176L250 284" stroke={COR.grape} strokeWidth="36" strokeLinecap="round" />
    <path d="M250 293H290" stroke={COR.grape} strokeWidth="22" strokeLinecap="round" />
    {bolso ? (
      <>
        <path d="M128 104Q150 160 150 210" fill="none" stroke="#3E4260" strokeWidth="24" strokeLinecap="round" />
        <rect x="150" y="98" width="20" height="32" rx="4" fill={COR.indigo} />
        <rect x="154" y="102" width="12" height="6" rx="2" fill={COR.lilac100} />
        <path d="M144 116H176V148Q160 154 144 148Z" fill="#6E6A7E" stroke={COR.indigo} strokeWidth="4" strokeLinejoin="round" />
        {[
          'M196 104q12 14 0 28',
          'M218 92q24 26 0 52',
          'M240 80q36 38 0 76'
        ].map((d, i) => (
          <path key={d} d={d} fill="none" stroke={COR.rosa} strokeWidth="8" strokeLinecap="round" opacity={Math.max(0, Math.min(1, ondas * 3 - i))} />
        ))}
      </>
    ) : (
      <path d="M146 104Q176 150 172 204" fill="none" stroke="#3E4260" strokeWidth="24" strokeLinecap="round" />
    )}
  </svg>
);

// Ônibus de lado (coordenadas do quadro 1: x 760 a 2020, y 440 a 978). `rampa`: 0 recolhida, 1 descida até a calçada.
export const Onibus: React.FC<{ porta: number; rampa: number }> = ({ porta, rampa }) => {
  // Porta: duas folhas que abrem para os lados (0 fechada, 1 aberta).
  const folha = 90 * (1 - porta);
  const ang = -4.6 * rampa; // a rampa gira da borda da porta até tocar a calçada
  const comp = 164 + (352 - 164) * rampa;
  return (
    <g>
      <rect x="760" y="440" width="1260" height="470" rx="56" fill={COR.grape} />
      <rect x="790" y="470" width="300" height="20" rx="10" fill={COR.almond} />
      <rect x="786" y="520" width="120" height="250" rx="22" fill={COR.lilac100} />
      <rect x="1190" y="520" width="210" height="170" rx="20" fill={COR.lilac100} />
      <rect x="1430" y="520" width="210" height="170" rx="20" fill={COR.lilac100} />
      <rect x="1670" y="520" width="210" height="170" rx="20" fill={COR.lilac100} />
      <rect x="1910" y="520" width="40" height="170" rx="20" fill={COR.lilac100} />
      <rect x="1190" y="760" width="730" height="14" rx="7" fill="#3E4260" />
      <rect x="950" y="512" width="180" height="398" rx="10" fill={COR.indigo} />
      <rect x="976" y="860" width="128" height="14" rx="7" fill={COR.grape} />
      {/* folhas da porta */}
      <rect x={950} y="512" width={folha} height="398" fill="#5A5E7A" />
      <rect x={1130 - folha} y="512" width={folha} height="398" fill="#5A5E7A" />
      <rect x="928" y="512" width="22" height="380" rx="8" fill={COR.lilac} />
      <rect x="1130" y="512" width="22" height="380" rx="8" fill={COR.lilac} />
      {/* rampa: presa na borda esquerda da porta */}
      <g transform={`rotate(${ang.toFixed(2)} 958 917)`}>
        <rect x={958 - (comp - 164)} y="906" width={comp} height="22" rx="6" fill={COR.almond} stroke={COR.indigo} strokeWidth="5" />
      </g>
      <circle cx="845" cy="910" r="68" fill={COR.indigo} />
      <circle cx="845" cy="910" r="26" fill={COR.lilac} />
      <circle cx="1640" cy="910" r="68" fill={COR.indigo} />
      <circle cx="1640" cy="910" r="26" fill={COR.lilac} />
    </g>
  );
};

// Ponto de ônibus com o ícone de local (coordenadas do quadro 1).
export const Ponto: React.FC = () => (
  <g>
    <rect x="294" y="560" width="14" height="380" rx="7" fill={COR.indigo} />
    <rect x="246" y="470" width="110" height="110" rx="24" fill={COR.indigo} />
    <g transform="translate(265 489) scale(3)" fill="none" stroke={COR.seashell} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 21s-7-6.4-7-12a7 7 0 0 1 14 0c0 5.6-7 12-7 12z" />
      <path d="M12 6.5a2.5 2.5 0 1 0 0 5a2.5 2.5 0 1 0 0-5" />
    </g>
  </g>
);

export const Chao: React.FC<{ y?: number }> = ({ y = 940 }) => (
  <g>
    <rect x="0" y={y} width="1920" height={1080 - y + 200} fill={COR.chao} />
    <rect x="0" y={y - 4} width="1920" height="8" fill={COR.borda} />
  </g>
);
