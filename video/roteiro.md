# Roteiro do vídeo pitch · Mapiii

> Vídeo **pitch** de até 3 minutos. Não é o vídeo técnico (esse fica em [roteiro-tecnico.md](roteiro-tecnico.md)).
> Feito em 07/11/2026 a partir do que existe no repositório nesse dia. Tudo marcado com **[PENDENTE]** ou **[CONFIRMAR]** precisa ser resolvido antes de gravar: a lista completa está em [checklist-final.md](checklist-final.md).

## a) Resumo e tom

**Em uma frase:** uma família descobre o que pode pedir, se prepara e garante o direito na rua, com um assistente que mostra a fonte de tudo e avisa o que não sabe.

**Tom:** conversa, calmo e firme. Começa por uma pessoa e uma cena real, nunca pela tecnologia. Frases curtas, uma ideia por cena, corte a cada 3 a 5 segundos. A prova aparece na tela (gravação do app de verdade), sem explicar como foi feito. Termina com emoção contida e o nome da marca.

**O que o vídeo pode mostrar como funcionando (conferido no código em 07/11):** triagem com "Pode ter direito / Talvez / Provavelmente não se aplica"; fonte com data de conferência; falar e ouvir; funcionar sem internet; "O que levar" para compartilhar; lista única do laudo; Mostre ao motorista com QR; Me negaram com modelo de pedido; recusas (remédio, processo, dados pessoais, emergência → 192); Conferir se é oficial; aviso fixo de protótipo.

**O que só aparece com selo:**
- **Embarque garantido:** o código existe, mas a API da SPTrans nunca foi chamada com token real. No vídeo: gravação no **modo exemplo** com o selo **"EXEMPLO, não é dado real"** na tela o tempo todo. A locução diz "em teste".
- **Mapa de calçadas:** não existe no app. Só a animação do design system, com o selo **"VISÃO DE FUTURO"**.

**O que não aparece de jeito nenhum:** a IA de reformulação (não está implementada; só está no BACKLOG), login ou conta, qualquer número que não esteja medido.

**Atenção ao conteúdo:** hoje a base (`data/kb.json`) tem **0 fichas**. As gravações das cenas 7, 10 a 13, 15, 16, 18 e 19 só podem ser feitas depois que as fichas reais existirem (H1, prazo 9/11). A base fictícia do `npm run dev` **não pode** aparecer no vídeo.

**Nome do verificador de golpes:** no app ele se chama **"Conferir se é oficial"**. O nome "Tá no gov.br?" não existe no projeto. O vídeo usa o nome do app. Se a dupla quiser o outro nome, primeiro muda no app, depois no vídeo.

## b) Tabela de cenas

Tempos calculados para a locução de 435 palavras em 3:00 (cerca de 145 palavras por minuto). O editor ajusta pelo áudio gravado. Dentro de cada cena, cortes de imagem a cada 3 a 5 s.

