# Pacote para o Claude Design (vídeo pitch)

Tudo o que precisa ser mandado ao Claude Design para o vídeo pitch do [roteiro v2](../roteiro-v2.md). São três pedidos, **um de cada vez e nesta ordem**, porque o segundo e o terceiro usam o Mapi 3D do primeiro.

| Ordem | Pedido (texto para colar) | Anexar junto | O que volta | Onde salvar |
|---|---|---|---|---|
| 1 | [pedido-1-mapi-3d.txt](pedido-1-mapi-3d.txt) | os 8 PNGs de `referencias/` (a folha `mapi-plano-todas-as-poses.png` e uma imagem de cada pose pedida) | 7 PNGs transparentes do Mapi 3D | `video/mapi-3d/bom.png`, `atencao.png`, `procurando.png`, `verificado.png`, `ouvindo.png`, `recusa.png`, `comemorando.png` |
| 2 | [pedido-2-quadros-16x9.txt](pedido-2-quadros-16x9.txt) | nada (o Mapi 3D já está na conversa) | 13 quadros 1920 × 1080 | exportar e salvar em `video/quadros/` (`01.png` a `13.png`), ou o HTML em `design-system/Mapiii Pitch Quadros 16x9.dc.html` |
| 3 | [pedido-3-capa-youtube.txt](pedido-3-capa-youtube.txt) | nada | 1 PNG 1280 × 720 | `video/capa.png` |

As imagens em `referencias/` foram geradas do próprio componente do app (`src/ui/MapiPersonagem.tsx`), então são o Mapi exato de hoje. A folha mostra também o fundo escuro, onde os braços somem: por isso o pedido 1 pede luz de contorno no 3D.

## Passo a passo (primeira vez)

1. **Abra o Claude Design.** Entre no claude.ai com a sua conta e procure **Design** no menu. O endereço antigo, claude.ai/design, vai fechar em 14/12/2026: se ele mandar para outro lugar, siga para onde ele mandar.
2. **Ache o projeto do design system "Mapiii".** Foi criado numa das contas da dupla.
   - Se aparece para você: abra.
   - Se não aparece: peça para quem criou compartilhar com você, ou faça os pedidos na conta dessa pessoa.
   - Se ninguém achar: crie um design system novo e envie o arquivo `design-system-mapiii.zip` (a pasta `design-system/` do repositório compactada). Ele tem os tokens, os ícones, o logo e o `MapiPersonagem`.
3. **Comece um design novo usando esse design system**, para ele já conhecer as cores, as fontes e o Mapi.
4. **Anexe as imagens** da coluna "Anexar junto" (arrastar para a caixa de mensagem).
5. **Abra o arquivo do pedido, copie tudo e cole** na caixa de mensagem. Envie.
6. **Confira e peça ajustes no mesmo chat.** Exemplos do que dizer:
   - "O rosto mudou. Mantenha os olhos e a boca iguais aos da imagem anexada."
   - "A cor do corpo saiu diferente. Use exatamente a cor da versão plana."
   - "Os braços sumiram no fundo escuro. Coloque uma luz de contorno clara neles."
   - "Deixe todas as poses do mesmo tamanho e no mesmo lugar do quadro."
7. **Exporte** cada imagem (procure "exportar" ou "baixar"). Se só der HTML ou SVG, baixe assim mesmo.
8. **Mande para o Claude Code** (arrastando no chat ou salvando nas pastas da tabela) e diga "o Mapi 3D chegou". Ele confere: mesmo personagem, cores só da paleta, contorno legível nos dois fundos, mesmo tamanho e enquadramento. Se veio em HTML ou SVG, ele gera os PNGs.

Só depois disso, o pedido 2. Depois do pedido 2, o pedido 3.

## Cuidados

- **Não aceite texto inventado nas telas.** Os quadros pedem linhas cinza no lugar de lei, valor, prazo, telefone e link. Se o Claude Design escrever um texto desses, peça para trocar por linhas cinza.
- **"Pode ter direito", nunca "você tem direito".** Vale para todo quadro.
- O Mapi 3D é **só para o vídeo**. O app continua com o Mapi plano.
