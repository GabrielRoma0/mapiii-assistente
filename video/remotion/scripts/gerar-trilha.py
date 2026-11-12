#!/usr/bin/env python3
"""Gera a trilha ambiente do vídeo (video/sons/trilha-ambiente.mp3), feita só de matemática: não usa gravação de ninguém.

É uma música original e simples: um "colchão" de acordes lentos e quentes, um grave suave e notas esparsas de sino,
tudo com bastante eco. Sempre sai igual (nada aleatório sem semente). Sem direito autoral de terceiros.

Uso (na pasta video/remotion):  python3 scripts/gerar-trilha.py
Precisa de: ffmpeg e o pacote Python numpy.
"""
import subprocess
from pathlib import Path
import numpy as np

SR = 44100
DUR = 140.0            # segundos (o vídeo tem cerca de 2:05; sobra para ajustes)
COMPASSO = 8.0         # cada acorde dura 8 s
RAIZ = Path(__file__).resolve().parent.parent
SAIDA = RAIZ.parent / 'sons' / 'trilha-ambiente.mp3'

def hz(midi): return 440.0 * 2 ** ((midi - 69) / 12)

# Ré maior, progressão calma: Ré(add9) · Si menor 7 · Sol maior 7 · Lá sus4 → Lá
ACORDES = [
    [50, 57, 62, 66, 69, 76],   # D  A  D  F# A  E
    [47, 54, 62, 66, 69, 74],   # B  F# D  F# A  D
    [43, 55, 59, 62, 66, 74],   # G  G  B  D  F# D
    [45, 57, 62, 64, 69, 73],   # A  A  D  E  A  C#
]
ESCALA = [74, 76, 78, 81, 83, 86, 88]  # pentatônica de Ré, região aguda (sinos)

n = int(SR * DUR)
t = np.arange(n) / SR
rng = np.random.default_rng(2026)

def envelope_acorde(i):
    """Cada acorde entra e sai devagar e se sobrepõe ao vizinho (sem degrau)."""
    ini = i * COMPASSO
    x = (t - ini) / COMPASSO
    e = np.zeros(n)
    dentro = (x > -0.35) & (x < 1.35)
    xx = x[dentro]
    sobe = np.clip((xx + 0.35) / 0.7, 0, 1)
    desce = np.clip((1.35 - xx) / 0.7, 0, 1)
    e[dentro] = np.sin(sobe * np.pi / 2) ** 2 * np.sin(desce * np.pi / 2) ** 2
    return e

def colchao():
    E, D = np.zeros(n), np.zeros(n)
    for i in range(int(DUR / COMPASSO) + 1):
        env = envelope_acorde(i)
        for k, nota in enumerate(ACORDES[i % len(ACORDES)]):
            f = hz(nota)
            peso = 0.55 + 0.12 * k  # as notas de cima um pouco mais presentes que as de baixo
            # três vozes levemente desafinadas (coro) com poucos harmônicos: som redondo, sem aspereza
            for des, pan in ((-0.07, 0.25), (0.0, 0.5), (0.06, 0.75)):
                ff = f * 2 ** (des / 12)
                fase = rng.uniform(0, 2 * np.pi)
                vib = 1 + 0.0015 * np.sin(2 * np.pi * 0.17 * t + fase)
                onda = np.sin(2 * np.pi * ff * vib * t + fase) + 0.45 * np.sin(2 * np.pi * 2 * ff * t + fase) + 0.2 * np.sin(2 * np.pi * 3 * ff * t) + 0.08 * np.sin(2 * np.pi * 4 * ff * t + fase)
                treme = 0.85 + 0.15 * np.sin(2 * np.pi * (0.05 + 0.01 * k) * t + fase)
                s = onda * env * treme * peso
                E += s * (1 - pan)
                D += s * pan
    return np.stack([E, D]) * 0.05

