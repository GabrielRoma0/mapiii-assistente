// Cenas 7 a 11: Descubra, Com fonte, Mostre ao motorista, Aviso no bolso, Sabe dizer não.
import React from 'react';
import { AbsoluteFill, Img, OffthreadVideo, Sequence, staticFile, useCurrentFrame } from 'remotion';
import { Cartao, chegada, COR, Destaque, EntradaDeCena, Fundo, Icone, impacto, Leco, mix, MONO, Palavras, r2, Selo } from '../base';
import { Pessoa } from '../desenhos';
import { arquivoExiste } from '../arquivos';
import { cena, naPalavra, quadrosDa } from '../roteiro';
import { LinhaDeRota } from '../sobreposicoes';

// Corte curto do app real, se a gravação existir em public/app/.
const CorteDoApp: React.FC<{ arquivo: string; de: number; dur: number }> = ({ arquivo, de, dur }) => {
  if (!arquivoExiste(arquivo)) return null;
  return (
    <Sequence from={de} durationInFrames={dur}>
      <AbsoluteFill style={{ background: COR.seashell }}>
        <OffthreadVideo src={staticFile(arquivo)} muted style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
      </AbsoluteFill>
    </Sequence>
  );
};

// ---------- Cena 7: triagem no celular → "Pode ter direito" → passos ----------
export const Cena7: React.FC = () => {
  const f = useCurrentFrame();
  const responde = naPalavra(7, 'responde');
  const nome = naPalavra(7, 'nome');
  const cpf = naPalavra(7, 'CPF');
  const mostra = naPalavra(7, 'mostra');
  const porque = naPalavra(7, 'quê');
  const fone = chegada(f, 2, 14);
  const toque = responde + 10;
  const sel = f >= toque ? 1 : 0;
  const card = chegada(f, mostra, 12);
  const respostas = ['Para mim', 'Para meu filho ou filha', 'Para alguém que eu acompanho'];
  const dur = quadrosDa(cena(7));
  return (
    <EntradaDeCena>
      <Fundo>
        <LinhaDeRota n={7} />
        <h1 style={{ position: 'absolute', left: 120, top: 110, margin: 0, width: 760, fontSize: 96, fontWeight: 900, lineHeight: 1.02, letterSpacing: '-0.035em' }}>
          <Palavras itens={[{ texto: 'Descubra', em: 0 }, { texto: 'o', em: 4 }, { texto: 'que', em: 8 }, { texto: <Destaque de={mostra + 6}>pode pedir</Destaque>, em: 12 }]} />
        </h1>
        <div style={{ position: 'absolute', left: 124, top: 400, display: 'flex', gap: 16 }}>
          {[{ t: 'Sem nome', em: nome }, { t: 'Sem CPF', em: cpf }].map((p) => {
            const t = chegada(f, p.em - 2, 10);
            return <span key={p.t} style={{ opacity: t > 0 ? 1 : 0, transform: `translateY(${r2(mix(50, 0, t))}px) scale(${r2(mix(1.15, 1, t))})`, display: 'inline-block' }}><Selo texto={p.t} /></span>;
          })}
        </div>
        <Leco pose="procurando" x={150} y={540} tamanho={480} em={8} />
        {/* celular com a triagem */}
        <div style={{ position: 'absolute', left: 940, top: 110, transform: `translateY(${r2(mix(900, 0, fone))}px) rotate(${r2(mix(-14, -6, fone))}deg)` }}>
          <div style={{ position: 'relative', width: 414, height: 868, border: `12px solid ${COR.indigo}`, borderRadius: 64, overflow: 'hidden', background: COR.seashell, boxShadow: '0 40px 90px rgba(34,34,59,.20)' }}>
            <div style={{ position: 'absolute', left: '50%', top: 14, width: 110, height: 30, marginLeft: -55, borderRadius: 15, background: COR.indigo }} />
            <div style={{ position: 'absolute', inset: 0, padding: '64px 22px 26px', display: 'flex', flexDirection: 'column' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 14, padding: '4px 0 6px' }}>
                <span style={{ width: 48, height: 48, borderRadius: 16, background: COR.branco, display: 'grid', placeItems: 'center' }}><Icone nome="voltar" tamanho={26} cor={COR.indigo} /></span>
                <div style={{ flex: 1, display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 8 }}>
                  {[0, 1, 2].map((i) => <span key={i} style={{ height: 10, borderRadius: 5, background: i <= sel ? COR.indigo : COR.borda }} />)}
                </div>
              </div>
              <h2 style={{ margin: '22px 0', fontSize: 38, lineHeight: '44px', fontWeight: 900, letterSpacing: '-0.02em' }}>Para quem é a orientação?</h2>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                {respostas.map((r, i) => {
                  const escolhida = sel && i === 0;
                  const apertando = f >= toque - 4 && f < toque + 2 && i === 0;
                  return (
                    <div key={r} style={{
                      minHeight: 84, borderRadius: 24, display: 'flex', alignItems: 'center', gap: 14, padding: '0 22px', fontSize: 22, fontWeight: 800,
                      background: escolhida ? COR.indigo : COR.branco, color: escolhida ? COR.seashell : COR.indigo, border: `3px solid ${escolhida ? COR.indigo : COR.borda}`,
                      transform: `scale(${apertando ? 0.97 : 1})`
                    }}>
                      {escolhida ? <Icone nome="check" tamanho={28} cor={COR.seashell} /> : null}<span>{r}</span>
                    </div>
                  );
                })}
              </div>
              <div style={{ marginTop: 'auto', height: 64, borderRadius: 22, background: COR.indigo, color: COR.seashell, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 21, fontWeight: 900 }}>Continuar</div>
            </div>
          </div>
        </div>
        {/* cartão "Pode ter direito" sai do celular; os passos descem linha por linha */}
        <Cartao style={{ left: 1290, top: 520, width: 520, padding: 40, gap: 22, boxShadow: '0 8px 24px rgba(34,34,59,0.18)', opacity: card > 0 ? 1 : 0, transform: `translateX(${r2(mix(-260, 0, card))}px) rotate(${r2(mix(-4, 3, card))}deg)` }}>
          <span style={{ alignSelf: 'flex-start', display: 'inline-flex', alignItems: 'center', gap: 10, padding: '10px 22px 10px 14px', borderRadius: 999, background: COR.branco, border: `3px solid ${COR.verde700}`, color: COR.verde800, fontSize: 28, fontWeight: 900 }}>
            <Icone nome="check" tamanho={28} cor={COR.verde800} traco={2.6} />Pode ter direito
          </span>
          <div style={{ fontSize: 46, lineHeight: 1.08, fontWeight: 900, letterSpacing: '-0.02em' }}>Bilhete Único Especial</div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            {[92, 78, 54].map((w, i) => {
              const t = chegada(f, porque - 6 + i * 5, 10);
              return <div key={w} style={{ height: 16, width: `${w}%`, borderRadius: 16, background: COR.borda, opacity: t > 0 ? 1 : 0, transform: `translateY(${r2(mix(-24, 0, t))}px)` }} />;
            })}
          </div>
        </Cartao>
      </Fundo>
    </EntradaDeCena>
  );
};