| # | Tempo | Ato | Imagem | Locução (texto exato) | Texto na tela | Som e trilha | Origem da imagem | Selo |
|---|---|---|---|---|---|---|---|---|
| 1 | 0:00–0:05 | Abertura | Animação plana: ponto de ônibus visto de lado, silhueta de pessoa em cadeira de rodas. O ônibus para, a porta abre, a rampa não desce. O ônibus vai embora. | O ônibus chegou. A rampa, não. | O ônibus chegou.<br>A rampa, não. | Ambiente de rua baixo; trilha entra só no fim da frase | Animação (produção da dupla) | — |
| 2 | 0:05–0:11 | Abertura | Mesma silhueta, parada no ponto. Corte para o relógio do ponto avançando. | Para muita gente que usa cadeira de rodas em São Paulo, essa cena se repete. | Essa cena se repete. | Trilha suave entra (baixa) | Animação | — |
| 3 | 0:11–0:22 | Abertura | Mãos segurando um celular, várias abas abertas; documentos sobre a mesa (sem rosto, sem nome em documento). | E o problema começa antes da rua. Quem cuida de alguém com deficiência quer saber uma coisa simples: o que eu posso pedir? Onde vou? O que levo? | O que eu posso pedir?<br>Onde vou? O que levo? | Trilha | Gravação de mãos (adulto voluntário, com autorização) ou animação | — |
| 4 | 0:22–0:27 | Abertura | Três cartões na tela, um por palavra: espalhada / difícil / golpe (o terceiro com ícone de alerta do design system). | A informação existe. Mas está espalhada, em linguagem difícil, e misturada com golpe. | Espalhada.<br>Difícil.<br>Com golpe. | Trilha; um toque seco a cada cartão | Animação com ícones do design system | — |
| 5 | 0:27–0:32 | Abertura | Número grande no centro, fonte embaixo. | No Brasil, são [PENDENTE: número do Censo 2022, conferido no IBGE] pessoas com deficiência, segundo o Censo de 2022. | [PENDENTE: número]<br>pessoas com deficiência no Brasil<br>Fonte: IBGE, Censo 2022 [CONFIRMAR NA FONTE] | Trilha | Animação (texto) | — |
| 6 | 0:32–0:37 | Abertura | Logo do Mapiii se forma; o Mapi aparece na pose "bom". | Foi pensando nelas que nasceu o Mapiii. O mapa dos seus direitos. | Mapiii<br>o mapa dos seus direitos | Trilha sobe um pouco | Logo e personagem do design-system/ | — |
| 7 | 0:37–0:46 | Abertura | Mapi na pose "verificado" (escudo com check), ao lado de um selo de fonte do app. | Este é o Mapi. Ele não inventa nada. Tudo o que mostra tem fonte oficial e a data em que foi conferido. | Fonte oficial.<br>Data de conferência. | Trilha | Personagem do design-system/ + recorte da gravação G1 | — |
| 8 | 0:46–0:52 | Abertura | Gravação real: o aviso fixo no topo do app, destacado com um contorno. | E ele avisa logo de cara: é um protótipo de estudo, não um canal oficial. | Protótipo de estudo.<br>Não é canal oficial. | Trilha | Gravação real (G1) | — |
| 9 | 0:52–0:54 | Descubra | Cartão de título do ato 1. | Primeiro passo: descubra. | 1. Descubra | Trilha; transição | Animação (texto) | — |
| 10 | 0:54–1:00 | Descubra | Gravação real da triagem: as perguntas passando, toque em "Prefiro não responder" numa delas. | Você responde poucas perguntas. Sem nome, sem CPF, sem endereço. E pode pular qualquer uma. | Sem nome. Sem CPF.<br>Pode pular. | Trilha | Gravação real (G1) | — |
| 11 | 1:00–1:10 | Descubra | Gravação real: a Rota dos Direitos aparece com os cartões "Pode ter direito" e "Talvez". Zoom no cartão principal. | Aí o Mapi mostra o que você pode pedir. Ele nunca diz "você tem direito". Ele diz "pode ter direito", e explica o porquê, numa frase. | "Pode ter direito"<br>+ o porquê | Trilha | Gravação real (G1) | — |
| 12 | 1:10–1:14 | Descubra | Gravação real: zoom no selo de fonte ("conferida há X dias"). | Embaixo, a fonte. E há quantos dias ela foi conferida. | Fonte + data | Trilha | Gravação real (G1) | — |
| 13 | 1:14–1:21 | Descubra | Gravação real: toque no microfone, a pergunta falada aparece escrita, a resposta chega; toque em Ouvir. Depois, celular em modo avião, app continua abrindo. | Prefere falar? Pergunte com a voz. E ouça a resposta. Funciona no celular, e até sem internet. | Falar. Ouvir.<br>Sem internet. | Trilha baixa; trecho curto da voz do app ouvindo a resposta | Gravação real (G2 e G6) | — |
| 14 | 1:21–1:23 | Prepare | Cartão de título do ato 2. | Segundo passo: prepare. | 2. Prepare | Trilha; transição | Animação (texto) | — |
| 15 | 1:23–1:31 | Prepare | Gravação real: checklist "O que levar" e o botão de compartilhar abrindo a folha do sistema (sem mostrar contatos). | O que levar vira uma lista pronta para mandar no WhatsApp. Copiar, imprimir ou compartilhar, do jeito que for mais fácil. | O que levar,<br>pronto para mandar | Trilha | Gravação real (G3) | — |
| 16 | 1:31–1:38 | Prepare | Gravação real: tela "Lista única para o laudo". | E tudo o que o laudo precisa ter fica numa lista só, para resolver numa consulta. | Laudo: uma lista só | Trilha | Gravação real (G3) | — |
| 17 | 1:38–1:40 | Garanta | Cartão de título do ato 3. | Terceiro passo: garanta na rua. | 3. Garanta na rua | Trilha; transição | Animação (texto) | — |
| 18 | 1:40–1:51 | Garanta | Gravação real: "Mostre ao motorista" com letra grande e QR. Depois, mão virando o celular para a câmera (só a mão). | Se o motorista disser que não pode, você vira a tela. Letra grande, a lei, e um código que abre o texto oficial. A segurança vem sempre primeiro. | Vire a tela.<br>A lei + QR do texto oficial | Trilha | Gravação real (G4) + mão de adulto voluntário | — |
| 19 | 1:51–1:58 | Garanta | Gravação real: "Me negaram, e agora?" e o modelo de pedido sendo copiado. | Negaram o seu pedido? O Mapi mostra o caminho para recorrer, e um modelo pronto para você completar. | Negaram?<br>Caminho + modelo pronto | Trilha | Gravação real (G4) | — |
| 20 | 1:58–2:10 | Garanta | Gravação real do Embarque no MODO EXEMPLO: a contagem de minutos e "passam 2 sem acessibilidade antes". Corte para celular no bolso (animação) com ondas de som. | E tem mais uma coisa em teste: o Embarque garantido. Quanto falta para o próximo ônibus acessível chegar ao seu ponto, com aviso falado, para o celular ficar no bolso. | Próximo ônibus acessível<br>Aviso falado | Trilha baixa; o aviso falado do app entra por 2 s | Gravação real em modo exemplo (G5) + animação | EXEMPLO, não é dado real (o tempo todo). Se a H8 funcionar antes de 13/11, regravar com dado real e trocar o selo por "Dados da SPTrans" |
| 21 | 2:10–2:12 | Garanta | Mapi na pose "recusa" (mão aberta). | O Mapi também sabe dizer não. | Também sabe dizer não. | Trilha | Personagem do design-system/ | — |
| 22 | 2:12–2:21 | Garanta | Gravação real: pergunta "Que remédio tomar para dor nas costas?" e a recusa com o encaminhamento. | Pergunta sobre remédio ou processo? Ele recusa com gentileza, e mostra quem pode ajudar. Em emergência, ele diz uma coisa só: ligue 192. | Recusa + onde procurar<br>Emergência: 192 | Trilha | Gravação real (G2) | — |
| 23 | 2:21–2:27 | Garanta | Gravação real: "Conferir se é oficial" com um link falso fictício, resultado "Suspeito". | Chegou um link cobrando um benefício? Ele confere se o endereço é oficial. | Link estranho?<br>Suspeito. | Trilha | Gravação real (G6) | — |
| 24 | 2:27–2:34 | Fecho | Momento dos números: um número por vez, grande, em Space Indigo sobre Seashell. | E a gente testou. Das doze perguntas que ele precisava recusar, recusou as doze. Nota máxima de acessibilidade. | 12 de 12 recusas corretas<br>Acessibilidade: 100 | Trilha sobe; toque a cada número | Animação (texto) + recorte do relatório do Lighthouse | — |
| 25 | 2:34–2:41 | Fecho | Continuação dos números: os resultados do teste com pessoas. | E com [PENDENTE: nº de participantes] pessoas de verdade: [PENDENTE: % de acerto] de acerto, [PENDENTE: comparação de tempo com a busca na web], e nota [PENDENTE: SUS] de facilidade de uso. | [PENDENTE] pessoas<br>[PENDENTE] de acerto<br>[PENDENTE] tempo<br>Facilidade: [PENDENTE] | Trilha | Animação (texto) | — |
| 26 | 2:41–2:48 | Fecho | Animação do mapa colaborativo de calçadas (arquivo do design system). | Isso é só o começo. Amanhã, um mapa das calçadas, feito por quem passa por elas todos os dias. | Mapa das calçadas | Trilha | Animação: design-system/Mapiii Visao de Futuro 16x9.dc.html | VISÃO DE FUTURO (o tempo todo) |
| 27 | 2:48–2:52 | Fecho | Ícones dos ODS 10 e 11 lado a lado. | Menos desigualdade. Uma cidade que funciona para todo mundo. | ODS 10 · ODS 11 [CONFIRMAR na lista oficial da GS] | Trilha | Ícones oficiais dos ODS (ONU) [CONFIRMAR regras de uso] | — |
| 28 | 2:52–2:56 | Fecho | O Mapi na pose "comemorando"; volta a silhueta do ponto, agora com o ônibus de rampa descida. | Você pode ter direito. Agora, você sabe onde ir. | Você pode ter direito.<br>Agora, você sabe onde ir. | Trilha resolve | Animação + personagem | — |
| 29 | 2:56–3:00 | Fecho | Logo final, aviso de protótipo e nomes da dupla. | Mapiii. O mapa dos seus direitos. | Mapiii · o mapa dos seus direitos<br>Protótipo de estudo, não é canal oficial.<br>Thor e Gabriel · FIAP Global Solution 2026 | Trilha fecha; 1 s de silêncio | Logo do design-system/ | — |

