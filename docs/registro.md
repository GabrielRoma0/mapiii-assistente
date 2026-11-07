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
