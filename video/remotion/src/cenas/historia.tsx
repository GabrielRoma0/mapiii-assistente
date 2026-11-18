// Cena 27: a mini-história (ideia do Gabriel, 18/11). Carla e Letícia têm consulta às 9h.
// A Letícia não sabe quando passa o ônibus com rampa e perde a consulta; a Carla recebe o aviso do Mapiii e chega a tempo.
// Ilustrações do Claude Design (video/objetos-3d/). Tudo preso às palavras da narração.
import React from 'react';
import { AbsoluteFill, Img, staticFile, useCurrentFrame } from 'remotion';
import { chegada, COR, Destaque, EntradaDeCena, Fundo, Icone, mix, partida, Palavras, r2, VIVO } from '../base';
import { naPalavra } from '../roteiro';

const N = 27;
const w = (p: string, k = 0) => naPalavra(N, p, k);

const Figura: React.FC<{ nome: string; x: number; y: number; tam: number; em: number; de?: 'baixo' | 'esq' | 'dir'; ate?: number; espelho?: boolean }> = ({ nome, x, y, tam, em, de = 'baixo', ate, espelho }) => {
  const f = useCurrentFrame();
  if (f < em - 1 || (ate !== undefined && f > ate + 8)) return null;
  const t = chegada(f, em, 12);
  const s = ate !== undefined ? partida(f, ate, 8) : 0;
  const dx = de === 'esq' ? mix(-700, 0, t) : de === 'dir' ? mix(700, 0, t) : 0;
  const dy = de === 'baixo' ? mix(260, 0, t) : 0;
  const flut = Math.sin(((f - em) / 30) * Math.PI * 2 * 0.35) * 5 * t;
  return (
    <Img src={staticFile(`objetos/${nome}.png`)} style={{
      position: 'absolute', left: x, top: y, width: tam, height: tam,
      opacity: 1 - s, transform: `translate(${r2(dx)}px, ${r2(dy + flut + s * 120)}px)${espelho ? ' scaleX(-1)' : ''}`
    }} />
  );
};

const Chip: React.FC<{ texto: string; x: number; y: number; em: number; ate?: number; escuro?: boolean; grande?: boolean }> = ({ texto, x, y, em, ate, escuro, grande }) => {
  const f = useCurrentFrame();
  if (f < em - 1 || (ate !== undefined && f > ate + 8)) return null;
  const t = chegada(f, em, 10);
  const s = ate !== undefined ? partida(f, ate, 8) : 0;
  return (
    <span style={{
      position: 'absolute', left: x, top: y, padding: grande ? '18px 36px' : '12px 28px', borderRadius: 999, whiteSpace: 'nowrap',
      background: escuro ? COR.indigo : COR.branco, color: escuro ? COR.seashell : COR.indigo, border: `3px solid ${COR.indigo}`,
      fontSize: grande ? 52 : 40, fontWeight: 900, opacity: 1 - s, transform: `translateY(${r2(mix(-60, 0, t))}px)`
    }}>{texto}</span>
  );
};

// Hora que corre no relógio da Letícia.
const Hora: React.FC<{ marcas: { em: number; hora: string }[]; x: number; y: number; ate: number }> = ({ marcas, x, y, ate }) => {
  const f = useCurrentFrame();
  const atual = [...marcas].reverse().find((m) => f >= m.em);
  if (!atual || f > ate + 8) return null;
  const pulo = chegada(f, atual.em, 8);
  return (
    <span style={{ position: 'absolute', left: x, top: y, fontSize: 72, fontWeight: 900, color: COR.coral700, transform: `scale(${r2(mix(1.25, 1, pulo))})`, opacity: 1 - partida(f, ate, 8) }}>{atual.hora}</span>
  );
};