## c) Locução corrida

Para ler em voz alta, sem pressa. Ponto final é respiração. Onde estiver **[PENDENTE]**, a frase só é gravada depois que o número existir.

```text
O ônibus chegou. A rampa, não.
Para muita gente que usa cadeira de rodas em São Paulo, essa cena se repete.
E o problema começa antes da rua. Quem cuida de alguém com deficiência quer saber uma coisa simples: o que eu posso pedir? Onde vou? O que levo?
A informação existe. Mas está espalhada, em linguagem difícil, e misturada com golpe.
No Brasil, são [PENDENTE: número do Censo 2022, conferido no IBGE] pessoas com deficiência, segundo o Censo de 2022.
Foi pensando nelas que nasceu o Mapiii. O mapa dos seus direitos.
Este é o Mapi. Ele não inventa nada. Tudo o que mostra tem fonte oficial e a data em que foi conferido.
E ele avisa logo de cara: é um protótipo de estudo, não um canal oficial.
Primeiro passo: descubra.
Você responde poucas perguntas. Sem nome, sem CPF, sem endereço. E pode pular qualquer uma.
Aí o Mapi mostra o que você pode pedir. Ele nunca diz "você tem direito". Ele diz "pode ter direito", e explica o porquê, numa frase.
Embaixo, a fonte. E há quantos dias ela foi conferida.
Prefere falar? Pergunte com a voz. E ouça a resposta. Funciona no celular, e até sem internet.
Segundo passo: prepare.
O que levar vira uma lista pronta para mandar no WhatsApp. Copiar, imprimir ou compartilhar, do jeito que for mais fácil.
E tudo o que o laudo precisa ter fica numa lista só, para resolver numa consulta.
Terceiro passo: garanta na rua.
Se o motorista disser que não pode, você vira a tela. Letra grande, a lei, e um código que abre o texto oficial. A segurança vem sempre primeiro.
Negaram o seu pedido? O Mapi mostra o caminho para recorrer, e um modelo pronto para você completar.
E tem mais uma coisa em teste: o Embarque garantido. Quanto falta para o próximo ônibus acessível chegar ao seu ponto, com aviso falado, para o celular ficar no bolso.
O Mapi também sabe dizer não.
Pergunta sobre remédio ou processo? Ele recusa com gentileza, e mostra quem pode ajudar. Em emergência, ele diz uma coisa só: ligue 192.
Chegou um link cobrando um benefício? Ele confere se o endereço é oficial.
E a gente testou. Das doze perguntas que ele precisava recusar, recusou as doze. Nota máxima de acessibilidade.
E com [PENDENTE: nº de participantes] pessoas de verdade: [PENDENTE: % de acerto] de acerto, [PENDENTE: comparação de tempo com a busca na web], e nota [PENDENTE: SUS] de facilidade de uso.
Isso é só o começo. Amanhã, um mapa das calçadas, feito por quem passa por elas todos os dias.
Menos desigualdade. Uma cidade que funciona para todo mundo.
Você pode ter direito. Agora, você sabe onde ir.
Mapiii. O mapa dos seus direitos.```

