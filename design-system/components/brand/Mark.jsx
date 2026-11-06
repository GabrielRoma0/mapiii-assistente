import React from 'react';
const PIN = 'M24 45C24 45 9 31 9 19.5A15 15 0 0 1 39 19.5C39 31 24 45 24 45Z';
const DOTS = [[15, 16.5], [24, 16.5], [33, 16.5], [19.5, 25.5], [28.5, 25.5], [24, 34]];
const LEAVES = ['M24 2.8C25.5 -0.6 29.5 -1.6 32 0C30.4 3 27 4 24 2.8Z', 'M24 2.8C22.5 -0.6 18.5 -1.6 16 0C17.6 3 21 4 24 2.8Z'];

/** Símbolo: pinha em forma de pino de mapa, com os relevos do piso tátil de alerta. */
export function Mark({ size = 48, color = 'var(--mapi-grape-700)', cut = 'var(--mapi-white)', title }) {
  const r = size <= 34 ? 3.4 : 2.9;
  return (
    <svg viewBox="0 0 48 48" width={size} height={size} role={title ? 'img' : undefined} aria-label={title} aria-hidden={title ? undefined : true} style={{ display: 'block', flex: 'none', overflow: 'visible' }}>
      <path d="M24 4.5V2.5" style={{ fill: 'none', stroke: color, strokeWidth: 2.6, strokeLinecap: 'round' }} />
      {LEAVES.map((d, i) => <path key={i} d={d} style={{ fill: color, stroke: color, strokeWidth: 1.6, strokeLinejoin: 'round' }} />)}
      <path d={PIN} style={{ fill: color }} />
      {DOTS.map(([x, y], i) => <circle key={i} cx={x} cy={y} r={r} style={{ fill: cut }} />)}
    </svg>
  );
}
