import React from 'react';
import { ICON_PATHS, ICON_OPACITY } from './icon-paths.js';

export function Icon({ name = 'ok', size = 24, color = 'currentColor', strokeWidth = 2, title, style }) {
  const paths = ICON_PATHS[name] || ICON_PATHS.ok;
  const op = ICON_OPACITY[name] || [];
  return (
    <svg viewBox="0 0 24 24" width={size} height={size} role={title ? 'img' : undefined} aria-label={title} aria-hidden={title ? undefined : true}
      style={{ display: 'block', flex: 'none', fill: 'none', stroke: color, strokeWidth, strokeLinecap: 'round', strokeLinejoin: 'round', ...style }}>
      {paths.map((d, i) => <path key={i} d={d} opacity={op[i] ?? 1} />)}
    </svg>
  );
}
