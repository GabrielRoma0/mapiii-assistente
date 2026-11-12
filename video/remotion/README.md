# Vídeo pitch no Remotion

Montagem do vídeo pitch do Mapiii em código, seguindo o roteiro de [../README.md](../README.md). É um projeto separado do app (tem o próprio `package.json`).

## Como usar

```bash
cd video/remotion
npm install
npm run studio        # abre o Remotion Studio no navegador para assistir e revisar
npm run quadros       # tira 3 quadros de cada cena em out/quadros/ (ou: npm run quadros -- 4 9)
npm run previa        # vídeo em meia resolução, rápido, em out/previa.mp4
npm run render        # vídeo final 1920 × 1080 em out/mapiii-pitch-gs2026.mp4
npm run srt           # legenda em out/mapiii-pitch-gs2026.srt
npm run conferir -- out/previa.mp4   # trechos parados, final parado e volume
npm run tipos         # confere o TypeScript
```

`npm run preparar` (chamado pelos outros) copia as peças de `video/` e `design-system/` para `public/`. A pasta `public/` e a `out/` não vão para o git.

## Onde está cada coisa

| Arquivo | O que tem |
|---|---|
| `src/roteiro.ts` | As 18 cenas: início, fim, quem fala e a locução exata. O tempo de cada palavra é estimado até existir a narração |
| `src/cenas/abertura.tsx` | Cenas 1 a 6 |
| `src/cenas/app.tsx` | Cenas 7 a 11 |
| `src/cenas/fecho.tsx` | Cenas 12 a 18 |
| `src/Pitch.tsx` | Junta tudo: cenas, legenda, relógio, trilha e efeitos sonoros (com o volume de cada um) |
| `src/base.tsx`, `src/desenhos.tsx` | Cores, fontes, movimento, Leco 3D, ícones; ônibus, pessoa e ponto em vetor |
| `src/sobreposicoes.tsx`, `src/legendas.ts` | Legenda, relógio, câmera e linha de rota |

## Legenda

Ligada por padrão (decisão de 10/11). Hoje usa o tempo estimado de cada palavra, o mesmo que as animações usam. Depois da narração gravada, o tempo real de cada palavra vai para `src/tempos-narracao.json` e a legenda e as animações se ajustam juntas às falas. Para renderizar sem legenda: `npx remotion render Pitch out/sem-legenda.mp4 --props='{"legenda":false}'`.

## Gravações: onde colocar

As gravações ficam em `video/gravacoes/`, **já comprimidas pelo Claude Code** (vídeo 1080p H.264, áudio MP3 normalizado), e vão para o git. Não enviem o arquivo original do celular (4K pesa dezenas de MB): mandem ao Claude Code, que comprime, sincroniza e coloca aqui. Com estes nomes, o vídeo usa a gravação no lugar do espaço reservado:

| Arquivo | Cena |
|---|---|
| `gravacoes/camera-gravada/cena-02.mp4`, `cena-03.mp4`, `cena-05.mp4`, `cena-14.mp4`, `cena-17.mp4` | Câmera |
| `gravacoes/app/triagem.mp4` (2 s) | Corte do app na cena 7 |
| `gravacoes/app/mao-celular.mp4` (2 s) | Mão virando o celular na cena 9 |
| `gravacoes/narracao/cena-NN.mp3` | Voz de cada cena, começando no início da cena (câmera e off) |
| `gravacoes/narracao/narracao.wav` | Narração inteira, se gravarem tudo num arquivo só |

Com a narração gravada, o próximo passo é transcrever com o tempo de cada palavra e gravar em `src/tempos-narracao.json` (formato no comentário de `src/roteiro.ts`). Aí cada animação passa a cair na palavra falada, sem mexer nas cenas.

## Como gravar a narração no ritmo

Abram `npm run studio`, deem play na composição `Pitch` e leiam a locução junto com a legenda que aparece na tela, como numa dublagem. Depois o tempo real das palavras substitui a estimativa.
