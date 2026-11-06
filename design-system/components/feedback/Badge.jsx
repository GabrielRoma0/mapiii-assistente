import React from 'react';
import { Icon } from '../icons/Icon.jsx';

const T = {
  review: { bg: 'var(--status-review-bg)', fg: 'var(--status-review-fg)', border: '2px solid var(--status-review-border)', icon: 'revisar', text: 'IA tem dúvida – revisar' },
  success: { bg: 'var(--status-success-bg)', fg: 'var(--status-success-fg)', border: 'none', icon: 'check' },
  error: { bg: 'var(--status-error-bg)', fg: 'var(--status-error-fg)', border: 'none', icon: 'fechar' },
  neutral: { bg: 'var(--surface-selected)', fg: 'var(--text-body)', border: 'none', icon: 'ia' }
};

export function Badge({ tone = 'review', children, size = 'md' }) {
  const t = T[tone] || T.review;
  const sm = size === 'sm';
  return (
    <span style={{ display: 'inline-flex', alignItems: 'center', gap: sm ? 6 : 8, height: sm ? 36 : 44, padding: sm ? '0 12px 0 8px' : '0 16px 0 12px', borderRadius: sm ? 12 : 14, background: t.bg, color: t.fg, border: t.border, font: `800 ${sm ? 15 : 17}px var(--font-sans)`, alignSelf: 'flex-start', whiteSpace: 'nowrap' }}>
      <Icon name={t.icon} size={sm ? 18 : 22} color="currentColor" />
      {children || t.text}
    </span>
  );
}
