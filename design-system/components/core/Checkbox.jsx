import React from 'react';
import { Icon } from '../icons/Icon.jsx';

export function Checkbox({ label, checked, onChange }) {
  const [focus, setFocus] = React.useState(false);
  return (
    <button type="button" role="checkbox" aria-checked={!!checked} onClick={() => onChange && onChange(!checked)} onFocus={e => setFocus(e.target.matches(':focus-visible'))} onBlur={() => setFocus(false)}
      style={{ minHeight: 48, width: '100%', borderRadius: 16, padding: '8px 14px 8px 10px', display: 'flex', alignItems: 'center', gap: 12, textAlign: 'left', font: '700 16px/1.3 var(--font-sans)', color: 'var(--text-body)', cursor: 'pointer', border: checked ? '3px solid var(--border-strong)' : '2px solid var(--border-default)', background: checked ? 'var(--surface-selected)' : 'var(--surface-card)', outline: 'none', boxShadow: focus ? 'var(--focus-ring)' : 'none' }}>
      <span style={{ width: 26, height: 26, flex: 'none', borderRadius: 8, display: 'grid', placeItems: 'center', border: '2px solid var(--border-strong)', background: checked ? 'var(--action-primary-bg)' : 'var(--surface-card)' }}>
        {checked && <Icon name="check" size={18} color="var(--action-primary-fg)" />}
      </span>
      {label}
    </button>
  );
}
