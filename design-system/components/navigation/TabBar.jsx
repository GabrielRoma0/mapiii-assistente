import React from 'react';
import { Icon } from '../icons/Icon.jsx';

export function TabBar({ items, value, onChange }) {
  return (
    <nav aria-label="Navegação principal" style={{ height: 80, display: 'grid', gridTemplateColumns: `repeat(${items.length}, 1fr)`, padding: '6px 12px 14px', background: 'var(--surface-card)', borderTop: '1px solid var(--border-subtle)' }}>
      {items.map(it => {
        const sel = it.id === value;
        return (
          <button key={it.id} type="button" aria-current={sel ? 'page' : undefined} onClick={() => onChange && onChange(it.id)}
            style={{ border: 'none', background: 'transparent', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 2, minHeight: 48, font: `${sel ? 800 : 700} 15px var(--font-sans)`, color: sel ? 'var(--text-body)' : 'var(--text-muted)', cursor: 'pointer' }}>
            <span style={{ width: 60, height: 32, borderRadius: 16, display: 'grid', placeItems: 'center', background: sel ? 'var(--surface-selected)' : 'transparent' }}><Icon name={it.icon} size={24} /></span>
            {it.label}
          </button>
        );
      })}
    </nav>
  );
}
