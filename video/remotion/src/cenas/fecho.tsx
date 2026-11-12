// Cenas 12 a 18: números, tópicos, escala, ODS e fecho.
import React from 'react';
import { AbsoluteFill, Img, interpolate, staticFile, useCurrentFrame } from 'remotion';
import { AvisoPrototipo, chegada, COR, Destaque, EntradaDeCena, Fundo, Icone, impacto, Logo, Leco, mix, Palavras, partida, r2 } from '../base';
import { Chao, Onibus, Pessoa, Ponto } from '../desenhos';
import { naPalavra, temposDasPalavras } from '../roteiro';
import { Camera, LinhaDeRota } from '../sobreposicoes';

// Número que rola (com borrão vertical) e para no valor em `para`.
const NumeroRolando: React.FC<{ valor: number; de: number; para: number; tamanho: number }> = ({ valor, de, para, tamanho }) => {
  const f = useCurrentFrame();
  const t = interpolate(f, [de, para], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
  const e = 1 - Math.pow(1 - t, 3);
  const mostrado = Math.round(valor * e);
  const borrao = f >= de && f < para ? Math.min(10, 14 * Math.pow(1 - t, 2)) : 0;
  return (
    <span style={{ display: 'inline-block', fontVariantNumeric: 'tabular-nums', filter: borrao > 0.5 ? `blur(0px) drop-shadow(0 ${r2(borrao)}px 0 rgba(34,34,59,0.25))` : undefined, transform: `translateY(${r2(borrao * 1.5)}px)`, fontSize: tamanho, opacity: f >= de ? 1 : 0 }}>
      {mostrado}
    </span>
  );
};

// ---------- Cena 12: 12 de 12 e 100 ----------
export const Cena12: React.FC = () => {
  const f = useCurrentFrame();
  const doze = 2; // o 12 começa a rolar logo no início da cena
  const pare12 = naPalavra(12, 'doze.', 1) + 2;
  const maxima = naPalavra(12, 'máxima');
  const pare100 = naPalavra(12, 'acessibilidade') + 4;
  const c1 = impacto(f, pare12, 0, 6);
  const c2 = impacto(f, pare100, 0, 6);
  const choque = { x: c1.x + c2.x, y: c1.y + c2.y };
  return (
    <EntradaDeCena>
      <Fundo>
        <LinhaDeRota n={12} />
        <AbsoluteFill style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', transform: `translate(${choque.x}px, ${choque.y}px)` }}>
          <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 20 }}>
            <div style={{ lineHeight: 0.9, fontWeight: 900, letterSpacing: '-0.05em', whiteSpace: 'nowrap' }}>
              <NumeroRolando valor={12} de={doze} para={pare12} tamanho={380} />
              <span style={{ fontSize: 150, letterSpacing: '-0.02em', opacity: chegada(f, pare12, 8) }}> de 12</span>
            </div>
            <div style={{ fontSize: 64, fontWeight: 800, color: COR.grape, opacity: chegada(f, pare12 + 4, 10) }}>recusas <span style={{ color: COR.indigo }}><Destaque de={pare12 + 8}>corretas</Destaque></span></div>
          </div>
          <div style={{ width: 6, height: 520, borderRadius: 3, background: COR.borda, transform: `scaleY(${r2(chegada(f, 2, 14))})` }} />
          <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 20 }}>
            <div style={{ lineHeight: 0.9, fontWeight: 900, letterSpacing: '-0.05em' }}>
              <NumeroRolando valor={100} de={maxima - 6} para={pare100} tamanho={380} />
            </div>
            <div style={{ fontSize: 64, fontWeight: 800, color: COR.grape, opacity: chegada(f, pare100 + 2, 10) }}>Acessibilidade</div>
          </div>
        </AbsoluteFill>
      </Fundo>
    </EntradaDeCena>
  );
};

