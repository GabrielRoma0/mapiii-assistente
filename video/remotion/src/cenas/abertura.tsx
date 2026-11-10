// Cenas 1 a 6: gancho, problema, número, virada e logo.
import React from 'react';
import { AbsoluteFill, Img, interpolate, staticFile, useCurrentFrame } from 'remotion';
import { chegada, COR, Destaque, EntradaDeCena, Fundo, impacto, Logo, Mapi, MONO, mix, partida, Palavras, r2 } from '../base';
import { Chao, Onibus, Pessoa, Ponto } from '../desenhos';
import { naPalavra } from '../roteiro';
import { Camera } from '../sobreposicoes';

// ---------- Cena 1: o ônibus chega, a rampa não desce, o ônibus vai embora ----------
export const Cena1: React.FC = () => {
  const f = useCurrentFrame();
  const chegou = naPalavra(1, 'chegou');
  const rampa = naPalavra(1, 'rampa');
  const nao = naPalavra(1, 'não');
  const para = chegou + 2; // o ônibus termina de frear junto com "chegou"
  const vem = chegada(f, 0, para); // entra desacelerando desde o primeiro quadro (gancho sem tela parada)
  const vai = partida(f, nao + 40, 34);
  const x = mix(1500, 0, vem) + mix(0, 1700, vai);
  const porta = chegada(f, para + 4, 12) * (1 - chegada(f, nao + 22, 10));
  // A rampa "tenta" (um tremor curto em "rampa") e não desce.
  const tenta = f >= rampa && f <= rampa + 12 ? Math.sin(((f - rampa) / 12) * Math.PI * 4) * 2 : 0;
  const choque = impacto(f, para, -6, 0);
  return (
    <Fundo>
      <AbsoluteFill style={{ transform: `translate(${choque.x}px, ${choque.y}px)` }}>
        <svg viewBox="0 0 1920 1080" width={1920} height={1080} style={{ position: 'absolute', inset: 0 }}>
          <Chao />
          <Ponto />
          <g transform={`translate(${r2(x)} ${r2(tenta)})`}>
            <Onibus porta={porta} rampa={0} />
          </g>
        </svg>
        <div style={{ position: 'absolute', left: 380, top: 591 }}><Pessoa largura={445} /></div>
        <h1 style={{ position: 'absolute', left: 120, top: 110, margin: 0, fontSize: 120, fontWeight: 900, lineHeight: 1.02, letterSpacing: '-0.035em' }}>
          <Palavras itens={[{ texto: 'O', em: chegou - 8 }, { texto: 'ônibus', em: chegou - 4 }, { texto: 'chegou.', em: chegou }]} />
          <br />
          <Palavras itens={[{ texto: <Destaque de={nao}>A rampa, não.</Destaque>, em: rampa - 4 }]} />
        </h1>
      </AbsoluteFill>
    </Fundo>
  );
};

// ---------- Cena 2: Thor na câmera ----------
export const Cena2: React.FC = () => <Camera n={2} nomes={['thor']} />;

// ---------- Cena 3: Gabriel na câmera, depois os três cartões ----------
export const Cena3: React.FC = () => {
  const f = useCurrentFrame();
  const esp = naPalavra(3, 'espalhada');
  const dif = naPalavra(3, 'difícil');
  const gol = naPalavra(3, 'golpe');
  const corte = esp - 8;
  if (f < corte) return <Camera n={3} nomes={['gabriel']} />;
  const cartoes = [
    { texto: 'Espalhada.', obj: 'espalhada', em: esp, escuro: false },
    { texto: 'Difícil.', obj: 'dificil', em: dif, escuro: false },
    { texto: 'Com golpe.', obj: 'golpe', em: gol, escuro: true }
  ];
  return (
    <EntradaDeCena>
      <Fundo>
        <AbsoluteFill style={{ alignItems: 'center', justifyContent: 'center', flexDirection: 'row', gap: 40 }}>
          {cartoes.map((c, i) => {
            const t = chegada(f, c.em - 4, 10);
            const destaque = c.escuro ? chegada(f, c.em + 6, 10) : 0;
            return (
              <div key={c.texto} style={{
                width: 540, height: 560, padding: 48, borderRadius: 48, position: 'relative', display: 'flex', flexDirection: 'column', justifyContent: 'flex-end',
                background: c.escuro ? COR.indigo : COR.branco, color: c.escuro ? COR.seashell : COR.indigo,
                opacity: t > 0 ? 1 : 0,
                transform: `translateY(${r2(mix(700, 0, t) - 36 * destaque)}px) scale(${r2(1 + 0.06 * destaque)})`
              }}>
                <Img src={staticFile(`objetos/${c.obj}.png`)} style={{ position: 'absolute', left: 90, top: -40, width: 360, height: 360 }} />
                <div style={{ fontSize: 84, lineHeight: 1, fontWeight: 900, letterSpacing: '-0.03em' }}>
                  {c.escuro ? <>Com <Destaque de={c.em + 4}>golpe.</Destaque></> : c.texto}
                </div>
              </div>
            );
          })}
        </AbsoluteFill>
      </Fundo>
    </EntradaDeCena>
  );
};