- **Palavras:** 435 (cada **[PENDENTE]** contado como uma palavra; com os números ditos por extenso, fica perto de 445).
- **Tempo estimado:** 2:55 a 3:00, em cerca de 145 a 150 palavras por minuto. Limite: 3:10.
- Se passar de 3:10 na gravação, corte nesta ordem: "Copiar, imprimir ou compartilhar, do jeito que for mais fácil." (cena 15), "A segurança vem sempre primeiro." (cena 18) e "Funciona no celular, e até sem internet." (cena 13). **Não corte** a frase do aviso de protótipo (cena 8) nem a do "pode ter direito" (cena 11).

## d) Mapa das perguntas da banca

**[CONFIRMAR]** O pedido trazia "[COLE AQUI AS 5 PERGUNTAS]" sem as perguntas. As 5 abaixo são as perguntas da banca que estão no roteiro do guia v2 ([PENDENCIAS.md](../PENDENCIAS.md), seção 7). Se as do Wagner forem outras, este mapa muda.

| Pergunta | Onde é respondida |
|---|---|
| 1. Quem é a pessoa? | Cenas 1 a 3 (quem usa cadeira de rodas e quem cuida). Uma frase real das entrevistas entra aqui se houver autorização: **[PENDENTE: depoimento da folha de teste, seção 5]**. |
| 2. Que problema real? | Cenas 1, 4 e 5 (embarque negado; informação espalhada, difícil e com golpe; número do Censo **[CONFIRMAR NA FONTE]**). |
| 3. Como funciona? | Cenas 9 a 23 (Descubra → Prepare → Garanta na rua, com gravação real). |
| 4. Que evidências? | Cenas 24 e 25 (números) e, de forma indireta, as cenas 7, 8 e 22 (fonte, aviso e recusa aparecendo na tela). |
| 5. Impacto e ODS | Cenas 26 a 28 (visão de futuro, ODS 10 e 11 **[CONFIRMAR]**, fecho). |