// ---------- Cena 13: os seis tópicos ----------
export const Cena13: React.FC = () => {
  const f = useCurrentFrame();
  const ainda = naPalavra(13, 'ainda');
  const internet = naPalavra(13, 'internet,');
  const toque = naPalavra(13, 'toque,');
  const voz = naPalavra(13, 'voz');
  const topicos: { texto: string; icone?: string; em: number }[] = [
    { texto: 'Funciona sem internet', icone: 'download', em: internet - 6 },
    { texto: 'Uso com um toque', icone: 'ok', em: toque - 6 },
    { texto: 'Letra A, A+ e A++', em: toque + 4 },
    { texto: 'Ouve a resposta em voz alta', icone: 'conversa', em: voz - 6 },
    { texto: 'Confere se o link é oficial', icone: 'escudo_check', em: voz + 4 },
    { texto: 'Sem login, sem cadastro', icone: 'usuario', em: voz + 12 }
  ];
  return (
    <EntradaDeCena>
      <Fundo>
        <LinhaDeRota n={13} />
        <h1 style={{ position: 'absolute', left: 120, top: 96, margin: 0, fontSize: 140, fontWeight: 900, letterSpacing: '-0.035em' }}>
          <Palavras itens={[{ texto: 'E', em: 2 }, { texto: <><Destaque de={ainda + 2}>ainda</Destaque>:</>, em: Math.min(ainda - 2, 6) }]} />
        </h1>
        <div style={{ position: 'absolute', left: 120, top: 330, width: 1680, display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 32 }}>
          {topicos.map((t) => {
            const k = chegada(f, t.em, 10);
            return (
              <div key={t.texto} style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', gap: 32, padding: '44px 40px', minHeight: 270, background: COR.branco, borderRadius: 48, opacity: k > 0 ? 1 : 0, transform: `translateY(${r2(mix(-80, 0, k))}px)` }}>
                <span style={{ width: 124, height: 124, borderRadius: 36, background: COR.lilac100, display: 'grid', placeItems: 'center', flex: 'none' }}>
                  {t.icone ? <Icone nome={t.icone} tamanho={72} cor={COR.indigo} /> : (
                    <span style={{ width: 60, height: 60, border: `6px solid ${COR.indigo}`, borderRadius: 12, display: 'grid', placeItems: 'center', fontWeight: 900, fontSize: 27, lineHeight: 1 }}>A+</span>
                  )}
                </span>
                <span style={{ fontSize: 50, lineHeight: 1.12, fontWeight: 900, letterSpacing: '-0.02em' }}>{t.texto}</span>
              </div>
            );
          })}
        </div>
      </Fundo>
    </EntradaDeCena>
  );
};

// ---------- Cena 14: Gabriel na câmera ----------
export const Cena14: React.FC = () => <Camera n={14} nomes={['gabriel']} foco="48% 32%" zoom={[{ em: 0, de: 1, ate: 1.05 }, { em: naPalavra(14, 'A') - 3, de: 1.14, ate: 1.18 }]} />;

// ---------- Cena 15: mapa-múndi; a base troca e os pinos acendem ----------
// mundo.svg: 1920 × 960, equiretangular (x = (lon+180)/360·1920; y = (84−lat)/144·960).
const geo = (lon: number, lat: number) => ({ x: ((lon + 180) / 360) * 1920, y: ((84 - lat) / 144) * 960 });
const MAPA = { x: 470, y: 330, escala: 0.72 };
const noMapa = (lon: number, lat: number) => { const p = geo(lon, lat); return { x: MAPA.x + p.x * MAPA.escala, y: MAPA.y + p.y * MAPA.escala }; };

const Pino: React.FC<{ x: number; y: number; em: number; tam: number; cor?: string }> = ({ x, y, em, tam }) => {
  const f = useCurrentFrame();
  const t = chegada(f, em, 10);
  return (
    <Img src={staticFile('logo/mark.svg')} style={{ position: 'absolute', left: x - tam / 2, top: y - tam, width: tam, height: tam, opacity: t > 0 ? 1 : 0, transform: `translateY(${r2(mix(-60, 0, t))}px)` }} />
  );
};

// Quando cada pino entra na cena 15 (o som de "pop" usa os mesmos tempos, em src/Pitch.tsx).
export const CHEGADA_SP = 70; // a linha de rota chega ao pino de São Paulo
export const POUSO = 4; // quadros até o pino pousar (a queda desacelera e quase todo o caminho é nos primeiros quadros)
export function pinosDaCena15() {
  const cidade = naPalavra(15, 'cidade.');
  const estado = naPalavra(15, 'estado.');
  const pais = naPalavra(15, 'país.');
  return [
    { ...noMapa(-43.94, -19.92), em: cidade - 4 }, // outra cidade (Belo Horizonte)
    { ...noMapa(-34.88, -8.05), em: estado - 4 }, // outro estado (Recife)
    { ...noMapa(-9.14, 38.72), em: pais - 4 }, // outro país (Lisboa)
    { ...noMapa(-99.13, 19.43), em: pais + 4 } // outro país (Cidade do México)
  ];
}

