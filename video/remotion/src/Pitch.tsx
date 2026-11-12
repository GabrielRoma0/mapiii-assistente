// O vídeo inteiro: as 18 cenas em sequência, a legenda, o relógio e o som.
import React from 'react';
import { AbsoluteFill, Audio, interpolate, Sequence, staticFile } from 'remotion';
import { FONTES_CSS } from './base';
import { arquivoExiste } from './arquivos';
import { Cena1, Cena2, Cena3, Cena4, Cena5, Cena6 } from './cenas/abertura';
import { Cena7, Cena8, Cena9, Cena10, Cena11 } from './cenas/app';
import { Cena12, Cena13, Cena14, Cena15, Cena16, Cena17, Cena18, CHEGADA_SP, pinosDaCena15, POUSO } from './cenas/fecho';
import { Cena19, Cena20 } from './cenas/telas-app';
import { cena, CENAS, DURACAO_TOTAL, FPS, inicioEmQuadros, naPalavra, quadrosDa, temposDasPalavras } from './roteiro';
import { blocosDeLegenda } from './legendas';
import { Legenda, Relogio } from './sobreposicoes';

// Voz da cena: a versão tratada (.wav, feita por scripts/preparar.mjs) ou, sem ffmpeg, a gravação como veio (.mp3).
const vozDaCena = (n: number) => {
  const base = `narracao/cena-${String(n).padStart(2, '0')}`;
  return arquivoExiste(`${base}.wav`) ? `${base}.wav` : `${base}.mp3`;
};

