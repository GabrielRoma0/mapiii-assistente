// Cenas 19 e 20: gravações da tela do app real, dentro de uma moldura de celular.
// As gravações vêm de scripts/gravar-app.cjs (build do app, 780 × 1688) e são cortadas em video/gravacoes/app/.
import React from 'react';
import { AbsoluteFill, OffthreadVideo, staticFile, useCurrentFrame } from 'remotion';
import { chegada, COR, Destaque, EntradaDeCena, Fundo, Leco, mix, Palavras, r2 } from '../base';
import { arquivoExiste } from '../arquivos';

// Lugar da moldura (a legenda destas cenas fica à direita dela; ver sobreposicoes.tsx).
export const CELULAR = { x: 150, y: 46, largura: 458, altura: 988 };

const TelaDoApp: React.FC<{ arquivo: string }> = ({ arquivo }) => {
  const f = useCurrentFrame();
  const t = chegada(f, 0, 14);
  const borda = 14;
  return (
    <div style={{
      position: 'absolute', left: CELULAR.x, top: CELULAR.y, width: CELULAR.largura, height: CELULAR.altura, boxSizing: 'border-box',
      border: `${borda}px solid ${COR.indigo}`, borderRadius: 64, overflow: 'hidden', background: COR.seashell,
      transform: `translateY(${r2(mix(1100, 0, t))}px) rotate(${r2(mix(5, 0, t))}deg)`
    }}>
      {arquivoExiste(arquivo)
        ? <OffthreadVideo src={staticFile(arquivo)} muted style={{ width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'top' }} />
        : <AbsoluteFill style={{ alignItems: 'center', justifyContent: 'center', fontSize: 34, fontWeight: 800, color: COR.grape, textAlign: 'center', padding: 30 }}>Gravação do app (espaço reservado)</AbsoluteFill>}
    </div>
  );
};

const Etiqueta: React.FC = () => {
  const f = useCurrentFrame();
  const t = chegada(f, 6, 10);
  return (
    <span style={{ position: 'absolute', left: 720, top: 110, padding: '14px 28px', borderRadius: 999, background: COR.almond, border: `3px solid ${COR.indigo}`, fontSize: 32, fontWeight: 900, letterSpacing: '0.04em', transform: `translateX(${r2(mix(500, 0, t))}px)`, opacity: t > 0 ? 1 : 0 }}>
      GRAVAÇÃO DO APP
    </span>
  );
};

const TITULO: React.CSSProperties = { position: 'absolute', left: 720, top: 220, margin: 0, width: 1080, fontSize: 104, lineHeight: 1.04, fontWeight: 900, letterSpacing: '-0.035em' };

// ---------- Cena 19: a triagem de verdade chega no "Pode ter direito" ----------
export const Cena19: React.FC = () => {
  const cartao = 150; // quadro em que a Rota aparece na gravação
  return (
    <EntradaDeCena>
      <Fundo>
        <TelaDoApp arquivo="app/triagem.mp4" />
        <Etiqueta />
        <h1 style={TITULO}>
          <Palavras itens={[{ texto: 'Poucos', em: 12 }, { texto: 'toques.', em: 17 }]} />
          <br />
          <Palavras itens={[{ texto: <Destaque de={cartao + 14}>Pode ter direito,</Destaque>, em: cartao }, { texto: 'com', em: cartao + 22 }, { texto: 'fonte.', em: cartao + 27 }]} />
        </h1>
        <Leco pose="verificado" x={1480} y={450} tamanho={380} em={cartao + 6} />
      </Fundo>
    </EntradaDeCena>
  );
};

// ---------- Cena 20: a tela "Mostre ao motorista" de verdade, com o QR ----------
export const Cena20: React.FC = () => {
  const qr = 112; // quadro em que a tela rola até o código
  return (
    <EntradaDeCena>
      <Fundo>
        <TelaDoApp arquivo="app/motorista.mp4" />
        <Etiqueta />
        <h1 style={TITULO}>
          <Palavras itens={[{ texto: 'Letra', em: 34 }, { texto: 'grande.', em: 39 }]} />
          <br />
          <Palavras itens={[{ texto: 'O', em: qr }, { texto: 'código', em: qr + 5 }, { texto: 'abre', em: qr + 10 }, { texto: 'a', em: qr + 15 }, { texto: <Destaque de={qr + 30}>lei.</Destaque>, em: qr + 20 }]} />
        </h1>
      </Fundo>
    </EntradaDeCena>
  );
};
