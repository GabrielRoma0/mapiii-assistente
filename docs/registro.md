# Registro do trabalho

Diário do que foi feito no Mapiii, em ordem: o que foi pedido, o que foi decidido, o que mudou no código, como foi conferido e o que ficou sem conferir. Serve para a dupla (Thor e Gabriel) saber o histórico sem precisar ler os commits.

**Como manter:** a cada sessão de trabalho, acrescente uma seção com a data no fim deste arquivo. O plano do que vem pela frente está em [plano-de-melhorias.md](plano-de-melhorias.md); as tarefas humanas, em [../PENDENCIAS.md](../PENDENCIAS.md).

---

## 05/11/2026 · Gabriel: base do projeto

- Commit `dc6d287`: protótipo inteiro (MVP), banco da conta opcional (Fase 2) e Embarque garantido por linha (Fase 3), com 236 testes e 34 verificações de banco.
- Escrito a partir do plano de ação da dupla, antes do guia v2.

---

## 06/11/2026 · Thor com o Claude Code

### 1. Leitura e diagnóstico (sem mexer em nada)

- Clonado o repositório e lido de ponta a ponta: documentação, dados, todo o `src/`, os 17 arquivos de teste, Supabase, scripts e `eval/`. Os arquivos visuais do `design-system/` (`.dc.html`, SVGs, CSS) não foram lidos linha por linha.
- Estado conferido rodando os comandos:

| Conferência | Resultado |
|---|---|
| `npm run verificar` | 236 testes passando |
| `npm run test:banco` | 36 verificações passando |
| `npm run build` | ok |
| `npm run auditar-perguntas` | falha esperada: base vazia |
| Fichas em `data/kb.json` | 0 |

- Problemas encontrados: datas impossíveis (31/02) aceitas em dois arquivos de dados; falta de `.gitattributes` (diffs falsos no Windows); imports sem extensão (aviso do Vite); sem CI; rótulo "Resultado" errado no "Voltar" da Rota.

### 2. Cruzamento com os guias da dupla

- Lidos o guia **v2 (PDF, 04/11)** e o guia do case (DOCX). O guia v2 passou a ser a referência de escopo e prazo (**entrega 19/11**).
- Diferenças achadas: Embarque feito por linha (o guia pede por ponto, com previsão); faltavam Me negaram, Mostre ao motorista, Cartão da cadeira, voz, modos pessoa e cuidador, checklist para compartilhar, atalhos, campos novos das fichas, indicador de facilidade de uso, ODS; a conta opcional (login) não está no guia.

### 3. Decisões

| Decisão | Quem | Resultado |
|---|---|---|
| Embarque por ponto ou por linha | Thor | Por ponto, com linha como opção |
| Voz | Thor | Voz padrão de cada aparelho |
| Conta opcional (login) | Proposta | Cortar (guia pede "nenhum login"); falta Gabriel confirmar |
| Lembrar respostas no aparelho | Thor | Sim, desmarcado por padrão |
| Confirmação antes de apagar | Thor | Sim, na própria tela e acessível |
| Parte humana (fichas, token) | Thor | Depois, junto com o Gabriel |

### 4. Escopo do guia v2: commit `049448b` (pull request #1, aceito no `main` como `db9ed7e`)

54 arquivos (17 novos, 37 alterados, nenhum apagado), +3.209 / −368 linhas, 271 testes.

- **Conferido antes de programar:** a documentação oficial da API Olho Vivo para ponto (`/Parada/Buscar`) e previsão (`/Previsao/Parada`), que trazem o horário previsto `t` e o campo acessível `a`.
- **Embarque por ponto:** Edge Function com 4 ações (`linhas`, `veiculos`, `paradas`, `previsao`), cliente, modo exemplo com pontos fictícios, simulador e a tela com abas "Por ponto" e "Por linha".
- **Telas novas:** Garanta na rua, Me negaram (modelo de pedido com a lei), Mostre ao motorista (QR próprio, conferido com um leitor real nas versões 1 a 10), Cartão da cadeira, Lista única para o laudo, Atalhos.
- **Acessibilidade:** falar e ouvir, modos "Sou a pessoa" e "Cuido de alguém", checklist com compartilhar, copiar e imprimir, selo "conferida há X dias".
- **Fichas:** campos novos `base_legal`, `frase_motorista`, `modelo_recurso`, `requisitos_laudo`, `atalhos`; o validador recusa "você tem direito".
- **Outros:** Reclamação pronta fora da flag; folha de teste com facilidade de uso (SUS) e comparação com busca na web; ODS em Sobre; correções do item 1; CI no GitHub Actions; README, PENDENCIAS e CLAUDE.md seguindo o guia v2.
- **Conferido:** tipos, testes, dados e build; navegador com o fluxo de triagem, todas as telas novas, Embarque por ponto com o simulador (com acessível, sem acessível, API fora, texto inválido) e no modo exemplo; 320 px sem rolagem lateral; temas claro e escuro.
- **Também entregue:** PDF "Mapiii · o que mudou" para mostrar à dupla (fora do repositório).

