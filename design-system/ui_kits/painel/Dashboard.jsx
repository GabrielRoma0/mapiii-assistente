const RANK = [['Rua 25 de Março', 'Sé', 41, '2,8', 96, 'obstaculo_no_caminho', 62, 30], ['Av. Brig. Luís Antônio', 'Bela Vista', 37, '2,6', 91, 'sem_rampa_ou_degrau', 30, 62], ['Rua da Consolação', 'Consolação', 33, '2,5', 87, 'calcada_quebrada', 22, 34], ['Av. São João', 'República', 29, '2,4', 82, 'sem_rampa_ou_degrau', 44, 20], ['Rua Treze de Maio', 'Bela Vista', 26, '2,3', 76, 'calcada_estreita', 40, 74], ['Rua Augusta', 'Consolação', 24, '2,1', 71, 'obstaculo_no_caminho', 16, 58], ['Rua Vergueiro', 'Liberdade', 21, '2,0', 64, 'calcada_quebrada', 78, 84], ['R. Barão de Itapetininga', 'República', 18, '1,9', 58, 'calcada_estreita', 56, 48]];
const KPIS = [['Ocorrências abertas', '1.284', '+86 nesta semana'], ['Gravidade 3 (impede)', '212', '16,5% do total'], ['Aguardando revisão', '47', 'IA com confiança < 70%'], ['Resolvidas no período', '318', 'tempo médio: 41 dias']];
function Dashboard() {
  const { Logo, Icon, Button, CategoryMarker } = window.MAPI;
  const [nav, setNav] = React.useState('prio');
  const [hover, setHover] = React.useState(null);
  const exportCsv = () => {
    const csv = 'posicao,trecho,bairro,ocorrencias,gravidade_media,prioridade,categoria\n' + RANK.map((r, i) => [i + 1, r[0], r[1], r[2], r[3].replace(',', '.'), r[4], r[5]].join(',')).join('\n');
    const a = document.createElement('a'); a.href = URL.createObjectURL(new Blob([csv], { type: 'text/csv' })); a.download = 'mapiii-prioridades.csv'; a.click();
  };
  const navs = [['prio', 'Prioridades', 'grafico'], ['mapa', 'Mapa', 'mapa'], ['lista', 'Ocorrências', 'lista'], ['rev', 'Revisão da IA', 'revisar']];
  const cols = '36px 1fr 60px 64px 120px';
  return (
    <div style={{ width: 1248, height: 820, borderRadius: 28, overflow: 'hidden', background: 'var(--bg-app)', border: '2px solid var(--border-default)', display: 'grid', gridTemplateColumns: '232px 1fr', gridTemplateRows: 'minmax(0,1fr)', fontFamily: 'var(--font-sans)', color: 'var(--text-body)' }}>
      <aside style={{ background: '#fff', borderRight: '2px solid var(--border-subtle)', padding: '24px 16px', display: 'flex', flexDirection: 'column', gap: 24 }}>
        <div style={{ padding: '0 12px' }}><Logo size={36} cut="#FFFFFF" /></div>
        <nav style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
          {navs.map(([id, l, ic]) => <button key={id} type="button" onClick={() => setNav(id)} aria-current={nav === id ? 'page' : undefined} style={{ height: 52, borderRadius: 16, border: 'none', display: 'flex', alignItems: 'center', gap: 12, padding: '0 14px', font: `${nav === id ? 800 : 700} 17px var(--font-sans)`, cursor: 'pointer', background: nav === id ? 'var(--surface-selected)' : 'transparent', color: nav === id ? 'var(--text-body)' : 'var(--text-muted)' }}><Icon name={ic} size={22} />{l}{id === 'rev' && <span style={{ marginLeft: 'auto', padding: '2px 8px', borderRadius: 8, background: 'var(--status-review-bg)', color: 'var(--status-review-fg)', fontSize: 14, fontWeight: 800 }}>47</span>}</button>)}
        </nav>
        <div style={{ marginTop: 'auto', padding: 14, borderRadius: 16, background: 'var(--bg-app)', fontSize: 15, lineHeight: 1.45 }}><b>Subprefeitura Sé</b><br /><span style={{ color: 'var(--text-muted)' }}>São Paulo · SP</span></div>
      </aside>
      <main style={{ padding: '24px 32px', display: 'flex', flexDirection: 'column', gap: 18, minWidth: 0, minHeight: 0, overflow: 'hidden' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
          <div style={{ display: 'flex', flexDirection: 'column', flex: 1 }}><span style={{ fontSize: 30, fontWeight: 900 }}>Onde agir primeiro</span><span style={{ fontSize: 16, color: 'var(--text-muted)' }}>Prioridade = gravidade × fluxo de pedestres × proximidade de saúde e escolas</span></div>
          <Button variant="secondary" size="md">Últimos 90 dias</Button>
          <Button size="md" icon="download" onClick={exportCsv}>Exportar CSV</Button>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 14 }}>{KPIS.map(([l, v, n]) => <div key={l} style={{ background: '#fff', borderRadius: 20, padding: '16px 18px', display: 'flex', flexDirection: 'column', gap: 4 }}><span style={{ fontSize: 15, fontWeight: 700, color: 'var(--text-muted)' }}>{l}</span><span style={{ fontSize: 32, fontWeight: 900 }}>{v}</span><span style={{ fontSize: 14, color: 'var(--text-muted)' }}>{n}</span></div>)}</div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.05fr', gap: 16, flex: 1, minHeight: 0 }}>
          <div style={{ background: '#fff', borderRadius: 24, padding: 16, display: 'flex', flexDirection: 'column', gap: 12 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}><span style={{ fontSize: 18, fontWeight: 800 }}>Mapa de calor</span><span style={{ fontSize: 14, color: 'var(--text-muted)' }}>números = posição no ranking</span></div>
            <div style={{ flex: 1, borderRadius: 18, background: 'var(--mapi-map-ground)', position: 'relative', overflow: 'hidden' }}>
              {RANK.map((r, i) => <div key={'h' + i} style={{ position: 'absolute', left: r[6] + '%', top: r[7] + '%', width: 240 - i * 14, height: 240 - i * 14, transform: 'translate(-50%,-50%)', borderRadius: '50%', background: `radial-gradient(circle, rgba(148,67,92,${0.7 - i * 0.07}) 0%, rgba(142,124,195,${0.4 - i * 0.03}) 40%, rgba(255,255,255,0) 70%)` }} />)}
              {RANK.map((r, i) => <span key={'n' + i} onMouseEnter={() => setHover(i)} onMouseLeave={() => setHover(null)} style={{ position: 'absolute', left: r[6] + '%', top: r[7] + '%', transform: 'translate(-50%,-50%)', width: 32, height: 32, borderRadius: '50%', background: 'var(--mapi-indigo-900)', color: '#fff', border: hover === i ? '3px solid var(--mapi-almond-300)' : '2px solid #fff', display: 'grid', placeItems: 'center', fontSize: 15, fontWeight: 900 }}>{i + 1}</span>)}
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, fontSize: 14, fontWeight: 700, color: 'var(--text-muted)' }}><span>Menos</span><span style={{ flex: 1, height: 12, borderRadius: 6, background: 'linear-gradient(90deg, #E6DCE0, #9A8C98, #8E7CC3, #94435C)' }} /><span>Mais ocorrências graves</span></div>
          </div>
          <div style={{ background: '#fff', borderRadius: 24, padding: '16px 4px 8px', display: 'flex', flexDirection: 'column', minWidth: 0 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', padding: '0 14px 10px' }}><span style={{ fontSize: 18, fontWeight: 800 }}>Trechos por prioridade</span><span style={{ fontSize: 14, color: 'var(--text-muted)' }}>8 de 64</span></div>
            <div style={{ display: 'grid', gridTemplateColumns: cols, gap: 10, padding: '8px 14px', fontSize: 13, fontWeight: 800, color: 'var(--text-muted)', borderBottom: '2px solid var(--border-subtle)' }}><span>#</span><span>Trecho</span><span>Ocorr.</span><span>Grav.</span><span>Prioridade</span></div>
            {RANK.map((r, i) => <div key={i} onMouseEnter={() => setHover(i)} onMouseLeave={() => setHover(null)} style={{ display: 'grid', gridTemplateColumns: cols, gap: 10, padding: '6px 14px', alignItems: 'center', fontSize: 15, borderBottom: '1px solid var(--border-subtle)', background: hover === i ? 'var(--surface-selected)' : 'transparent' }}>
              <span style={{ width: 28, height: 28, borderRadius: '50%', background: 'var(--mapi-indigo-900)', color: '#fff', display: 'grid', placeItems: 'center', fontSize: 14, fontWeight: 900 }}>{i + 1}</span>
              <div style={{ display: 'flex', gap: 8, alignItems: 'center', minWidth: 0 }}><CategoryMarker category={r[5]} size={22} /><div style={{ display: 'flex', flexDirection: 'column', minWidth: 0 }}><span style={{ fontWeight: 800, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{r[0]}</span><span style={{ fontSize: 13, color: 'var(--text-muted)' }}>{r[1]}</span></div></div>
              <span style={{ fontFamily: 'var(--font-mono)', fontSize: 14 }}>{r[2]}</span><span style={{ fontFamily: 'var(--font-mono)', fontSize: 14 }}>{r[3]}</span>
              <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}><div style={{ flex: 1, height: 8, borderRadius: 4, background: 'var(--border-subtle)' }}><div style={{ height: '100%', width: r[4] + '%', borderRadius: 4, background: 'var(--mapi-grape-700)' }} /></div><span style={{ fontFamily: 'var(--font-mono)', fontSize: 13 }}>{r[4]}</span></div>
            </div>)}
          </div>
        </div>
      </main>
    </div>
  );
}
window.Dashboard = Dashboard;
