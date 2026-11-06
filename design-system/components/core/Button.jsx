import React from 'react';
import { Icon } from '../icons/Icon.jsx';

const V = {
  primary: { background: 'var(--action-primary-bg)', color: 'var(--action-primary-fg)', border: 'none' },
  secondary: { background: 'var(--action-secondary-bg)', color: 'var(--action-secondary-fg)', border: '2px solid var(--border-strong)' },
  text: { background: 'transparent', color: 'var(--text-link)', border: 'none', textDecoration: 'underline', textUnderlineOffset: 4 },
  danger: { background: 'var(--action-danger-bg)', color: 'var(--action-danger-fg)', border: 'none' }
};
const S = { md: { height: 48, fontSize: 17, padding: '0 18px', radius: 16, icon: 20 }, lg: { height: 56, fontSize: 18, padding: '0 22px', radius: 20, icon: 22 }, xl: { height: 64, fontSize: 20, padding: '0 28px', radius: 22, icon: 26 } };

export function Button({ children, variant = 'primary', size = 'lg', icon, fullWidth, disabled, pill, onClick, type = 'button', style }) {
  const [focus, setFocus] = React.useState(false);
  const [hover, setHover] = React.useState(false);
  const s = S[size] || S.lg;
  const v = disabled ? { background: variant === 'text' ? 'transparent' : 'var(--action-disabled-bg)', color: 'var(--action-disabled-fg)', border: variant === 'text' ? 'none' : '2px dashed var(--mapi-lilac-500)' } : V[variant];
  const hoverBg = !disabled && hover && variant === 'primary' ? { background: 'var(--action-primary-bg-hover)' } : !disabled && hover && variant === 'secondary' ? { background: 'var(--surface-selected)' } : {};
  return (
    <button type={type} disabled={disabled} onClick={onClick} onFocus={e => setFocus(e.target.matches(':focus-visible'))} onBlur={() => setFocus(false)} onMouseEnter={() => setHover(true)} onMouseLeave={() => setHover(false)}
      style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: 10, minHeight: s.height, padding: s.padding, borderRadius: pill ? 999 : s.radius, font: `${variant === 'primary' ? 900 : 800} ${s.fontSize}px var(--font-sans)`, cursor: disabled ? 'not-allowed' : 'pointer', width: fullWidth ? '100%' : undefined, outline: 'none', boxShadow: focus ? 'var(--focus-ring)' : 'none', transition: 'background var(--duration-fast) var(--ease-standard)', ...v, ...hoverBg, ...style }}>
      {icon && <Icon name={icon} size={s.icon} color="currentColor" />}
      {children}
    </button>
  );
}
