# Mapiii — Design System

Mapiii é o **mapa dos seus direitos**: um assistente digital que orienta famílias de pessoas com deficiência (começando por quem usa cadeira de rodas) e cidadãos em geral sobre direitos e serviços públicos em São Paulo, sempre com fontes verificáveis e data de conferência.

**Etapa 2 (visão de futuro):** o mapa colaborativo de calçadas (fotos classificadas por IA e painel da prefeitura) continua documentado em `Mapiii Visao de Futuro.dc.html`. As cores e formas das categorias de calçada saem da interface principal, mas ficam nos tokens.

**Arquivos vigentes (v2.0, nov 2026):** `Mapiii Mapa dos Direitos.dc.html` (guia, componentes, estados do personagem, telas), `DireitosTela.dc.html` (telas mobile por `tela`), `Mapiii Direitos Video 16x9.dc.html` e `Mapiii Direitos Slides.dc.html`.

**Público:** pessoas com mobilidade reduzida, cadeirantes e seus cuidadores, pessoas com deficiência visual, idosos, mães e pais com carrinho de bebê, e gestores públicos.
**Idioma:** português do Brasil.

**Superfícies**
1. **App cidadão (PWA, mobile-first):** entrada/perfil, mapa, registrar foto, detalhe com classificação da IA.
2. **Painel da prefeitura (desktop):** mapa de calor, ranking de trechos por prioridade, exportar CSV.

**Fontes:** a identidade foi criada neste projeto. As referências são `Mapiii Identidade Visual v2.dc.html` (versão vigente) e `Mapiii Identidade Visual.dc.html` (v1 histórica). A referência de atmosfera foi o projeto "Rodomapa" (Behance): nada foi copiado dele.

---

## Índice

- `styles.css` é o ponto de entrada e só tem `@import`s:
  - `tokens/fonts.css`: Nunito e IBM Plex Mono (Google Fonts)
  - `tokens/colors.css`: paleta, semânticas, categorias, aliases e o tema escuro (`[data-theme="dark"]`)
  - `tokens/typography.css`: famílias e escala `--text-*`
  - `tokens/spacing.css`: espaços, cantos, alvos de toque, sombras, foco e movimento
  - `tokens/base.css`: reset, links e `:focus-visible`
- `assets/logo/`:
  - símbolo: `mark.svg`, `mark-mono.svg`, `mark-inverse.svg`
  - ícones de app: `app-icon.svg`, `favicon.svg`
  - logo horizontal: `logo-horizontal*.svg` (o "a" está em texto; converta para curvas antes de imprimir)
- `assets/icons/`: 26 ícones SVG, com 24 px de grade e traço de 2 px.
- `components/`:
  - `brand/`: `Logo`, `Mark`
  - `core/`: `Button`, `IconButton`, `Input`, `Checkbox`, `FilterChip`
  - `feedback/`: `Badge`
  - `data/`: `CategoryMarker` (e `CATEGORIES`), `CategoryTag`, `SeverityPicker` (e `SEVERITY`), `OccurrenceCard`
  - `navigation/`: `TabBar`
  - `icons/`: `Icon`, `icon-paths.js`
- `guidelines/`: cards de fundamentos (cores, contraste, tipo, espaço, logo, ícones, voz, acessibilidade).
- `ui_kits/app/`: app cidadão clicável (Entrar → Mapa → Registrar → Detalhe).
- `ui_kits/painel/`: painel da prefeitura.
- `SKILL.md`: uso como Agent Skill.

**Componentes adicionados por necessidade:** `Icon` (que embala o conjunto de ícones) e `Phone` (moldura do kit). Não há fonte de componentes anterior: o conjunto foi definido nesta identidade.

---

## CONTENT FUNDAMENTALS — tom e texto

- **Assistente de direitos:** acolhedor, calmo e honesto, nunca infantil. O público é adulto e muitas vezes está num momento delicado. Nunca diga "você tem direito": use "Pode ter direito", "Talvez" ou "Provavelmente não se aplica". Quando não souber: "Não encontrei isso na minha base." e indique o canal oficial.
- **Aviso fixo:** "Sou um protótipo de estudo, não um canal oficial. Confirme nas fontes indicadas."

