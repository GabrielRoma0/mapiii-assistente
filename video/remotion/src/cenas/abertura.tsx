// Cenas 1 a 6: gancho, problema, número, virada e logo.
import React from 'react';
import { AbsoluteFill, Img, interpolate, staticFile, useCurrentFrame } from 'remotion';
import { chegada, COR, Destaque, EntradaDeCena, Fundo, impacto, Logo, Leco, MONO, mix, partida, Palavras, r2, useTema, VIVO } from '../base';
import { Chao, Onibus, Pessoa, Ponto } from '../desenhos';
import { naPalavra, quandoFala, temposDasPalavras } from '../roteiro';
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
// Zoom: abre devagar; aproxima em "E quem cuida" e de novo nas perguntas.
export const Cena2: React.FC = () => (
  <Camera n={2} nomes={['thor']} foco="52% 34%"
    zoom={[{ em: 0, de: 1, ate: 1.05 }, { em: naPalavra(2, 'E') - 3, de: 1.14, ate: 1.18 }, { em: naPalavra(2, 'o', 0) - 3, de: 1.27, ate: 1.32 }]} />
);

// ---------- Cena 3: Gabriel na câmera, depois os três cartões ----------
export const Cena3: React.FC = () => {
  const f = useCurrentFrame();
  const esp = naPalavra(3, 'espalhada');
  const dif = naPalavra(3, 'difícil');
  const gol = naPalavra(3, 'golpe');
  const corte = esp - 5;
  if (f < corte) return <Camera n={3} nomes={['gabriel']} foco="50% 38%" zoom={[{ em: 0, de: 1, ate: 1.05 }, { em: naPalavra(3, 'Só') - 3, de: 1.15, ate: 1.2 }]} />;
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
  const tema = useTema();
  const comeca = naPalavra(4, 'catorze');
  const para = naPalavra(4, 'milhões') + 6;
  const rolando = f >= comeca && f < para;
  // Rolo vertical de dígitos: passa rápido (com borrão) e desacelera até 14,4.
  const t = interpolate(f, [comeca, para], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
  const desacel = 1 - Math.pow(1 - t, 3);
  const passo = 260;
  const voltas = 3; // quantas vezes o rolo passa antes de parar
  const desloc = (1 - desacel) * (voltas * 10 + 3.6) * passo; // começa fora do valor final, para o 14,4 não piscar antes de rolar
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
          <div style={{ fontSize: 64, fontWeight: 800, color: tema.sec, marginBottom: 12 }}>
            <Palavras itens={[{ texto: 'No', em: naPalavra(4, 'No') - 2 }, { texto: 'Brasil', em: naPalavra(4, 'Brasil') - 2 }]} />
          </div>
          <div style={{ fontSize: 260, lineHeight: `${passo}px`, fontWeight: 900, letterSpacing: '-0.04em', display: 'flex', alignItems: 'baseline', opacity: visivel ? 1 : 0, fontVariantNumeric: 'tabular-nums' }}>
            <Rolo alvo={1} /><Rolo alvo={4} /><span>,</span><Rolo alvo={4} />
            <span style={{ fontSize: 150, marginLeft: 36 }}><Destaque de={para + 4}>milhões</Destaque></span>
          </div>
          <div style={{ fontSize: 56, fontWeight: 800, color: tema.sec, marginTop: 48, opacity: chegada(f, para + 2, 10), transform: `translateY(${r2(mix(30, 0, chegada(f, para + 2, 10)))}px)` }}>
            pessoas com deficiência
          </div>
          <div style={{ fontFamily: MONO, fontSize: 34, color: tema.sec, marginTop: 24, opacity: chegada(f, para + 8, 10) }}>
            Fonte: IBGE, Censo 2022 (pessoas com 2 anos ou mais)
          </div>
        </AbsoluteFill>
      </Fundo>
    </EntradaDeCena>
  );
};

