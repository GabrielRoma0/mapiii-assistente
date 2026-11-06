import React from 'react';
import { CategoryMarker } from '../data/CategoryMarker.jsx';

export function FilterChip({ label, category, selected, onClick }) {
  return (
    <button type="button" aria-pressed={!!selected} onClick={onClick}
      style={{ height: 48, flex: 'none', padding: category ? '0 16px 0 8px' : '0 18px', borderRadius: 999, display: 'inline-flex', alignItems: 'center', gap: 8, font: '800 16px var(--font-sans)', cursor: 'pointer', border: selected ? 'none' : '2px solid transparent', background: selected ? 'var(--surface-inverse)' : 'var(--surface-card)', color: selected ? 'var(--text-inverse)' : 'var(--text-body)' }}>
      {category && <CategoryMarker category={category} size={24} />}
      {label}
    </button>
  );
}