def grave():
    s = np.zeros(n)
    for i in range(int(DUR / COMPASSO) + 1):
        f = hz(ACORDES[i % len(ACORDES)][0] - 12)
        s += np.sin(2 * np.pi * f * t) * envelope_acorde(i)
    return np.stack([s, s]) * 0.028

def sinos():
    """Notas esparsas, uma a cada 2 s em média, sempre dentro do acorde do momento; começam depois de 30 s."""
    E, D = np.zeros(n), np.zeros(n)
    tempo = 30.0
    while tempo < DUR - 8:
        i = int(tempo / COMPASSO)
        nota = ESCALA[int(rng.integers(0, len(ESCALA)))]
        if (nota % 12) not in {x % 12 for x in ACORDES[i % len(ACORDES)]} and rng.random() < 0.7:
            nota = ACORDES[i % len(ACORDES)][-1] + 12
        f = hz(nota)
        a = int(tempo * SR)
        dur = int(5.0 * SR)
        tt = np.arange(min(dur, n - a)) / SR
        env = (1 - np.exp(-tt / 0.012)) * np.exp(-tt / 1.4)
        som = (np.sin(2 * np.pi * f * tt) + 0.35 * np.sin(2 * np.pi * 2.0 * f * tt) * np.exp(-tt / 0.5) + 0.12 * np.sin(2 * np.pi * 3.01 * f * tt) * np.exp(-tt / 0.25)) * env
        pan = rng.uniform(0.2, 0.8)
        vol = rng.uniform(0.5, 1.0)
        E[a:a + len(tt)] += som * (1 - pan) * vol
        D[a:a + len(tt)] += som * pan * vol
        tempo += float(rng.choice([1.0, 2.0, 2.0, 3.0, 4.0]))
    return np.stack([E, D]) * 0.085

def eco(x, segundos=3.2, mistura=0.45):
    """Reverberação: convolução com ruído que decai (uma sala grande e macia)."""
    m = int(segundos * SR)
    tt = np.arange(m) / SR
    saida = []
    for c in range(2):
        ir = rng.standard_normal(m) * np.exp(-tt / (segundos / 5))
        ir[: int(0.01 * SR)] = 0
        # escurece o eco (média móvel curta = corta agudos)
        ir = np.convolve(ir, np.ones(24) / 24, mode='same')
        ir /= np.sqrt((ir ** 2).sum())
        tam = 1 << int(np.ceil(np.log2(n + m)))
        y = np.fft.irfft(np.fft.rfft(x[c], tam) * np.fft.rfft(ir, tam), tam)[:n]
        saida.append((1 - mistura) * x[c] + mistura * y)
    return np.stack(saida)

mix = eco(colchao() + grave()) + eco(sinos(), segundos=4.0, mistura=0.6)
# corta o grave de fundo e o agudo áspero; entrada e saída suaves
espectro = np.fft.rfft(mix, axis=1)
fr = np.fft.rfftfreq(n, 1 / SR)
espectro *= 1 / (1 + (55 / np.maximum(fr, 1)) ** 4) / (1 + (fr / 7000) ** 4)
mix = np.fft.irfft(espectro, n, axis=1)
mix *= np.clip(t / 3.0, 0, 1) * np.clip((DUR - t) / 4.0, 0, 1)
mix = mix / np.abs(mix).max() * 0.7

SAIDA.parent.mkdir(parents=True, exist_ok=True)
pcm = (mix.T * 32767).astype('<i2').tobytes()
# volume igualado em −20 LUFS (o volume dentro do vídeo é decidido em src/Pitch.tsx)
subprocess.run(['ffmpeg', '-v', 'error', '-y', '-f', 's16le', '-ar', str(SR), '-ac', '2', '-i', '-', '-af', 'loudnorm=I=-20:TP=-2:LRA=7', '-ar', '48000', '-c:a', 'libmp3lame', '-b:a', '192k', str(SAIDA)], input=pcm, check=True)
print(SAIDA)
