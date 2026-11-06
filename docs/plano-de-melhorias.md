# Plano de melhorias do Mapiii

> **Para quem for implementar (pessoa ou agente):** siga as tarefas na ordem da [seção 3](#3-ordem-e-cronograma), uma de cada vez. Cada uma tem arquivos, abordagem e como conferir. Marque `- [x]` ao terminar e acrescente uma linha no [registro](registro.md).

**Objetivo:** deixar o Mapiii com cara de app profissional antes do teste com pessoas (15 e 16/11) e do vídeo, sem atrasar a parte humana (fichas, token, testes).

**Abordagem:** primeiro uma rede de segurança (testes de tela e auditoria automática), depois o que muda a experiência de uso, depois o visual, e por fim os bônus. Cada melhoria é pequena, testada e vai para o `main` sozinha, para dar para parar a qualquer momento sem deixar nada pela metade.

**Base:** guia da dupla v2 (04/11/2026), [PENDENCIAS.md](../PENDENCIAS.md) e as regras do [CLAUDE.md](../CLAUDE.md).

Escrito em 06/11/2026. Nenhuma melhoria foi começada antes deste plano.

---

## Regras que valem para todas as tarefas

- Nada fora da base; nenhum texto de direito, lei, valor ou link inventado.
- Nunca "você tem direito".
- Sem login, sem analytics, sem cookies; nada sai do aparelho sem a pessoa pedir.
- Só tokens, ícones e componentes do `design-system/`; o Mapi não é redesenhado.
- Acessibilidade: teclado, foco visível, `aria-live`, contraste 4,5:1 nos dois temas, alvos de 48 px, texto de 16 px ou mais, 320 px sem rolagem lateral, `prefers-reduced-motion` respeitado.
- Toda mudança de lógica vem com teste; `npm run verificar` passa antes de cada commit.
- Ferramentas novas só como **dependência de desenvolvimento** (não vão para o app) e só com OK da dupla (ver [decisões](#4-decisões-que-a-dupla-precisa-tomar)).

## O que pode dar errado e precisa de teste

Situações que nenhuma tela testa hoje e que mais podem atrapalhar uma pessoa de verdade:

1. **Leitor de tela ao trocar de tela pela barra inferior:** o foco precisa ir para o título da nova tela, não ficar na barra. Teste em T1.
2. **Atualização automática do Embarque falando demais:** o leitor de tela não pode anunciar a cada 30 s se nada mudou. Teste em F3.
3. **Sem internet:** cada tela nova precisa abrir no modo avião, e o Embarque mostrar a última consulta com a hora. Teste em T7.
4. **Navegador que não deixa guardar (modo privado):** "últimos pontos", tamanho do texto e apresentação inicial não podem quebrar. Teste em F3, V7 e F5.
5. **Movimento reduzido e zoom de 200%:** transições desligadas e nada cortado em 320 px. Teste em V2 e T2.

---

## 1. Destaques para o vídeo ⭐

As melhorias que mais chamam atenção em 3 minutos, e que poucas equipes pensariam em fazer. Elas contam a história "o app pensa em quem tem mais dificuldade".

| # | Melhoria | Por que impressiona | Como mostrar no vídeo |
|---|---|---|---|
| ⭐1 | **F7 · Aviso de chegada falado** | O celular avisa em voz e vibra: "O 8000 acessível chega em 2 minutos." Ninguém espera isso de um app de direitos. | Pessoa no ponto, com o celular no bolso, ouvindo o aviso. |
| ⭐2 | **F3 · Embarque ao vivo** | Contagem regressiva que se atualiza sozinha e o número "2 ônibus sem acessibilidade passaram antes". Transforma uma dor em dado. | Tela do ponto contando os minutos. |
| ⭐3 | **P1 · Modo varredura** | Usar o app inteiro com **um único toque** em qualquer lugar da tela (para quem quase não mexe as mãos). Quase nenhum app faz. | Mão tocando a tela uma vez para escolher cada opção. |
| ⭐4 | **V1 · Atalho no ícone do app** | Segurar o ícone do Mapiii mostra "Próximo ônibus acessível" e "Me negaram", como um app de loja. | Dedo segurando o ícone na tela inicial do Android. |
| ⭐5 | **T7 · Funciona no modo avião** | Direitos, checklist e a última consulta do ônibus abrem sem internet. Fala direto com "internet fraca e custo baixo" da banca. | Ligar o modo avião e continuar usando. |
| ⭐6 | **T2 · Nota de acessibilidade** | Número objetivo (Lighthouse e axe) para mostrar na tela: "acessibilidade 100". | Print do relatório no fim do vídeo. |
| ⭐7 | **V7 · Tamanho do texto (A, A+, A++)** | Idoso aumenta a letra do app inteiro com um toque, sem depender do celular. | Antes e depois lado a lado. |

Já prontos e que valem aparecer: **Mostre ao motorista com QR** (câmera lendo o QR), **Cartão da cadeira**, **falar a pergunta** e **ouvir a resposta**.

---

## 2. As melhorias, por tipo

Legenda de esforço: **P** (até 2 h), **M** (meio dia), **G** (um dia). "Humano" = depende da dupla.

### 2.1 Fluidez (o app parecer fácil)

#### F1 · Barra de navegação inferior · M
- [x] (06/11, `5bfa976`; a barra fica fora da área que rola, porque flutuando ela cobria alvos de toque; escondida na triagem) **O quê:** barra fixa com Início · Perguntar · Na rua · Sobre, em todas as telas do app.
- **Por quê:** hoje a pessoa depende do "Voltar"; numa barra fixa ela nunca se perde.
- **Como:** usar o `TabBar` do design system (`items`, `value`, `onChange`) em `src/App.tsx`, abaixo do `<main>` e acima do aviso de protótipo. Nova função `abaDaRota(rota: Rota): 'inicio' | 'perguntar' | 'na_rua' | 'sobre' | null` em `src/app/rotas.ts` decide a aba ativa (triagem, rota e detalhe contam como "inicio"; embarque, cartão, motorista e reclamação como "na_rua"). `onChange` chama `navegar(href...)`. Espaço no fim do conteúdo para a barra não cobrir nada.
- **Conferir:** teste de `abaDaRota` para todas as rotas; no navegador, Tab chega na barra, a aba ativa tem `aria-current`, e ao trocar o foco vai para o título (já feito pelo `Titulo`).

#### F2 · Rota dos Direitos mais limpa · M
- [x] (06/11, `e0f7aff`) **O quê:** "Provavelmente não se aplica" recolhido por padrão ("Ver 3 que provavelmente não se aplicam"); botão "Mudar uma resposta" que mostra o resumo das respostas, cada uma com "Mudar".
- **Por quê:** a pessoa vê primeiro o que pode pedir; corrigir uma resposta não obriga a refazer tudo.
- **Como:** em `RotaDosDireitos.tsx`, separar `rota` por classe; o grupo "nao" vai num `<details>`. Nova função `resumoEditavel(respostas, perguntas): { id: string; pergunta: string; resposta: string }[]` em `src/core/perguntas.ts`. "Mudar" abre a triagem no passo da pergunta: `href.triagem` passa a aceitar `#/situacao/p_cidade` (rota `{ tela: 'triagem'; pergunta?: string }`), e `Triagem.tsx` começa nesse passo.
- **Conferir:** testes de `resumoEditavel` e de `lerRota('#/situacao/p_cidade')`; no navegador, mudar uma resposta e voltar com a rota atualizada.

#### F3 · Embarque ao vivo · M ⭐2
- [x] (06/11, `d5072fc`; no exemplo os minutos também diminuem, para o vídeo) **O quê:** no resultado do ponto, atualizar sozinho a cada 30 s, com "Atualizado há X s" e a contagem dos minutos; botão "Pausar". Lista "Últimos pontos" (até 3) para buscar de novo com um toque, guardada só se "Lembrar" estiver ligado.
- **Por quê:** no ponto, a pessoa não quer ficar apertando "Atualizar".
- **Como:** em `BuscaPonto.tsx`, `setInterval` de 30 s chamando `verPrevisao` só com a aba visível (`document.visibilityState`) e parando ao sair da tela. Nova função `mudouOProximo(antes: ResumoPonto, depois: ResumoPonto): boolean` em `supabase/functions/_shared/embarque.ts`: o `aria-live` só fala quando o próximo acessível muda. Últimos pontos em `src/core/lembrar.ts` (`lerUltimosPontos`, `guardarUltimoPonto`, só `codigo` e `nome`, máximo 3).
- **Conferir:** testes de `mudouOProximo` (mesmo ônibus 1 min a menos = false; outro ônibus = true) e dos últimos pontos (limite de 3, armazenamento bloqueado); no navegador com o simulador.

#### F4 · Sugestões enquanto digita · P
- [ ] **O quê:** em "Fazer uma pergunta", até 3 sugestões abaixo do campo, a partir das `perguntas_exemplo` das fichas.
- **Como:** função `sugerirPerguntas(texto: string, indice, max = 3): string[]` em `src/core/busca.ts`, que usa a mesma busca a partir de 3 letras; lista com `role="listbox"` e setas do teclado em `Perguntar.tsx`.
- **Conferir:** testes de `sugerirPerguntas` (menos de 3 letras = vazio; sem repetidas); no navegador, setas e Enter.

#### F5 · Apresentação na primeira visita · P
- [ ] **O quê:** três telas curtas na primeira vez (Descubra, Prepare, Garanta na rua), com "Pular" sempre visível.
- **Como:** componente `Apresentacao` em `src/app/telas/Apresentacao.tsx`, mostrado pelo `Inicio` se `localStorage['mapiii.apresentacao.v1']` não existir; guarda só "vista". Textos tirados do guia v2 (os três atos).
- **Conferir:** no navegador: aparece uma vez, "Pular" funciona, modo privado não quebra (mostra e segue).

#### F6 · Compartilhar a Rota inteira · P
- [x] (06/11) **O quê:** botão "Compartilhar minha rota" (WhatsApp, copiar, imprimir) com os direitos "Pode ter direito" e "Talvez", cada um com o que levar e a fonte.
- **Como:** função `textoDaRota(itens: ItemRota[]): string` em `src/core/garantia.ts`, sem as respostas sensíveis; usar `AcoesDeTexto`.
- **Conferir:** teste de `textoDaRota` (não inclui "Provavelmente não se aplica" nem as respostas da triagem; traz o aviso de protótipo).

#### F7 · Aviso de chegada falado · M ⭐1
- [x] (06/11, `d5072fc`) **O quê:** no Embarque por ponto, "Me avise quando estiver chegando": com a tela aberta, quando o próximo acessível estiver a 2 minutos ou menos, o app fala "O 8000-10 acessível chega em 2 minutos" e vibra.
- **Por quê:** a pessoa pode guardar o celular e prestar atenção na rua.
- **Como:** depende de F3. Função `deveAvisar(resumo: ResumoPonto, avisado: string | null, limite = 2): string | null` em `embarque.ts` (devolve a frase uma vez por veículo). Voz com a mesma `speechSynthesis` do `BotaoOuvir` (extraída para `falar(texto)` em `src/ui/acoes.tsx`) e `navigator.vibrate([200, 100, 200])` quando existir. Aviso claro: "Funciona com esta tela aberta."
- **Conferir:** testes de `deveAvisar` (avisa uma vez; não avisa acima do limite; outro veículo avisa de novo); no navegador com o modo exemplo.

### 2.2 Visual (cara de app profissional)

#### V1 · Atalhos no ícone e capturas no instalador · P ⭐4
- [ ] **O quê:** no manifesto do PWA, `shortcuts` ("Próximo ônibus acessível" → `#/embarque`, "Me negaram" → `#/negaram`, "Fazer uma pergunta" → `#/perguntar`) e `screenshots` (2 telas de celular).
- **Como:** em `vite.config.ts`; capturas geradas do app em 1080×1920 em `public/screenshots/` (com o modo exemplo, sem dados reais).
- **Conferir:** `npm run build` e o manifesto em `dist/`; no Android, segurar o ícone (parte do teste no celular).

#### V2 · Transições suaves · P
- [ ] **O quê:** troca de tela com esmaecer de 160 ms (só opacidade, como o design system permite).
- **Como:** classe de entrada no `<main>` em `app.module.css`, com `@media (prefers-reduced-motion: reduce)` desligando.
- **Conferir:** no navegador com e sem movimento reduzido (emulação).

#### V3 · Carregamento com esqueleto · P
- [x] (06/11) **O quê:** blocos cinza no lugar dos cartões enquanto o Embarque busca, em vez de só a fala do Mapi.
- **Como:** componente `Esqueleto({ linhas })` em `src/ui/assistente.tsx`, `aria-hidden`, com o texto "Procurando..." mantido no `aria-live`.
- **Conferir:** no navegador com o simulador lento (termo `lento`).

#### V4 · Ícones de microfone e alto-falante · P · Humano
- [ ] **O quê:** dois ícones novos no design system, no padrão da grade (24 px, traço 2 px).
- **Como:** a dupla pede no Claude Design (onde o design system foi feito); depois eu troco o ícone "conversa" nos botões de falar e ouvir.

#### V5 · Mapi no tema escuro · Humano
- [ ] **O quê:** versão do personagem para fundo escuro (hoje é a mesma do claro).
- **Como:** pedido ao Claude Design; o `CLAUDE.md` proíbe redesenhar o Mapi no código.

#### V6 · Endereço com nome bonito · Humano
- [ ] **O quê:** publicar com um nome legível (ex.: `mapiii.netlify.app` ou domínio próprio).
- **Como:** junto com a publicação (H10 do PENDENCIAS).

#### V7 · Tamanho do texto · P ⭐7
- [ ] **O quê:** em Sobre e no topo do Início, "Tamanho do texto: A · A+ · A++" (100%, 115%, 130%).
- **Como:** função `aplicarTamanho(t: 'normal' | 'grande' | 'maior')` em `src/tema.ts` que muda `font-size` do `<html>`; guarda a escolha como o tema (só preferência visual, sem dado pessoal).
- **Conferir:** no navegador, A++ em 320 px sem rolagem lateral em todas as telas.

### 2.3 Técnicas (qualidade e confiança)

#### T1 · Testes de tela de ponta a ponta · M
- [x] (06/11, `4493c12`) **O quê:** um robô que abre o app e faz os fluxos principais a cada envio ao GitHub.
- **Como:** `@playwright/test` como dependência de desenvolvimento (precisa de OK). Pasta `e2e/` com 6 roteiros: triagem completa até a rota; pergunta com resposta e com "Não encontrei"; Me negaram com modelo; Embarque exemplo por ponto; lembrar e apagar com confirmação; foco no título ao trocar de tela. Roda contra `npm run dev` com a base de exemplo. Novo comando `npm run e2e` e job no CI.
- **Conferir:** `npm run e2e` passa localmente e no GitHub.

#### T2 · Auditoria de acessibilidade e desempenho · P ⭐6
- [x] (06/11, `33a986f`; resultado: Lighthouse 100/100/100/100 no `index.html`, axe sem problemas graves em 17 telas nos dois temas) **O quê:** axe em cada tela nos testes de T1 e Lighthouse no CI, com o relatório guardado.
- **Como:** `@axe-core/playwright` nos roteiros de T1 (falha com qualquer violação "serious" ou "critical"); `@lhci/cli` no CI contra o build (meta: acessibilidade 100, PWA ok, desempenho ≥ 90). Dependências de desenvolvimento (precisa de OK).
- **Conferir:** relatório no GitHub; números anotados no registro.

#### T3 · Conferência automática das fontes · P
- [ ] **O quê:** robô semanal que abre cada `fonte_url`, `onde.link` e `base_legal.url` e avisa os que não respondem.
- **Como:** `scripts/conferir-links.ts` (só `fetch`, sem biblioteca), comando `npm run conferir-links`, workflow agendado `.github/workflows/conferir-links.yml` (toda segunda). Não falha o CI normal: abre um aviso.
- **Conferir:** rodar com uma ficha de exemplo com link quebrado.

#### T4 · Aviso de nova versão · P
- [ ] **O quê:** no app instalado, faixa "Nova versão disponível · Atualizar" em vez de atualizar em silêncio no meio do uso.
- **Como:** `registerType: 'prompt'` em `vite.config.ts` e `useRegisterSW` de `virtual:pwa-register/react` num componente `AvisoAtualizacao` em `src/App.tsx`.
- **Conferir:** build, mudar algo, novo build e ver a faixa no `npm run preview`.

#### T5 · Tela amigável quando algo der erro · P
- [x] (06/11, `39a656b`) **O quê:** se uma tela quebrar, o Mapi diz "Algo deu errado nesta tela" com "Voltar ao início", em vez de tela branca. O aviso de protótipo continua.
- **Como:** componente `LimiteDeErro` (Error Boundary do React) em `src/app/LimiteDeErro.tsx`, envolvendo `<Tela>` em `App.tsx`; reinicia ao trocar de rota.
- **Conferir:** teste forçando um erro numa tela de desenvolvimento.

#### T6 · Carregar cada tela só quando precisa · P
- [ ] **O quê:** o Início abre mais rápido em internet fraca.
- **Como:** `React.lazy` + `Suspense` para as telas que não são o Início em `App.tsx`; o service worker continua guardando tudo para uso offline.
- **Conferir:** tamanho do arquivo inicial no `npm run build` antes e depois (anotar no registro); modo avião depois da primeira visita.

#### T7 · Embarque sem internet · P ⭐5
- [x] (06/11, `d5072fc`; vale também quando a atualização falha com internet) **O quê:** sem internet, o Embarque mostra a última consulta com "Consulta das 14:32, sem internet agora" e as fichas de deslocamento.
- **Como:** guardar a última previsão só na memória da página (sem armazenamento); detectar falta de rede com `useOnline` (já existe) e mostrar a última com o selo de horário.
- **Conferir:** no navegador, consultar, desligar a rede (emulação) e ver a última consulta.

#### T8 · Publicação automática · P · Humano
- [ ] **O quê:** cada envio ao `main` atualiza o site publicado sozinho.
- **Como:** workflow do GitHub Pages (`.github/workflows/publicar.yml`) com o build. A dupla precisa ligar o Pages em Settings → Pages e decidir a flag do Embarque (ver decisões).
- **Conferir:** site atualizado depois de um envio.

### 2.4 Produto (depois do MVP testado)

#### P1 · Modo varredura · G ⭐3
- [ ] **O quê:** um botão grande "Usar com um toque" liga o modo em que as opções se destacam uma por vez e **qualquer toque na tela** (ou Espaço) escolhe a destacada. Velocidade ajustável (1,5 s, 2,5 s, 4 s).
- **Por quê:** para quem tem mobilidade muito reduzida. Está no guia como bônus.
- **Como:** começa pela triagem e pelo Início (onde as escolhas já são cartões). Hook `useVarredura(itens: HTMLElement[], intervaloMs: number)` em `src/ui/varredura.ts` que move o destaque e escuta um toque global; o destaque usa o anel de foco do design system. Lê o item destacado no `aria-live` só se a pessoa ligar a voz.
- **Conferir:** teste do hook (avança, volta ao primeiro, para ao sair); teste com uma pessoa que usa acionador, se possível.

#### P2 · Página "Sobre o projeto" para a banca · P · Humano (conteúdo)
- [ ] **O quê:** tela com o problema, a persona, como testamos, os números do teste (inclusive os ruins), a equipe e a visão de futuro (mapa de calçadas).
- **Como:** `src/app/telas/Projeto.tsx`, rota `#/projeto`, link em Sobre. Os textos e números vêm da dupla depois do teste (16/11); eu monto a tela antes, com os lugares marcados.

---

## 3. Ordem e cronograma

O cronograma do guia deixa o código livre até **14/11** (dia 15 e 16 são de teste com pessoas). A ordem põe primeiro o que protege o resto e o que aparece no teste e no vídeo.

| Fase | Quando | Tarefas | Por que nesta ordem |
|---|---|---|---|
| **A · Rede de segurança** | 07/11 | T5, T1, T2 | Com testes de tela e auditoria, as próximas mudanças não quebram nada sem ninguém ver. |
| **B · Fluidez principal** | 07 a 08/11 | F1, F2, F6 | O que mais muda a nota de facilidade no teste. |
| **C · Embarque ao vivo** | 09 a 10/11 | F3, F7, T7, V3 | O diferencial do vídeo; depende do token só para o dado real (o exemplo serve). |
| **D · Cara de app** | 11/11 | V1, V2, V7, T4, T6 | Polimento visual e de instalação. |
| **E · Bônus** | 12 a 13/11 | F4, F5, P1, T3 | Só depois do resto pronto; o guia pede "nada de bônus antes do MVP". |
| **F · Humanas** | quando a dupla puder | V4, V5, V6, T8, P2 | Dependem de Claude Design, publicação ou conteúdo do teste. |
| **Congelar** | 14/11 | só correções | Teste com pessoas em 15 e 16/11 com a versão estável. |

Se faltar tempo, cortar de baixo para cima: E primeiro, depois D. **A, B e C não cortar.**

Em paralelo e **mais importante que tudo isto:** as fichas (H1), o token (H8) e o gabarito (H5). Sem fichas, nenhuma melhoria aparece no site publicado.

---

## 4. Decisões que a dupla precisa tomar

| Decisão | Opções | Recomendação |
|---|---|---|
| Ferramentas de teste (T1, T2) | Instalar Playwright, axe e Lighthouse **só para desenvolvimento** | Sim: não vão para o app e dão os números para o vídeo |
| Publicação automática (T8) | GitHub Pages, Netlify ou Vercel | GitHub Pages: já está no GitHub e não precisa de outra conta |
| Embarque no site publicado | Ligado com dado real, só exemplo, ou desligado | Ligado; com exemplo até o token funcionar |
| Conta opcional (login) | Cortar ou fazer | Cortar (guia pede "nenhum login") |

---

## 5. Como cada tarefa é feita (o mesmo roteiro sempre)

1. Branch próprio (`melhoria/f1-barra-inferior`).
2. Escrever o teste da lógica nova; ver falhar.
3. Implementar; ver o teste passar.
4. `npm run verificar` (e `npm run e2e` depois de T1).
5. Conferir no navegador: teclado, leitor de tela (foco e `aria-live`), 320 px, tema claro e escuro, movimento reduzido.
6. Commit, juntar ao `main`, enviar ao GitHub.
7. Marcar `- [x]` aqui e acrescentar a linha no [registro](registro.md).