// ---------- Cena 8: "você tem direito" riscado → "pode ter direito" → selo de fonte ----------
export const Cena8: React.FC = () => {
  const f = useCurrentFrame();
  const nunca = naPalavra(8, 'Nunca');
  const risca = naPalavra(8, 'direito', 0) + 6;
  const pode = naPalavra(8, 'pode');
  const fonte = naPalavra(8, 'fonte');
  const data = naPalavra(8, 'data');
  const t1 = chegada(f, Math.min(nunca, 3), 10);
  const risco = chegada(f, risca, 8);
  const t2 = chegada(f, pode - 2, 12);
  const selo = chegada(f, fonte - 2, 12);
  return (
    <EntradaDeCena>
      <Fundo>
        <LinhaDeRota n={8} />
        <div style={{ position: 'absolute', left: 120, top: 190 }}>
          <div style={{ position: 'relative', display: 'inline-block', fontSize: 84, fontWeight: 800, color: COR.grape, opacity: t1 > 0 ? 1 : 0, transform: `translateY(${r2(mix(50, 0, t1))}px)` }}>
            você tem direito
            <span style={{ position: 'absolute', left: 0, top: '54%', height: 10, width: `${r2(risco * 100)}%`, background: COR.coral700, borderRadius: 5 }} />
          </div>
          <div style={{ fontSize: 150, lineHeight: 1.05, fontWeight: 900, letterSpacing: '-0.03em', marginTop: 18, opacity: t2 > 0 ? 1 : 0, transform: `translateY(${r2(mix(90, 0, t2))}px)` }}>
            <Destaque de={pode + 8}>pode ter direito</Destaque>
          </div>
          <div style={{
            marginTop: 84, display: 'inline-flex', alignItems: 'center', gap: 24, padding: '24px 40px 24px 30px', borderRadius: 32, background: COR.branco, border: `4px solid ${COR.borda}`, fontSize: 44, fontWeight: 600,
            opacity: selo, transform: `scale(${r2(mix(1.12, 1, selo))})`, transformOrigin: 'left center'
          }}>
            <Icone nome="escudo_check" tamanho={52} cor={COR.verde700} />
            <span><b style={{ color: COR.verde800, fontWeight: 900 }}>Fonte oficial</b> <span style={{ color: COR.grape, opacity: chegada(f, data - 4, 10) }}>· conferida em <span style={{ fontFamily: MONO }}>09/11/2026</span></span></span>
          </div>
        </div>
        <Leco pose="verificado" x={1290} y={220} tamanho={600} em={fonte - 4} />
      </Fundo>
    </EntradaDeCena>
  );
};