export const Cena15: React.FC = () => {
  const f = useCurrentFrame();
  const troque = naPalavra(15, 'Troque');
  const cidade = naPalavra(15, 'cidade.');
  const estado = naPalavra(15, 'estado.');
  const pais = naPalavra(15, 'país.');
  const sp = noMapa(-46.63, -23.55);
  const chega = CHEGADA_SP;
  const acende = chegada(f, chega, 10);
  const pulso = f >= chega ? (Math.sin(((f - chega) / 30) * Math.PI * 2 * 0.8) + 1) / 2 : 0;
  const outros = pinosDaCena15();
  return (
    <EntradaDeCena>
      <Fundo>
        <Img src={staticFile('mapa/mundo.svg')} style={{ position: 'absolute', left: MAPA.x, top: MAPA.y, width: 1920 * MAPA.escala, height: 960 * MAPA.escala, opacity: 0.55 }} />
        <svg width={1920} height={1080} style={{ position: 'absolute', inset: 0 }}>
          <circle cx={sp.x} cy={sp.y} r={r2(40 + 34 * pulso)} fill={COR.almond} opacity={r2(0.35 * acende)} />
          <circle cx={sp.x} cy={sp.y} r={30} fill={COR.almond} opacity={r2(0.6 * acende)} />
        </svg>
        <LinhaDeRota n={15} chega={chega} />
        {outros.map((p, i) => <Pino key={i} x={p.x} y={p.y} em={p.em} tam={44} />)}
        <Pino x={sp.x} y={sp.y + 8} em={chega - 2} tam={86} />
        <h1 style={{ position: 'absolute', left: 120, top: 84, margin: 0, width: 1240, fontSize: 76, lineHeight: 1.08, fontWeight: 900, letterSpacing: '-0.035em' }}>
          <Palavras itens={[{ texto: 'Troque', em: troque - 2 }, { texto: 'a', em: troque + 2 }, { texto: 'base.', em: troque + 6 }, { texto: 'Outra', em: cidade - 6 }, { texto: 'cidade.', em: cidade - 2 }]} />
          <br />
          <Palavras itens={[{ texto: 'Outro', em: estado - 6 }, { texto: 'estado.', em: estado - 2 }, { texto: <Destaque de={pais + 4}>Outro país.</Destaque>, em: pais - 6 }]} />
        </h1>
        <span style={{ position: 'absolute', right: 120, top: 96, padding: '14px 28px', borderRadius: 999, background: COR.almond, border: `3px solid ${COR.indigo}`, fontSize: 32, fontWeight: 900, letterSpacing: '0.04em' }}>VISÃO DE FUTURO</span>
      </Fundo>
    </EntradaDeCena>
  );
};

// ---------- Cena 16: ODS 10 e 11 ----------
export const Cena16: React.FC = () => {
  const f = useCurrentFrame();
  const desig = naPalavra(16, 'desigualdade.');
  const cidades = naPalavra(16, 'Cidades');
  const itens = [
    { img: 'ods/ods-10.png', x: 400, rotulo: <>Menos <Destaque de={desig + 4}>desigualdade</Destaque></>, em: 2 },
    { img: 'ods/ods-11.png', x: 1100, rotulo: <>Cidades para <Destaque de={cidades + 12}>todo mundo</Destaque></>, em: cidades - 4 }
  ];
  return (
    <EntradaDeCena>
      <Fundo>
        {itens.map((it) => {
          const t = chegada(f, it.em, 12);
          return (
            <div key={it.img} style={{ position: 'absolute', left: it.x, top: 200, width: 420, display: 'flex', flexDirection: 'column', alignItems: 'center', opacity: t > 0 ? 1 : 0, transform: `translateY(${r2(mix(500, 0, t))}px)` }}>
              <Img src={staticFile(it.img)} style={{ width: 420, height: 420, borderRadius: 8 }} />
              <div style={{ marginTop: 36, fontSize: 48, fontWeight: 900, whiteSpace: 'nowrap', textAlign: 'center' }}>{it.rotulo}</div>
            </div>
          );
        })}
      </Fundo>
    </EntradaDeCena>
  );
};

