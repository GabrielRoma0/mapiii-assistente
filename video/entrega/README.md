# Vídeo pitch renderizado

- `mapiii-pitch-gs2026.mp4`: versão de 12/11/2026, 1920 × 1080, 30 qps, H.264, áudio AAC 48 kHz, 2:05. Som em −14 LUFS, pico real abaixo de −1 dBTP.
- `mapiii-pitch-gs2026.srt`: a mesma legenda que está queimada no vídeo, para enviar ao YouTube.

Este arquivo é uma cópia mais leve (CRF 21) para caber no git. Para a entrega, gerem o de qualidade máxima (CRF 12, cerca de 65 MB) com `npm run render` e `npm run srt` em `video/remotion`; ele sai em `video/remotion/out/`.

Ainda não entraram: a mão virando o celular (cena 9) e a voz do aviso (cena 10). Ver `video/README.md`, seção 6.
