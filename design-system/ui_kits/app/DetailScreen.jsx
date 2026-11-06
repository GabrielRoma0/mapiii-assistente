function DetailScreen({ go }) {
  const { IconButton, Button, Icon, Badge, CategoryMarker, SeverityPicker } = window.MAPI;
  const [g, setG] = React.useState(2);
  const [done, setDone] = React.useState(false);
  const scores = [['calcada_quebrada', 'Calçada quebrada', 62], ['obstaculo_no_caminho', 'Obstáculo no caminho', 31], ['calcada_estreita', 'Calçada estreita', 7]];
  return (
    <Phone>
      <div style={{ position: 'absolute', top: 0, left: 0, right: 0 }}><PhotoPlaceholder label="foto enviada da ocorrência" radius={0}><div style={{ position: 'absolute', left: 16, top: 52 }}><IconButton icon="voltar" label="Voltar" onClick={() => go('mapa')} /></div></PhotoPlaceholder></div>
      <div style={{ marginTop: 206, padding: '18px 20px 0', display: 'flex', flexDirection: 'column', gap: 14 }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}><span style={{ fontSize: 26, fontWeight: 900, lineHeight: 1.2 }}>Rua da Consolação, 312</span><span style={{ fontSize: 16, color: 'var(--text-muted)' }}>Consolação · enviada há 2 dias por Marta R.</span></div>
        <div style={{ background: '#fff', borderRadius: 24, padding: 16, display: 'flex', flexDirection: 'column', gap: 12 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 8 }}><span style={{ display: 'flex', gap: 8, alignItems: 'center', fontSize: 17, fontWeight: 800 }}><Icon name="ia" size={22} color="var(--mapi-grape-700)" />Classificação da IA</span>{done ? <Badge tone="success" size="sm">Confirmada</Badge> : <Badge tone="review" size="sm" />}</div>
          {scores.map(([k, l, p]) => <div key={k} style={{ display: 'flex', flexDirection: 'column', gap: 6 }}><div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 16, fontWeight: 800 }}><span style={{ display: 'flex', gap: 8, alignItems: 'center' }}><CategoryMarker category={k} size={22} />{l}</span><span style={{ fontFamily: 'var(--font-mono)' }}>{p}%</span></div><div style={{ height: 10, borderRadius: 5, background: 'var(--border-subtle)' }}><div style={{ height: '100%', width: p + '%', borderRadius: 5, background: 'var(--mapi-indigo-900)' }} /></div></div>)}
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}><span style={{ fontSize: 16, fontWeight: 800 }}>Gravidade sugerida</span><SeverityPicker value={g} onChange={setG} compact /></div>
      </div>
      <div style={{ marginTop: 'auto', padding: '14px 20px 26px', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
        <Button variant="secondary">Corrigir</Button><Button icon="check" onClick={() => setDone(true)}>Confirmar</Button>
      </div>
    </Phone>
  );
}
window.DetailScreen = DetailScreen;