// ---------- Cena 4: o número do Censo rola e para ----------
export const Cena4: React.FC = () => {
  const f = useCurrentFrame();
  const comeca = naPalavra(4, 'catorze');
  const para = naPalavra(4, 'milhões') + 6;
  const rolando = f >= comeca && f < para;
  // Rolo vertical de dígitos: passa rápido (com borrão) e desacelera até 14,4.
  const t = interpolate(f, [comeca, para], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
  const desacel = 1 - Math.pow(1 - t, 3);
  const passo = 260;
  const voltas = 3; // quantas vezes o rolo passa antes de parar
  const desloc = (1 - desacel) * voltas * 10 * passo;
  const velocidade = rolando ? (3 * Math.pow(1 - t, 2) * voltas * 10 * passo) / (para - comeca) : 0;
  const borrao = Math.min(18, velocidade / 40);
  const choque = impacto(f, para, 0, 7);
  const Rolo: React.FC<{ alvo: number }> = ({ alvo }) => (
    <span style={{ display: 'inline-block', height: passo, overflow: 'hidden', verticalAlign: 'top' }}>
      <span style={{ display: 'block', transform: `translateY(${r2(-((alvo * passo + desloc) % (10 * passo)))}px)`, filter: borrao > 0.5 ? `blur(${r2(borrao)}px)` : undefined }}>
        {Array.from({ length: 20 }, (_, i) => <span key={i} style={{ display: 'block', height: passo }}>{i % 10}</span>)}
      </span>
    </span>
  );
  const visivel = f >= comeca - 2;
  return (
    <EntradaDeCena>
      <Fundo>
        <AbsoluteFill style={{ alignItems: 'center', justifyContent: 'center', flexDirection: 'column', transform: `translate(${choque.x}px, ${choque.y}px)` }}>
          <div style={{ fontSize: 260, lineHeight: `${passo}px`, fontWeight: 900, letterSpacing: '-0.04em', display: 'flex', alignItems: 'baseline', opacity: visivel ? 1 : 0, fontVariantNumeric: 'tabular-nums' }}>
            <Rolo alvo={1} /><Rolo alvo={4} /><span>,</span><Rolo alvo={4} />
            <span style={{ fontSize: 150, marginLeft: 36 }}><Destaque de={para + 4}>milhões</Destaque></span>
          </div>
          <div style={{ fontSize: 56, fontWeight: 800, color: COR.grape, marginTop: 48, opacity: chegada(f, para + 2, 10), transform: `translateY(${r2(mix(30, 0, chegada(f, para + 2, 10)))}px)` }}>
            pessoas com deficiência no Brasil
          </div>
          <div style={{ fontFamily: MONO, fontSize: 34, color: COR.grape, marginTop: 24, opacity: chegada(f, para + 8, 10) }}>
            Fonte: IBGE, Censo 2022 (pessoas com 2 anos ou mais)
          </div>
        </AbsoluteFill>
      </Fundo>
    </EntradaDeCena>
  );
};

// ---------- Cena 5: Thor na câmera ----------
export const Cena5: React.FC = () => <Camera n={5} nomes={['thor']} />;

// ---------- Cena 6: círculo cobre a tela e abre no logo; Mapi sobe; quatro chips ----------
export const Cena6: React.FC = () => {
  const f = useCurrentFrame();
  const cobre = chegada(f, 0, 9); // círculo indigo cresce e cobre
  const abre = chegada(f, 11, 10); // um círculo claro abre de dentro, revelando o logo
  const mapiii = Math.min(naPalavra(6, 'Mapiii'), 15); // o logo aparece assim que o círculo abre
  const direitos = naPalavra(6, 'direitos');
  const mapi = naPalavra(6, 'Mapi', 1); // a 2ª palavra que começa com "Mapi" (a 1ª é "Mapiii")
  const choque = impacto(f, 9, 0, 6);
  const chips = ['Pode ter direito', 'Fonte oficial', 'Sem CPF', 'Emergência: 192'];
  const posChip: React.CSSProperties[] = [
    { left: 120, top: 120 }, { right: 120, top: 120 }, { left: 120, bottom: 180 }, { right: 120, bottom: 180 }
  ];
  return (
    <Fundo>
      <AbsoluteFill style={{ transform: `translate(${choque.x}px, ${choque.y}px)` }}>
        <AbsoluteFill style={{ alignItems: 'center', justifyContent: 'center' }}>
          <div style={{ position: 'absolute', width: 2400, height: 2400, borderRadius: '50%', background: COR.indigo, transform: `scale(${r2(mix(0.08, 1, cobre))})` }} />
          <div style={{ position: 'absolute', width: 2400, height: 2400, borderRadius: '50%', background: COR.seashell, transform: `scale(${r2(mix(0.05, 1, abre))})`, opacity: f >= 11 ? 1 : 0 }} />
        </AbsoluteFill>
        <div style={{ position: 'absolute', left: 160, top: 330, opacity: f >= mapiii - 4 ? 1 : 0, transform: `translateY(${r2(mix(80, 0, chegada(f, mapiii - 4, 12)))}px)` }}>
          <Logo largura={640} />
          <div style={{ fontSize: 76, fontWeight: 800, letterSpacing: '-0.02em', marginTop: 20, paddingLeft: 12, opacity: chegada(f, naPalavra(6, 'mapa') - 3, 8) }}>
            o mapa dos seus <Destaque de={direitos}>direitos</Destaque>
          </div>
        </div>
        <Mapi pose="bom" x={1240} y={160} tamanho={700} em={mapi - 2} />
        {chips.map((c, i) => {
          const em = direitos + 10 + i * 7;
          const t = chegada(f, em, 10);
          const lado = i % 2 === 0 ? -1 : 1;
          return (
            <div key={c} style={{
              position: 'absolute', ...posChip[i], padding: '14px 28px', borderRadius: 999, background: COR.branco, border: `3px solid ${COR.borda}`,
              fontSize: 34, fontWeight: 800, color: COR.indigo, opacity: t > 0 ? 1 : 0, transform: `translateX(${r2(lado * mix(300, 0, t))}px)`
            }}>{c}</div>
          );
        })}
      </AbsoluteFill>
    </Fundo>
  );
};