### 5. Lembrar respostas no aparelho: commit `1398513`

- Caixa "Lembrar minhas respostas neste aparelho", desmarcada por padrão, na Rota e em Sobre. Guarda só ids e valores das perguntas no `localStorage`; desmarcar apaga.
- Regra do `CLAUDE.md` atualizada. 6 testes novos (277 no total).
- **Conferido no navegador:** começa desmarcado e sem nada guardado; marcar grava; recarregar traz de volta; desmarcar apaga.

### 6. Aviso de respostas guardadas: commit `7284a1f`

- No Início, quando há respostas guardadas: "Suas respostas estão guardadas neste aparelho", com "Ver minha rota" e "Apagar".
- **Conferido no navegador**, inclusive em tela estreita.

### 7. Confirmação antes de apagar: commit `9bd9f61`

- "Apagar" pergunta na própria tela: "Sim, apagar" e "Não, manter"; Esc cancela.
- Achado e corrigido no teste: o foco se perdia depois de cancelar ou apagar. Agora volta ao botão ou vai ao título.
- **Conferido com teclado de verdade** (clique, Esc, Enter, Tab).

### 8. Registro e plano de melhorias

- Criados este registro e o [plano de melhorias](plano-de-melhorias.md), separado por tipo, com ordem, como cada uma vai ser feita e os destaques para o vídeo. Nenhuma melhoria começada antes do plano.

### 9. Fase A do plano de melhorias (rede de segurança)

Autorizada pelo Thor. Ferramentas novas **só de desenvolvimento** (não vão para o app): `@playwright/test` 1.64.1, `@axe-core/playwright` 4.14.0, `@lhci/cli` 0.15.1.

- **T1 · testes de tela** (`4493c12`): 9 roteiros no Playwright (triagem, pergunta, emergência 192, Me negaram, Embarque por ponto, lembrar e apagar, foco ao trocar de tela, aviso de protótipo, tela de erro), no celular e no computador. `npm run e2e`; job no CI. Decisão: `VITE_BASE_EXEMPLO=true` força a base fictícia no dev, para os testes não dependerem das fichas reais.
- **T5 · tela de erro** (`39a656b`): se uma tela quebrar, aparece "Algo deu errado nesta tela" com "Voltar ao início". Teste escrito antes e visto falhando.
- **T2 · auditoria** (`33a986f`): axe em 17 telas, temas claro e escuro, **sem nenhum problema grave**; conferido que o teste pega um erro injetado de propósito. Lighthouse no build: **desempenho 100, acessibilidade 100, boas práticas 100, SEO 100** no app. `npm run lighthouse`; job no CI, relatório só em arquivo.
- Correção: duas versões do `playwright-core` quebravam a checagem de tipos; fixada uma só (`overrides` no `package.json`).
- Decisão de ordem: T1 antes de T5, porque a tela de erro só dá para testar num navegador de verdade.
- Totais: 278 testes de lógica e 86 execuções de testes de tela, todos passando.

### 10. Fase B do plano de melhorias (fluidez principal)

- **F1 · barra inferior** (`5bfa976`): Início, Perguntar, Na rua e Sobre, com a aba atual marcada para o leitor de tela; escondida na triagem (que já tem o botão fixo "Continuar"). Decisão: o conteúdo passou a rolar num contêiner próprio e a barra fica fora dele, porque o axe mostrou que uma barra flutuante cobria alvos de toque.
- **F2 · Rota mais limpa** (`e0f7aff`): "Provavelmente não se aplica" recolhido; "Mudar uma resposta" abre a triagem direto na pergunta e volta para a rota.
- **F6 · compartilhar a Rota**: "Levar esta rota" com compartilhar, copiar e imprimir; vão só os direitos possíveis, sem as respostas da triagem.
- Testes de lógica escritos antes e vistos falhando; 4 testes de tela novos. Totais: 282 testes de lógica e 92 execuções de testes de tela, todos passando.

### 11. Fase C do plano de melhorias (Embarque ao vivo)

- **F3 · Embarque ao vivo** (`d5072fc`): a previsão do ponto se atualiza sozinha a cada 30 s, mostra "há X s" e tem "Pausar atualização". O leitor de tela só fala quando muda o próximo ônibus acessível, e não a cada 30 s. Os últimos 3 pontos aparecem para buscar de novo, só com "Lembrar" ligado (desligar apaga). Decisão: no modo exemplo, os minutos também diminuem, para a contagem aparecer no vídeo.
- **F7 · aviso de chegada falado** ⭐ (`d5072fc`): "Me avise quando estiver chegando" fala e vibra quando o próximo acessível está a 2 minutos: "O ônibus EX01-10 acessível chega em 2 min." Uma vez por ônibus, com a tela aberta.
- **T7 · sem internet** (`d5072fc`): a última previsão continua na tela com a hora e o aviso "Sem internet agora". Decisão: vale também quando a atualização falha com internet.
- **V3 · esqueleto**: blocos cinza enquanto o ponto e a previsão carregam. Sem teste próprio (é só visual e escondido do leitor de tela); coberto pelo axe.
- Testes de lógica escritos antes e vistos falhando; testes de tela com o relógio adiantado 12 minutos e com o navegador sem internet. Totais: 286 testes de lógica e 96 execuções de testes de tela, todos passando.