## e) Momento dos números

Cenas 24 e 25 (2:34 a 2:48). Só entra o que estiver medido.

| Número | Valor | De onde vem | Situação |
|---|---|---|---|
| Recusas corretas | **12 de 12** | `eval/resultados.csv`, linhas 2 a 13 (grupo `ajuste`, coluna `acertou` = `sim`) | Existe. Rodar `npm run eval` de novo depois das fichas e conferir se continua 12 de 12. |
| Acessibilidade | **100** | [PENDENCIAS.md](../PENDENCIAS.md), linha 24 (Lighthouse 100/100/100/100, medido em 06/11) | Existe, mas foi medido com a base vazia. **Rodar `npm run build` e `npm run lighthouse` de novo com as fichas** e usar o print novo. |
| Sem problema grave de acessibilidade (axe, 17 telas) | — | [PENDENCIAS.md](../PENDENCIAS.md), linha 23 | Existe. Opcional na tela, não está na locução. |
| Pessoas no teste | **[PENDENTE]** | Teste com pessoas (H9, 15 e 16/11), [folha de teste](../docs/folha-de-teste.md) | Falta. |
| Acerto das orientações | **[PENDENTE]** | `npm run eval` com o grupo `teste` (H5) e seção 1 da folha de teste | Falta. Hoje o gabarito só tem os 12 casos de recusa. |
| Tempo × busca na web | **[PENDENTE]** | Seção 2 da folha de teste e CSV de `avaliacao.html` | Falta. Não afirmar "mais rápido" antes do número. |
| Facilidade de uso (SUS) | **[PENDENTE]** | Seção 4 da folha de teste | Falta. |
| Pessoas com deficiência no Brasil | **[PENDENTE]** | IBGE, Censo 2022 | Falta. Nenhum número do Censo está no repositório. **[CONFIRMAR NA FONTE]** e anotar link e data. |

Se algum número do teste vier ruim, ele entra assim mesmo (o guia v2 pede "números do teste, inclusive os ruins"). A frase da cena 25 se adapta ao número, sem esconder.
