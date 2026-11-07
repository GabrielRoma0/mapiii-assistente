# Pedidos para o Claude Design (V4, V5 e V8)

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

## Depois de salvar

Diga ao Claude Code "os ícones chegaram" ou "o Mapi escuro chegou". Ele:
1. troca o ícone nos botões de falar e ouvir, ou faz o Mapi trocar de versão sozinho no tema escuro;
2. roda `npm run verificar` e `npm run e2e` (acessibilidade nos dois temas);
3. marca V4 e V5 no [plano de melhorias](plano-de-melhorias.md) e no [PENDENCIAS](../PENDENCIAS.md).