### 12. Fase D do plano de melhorias (cara de app)

- **V7 · tamanho do texto** ⭐ (`28e572a`): botões A, A+ e A++ no Início e em Sobre (100%, 115%, 130%), guardados no aparelho como o tema. Decisões: feito com CSS `zoom` (todo o CSS usa px, então mudar o tamanho base não funcionaria) e só no conteúdo, porque com A++ a barra inferior não cabia em 320 px. O axe apontou que o nome dos botões precisava conter o texto visível ("A++"), para quem usa controle por voz; corrigido.
- **V2 · transição suave** (`ff9f81b`): esmaecer de 160 ms ao trocar de tela; desliga para quem pede menos movimento.
- **T6 · abrir mais rápido** (`ff9f81b`): cada tela carrega só quando é aberta. O código inicial do app caiu de 73,3 kB para 22,6 kB (de 22,3 para 7,8 kB comprimidos). O service worker continua guardando tudo para uso sem internet.
- **V1 · atalhos e capturas** ⭐: segurar o ícone no Android mostra "Próximo ônibus acessível" (só se o Embarque estiver ligado no build), "Me negaram" e "Fazer uma pergunta"; duas capturas aparecem na tela de instalação (fora do cache do aparelho).
- **T4 · aviso de nova versão**: o app instalado mostra "Nova versão do Mapiii disponível" com "Atualizar agora" e "Depois".
- Conferido no build de produção: o service worker ativa e o app recarrega com o navegador sem internet. Totais: 288 testes de lógica e 100 execuções de testes de tela, todos passando. Falta conferir num Android os atalhos e as capturas.

### 13. Fase E do plano de melhorias (bônus)

- **T3 · conferência das fontes** (`700667b`): `npm run conferir-links` abre todos os links oficiais de `data/` e lista os quebrados com a ficha onde aparecem; o GitHub roda toda segunda às 9h e avisa por e-mail se algum falhar. Rodado de verdade: os 2 links atuais respondem.
- **F4 · sugestões enquanto digita** (`27ed102`): a partir de 3 letras, até 3 perguntas de exemplo das fichas aparecem embaixo do campo; tocar envia. Decisão: botões em vez de lista com setas (mais simples para leitor de tela e toque).
- **F5 · boas-vindas** (`0b041fc`): cartão no Início com os três atos e "Entendi", que some para sempre no aparelho. Decisão: cartão em vez de 3 telas, para não bloquear o uso.
- **P1 · modo um toque (varredura)** ⭐: botão "Usar com um toque" no Início e em Sobre. As opções da tela se destacam uma por vez (anel amarelo grosso, e o leitor de tela lê); um toque em qualquer lugar, ou Espaço/Enter (o que um acionador manda), escolhe a destacada, e o toque não aciona o que está debaixo do dedo. Velocidade devagar (4 s), média (2,5 s) ou rápida (1,5 s) em Sobre. "Sair do modo um toque" entra na varredura como primeiro item. Vale para o app inteiro.
- Testes de lógica escritos antes e vistos falhando; testes de tela para os quatro, incluindo tocar em cima de outro link com o modo um toque ligado. Totais: 294 testes de lógica e 106 execuções de testes de tela, todos passando.
- Falta: testar o modo um toque com uma pessoa que usa acionador.

### Fora do repositório (só neste computador)

- `.env.local`: liga o Embarque com o simulador. **Antes do build de produção, precisa apontar para o Supabase da dupla.**
- `.claude/launch.json` na pasta acima do repositório: para abrir o app no painel do navegador.
- PDF "Mapiii-o-que-mudou-06-11.pdf".

### O que ainda não foi conferido

- Voz, instalação do app e leitura do QR **num celular de verdade**.
- Leitor de tela real (TalkBack ou VoiceOver).
- API da SPTrans real (falta o token).
- Tudo que depende das fichas reais (base ainda vazia).

### 14. Planejamento completo

- `PENDENCIAS.md` reescrito como planejamento até a entrega: estado real conferido (0 fichas, gabarito só com recusas, sem token, sem site, sem teste com pessoas), pendências obrigatórias com dono e prazo, cronograma dia a dia de 07 a 19/11, como fazer cada uma, decisões até 10/11, melhorias que faltam (todas dependem da dupla), roteiro do pitch com os destaques, as 8 disciplinas e os riscos.
- Conferido antes: `main` local igual ao do GitHub; os 4 trabalhos do CI (verificação, testes de tela, Lighthouse e banco) passando nos envios.

---

## 07/11/2026 · Gabriel com o Claude Code

### H4. Subprefeituras

