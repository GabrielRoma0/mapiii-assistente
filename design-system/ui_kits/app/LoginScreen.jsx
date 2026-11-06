const PERFIS = ['Uso cadeira de rodas', 'Cuido de cadeirante', 'Tenho deficiência visual', 'Tenho mobilidade reduzida', 'Sou idoso(a)', 'Ando com carrinho de bebê', 'Só quero ajudar'];
function LoginScreen({ go }) {
  const { Logo, Input, Checkbox, Button } = window.MAPI;
  const [sel, setSel] = React.useState([0]);
  const [nome, setNome] = React.useState('');
  const t = i => setSel(s => s.includes(i) ? s.filter(x => x !== i) : [...s, i]);
  return (
    <Phone>
      <div style={{ padding: '4px 24px 8px', display: 'flex', flexDirection: 'column', gap: 14, flex: 1, minHeight: 0, overflow: 'auto' }}>
        <Logo size={30} />
        <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}><span style={{ fontSize: 28, lineHeight: 1.2, fontWeight: 900 }}>Boas-vindas!</span><span style={{ fontSize: 16, color: 'var(--text-muted)' }}>Conte um pouco sobre você.</span></div>
        <Input label="Como podemos te chamar?" placeholder="Seu nome" value={nome} onChange={e => setNome(e.target.value)} />
        <fieldset style={{ border: 'none', margin: 0, padding: 0, display: 'flex', flexDirection: 'column', gap: 6 }}>
          <legend style={{ padding: '0 0 8px', fontSize: 16, fontWeight: 800 }}>Você se identifica com algum destes? <span style={{ fontWeight: 600, color: 'var(--text-muted)' }}>Marque quantos quiser</span></legend>
          {PERFIS.map((p, i) => <Checkbox key={p} label={p} checked={sel.includes(i)} onChange={() => t(i)} />)}
        </fieldset>
      </div>
      <div style={{ flex: 'none', padding: '10px 24px 18px', display: 'flex', flexDirection: 'column', gap: 2, borderTop: '1px solid var(--border-default)' }}>
        <Button fullWidth onClick={() => go('mapa')}>Começar</Button>
        <Button variant="text" size="md" fullWidth onClick={() => go('mapa')}>Já tenho conta</Button>
      </div>
    </Phone>
  );
}
window.LoginScreen = LoginScreen;
