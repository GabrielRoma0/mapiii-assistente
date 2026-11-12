// Cenas 19 e 20: gravações da tela do app real, dentro de uma moldura de celular (depois das cenas 7 e 13).
// As gravações vêm de scripts/gravar-app.cjs (build do app, 780 × 1688) e são cortadas em video/gravacoes/app/.
import React from 'react';
import { AbsoluteFill, OffthreadVideo, staticFile, useCurrentFrame } from 'remotion';
import { chegada, COR, Destaque, EntradaDeCena, Fundo, Leco, mix, Palavras, r2 } from '../base';
import { arquivoExiste } from '../arquivos';

// Lugar da moldura (a legenda destas cenas fica à direita dela; ver sobreposicoes.tsx).
export const CELULAR = { x: 150, y: 46, largura: 458, altura: 988 };

// `lugar`: onde fica o celular. Na cena 21 ele é maior e passa da borda de baixo do vídeo, para a resposta ficar legível.
const TelaDoApp: React.FC<{ arquivo: string; lugar?: typeof CELULAR }> = ({ arquivo, lugar = CELULAR }) => {
  const f = useCurrentFrame();
  const t = chegada(f, 0, 14);
  const borda = 14;
  return (
    <div style={{
      position: 'absolute', left: lugar.x, top: lugar.y, width: lugar.largura, height: lugar.altura, boxSizing: 'border-box',
      border: `${borda}px solid ${COR.indigo}`, borderRadius: 64, overflow: 'hidden', background: COR.seashell,
      transform: `translateY(${r2(mix(1100, 0, t))}px) rotate(${r2(mix(5, 0, t))}deg)`
    }}>
      {arquivoExiste(arquivo)
        ? <OffthreadVideo src={staticFile(arquivo)} muted style={{ width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'top' }} />
        : <AbsoluteFill style={{ alignItems: 'center', justifyContent: 'center', fontSize: 34, fontWeight: 800, color: COR.grape, textAlign: 'center', padding: 30 }}>Gravação do app (espaço reservado)</AbsoluteFill>}
    </div>
  );
};

const Etiqueta: React.FC<{ x?: number }> = ({ x = 720 }) => {
  const f = useCurrentFrame();
  const t = chegada(f, 6, 10);
  return (
    <span style={{ position: 'absolute', left: x, top: 110, padding: '14px 28px', borderRadius: 999, background: COR.almond, border: `3px solid ${COR.indigo}`, fontSize: 32, fontWeight: 900, letterSpacing: '0.04em', transform: `translateX(${r2(mix(500, 0, t))}px)`, opacity: t > 0 ? 1 : 0 }}>
      GRAVAÇÃO DO APP
    </span>
  );
};

const TITULO: React.CSSProperties = { position: 'absolute', left: 720, top: 220, margin: 0, width: 1080, fontSize: 104, lineHeight: 1.04, fontWeight: 900, letterSpacing: '-0.035em' };

// ---------- Cena 19: a triagem de verdade chega no "Pode ter direito" ----------
export const Cena19: React.FC = () => {
  const cartao = 128; // quadro em que a Rota aparece na gravação
  return (
    <EntradaDeCena>
      <Fundo>
        <TelaDoApp arquivo="app/triagem.mp4" />
        <Etiqueta />
        <h1 style={TITULO}>
          <Palavras itens={[{ texto: 'Poucos', em: 8 }, { texto: 'toques.', em: 12 }]} />
          <br />
          <Palavras itens={[{ texto: <Destaque de={cartao + 14}>Pode ter direito,</Destaque>, em: cartao }, { texto: 'com', em: cartao + 10 }, { texto: 'fonte.', em: cartao + 14 }]} />
        </h1>
        <Leco pose="verificado" x={1480} y={450} tamanho={380} em={cartao + 6} />
      </Fundo>
    </EntradaDeCena>
  );
};

// ---------- Cena 20: "Conferir se é oficial" de verdade, com um link inventado que o app marca como suspeito ----------
export const Cena20: React.FC = () => {
  const resultado = 76; // quadro em que o resultado aparece na gravação
  return (
    <EntradaDeCena>
      <Fundo>
        <TelaDoApp arquivo="app/conferir.mp4" />
        <Etiqueta />
        <h1 style={TITULO}>
          <Palavras itens={[{ texto: 'Link', em: 8 }, { texto: 'estranho?', em: 12 }]} />
          <br />
          <Palavras itens={[{ texto: <Destaque de={resultado + 12}>Suspeito.</Destaque>, em: resultado }, { texto: 'Não', em: resultado + 14 }, { texto: 'pague.', em: resultado + 18 }]} />
        </h1>
        <Leco pose="atencao" x={1480} y={450} tamanho={380} em={resultado + 4} />
      </Fundo>
    </EntradaDeCena>
  );
};

// ---------- Cena 21: o Leco como assistente. A pessoa escreve a pergunta e ele responde com passos e fonte ----------
// A pergunta é uma das que o próprio app sugere. O celular aparece maior (só a parte de cima da tela), para dar para ler.
export const CELULAR_GRANDE = { x: 110, y: 130, largura: 700, altura: 1515 };
export const Cena21: React.FC = () => {
  const resposta = 62; // quadro em que a resposta aparece na gravação
  return (
    <EntradaDeCena>
      <Fundo>
        <TelaDoApp arquivo="app/pergunta.mp4" lugar={CELULAR_GRANDE} />
        <Etiqueta x={900} />
        <h1 style={{ ...TITULO, left: 900, width: 940, fontSize: 96 }}>
          <Palavras itens={[{ texto: 'Pergunte', em: 8 }, { texto: 'do', em: 12 }, { texto: 'seu', em: 15 }, { texto: 'jeito.', em: 18 }]} />
          <br />
          <Palavras itens={[{ texto: 'O', em: resposta }, { texto: 'Leco', em: resposta + 4 }, { texto: <Destaque de={resposta + 18}>responde.</Destaque>, em: resposta + 8 }]} />
        </h1>
        <Leco pose="bom" x={1500} y={470} tamanho={360} em={resposta + 6} />
      </Fundo>
    </EntradaDeCena>
  );
};
