import React from 'react';
import { CategoryTag } from './CategoryTag.jsx';
import { Badge } from '../feedback/Badge.jsx';
import { Icon } from '../icons/Icon.jsx';
import { SEVERITY } from './SeverityPicker.jsx';

export function OccurrenceCard({ category, address, meta, severity, photo, needsReview, onClick }) {
  const s = SEVERITY[severity] || null;
  return (
    <article onClick={onClick} style={{ display: 'flex', gap: 18, padding: 16, borderRadius: 28, background: 'var(--surface-card)', border: '2px solid var(--border-default)', cursor: onClick ? 'pointer' : 'default' }}>
      <div style={{ width: 120, height: 120, flex: 'none', borderRadius: 20, overflow: 'hidden', background: 'repeating-linear-gradient(135deg, var(--mapi-stripe-200) 0 10px, var(--mapi-border-100) 10px 20px)', display: 'flex', alignItems: 'flex-end', padding: photo ? 0 : 10 }}>
        {photo ? <img src={photo} alt={'Foto da ocorrência em ' + address} style={{ width: '100%', height: '100%', objectFit: 'cover' }} /> : <span style={{ fontFamily: 'var(--font-mono)', fontSize: 12, color: 'var(--text-muted)' }}>foto</span>}
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 8, minWidth: 0 }}>
        <CategoryTag category={category} size="sm" />
        <span style={{ fontSize: 20, fontWeight: 800, lineHeight: 1.3 }}>{address}</span>
        {meta && <span style={{ fontSize: 16, color: 'var(--text-muted)' }}>{meta}</span>}
        {needsReview && <Badge tone="review" size="sm" />}
        {s && <span style={{ display: 'flex', gap: 8, alignItems: 'center', fontSize: 16, fontWeight: 700 }}><Icon name={'g' + s.n} size={22} />Gravidade {s.n} · {s.label}</span>}
      </div>
    </article>
  );
}