- **Tom:** acolhedor, confiável, cívico e simples. Nunca infantil nem burocrático.
- **Pessoa:** o app fala com "você" e se refere a si mesmo pouco, sem "nós" corporativo. Exemplo: "Você confirma antes de publicar."
- **Frases:** curtas, com verbo no começo e no presente. "Fotografe a calçada inteira, com a rua aparecendo."
- **Caixa:** frases em caixa normal, só com a primeira letra maiúscula, em títulos e botões ("Enviar foto", "Onde agir primeiro"). Nunca use frase inteira em maiúsculas.
- **Nome:** "Mapiii" no texto corrido. No logo, o desenho é o próprio.
- **Inclusão:** use linguagem de pessoa primeiro ("pessoa com deficiência visual", "uso cadeira de rodas"). Evite "portador", "especial" e diminutivos.
- **IA:** seja transparente e peça ajuda: "IA tem dúvida – revisar", "Classificação da IA" com as porcentagens visíveis.
- **Números:** no formato brasileiro (1.284; 16,5%; 4,5:1). Datas relativas ("há 2 dias").
- **Emoji:** não use. Ícones vêm só do conjunto da marca.
- **Exemplos:**
  - Use "Obrigado. Sua foto já está no mapa.", não "Solicitação protocolada com sucesso."
  - Use "A IA tem dúvida. Pode conferir?", não "Classificação com baixo índice de confiança."

---

## VISUAL FOUNDATIONS

- **Cores:**
  - **Fundo e texto:** fundo Seashell `#F2E9E4`, texto Space Indigo `#22223B` (12,9:1). Dusty Grape `#4A4E69` faz o símbolo, os links e o texto secundário (6,8:1).
  - **Destaques:** Almond Silk `#C9ADA7` é para destaques e o botão primário do modo escuro, sempre com texto indigo. Lilac Ash `#9A8C98` é só decorativo, porque não passa como texto.
  - **Ação principal:** botão cheio em Space Indigo com texto Seashell.
  - **Poucas cores por tela:** neutros e uma ação. As cores de categoria aparecem só onde há categoria (mapa, tags, ranking).
- **Categorias:** cada uma combina cor, forma e ícone, para nunca depender só da cor.
  - sem_rampa_ou_degrau: quadrado roxo
  - obstaculo_no_caminho: triângulo laranja
  - calcada_quebrada: losango rosa
  - calcada_estreita: hexágono verde-água
  - sem_problema: círculo azul
  - O marcador sempre tem contorno e ícone em Space Indigo. O tom 500 é só preenchimento, o 700 é o único usado em texto e o 100 é o fundo de tag.
- **Semânticas:** erro em coral, alerta em âmbar, sucesso em verde. O selo de alerta tem também borda de 2 px e ícone.
- **Tipografia:**
  - **Família:** Nunito em tudo, com pesos 900 nos títulos, 800 nos rótulos e botões e 400 no corpo. IBM Plex Mono só para dados técnicos.
  - **Tamanhos:** corpo mínimo de 16 px e entrelinha de 1,5 a 1,65. Os títulos têm espaçamento entre letras negativo (de −0,01 a −0,03 em).
- **Cantos:** bem arredondados. 12 a 16 px em controles, 20 px em botões grandes, 28 a 36 px em cartões e painéis, pílula (999) em filtros e no botão Registrar.
- **Cartões:** fundo branco sobre Seashell, sem sombra, com borda de 2 px `--border-default` quando precisam se separar de outro branco. Nunca use cartão com borda colorida só à esquerda.
- **Sombras:** só em elementos que flutuam sobre o mapa (busca, botão Registrar, folha inferior). As sombras são suaves e na cor indigo.
- **Bordas:** 2 px por padrão e 3 px no item selecionado. Campos de formulário usam `#6E6A7E`, com 3:1 sobre branco.
- **Estados:**
  - **Hover:** o primário escurece ou clareia um tom; o secundário ganha fundo lilás claro.
  - **Toque:** sem encolher o elemento.
  - **Foco:** anel duplo, 3 px na cor do fundo mais 3 px em Space Indigo (âmbar `#FFC966` no modo escuro).
  - **Desabilitado:** borda tracejada, não só cor mais clara.
- **Fundos:** sólidos, sem degradês decorativos. O único degradê é a escala do mapa de calor.
- **Imagens:** só fotos reais de calçadas enviadas pelos usuários. Enquanto não houver foto, use o placeholder listrado diagonal. Nada de foto de banco de imagens.
- **Ilustração:** mínima. O mapa usa formas planas (ruas brancas, praças verde-acinzentadas).
- **Movimento:** transições de 120 a 200 ms em `cubic-bezier(0.2,0,0,1)`, só de cor e opacidade, sem quiques. Tudo desliga com `prefers-reduced-motion`.
- **Transparência e desfoque:** não use, com uma exceção: o halo branco a 85% do marcador selecionado no mapa.
- **Layout:**
  - **Mobile:** 390 px de largura, margens de 20 a 24 px, ação principal fixa no rodapé com 56 a 64 px de altura e abas inferiores com 80 px.
  - **Desktop:** barra lateral de 232 px.
