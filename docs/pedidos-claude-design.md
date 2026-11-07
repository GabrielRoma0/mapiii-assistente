# Pedidos para o Claude Design (V4, V5, V8, V9 e V10)

O design system Mapiii v2.0 foi feito no Claude Design, e o código **não pode** criar ícone novo nem redesenhar o Mapi (regra do `CLAUDE.md`). Por isso os dois pedidos abaixo são feitos lá, pela dupla. Abra o projeto do design system no Claude Design e cole um pedido de cada vez.

Quando o resultado sair, salve os arquivos nos lugares indicados e avise o Claude Code. Ele troca o código e confere contraste, tamanho e testes.

---

## V4 · Ícones de microfone e alto-falante

**Por que:** hoje os botões "Falar" e "Ouvir" usam o ícone de conversa, porque o design system não tem microfone nem alto-falante.

**Cole no Claude Design:**

> No design system Mapiii v2.0, crie dois ícones novos para o conjunto `assets/icons/`, no mesmo padrão dos 26 ícones existentes: grade de 24 × 24 px, traço de 2 px, pontas e cantos arredondados, sem preenchimento, cor `currentColor`, sem emoji e sem detalhe menor que 2 px.
>
> 1. `microfone`: microfone de mão simples, para o botão "Falar a pergunta".
> 2. `alto_falante`: alto-falante com duas ondas de som, para o botão "Ouvir a resposta".
>
> Entregue os dois SVGs e o trecho para o `components/icons/icon-paths.js`. Mostre os dois ao lado de `conversa`, `escudo_check` e `lista`, nos temas claro e escuro, para conferir que o peso visual é o mesmo.

**Onde salvar:**
- `design-system/assets/icons/microfone.svg`
- `design-system/assets/icons/alto_falante.svg`
- o trecho novo em `design-system/components/icons/icon-paths.js`

---

## V5 · Mapi no tema escuro

**Por que:** no tema escuro, os braços e as pernas do Mapi, que são indigo, somem no fundo indigo. O design system lista "versões no modo escuro" como lacuna.

**Cole no Claude Design:**

> No design system Mapiii v2.0, crie a versão do personagem Mapi para fundo escuro (fundo Space Indigo `#22223B`). Mesmo desenho, mesmas proporções e as mesmas 13 poses (bom, atencao, evite, chuva, comemorando, agradecendo, ouvindo, procurando, achei, verificado, duvida, recusa, esperando). Troque só as cores que somem no fundo escuro (braços, pernas e contornos indigo) por tons da paleta que tenham pelo menos 3:1 de contraste com `#22223B`. Sem animação e sem mudar a forma. Mostre as 13 poses lado a lado nas versões clara e escura.

**Onde salvar:** junto do personagem atual (`design-system/MapiPersonagem.dc.html` e os arquivos que ele usa), com o sufixo `-escuro`.

---

## V8 · Mapi com cara de 3D, só para o vídeo pitch (caminho A)

**Por que:** o vídeo pitch é o que decide a nota. Um Mapi com volume (estilo brinquedo de vinil) dá vida às cenas animadas. Decidido pelo Thor em 07/11: fazer **a partir do desenho atual** no Claude Design (e não gerar um personagem novo em outra ferramenta), para o Mapi do vídeo ser o mesmo do app. **Não entra no app:** o app continua com o Mapi plano.

**Cole no Claude Design:**

> No design system Mapiii v2.0, crie uma versão "3D" do personagem Mapi **só para vídeo**, aplicando volume em cima do desenho atual de `MapiPersonagem`. A forma, as proporções, o rosto e as cores **não mudam**: continua a pinha em formato de pino de mapa, com as folhinhas no topo e os relevos do piso tátil, os mesmos braços e pernas, a mesma paleta (Space Indigo `#22223B`, `#4A4E69`, rosa `#CF7A93`, verde `#36704A`, `#5FA8A0`, dourado `#D9A441`).
>
> Estilo: brinquedo de vinil macio e brilhante. Volume com gradientes suaves, um brilho especular discreto no alto à esquerda, luz de contorno leve, sombra interna nas dobras e relevos do piso tátil com sombra própria. Luz sempre vinda do alto à esquerda, igual em todas as poses. Sem texto, sem fundo e **sem sombra no chão** (a sombra é feita na animação).
>
> Faça estas 6 poses, a partir das poses que já existem: `bom` (apresentação), `atencao` (o problema), `verificado` (fonte oficial), `ouvindo` (aviso falado do ônibus), `recusa` (sabe dizer não) e `comemorando` (fecho).
>
> Mostre as 6 lado a lado, cada uma ao lado da versão plana atual, para conferir que é o mesmo personagem. Mostre também sobre o fundo Seashell `#F2E9E4` e sobre Space Indigo `#22223B`.
>
> Entregue cada pose como imagem PNG com fundo transparente, 2048 × 2048 px, com o personagem centralizado e no mesmo enquadramento em todas. Se não for possível exportar PNG, entregue cada pose em SVG ou num arquivo HTML separado, com fundo transparente.