// Trilha: baixa enquanto há fala (pelo menos 12 dB abaixo da voz) e sobe um pouco nas pausas, sem degrau.
const FALAS = blocosDeLegenda();
function volumeDaTrilha(q: number) {
  let dist = 999;
  for (const b of FALAS) {
    const d = q < b.de ? b.de - q : q > b.ate ? q - b.ate : 0;
    if (d < dist) dist = d;
  }
  return interpolate(dist, [6, 20], [0.06, 0.12], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
}

const COMPONENTES: Record<number, React.FC> = {
  1: Cena1, 2: Cena2, 3: Cena3, 4: Cena4, 5: Cena5, 6: Cena6, 7: Cena7, 8: Cena8, 9: Cena9,
  10: Cena10, 11: Cena11, 12: Cena12, 13: Cena13, 14: Cena14, 15: Cena15, 16: Cena16, 17: Cena17, 18: Cena18, 19: Cena19, 20: Cena20
};

// Um efeito sonoro: arquivo, cena, quadro dentro da cena e volume (0 a 1).
interface Efeito { som: string; n: number; em: number; vol: number }

// Hierarquia (seção 8): fortes só no ônibus (1), no círculo (6), no giro (9), nos números (12) e na rampa (18).
function efeitos(): Efeito[] {
  const e: Efeito[] = [];
  const add = (som: string, n: number, em: number, vol: number) => e.push({ som, n, em: Math.max(0, Math.round(em)), vol });
  // 1
  const chegou = naPalavra(1, 'chegou');
  add('onibus-freio.wav', 1, chegou - 22, 0.6);
  add('onibus-porta.mp3', 1, chegou + 6, 0.22);
  // troca de cena: whoosh discreto nas cenas animadas
  for (const c of CENAS) if (c.n > 1 && !c.camera && c.n !== 6 && c.n !== 18) add('whoosh.flac', c.n, 0, 0.22);
  // 3
  add('toque-seco.wav', 3, naPalavra(3, 'espalhada') - 4, 0.45);
  add('toque-seco.wav', 3, naPalavra(3, 'difícil') - 4, 0.45);
  add('toque-seco.wav', 3, naPalavra(3, 'golpe') - 4, 0.45);
  add('papel-rasgando.wav', 3, naPalavra(3, 'golpe') + 4, 0.6);
  // 4: contador rápido que para no número
  const de4 = naPalavra(4, 'catorze');
  const para4 = naPalavra(4, 'milhões') + 6;
  for (let q = de4; q < para4; q += Math.max(2, Math.round((q - de4) / 6) + 2)) add('tique.wav', 4, q, 0.18);
  add('tique.wav', 4, para4, 0.6);
  // 5 → 6: whoosh na saída e o círculo
  add('whoosh.flac', 6, 0, 0.6);
  add('pop.flac', 6, naPalavra(6, 'Leco') - 2, 0.55);
  // 7
  add('toque-seco.wav', 7, naPalavra(7, 'responde') + 10, 0.35);
  // 19: toques baixos na gravação do app (nos quadros em que o dedo toca)
  for (const q of [5, 29, 41, 55]) add('toque-seco.wav', 19, q, 0.25);
  add('ding.flac', 19, 132, 0.3);
  // 20
  add('toque-seco.wav', 20, 68, 0.3);
  add('pop.flac', 20, 80, 0.35);
  // 8
  add('toque-seco.wav', 8, naPalavra(8, 'direito', 0) + 6, 0.4);
  add('ding.flac', 8, naPalavra(8, 'fonte') - 2, 0.45);
  // 9
  add('whoosh.flac', 9, naPalavra(9, 'vira'), 0.55);
  // 10
  add('notificacao.wav', 10, naPalavra(10, 'avisar') - 2, 0.55);
  // 11
  add('pop.flac', 11, 4, 0.4);
  // 12
  add('tique.wav', 12, naPalavra(12, 'doze.', 1) + 2, 0.75);
  add('tique.wav', 12, naPalavra(12, 'acessibilidade') + 4, 0.75);
  // 13
  const t13 = [naPalavra(13, 'internet,') - 6, naPalavra(13, 'toque,') - 6, naPalavra(13, 'toque,') + 4, naPalavra(13, 'voz') - 6, naPalavra(13, 'voz') + 4, naPalavra(13, 'voz') + 12];
  for (const q of t13) add('tique.wav', 13, q, 0.3);
  // 15: um pop por pino, subindo
  add('pop.flac', 15, CHEGADA_SP - 2 + POUSO, 0.3);
  pinosDaCena15().forEach((p, i) => add('pop.flac', 15, p.em + POUSO, 0.32 + i * 0.06));
  // 17
  add('pop.flac', 17, naPalavra(17, 'Agora,') - 2, 0.45);
  // 18
  add('onibus-freio.wav', 18, 0, 0.5);
  add('onibus-porta.mp3', 18, 16, 0.2);
  add('rampa-descendo.mp3', 18, 24, 0.6);
  return e;
}

// Um efeito nunca passa do fim da sua cena: some nos últimos 6 quadros antes do corte.
const EfeitoSonoro: React.FC<{ efeito: Efeito }> = ({ efeito: e }) => {
  const c = cena(e.n);
  const dur = Math.max(1, Math.min(FPS * 6, quadrosDa(c) - e.em));
  return (
    <Sequence from={inicioEmQuadros(c) + e.em} durationInFrames={dur} name={`som ${e.som}`}>
      <Audio src={staticFile(`sons/${e.som}`)} volume={(f) => e.vol * interpolate(f, [dur - 6, dur], [1, 0], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' })} />
    </Sequence>
  );
};

// legenda: queimada no vídeo ou não (ligada por padrão). Hoje segue o tempo estimado das palavras;
// com a narração gravada, src/tempos-narracao.json passa a dar o tempo real, para a legenda e para as animações.
export const Pitch: React.FC<{ legenda: boolean }> = ({ legenda }) => {
  const narracao = arquivoExiste('narracao/narracao.wav');
  const inicioTrilha = inicioEmQuadros(cena(6));
  const fimTrilha = DURACAO_TOTAL - FPS; // termina com 1 s de silêncio
  const fimRua = inicioEmQuadros(cena(1)) + naPalavra(1, 'não') + 40;
  return (
    <AbsoluteFill style={{ background: '#F2E9E4' }}>
      <style>{FONTES_CSS}</style>
      {CENAS.map((c) => {
        const C = COMPONENTES[c.n];
        return (
          <Sequence key={c.n} from={inicioEmQuadros(c)} durationInFrames={quadrosDa(c)} name={`Cena ${c.n}`}>
            <C />
          </Sequence>
        );
      })}
      <Relogio />
      {legenda && <Legenda />}

      {/* Som: rua ao fundo só na cena 1, silêncio quando o ônibus sai */}
      <Sequence from={0} durationInFrames={fimRua}>
        <Audio src={staticFile('sons/rua-ambiente.mp3')} volume={(f) => interpolate(f, [0, 6, fimRua - 20, fimRua], [0, 0.22, 0.22, 0], { extrapolateRight: 'clamp' })} />
      </Sequence>
      {/* Trilha bem baixa da cena 6 em diante, em loop, sumindo antes do segundo final */}
      <Sequence from={inicioTrilha} durationInFrames={fimTrilha - inicioTrilha}>
        <Audio src={staticFile('sons/trilha.mp3')} loop
          volume={(f) => volumeDaTrilha(f + inicioTrilha) * interpolate(f, [0, 20, fimTrilha - inicioTrilha - 45, fimTrilha - inicioTrilha], [0, 1, 1, 0], { extrapolateRight: 'clamp' })} />
      </Sequence>
      {efeitos().map((e, i) => (
        <EfeitoSonoro key={i} efeito={e} />
      ))}
      {narracao && <Audio src={staticFile('narracao/narracao.wav')} />}
      {/* Voz gravada por cena (gravacoes/narracao/cena-NN.mp3), começando no início da cena. */}
      {CENAS.filter((c) => arquivoExiste(vozDaCena(c.n))).map((c) => (
        // A voz toca até o fim do arquivo (meio segundo de sobra), para a última sílaba não ser cortada na troca de cena.
        <Sequence key={`voz-${c.n}`} from={inicioEmQuadros(c)} durationInFrames={quadrosDa(c) + 15} name={`voz cena ${c.n}`}>
          <Audio src={staticFile(vozDaCena(c.n))} />
        </Sequence>
      ))}
    </AbsoluteFill>
  );
};

// Usado pelo script do .srt e pela conferência.
export const palavrasDoVideo = () => CENAS.flatMap((c) => temposDasPalavras(c.n).map((p) => ({ ...p, de: p.de + inicioEmQuadros(c), ate: p.ate + inicioEmQuadros(c) })));
