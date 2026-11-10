# Vídeo pitch do Mapiii · documento único

> **Este é o único documento do vídeo pitch.** Toda mudança de roteiro, cena, som, montagem ou pedido ao Claude Design é feita **aqui**. Os arquivos antigos (roteiro v1 e v2, edição, gravações, checklist, audiodescrição, legendas da v1, referência do campeão, guia de montagem e o LEIA-ME do Claude Design) foram juntados neste em 07/11/2026 e apagados; continuam no histórico do git.
>
> Fora daqui: o vídeo **técnico** das disciplinas, que é outro vídeo, em [roteiro-tecnico.md](roteiro-tecnico.md).

**Entrega:** 19/11/2026 (deixar pronto até 18/11 à noite), no Portal do Aluno, pasta "Entrega do vídeo pitch". A Global Solution é avaliada **só pelo vídeo**: ele não precisa mostrar tudo o que o app faz, só contar bem uma história e provar que funciona.

## Sumário

1. [Decisões](#1-decisões)
2. [Regras que o vídeo não pode quebrar](#2-regras-que-o-vídeo-não-pode-quebrar)
3. [Estilo](#3-estilo)
4. [Roteiro: as 18 cenas](#4-roteiro-as-18-cenas)
5. [Locução corrida](#5-locução-corrida)
6. [O que já existe e o que falta](#6-o-que-já-existe-e-o-que-falta)
7. [Gravações](#7-gravações)
8. [Som](#8-som)
9. [Montagem no Remotion](#9-montagem-no-remotion)
10. [Revisão e exportação](#10-revisão-e-exportação)
11. [Legendas e audiodescrição](#11-legendas-e-audiodescrição)
12. [Claude Design: pedidos](#12-claude-design-pedidos)
13. [Cronograma](#13-cronograma)
14. [De onde vieram as ideias](#14-de-onde-vieram-as-ideias)

---

## 1. Decisões

| Assunto | Decisão | Quem, quando |
|---|---|---|
| Roteiro | O enxuto (antigo v2): 18 cenas, cerca de 2:12, uma história e poucos momentos do app. O roteiro de 3:00 do Gabriel (v1) fica no histórico do git | Thor, 07/11. Gabriel confirmou em 10/11 |
| Formato | YouTube 16:9, **1920 × 1080, 30 qps** | Thor, 07/11 |
| Voz | A voz da dupla, **sem clone** | Thor, 07/11 |
| Pessoas na câmera | Thor e Gabriel no começo, na virada e no fim (cenas 2, 3, 5, 14 e 17) | Thor, 07/11 |
| Teste com pessoas | **Não entra no vídeo (B).** A cena 12 fica com 12 de 12 recusas e acessibilidade 100. O formulário (H9) serve para o relatório e a tela "Sobre o projeto" | Gabriel, 10/11 |
| App no vídeo | Tópicos animados (celular estilizado com a tela do app) e só dois cortes curtos do app real (cenas 7 e 9) | Thor, 07/11 |
| Embarque | História animada (cena 10), sem gravação de tela, por isso sem selo EXEMPLO. A locução diz "pode avisar" | Thor, 07/11 |
| Mapi | **Mapi 3D só no vídeo.** O app continua com o Mapi plano. Movimento: entra subindo suave, flutua de leve, mexendo a imagem inteira. **Sem quique e sem deformar o corpo** | Claude Code, 07/11 (pedido do Thor) |
| Fecho | Volta ao ponto de ônibus da cena 1, agora com a **rampa descida** (cena 18, quadro 14 novo) | Claude Code, 07/11 (pedido do Thor) |
| Fica de fora | Ícones de microfone e alto-falante (V4): não precisa agora, talvez nem depois. Mapi no tema escuro (V5): só depois do vídeo. "Virada" contando que o vídeo foi feito com IA: não, para não confundir com a IA do app, que está desligada | Thor, 07/11 |

## 2. Regras que o vídeo não pode quebrar

- Nunca "você tem direito". Só "pode ter direito". A única vez em que "você tem direito" aparece é **riscado**, na cena 8.
- Nenhum número, depoimento ou resultado inventado. O do Censo só entra conferido no IBGE, com link e data.
- Telas do app desenhadas nos quadros: **sem lei, valor, prazo, telefone, e-mail ou link**. Linhas cinza no lugar.
- Escala (cena 15): selo **VISÃO DE FUTURO** o tempo todo. A locução diz "pode funcionar", nunca "funciona". O motor não depende da cidade, mas a base de fichas e o conector de ônibus dependem: hoje só há conteúdo de São Paulo.
- O aviso "Protótipo de estudo, não é canal oficial." aparece no fecho.
- Nenhuma imagem da base fictícia do `npm run dev`. Gravações do app só com o build e depois das fichas reais (H1).
- Nenhum rosto de terceiros, criança, nome, CPF, telefone, contato ou conversa na tela. Só Thor e Gabriel aparecem.
- Emergência de saúde: só "Em emergência, ligue 192."

## 3. Estilo

Motion graphics de lançamento de produto, com a identidade do design system Mapiii v2.0.

**Cores e tipos**
- Fundo **Seashell `#F2E9E4`**, texto **Space Indigo `#22223B`**, texto secundário **Dusty Grape `#4A4E69`**, destaque **Almond Silk `#C9ADA7`** (sempre com texto indigo) e o rosa do sublinhado dos quadros (`#CF7A93`). Lilac Ash `#9A8C98` só decora, nunca vai em texto.
- **Fundos sólidos:** sem degradê, sem desfoque, sem transparência, sem grão. (Os guias de referência usam degradê e vidro; aqui não, porque o design system proíbe.)
- **Nunito** (`design-system/fonts/`, licença OFL): 900 nos títulos, 800 nos rótulos, 400 no corpo. **IBM Plex Mono** (licença OFL) só nas datas e números pequenos, como no quadro 8.
- Texto principal com 48 px ou mais em 1080p; fonte e rodapé com 32 px ou mais. Até 6 palavras por linha.
- **Uma palavra em destaque por frase**, com o sublinhado rosa dos quadros.
- Sem emoji, sem foto de banco de imagens. Ícones só de `design-system/assets/icons/`. Números no formato brasileiro (12 de 12; 100; 4,5:1).
- Contraste de pelo menos 4,5:1 em todo texto. Nada piscando mais de 3 vezes por segundo.

**Ritmo**
- **Cada animação presa a uma palavra da locução.** É o que dá ritmo ao vídeo.
- Uma ideia por cena, poucas palavras na tela e o número bem grande. O texto na tela resume, não copia a locução.
- Um corte a cada 3 a 5 s. Cena com mais de 5 s ganha um corte interno (zoom num detalhe ou um texto novo).
- **Gancho em até 10 s**: começa já com o ônibus chegando. Sem logo, vinheta ou tela preta no começo.

**Movimento**
- Troca de cena: **whoosh com borrão horizontal curto** (120 a 200 ms). Sem vazamento de luz, sem quique, sem zoom elástico.
- Número grande: rola com borrão vertical e para no valor, na palavra certa.
- Listas e passos: descem **linha por linha**.
- Mapi 3D: entra subindo suave com uma sombra em elipse sólida Almond Silk embaixo e depois flutua de leve (poucos pixels, ciclo lento). Na pose `recusa`, um balanço curto de poucos graus. Nunca deformar, esticar ou recolorir.
- Zoom em gravação de tela: suave e lento, no máximo 1,5×.
- Nada aleatório: a mesma montagem gera sempre o mesmo vídeo.

**Regras de tempo (medidas em animações profissionais; ver seção 14)**
- **Entrar desacelerando, sair acelerando.** A maior parte do caminho acontece nos primeiros 4 a 8 quadros e o resto é uma chegada longa e suave. Sair é o contrário: começa devagar e some rápido. Movimento típico: **10 quadros (0,33 s)** a 30 qps.
- **Nada cresce do zero.** O que entra vem de fora do quadro, ou chega um pouco maior e assenta no tamanho certo. Nunca de um ponto minúsculo até o tamanho final.
- **Entrar se movendo, não por fade.** Fade só para um objeto isolado (por exemplo, o selo de fonte), nunca para trocar de cena.
- **Cortar com movimento.** O corte acontece no meio de um movimento, e a cena seguinte já começa se mexendo. Nada de cena parada esperando o corte.
- **Nenhum trecho morto.** Em cena de animação, sempre há algo vivo (o Mapi flutuando, o relógio, uma luz). No máximo 3 quadros seguidos totalmente parados, a não ser numa pausa de propósito antes de algo importante (0,6 a 1,5 s), como antes do número da cena 4.
- **Um foco por quadro.** Uma coisa principal por vez; o resto menor e mais calmo.
- **Palavras entram no ritmo da fala**, de 4 a 6 quadros entre uma e outra nos títulos. Letra por letra só dentro da tela do app (campo de texto), nunca nos títulos.
- **No máximo uma mola visível no vídeo inteiro**, e mesmo assim pequena (passar só um pouco do lugar e voltar).
- **O final fica parado no máximo 1,4 s** e termina menor e mais calmo do que começou. O 1 s de silêncio da cena 18 cabe nisso.
- **Ondas de energia (obrigatório).** O vídeo alterna três intensidades, nunca a mesma por muito tempo: **explosiva** (gancho, cenas 1 a 4; logo, cena 6), **fluida** (o app, cenas 7 a 11; escala, cena 15) e **calma, para ler** (número da cena 4 depois que para; cena 12; slogan da cena 17; fecho da cena 18).
- **Câmera que reage ao impacto (obrigatório).** Depois de um impacto, a cena inteira faz um balanço curto na direção do impacto e assenta: 4 a 8 px, de 6 a 10 quadros, sem tremer. Usar só nos impactos de verdade: o ônibus freando (cena 1), o número parando (cenas 4 e 12), o círculo cobrindo a tela (cena 6), o celular terminando o giro (cena 9) e a rampa tocando a calçada (cena 18). Em nenhum outro lugar.
- **Linha de rota (obrigatório).** Um fio condutor no estilo de mapa liga as cenas animadas: uma linha tracejada Dusty Grape `#4A4E69` (traço de 6 px, tracejado de 18/14 px), que se desenha de uma cena para a outra e puxa a cena seguinte, como um caminho num mapa. Ela nasce do pino do logo (cena 6), passa pelo celular da triagem (7), pelo selo de fonte (8), pelo celular virado (9), pelo bolso com o aviso (10), pelos números (12) e pelos tópicos (13), e termina no pino do Mapi em São Paulo, no mapa-múndi (cena 15), que acende quando ela chega. Regras: nunca fica parada no mesmo lugar por mais de uma cena, nunca passa por cima de texto ou do Mapi, some nas cenas de câmera e volta depois, e é sempre fina e discreta (o foco é o conteúdo, não a linha).
- **O que estas regras não mudam:** o aviso de protótipo, o selo VISÃO DE FUTURO, o relógio, os números com fonte e o fundo sólido continuam obrigatórios, mesmo que guias de motion graphics recomendem tirar textos dos cantos ou usar fundos com textura.

## 4. Roteiro: as 18 cenas

Tempos aproximados (cerca de 255 palavras, 135 por minuto, com pausas). O editor ajusta pelo áudio gravado. **Quem:** T = Thor, G = Gabriel, off = locução sem rosto. **Quadro:** imagem de referência em `video/quadros/`.

| # | Tempo | Parte | Quadro | Imagem e animação | Locução (texto exato) | Quem | Texto na tela | Som |
|---|---|---|---|---|---|---|---|---|
| 1 | 0:00–0:07 | Gancho | 01 | Ponto de ônibus de lado, pessoa em cadeira de rodas em silhueta. Um chip de relógio "7:40" entra no canto em "Sete e quarenta". O ônibus entra, para, a porta abre, **a rampa não desce**, o ônibus vai embora | Sete e quarenta. O ônibus chegou. A rampa, não. | off | O ônibus chegou.<br>**A rampa, não.** | Rua ao fundo; freio e porta; silêncio quando ele sai |
| 2 | 0:07–0:19 | Gancho | — | Thor na câmera. O chip do relógio continua no canto e avança um minuto | Para quem usa cadeira de rodas, essa cena é real. E quem cuida de alguém conhece a pergunta que vem depois: o que eu posso pedir? Onde? O que eu levo? | T | O que eu posso pedir?<br>Onde? O que eu levo? | Voz limpa |
| 3 | 0:19–0:25 | Problema | 02 | Gabriel na câmera, depois três cartões entrando um por palavra. Em cada cartão, o seu objeto 3D (`video/objetos-3d/`): papéis voando, documento enorme, celular com anzol. No "golpe", um risco corta uma linha cinza de "site falso" | A resposta existe. Só que está espalhada, em linguagem difícil, e no meio de golpe. | G → cartões | Espalhada.<br>Difícil.<br>**Com golpe.** | Um toque seco por cartão; papel rasgando no "golpe" |
| 4 | 0:25–0:31 | Problema | 03 | Número grande rolando com borrão vertical até o valor; fonte embaixo. O chip do relógio sai | No Brasil, são [PENDENTE: número do Censo 2022, conferido no IBGE] pessoas com deficiência, segundo o Censo de 2022. | off | [PENDENTE]<br>Fonte: IBGE, Censo 2022 | Contador rápido que para no número |
| 5 | 0:31–0:36 | Virada | — | Thor na câmera, mais perto | E se o caminho coubesse no bolso, com a fonte junto? | T | — | Pausa curta antes; whoosh na saída |
| 6 | 0:36–0:43 | Solução | 04 | Círculo Space Indigo cresce do centro e cobre a tela; abre revelando o logo. O Mapi 3D (`bom`) sobe em "Mapi" e flutua. Depois, quatro chips pequenos entram nos cantos, um por vez, só com frases do app: "Pode ter direito", "Fonte oficial", "Sem CPF", "Emergência: 192" | Esse é o Mapiii. O mapa dos seus direitos. E esse é o Mapi. | off | **Mapiii**<br>o mapa dos seus direitos | Whoosh no círculo; pop no Mapi; a trilha entra baixa |
| 7 | 0:43–0:51 | Descubra | 05 | Celular entra inclinado com a triagem; um botão é tocado; o cartão "Pode ter direito" sai da tela e os passos da Rota descem linha por linha (linhas cinza). Selos "Sem nome" e "Sem CPF" nas palavras. Mapi 3D `procurando`. No fim, **corte de 2 s da triagem real** | Você responde poucas perguntas, sem nome e sem CPF. Ele mostra o que você pode pedir, e por quê. | off | Sem nome. Sem CPF. | Toques de interface baixos |
| 8 | 0:51–1:00 | Descubra | 06 | "você tem direito" aparece e é riscado em "Nunca diz"; "pode ter direito" entra com o sublinhado se desenhando; o selo de fonte aumenta com um ding. Mapi 3D `verificado` | Nunca diz "você tem direito". Diz "pode ter direito". E mostra a fonte oficial, com a data em que foi conferida. | off | ~~você tem direito~~<br>**pode ter direito**<br>Fonte + data | Risco no "você tem direito"; ding no selo |
| 9 | 1:00–1:10 | Garanta | 07 | A mão vira o celular para fora em "vira a tela" (com o celular 3D do pedido 6, o giro é feito trocando costas, perfil e frente); aparece "Mostre ao motorista" e o QR se desenha. Depois, **corte de 2 s da mão real** virando o celular com o app | Na rua, se o motorista disser que não pode, você vira a tela: letra grande, a lei, e um código que abre o texto oficial. | off | Vire a tela. | Whoosh curto no giro |
| 10 | 1:10–1:19 | Garanta | 08 | Pessoa em cadeira de rodas no ponto, celular no bolso; ondas de som saem do bolso; a notificação "Ônibus acessível chegando · 2 min" **desce do topo** como no celular, em "avisar". Mapi 3D `ouvindo` | E com o celular no bolso, ele pode avisar em voz alta quando o próximo ônibus acessível está chegando. | off | O ônibus avisa você. | Som de notificação; a voz real do app por 2 s |
| 11 | 1:19–1:28 | Confiança | 09 | Mapi 3D `recusa` sobe e faz um balanço curto em "não". A pílula "Emergência: 192" entra em "192" | Ele também sabe dizer não. Remédio ou processo? Mostra quem pode ajudar. Emergência? Ligue 192. | off | Sabe dizer não.<br>**Emergência: 192** | Pop no Mapi |
| 12 | 1:28–1:37 | Prova | 10 | "12 de 12" rola e para; depois "100". Recorte do relatório do Lighthouse | E a gente mediu. Das doze perguntas que ele precisava recusar, recusou as doze. E nota máxima de acessibilidade. | off | **12 de 12** recusas corretas<br>Acessibilidade **100** | Tique a cada número |
| 13 | 1:37–1:42 | Prova | 11 | Os 6 tópicos entram um por vez, cada um com o seu ícone | E ainda: funciona sem internet, com um toque, e lê a resposta em voz alta. | off | Sem internet · Um toque · A, A+, A++ · Ouve em voz alta · Confere se é oficial · Sem login, sem cadastro | Tique a cada tópico |
| 14 | 1:42–1:47 | Escala | — | Gabriel na câmera | Começamos por São Paulo. A SPTrans é só o primeiro exemplo. | G | — | — |
| 15 | 1:47–1:57 | Escala | 12 | Mapa-múndi de uso livre (no lugar do desenhado à mão do quadro). O pino do Mapi pulsa em São Paulo; pinos acendem em "cidade", "estado" e "país" | O Mapiii é feito de fichas com fonte oficial. Troque a base, e ele pode funcionar em outra cidade. Em outro estado. Em outro país. | off | Troque a base.<br>Outra cidade. Outro estado. **Outro país.** | Um pop por pino, subindo |
| 16 | 1:57–2:01 | Impacto | 15 (novo) | Ícones oficiais dos ODS 10 e 11 entrando lado a lado | Menos desigualdade. Cidades que funcionam para todo mundo. | off | ODS 10 · ODS 11 [CONFIRMAR na lista oficial da GS] | — |
| 17 | 2:01–2:08 | Fecho | 13 | Thor e Gabriel juntos na câmera; o Mapi 3D `comemorando` sobe no canto. Na frase final, corta para o quadro 13 com o slogan | (T) Somos o Thor (G) e o Gabriel. (juntos) Você pode ter direito. Agora, você sabe onde ir. | T + G | Você pode ter direito.<br>**Agora, você sabe onde ir.** | Pop no Mapi |
| 18 | 2:08–2:12 | Fecho | 14 (novo) | O mesmo ponto de ônibus da cena 1. O ônibus para, **a rampa desce** e a pessoa em cadeira de rodas embarca. Logo grande, aviso de protótipo, FIAP Global Solution 2026 | Mapiii. O mapa dos seus direitos. | off | Mapiii · o mapa dos seus direitos<br>Protótipo de estudo, não é canal oficial. | Rampa descendo; 1 s de silêncio no fim |

## 5. Locução corrida

Uma frase por vez, com 1 s de pausa entre elas, num arquivo só (`narracao.wav`) para as falas em off. Gravar cada frase duas vezes. Números por extenso e sem reticências ("...").

```text
[off] Sete e quarenta. O ônibus chegou. A rampa, não.
[Thor] Para quem usa cadeira de rodas, essa cena é real. E quem cuida de alguém conhece a pergunta que vem depois: o que eu posso pedir? Onde? O que eu levo?
[Gabriel] A resposta existe. Só que está espalhada, em linguagem difícil, e no meio de golpe.
[off] No Brasil, são [PENDENTE, por extenso] pessoas com deficiência, segundo o Censo de dois mil e vinte e dois.
[Thor] E se o caminho coubesse no bolso, com a fonte junto?
[off] Esse é o Mapiii. O mapa dos seus direitos. E esse é o Mapi.
[off] Você responde poucas perguntas, sem nome e sem CPF. Ele mostra o que você pode pedir, e por quê.
[off] Nunca diz "você tem direito". Diz "pode ter direito". E mostra a fonte oficial, com a data em que foi conferida.
[off] Na rua, se o motorista disser que não pode, você vira a tela: letra grande, a lei, e um código que abre o texto oficial.
[off] E com o celular no bolso, ele pode avisar em voz alta quando o próximo ônibus acessível está chegando.
[off] Ele também sabe dizer não. Remédio ou processo? Mostra quem pode ajudar. Emergência? Ligue cento e noventa e dois.
[off] E a gente mediu. Das doze perguntas que ele precisava recusar, recusou as doze. E nota máxima de acessibilidade.
[off] E ainda: funciona sem internet, com um toque, e lê a resposta em voz alta.
[Gabriel] Começamos por São Paulo. A SPTrans é só o primeiro exemplo.
[off] O Mapiii é feito de fichas com fonte oficial. Troque a base, e ele pode funcionar em outra cidade. Em outro estado. Em outro país.
[off] Menos desigualdade. Cidades que funcionam para todo mundo.
[Thor] Somos o Thor
[Gabriel] e o Gabriel.
[juntos] Você pode ter direito. Agora, você sabe onde ir.
[off] Mapiii. O mapa dos seus direitos.
```

O "off" pode ser de um só ou dividido (por exemplo, Thor da cena 6 à 11 e Gabriel da 12 à 18). Como gravar a voz: lugar silencioso (um closet com roupas funciona bem), celular a 20 cm da boca, sem música.

## 6. O que já existe e o que falta

Tudo o que vem do Claude Design também fica no artefato do design system: https://claude.ai/artifact/6Vkhuq9j7zNxiXF3ccbmfs (ver seção 12).

| Item | Arquivo | Situação | Quem |
|---|---|---|---|
| Mapi 3D, 7 poses (bom, atencao, procurando, verificado, ouvindo, recusa, comemorando) | `video/mapi-3d/` | **Pronto** | — |
| Quadros 01 a 13 | `video/quadros/` | **Prontos** (04 e 13 corrigidos em 07/11) | — |
| Capa do YouTube | `video/capa.png` | **Pronta** | — |
| Quadro 14 (fecho com a rampa descida) e peças para animar | `video/quadros/14.png` e `video/quadros/14-pecas/` (`onibus`, `rampa`, `pessoa`) | **Pronto** (07/11). A rampa é fina, mas no vídeo ela aparece descendo, e o movimento chama a atenção: a dupla decidiu manter | — |
| Objetos 3D da cena 3 (espalhada, dificil, golpe) | `video/objetos-3d/` (e `comparacao-com-mapi.png`) | **Prontos** (07/11) | — |
| Celular 3D para a cena 9 (frente, perfil e costas) | `video/objetos-3d/celular-frente.png`, `celular-perfil.png`, `celular-costas.png` (e `comparacao-celular.png`) | **Pronto** (08/11). Tela na vista de frente: x 676, y 296, 648 × 1408 px (medido pelo Claude Code; cantos arredondados) | — |
| Quadro 15, ODS (cena 16) | `video/quadros/15.png` | **Pronto** (08/11). Lugares dos ícones: ODS 10 em x 400, y 271 e ODS 11 em x 1100, y 271, cada um 420 × 420 px (medido pelo Claude Code). Faltam os ícones oficiais | — |
| Moldura das cenas de câmera e nomes | `video/quadros/camera-moldura.png` (verde em x 52, y 52, 1816 × 976 px, cantos de cerca de 58 px), `camera-nomes.png` e `camera-nomes/` (`thor.png`, `gabriel.png`) | **Pronto** (08/11) | — |
| Estilo da legenda e chip do relógio | `video/quadros/legenda.png`, `legenda-sobre-quadro-01.png` e `video/quadros/relogio/` (`0740.png` a `0743.png`) | **Prontos** (08/11). Com eles, todos os pedidos do Claude Design estão feitos | — |
| Quadros em vetor (1 a 14), de onde o Claude Code tira as camadas para animar | `design-system/Mapiii Pitch Quadros 16x9.html` | **Atualizado** (08/11) | — |
| Número do Censo 2022, com link e data | nesta página (cenas 4 e locução) | Falta | Dupla, até 10/11 |
| Ícones dos ODS 10 e 11, da página oficial da ONU, e confirmação na lista da GS | `video/ods/` | **Ícones salvos (10/11)**, de https://brasil.un.org/pt-br/sdgs. Falta confirmar na lista da GS | Dupla |
| Mapa-múndi de uso livre (Natural Earth, domínio público) | `video/mapa/mundo.svg` | **Pronto (10/11).** Pino de São Paulo em x 711, y 717 (ver `video/mapa/README.md`) | — |
| IBM Plex Mono (OFL) | `design-system/fonts/` | Falta | Claude Code |
| Efeitos sonoros e trilha, com créditos | `video/sons/` e `video/sons/CREDITOS.txt` | Falta | Dupla, até 12/11 |
| Narração em off | `video/remotion/public/narracao.wav` | Falta (depois do Censo) | Dupla, 17/11 |
| Cenas na câmera (2, 3, 5, 14 e 17) | `video/remotion/public/camera/` | Falta | Dupla, até 13/11 |
| Cortes de 2 s do app (cenas 7 e 9) e a voz do aviso (cena 10) | `video/remotion/public/app/` | Falta (depois da H1) | Claude Code + dupla |
| Relatório do Lighthouse com as fichas (cena 12) | `video/remotion/public/app/lighthouse.png` | Falta (depois da H1) | Claude Code |
| Projeto Remotion, legendas e audiodescrição | `video/remotion/` | Falta | Claude Code |

Vídeos grandes (câmera e gravações de tela) **não vão para o git**: ficam numa pasta compartilhada da dupla e são copiados para `video/remotion/public/` só na hora de montar.

## 7. Gravações

### Na câmera (cenas 2, 3, 5, 14 e 17)

- Celular **deitado** (16:9), na altura dos olhos, em tripé ou apoiado. Câmera traseira, 1080p ou 4K, 30 qps.
- **De dia, de frente para uma janela.** O vídeo campeão anterior gravou à noite e ficou escuro e granulado.
- Roupa lisa, sem estampa, de preferência nas cores da paleta (indigo, rosa, creme). Evitem os dois de preto.
- Fundo limpo e diferente em cada cena.
- O áudio sai de um segundo celular a um palmo da boca, gravando junto. Bata uma palma no começo para sincronizar.

### Do app (depois das fichas reais)

| Cena | O que gravar | Como |
|---|---|---|
| 7 | 2 s: triagem chegando no "Pode ter direito" | `#/triagem` até a Rota, respondendo como cuidador de alguém em cadeira de rodas que usa ônibus. Atenção: o app não faz a pergunta "Para quem é a orientação?" do quadro 5; essa escolha é a da tela inicial ("Cuido de alguém"). Começar o corte por ela para bater com o quadro |
| 9 | 2 s: mão virando o celular com o Mostre ao motorista | No celular de verdade, só a mão, na rua ou perto de uma porta |
| 10 | Só o áudio: a voz do app falando o aviso (2 s) | Embarque no modo exemplo, gravando só o som |
| 12 | Print do Lighthouse | `npm run lighthouse` |

Antes de gravar o app:
1. **Build, nunca `npm run dev`** (o dev mostra a base fictícia): `npm run build` e depois `npm run preview`. Para a voz do Embarque, um build com `VITE_EMBARQUE_ATIVO=true` só para isso.
2. Tema claro e texto em **A+**. Celular sem notificações (modo não perturbe).
3. Começar do zero: apagar os dados do site (Application → Storage → "Clear site data").
4. Nada pessoal em nenhum campo. O aviso de protótipo aparece no topo.
5. Tocar devagar, parar 2 s em cada tela. Gravar duas vezes.

O Claude Code também pode gravar as telas no computador com o Playwright, na proporção de um celular, para ficarem nítidas.

## 8. Som

- Até a cena 5: **só voz e efeitos**. Da cena 6 em diante, uma trilha bem baixa.
- Efeitos: toque seco, whoosh, pop, tique, ding, notificação, papel rasgando, freio e porta de ônibus, rampa descendo.
- **Onde buscar:** efeitos no Openverse (licença CC0 de preferência, ou CC BY com crédito). Trilha no Openverse (CC0) ou na Biblioteca de Áudio do YouTube com o filtro "não exige atribuição". Anotar faixa, autor, link e licença em `video/sons/CREDITOS.txt`.
- **Hierarquia (obrigatório):** os sons importantes se destacam porque os outros são discretos. Fortes só no ônibus (cena 1), no círculo do logo (6), no giro do celular (9), nos números (12) e na rampa (18). O resto (toques, tiques, pops) fica baixo.
- **Níveis (obrigatório):** a música fica pelo menos **12 dB abaixo da voz** quando há fala, abaixando sozinha. Mistura final em **−14 LUFS** integrado e pico real de no máximo **−1 dBTP** (padrão do YouTube). Pode subir um pouco só nas cenas 6, 12 e 17.
- **Conferir (obrigatório):** ouvir no alto-falante do celular e em mono. A voz tem que ser entendida nos dois.
- Terminar com 1 s de silêncio.

## 9. Montagem no Remotion

O método (dos guias do Levi Lab, ver seção 14): gravar a narração, transcrever com o tempo de cada palavra e pedir ao Claude Code para montar o vídeo inteiro em código no Remotion, com cada animação presa a uma palavra. Depois revisar no Remotion Studio e só então renderizar. **Contem com 2 a 4 pedidos de ajuste**: a primeira versão sai boa, mas não perfeita.

Quando os itens da seção 6 estiverem salvos, abram o Claude Code na pasta do repositório e mandem:

```text
Monte o vídeo pitch do Mapiii no Remotion, seguindo video/README.md.

IMPORTANTE: se ainda houver [PENDENTE] ou [CONFIRMAR] no README, ou se faltar algum arquivo da seção 6, PARE e me diga o que falta antes de começar. Não invente número, lei, valor, prazo, telefone ou link.

VOZ E RITMO
- Transcreva video/remotion/public/narracao.wav com o tempo de cada palavra (faster-whisper) e salve a transcrição em JSON.
- Uma cena por linha da tabela da seção 4. Prenda cada animação na palavra indicada.
- Troca de cena com whoosh e borrão horizontal curto (120 a 200 ms).

VISUAL
- Projeto em video/remotion/, composição 1920x1080, 30 fps.
- Siga a seção 3 (estilo): só os tokens, as fontes e os ícones de design-system/; fundos sólidos; uma palavra em destaque por frase.
- Os quadros de video/quadros/ são o modelo de cada cena animada.
- Mapi 3D de video/mapi-3d/: sobe suave, flutua de leve, sombra em elipse sólida embaixo. Sem quique e sem deformar.
- Câmera e app de video/remotion/public/ entram como vídeo, nas cenas indicadas.
- Selo VISÃO DE FUTURO o tempo todo na cena 15. Aviso de protótipo no fecho.
- Faça as ondas de energia, a câmera que reage ao impacto e a linha de rota exatamente como na seção 3.
- Legenda completa queimada no vídeo, gerada da mesma transcrição, e também um .srt.

SOM
- Narração, efeitos de video/sons/ e a trilha baixa só a partir da cena 6, como na seção 8.

REGRAS
- Tudo determinístico: nada de Math.random.
- Arredonde os valores de transform para 2 casas decimais.
- Antes do render, tire um quadro de cada cena, olhe e corrija o que estiver cortado, sobreposto ou com contraste abaixo de 4,5:1.
- Siga as "Regras de tempo" da seção 3. Confira com um script: nenhum trecho de animação com mais de 3 quadros seguidos parados (fora as pausas de propósito) e o final parado por no máximo 1,4 s. Diga os números encontrados.
- Mixe como na seção 8: música 12 dB abaixo da voz, −14 LUFS integrado, pico de no máximo −1 dBTP. Meça e diga os números.
- Revise cada cena como na seção 10 (notas de 1 a 10), com os defeitos encontrados, antes de dizer que terminou.
- Render final em H.264 (CRF 12, 30 fps), áudio AAC 48 kHz, nome mapiii-pitch-gs2026.mp4. Diga onde ficou o arquivo.
```

## 10. Revisão e exportação

**Antes do render final**
1. Peçam ao Claude Code para abrir o **Remotion Studio** e assistam inteiro, com som e sem som.
2. Peçam os ajustes por escrito, um de cada vez: "a cena 4 está rápida", "o Mapi da cena 8 está em cima do texto".
3. Confiram que nenhum texto ficou cortado ou em cima do Mapi.
4. **Notas por cena (obrigatório).** Cada cena recebe uma nota de 1 a 10 em quatro pontos: **composição** (o olho sabe para onde ir?), **movimento** (tem intenção e peso?), **clareza** (a ideia é entendida num celular?) e **satisfação** (o movimento e o som dão gosto de ver?). Cena com nota abaixo de 9 em qualquer ponto é refeita. Anotar o defeito visto e o que foi corrigido; nota sem olhar o vídeo não vale.
5. **Conferir os quadros em volta de cada impacto** (meio segundo antes e depois): é onde aparecem objetos atravessando, cortes errados e textos tremendo.
6. **O teste final (obrigatório)**, com o vídeo no celular:
   - Os primeiros 0,5 s prendem a atenção?
   - Cada cena é entendida numa tela pequena, com e sem som?
   - Dá para reconhecer o Mapiii (o Mapi, as cores, a linha de rota) antes de ler o nome?
   - O final deixa a marca na memória?
   Se alguma resposta for "não", corrigir antes de seguir.
7. Só então peçam o render final.

**Checklist do arquivo final**
- [ ] 1920 × 1080, 30 qps, H.264 (MP4), áudio AAC 48 kHz e 192 kbps. Nome `mapiii-pitch-gs2026.mp4`.
- [ ] Duração de cerca de 2:12 e **no máximo 3:00**.
- [ ] Legendas queimadas e o `.srt` separado, com o mesmo nome do vídeo.
- [ ] Nenhum **[PENDENTE]** ou **[CONFIRMAR]** na tela.
- [ ] "você tem direito" só aparece riscado (cena 8).
- [ ] Selo VISÃO DE FUTURO em toda a cena 15. Aviso de protótipo no fecho.
- [ ] Nenhum dado pessoal, contato ou conversa na tela.
- [ ] Final parado por no máximo 1,4 s; nenhum trecho de animação parado sem motivo.
- [ ] Assistido inteiro por quem **não** editou, com som e sem som (só pelas legendas).
- [ ] Créditos dos sons conferidos em `video/sons/CREDITOS.txt`.
- [ ] Mistura em −14 LUFS, pico de no máximo −1 dBTP, música 12 dB abaixo da voz; voz entendida no alto-falante do celular e em mono.
- [ ] Todas as cenas com nota 9 ou mais nos quatro pontos, e o teste final respondido com "sim".

## 11. Legendas e audiodescrição

**Legendas:** geradas da transcrição da narração final, com os tempos reais. Queimadas no vídeo e enviadas também como `.srt` (o YouTube aceita).

**Audiodescrição:** descreve só o que a locução não diz. Dá para entregar de dois jeitos: o texto abaixo na descrição do vídeo, ou um segundo arquivo "versão com audiodescrição" com as descrições lidas nas pausas (não é o pitch oficial).

| Cena | Descrição |
|---|---|
| 1 | Desenho de um ponto de ônibus. Uma pessoa em cadeira de rodas espera. São sete e quarenta. O ônibus para, abre a porta, a rampa não desce, e ele vai embora. |
| 2 | Thor fala para a câmera. |
| 3 | Gabriel fala para a câmera. Depois, três cartões: espalhada, difícil, com golpe. |
| 4 | Número grande: [PENDENTE]. Embaixo, "Fonte: IBGE, Censo 2022". |
| 5 | Thor, mais perto da câmera. |
| 6 | Um círculo escuro cobre a tela e revela o logo do Mapiii. Entra o Mapi, um personagem em forma de pino de mapa com duas folhinhas, sorrindo e acenando. |
| 7 | Um celular com perguntas de botões grandes. Sai dele um cartão "Pode ter direito". Selos: "Sem nome", "Sem CPF". |
| 8 | A frase "você tem direito" é riscada. Embaixo, "pode ter direito" e o selo da fonte oficial com a data. |
| 9 | Uma mão vira o celular para fora. Na tela, "Mostre ao motorista" em letra grande e um código QR. |
| 10 | Pessoa em cadeira de rodas no ponto, celular no bolso fazendo som. Aparece a notificação "Ônibus acessível chegando, dois minutos". |
| 11 | O Mapi com a mão aberta, num gesto de não. "Emergência: 192". |
| 12 | Números grandes: "12 de 12 recusas corretas" e "Acessibilidade 100". |
| 13 | Seis tópicos com ícones: sem internet, um toque, letra A, A+ e A++, ouve em voz alta, confere se é oficial, sem login. |
| 14 | Gabriel fala para a câmera. |
| 15 | Selo "Visão de futuro". Mapa do mundo com um pino em São Paulo e outros acendendo. |
| 16 | Ícones dos Objetivos de Desenvolvimento Sustentável 10 e 11. |
| 17 | Thor e Gabriel juntos. O Mapi comemora no canto. |
| 18 | O ponto de ônibus de novo: agora a rampa desce e a pessoa embarca. Logo do Mapiii e o aviso de protótipo. |

## 12. Claude Design: pedidos

Os pedidos 1 (Mapi 3D), 2 (quadros 01 a 13) e 3 (capa) já foram feitos; os textos usados estão em `video/claude-design/pedido-1`, `-2` e `-3` só como registro. As imagens do Mapi plano usadas de referência estão em `video/claude-design/referencias/`.

**Onde está tudo o que o Claude Design gerou:** no artefato do design system Mapiii, em https://claude.ai/artifact/6Vkhuq9j7zNxiXF3ccbmfs (os arquivos ficam na aba de arquivos, no fim da página). Ele tem os quadros, o Mapi 3D, os objetos 3D e as peças. Só abre para quem tem acesso ao artefato no claude.ai. O Claude Code baixa os arquivos de lá e salva aqui no repositório.

**Como fazer um pedido:** no claude.ai, abra **Design** e o projeto do design system "Mapiii" (o mesmo onde saiu o Mapi 3D, de preferência **na mesma conversa**, para manter o estilo). Anexe o que o pedido indicar, cole o texto e envie. Peça ajustes no mesmo chat. Exporte em PNG e mande para o Claude Code, que confere antes de salvar.

**Na hora de conferir, não aceitem:** texto inventado nas telas (lei, valor, prazo, telefone, link), "você tem direito", cores fora da paleta, ou o Mapi com rosto, cor ou forma diferente.

### Pedido 4 · Quadro 14, o fecho com a rampa descida (recomendado)

**Anexar:** o quadro `video/quadros/01.png` (para manter o mesmo desenho) e o `video/quadros/04.png` (para o logo).

```text
No arquivo "Mapiii Pitch Quadros 16x9", crie o quadro 14, o último do vídeo, no mesmo formato dos outros (1920 × 1080) e com as mesmas regras: só os tokens, as fontes (Nunito) e os ícones do design system; fundo Seashell #F2E9E4; texto Space Indigo #22223B; fundo sólido, sem degradê, sem foto e sem emoji.

É o fim da história que começa no quadro 1 (anexo). Use exatamente o mesmo ponto de ônibus, o mesmo ônibus e a mesma pessoa em cadeira de rodas em silhueta, vistos de lado e no mesmo estilo plano. A diferença: agora a porta está aberta, a rampa está DESCIDA até a calçada e a pessoa está subindo a rampa, entrando no ônibus. A cena ocupa a metade de baixo do quadro.

Na metade de cima, centralizado: o logo do Mapiii grande (igual ao do quadro 4, anexo) e, embaixo, "o mapa dos seus direitos", com "direitos" sublinhado em rosa. No rodapé, pequeno: "Protótipo de estudo, não é canal oficial. · FIAP Global Solution 2026".

Sem o Mapi neste quadro (ele já aparece no quadro 13). Sem outro texto além do indicado. Contraste de pelo menos 4,5:1 em todo texto.

Entregue também, como PNG separados e com fundo transparente, as peças que vão ser animadas: o ônibus sem a rampa, a rampa sozinha e a pessoa em cadeira de rodas sozinha, todas na mesma escala do quadro.
```

**Onde salvar:** `video/quadros/14.png` e as peças em `video/quadros/14-pecas/` (`onibus.png`, `rampa.png`, `pessoa.png`).

**Decisão de 07/11 (Thor):** a primeira versão fica. A rampa é fina no quadro parado, mas na animação ela desce em movimento, e é isso que chama a atenção.

### Pedido 5 · Objetos 3D da cena 3 (opcional)

Só se a dupla quiser deixar a cena 3 mais rica. Os quadros atuais já resolvem a cena. São objetos, **não personagens**: sem rosto, para o Mapi continuar sendo o único personagem.

**Anexar:** duas poses do Mapi 3D (`video/mapi-3d/bom.png` e `video/mapi-3d/atencao.png`), para copiar o material e a luz. Se a conversa do Mapi 3D ainda estiver aberta, faça lá mesmo.

```text
Crie 3 objetos em 3D no mesmo estilo e com o mesmo material do Mapi 3D (anexos): formas arredondadas e macias, acabamento brilhante de brinquedo de vinil, luz de estúdio suave vinda do alto à direita, contorno escuro Space Indigo #22223B, e só as cores da paleta do design system Mapiii (Space Indigo #22223B, Dusty Grape #4A4E69, Lilac Ash #9A8C98, Almond Silk #C9ADA7, Seashell #F2E9E4 e o rosa #CF7A93). Sem rosto, sem olhos, sem boca: são objetos, não personagens. Sem texto, sem letras e sem números em nenhum objeto.

1. "espalhada": uma pilha de folhas de papel se espalhando no ar, algumas voando, com linhas cinza no lugar do texto.
2. "dificil": um documento grosso e enorme, com muitas linhas cinza bem pequenas e um carimbo sem letras.
3. "golpe": um celular com um anzol de pesca preso na tela, que mostra só um alerta com o ícone de escudo e um X.

Mostre os 3 lado a lado com o Mapi 3D bom, para conferir que o estilo é o mesmo, sobre o fundo Seashell #F2E9E4. Entregue cada objeto como PNG com fundo transparente, 2000 × 2000 px, centralizado e no mesmo tamanho.
```

**Onde salvar:** `video/objetos-3d/espalhada.png`, `dificil.png` e `golpe.png`.

### Pedido 6 · Celular 3D para o giro da cena 9 (recomendado)

O momento principal do vídeo é "vire a tela". Com o celular em 3D visto de três lados, a montagem faz o giro de verdade (costas, perfil, frente) e coloca a tela do app por cima, em código.

**Anexar:** `video/objetos-3d/golpe.png` (o celular que já existe nesse estilo) e `video/mapi-3d/bom.png`.

```text
Crie um celular moderno em 3D no mesmo estilo e material dos objetos anexos (o celular do "golpe" e o Mapi 3D): formas arredondadas, acabamento brilhante de brinquedo de vinil, contorno escuro Space Indigo #22223B, luz de estúdio suave vinda do alto à direita, só cores da paleta Mapiii (Space Indigo #22223B, Dusty Grape #4A4E69, Lilac Ash #9A8C98, Almond Silk #C9ADA7, Seashell #F2E9E4, rosa #CF7A93). Sem rosto, sem texto, sem logo de marca real, sem anzol.

Entregue 3 vistas do MESMO celular, de pé, no mesmo tamanho e na mesma posição no quadro, para uma animação de giro:
1. frente: a tela inteira em Seashell #F2E9E4 lisa, sem nada desenhado nela (o conteúdo é colocado depois);
2. perfil: o celular visto de lado, bem fino;
3. costas: a parte de trás, com uma câmera simples.

Cada vista em PNG com fundo transparente, 2000 × 2000 px, centralizada. Informe também, em pixels, o retângulo exato da tela na vista de frente (x, y, largura, altura).
```

**Onde salvar:** `video/objetos-3d/celular-frente.png`, `celular-perfil.png` e `celular-costas.png`. **Feito em 08/11**; o retângulo da tela está na seção 6.

### Pedido 7 · Quadro 15, os ODS (cena 16)

A cena 16 ainda não tem quadro. Os ícones dos ODS são da ONU e **não podem ser redesenhados**: o quadro só reserva o lugar deles, e a montagem coloca os ícones oficiais por cima.

```text
No arquivo "Mapiii Pitch Quadros 16x9", crie o quadro 15, entre o 12 (mapa) e o 13 (fecho), no mesmo formato (1920 × 1080) e com as mesmas regras dos outros: só tokens, fontes e ícones do design system, fundo Seashell #F2E9E4 sólido, texto Space Indigo #22223B, sem foto e sem emoji.

Conteúdo: dois quadrados grandes lado a lado, no centro, cada um com cerca de 420 × 420 px, vazios, só com uma borda tracejada fina em Lilac Ash #9A8C98 (são os lugares onde entram depois os ícones oficiais dos ODS 10 e 11; NÃO desenhe nenhum ícone de ODS). Embaixo de cada quadrado, em Nunito 800: "Menos desigualdade" e "Cidades para todo mundo", com "desigualdade" e "todo mundo" sublinhados em rosa. Mais nada no quadro. Contraste de pelo menos 4,5:1 em todo texto.

Informe a posição exata (x, y, largura, altura) de cada quadrado.
```

**Onde salvar:** `video/quadros/15.png`. **Feito em 08/11**; as posições estão na seção 6.

### Pedido 8 · Moldura das cenas de câmera (opcional)

Para as gravações de Thor e Gabriel (cenas 2, 3, 5, 14 e 17) parecerem parte do mesmo vídeo, e não um corte para outro mundo.

```text
No arquivo "Mapiii Pitch Quadros 16x9", crie dois quadros de apoio, no mesmo formato (1920 × 1080) e com as mesmas regras dos outros:

1. "Moldura de câmera": fundo Seashell #F2E9E4 sólido com um retângulo de cantos bem arredondados ocupando quase toda a tela (margem de cerca de 48 px), preenchido de verde puro #00FF00 (é onde o vídeo da câmera entra depois). Uma borda fina Space Indigo #22223B no retângulo. Nada mais.
2. "Nomes": duas etiquetas pequenas no estilo dos chips do design system, em Space Indigo com texto Seashell, Nunito 800, só com os nomes "Thor" e "Gabriel" (sem sobrenome, sem cargo, sem texto em caixa alta espaçada). Cada uma em PNG separado com fundo transparente.

Contraste de pelo menos 4,5:1. Informe o raio dos cantos e a posição do retângulo.
```

**Onde salvar:** `video/quadros/camera-moldura.png` e `video/quadros/camera-nomes/` (`thor.png`, `gabriel.png`). **Feito em 08/11**; as medidas estão na seção 6. Os nomes entram na primeira vez que cada um aparece (Thor na cena 2, Gabriel na cena 3), por 2 s.

### Pedido 9 · Legenda e relógio (recomendado, o último)

A legenda fica na tela o vídeo inteiro (é obrigatória, por acessibilidade), então ela precisa ter a cara do Mapiii. O relógio "7:40" das cenas 1 a 4 é o único elemento que ainda não tem desenho.

```text
No arquivo "Mapiii Pitch Quadros 16x9", crie dois elementos de apoio para a montagem do vídeo, com as mesmas regras dos outros quadros (tokens, Nunito, fundo sólido, sem emoji):

1. "Legenda": um quadro 1920 × 1080 com fundo Seashell #F2E9E4 mostrando como fica a legenda do vídeo, centralizada na parte de baixo (a cerca de 64 px da borda): uma faixa de cantos arredondados em Space Indigo #22223B com texto Seashell #F2E9E4 em Nunito 800, 44 px, no máximo 2 linhas e cerca de 42 caracteres por linha. Exemplo de texto: "Para quem usa cadeira de rodas, essa cena é real." Mostre também, num segundo quadro, a mesma legenda sobre o quadro 1 (ponto de ônibus), para conferir que não cobre nada importante. Informe a altura da faixa, o raio dos cantos e a distância da borda.

2. "Relógio": um chip pequeno no estilo dos chips do design system, em Space Indigo com texto Seashell em Nunito 800, com um ícone de relógio simples (traço de 2 px, no padrão dos ícones do design system) e o horário. Entregue 4 versões em PNG com fundo transparente: "7:40", "7:41", "7:42" e "7:43", todas do mesmo tamanho.

Contraste de pelo menos 4,5:1 em todo texto.
```

**Onde salvar:** `video/quadros/legenda.png` (e `legenda-sobre-quadro-01.png`) e `video/quadros/relogio/` (`0740.png` a `0743.png`). **Feito em 08/11.**

## 13. Cronograma

| Até | O quê | Quem |
|---|---|---|
| 09/11 | Fichas reais da base (H1 e H2) | Thor |
| 10/11 | Número do Censo 2022 (link e data); ODS 10 e 11 confirmados na lista da GS; Gabriel confirma roteiro e "sem teste com pessoas" | Dupla |
| 11/11 | `npm run eval` e `npm run lighthouse` de novo com as fichas | Claude Code |
| 12/11 | Pedido 4 (e 5, se quiserem) no Claude Design; sons, trilha e créditos; mapa-múndi; ícones dos ODS | Dupla |
| 13/11 | Cenas na câmera; cortes do app (cenas 7 e 9) e a voz do aviso | Dupla + Claude Code |
| 14/11 | Projeto Remotion montado com uma narração provisória, para testar o ritmo | Claude Code |
| 17/11 | Narração final gravada; montagem final; ajustes no Remotion Studio | Dupla + Claude Code |
| 18/11 | Revisão por quem não editou; entrega no Portal do Aluno, pasta "Entrega do vídeo pitch" (não nas pastas das disciplinas) | Dupla |
| 19/11 | Prazo final (reserva) | — |

## 14. De onde vieram as ideias

- **Vídeo campeão da GS 2026.1** ("Vídeo Pitch ARGUS", analisado em 07/11): abre com uma história humana, mostra uma função de cada vez, pessoas reais na câmera, escala antes do fecho e frase final com o nome. Onde ele falhou e o Mapiii vai além: visual repetitivo e escuro, produto quase invisível, nenhuma evidência, legenda de uma palavra só.
- **Guias "Como eu fiz o vídeo do Dorme" e "do Fatô"** (Marcos Levi, Levi Lab, material gratuito, levilab.site), lidos em 07/11. Aproveitados: narração com tempo por palavra e animação presa à palavra; uma ideia por cena; revisão no Remotion Studio antes do render; 2 a 4 ajustes; nada aleatório no código; quadro de cada cena conferido antes do render; número rolando com borrão; relógio no canto; lista descendo linha por linha; notificação descendo do topo; círculo cobrindo a tela no logo; números por extenso e sem reticências na locução. Não aproveitados: formato vertical e 60 qps, degradê e vidro (o design system proíbe), clone de voz (decisão da dupla), personagens novos (o Mapi é o único), a "virada" contando que o vídeo foi feito com IA, e "quanto custa por ano" (não temos número com fonte).
- **Brief de produção de um anúncio conceitual do Duolingo** (em espanhol, enviado pelo Thor em 09/11). Aproveitados: ondas de energia, câmera que reage ao impacto, hierarquia e níveis de som (−14 LUFS, música 12 dB abaixo da voz), notas por cena com refação abaixo de 9, conferência em volta dos impactos, o teste final e a ideia do fio condutor, adaptada como linha de rota de mapa. Não aproveitados: mundo 3D no Blender, câmera única sem cortes, 60 qps, voz sintética, música original, versão vertical, brilhos, névoa e fundos com textura.
- **Skill "motionmaxxing"** (Tejas Makwana, github.com/Tejashmakwana/motionmaxxing, licença Apache 2.0), lida em 08/11. Aproveitadas as regras de tempo medidas em 53 animações profissionais (seção 3). Não instalada: ela usa outra ferramenta de montagem (HTML no lugar do Remotion), a voz depende de uma chave paga, e a lista "nunca faça" dela proíbe coisas que o nosso vídeo é obrigado a ter (aviso de protótipo, selo, números com fonte) ou já decidiu (fundo sólido, os três cartões, o círculo no logo).
