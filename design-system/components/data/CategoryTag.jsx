import React from 'react';
import { CategoryMarker, CATEGORIES } from './CategoryMarker.jsx';

export function CategoryTag({ category, size = 'md', short }) {
  const c = CATEGORIES[category] || CATEGORIES.sem_problema;
  const sm = size === 'sm';
  return (
    <span style={{ display: 'inline-flex', alignItems: 'center', gap: sm ? 8 : 10, height: sm ? 36 : 48, padding: sm ? '0 14px 0 6px' : '0 18px 0 10px', borderRadius: 999, background: `var(--mapi-cat-${c.tone}-100)`, color: 'var(--mapi-indigo-900)', font: `800 ${sm ? 15 : 17}px var(--font-sans)`, alignSelf: 'flex-start', whiteSpace: 'nowrap' }}>
      <CategoryMarker category={category} size={sm ? 22 : 26} />
      {short ? c.short : c.label}
    </span>
  );
}
