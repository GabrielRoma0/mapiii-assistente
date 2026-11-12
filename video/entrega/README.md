# Vídeo pitch renderizado

- `mapiii-pitch-gs2026.mp4`: versão de 12/11/2026, 1920 × 1080, 30 qps, H.264, áudio AAC 48 kHz, 1:54. Som em −14,3 LUFS, pico real −1,1 dBTP.
- `mapiii-pitch-gs2026.srt`: a mesma legenda que está queimada no vídeo, para enviar ao YouTube.

Este arquivo é uma cópia mais leve (CRF 21) para caber no git. Para a entrega, gerem o de qualidade máxima (CRF 12, cerca de 65 MB) com `npm run render` e `npm run srt` em `video/remotion`; ele sai em `video/remotion/out/`.

Ainda não entraram: os cortes de 2 s do app real (cenas 7 e 9) e a voz do aviso (cena 10). Ver `video/README.md`, seção 6.