// QR ilustrativo, determinístico (não abre nada): três quadrados de posição e um padrão fixo.
const QR: React.FC<{ tamanho: number; progresso: number }> = ({ tamanho, progresso }) => {
  const n = 25;
  const c = tamanho / n;
  const marca = (x: number, y: number) => (x < 7 && y < 7) || (x >= n - 7 && y < 7) || (x < 7 && y >= n - 7);
  const cel: React.ReactNode[] = [];
  for (let y = 0; y < n; y++) {
    for (let x = 0; x < n; x++) {
      if (marca(x, y)) continue;
      const h = (x * 7349 + y * 1931 + x * y * 17) % 11;
      if (h < 5 && (y * n + x) / (n * n) <= progresso) cel.push(<rect key={`${x}-${y}`} x={x * c} y={y * c} width={c} height={c} fill={COR.indigo} />);
    }
  }
  const quadro = (x: number, y: number) => (
    <g key={`${x}-${y}`}>
      <rect x={x * c} y={y * c} width={7 * c} height={7 * c} fill={COR.indigo} />
      <rect x={(x + 1) * c} y={(y + 1) * c} width={5 * c} height={5 * c} fill={COR.branco} />
      <rect x={(x + 2) * c} y={(y + 2) * c} width={3 * c} height={3 * c} fill={COR.indigo} />
    </g>
  );
  return (
    <svg viewBox={`0 0 ${tamanho} ${tamanho}`} width={tamanho} height={tamanho} aria-hidden>
      <rect width={tamanho} height={tamanho} fill={COR.branco} />
      {progresso > 0 && [quadro(0, 0), quadro(n - 7, 0), quadro(0, n - 7)]}
      {cel}
    </svg>
  );
};

