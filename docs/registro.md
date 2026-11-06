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

### Fora do repositório (só neste computador)

- `.env.local`: liga o Embarque com o simulador. **Antes do build de produção, precisa apontar para o Supabase da dupla.**
- `.claude/launch.json` na pasta acima do repositório: para abrir o app no painel do navegador.
- PDF "Mapiii-o-que-mudou-06-11.pdf".

### O que ainda não foi conferido

- Voz, instalação do app e leitura do QR **num celular de verdade**.
- Leitor de tela real (TalkBack ou VoiceOver).
- API da SPTrans real (falta o token).
- Tudo que depende das fichas reais (base ainda vazia).
