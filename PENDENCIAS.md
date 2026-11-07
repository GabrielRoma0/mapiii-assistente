# O que falta no Mapiii (e quem faz)

Planejamento completo da dupla (Thor e Gabriel) até a entrega. Diz o que está pronto, **o que é obrigatório para entregar**, o que é melhoria, quem faz, quando, como fazer e como conferir.

- **Entrega final de tudo: 19/11/2026.** Deixar pronto até **18/11 à noite** (17/11 já é período de substitutivas).
- Escopo e cronograma: guia da dupla **versão 2 (04/11/2026)**.
- Histórico do que já foi feito: [docs/registro.md](docs/registro.md). Melhorias de código: [docs/plano-de-melhorias.md](docs/plano-de-melhorias.md).

> Para o Claude Code de quem pegar o projeto: leia também o [CLAUDE.md](CLAUDE.md). Quando perguntarem "o que eu faço agora?", siga a [seção 3](#3-cronograma-dia-a-dia) e confira o estado com os comandos da [seção 10](#10-como-saber-onde-estamos).

Última atualização: 07/11/2026.

---

## 1. Onde o projeto está

**Todo o código do escopo do guia v2 e do plano de melhorias está pronto, testado e no `main`.**

| Conferência (06/11) | Resultado |
|---|---|
| Testes de lógica (`npm run verificar`) | **294 passando** |
| Testes de tela (`npm run e2e`, celular e computador) | **106 passando** |
| Acessibilidade (axe, 17 telas, temas claro e escuro) | **nenhum problema grave** |
| Lighthouse do app (`npm run lighthouse`) | **100 / 100 / 100 / 100** |
| Testes de banco (`npm run test:banco`) | 36 passando |
| CI do GitHub (4 trabalhos) | passando em todos os envios |

**O que impede a entrega:** o conteúdo. Hoje:

| Dado | Situação |
|---|---|
| Fichas em `data/kb.json` | **0** (meta do guia: 10 a 13) |
| Valores em `data/servicos-valores.json` | 0 |
| Gabarito de perguntas (`eval/`) | só os 12 casos de recusa; **falta o grupo `teste`** |
| Cenários da Rota (`eval/gabarito_cenarios.json`) | 0 |
| Token da SPTrans | não criado |
| Site publicado | sim, https://gabrielroma0.github.io/mapiii-assistente/ (sem fichas ainda) |
| Teste com pessoas | não feito |

Sem fichas, o site publicado não mostra nenhum direito, a triagem não tem perguntas e as telas de Mostre ao motorista, Me negaram, laudo e atalhos ficam vazias. Em `npm run dev` aparece uma base fictícia só para ver as telas.

---

## 2. Pendências obrigatórias (sem elas não há entrega)

Ordem de importância. **H** = humana (só a dupla pode fazer); **C** = código (o Claude Code faz depois da H correspondente).

| # | Tarefa | Quem | Prazo | Depende de |
|---|---|---|---|---|
| **H1** | **Fichas da base** (10 a 13, com fonte oficial e lei) | Thor | **9/11** | nada: começar já |
| **H2** | Fichas dos **canais oficiais** (Central 156, canal de reclamação da SPTrans) | Thor | 9/11 | H1 em andamento |
| **C1** | Montar o JSON das fichas, configurar os canais em `config.ts`, rodar validadores e `eval` | Claude Code | junto com H1/H2 | H1, H2 |
| **H5** | **Gabarito do grupo `teste`** (perguntas escritas sem olhar as fichas) e cenários | **Gabriel** | 10/11 | lista de ids das fichas |
| ~~**H4**~~ | ~~Conferir as **32 subprefeituras**~~ **Feito 07/11** | Gabriel | 10/11 | nada |
| **H12** | **Decisões finais** (seção 5) | Dupla | 10/11 | nada |
| **H10** | **Publicar o site** (com `https`): **no ar desde 07/11** em https://gabrielroma0.github.io/mapiii-assistente/ (atualiza a cada envio ao `main`). Falta: fichas, decidir o Embarque e conferir no celular sem internet | Dupla | 12/11 | H1 (primeiras fichas), H12 |
| **H6** | **Revisão por especialista** de uma amostra | Dupla | 14/11 | H1, H5 |
| **H9** | **Teste com 5 a 8 pessoas** e coleta dos indicadores | Dupla | **15 e 16/11** | H10 |
| **C2** | Corrigir o que o teste mostrar; atualizar números no registro | Claude Code | 17/11 | H9 |
| **H11** | **Vídeo pitch** e **entregas no Portal do Aluno** | Dupla | **18/11** | H9 |

Opcional mas recomendado para o pitch (o Embarque com dado real é o diferencial):

| # | Tarefa | Quem | Prazo | Depende de |
|---|---|---|---|---|
| ~~**H7**~~ | ~~Projeto Supabase~~ **Feito 07/11** | Gabriel | 9/11 | nada |
| **H8** | **Token da SPTrans** e primeiro teste real (**em andamento 07/11**: chave criada e guardada, função publicada; a SPTrans ainda recusa a chave nova) | Gabriel | 10/11 | H7 |
| **C3** | Ajustes depois do primeiro teste real (sessão, horário previsto, sentido) | Claude Code | 11/11 | H8 |

Se o token não sair a tempo, o Embarque vai para o vídeo no **modo exemplo** (selo "EXEMPLO, não é dado real" em toda tela). A contagem e o aviso falado funcionam igual.

---

## 3. Cronograma dia a dia

| Dia | Thor | Gabriel | Claude Code |
|---|---|---|---|
| **sex 07/11** | H1: pesquisar os 3 temas mais fortes (gratuidade no transporte, BPC, transporte adaptado) | ~~H7~~ (feito) e H8: Supabase e token da SPTrans; ~~H4 subprefeituras~~ (feito) | C1 com as fichas que chegarem |
| **sáb 08/11** | H1: mais fichas (táxi acessível, vaga especial, habilitação/carro adaptado, conserto de calçada) | H5: escrever o grupo `teste` **sem olhar as fichas** | C1; C3 se o token chegou |
| **dom 09/11** | H1 e H2: fechar 10 a 13 fichas e os canais | H5: cenários da Rota; marcar os participantes do teste | C1 completo; `eval` com os números |
| **seg 10/11** | H12 decisões; ler a folha de teste | H12 decisões; ler os enunciados das disciplinas | Ajustes do `eval` (busca e fichas) |
| **ter 11/11** | Disciplinas | H10 publicar o site | Capturas do instalador com fichas reais; publicação automática (T8) se decidido |
| **qua 12/11** | Disciplinas | Disciplinas | — |
| **qui 13/11** | H6 especialista | Ensaiar o teste no celular (voz, QR, instalar, modo um toque) | Correções do ensaio |
| **sex 14/11** | **Código congelado** (só correções) | | |
| **sáb 15/11** | **H9 teste com pessoas** | **H9 teste com pessoas** | — |
| **dom 16/11** | H9 e números | H9 e números | C2 correções |
| **seg 17/11** | Gravar o pitch (H11) | Vídeos técnicos das disciplinas | C2; registro final |
| **ter 18/11** | **Entregar tudo no portal** | **Entregar tudo no portal** | — |
| **qua 19/11** | Prazo final (reserva) | | |

A divisão é sugestão do guia; troquem quando fizer sentido. Regra para não enroscar: **antes de mexer, `git pull`; depois, commit e envio ao `main` no mesmo dia.**

---

## 4. Como fazer cada pendência humana

O Claude Code **explica, prepara e confere**, mas **não** inventa conteúdo, não cria conta, não entra com senha e não guarda segredo no repositório.

### H1. Fichas da base (`data/kb.json`): PRIMEIRO
- **Por que:** o app só responde com o que está na base; é o que mais pesa na nota.
- **Passo a passo:**
  1. Leia [data/README.md](data/README.md) (campos, exemplo, `condicoes`).
  2. Para cada direito: abra a **fonte oficial**, copie só o que está lá, em linguagem simples. Anote o link (https) e a data em que abriu.
  3. Traga também, quando a fonte tiver: **a lei e o artigo** com o link do texto oficial (`base_legal`); a frase curta para o motorista (`frase_motorista`); o que o laudo precisa conter (`requisitos_laudo`); para as negativas mais comuns, um modelo de pedido com "(preencha seu nome)" (`modelo_recurso`); e em qual atalho a ficha entra (`deslocamento`, `dirigir`, `calcada`).
  4. Cole o texto da fonte no chat com o Claude Code; ele monta o JSON (C1).
- **Sugestões do guia (confirmar cada uma na fonte):** Bilhete Único Especial/gratuidade no transporte, BPC, Atende+ (transporte porta a porta), táxi acessível, vaga especial/cartão de estacionamento, CNH especial e isenções do carro adaptado, conserto de calçada pelo SP156.
- **Conferir:** `npm run validar-kb`, `npm run auditar-perguntas`, `npm test`.

### H2. Canais oficiais
- Fichas `tipo: "servico"` da Central 156 e do canal de reclamação da SPTrans, com `onde.texto`, `onde.link` e fonte oficial. O Claude Code põe os ids em `canalOficialId` e `canaisReclamacaoIds`.
- **Conferir:** pergunta fora da base mostra o canal; a Reclamação pronta mostra "Onde enviar".

### H3. Valores oficiais de serviços (opcional)
- **Para que serve:** quando alguém cola "me cobraram R$ 50 para fazer o cartão", o "Conferir se é oficial" compara com o valor oficial e diz Oficial ou Suspeito. Sem valores, responde "Não sei". É o que faz o verificador de golpes funcionar com cobranças, e não só com links.
- **Candidatos a conferir** (golpes comuns cobram por algo que é gratuito; **confirme cada um na fonte**, nada aqui é valor):
  1. Pedido do Bilhete Único Especial (pessoa com deficiência) e a segunda via do cartão: SPTrans.
  2. Inscrição e atualização no Cadastro Único: Ministério do Desenvolvimento Social ou Prefeitura.
  3. Pedido do BPC no INSS: gov.br/inss.
  4. Cartão de estacionamento para vaga especial: Prefeitura (DSV).
  5. Pedido do Atende+: SPTrans.
- **Para cada um, traga:** o nome do serviço, o valor em reais (0 = gratuito), o link oficial (https) e a data em que abriu a página. Cole no chat com o Claude Code, que monta o JSON (formato em [data/README.md](data/README.md)) e roda `npm run validar-kb`.
- **Conferir:** em "Conferir se é oficial", colar "cobraram R$ 30 pela segunda via" deve dar Suspeito, se a fonte disser que é gratuito.

### H4. Subprefeituras
- Compare `p_subprefeitura` em `data/perguntas.json` com a lista oficial da Prefeitura e diga ao Claude Code o que muda.
- **Feito em 07/11/2026:** as 32 conferem com a [lista oficial](http://prefeitura.sp.gov.br/subprefeituras/w/subprefeituras/8978). Três aparecem abreviadas no índice da Prefeitura (Casa Verde, Mboi Mirim, Perus); o Gabriel decidiu manter os nomes completos do app (Casa Verde/Cachoeirinha, M'Boi Mirim, Perus/Anhanguera). Nada mudou no código.

### H5. Gabaritos
- **Quem não montou as fichas** (Gabriel) escreve as perguntas do grupo `teste` em `eval/gabarito_perguntas.csv` **antes** de olhar as `perguntas_exemplo`, e os cenários em `eval/gabarito_cenarios.json`. Formatos em [eval/README.md](eval/README.md).
- **Conferir:** `npm run eval`. Meta do guia: acerto de 85% ou mais e 100% das perguntas fora do escopo recusadas.

### H6. Especialista
- Alguém da área (assistente social, Defensoria, associação) lê uma amostra das fichas, dos modelos de pedido e das frases para o motorista. Anotar na [folha de teste](docs/folha-de-teste.md), seção 1.

### H7 e H8. Supabase e token da SPTrans
1. Projeto em https://supabase.com. Copie `.env.example` para `.env.local` e preencha `VITE_SUPABASE_URL` e `VITE_SUPABASE_PUBLISHABLE_KEY`. **A chave secreta nunca vai para o `.env.local` nem para o git.**
2. Cadastro em https://www.sptrans.com.br/desenvolvedores/ → "Meus Aplicativos" → token.
3. Guardar **só** como segredo da função: `supabase secrets set SPTRANS_TOKEN=...` e `supabase functions deploy onibus`.
4. Ligar `VITE_EMBARQUE_ATIVO=true` e testar **um ponto real**.
5. **Contar ao Claude Code:** a consulta funciona depois do login? o horário previsto bate com o relógio? o campo de acessibilidade vem preenchido? o texto do sentido está certo?
- **H7 feita em 07/11/2026:** projeto `mapiii` (id `pzronsfttmwiqfpnxpow`, região São Paulo, plano gratuito, "expor tabelas novas automaticamente" desligado), sem migração aplicada (login cortado). URL e chave publicável no `.env.local` do computador do Gabriel; chave conferida (a API respondeu 200). O plano gratuito pausa o projeto depois de 7 dias sem uso: abrir o painel antes de 13/11.
- **H8 em andamento (07/11/2026):** aplicativo "Mapiii" cadastrado na SPTrans (chave "homologada e em uso"), chave guardada como segredo `SPTRANS_TOKEN` no projeto `mapiii` e função `onibus` publicada. O login da SPTrans ainda responde `false` para essa chave (conferido que a chave salva é idêntica à da página, comparando só o hash). Provável: chave nova ainda não ativada. Testar de novo mais tarde com `{"acao":"paradas","termo":"Paulista"}`.
- **Atenção:** o `.env.local` deste computador aponta para o simulador. Antes do build de produção, ele precisa apontar para o Supabase da dupla (ou o Embarque fica só com o exemplo).

### H9. Teste com pessoas
- Siga a [folha de teste](docs/folha-de-teste.md): 5 a 8 participantes, só por código, os 4 indicadores (acerto, tempo × busca na web, tempo até o ônibus certo, facilidade de uso/SUS) e as perguntas abertas.
- **No celular de verdade, conferir também:** voz (falar e ouvir), vibração do aviso de chegada, instalar o app, atalhos ao segurar o ícone, ler o QR do "Mostre ao motorista", modo um toque e um leitor de tela (TalkBack ou VoiceOver).
- No fim, baixar os CSVs em `avaliacao.html`.

### H10. Publicar o site
- Decidir a flag do Embarque **antes** do build. `npm run build` e publicar a pasta `dist/` com `https` (GitHub Pages, Netlify, Vercel ou Cloudflare Pages).
- **Conferir:** abrir no celular, navegar, desligar a internet e recarregar.

### H11. Vídeo pitch e entregas
- Pitch de até 3 min, na pasta "Entrega do vídeo pitch"; os vídeos técnicos vão na entrega de cada disciplina (trocar faz o professor desconsiderar).
- Roteiro e destaques na [seção 7](#7-vídeo-pitch).

---

## 5. Decisões que a dupla precisa tomar (até 10/11)

| Decisão | Opções | Recomendação |
|---|---|---|
| **Conta opcional (login)** | Cortar ou fazer | **Cortar** (o guia pede "nenhum login"). O banco fica no repositório sem uso. Falta o Gabriel confirmar. |
| **Embarque no site publicado** | Ligado com dado real, só exemplo, ou desligado | Ligado; com exemplo até o token funcionar |
| **Onde publicar** | GitHub Pages, Netlify, Vercel | GitHub Pages: já está no GitHub; o Claude Code faz a publicação automática (T8) depois que alguém liga em Settings → Pages |
| **Endereço do site** | Nome padrão ou domínio próprio | Nome padrão legível (sem custo) |
| **Pitch segue o case?** | Perguntar ao professor ou Scrum Master | Perguntar; a solução cumpre o case de qualquer forma |

Já decidido: Embarque por ponto; voz padrão do aparelho; lembrar respostas no aparelho (desmarcado por padrão); confirmação antes de apagar; ferramentas de teste só de desenvolvimento; repositório público.

---

## 6. Pendências de melhorias (não bloqueiam a entrega)

Todas as melhorias de código do plano estão feitas (fases A a E). Faltam as que dependem da dupla:

| # | Melhoria | Quem | Como |
|---|---|---|---|
| V4 | Ícones de microfone e alto-falante | Dupla no **Claude Design** | Pedido pronto para colar em [docs/pedidos-claude-design.md](docs/pedidos-claude-design.md) |
| V5 | Mapi no tema escuro | Dupla no **Claude Design** | Pedido pronto para colar em [docs/pedidos-claude-design.md](docs/pedidos-claude-design.md) |
| V6 | Endereço com nome bonito | Dupla | Junto com H10 |
| ~~T8~~ | Publicação automática **Feito 07/11** | Pages ligado (Source: GitHub Actions); site em https://gabrielroma0.github.io/mapiii-assistente/ . Para o Embarque, criar as variáveis do Actions (ver `publicar.yml`) | Cada envio ao `main` atualiza o site |
| P2 | Página "Sobre o projeto" para a banca | **Tela pronta (07/11)** em `#/projeto`; falta a dupla preencher `persona` e `numeros` em `data/projeto.json` depois de 16/11 | O validador recusa número sem fonte e dado pessoal |
| — | Capturas do instalador com fichas reais | Claude Code | Gerar de novo depois de H1 (hoje mostram o exemplo) |
| — | Valores oficiais (H3) | Thor | Só se sobrar tempo |

---

## 7. Vídeo pitch

Roteiro do guia v2 (até 3 min), com o que mostrar:

| Tempo | Pergunta da banca | O que mostrar |
|---|---|---|
| 0:00–0:25 | Quem é a pessoa? | A persona real, com uma frase das entrevistas (folha de teste, seção 5) |
| 0:25–0:50 | Que problema real? | Informação espalhada e embarque negado; um número com fonte (Censo 2022, conferido no IBGE) |
| 0:50–2:00 | Como funciona? | Descubra → Prepare → Garanta na rua, ao vivo |
| 2:00–2:30 | Que evidências? | Números do teste, inclusive os ruins; acessibilidade 100 |
| 2:30–3:00 | Impacto e ODS | ODS 10 e 11; visão de futuro (mapa de calçadas) |

**Destaques para gravar** (os que mais chamam atenção):
1. **Aviso de chegada falado:** celular no bolso falando "O ônibus acessível chega em 2 minutos" e vibrando.
2. **Embarque ao vivo:** a contagem caindo e "passam 2 ônibus sem acessibilidade antes".
3. **Modo um toque:** usar o app inteiro com um único toque na tela.
4. **Atalho no ícone:** segurar o ícone e aparecer "Próximo ônibus acessível".
5. **Modo avião:** continuar usando sem internet.
6. **Mostre ao motorista:** a câmera lendo o QR da lei.
7. **A, A+, A++** e **ouvir a resposta**.
8. **Nota de acessibilidade 100** (print do Lighthouse).

---

## 8. Disciplinas (8 entregas no Portal do Aluno, até 18/11)

Ficam fora deste repositório. Todas podem reaproveitar o mesmo `data/kb.json` (por isso as fichas vêm primeiro). Confirmar os detalhes no enunciado de cada professor.

| Disciplina | O que pede (resumo do guia) | Como reaproveitar o Mapiii |
|---|---|---|
| Pensamento Computacional e Automação com Python | "Cérebro" do assistente em Python, entradas inválidas, indicadores, GitHub e vídeo técnico | Portar a busca e as regras para Python lendo o `kb.json`; os testes com pessoas servem |
| Data Structures and Algorithms | Sistema em C com menu, structs, listas encadeadas, Big-O | Fichas viram structs numa lista encadeada; busca por título, ordenação por prazo ou tipo |
| Computer Science | Decisão booleana: tabela-verdade, De Morgan, Karnaugh | As regras da triagem (`condicoes`) |
| Prompt and Artificial Intelligence | RAG com ChromaDB, LangChain, guardrails, RAGAS, vídeo | Os documentos oficiais das fichas; a "armadilha" de fonte desatualizada já existe |
| Energias Renováveis | Uso consciente de energia, 2 alternativas, vídeo e GitHub | Custo de carregar cadeira motorizada, tarifa social, solar |
| Modelagem Linear | Estatística em Python, regressão | Formulário anônimo, resultados do teste, Censo 2022 |
| Computer Organization and Architecture | Fila virtual para posto de atendimento | Case próprio, ambientado no posto onde a família faz os pedidos |
| Modelagem Matemática | Distribuição da frota de ônibus por região | Recorte de frota acessível com o campo `a` da Olho Vivo |

---

## 9. Riscos e como reduzir

| Risco | Nível | Como reduzir |
|---|---|---|
| Fichas não ficarem prontas até 9/11 | **Alto** | Começar pelos 3 temas mais fortes; o Claude Code monta o JSON na hora |
| Informação legal errada (inclusive no "Mostre ao motorista") | **Alto** | Só lei e artigo copiados da fonte oficial; especialista revisa (H6); nunca "você tem direito" |
| Muita entrega para uma dupla (8 disciplinas + pitch) | **Alto** | Uma base só para tudo; código congelado em 14/11 |
| API da SPTrans não funcionar | Médio | Modo exemplo pronto, com contagem e aviso falado |
| Pouca gente para o teste | Médio | Marcar já; plano B: familiares, vizinhos, idosos |
| Diferença entre o computador e o celular (voz, vibração, instalação) | Médio | Ensaio no celular em 13/11 |
| Enroscar com o trabalho do outro no git | Baixo | `git pull` antes, commit e envio no mesmo dia |

---

## 10. Como saber onde estamos

```bash
npm install
```

```bash
npm run verificar
```

```bash
npm run e2e
```

```bash
npm run auditar-perguntas
```

```bash
npm run eval
```

```bash
node -e "console.log(require('./data/kb.json').length + ' fichas')"
```

- `verificar` = tipos + testes de lógica + dados válidos. Tem que passar sempre.
- `e2e` = testes de tela e acessibilidade num navegador de verdade.
- `auditar-perguntas` passa quando a base usa todas as perguntas da triagem (falha com a base vazia).
- `eval` mostra o acerto atual.
- Outros: `npm run lighthouse` (precisa de `npm run build` antes), `npm run conferir-links`, `npm run test:banco` (Docker).

## 11. Regras que não podem ser quebradas

- Nada fora da base; nenhuma ficha sem fonte; nenhuma lei, valor, prazo, telefone ou link inventado.
- Nunca "você tem direito".
- Sem dados pessoais; respostas da triagem só em memória, a não ser que a pessoa marque "Lembrar neste aparelho".
- Sem login, sem cookies de rastreamento, sem analytics.
- Aviso fixo de protótipo em todas as telas; não se apresentar como canal oficial.
- Emergência de saúde: só "Em emergência, ligue 192."
- Segredos só como segredo de Edge Function; nunca no git, no `.env.local` ou no navegador.
- Embarque: nunca usar a localização; "acessível" é o que a SPTrans informa.
- Design: só o `design-system/`; o Mapi não é redesenhado.