// ---------- Cena 9: o celular 3D gira e mostra "Mostre ao motorista" ----------
export const Cena9: React.FC = () => {
  const f = useCurrentFrame();
  const vira = naPalavra(9, 'vira');
  const letra = naPalavra(9, 'letra');
  const lei = naPalavra(9, 'lei,');
  const codigo = naPalavra(9, 'código');
  // Giro: costas → perfil → frente, em "vira a tela".
  const g1 = vira;
  const g2 = vira + 5;
  const g3 = vira + 10;
  const img = f < g1 ? 'celular-costas' : f < g2 ? 'celular-perfil' : 'celular-frente';
  const escala = f >= g1 && f < g3 ? 0.97 : 1;
  const choque = impacto(f, g3, 6, 0);
  const entra = chegada(f, 4, 16);
  const tam = 940; // imagem 2000 px reduzida; a tela fica em x 676, y 296, 648 × 1408 (no original)
  const k = tam / 2000;
  const dur = quadrosDa(cena(9));
  return (
    <EntradaDeCena>
      <Fundo>
        <LinhaDeRota n={9} />
        <h1 style={{ position: 'absolute', left: 120, top: 330, margin: 0, fontSize: 190, fontWeight: 900, lineHeight: 1.02, letterSpacing: '-0.035em' }}>
          <Palavras itens={[{ texto: 'Vire', em: vira - 10 }, { texto: 'a', em: vira - 6 }]} />
          <br />
          <Palavras itens={[{ texto: <Destaque de={g3}>tela.</Destaque>, em: vira - 2 }]} />
        </h1>
        <div style={{ position: 'absolute', left: 980, top: 70, width: tam, height: tam, transform: `translate(${r2(choque.x + mix(700, 0, entra))}px, 0) scale(${escala}) rotate(4deg)` }}>
          <Img src={staticFile(`objetos/${img}.png`)} style={{ position: 'absolute', inset: 0, width: tam, height: tam }} />
          {f >= g3 && (
            <div style={{ position: 'absolute', left: 676 * k, top: 296 * k, width: 648 * k, height: 1408 * k, borderRadius: 40, overflow: 'hidden', background: COR.branco, padding: '40px 22px', display: 'flex', flexDirection: 'column', gap: 18, alignItems: 'center' }}>
              <div style={{ alignSelf: 'stretch', fontSize: 40, lineHeight: '44px', fontWeight: 900, letterSpacing: '-0.025em' }}>Mostre ao motorista</div>
              <div style={{ alignSelf: 'stretch', display: 'flex', flexDirection: 'column', gap: 11 }}>
                {[100, 94, 100, 70].map((w, i) => {
                  const t = chegada(f, (i < 2 ? letra : lei) - 4 + i * 3, 10);
                  return <div key={i} style={{ height: 12, width: `${w}%`, borderRadius: 12, background: COR.borda, opacity: t > 0 ? 1 : 0, transform: `translateY(${r2(mix(-16, 0, t))}px)` }} />;
                })}
              </div>
              <div style={{ padding: 10, borderRadius: 18, border: `3px solid ${COR.borda}`, background: COR.branco, opacity: f >= codigo - 2 ? 1 : 0 }}>
                <QR tamanho={200} progresso={chegada(f, codigo - 2, 30)} />
              </div>
            </div>
          )}
        </div>
        <CorteDoApp arquivo="app/mao-celular.mp4" de={dur - 60} dur={60} />
      </Fundo>
    </EntradaDeCena>
  );
};

