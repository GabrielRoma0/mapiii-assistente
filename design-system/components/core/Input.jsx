import React from 'react';
export function Input({ label, optional, hint, error, placeholder, value, onChange, multiline, rows = 3, id }) {
  const [focus, setFocus] = React.useState(false);
  const fid = id || React.useId();
  const Tag = multiline ? 'textarea' : 'input';
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
      {label && <label htmlFor={fid} style={{ fontSize: 16, fontWeight: 800, color: 'var(--text-body)' }}>{label} {optional && <span style={{ fontWeight: 600, color: 'var(--text-muted)' }}>(opcional)</span>}</label>}
      <Tag id={fid} placeholder={placeholder} value={value} onChange={onChange} rows={multiline ? rows : undefined} aria-invalid={!!error} aria-describedby={hint || error ? fid + '-d' : undefined}
        onFocus={() => setFocus(true)} onBlur={() => setFocus(false)}
        style={{ minHeight: 56, borderRadius: 18, border: `2px solid ${error ? 'var(--mapi-coral-700)' : focus ? 'var(--border-strong)' : 'var(--border-input)'}`, background: 'var(--surface-card)', padding: multiline ? '12px 14px' : '0 16px', font: '600 17px/1.5 var(--font-sans)', color: 'var(--text-body)', outline: 'none', resize: 'vertical', boxShadow: focus ? 'var(--focus-ring)' : 'none' }} />
      {(hint || error) && <span id={fid + '-d'} style={{ fontSize: 16, lineHeight: 1.5, color: error ? 'var(--status-error-fg)' : 'var(--text-muted)', fontWeight: error ? 700 : 400 }}>{error ? '✕ ' + error : hint}</span>}
    </div>
  );
}