- **Alvos de toque:** mínimo de 48 px, 56 px nas ações principais e 64 px em "Enviar foto" e "Registrar".

---

## ICONOGRAPHY

- **Conjunto:** próprio, em `assets/icons/*.svg` e no componente `Icon`. Grade de 24 px, traço de 2 px com `stroke-linecap` e `stroke-linejoin` arredondados, sem preenchimento e com `currentColor`.
- **Ícones:** as 5 categorias (degrau, obstáculo, quebrada, estreita, ok), câmera, local, filtro, gravidade g0 a g3 (0 a 3 barras acesas), enviar, revisar, IA, mapa, busca, download, voltar, fechar, mais, check, usuário, lista, gráfico e galeria.
- **No mapa:** use `CategoryMarker`, com forma, ícone e contorno.
- **Rótulos:** ícone sempre acompanhado de texto. Ícone sozinho só em `IconButton` com `label`.
- **Fontes de ícones:** sem fonte de ícones, sem emoji e sem caracteres Unicode como ícone. As únicas exceções são ✓ e ✕ dentro de mensagens.
- **Tamanhos:** 20 a 28 px na interface e 32 a 34 px nos destaques.

---

## Personagem (Mapi, a pinha)

- Papel: guia e assistente. Pequeno (44 a 64 px) ao lado das mensagens, nunca cobre conteúdo, sempre com o rótulo "Mapi · Estado" e texto. O desenho é decorativo (`aria-hidden`).
- Poses: bom, atencao, evite, chuva, comemorando, agradecendo (originais) e ouvindo, procurando, achei, verificado, duvida, recusa, esperando (novas, mesmo corpo e traço). Sem animações; pose estática também com prefers-reduced-motion.
- Estados → pose: Olá = bom; Ouvindo = ouvindo; Procurando = procurando (lupa); Achei = achei (brilho); Verificado = verificado (escudo com check); Dúvida honesta = duvida (interrogação); Atenção = atencao; Recusa gentil = recusa (mão aberta); Acolhimento = agradecendo; Comemorando = comemorando (só ao concluir checklist); Esperando = esperando.

## Componentes do assistente

DisclaimerBanner, SourceChip, SourceTypeBadge (Fonte oficial, Fonte secundária, Pode estar desatualizada), RightCard, Checklist, ChatBubble, AnswerCard, WizardStep, EligibilityChip, ScamCheckResult (Oficial, Suspeito, Não sei) e Timeline. Especificação e exemplos em `Mapiii Mapa dos Direitos.dc.html`, seção 05.

**Ícones novos:** documento, onde_ir, prazo, escudo_check, golpe, link, passos, conversa, calendario, mais alerta e duvida (já usados em Visão de futuro). Em `MapiIcon.dc.html`, `icon-paths.js` e `assets/icons/`.

## Logo

- **Conceito:**
  - O "M" é uma rampa: a perna esquerda tem altura de maiúscula e a direita, a altura do "a".
  - O "p" é uma roda de cadeira de rodas, com aro, eixo e raios suaves.
  - Os três "i" (informação, independência e inclusão) descem em escadinha.
  - O último pingo é uma pinha (o "ma-pinha"), com formato de pino de mapa, folhinhas no topo e os relevos do piso tátil de alerta.
- **Versões:** cor, monocromática e invertida. O símbolo sozinho serve de app icon e favicon e continua legível em 16 px.
- **Área de proteção:** igual à altura da pinha. O mínimo é 80 px de largura para o horizontal e 16 px para o símbolo.
- **Não faça:** distorcer, girar, trocar as cores, aplicar sobre fundo poluído ou recriar o logo com outra fonte.

## Acessibilidade (obrigatório)

- Contraste de 4,5:1 para texto e de 3:1 para texto grande e ícones (a tabela está em `guidelines/contrast.html`).
- Alvos de toque com pelo menos 48 × 48 px e 8 px entre eles.
- Nunca informar só com cor.
- Foco visível em todo elemento interativo.
- Corpo mínimo de 16 px e layout que aguenta zoom de 200%.
- Texto alternativo em todas as fotos.
- Rótulo de campo sempre visível.
- Linguagem simples.

## Avisos

- **Fontes (alterado neste projeto):** a Nunito vem de arquivo local (`fonts/nunito-latin-wght-normal.woff2`, OFL), e não do Google Fonts, para não enviar o IP da pessoa a terceiros e funcionar offline. O IBM Plex Mono não é carregado: os dados técnicos caem na fonte monoespaçada do sistema. O `@import` original está comentado em `tokens/fonts.css`.
- **Logo horizontal em SVG:** o "a" está em texto. Converta para curvas num editor vetorial antes de mandar para gráfica.
