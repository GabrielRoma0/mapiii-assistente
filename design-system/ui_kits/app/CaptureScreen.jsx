function CaptureScreen({ go }) {
  const { IconButton, Button, Icon, Input } = window.MAPI;
  const [sent, setSent] = React.useState(false);
  return (
    <Phone>
      <div style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '4px 20px 12px' }}>
        <IconButton icon="voltar" label="Voltar" onClick={() => go('mapa')} />
        <div style={{ display: 'flex', flexDirection: 'column' }}><span style={{ fontSize: 22, fontWeight: 900 }}>Nova ocorrência</span><span style={{ fontSize: 16, color: 'var(--text-muted)' }}>Passo 1 de 2</span></div>
      </div>
      <div style={{ padding: '0 20px', display: 'flex', flexDirection: 'column', gap: 14 }}>
        <PhotoPlaceholder label="foto recém-tirada da calçada">
          <div style={{ position: 'absolute', left: 12, bottom: 12 }}><Button variant="secondary" size="md" icon="camera" style={{ border: 'none' }}>Refazer</Button></div>
          <div style={{ position: 'absolute', right: 12, bottom: 12 }}><Button variant="secondary" size="md" icon="mais" style={{ border: 'none' }}>Outra foto</Button></div>
        </PhotoPlaceholder>
        <div style={{ background: '#fff', borderRadius: 20, padding: '14px 12px 14px 14px', display: 'flex', alignItems: 'center', gap: 12 }}>
          <span style={{ width: 44, height: 44, flex: 'none', borderRadius: 14, background: 'var(--surface-selected)', display: 'grid', placeItems: 'center' }}><Icon name="local" color="var(--mapi-grape-700)" /></span>
          <div style={{ display: 'flex', flexDirection: 'column', flex: 1 }}><span style={{ fontSize: 18, fontWeight: 800 }}>Rua Augusta, 1.200</span><span style={{ fontSize: 16, color: 'var(--text-muted)' }}>Consolação · precisão 8 m</span></div>
          <Button variant="text" size="md" style={{ padding: '0 8px' }}>Alterar</Button>
        </div>
        <Input label="O que acontece aqui?" optional multiline rows={2} placeholder="Ex.: degrau alto na esquina, sem rampa" />
        <div style={{ display: 'flex', gap: 10, fontSize: 16, lineHeight: 1.5 }}><Icon name="ia" color="var(--mapi-grape-700)" /><span>A IA sugere a categoria em segundos. Você confirma antes de publicar.</span></div>
      </div>
      <div style={{ marginTop: 'auto', padding: '16px 20px 28px' }}>
        <Button icon={sent ? 'check' : 'enviar'} size="xl" fullWidth onClick={() => { setSent(true); setTimeout(() => go('detalhe'), 600); }}>{sent ? 'Enviada' : 'Enviar foto'}</Button>
      </div>
    </Phone>
  );
}
window.CaptureScreen = CaptureScreen;