// ---------- Cena 17: Thor e Gabriel na câmera; corta para o slogan ----------
export const Cena17: React.FC = () => {
  const f = useCurrentFrame();
  const agora = naPalavra(17, 'Agora,');
  // A dupla fala "Você pode ter direito." na câmera; o corte para o slogan é em "Agora,".
  const corte = agora - 4;
  if (f < corte) return <Camera n={17} nomes={['gabriel', 'thor']} foco="52% 40%" zoom={[{ em: 0, de: 1, ate: 1.08 }]} />;
  const g = f - corte;
  return (
    <EntradaDeCena>
      <Fundo>
        <div style={{ position: 'absolute', left: 150, top: 180 }}>
          <Logo largura={470} />
          <div style={{ fontSize: 80, lineHeight: 1.1, fontWeight: 900, letterSpacing: '-0.025em', marginTop: 44 }}>
            <Palavras itens={[{ texto: 'Você', em: corte }, { texto: 'pode', em: corte + 2 }, { texto: 'ter', em: corte + 4 }, { texto: 'direito.', em: corte + 6 }]} />
            <br />
            <span style={{ opacity: chegada(f, agora + 6, 10), display: 'inline-block', transform: `translateY(${r2(mix(40, 0, chegada(f, agora + 6, 10)))}px)` }}>
              <Destaque de={agora + 22}>Agora, você sabe onde ir.</Destaque>
            </span>
          </div>
        </div>
        <Leco pose="comemorando" x={1290} y={160} tamanho={600} em={corte + 2} />
        <AvisoPrototipo style={{ left: 150, bottom: 150, opacity: chegada(f, corte + 10, 10) }} />
        {g < 0 && null}
      </Fundo>
    </EntradaDeCena>
  );
};

// ---------- Cena 18: o mesmo ponto; o ônibus para, a rampa desce, a pessoa embarca ----------
export const Cena18: React.FC = () => {
  const f = useCurrentFrame();
  const para = 14;
  const vem = chegada(f, 0, para);
  const porta = chegada(f, para + 2, 10);
  const rampa = chegada(f, para + 10, 22);
  const toca = para + 32;
  const sobe = chegada(f, toca + 4, 30);
  const choque = { x: impacto(f, para, -5, 0).x + impacto(f, toca, 0, 5).x, y: impacto(f, toca, 0, 5).y };
  const logo = chegada(f, 2, 14);
  // A pessoa vai pelo chão até o pé da rampa e sobe até a porta (coordenadas do quadro 1, antes da escala 0,9).
  // Ponto de apoio da roda no desenho da pessoa: (148, 345) para a largura 445.
  const pe = 0.42; // parte do caminho que é no chão
  const rodaX = sobe < pe ? mix(528, 640, sobe / pe) : mix(640, 1010, (sobe - pe) / (1 - pe));
  const rodaY = sobe < pe ? 940 : mix(940, 917, (sobe - pe) / (1 - pe));
  const px = rodaX - 148;
  const py = rodaY - 345;
  const some = partida(f, toca + 34, 6);
  return (
    <Fundo>
      <AbsoluteFill style={{ transform: `translate(${choque.x}px, ${choque.y}px)` }}>
        <div style={{ position: 'absolute', left: 0, right: 0, top: 40, display: 'flex', flexDirection: 'column', alignItems: 'center', opacity: logo, transform: `translateY(${r2(mix(-60, 0, logo))}px)` }}>
          <Logo largura={500} />
          <div style={{ fontSize: 66, fontWeight: 800, letterSpacing: '-0.02em', marginTop: 6 }}>o mapa dos seus <Destaque de={30}>direitos</Destaque></div>
        </div>
        <svg viewBox="0 0 1920 1080" width={1920} height={1080} style={{ position: 'absolute', inset: 0 }}><Chao y={990} /></svg>
        <div style={{ position: 'absolute', inset: 0, transform: 'translate(120px, 144px) scale(0.9)', transformOrigin: '0 0' }}>
          <svg viewBox="0 0 1920 1080" width={1920} height={1080} style={{ position: 'absolute', inset: 0, overflow: 'visible' }}>
            <Ponto />
            <g transform={`translate(${r2(mix(900, 0, vem))} 0)`}>
              <Onibus porta={porta} rampa={rampa} />
            </g>
          </svg>
          <div style={{ position: 'absolute', left: px, top: py, opacity: 1 - some }}><Pessoa largura={445} /></div>
        </div>
        {/* O Leco é quem fala a frase final: sobe, acena a cada palavra e a legenda é o balão dele (sobreposicoes.tsx). */}
        <Leco pose="bom" x={1380} y={128} tamanho={400} em={0} fala={temposDasPalavras(18).map((p) => p.de)} sombra={false} />
        <AvisoPrototipo style={{ left: 0, right: 0, bottom: 22, textAlign: 'center' }} />
      </AbsoluteFill>
    </Fundo>
  );
};
