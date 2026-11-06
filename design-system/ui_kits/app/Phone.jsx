function Phone({ children, bg = 'var(--bg-app)' }) {
  return (
    <div style={{ width: 390, height: 844, borderRadius: 52, border: '10px solid var(--mapi-indigo-900)', background: bg, overflow: 'hidden', display: 'flex', flexDirection: 'column', position: 'relative', flex: 'none' }}>
      <div style={{ height: 44, flex: 'none', display: 'flex', alignItems: 'center', padding: '0 28px', fontSize: 16, fontWeight: 800, position: 'relative', zIndex: 2 }}>9:41</div>
      {children}
    </div>
  );
}
function PhotoPlaceholder({ label, height = 250, radius = 28, children }) {
  return <div style={{ height, borderRadius: radius, background: 'repeating-linear-gradient(135deg, var(--mapi-stripe-200) 0 12px, var(--mapi-border-100) 12px 24px)', position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center', flex: 'none' }}><span style={{ fontFamily: 'var(--font-mono)', fontSize: 14, color: 'var(--text-muted)' }}>{label}</span>{children}</div>;
}
Object.assign(window, { Phone, PhotoPlaceholder });
