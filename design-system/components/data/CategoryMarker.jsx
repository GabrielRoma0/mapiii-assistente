import React from 'react';
import { ICON_PATHS } from '../icons/icon-paths.js';

export const CATEGORIES = {
  sem_rampa_ou_degrau: { label: 'Sem rampa ou degrau', short: 'Sem rampa', icon: 'degrau', shapeName: 'quadrado', tone: 'rampa', shape: 'M7 7H33V33H7Z', iy: 10 },
  obstaculo_no_caminho: { label: 'Obstáculo no caminho', short: 'Obstáculo', icon: 'obstaculo', shapeName: 'triângulo', tone: 'obstaculo', shape: 'M20 5L36 33H4Z', iy: 13.5 },
  calcada_quebrada: { label: 'Calçada quebrada', short: 'Quebrada', icon: 'quebrada', shapeName: 'losango', tone: 'quebrada', shape: 'M20 2.5L37.5 20L20 37.5L2.5 20Z', iy: 10 },
  calcada_estreita: { label: 'Calçada estreita', short: 'Estreita', icon: 'estreita', shapeName: 'hexágono', tone: 'estreita', shape: 'M20 3.5L34.5 11.75V28.25L20 36.5L5.5 28.25V11.75Z', iy: 10 },
  sem_problema: { label: 'Sem problema', short: 'Sem problema', icon: 'check', shapeName: 'círculo', tone: 'ok', shape: 'M20 4a16 16 0 1 0 0 32a16 16 0 1 0 0-32Z', iy: 10 }
};

/** Marcador de categoria: forma própria + ícone + contorno indigo. Legível sem cor. */
export function CategoryMarker({ category = 'sem_problema', size = 40, title }) {
  const c = CATEGORIES[category] || CATEGORIES.sem_problema;
  const fill = `var(--mapi-cat-${c.tone}-500)`;
  return (
    <svg viewBox="0 0 40 40" width={size} height={size} role={title ? 'img' : undefined} aria-label={title} aria-hidden={title ? undefined : true} style={{ display: 'block', flex: 'none', overflow: 'visible' }}>
      <path d={c.shape} style={{ fill: 'var(--marker-ink)', stroke: 'var(--marker-ink)', strokeWidth: 6, strokeLinejoin: 'round' }} />
      <path d={c.shape} style={{ fill, stroke: fill, strokeWidth: 2, strokeLinejoin: 'round' }} />
      <svg x="10" y={c.iy} width="20" height="20" viewBox="0 0 24 24" style={{ fill: 'none', stroke: 'var(--marker-ink)', strokeWidth: 2.4, strokeLinecap: 'round', strokeLinejoin: 'round' }}>
        {ICON_PATHS[c.icon].map((d, i) => <path key={i} d={d} />)}
      </svg>
    </svg>
  );
}