// ---------- Cena 5: Thor na câmera ----------
// Thor mais perto: já começa aproximado e chega mais em "com a fonte junto".
export const Cena5: React.FC = () => <Camera n={5} nomes={['thor']} foco="50% 42%" zoom={[{ em: 0, de: 1.12, ate: 1.17 }, { em: naPalavra(5, 'com') - 3, de: 1.26, ate: 1.3 }]} />;

// ---------- Cena 6: círculo cobre a tela e abre no logo; Leco sobe; quatro chips ----------
export const Cena6: React.FC = () => {
  const f = useCurrentFrame();
  const cobre = chegada(f, 0, 9); // círculo indigo cresce e cobre
  const abre = chegada(f, 11, 10); // um círculo claro abre de dentro, revelando o logo
  const mapiii = Math.min(naPalavra(6, 'Mapiii'), 15); // o logo aparece assim que o círculo abre
  const direitos = naPalavra(6, 'direitos');
  const leco = naPalavra(6, 'Leco');
  const tema = useTema();
  const choque = impacto(f, 9, 0, 6);
  // Recorte (feedback do Roberto, 16/11): depois da fala, o app diz por onde começa. Só texto, sem voz nova.
  const falas6 = temposDasPalavras(6);
  // Com a fala do recorte gravada ("Ele começa pela mobilidade: ônibus, carro, calçada e reclamação."),
  // o recorte entra em "Ele" e cada objeto entra na sua palavra. Sem ela, entram em sequência depois da fala.
  const semFala = falas6[falas6.length - 1].ate + 8;
  const recorte = quandoFala(6, 'Ele', semFala + 4) - 4;
  const NOMES = ['ônibus', 'carro', 'calçada', 'reclamação'];
  const objetoEm = (i: number) => quandoFala(6, NOMES[i], recorte + 16 + i * 6 + 2) - 2;
  const saiLogo = partida(f, recorte - 6, 8);
  const temas = [
    { texto: 'Ônibus', cor: COR.branco, obj: 'onibus' }, { texto: 'Carro', cor: COR.branco, obj: 'carro' },
    { texto: 'Calçada', cor: COR.branco, obj: 'calcada' }, { texto: 'Reclamação', cor: COR.branco, obj: 'reclamacao' }
  ];
  const chips = ['Pode ter direito', 'Fonte oficial', 'Sem CPF', 'Emergência: 192'];
  const posChip: React.CSSProperties[] = [
    { left: 120, top: 120 }, { right: 120, top: 120 }, { left: 120, bottom: 180 }, { right: 120, bottom: 180 }
  ];
  return (
    <Fundo>
      <AbsoluteFill style={{ transform: `translate(${choque.x}px, ${choque.y}px)` }}>
        <AbsoluteFill style={{ alignItems: 'center', justifyContent: 'center' }}>
          <div style={{ position: 'absolute', width: 2400, height: 2400, borderRadius: '50%', background: COR.indigo, transform: `scale(${r2(mix(0.08, 1, cobre))})` }} />
          <div style={{ position: 'absolute', width: 2400, height: 2400, borderRadius: '50%', background: tema.fundo, transform: `scale(${r2(mix(0.05, 1, abre))})`, opacity: f >= 11 ? 1 : 0 }} />
        </AbsoluteFill>
        <div style={{ position: 'absolute', left: 160, top: 330, opacity: f >= mapiii - 4 && saiLogo < 1 ? 1 : 0, transform: `translateY(${r2(mix(80, 0, chegada(f, mapiii - 4, 12)) - saiLogo * 900)}px)` }}>
          <Logo largura={640} />
          <div style={{ fontSize: 76, fontWeight: 800, letterSpacing: '-0.02em', marginTop: 20, paddingLeft: 12, opacity: chegada(f, naPalavra(6, 'mapa') - 3, 8) }}>
            o mapa dos seus <Destaque de={direitos}>direitos</Destaque>
          </div>
        </div>
        <div style={{ transform: `translateX(${r2(saiLogo * 1000)}px)` }}><Leco pose="bom" x={1240} y={160} tamanho={700} em={leco - 2} /></div>
        {chips.map((c, i) => {
          const em = direitos + 10 + i * 7;
          const t = chegada(f, em, 10);
          const lado = i % 2 === 0 ? -1 : 1;
          return (
            <div key={c} style={{
              position: 'absolute', ...posChip[i], padding: '14px 28px', borderRadius: 999, background: COR.branco, border: `3px solid ${COR.borda}`,
              fontSize: 34, fontWeight: 800, color: COR.indigo, opacity: t > 0 && saiLogo < 1 ? 1 : 0, transform: `translateX(${r2(lado * (mix(300, 0, t) + saiLogo * 900))}px)`
            }}>{c}</div>
          );
        })}
        <div style={{ position: 'absolute', left: 160, top: 120, width: 1600, opacity: f >= recorte - 2 ? 1 : 0 }}>
          <div style={{ fontSize: 50, fontWeight: 800, color: tema.sec, transform: `translateY(${r2(mix(120, 0, chegada(f, recorte - 2, 12)))}px)` }}>O Mapiii começa por um recorte:</div>
          <div style={{ fontSize: 88, fontWeight: 900, lineHeight: 1.05, letterSpacing: '-0.02em', marginTop: 12, transform: `translateY(${r2(mix(160, 0, chegada(f, recorte, 12)))}px)` }}>
            a <Destaque de={quandoFala(6, 'mobilidade', recorte + 10)}>mobilidade</Destaque> de quem usa cadeira de rodas em São Paulo
          </div>
          <div style={{ display: 'flex', gap: 40, marginTop: 50 }}>
            {temas.map((x, i) => {
              const t = chegada(f, objetoEm(i), 12);
              return (
                <div key={x.texto} style={{ width: 370, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6, opacity: t > 0 ? 1 : 0, transform: `translateY(${r2(mix(160, 0, t))}px)` }}>
                  <Img src={staticFile(`objetos/${x.obj}.png`)} style={{ width: 300, height: 300 }} />
                  <span style={{ padding: '12px 30px', borderRadius: 999, background: x.cor, border: `3px solid ${COR.indigo}`, fontSize: 44, fontWeight: 900, color: COR.indigo }}>{x.texto}</span>
                </div>
              );
            })}
          </div>
        </div>
      </AbsoluteFill>
    </Fundo>
  );
};