- `main` local atualizado com os 24 commits do Thor; `npm run verificar` com 294 testes passando; base com 0 fichas.
- Comparadas as 32 opções de `p_subprefeitura` com a [lista oficial da Prefeitura](http://prefeitura.sp.gov.br/subprefeituras/w/subprefeituras/8978): nenhuma falta, nenhuma sobra.
- Três aparecem abreviadas no índice oficial: Casa Verde, Mboi Mirim e Perus. **Decisão do Gabriel:** manter os nomes completos do app (Casa Verde/Cachoeirinha, M'Boi Mirim, Perus/Anhanguera). Nenhuma mudança em `data/perguntas.json`.

### H7. Supabase

- Projeto `mapiii` criado pelo Gabriel no painel (o Claude Code preencheu nome e região; a senha do banco ficou com o Gabriel). Região São Paulo, "expor tabelas novas automaticamente" desligado, nenhuma migração aplicada.
- `.env.local` criado com `VITE_SUPABASE_URL` e `VITE_SUPABASE_PUBLISHABLE_KEY` (ignorado pelo git). Chave conferida: a API do projeto respondeu 200 com ela e 401 com uma chave errada.
- Falta: H8 (token da SPTrans, segredo da função e deploy da `onibus`).

### Roteiro do vídeo pitch

- Pasta `video/`: roteiro (29 cenas, 435 palavras, cerca de 3:00), gravações G1 a G6, legendas, audiodescrição, notas de edição, checklist até 19/11 e estrutura do vídeo técnico. Números que ainda não existem ficam como [PENDENTE]; nada de IA, e o Embarque só com o selo EXEMPLO.

### H8. SPTrans (em andamento)

- Aplicativo "Mapiii" cadastrado na área de desenvolvedor da SPTrans (conta do Gabriel). A chave foi guardada pelo Gabriel como segredo `SPTRANS_TOKEN` no Supabase; o Claude Code preencheu o nome do segredo e nunca leu a chave.
- Função `onibus` publicada no projeto `mapiii` (`supabase functions deploy onibus --use-api`).
- **Correção:** a SPTrans responde 411 (Length Required) a um POST de login sem corpo. O login agora vai com corpo vazio. Teste novo em `tests/onibus-servidor.test.ts`; `npm run verificar` com 295 testes.
- Diagnóstico com uma função temporária (já apagada): a SPTrans aceita conexões vindas do Supabase, e a chave salva é a mesma da página (comparação só por hash). Mesmo assim o login responde `false`. Provável que a chave nova ainda não esteja ativa. Falta testar de novo.

### Melhorias V4, V5, T8, P2 e H3

- **T8:** `.github/workflows/publicar.yml` roda `npm run verificar` e o build e publica no GitHub Pages a cada envio ao `main`. Embarque e Supabase vêm de variáveis do Actions (públicas, sem segredo); sem elas o Embarque fica desligado. Ligar o Pages pelo `gh` foi bloqueado nesta sessão: falta o Gabriel ligar em Settings → Pages → Source: GitHub Actions.
- **P2:** tela "Sobre o projeto" (`#/projeto`, link no topo de Sobre, aba Sobre acesa). Conteúdo em `data/projeto.json`, validado em `src/core/projeto.ts` e no `npm run validar-kb`: número sem fonte, dado pessoal e "você tem direito" são recusados. Persona e números ficam vazios até o teste com pessoas. Conferida no navegador: sem rolagem lateral em 320 px, no tema escuro. `/#/projeto` entrou na auditoria de acessibilidade do e2e.
- **V4 e V5:** pedidos prontos para colar no Claude Design em `docs/pedidos-claude-design.md`.
- **H3:** passo a passo e lista de serviços a conferir no PENDENCIAS, sem nenhum valor (só a fonte pode dar o valor).

### T8 concluída: site no ar

- Pages ligado pelo painel do GitHub (Source: GitHub Actions), com o Gabriel logado. Workflow `publicar` rodado à mão: build e deploy com sucesso.
- Site: https://gabrielroma0.github.io/mapiii-assistente/ (respondeu 200; `#/projeto` abriu sem erro no console). Embarque desligado no site até a dupla criar as variáveis do Actions.

### Passagem para o Thor

- Seção "Atualizações de 07/11 (Gabriel): leia primeiro" no topo do PENDENCIAS, e o CLAUDE.md manda o Claude Code começar por ela.
- `npm run testar-sptrans` (`scripts/testar-sptrans.ts`): chama a função publicada e diz se a SPTrans já aceita a chave. Em 07/11 ainda respondia `api_fora`.

## 07/11/2026 · Thor com o Claude Code

- **H8 (diagnóstico):** a SPTrans responde `HTTP 200` com `false` a qualquer chave que não reconhece (conferido com uma chave inventada). A função recebe a mesma resposta com a chave do Gabriel. Rede, Supabase e o defeito do 411 estão descartados: falta a SPTrans ativar ou aceitar a chave. Plano do PENDENCIAS mantido (testar de novo; se falhar em 08/11, recriar o aplicativo).
- **Vídeo:** análise do vídeo campeão da GS 2026.1 em `video/referencia-campeao.md` (quadros e transcrição). Decisões do Thor: 16:9 para o YouTube, narração com a voz da dupla, Mapi com cara de 3D feito no Claude Design a partir do desenho atual (pedido V8 em `docs/pedidos-claude-design.md`), destacar que o Mapiii pode ser replicado em outras cidades e países (SPTrans como exemplo), com o selo VISÃO DE FUTURO.
- **Roteiro v2** em `video/roteiro-v2.md` (18 cenas, cerca de 2:10, dupla na câmera, só números medidos, escala com selo VISÃO DE FUTURO). Pedidos V9 (quadros 16:9) e V10 (capa do YouTube) no `docs/pedidos-claude-design.md`. Proposta do Thor: sem teste com pessoas (o vídeo campeão também não mostrou teste); a prova usa só números medidos (decisão aberta no PENDENCIAS, seção 5).
- **Pacote do Claude Design** em `video/claude-design/`: pedidos 1 (Mapi 3D, 7 poses), 2 (13 quadros 16:9 com tópicos animados do app) e 3 (capa do YouTube), prontos para colar; referências do Mapi plano geradas do `src/ui/MapiPersonagem.tsx`; passo a passo no `LEIA-ME.md`. Corrigido no pedido do Mapi 3D: o desenho não tem "relevos do piso tátil" e o reflexo fica no alto à direita.
- **Roteiro v2 ajustado:** o app aparece como tópicos animados (celular estilizado + Mapi 3D) e só 2 cortes curtos do app real; o Embarque vira história animada, sem selo "EXEMPLO", com a locução "pode avisar"; nova cena 13 com os outros recursos em tópicos (fechou o buraco de 1:37 a 1:42). V4 e V5 ficam para depois do vídeo.
- **V8 feito:** Mapi 3D gerado no Claude Design e salvo em `video/mapi-3d/` (`bom`, `atencao`, `procurando`, `verificado`, `ouvindo`, `recusa`, `comemorando`, PNG transparente 2000 × 2000, e `comparacao-plano-3d.png`). Conferido: mesmo desenho, cores e poses do plano; legível no Seashell e no Space Indigo. Na primeira versão o `bom` saiu com cor creme, sobrancelhas e braço na frente do corpo; corrigido no mesmo chat.
- **V9 feito:** 13 quadros do pitch em `video/quadros/` e `design-system/Mapiii Pitch Quadros 16x9.html`. Ajustes pedidos e feitos: quadro 5 com a pergunta real "Para quem é a orientação?" e respostas do `data/perguntas.json`; quadro 11 com ícone "A+" em vez da lupa e "Sem login, sem cadastro" no lugar de "Não guarda seus dados" (o app pode lembrar respostas no aparelho, se a pessoa marcar).
- **V10 feito:** capa do YouTube em `video/capa.png`. A primeira versão (fundo creme, título em 4 linhas) sumia no YouTube claro; das 3 versões pedidas depois, a A (cena do ônibus) se leu melhor em tamanho pequeno. Ajuste final: a pessoa em cadeira de rodas maior e com luz de contorno.
- **Quadros 4 e 13 corrigidos (07/11):** `video/quadros/04.png` e `video/quadros/13.png` trocados por versões com a logo correta da marca.
- **Guia de montagem (07/11):** `video/montagem-remotion.md` adapta ao Mapiii as dicas dos guias "Como eu fiz o vídeo do Dorme" e "do Fatô" (Levi Lab): narração com tempo por palavra, Remotion, revisão no Studio antes do render, pedido pronto para colar e lista do que falta preparar. Roteiro v2: cena 13 com "Sem login, sem cadastro", igual ao quadro 11.
- **Vídeo em documento único (07/11):** pedido do Thor. `video/README.md` junta roteiro v2, estilo, locução, gravações, som, montagem no Remotion (com as dicas dos guias do Dorme e do Fatô), revisão, audiodescrição v2, pedidos do Claude Design e cronograma. Apagados `roteiro.md` (v1, no histórico do git), `roteiro-v2.md`, `edicao.md`, `gravacoes.md`, `checklist-final.md`, `audiodescricao.md`, `legendas.srt`, `referencia-campeao.md`, `montagem-remotion.md` e `claude-design/LEIA-ME.md`. Novidades: fecho com a rampa descida (cena 18, quadro 14, pedido 4) e objetos 3D opcionais (pedido 5). Decisões: Mapi 3D sobe e flutua, sem quique; V4 não será feito agora. Seções V8 a V10 saíram de `docs/pedidos-claude-design.md`.
- **Quadro 14 (07/11):** fecho com a rampa descida salvo em `video/quadros/14.png`, com as peças `onibus`, `rampa` e `pessoa` em `video/quadros/14-pecas/` (vindas do artefato do design system no Claude Design). Conferido: só tokens da paleta, sem texto inventado, rodapé com contraste 5,7:1. A rampa é fina, mas fica assim: na animação ela aparece descendo (decisão do Thor).
- **Objetos 3D (07/11):** `espalhada`, `dificil` e `golpe` em `video/objetos-3d/` (PNG 2000 × 2000 transparente) e a folha `comparacao-com-mapi.png`. Conferido: mesmo material e luz do Mapi 3D, só cores da paleta, sem rosto e sem texto. Entram nos cartões da cena 3.
- **Regras de tempo do vídeo (08/11):** seção 3 do `video/README.md` ganhou as regras medidas da skill motionmaxxing (entrar desacelerando, nada cresce do zero, cortar com movimento, nenhum trecho morto, final parado até 1,4 s), com a ressalva de que aviso, selos, números com fonte e fundo sólido continuam obrigatórios. A skill não foi instalada.
- **Pedidos 6 a 8 do Claude Design (08/11):** celular 3D em três vistas para o giro da cena 9, quadro 15 dos ODS (só os lugares dos ícones oficiais) e moldura opcional das cenas de câmera, na seção 12 do `video/README.md`. `design-system/Mapiii Pitch Quadros 16x9.html` atualizado com os quadros 1 a 14 em vetor, para tirar as camadas da animação.
- **Celular 3D (08/11):** frente, perfil e costas em `video/objetos-3d/` (2000 × 2000 transparente, mesmo tamanho e posição), para o giro da cena 9. Tela medida: x 676, y 296, 648 × 1408 px.
- **Link do artefato (08/11):** pedido do Thor. O artefato do design system no Claude Design (https://claude.ai/artifact/6Vkhuq9j7zNxiXF3ccbmfs), onde fica tudo o que é gerado para o vídeo, está anotado nas seções 6 e 12 do `video/README.md`.
- **Quadro 15 (08/11):** ODS da cena 16 em `video/quadros/15.png`, só com os lugares dos ícones oficiais (420 × 420 px em x 400 e x 1100, y 271) e os textos "Menos desigualdade" e "Cidades para todo mundo". Nenhum ícone de ODS desenhado.
- **Moldura de câmera e nomes (08/11):** `video/quadros/camera-moldura.png` (verde em x 52, y 52, 1816 × 976 px), `camera-nomes.png` e as etiquetas `thor.png` e `gabriel.png`. Pedido 9 (legenda e relógio) acrescentado à seção 12 do `video/README.md`.
- **Legenda e relógio (08/11):** `video/quadros/legenda.png`, `legenda-sobre-quadro-01.png` e os chips `relogio/0740.png` a `0743.png`. Todos os pedidos do Claude Design para o vídeo (1 a 9) estão feitos.
- **Melhorias obrigatórias do vídeo (09/11):** pedido do Thor, a partir de um brief do Duolingo. `video/README.md` ganhou ondas de energia, câmera que reage ao impacto e linha de rota (seção 3), hierarquia e níveis de som em −14 LUFS com música 12 dB abaixo da voz (seção 8), notas por cena, conferência em volta dos impactos e teste final (seção 10), e o pedido de montagem foi ajustado (seção 9).
- **H1, primeira ficha (09/11):** `bilhete-unico-especial-pcd` montada a partir de prints das páginas oficiais da SPTrans (página do Bilhete Único Especial e Perguntas e Respostas), guardados em `docs/fontes/bilhete-unico-especial-pcd/`. O site da SPTrans recusa leitura automática; o "modo IA" do Google foi descartado como fonte. Criado o ambiente de nuvem `mapiii-assistente` com os sites oficiais liberados. Faltam renovação, custo de entrega e o link oficial da lei ou das portarias.
- **H1, lei do Bilhete Único Especial (09/11):** `base_legal` com a Lei Municipal 11.250/1992 (arts. 1º e 3º) e a Portaria SMT.GAB 50/2019 (art. 29), com links do catálogo de legislação da Prefeitura (achados pelo Claude Code, conferidos e fotografados pelo Thor). `frase_motorista` escrita a partir da lei (isenção e entrada pela porta da frente ou adaptada): com isso, a ficha aparece em "Mostre ao motorista". Prints das casas de acolhimento e do formulário guardados também. `modelo_recurso` fica para depois da H2 (canal de reclamação da SPTrans). Faltam renovação e custo de entrega.
- **H1, Bilhete Único Especial fechado (09/11):** renovação (até 60 dias antes; deficiência permanente não reapresenta exames) e gratuidade do cartão, da entrega e das vias adicionais, por print. Primeiro item de `data/servicos-valores.json` (valor 0), conferido na checagem: "cobraram R$ 35 pela segunda via" sai como Suspeito.
- **H1, BPC (09/11):** ficha `bpc-pcd` em rascunho, com o texto das páginas do INSS e do gov.br baixado pelo Claude Code (o gov.br abre para leitura automática; o Planalto não). Condições: objetivo "Benefício em dinheiro" e renda "Sim"; não vale para quem já recebe BPC. Conferido na Rota: pode, talvez (renda "Não sei"), não (já recebe ou renda "Não"). A pergunta `p_renda` fala em meio salário mínimo e o BPC exige 1/4: decisão para a dupla; a limitação da ficha avisa. Faltam prints do Thor e o art. 20 da Lei 8.742/1993.
- **Pergunta da renda em faixas (09/11):** decisão do Thor ("como achar melhor"). `p_renda` passou de sim/não ("até meio salário mínimo") para `ate_um_quarto`, `ate_meio`, `mais_de_meio` e `nao_sei`, porque o BPC exige até 1/4. Continua sem pedir o valor. O BPC usa `ate_um_quarto`; um limite de meio salário usa as duas primeiras faixas (documentado em `data/README.md`). Respostas guardadas no aparelho com o valor antigo são descartadas sozinhas. Testes novos em `tests/regras.test.ts` e `tests/lembrar.test.ts`; 303 testes de lógica e 110 de tela passando. Prints da página do INSS do BPC guardados em `docs/fontes/bpc-pcd/`.
- **BPC, página de serviço do gov.br conferida (09/11):** 5 prints do Thor em `docs/fontes/bpc-pcd/`; batem com a ficha. Faltam o print da página de recurso e o art. 20 da Lei 8.742/1993.
- **BPC, página de recurso conferida (09/11):** 4 prints do Thor. Acrescentado ao "Se negarem": consultaprocessos.inss.gov.br e reclamação pela Central 135 ou Fala.BR se o recurso passar do prazo. Falta só o art. 20 da Lei 8.742/1993.
- **BPC fechado (09/11):** prints da Lei 8.742/1993 (cabeçalho, art. 2º e arts. 20-B a 21-B). `base_legal` com o art. 2º, I, e e os arts. 21 e 21-A; `modelo_recurso` para o Recurso Ordinário (Inicial) no Meu INSS, com os campos "(preencha ...)". Passos novos tirados da lei: revisão a cada 2 anos, dispensa da perícia periódica para deficiência permanente (Lei 15.157/2025), volta do pagamento sem nova perícia quando o trabalho acaba, novo pedido possível. O BPC já aparece no "Me negaram" com o modelo pronto.
- **BPC, art. 20 (09/11):** print do Thor. `base_legal` passa a citar o art. 20, §§ 1º a 3º; o modelo de recurso cita o § 3º (até 1/4 do salário mínimo por pessoa) e a limitação diz quem conta como família (§ 1º).
- **Atende+ começado (09/11):** prints do Thor (sobre, página inicial, postos, sistema) em `docs/fontes/atende/`; Lei Municipal 16.337/2015 achada no catálogo da Prefeitura (texto baixado). O `prefeitura.sp.gov.br` e o SP156 também recusam leitura automática (403). Ficha ainda não entra na base: faltam documentos, prazo e "se negarem".
- **H1, Atende+ (09/11):** ficha `atende-mais` (tipo serviço, atalho "Como eu me desloco?") a partir dos prints da SPTrans e do regulamento do Atende (PDF de nov/2017 enviado pelo Thor; texto extraído em `docs/fontes/atende/`). Condições: objetivo transporte e (usa cadeira ou outro apoio, ou necessidade intelectual/neurodesenvolvimento). Conferido na Rota: pode, talvez (apoio "Não sei"), não (mobilidade sem apoio, ou outro objetivo). Onde o regulamento de 2017 diverge das páginas atuais (postos e horários), vale a página atual. Falta o print da lei e o endereço do PDF.
- **Atende+ completo (09/11):** print da Lei 16.337/2015 (`base_legal`: arts. 1º, 4º e 5º) e o endereço oficial do regulamento na SPTrans, que passa a ser a `fonte_url`.
- **H1, mais 2 fichas (09/11):** `passe-livre-interestadual` (gov.br/ANTT; condições: transporte e BPC ou CadÚnico; não vale para quem já tem Passe Livre) e `isencao-ipi-iof-carro` (perguntas frequentes da Receita; condições: transporte, usa carro e necessidade física, visual ou do neurodesenvolvimento; atalho "Quero dirigir"). Textos baixados pelo Claude Code; faltam os prints de conferência do Thor. Rota conferida nos dois. A base tem 5 fichas.
- **Sites liberados e testados (09/11):** DETRAN-SP, CET, Fazenda-SP e Poupatempo incluídos no ambiente. DETRAN-SP e CET abrem; a Fazenda-SP continua recusando. O cartão de vaga especial do DETRAN-SP não vale para a capital (emissão pela Prefeitura); o DETRAN-SP não tem página sobre CNH para pessoa com deficiência. As fichas que faltam ficam por print. Passe Livre conferido por print.
- **Isenção do carro conferida (09/11):** 5 prints do Thor e o texto colado batem com a ficha `isencao-ipi-iof-carro`.
- **H1 e H2 pelo SP156 (09/11, tarde):** o SP156 abriu para leitura automática. 6 fichas novas com o texto oficial em `docs/fontes/`: `cartao-defis-estacionamento`, `calcada-publica-manutencao`, `calcada-particular-denuncia`, `calcada-obstaculo-acessibilidade`, `central-156` (agora `canalOficialId`) e `ouvidoria-geral-municipio`. A base tem 11 fichas. Táxi acessível ficou de fora (página de 2009). CNH e reclamação da SPTrans seguem por print.
- **CNH da pessoa com deficiência (09/11):** ficha `cnh-renovacao-pcd` com 3 prints do Thor da página do Detran-SP (só carrega com JavaScript). Só renovação; valores da página em `limitacao`. A base tem 12 fichas.
- **H2 fechada (09/11):** fichas `reclamacao-onibus-sptrans` (SP156 serviço 976, confirmado por 2 prints do Thor do "Fale Conosco" e dos "Contatos" da SPTrans) e `ouvidoria-sptrans` (página do SP156). Os dois ids entram em `canaisReclamacaoIds`. A base tem 14 fichas.

## 09/11/2026 · Gabriel com o Claude Code

- H8: `npm run testar-sptrans` deu "SPTrans OK" (2 pontos para "Paulista"). A chave do app "Mapiii" de 07/11 passou a ser aceita.
- Criado o app "Mapiii v2" na SPTrans (Claude Code preencheu e salvou o formulário a pedido do Gabriel). A chave nova foi colada pelo Gabriel, mas ficou num segredo com nome errado (`SPTRANS_TOKESPTRANS_TOKENN`); a função continua com a chave antiga. Pendente: trocar `SPTRANS_TOKEN` pela chave nova, testar, apagar o segredo errado e o app antigo.
- Corrigido: segredos refeitos, agora só `SPTRANS_TOKEN` com a chave do Mapiii v2 (digest `f12d6d26…`). `npm run testar-sptrans` de novo: "SPTrans OK". Falta apagar o app "Mapiii" antigo na SPTrans.
- O portal "Meus Aplicativos" da SPTrans não oferece apagar nem editar app; o "Mapiii" antigo ficou sem uso.
- Teste no app (dev local com `VITE_EMBARQUE_ATIVO=true`, 21:22): busca "Paulista" achou PAULISTA B/C e PAULISTA C/B; no PAULISTA B/C veio "Próximo acessível: 7282-10, em 2 min" e 22 previsões, sem erro no console. Os 4 pontos da H8: sessão ok (consulta depois do login), horário ok (consulta às 21:22:43, igual ao relógio), sentido coerente ("para PÇA. RAMOS DE AZEVEDO" no sentido bairro→centro). Acessibilidade: todos os 22 veículos vieram "Acessível"; conferir na C3 se o campo vem mesmo da SPTrans ou se está sempre verdadeiro.
- Perguntas sem uso (`p_quem`, `p_faixa`, `p_laudo`, `p_subprefeitura`): o app já as esconde da triagem (só 8 aparecem com as 14 fichas). Gabriel decidiu deixar como está. Nota no `video/README.md` (cena 7): o quadro 5 mostra "Para quem é a orientação?", que no app é a escolha da tela inicial.
- `docs/convite-e-termo.md`: convite para mandar aos participantes da H9 e termo de consentimento sem dados pessoais (aceite marcado por código). Linkado na folha de teste.
- `docs/formulario-teste.md`: estrutura do Google Forms do teste (consentimento, parte de quem aplica, facilidade 1 a 5, SUS opcional, perguntas abertas), anônimo e sem coletar e-mail, para copiar a partir do formulário do Gabriel sobre calçadas.
- H9 passa a ser a distância (decisão do Gabriel): `docs/formulario-teste.md` reescrito para a pessoa responder sozinha (tarefa do Bilhete Único Especial no Mapiii e no Google, tempo em faixas, acerto conferido depois pela dupla, versões A e B para alternar a ordem); convite ajustado para mandar com o link.
- Formulário do teste criado pelo Gabriel no Google Forms (uma versão só, Mapiii primeiro): link no README, no convite e em `docs/formulario-teste.md`, que ficou só com o link, o resumo das perguntas, os limites para o relatório e o que fazer depois. Conferido: abre sem login, sem coletar e-mail, 17 perguntas.

## 10/11/2026

- H12: Gabriel aprovou cortar o login, o roteiro v2 e o Embarque ligado no site (faltam as variáveis do Actions). Teste com pessoas no vídeo (A ou B) fica para o Gabriel decidir; só a cena 12 depende disso. H10: Thor conferiu que o app funciona sem internet. Atualizados `PENDENCIAS.md` e `video/README.md`.
- Vídeo: ícones dos ODS 10 e 11 em `video/ods/` (enviados pelo Thor; falta o link de origem e a confirmação na lista da GS). Mapa-múndi da cena 15 gerado do Natural Earth 1:110m (domínio público, via `world-atlas`) em `video/mapa/mundo.svg`, com o pino de São Paulo medido.