export const Cena27: React.FC = () => {
  const f = useCurrentFrame();
  // marcas da fala
  const carla0 = w('Carla.');
  const leticia0 = w('Letícia.');
  const consulta = w('consulta');
  const fase2 = w('Letícia', 1) - 6;
  const passa1 = w('Passa', 1);
  const passa2 = w('Passa', 2);
  const vinte = w('vinte,');
  const depois = w('depois.');
  const fase3 = w('Carla', 1) - 6;
  const aviso = w('aviso:');
  const sai = w('sai');
  const clinica = w('clínica.');
  const fase4 = w('Mesma') - 4;

  const fase = f < fase2 ? 1 : f < fase3 ? 2 : f < fase4 ? 3 : 4;
  const fundo = fase === 2 ? COR.chao : fase === 3 ? VIVO.fAgua : COR.seashell;
  const xBus = (de: number) => mix(-900, 2200, Math.min(1, Math.max(0, (f - de) / 55)));
  const chega = chegada(f, sai, 26);

  return (
    <EntradaDeCena>
      <Fundo style={{ background: fundo }}>
        {/* 1. apresentação */}
        {fase === 1 && (
          <AbsoluteFill>
            <Figura nome="carla-celular" x={220} y={240} tam={620} em={carla0 - 6} de="esq" />
            <Chip texto="Carla" x={420} y={180} em={carla0} />
            <Figura nome="leticia-esperando" x={1080} y={240} tam={620} em={leticia0 - 6} de="dir" />
            <Chip texto="Letícia" x={1260} y={180} em={leticia0} />
            <div style={{ position: 'absolute', left: 760, top: 470, display: 'flex', alignItems: 'center', gap: 16, padding: '20px 32px', borderRadius: 32, background: COR.branco, border: `3px solid ${COR.indigo}`, fontSize: 48, fontWeight: 900, opacity: f >= consulta - 4 ? 1 : 0, transform: `scale(${r2(mix(1.3, 1, chegada(f, consulta - 4, 10)))})` }}>
              <Icone nome="calendario" tamanho={52} cor={COR.indigo} />Consulta · 9:00
            </div>
          </AbsoluteFill>
        )}

        {/* 2. a Letícia: sem saber quando passa o ônibus com rampa */}
        {fase === 2 && (
          <AbsoluteFill>
            <Chip texto="sem Mapiii" x={80} y={70} em={fase2} />
            <div style={{ position: 'absolute', left: 0, top: 860, width: 1920, height: 220, background: COR.borda }} />
            {/* os ônibus passam atrás da Letícia */}
            <Img src={staticFile('objetos/onibus-sem-rampa.png')} style={{ position: 'absolute', top: 250, width: 760, height: 760, left: xBus(passa1), opacity: f >= passa1 && f < passa1 + 56 ? 1 : 0 }} />
            <Img src={staticFile('objetos/onibus-lotado.png')} style={{ position: 'absolute', top: 250, width: 760, height: 760, left: xBus(passa2), opacity: f >= passa2 && f < passa2 + 56 ? 1 : 0 }} />
            <Figura nome="leticia-esperando" x={260} y={330} tam={600} em={fase2} ate={vinte - 2} />
            <Figura nome="leticia-preocupada" x={260} y={330} tam={600} em={vinte - 2} ate={depois - 4} de="esq" />
            <Figura nome="leticia-triste" x={260} y={330} tam={600} em={depois - 4} de="esq" />
            <Chip texto="sem rampa" x={860} y={330} em={passa1 + 18} ate={passa2 - 4} grande />
            <Chip texto="lotado" x={860} y={330} em={passa2 + 18} ate={vinte - 4} grande />
            <Figura nome="relogio" x={1380} y={110} tam={220} em={fase2 + 4} ate={depois - 6} />
            <Hora marcas={[{ em: fase2 + 4, hora: '8:10' }, { em: passa2, hora: '8:40' }, { em: vinte - 4, hora: '9:20' }]} x={1620} y={170} ate={depois - 6} />
            <Figura nome="clinica-fechada" x={1180} y={250} tam={620} em={depois - 2} de="dir" />
            <Chip texto="Consulta perdida" x={1240} y={170} em={depois + 4} escuro grande />
          </AbsoluteFill>
        )}

        {/* 3. a Carla: espera em casa, recebe o aviso e chega a tempo */}
        {fase === 3 && (
          <AbsoluteFill>
            <Chip texto="com Mapiii" x={80} y={70} em={fase3} escuro />
            {f < sai + 6 && (
              <>
                <Figura nome="casa" x={120} y={160} tam={760} em={fase3} ate={sai - 4} />
                <Figura nome="carla-celular" x={760} y={330} tam={600} em={fase3 + 4} ate={sai - 4} />
                <div style={{ position: 'absolute', left: 1240, top: 230, width: 600, display: 'flex', alignItems: 'center', gap: 22, padding: '24px 30px', borderRadius: 36, background: COR.branco, border: `3px solid ${COR.indigo}`, fontSize: 40, fontWeight: 900, lineHeight: 1.15, opacity: f >= aviso - 2 ? 1 : 0, transform: `translateY(${r2(mix(-260, 0, chegada(f, aviso - 2, 12)))}px)` }}>
                  <span style={{ width: 92, height: 92, flex: 'none', borderRadius: 26, background: COR.indigo, display: 'grid', placeItems: 'center' }}><Icone nome="local" tamanho={54} cor={COR.seashell} /></span>
                  Ônibus acessível chegando · 8 min
                </div>
              </>
            )}
            {f >= sai - 4 && f < clinica - 2 && (
              <>
                <div style={{ position: 'absolute', left: 0, top: 860, width: 1920, height: 220, background: COR.borda }} />
                <Img src={staticFile('objetos/onibus.png')} style={{ position: 'absolute', top: 340, width: 800, height: 800, left: mix(1950, 900, chega) }} />
                <Figura nome="carla-andando" x={300} y={330} tam={600} em={sai - 2} de="esq" />
              </>
            )}
            {f >= clinica - 4 && (
              <>
                <Figura nome="clinica-aberta" x={1060} y={220} tam={680} em={clinica - 4} de="dir" />
                <Figura nome="carla-feliz" x={360} y={330} tam={600} em={clinica - 4} de="esq" />
                <Chip texto="8:55 ✓ chegou a tempo" x={1060} y={150} em={clinica + 2} escuro grande />
              </>
            )}
          </AbsoluteFill>
        )}

        {/* 4. mesma cidade, mesmo ônibus, dias diferentes */}
        {fase === 4 && (
          <AbsoluteFill>
            <div style={{ position: 'absolute', left: 0, top: 0, width: 960, height: 1080, background: COR.chao }} />
            <div style={{ position: 'absolute', left: 960, top: 0, width: 960, height: 1080, background: VIVO.fAgua }} />
            <Figura nome="clinica-fechada" x={420} y={380} tam={480} em={fase4} />
            <Figura nome="leticia-triste" x={60} y={430} tam={460} em={fase4 + 2} />
            <Figura nome="clinica-aberta" x={1380} y={380} tam={480} em={fase4} />
            <Figura nome="carla-feliz" x={1020} y={430} tam={460} em={fase4 + 2} />
            <h2 style={{ position: 'absolute', left: 0, width: 1920, top: 110, margin: 0, textAlign: 'center', fontSize: 88, fontWeight: 900, letterSpacing: '-0.03em' }}>
              <Palavras itens={[{ texto: 'Mesma cidade.', em: w('Mesma') - 2 }, { texto: 'Mesmo ônibus.', em: w('Mesmo') - 2 }]} />
              <br />
              <Palavras itens={[{ texto: <Destaque de={w('diferentes.') + 4}>Dias diferentes.</Destaque>, em: w('Dias') - 2 }]} />
            </h2>
          </AbsoluteFill>
        )}
      </Fundo>
    </EntradaDeCena>
  );
};
