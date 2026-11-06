import React from 'react';
import { Icon } from '../icons/Icon.jsx';

export function IconButton({ icon, label, size = 48, variant = 'surface', onClick }) {
  const [focus, setFocus] = React.useState(false);
  const v = variant === 'outline' ? { background: 'var(--surface-card)', border: '2px solid var(--border-strong)' } : variant === 'tint' ? { background: 'var(--surface-selected)', border: 'none' } : { background: 'var(--surface-card)', border: 'none' };
  return (
    <button type="button" aria-label={label} title={label} onClick={onClick} onFocus={e => setFocus(e.target.matches(':focus-visible'))} onBlur={() => setFocus(false)}
      style={{ width: Math.max(size, 48), height: Math.max(size, 48), borderRadius: variant === 'tint' ? 999 : 16, display: 'grid', placeItems: 'center', cursor: 'pointer', color: 'var(--text-body)', outline: 'none', boxShadow: focus ? 'var(--focus-ring)' : 'none', ...v }}>
      <Icon name={icon} size={24} />
    </button>
  );
}