// ---------- Cena 10: celular no bolso; a notificação desce do topo ----------
export const Cena10: React.FC = () => {
  const f = useCurrentFrame();
  const bolso = naPalavra(10, 'bolso');
  const avisar = naPalavra(10, 'avisar');
  const voz = naPalavra(10, 'voz');
  const ondas = Math.max(0, Math.min(1, (f - voz + 2) / 12));
  const pulso = f >= voz ? (Math.sin(((f - voz) / 30) * Math.PI * 2 * 1.2) + 1) / 2 : 0;
  const noti = chegada(f, avisar - 2, 12);
  const pessoa = chegada(f, 2, 14);
  return (
    <EntradaDeCena>
      <Fundo>
        <LinhaDeRota n={10} />
        <h1 style={{ position: 'absolute', left: 120, top: 110, margin: 0, fontSize: 112, fontWeight: 900, lineHeight: 1.02, letterSpacing: '-0.035em' }}>
          <Palavras itens={[{ texto: 'O', em: 0 }, { texto: 'ônibus', em: 4 }]} />
          <br />
          <Palavras itens={[{ texto: <Destaque de={avisar + 4}>avisa</Destaque>, em: avisar - 4 }, { texto: 'você.', em: avisar }]} />
        </h1>
        <div style={{ position: 'absolute', left: 150, top: 380, transform: `translateX(${r2(mix(-600, 0, pessoa))}px)` }}>
          <Pessoa largura={820} bolso ondas={f >= bolso ? Math.max(ondas, 0.34 + 0.66 * pulso * ondas) : 0} />
        </div>
        <Cartao style={{ left: 930, top: 250, width: 860, padding: '40px 48px', flexDirection: 'row', alignItems: 'center', gap: 32, boxShadow: '0 8px 24px rgba(34,34,59,0.18)', transform: `translateY(${r2(mix(-520, 0, noti))}px)` }}>
          <span style={{ width: 120, height: 120, borderRadius: 32, background: COR.indigo, display: 'grid', placeItems: 'center', flex: 'none' }}><Icone nome="local" tamanho={68} cor={COR.seashell} /></span>
          <span style={{ fontSize: 52, lineHeight: 1.1, fontWeight: 900, letterSpacing: '-0.02em' }}>Ônibus acessível chegando <span style={{ color: COR.grape }}>· 2 min</span></span>
        </Cartao>
        <Leco pose="ouvindo" x={1480} y={600} tamanho={400} em={voz - 4} />
      </Fundo>
    </EntradaDeCena>
  );
};

// ---------- Cena 11: Leco faz "não"; Emergência: 192 ----------
export const Cena11: React.FC = () => {
  const f = useCurrentFrame();
  const nao = naPalavra(11, 'não.');
  const remedio = naPalavra(11, 'Remédio');
  const ajudar = naPalavra(11, 'ajudar');
  const n192 = naPalavra(11, '192');
  const pill = chegada(f, n192 - 3, 12);
  const pergunta = chegada(f, remedio - 2, 10) * (1 - chegada(f, n192 - 10, 8));
  return (
    <EntradaDeCena>
      <Fundo>
        <Leco pose="recusa" x={110} y={150} tamanho={800} em={2} balanco={nao} />
        <div style={{ position: 'absolute', left: 960, top: 230 }}>
          <div style={{ fontSize: 168, lineHeight: 0.95, fontWeight: 900, letterSpacing: '-0.035em' }}>
            <Palavras itens={[{ texto: 'Sabe', em: nao - 12 }, { texto: 'dizer', em: nao - 7 }]} />
            <br />
            <Palavras itens={[{ texto: 'não.', em: nao - 2 }]} />
          </div>
          <div style={{ marginTop: 40, height: 60, fontSize: 44, fontWeight: 800, color: COR.grape, opacity: pergunta, transform: `translateY(${r2(mix(30, 0, chegada(f, remedio - 2, 10)))}px)` }}>
            Remédio ou processo? <span style={{ opacity: chegada(f, ajudar - 6, 8) }}>Mostra quem pode ajudar.</span>
          </div>
          <div style={{
            marginTop: 20, display: 'inline-flex', alignItems: 'center', gap: 28, padding: '30px 48px', borderRadius: 44, background: COR.indigo, color: COR.seashell, fontSize: 76, fontWeight: 900, letterSpacing: '-0.02em',
            opacity: pill > 0 ? 1 : 0, transform: `translateY(${r2(mix(120, 0, pill))}px)`
          }}>
            <Icone nome="alerta" tamanho={68} cor={COR.rosa} />Emergência: <span style={{ color: COR.rosa }}>192</span>
          </div>
        </div>
      </Fundo>
    </EntradaDeCena>
  );
};
