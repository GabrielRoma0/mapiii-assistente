const MARKERS = [[70, 250, 'sem_rampa_ou_degrau'], [150, 290, 'obstaculo_no_caminho'], [320, 240, 'sem_problema'], [96, 410, 'calcada_estreita'], [300, 380, 'calcada_quebrada'], [140, 480, 'sem_rampa_ou_degrau'], [250, 520, 'obstaculo_no_caminho'], [340, 470, 'calcada_estreita'], [228, 300, 'calcada_quebrada']];
function MapScreen({ go }) {
  const { CategoryMarker, CATEGORIES, FilterChip, IconButton, Icon, Button, TabBar } = window.MAPI;
  const [filtro, setFiltro] = React.useState(null);
  const [selIdx, setSelIdx] = React.useState(8);
  const vis = MARKERS.map((m, i) => [...m, i]).filter(m => !filtro || m[2] === filtro);
  const sel = MARKERS[selIdx];
  const road = (l, t, w, h, r) => <div style={{ position: 'absolute', left: l, top: t, width: w, height: h, background: '#fff', transform: `rotate(${r}deg)` }} />;
  return (
    <Phone bg="var(--mapi-map-ground)">
      <div style={{ position: 'absolute', inset: 0 }}>
        {road(-40, 300, 520, 22, -14)}{road(-40, 520, 520, 30, 8)}{road(120, -20, 22, 900, 12)}{road(280, -20, 18, 900, -6)}{road(-40, 200, 520, 14, 4)}
        <div style={{ position: 'absolute', left: 170, top: 360, width: 96, height: 110, borderRadius: 24, background: 'var(--mapi-map-park)' }} />
        {vis.map(([x, y, c, i]) => (
          <button key={i} type="button" aria-label={CATEGORIES[c].label} onClick={() => setSelIdx(i)} style={{ position: 'absolute', left: x, top: y, transform: 'translate(-50%,-50%)', width: i === selIdx ? 72 : 48, height: i === selIdx ? 72 : 48, borderRadius: '50%', border: i === selIdx ? '3px solid var(--mapi-indigo-900)' : 'none', background: i === selIdx ? 'rgba(255,255,255,.85)' : 'transparent', display: 'grid', placeItems: 'center', cursor: 'pointer', padding: 0 }}>
            <CategoryMarker category={c} size={i === selIdx ? 46 : 40} />
          </button>
        ))}
      </div>
      <div style={{ position: 'relative', zIndex: 1, display: 'flex', flexDirection: 'column', gap: 10, padding: '0 16px' }}>
        <div style={{ height: 56, borderRadius: 28, background: '#fff', display: 'flex', alignItems: 'center', gap: 12, padding: '0 4px 0 18px', boxShadow: 'var(--shadow-search)' }}><Icon name="busca" /><span style={{ flex: 1, fontSize: 17, color: 'var(--text-muted)' }}>Buscar rua ou bairro</span><IconButton icon="filtro" label="Filtros" variant="tint" /></div>
        <div style={{ display: 'flex', gap: 8, overflowX: 'auto', marginRight: -16, paddingBottom: 4 }}>
          <FilterChip label="Todas" selected={!filtro} onClick={() => setFiltro(null)} />
          {Object.keys(CATEGORIES).slice(0, 4).map(k => <FilterChip key={k} label={CATEGORIES[k].short} category={k} selected={filtro === k} onClick={() => setFiltro(k)} />)}
        </div>
      </div>
      <div style={{ position: 'absolute', right: 16, bottom: 316, zIndex: 1 }}><Button icon="camera" size="xl" pill onClick={() => go('captura')} style={{ boxShadow: 'var(--shadow-float)' }}>Registrar</Button></div>
      <div style={{ position: 'absolute', left: 0, right: 0, bottom: 0, zIndex: 1, background: '#fff', borderRadius: '32px 32px 0 0', boxShadow: 'var(--shadow-sheet)' }}>
        <div style={{ width: 44, height: 5, borderRadius: 3, background: 'var(--mapi-border-200)', margin: '10px auto 6px' }} />
        <div style={{ padding: '6px 20px 14px', display: 'flex', flexDirection: 'column', gap: 12 }}>
          <span style={{ fontSize: 16, fontWeight: 700, color: 'var(--text-muted)' }}>{vis.length} ocorrências nesta área</span>
          <div style={{ display: 'flex', gap: 14, alignItems: 'center' }}><CategoryMarker category={sel[2]} size={40} /><div style={{ display: 'flex', flexDirection: 'column', flex: 1 }}><span style={{ fontSize: 19, fontWeight: 800 }}>{CATEGORIES[sel[2]].label}</span><span style={{ fontSize: 16, color: 'var(--text-muted)' }}>Rua da Consolação, 312 · 120 m</span></div><span style={{ display: 'flex', gap: 6, alignItems: 'center', fontWeight: 800 }}><Icon name="g2" size={22} />2</span></div>
          <Button variant="secondary" size="md" fullWidth onClick={() => go('detalhe')}>Ver detalhes</Button>
        </div>
        <TabBar value="mapa" onChange={id => id === 'perfil' && go('login')} items={[{ id: 'mapa', label: 'Mapa', icon: 'mapa' }, { id: 'fotos', label: 'Minhas fotos', icon: 'lista' }, { id: 'perfil', label: 'Perfil', icon: 'usuario' }]} />
      </div>
    </Phone>
  );
}
window.MapScreen = MapScreen;