// ---------- Cena 25: comparação. A mesma pessoa, no mesmo ponto: sem o Mapiii fica esperando, com o Mapiii sabe o que fazer ----------
// Ideia do vídeo de referência (sem × com), com os desenhos da cena 1. Cada lado se anima na sua palavra.
const Lado: React.FC<{ com: boolean; em: number; acao: number }> = ({ com, em, acao }) => {
  const f = useCurrentFrame();
  const entra = chegada(f, em, 12);
  // sem: o ônibus passa e vai embora; com: o ônibus para e a rampa desce
  const xOnibus = com ? mix(1500, 0, chegada(f, em, 24)) : mix(0, 1900, partida(f, acao, 30));
  const rampa = com ? chegada(f, acao, 14) : 0;
  const porta = com ? chegada(f, acao - 6, 10) : 0;
  return (
    <div style={{ position: 'absolute', left: 0, top: 300, width: 1920, height: 1080, transform: `scale(0.5) translateY(${r2(mix(200, 0, entra))}px)`, transformOrigin: '0 0', opacity: f >= em ? 1 : 0 }}>
      <svg viewBox="0 0 1920 1080" width={1920} height={1080} style={{ position: 'absolute', inset: 0 }}>
        <Chao />
        <Ponto />
        <g transform={`translate(${r2(xOnibus)} 0)`}><Onibus porta={porta} rampa={rampa} /></g>
      </svg>
      <div style={{ position: 'absolute', left: 380, top: 591 }}><Pessoa largura={445} /></div>
    </div>
  );
};

