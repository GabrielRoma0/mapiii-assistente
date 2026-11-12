# Gravações do vídeo pitch (já tratadas)

Feitas pela dupla em 11/11/2026 e tratadas pelo Claude Code em 12/11. Os originais (iPhone, 4K HDR) ficam com a dupla; aqui estão as versões usadas no vídeo.

- `camera-gravada/cena-NN.mp4`: cenas de câmera (2, 3, 5, 14 e 17), convertidas de HDR (HLG) para cores normais (SDR), 1080p, 30 qps, sem som.
- `narracao/cena-NN.mp3`: a voz de cada cena (as 18), cortada no começo e no fim da fala e com o volume igualado (−16 LUFS). Nas cenas de câmera, é o áudio do segundo celular, sincronizado com o vídeo comparando os dois sons.
- Cena 5: usada a 2ª gravação (IMG_0913), que é a que tem o áudio do segundo celular e está completa.

| Cena | Vídeo | Áudio | Diferença de sincronia |
|---|---|---|---|
| 2 | IMG_0908 | para quem usa cadeira de rodas | 0,66 s |
| 3 | IMG_0904 | a resposta existe | 0,25 s |
| 5 | IMG_0913 | e se o caminho coubesse no bolso | 0,57 s |
| 14 | IMG_0914 | começamos por São Paulo | 0,81 s |
| 17 | IMG_0925 | ninguém deveria ficar no ponto | 1,31 s |

A duração de cada cena e o tempo de cada palavra saem dessas falas: `video/remotion/src/roteiro.ts` e `video/remotion/src/tempos-narracao.json` (palavras espalhadas dentro dos trechos com voz; dá para ajustar à mão).