**Onde salvar:** `video/mapi-3d/` com o nome da pose (`bom.png`, `atencao.png`, `verificado.png`, `ouvindo.png`, `recusa.png`, `comemorando.png`). Se vier em SVG ou HTML, salve do mesmo jeito; o Claude Code gera os PNG transparentes a partir deles.

**Como conferir (o Claude Code faz):** as 6 poses ao lado da versão plana, mesmo tamanho e enquadramento, nenhuma cor fora da paleta, contorno legível sobre os dois fundos.

---

## V9 · Quadros de referência do vídeo pitch (16:9)

**Por que:** guiar a animação das cenas do [roteiro v2](../video/roteiro-v2.md). O Claude Code anima no Remotion a partir destes quadros, com os mesmos tokens.

**Cole no Claude Design** (depois do V8):

> No design system Mapiii v2.0, crie um arquivo novo "Mapiii Pitch Quadros 16x9", no mesmo formato de `Mapiii Direitos Video 16x9` (uma seção 1920 × 1080 por quadro), só com os tokens, as fontes (Nunito) e os ícones do design system. Fundo Seashell `#F2E9E4`, texto Space Indigo `#22223B`, títulos em Nunito 900 com uma palavra em destaque por quadro. Use o Mapi com cara de 3D (V8) onde indicado. Sem foto, sem texto além do indicado.
>
> 1. **Ponto de ônibus:** ilustração plana vista de lado, uma pessoa em cadeira de rodas em silhueta no ponto, ônibus parado com a porta aberta e a rampa recolhida. Texto: "O ônibus chegou. **A rampa, não.**"
> 2. **Três cartões:** "Espalhada.", "Difícil.", "**Com golpe.**", o terceiro com o ícone `golpe`.
> 3. **Número grande:** um número de exemplo "00.000.000" bem grande (será trocado pelo valor oficial) e embaixo "Fonte: IBGE, Censo 2022".
> 4. **Logo:** logo do Mapiii grande, "o mapa dos seus direitos" e o Mapi 3D `bom` ao lado.
> 5. **Pode ter direito:** "você tem direito" riscado, "**pode ter direito**" embaixo, o componente SourceChip ampliado e o Mapi 3D `verificado`.
> 6. **Sabe dizer não:** Mapi 3D `recusa` e o texto "**Emergência: 192**".
> 7. **Números:** "**12 de 12** recusas corretas" e "Acessibilidade **100**", um em cada metade.
> 8. **Mapa que cresce:** contorno simples do mapa-múndi em traço fino, o pino do Mapi aceso em São Paulo e pinos menores acesos em outras cidades do Brasil e de outros países. Selo fixo no canto superior direito: "VISÃO DE FUTURO". Texto: "Troque a base. Outra cidade. Outro estado. **Outro país.**"
> 9. **Fecho:** logo, "Você pode ter direito. **Agora, você sabe onde ir.**", Mapi 3D `comemorando` e, pequeno, "Protótipo de estudo, não é canal oficial. · FIAP Global Solution 2026".
>
> Confira contraste de 4,5:1 em todo texto.

**Onde salvar:** `design-system/Mapiii Pitch Quadros 16x9.dc.html` (e os arquivos que ele usar).

---

## V10 · Capa do vídeo no YouTube

**Cole no Claude Design** (depois do V9):

> No design system Mapiii v2.0, crie a capa do vídeo pitch para o YouTube, 1280 × 720 px: o Mapi 3D `atencao` grande à direita, à esquerda o título em Nunito 900 "O ônibus chegou. **A rampa, não.**" e, menor, o logo do Mapiii. Fundo Seashell com um toque de rosa `#CF7A93`. Legível em tamanho pequeno (como aparece na lista do YouTube). Entregue em PNG.

**Onde salvar:** `video/capa.png`.

---

## Depois de salvar

Diga ao Claude Code "os ícones chegaram" ou "o Mapi escuro chegou". Ele:
1. troca o ícone nos botões de falar e ouvir, ou faz o Mapi trocar de versão sozinho no tema escuro;
2. roda `npm run verificar` e `npm run e2e` (acessibilidade nos dois temas);
3. marca V4 e V5 no [plano de melhorias](plano-de-melhorias.md) e no [PENDENCIAS](../PENDENCIAS.md).
