#!/usr/bin/env python3
"""Acha o tempo de cada palavra da narração (alinhamento forçado, sem modelo de IA e sem internet).

Para cada cena: o espeak-ng fala cada palavra da locução (voz sintética, só para comparar; não entra no vídeo),
e a fala sintética é alinhada com a gravação por DTW sobre MFCC. O resultado vai para src/tempos-narracao.json
(segundos absolutos do vídeo), que a legenda e as animações usam.

Uso (na pasta video/remotion):  python3 scripts/alinhar.py
Precisa de: espeak-ng, ffmpeg, e os pacotes Python numpy, librosa e soundfile.
"""
import json, re, subprocess, sys, tempfile
from pathlib import Path
import numpy as np
import librosa

RAIZ = Path(__file__).resolve().parent.parent
SR = 16000
HOP = 160  # 10 ms
FALA = {'cpf.': 'cê pê éfi', '2022.': 'dois mil e vinte e dois', '192.': 'cento e noventa e dois', 'sptrans': 'ésse pê trâns', 'mapiii.': 'mapí', 'mapiii': 'mapí'}

def cenas():
    txt = (RAIZ / 'src' / 'roteiro.ts').read_text(encoding='utf8')
    return [(int(m[1]), float(m[2]), float(m[3]), m[4]) for m in re.finditer(r"\{ n: (\d+), inicio: ([\d.]+), fim: ([\d.]+),.*?locucao: '(.*)' \}", txt)]

def carregar(arq):
    raw = subprocess.run(['ffmpeg', '-v', 'error', '-i', str(arq), '-ac', '1', '-ar', str(SR), '-f', 'f32le', '-'], capture_output=True, check=True).stdout
    return np.frombuffer(raw, dtype=np.float32)

def sintetizar(palavra, tmp):
    limpa = re.sub(r'["“”]', '', palavra)
    dita = FALA.get(limpa.lower(), limpa)
    wav = Path(tmp) / 'p.wav'
    subprocess.run(['espeak-ng', '-v', 'pt-br', '-s', '165', '-w', str(wav), dita], check=True)
    y = carregar(wav)
    idx = np.where(np.abs(y) > 0.01 * max(1e-6, np.abs(y).max()))[0]
    y = y[idx[0]:idx[-1] + 1] if len(idx) else y
    return y

def traços(y):
    m = librosa.feature.mfcc(y=y, sr=SR, n_mfcc=13, n_fft=400, hop_length=HOP, n_mels=40, fmax=7600)
    m = m[1:]  # sem a energia absoluta (vozes diferentes)
    d = librosa.feature.delta(m)
    f = np.vstack([m, d])
    return (f - f.mean(axis=1, keepdims=True)) / (f.std(axis=1, keepdims=True) + 1e-6)

def alinhar(n, locucao, tmp):
    palavras = locucao.split()
    real = carregar(RAIZ.parent / 'gravacoes' / 'narracao' / f'cena-{n:02d}.mp3')
    partes, limites, pos = [], [], 0
    for p in palavras:
        y = sintetizar(p, tmp)
        pausa = np.zeros(int(SR * (0.22 if re.search(r'[.?!:]["”]?$', p) else 0.08 if p.endswith(',') else 0.0)), dtype=np.float32)
        limites.append((pos, pos + len(y)))
        partes += [y, pausa]
        pos += len(y) + len(pausa)
    sint = np.concatenate(partes)
    # Só os trechos com voz da gravação entram na comparação (pausas não recebem palavra).
    B = traços(real)
    nq = B.shape[1]
    rms = librosa.feature.rms(y=real, frame_length=800, hop_length=HOP)[0][:nq]
    db = 20 * np.log10(rms / rms.max() + 1e-9)
    voz = db > -24
    def corridas(m):
        ini = 0
        for i in range(1, len(m) + 1):
            if i == len(m) or m[i] != m[ini]:
                yield ini, i, m[ini]
                ini = i
    for a, b, v in list(corridas(voz)):
        if not v and b - a < 18 and a > 0 and b < len(voz): voz[a:b] = True  # buraco curto dentro da fala
    for a, b, v in list(corridas(voz)):
        if v and b - a < 6: voz[a:b] = False  # estalo isolado
    quadros = np.where(voz)[0]
    A, B = traços(np.concatenate([y for y in partes[::2]])), B[:, quadros]
    # limites sem as pausas sintéticas
    limites, pos = [], 0
    for y in partes[::2]:
        limites.append((pos, pos + len(y))); pos += len(y)
    _, wp = librosa.sequence.dtw(X=A, Y=B, metric='cosine', step_sizes_sigma=np.array([[1, 1], [1, 2], [2, 1], [1, 3], [3, 1]]), weights_add=np.zeros(5), weights_mul=np.array([1, 1, 1, 1.2, 1.2]))
    wp = wp[::-1]
    qa, qb = wp[:, 0], wp[:, 1]
    def para_real(amostra):
        q = min(amostra // HOP, qa.max())
        return int(qb[np.searchsorted(qa, q, side='left').clip(0, len(qb) - 1)])
    dur = len(real) / SR
    saida = []
    for p, (a, b) in zip(palavras, limites):
        i, j = para_real(a), max(para_real(a), para_real(b) - 1)
        saida.append([p, quadros[i] * HOP / SR, (quadros[j] + 1) * HOP / SR])
    # Palavra que ficou com um pedacinho antes (ou depois) de uma pausa: fica só do lado maior da pausa.
    pausas = [(a * HOP / SR, b * HOP / SR) for a, b, v in corridas(voz) if not v and b - a >= 15]
    for w in saida:
        for a, b in pausas:
            if w[1] < a + 0.02 and w[2] > b and a - w[1] < 0.14 and a - w[1] < w[2] - b: w[1] = b
        for a, b in reversed(pausas):
            if w[1] < a and w[2] > b - 0.02 and w[2] - b < 0.14 and w[2] - b < a - w[1]: w[2] = a
    # Ajustes: ordem crescente, duração mínima de 60 ms, dentro do arquivo.
    for i, w in enumerate(saida):
        if i: w[1] = max(w[1], saida[i - 1][1] + 0.06)
        w[2] = min(max(w[2], w[1] + 0.06), dur)
    for i in range(len(saida) - 1):
        saida[i][2] = min(saida[i][2], saida[i + 1][1])
    return saida

def main():
    res = []
    with tempfile.TemporaryDirectory() as tmp:
        for n, inicio, fim, loc in cenas():
            ws = alinhar(n, loc, tmp)
            res.append({'cena': n, 'fonte': f'video/gravacoes/narracao/cena-{n:02d}.mp3',
                        'palavras': [{'texto': p, 'inicio': round(inicio + a, 3), 'fim': round(inicio + b, 3)} for p, a, b in ws]})
            print(n, ' '.join(f'{p}@{a:.2f}' for p, a, _ in ws))
    (RAIZ / 'src' / 'tempos-narracao.json').write_text(json.dumps(res, ensure_ascii=False, indent=1) + '\n', encoding='utf8')

if __name__ == '__main__':
    main()
