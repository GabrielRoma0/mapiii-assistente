# O que falta no Mapiii (e quem faz)

Planejamento completo da dupla (Thor e Gabriel) até a entrega. Diz o que está pronto, **o que é obrigatório para entregar**, o que é melhoria, quem faz, quando, como fazer e como conferir.

- **Entrega final de tudo: 19/11/2026.** Deixar pronto até **18/11 à noite** (17/11 já é período de substitutivas).
- Escopo e cronograma: guia da dupla **versão 2 (04/11/2026)**.
- Histórico do que já foi feito: [docs/registro.md](docs/registro.md). Melhorias de código: [docs/plano-de-melhorias.md](docs/plano-de-melhorias.md).

> Para o Claude Code de quem pegar o projeto: leia também o [CLAUDE.md](CLAUDE.md). Quando perguntarem "o que eu faço agora?", siga a [seção 3](#3-cronograma-dia-a-dia) e confira o estado com os comandos da [seção 10](#10-como-saber-onde-estamos).

Última atualização: 10/11/2026.

---

## Atualizações de 10/11 (Thor, com o Claude Code): leia primeiro

**Decisões (H12), aprovadas pelo Gabriel em 10/11:**

| Decisão | Ficou assim |
|---|---|
| Conta opcional (login) | **Cortada.** O banco fica no repositório sem uso |
| Roteiro do pitch | **v2 (enxuto, cerca de 2:12)**, o de [video/README.md](video/README.md) |
| Embarque no site publicado | **Ligado.** Falta o Gabriel criar as 3 variáveis do Actions (ver H10) |
| Teste com pessoas no vídeo | **Não entra (B), decisão do Gabriel em 10/11.** A cena 12 fica com 12 de 12 recusas e acessibilidade 100; o formulário vai para o relatório e a tela "Sobre o projeto" |

- **H9 = o formulário do Gabriel** ([docs/formulario-teste.md](docs/formulario-teste.md)). Falta mandar o link e juntar 5 a 8 respostas até 15/11.
- **H10: o app funciona sem internet** (conferido pelo Thor em 10/11).
- **H5 (perguntas): feito em 10/11.** 17 perguntas do grupo `teste`, escritas por um amigo do Thor sem ver o app (gabarito marcado pelo Claude Code: 7 com ficha, 10 fora da base). **Resultado honesto: 58,8% (10 de 17)**, abaixo da meta de 85%. Todos os 7 erros são "não encontrei" (a ficha certa aparecia nas sugestões em quase todos), ou seja, o limite da busca (0,3) está alto para perguntas longas e informais e as fichas não têm perguntas `ajuste` próprias. Recusas: 100% (10 de 10 no grupo teste).
- **C4, calibração da busca: feita em 10/11.** 30 perguntas `ajuste` novas, escritas pelo Claude Code sem usar as 17 do teste. Mudanças: abreviações de mensagem e "sp"/"paulo" ignorados; formas iguais juntas (deficiente = deficiência, de graça = gratuidade, renova, denuncia, reclamo); algumas palavras-chave e perguntas de exemplo nas fichas; limite de resposta de 0,3 para 0,25. Resultado: ajuste 100% (42/42), recusas 100% (26/26), **teste 58,8% → 70,6%** (12/17). Nenhum ajuste foi feito olhando os erros do teste; mesmo assim o Claude Code já tinha lido as 17 perguntas, então o número honesto final vem de um **segundo lote `teste`** (15 a 20 perguntas de outra pessoa que nunca viu o app). Para a banca: mostrar os dois números. Cenários (`eval/gabarito_cenarios.json`): opcionais.
- `npm run verificar` passa (303 testes); `eval`: 12 de 12 recusas.

## Atualizações de 09/11, tarde (Thor, com o Claude Code)

**H1 e H2 feitas: a base tem 14 fichas.** As 2 últimas (reclamação de ônibus e Ouvidoria da SPTrans) usam 2 prints do Thor do site da SPTrans e o texto do SP156; os ids estão em `canaisReclamacaoIds`, o que liga o "Onde enviar" da Reclamação pronta. O **Portal SP156 passou a abrir para leitura automática**, então estas 6 fichas foram montadas com o texto oficial baixado pelo Claude Code (em `docs/fontes/<id>/`), sem print:

| Ficha | Tipo | Fonte (SP156) |
|---|---|---|
| `cartao-defis-estacionamento` | direito, atalho "Quero dirigir" | serviço 3314 |
| `calcada-publica-manutencao` | serviço, atalho "Calçada ruim?" | serviço 931 |
| `calcada-particular-denuncia` | serviço, atalho "Calçada ruim?" | serviço 906 |
| `calcada-obstaculo-acessibilidade` | serviço, atalho "Calçada ruim?" | serviço 2634 |
| `central-156` | serviço (H2), agora é o `canalOficialId` em `src/core/config.ts` | Outros canais de atendimento |
| `ouvidoria-geral-municipio` | serviço (H2) | serviço 2630 |

- **Conferência humana (opcional):** abrir cada link e ver se bate com a ficha. Print não é obrigatório.
- **Táxi acessível:** a página da Prefeitura é de 2009 (só lista de telefones de empresas). Não serve como fonte; ficou de fora.
- **CNH:** ficha `cnh-renovacao-pcd` (renovação, atalho "Quero dirigir") feita com 3 prints do Thor da página do Detran-SP, em `docs/fontes/cnh-renovacao-pcd/`. **A base tem 12 fichas.**
- **SPTrans (H2):** `reclamacao-onibus-sptrans` (SP156 serviço 976; o "Fale Conosco" e os "Contatos" da SPTrans, por print, mandam reclamações para o 156) e `ouvidoria-sptrans` (segunda instância, ouvidoria@sptrans.com.br). **A base tem 14 fichas.**
- **Falta (opcional):** `modelo_recurso` do Bilhete Único (precisa de `base_legal` com link; o "para" agora pode ser a Ouvidoria da SPTrans) e `base_legal` nas fichas novas.
- **`auditar-perguntas`** já falhava antes (perguntas sem uso); agora são 4 (`p_quem`, `p_faixa`, `p_laudo`, `p_subprefeitura`), porque `p_cidade` passou a ser usada. `npm run verificar` passa (303 testes) e o `eval` segue em 100%. **Decisão do Gabriel (09/11): deixar como está.** A triagem já esconde perguntas que nenhuma ficha usa (conferido: aparecem só 8), então a falha do `auditar-perguntas` não afeta o app nem o vídeo.
- As fichas também alimentam o assistente em Python da disciplina de PCP (https://github.com/thorflk/citizen-assist-ai).

## Atualizações de 09/11 (Thor): leia primeiro

> **Para o Claude Code:** antes de responder "o que eu faço agora?", leia esta seção e o [video/README.md](video/README.md). A H1 foi fechada na tarde de 09/11 (seção acima). A SPTrans continua sem abrir para leitura automática (Cloudflare) e o Detran-SP só carrega com JavaScript: nesses, a fonte é por print do Thor. O SP156 passou a abrir. Não tente contornar bloqueio.

**Feito:**

| Item | O que mudou |
|---|---|
| **Vídeo** | Documento único em [video/README.md](video/README.md): roteiro, estilo, regras de tempo, linha de rota, som, montagem no Remotion, revisão por notas e cronograma. Todos os 9 pedidos do Claude Design feitos (quadros 01 a 15, Mapi 3D, objetos 3D, celular 3D, moldura de câmera, nomes, legenda, relógio). Tudo o que o Claude Design gera também fica no artefato https://claude.ai/artifact/6Vkhuq9j7zNxiXF3ccbmfs |
| **H1 (1ª ficha)** | `bilhete-unico-especial-pcd` em `data/kb.json`, com gratuidade, documentos, prazos (análise e entrega em até 20 dias), laudo, Acompanhante Cadastrado (estudante), casas de acolhimento e o que fazer se o cartão não chegar. Prints da fonte em [docs/fontes/bilhete-unico-especial-pcd/](docs/fontes/bilhete-unico-especial-pcd/README.md) |
| **Rede** | Ambiente de nuvem `mapiii-assistente` com os sites oficiais liberados (Prefeitura, legislação municipal, Planalto, gov.br, IBGE, ALESP). SPTrans e SP156 continuam recusando acesso automático |
| **V4** | Microfone e alto-falante: não será feito agora (decisão do Thor) |

**Ficha do Bilhete Único Especial: fechada em 09/11** (só o `modelo_recurso` espera a H2):
1. ~~Renovação~~ **Feito 09/11** (passo novo na ficha).
2. ~~Custo de entrega~~ **Feito 09/11**: gratuito, também em `data/servicos-valores.json` (primeiro valor da H3).
3. ~~Link oficial da lei ou das portarias~~ **Feito 09/11:** `base_legal` com a Lei Municipal 11.250/1992 e a Portaria SMT.GAB 50/2019 (catálogo de legislação da Prefeitura, prints em `docs/fontes/`) e `frase_motorista`. A ficha já aparece em "Mostre ao motorista".
4. Pedido negado ou indeferido: não há pergunta sobre isso na página. Não usar o "modo IA" do Google (citava Reclame Aqui e Estadão). O `modelo_recurso` ("Me negaram") espera a **H2**: precisa do canal oficial de reclamação da SPTrans para o campo "para".

**BPC (`bpc-pcd`): fechado em 09/11.** Texto do gov.br e do INSS baixado pelo Claude Code e conferido por print do Thor (`docs/fontes/bpc-pcd/`); `base_legal` com a Lei 8.742/1993 e `modelo_recurso` no "Me negaram". A pergunta `p_renda` agora é em faixas (até 1/4, até 1/2, mais de 1/2, não sei).

**Atende+ (`atende-mais`): na base em 09/11**, montado com os prints da SPTrans e o regulamento do serviço (PDF de nov/2017 enviado pelo Thor). Lei 16.337/2015 na `base_legal` e o PDF do regulamento como fonte (09/11). Opcional: a página "Cadastre-se no Atende+" para conferir os documentos.

**Passe Livre Interestadual e isenção de IPI/IOF do carro: na base em 09/11**, com o texto do gov.br e da Receita baixado pelo Claude Code (em `docs/fontes/`). Os dois conferidos por print do Thor em 09/11.

~~**Próximas fichas**~~ **Feito na tarde de 09/11** (ver a seção do topo; táxi acessível ficou de fora por fonte de 2009): táxi acessível; vaga especial e cartão de estacionamento na capital (o DETRAN-SP não emite para a cidade de São Paulo, ver `docs/fontes/vaga-especial/`); CNH para pessoa com deficiência (o site do DETRAN-SP abre, mas não tem página sobre isso); conserto de calçada pelo SP156; H2 (Central 156 e canal de reclamação da SPTrans). Ambiente: liberados DETRAN-SP, CET e Poupatempo em 09/11. Depois a **H2** (Central 156 e canal de reclamação da SPTrans). Meta: 10 a 13 fichas.

## Atualizações de 07/11 (Gabriel): leia primeiro

> **Para o Claude Code do Thor:** antes de responder "o que eu faço agora?", conte ao Thor o resumo abaixo e **rode `npm run testar-sptrans`** (item H8). Detalhes de cada item em [docs/registro.md](docs/registro.md), seção "07/11/2026".

**Feito:**

| Item | O que mudou |
|---|---|
| **H4** | As 32 subprefeituras conferem com a lista oficial. Mantidos os nomes completos (Casa Verde/Cachoeirinha, M'Boi Mirim, Perus/Anhanguera). |
| **H7** | Projeto Supabase `mapiii` (id `pzronsfttmwiqfpnxpow`, região São Paulo), na conta do Gabriel. Nenhuma migração aplicada (login cortado). |
| **T8 / H10** | **Site no ar:** https://gabrielroma0.github.io/mapiii-assistente/ . Cada envio ao `main` publica sozinho (`.github/workflows/publicar.yml`). Ainda sem fichas e com o Embarque desligado. |
| **P2** | Tela "Sobre o projeto" em `#/projeto`. Conteúdo em `data/projeto.json`; `persona` e `numeros` ficam vazios até o teste com pessoas. |
| **Vídeo pitch** | **Documento único em [video/README.md](video/README.md)** (07/11): decisões, regras, estilo, as 18 cenas, locução, o que falta, gravações, som, montagem no Remotion, revisão, audiodescrição, pedidos do Claude Design e cronograma. Toda mudança do vídeo é feita lá. O vídeo técnico das disciplinas fica em [video/roteiro-tecnico.md](video/roteiro-tecnico.md). |
| **V4 / V5** | V4 não será feito agora (decisão do Thor, 07/11). V5 fica para depois do vídeo. Pedidos em [docs/pedidos-claude-design.md](docs/pedidos-claude-design.md). |
| **V8 (Thor)** | Mapi com cara de 3D, só para o vídeo. Feito: ver [video/README.md](video/README.md). |
| **H3** | Lista de serviços a conferir e o passo a passo na seção 4 (H3). Nenhum valor foi escrito. |
| **V8 a V10 (Thor)** | Mapi 3D, 13 quadros e capa feitos no Claude Design. Próximos pedidos (quadro 14 do fecho com a rampa descida e, opcional, objetos 3D) na seção 12 de [video/README.md](video/README.md). |
| **V8 feito (Thor, 07/11)** | Mapi 3D pronto: 7 poses PNG transparentes (2000 × 2000) em `video/mapi-3d/`, conferidas com o Mapi plano nos dois fundos. Próximo: pedido 2 (quadros) na mesma conversa do Claude Design. |
| **V9 feito (Thor, 07/11)** | 13 quadros 16:9 em `video/quadros/` (`01.png` a `13.png`) e o HTML em `design-system/Mapiii Pitch Quadros 16x9.html`. Conferidos: sem lei, valor, prazo, telefone ou link; quadro 5 com a pergunta real da triagem. Na montagem: trocar o mapa-múndi desenhado à mão por um contorno de uso livre e carregar a IBM Plex Mono. Próximo: pedido 3 (capa). |
| **V10 feito (Thor, 07/11)** | Capa do YouTube em `video/capa.png` (1280 × 720): versão A (ponto de ônibus à noite, porta sem rampa, pessoa em cadeira de rodas e Mapi 3D atencao). Testada reduzida nos temas claro e escuro do YouTube. Os três pedidos do Claude Design para o vídeo estão feitos. |

**H8 · SPTrans: em andamento, precisa ser testada de novo**

- Já feito: aplicativo "Mapiii" cadastrado na SPTrans (conta do Gabriel), chave guardada como segredo `SPTRANS_TOKEN` no Supabase, função `onibus` publicada. Corrigido um defeito: o login da SPTrans responde 411 se o pedido for sem corpo (`supabase/functions/_shared/onibus-servidor.ts`, com teste).
- Problema: em 07/11 a SPTrans respondia `false` no login, mesmo com a chave certa (conferido por hash que a chave salva é a da página). O mais provável é que a chave nova ainda não estivesse ativa.
- **Como testar de novo:**

  ```bash
  npm run testar-sptrans
  ```

  O script precisa de `VITE_SUPABASE_URL` e `VITE_SUPABASE_PUBLISHABLE_KEY` no `.env.local`. São públicas: peça os dois valores ao Gabriel, ou copie do painel do Supabase se ele te convidar para a organização. A chave secreta e o token da SPTrans **não** vão para o `.env.local`.
- **Se der "SPTrans OK":** ligar `VITE_EMBARQUE_ATIVO=true`, testar um ponto real no app e conferir os 4 pontos da H8 (a sessão continua depois do login? o horário previsto bate com o relógio? o campo de acessibilidade vem preenchido? o texto do sentido está certo?). Depois, a C3.
- **Se continuar "api_fora" em 08/11:** o Gabriel apaga o aplicativo na SPTrans, cria outro e troca o segredo `SPTRANS_TOKEN` no Supabase. Só ele tem acesso às duas contas. Isso também troca a chave que ficou visível num terminal em 07/11.

**Decisões abertas para a dupla (H12, até 10/11):** cortar o login (recomendado); ligar o Embarque no site (criar as variáveis do Actions descritas no `publicar.yml`); manter o recorte em São Paulo como piloto (o Gabriel levantou a dúvida por causa do nome "Global Solution"; recomendação: manter e mostrar no pitch como se replica em outras cidades; confirmar com o professor); as 5 perguntas do Wagner para o pitch (o roteiro usou as 5 da banca do guia v2).

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
| ~~**H1**~~ | ~~**Fichas da base** (10 a 13, com fonte oficial e lei)~~ **Feito 09/11: 14 fichas** (Bilhete Único Especial, BPC, Atende+, Passe Livre Interestadual, IPI/IOF, Cartão DeFis, CNH, 3 de calçada, Central 156, Ouvidoria Geral, reclamação de ônibus e Ouvidoria da SPTrans). Opcional: `base_legal` com link nas fichas novas | Thor | **9/11** | — |
| ~~**H2**~~ | ~~Fichas dos **canais oficiais**~~ **Feito 09/11:** Central 156, Ouvidoria Geral do Município, reclamação de ônibus (SPTrans pelo 156) e Ouvidoria da SPTrans. Opcional: `modelo_recurso` do Bilhete Único | Thor | 9/11 | — |
| **C1** | Montar o JSON das fichas, configurar os canais em `config.ts`, rodar validadores e `eval`. **Feito 09/11:** 14 fichas, `canalOficialId` e `canaisReclamacaoIds` | Claude Code | — | — |
| **H5** | **Gabarito do grupo `teste`**: **feito 10/11** (17 perguntas, 58,8%). Falta um segundo lote depois da C4 e, opcional, os cenários | Dupla | 12/11 | C4 |
| ~~**H4**~~ | ~~Conferir as **32 subprefeituras**~~ **Feito 07/11** | Gabriel | 10/11 | nada |
| **H12** | **Decisões finais** (seção 5). **Feito 10/11**, menos o teste no vídeo (A ou B), que o Gabriel decide | Dupla | 10/11 | nada |
| **H10** | **Publicar o site** (com `https`): **no ar desde 07/11** em https://gabrielroma0.github.io/mapiii-assistente/ (atualiza a cada envio ao `main`). ~~Falta: fichas~~ (14 fichas no ar desde 09/11). ~~Falta: decidir o Embarque e conferir no celular sem internet~~ **10/11:** Embarque ligado (falta criar as variáveis do Actions) e sem internet conferido | Dupla | 12/11 | H1 (primeiras fichas), H12 |
| **H6** | **Revisão por especialista** de uma amostra | Dupla | 14/11 | H1, H5 |
| **H9** | **Teste com 5 a 8 pessoas** e coleta dos indicadores | Dupla | **15 e 16/11** | H10 |
| **C2** | Corrigir o que o teste mostrar; atualizar números no registro | Claude Code | 17/11 | H9 |
| **H11** | **Vídeo pitch** e **entregas no Portal do Aluno** | Dupla | **18/11** | H9 |

Opcional mas recomendado para o pitch (o Embarque com dado real é o diferencial):

| # | Tarefa | Quem | Prazo | Depende de |
|---|---|---|---|---|
| ~~**H7**~~ | ~~Projeto Supabase~~ **Feito 07/11** | Gabriel | 9/11 | nada |
| **H8** | **Token da SPTrans** e primeiro teste real (**09/11: SPTrans OK** no `testar-sptrans`; chave do Mapiii v2 em uso; falta conferir os 4 pontos no app) | Gabriel | 10/11 | H7 |
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
- **09/11/2026: SPTrans OK com a chave nova.** App "Mapiii v2" criado na SPTrans; a chave dele está no segredo `SPTRANS_TOKEN` (digest começa com `f12d6d26`) e `npm run testar-sptrans` deu "SPTrans OK" (2 pontos para "Paulista"). O segredo com nome errado já foi removido. O portal da SPTrans não tem opção de apagar nem editar app (conferido em 09/11), então o "Mapiii" antigo fica lá sem uso; a chave dele só dá leitura de dados públicos do Olho Vivo. Falta: conferir os 4 pontos no app com `VITE_EMBARQUE_ATIVO=true`.
- **H8 em andamento (07/11/2026):** aplicativo "Mapiii" cadastrado na SPTrans (chave "homologada e em uso"), chave guardada como segredo `SPTRANS_TOKEN` no projeto `mapiii` e função `onibus` publicada. O login da SPTrans ainda responde `false` para essa chave (conferido que a chave salva é idêntica à da página, comparando só o hash). Provável: chave nova ainda não ativada. Testar de novo mais tarde com `{"acao":"paradas","termo":"Paulista"}`.
- **Atenção:** o `.env.local` deste computador aponta para o simulador. Antes do build de produção, ele precisa apontar para o Supabase da dupla (ou o Embarque fica só com o exemplo).

### H9. Teste com pessoas
- **Decisão do Gabriel (09/11/2026): teste a distância, por Google Forms.** A pessoa recebe o link, faz a tarefa sozinha e responde. Formulário pronto: https://docs.google.com/forms/d/e/1FAIpQLSfEOVKYIH9_19hVdXwO5Vo6Kfwglwxrg1lwgYx2OHYBYEvHTQ/viewform (detalhes em [docs/formulario-teste.md](docs/formulario-teste.md)); convite em [docs/convite-e-termo.md](docs/convite-e-termo.md). O tempo vem em faixas informadas pela pessoa (dizer isso no relatório) e o Embarque fica fora. A folha presencial abaixo continua valendo para quem a dupla conseguir encontrar.
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
| **Conta opcional (login)** | Cortar ou fazer | **Cortado** (Gabriel confirmou em 10/11). O banco fica no repositório sem uso. |
| **Embarque no site publicado** | Ligado com dado real, só exemplo, ou desligado | **Ligado** (Gabriel aprovou em 10/11). Criar as variáveis do Actions |
| **Onde publicar** | GitHub Pages, Netlify, Vercel | GitHub Pages: já está no GitHub; o Claude Code faz a publicação automática (T8) depois que alguém liga em Settings → Pages |
| **Endereço do site** | Nome padrão ou domínio próprio | Nome padrão legível (sem custo) |
| **Pitch segue o case?** | Perguntar ao professor ou Scrum Master | Perguntar; a solução cumpre o case de qualquer forma |
| **Teste com pessoas (H9)** | Teste completo com 5 a 8 pessoas ou só demonstrativo | 09/11: teste a distância pelo formulário do Gabriel. No vídeo: o Gabriel escolhe A (números do formulário na cena 12) ou B (sem eles). Sem números, a tela "Sobre o projeto" fica sem `numeros` de teste |
| **Roteiro do pitch** | v1 (Gabriel, 3:00) ou v2 (Thor, 2:10) | **v2**, em [video/README.md](video/README.md). Gabriel confirmou em 10/11. O v1 continua no histórico do git |

Já decidido: Embarque por ponto; voz padrão do aparelho; lembrar respostas no aparelho (desmarcado por padrão); confirmação antes de apagar; ferramentas de teste só de desenvolvimento; repositório público.

---

## 6. Pendências de melhorias (não bloqueiam a entrega)

Todas as melhorias de código do plano estão feitas (fases A a E). Faltam as que dependem da dupla:

| # | Melhoria | Quem | Como |
|---|---|---|---|
| ~~V4~~ | Ícones de microfone e alto-falante | — | **Não será feito agora** (decisão do Thor, 07/11): o vídeo não precisa |
| V5 | Mapi no tema escuro (depois do vídeo; não aparece nele) | Dupla no **Claude Design** | Pedido pronto para colar em [docs/pedidos-claude-design.md](docs/pedidos-claude-design.md) |
| V6 | Endereço com nome bonito | Dupla | Junto com H10 |
| ~~T8~~ | Publicação automática **Feito 07/11** | Pages ligado (Source: GitHub Actions); site em https://gabrielroma0.github.io/mapiii-assistente/ . Para o Embarque, criar as variáveis do Actions (ver `publicar.yml`) | Cada envio ao `main` atualiza o site |
| P2 | Página "Sobre o projeto" para a banca | **Tela pronta (07/11)** em `#/projeto`; falta a dupla preencher `persona` e `numeros` em `data/projeto.json` depois de 16/11 | O validador recusa número sem fonte e dado pessoal |
| — | Capturas do instalador com fichas reais | Claude Code | Gerar de novo depois de H1 (hoje mostram o exemplo) |
| — | Valores oficiais (H3) | Thor | Só se sobrar tempo |

---

## 7. Vídeo pitch

> **O roteiro final do vídeo está em [video/README.md](video/README.md).** A tabela abaixo é o plano original do guia v2 da dupla, mantido para referência.

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
