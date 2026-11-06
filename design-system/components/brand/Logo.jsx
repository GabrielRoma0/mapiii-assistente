import React from 'react';
import { Mark } from './Mark.jsx';

const TONES = {
  color: { text: 'var(--mapi-indigo-900)', pin: 'var(--mapi-grape-700)', cut: 'var(--mapi-seashell-50)' },
  mono: { text: 'var(--mapi-indigo-900)', pin: 'var(--mapi-indigo-900)', cut: 'var(--mapi-white)' },
  inverse: { text: 'var(--mapi-seashell-50)', pin: 'var(--mapi-seashell-50)', cut: 'var(--mapi-indigo-900)' }
};
const dot = c => ({ display: 'block', width: '0.19em', height: '0.19em', borderRadius: '50%', margin: '0 auto 0.177em', background: c });
const stem = c => ({ display: 'block', width: '0.165em', height: '0.5em', borderRadius: '0.085em', margin: '0 auto', background: c });
const iBox = (ml, top) => ({ display: 'inline-block', verticalAlign: 'baseline', width: '0.2em', marginLeft: ml, position: 'relative', top });

/** Logo horizontal: M-rampa, p-roda e três i em escadinha terminando na pinha. */
export function Logo({ size = 48, tone = 'color', cut, title = 'Mapiii' }) {
  const t = TONES[tone] || TONES.color;
  const c = cut || t.cut;
  return (
    <span role="img" aria-label={title} style={{ display: 'inline-block', whiteSpace: 'nowrap', fontFamily: 'var(--font-sans)', fontWeight: 900, letterSpacing: '-0.035em', lineHeight: 1, fontSize: size, color: t.text, paddingBottom: '0.3em' }}>
      <svg aria-hidden="true" viewBox="0 0 682 705" style={{ display: 'inline-block', verticalAlign: 'baseline', width: '0.682em', height: '0.705em', marginRight: '0.045em', overflow: 'visible' }}>
        <path d="M82 623V82L338 436L600 303V623" style={{ fill: 'none', stroke: t.text, strokeWidth: 165, strokeLinecap: 'round', strokeLinejoin: 'round' }} />
      </svg>
      <span aria-hidden="true">a</span>
      <svg aria-hidden="true" viewBox="0 0 550 700" style={{ display: 'inline-block', verticalAlign: '-0.216em', width: '0.55em', height: '0.7em', marginLeft: '0.01em', overflow: 'visible' }}>
        <path d="M78 78V622" style={{ fill: 'none', stroke: t.text, strokeWidth: 150, strokeLinecap: 'round' }} />
        <circle cx="306" cy="242" r="184" style={{ fill: 'none', stroke: t.text, strokeWidth: 116 }} />
        <path d="M428 242L184 242M367 347.7L245 136.3M245 347.7L367 136.3" opacity="0.4" style={{ fill: 'none', stroke: t.text, strokeWidth: 30, strokeLinecap: 'round' }} />
        <circle cx="306" cy="242" r="40" style={{ fill: t.text }} />
      </svg>
      <span aria-hidden="true" style={iBox('0.035em', 0)}><span style={dot(t.text)} /><span style={stem(t.text)} /></span>
      <span aria-hidden="true" style={iBox('0.03em', '0.14em')}><span style={dot(t.text)} /><span style={stem(t.text)} /></span>
      <span aria-hidden="true" style={iBox('0.05em', '0.28em')}>
        <span style={{ display: 'block', width: '0.4em', height: '0.4em', marginLeft: '-0.1em' }}><Mark size={Math.round(size * 0.4)} color={t.pin} cut={c} /></span>
        <span style={{ ...stem(t.text), marginTop: '0.035em' }} />
      </span>
    </span>
  );
}
