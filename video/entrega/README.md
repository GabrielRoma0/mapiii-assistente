# Vídeo pitch renderizado

- `mapiii-pitch-gs2026.mp4`: versão de 18/11/2026 (com a mini-história da Carla e da Letícia), 1920 × 1080, 30 qps, H.264, áudio AAC 48 kHz, 2:58. Som em −14 LUFS, pico real abaixo de −1 dBTP.
- `mapiii-pitch-gs2026-full.mp4`: o mesmo vídeo em qualidade máxima (CRF 15, abaixo do limite de 100 MB do GitHub), para a entrega.
- `mapiii-pitch-gs2026.srt`: a mesma legenda que está queimada no vídeo, para enviar ao YouTube.

Este arquivo é uma cópia mais leve (CRF 21) para caber no git. Para a entrega, gerem o de qualidade máxima (CRF 12, cerca de 65 MB) com `npm run render` e `npm run srt` em `video/remotion`; ele sai em `video/remotion/out/`.

Inclui o feedback dos professores (16/11): cores, transições, recorte com objetos 3D, cenas 22 a 24 com telas reais do app e a ordem nova. Som em −14,4 LUFS, pico real −1,6 dBTP.