export const Cena25: React.FC = () => {
  const f = useCurrentFrame();
  const mesma = naPalavra(25, 'mesma');
  const sem = naPalavra(25, 'Sem');
  const esperando = naPalavra(25, 'esperando.');
  const com = naPalavra(25, 'Com');
  const sabe = naPalavra(25, 'sabe');
  const fazer = naPalavra(25, 'fazer.');
  const duvidas = [0, 1, 2].map((i) => chegada(f, esperando + 4 + i * 5, 10));
  const celular = chegada(f, sabe, 12);
  const chip = (texto: string, de: number, escuro: boolean): React.ReactNode => (
    <span style={{ display: 'inline-block', padding: '12px 30px', borderRadius: 999, fontSize: 40, fontWeight: 900, background: escuro ? COR.indigo : COR.branco, color: escuro ? COR.seashell : COR.indigo, border: `3px solid ${COR.indigo}`, opacity: f >= de ? 1 : 0, transform: `translateY(${r2(mix(-60, 0, chegada(f, de, 10)))}px)` }}>{texto}</span>
  );
  return (
    <EntradaDeCena>
      <Fundo>
        {/* metade sem: tom apagado; metade com: a cor da cena */}
        <div style={{ position: 'absolute', left: 0, top: 0, width: 960, height: 1080, background: COR.chao }} />
        <div style={{ position: 'absolute', left: 957, top: 0, width: 6, height: 1080, background: COR.indigo, transform: `scaleY(${r2(chegada(f, mesma, 14))})`, transformOrigin: '50% 0' }} />
        <div style={{ position: 'absolute', left: 0, top: 0, width: 960, height: 1080, overflow: 'hidden' }}>
          <Lado com={false} em={mesma - 2} acao={esperando - 6} />
          <div style={{ position: 'absolute', left: 60, top: 70 }}>{chip('sem Mapiii', sem - 4, false)}</div>
          <h2 style={{ position: 'absolute', left: 60, top: 160, margin: 0, fontSize: 84, fontWeight: 900, letterSpacing: '-0.03em', opacity: f >= esperando - 6 ? 1 : 0 }}>
            Fica <Destaque de={esperando + 6}>esperando.</Destaque>
          </h2>
          {duvidas.map((t, i) => (
            <span key={i} style={{ position: 'absolute', left: 190 + i * 90, top: 470 - i * 30, width: 72, height: 72, borderRadius: '50%', background: COR.branco, border: `4px solid ${COR.indigo}`, display: 'grid', placeItems: 'center', fontSize: 48, fontWeight: 900, opacity: t > 0 ? 1 : 0, transform: `scale(${r2(mix(1.4, 1, t))})` }}>?</span>
          ))}
        </div>
        <div style={{ position: 'absolute', left: 960, top: 0, width: 960, height: 1080, overflow: 'hidden' }}>
          <Lado com em={com - 4} acao={fazer} />
          <div style={{ position: 'absolute', left: 60, top: 70 }}>{chip('com Mapiii', com - 4, true)}</div>
          <h2 style={{ position: 'absolute', left: 60, top: 160, margin: 0, fontSize: 84, fontWeight: 900, letterSpacing: '-0.03em', opacity: f >= sabe - 4 ? 1 : 0 }}>
            Sabe o que <Destaque de={fazer + 4}>fazer.</Destaque>
          </h2>
          <div style={{ position: 'absolute', left: 300, top: 410, padding: '18px 26px', borderRadius: 28, background: COR.branco, border: `3px solid ${COR.indigo}`, fontSize: 34, fontWeight: 900, opacity: celular > 0 ? 1 : 0, transform: `translateY(${r2(mix(80, 0, celular))}px)` }}>
            Pode ter direito
            <div style={{ fontSize: 26, fontWeight: 800, color: COR.verde800, marginTop: 6 }}>✓ Fonte oficial</div>
          </div>
        </div>
      </Fundo>
    </EntradaDeCena>
  );
};
