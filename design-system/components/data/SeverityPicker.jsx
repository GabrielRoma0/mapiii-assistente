import React from 'react';
import { Icon } from '../icons/Icon.jsx';

export const SEVERITY = [{ n: 0, label: 'Sem risco' }, { n: 1, label: 'Atrapalha' }, { n: 2, label: 'Dificulta' }, { n: 3, label: 'Impede' }];

export function SeverityPicker({ value, onChange, compact, label = 'Gravidade' }) {
  return (
    <div role="radiogroup" aria-label={label} style={{ display: 'grid', gridTemplateColumns: 'repeat(4, minmax(0, 1fr))', gap: compact ? 8 : 10 }}>
      {SEVERITY.map(s => {
        const sel = value === s.n;
        return (
          <button key={s.n} type="button" role="radio" aria-checked={sel} onClick={() => onChange && onChange(s.n)}
            style={{ minHeight: compact ? 64 : 104, borderRadius: compact ? 16 : 20, padding: '10px 6px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: compact ? 2 : 6, fontFamily: 'var(--font-sans)', color: 'var(--text-body)', cursor: 'pointer', border: sel ? '3px solid var(--border-strong)' : '2px solid var(--border-default)', background: sel ? 'var(--surface-selected)' : 'var(--surface-card)' }}>
            {!compact && <Icon name={'g' + s.n} size={28} />}
            <span style={{ fontSize: compact ? 20 : 22, fontWeight: 900, lineHeight: 1 }}>{s.n}</span>
            <span style={{ fontSize: compact ? 14 : 15, fontWeight: 700, lineHeight: 1.2, textAlign: 'center' }}>{s.label}</span>
          </button>
        );
      })}
    </div>
  );
}
