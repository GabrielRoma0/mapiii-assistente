# Montagem do vídeo pitch no Remotion

Guia para gerar e editar o vídeo do [roteiro v2](roteiro-v2.md) com o Claude Code e o Remotion. Junta o que o repositório já tem (Mapi 3D, quadros e capa do [Claude Design](claude-design/LEIA-ME.md)) com as dicas de dois guias gratuitos de Marcos Levi (Levi Lab, levilab.site): "Como eu fiz o vídeo do Dorme" (lido em 07/11/2026 pelas fotos das páginas) e "Como eu fiz o vídeo do Fatô" (PDF, lido no mesmo dia). Os dois seguem o mesmo método; o do Fatô traz algumas ideias a mais, marcadas com "(Fatô)". As dicas abaixo são resumo e adaptação, não cópia do guia.

## O método do guia, em uma frase

Grave a narração, transcreva com o tempo de cada palavra e peça ao Claude Code para montar o vídeo inteiro em código no Remotion, com **cada animação presa a uma palavra da fala**. Depois, revise no Remotion Studio e só então renderize. Conte com **2 a 4 pedidos de ajuste**: a primeira versão sai boa, mas não perfeita.

## O que aproveitamos e o que não

| Dica do guia | No Mapiii | Por quê |
|---|---|---|
| Transcrever a narração com tempo por palavra (faster-whisper) e prender cada animação numa palavra | **Sim** | É o que dá ritmo. O roteiro v2 já pedia isso |
| Uma cena por frase, uma ideia por tela, poucas palavras e o número bem grande | **Sim** | Igual ao [edicao.md](edicao.md) (até 6 palavras por linha) |
| Troca de cena com "whip" (borrão de movimento horizontal forte) | **Sim, mais curto** | O roteiro já pede "whoosh com borrão horizontal curto". Sem quique nem zoom elástico, que o design system proíbe |
| Número grande rolando com borrão vertical | **Sim** | Cena 4 (Censo) e cena 12 (12 de 12; 100). Só com o número real conferido |
| Relógio fixo no canto que avança a cada exemplo da dor | **Sim (ideia nova)** | Um chip "7:40" entra na cena 1 e fica no canto até a cena 4, avançando um pouco a cada cena: reforça a espera no ponto |
| Personagem 3D que entra, flutua, treme e tem sombra macia embaixo | **Sim, com o Mapi 3D** | As 7 poses de `mapi-3d/` já são PNG transparente. Entrada com subida suave (sem quique), flutuação leve, tremida só na pose `atencao`/`recusa`, sombra em elipse sólida Almond Silk `#C9ADA7` (sem desfoque nem transparência) |
| Tela do app num celular resolvendo a dor passo a passo | **Sim** | Quadros 5, 7 e 8 (cenas 7, 9 e 10) |
| Logo entrando com um círculo na cor de destaque que cobre a tela | **Sim** | Já é a cena 6 (círculo Space Indigo) |
| No fim, o logo grande com a última frase em destaque | **Sim** | Cenas 17 e 18 (quadros 13 e 4) |
| Cartões flutuando em volta do número ("63 reels hoje") | **Sim (ideia nova), com texto do app** | Na cena 6 ou 13, chips com frases que **existem no app**: "Fonte oficial", "Sem CPF", "Pode ter direito", "Emergência: 192". Nada inventado |
| Só narração e efeitos curtos (pop, whoosh, notificação) | **Quase** | Até a cena 5 só voz e efeitos; trilha bem baixa depois do logo (decisão do roteiro). "Papel rasgando" pode entrar no cartão "Com golpe" (cena 3) |
| Números por extenso na narração; evitar reticências ("...") | **Sim** | Já está na locução corrida. Vale também para a transcrição |
| Escrever nome difícil como se fala ("Clód") | **Só se usar voz sintética** | Com a voz da dupla, não precisa |
| Fundos com gradiente, grão de filme e cartões de vidro | **Não** | O design system pede fundo sólido, sem degradê, sem desfoque e sem transparência |
| Vertical 1080 × 1920, 60 qps, `--scale=2` | **Não** | O nosso é YouTube **16:9, 1920 × 1080, 30 qps** (as gravações do celular são 30 qps). 60 qps só se a dupla quiser, e o render demora o dobro |
| Clonar a voz no Higgsfield (Seed Audio) | **Não** | Decisão do Thor no roteiro v2: voz da dupla, sem clone. Se mudar, só a própria voz, e o vídeo tem que dizer que é clone |
| Personagens 3D novos no Higgsfield (GPT Image) | **Não para o Mapi** | O Mapi não pode ser redesenhado (regra do `CLAUDE.md`). Objetos extras, se a dupla quiser, saem do Claude Design no mesmo estilo (ver "Opcional" abaixo) |
| A virada "o Claude fez cada quadro" com a cena se separando em camadas 3D | **A dupla decide** | Seria honesto (o vídeo é montado pelo Claude Code), mas muda o fecho do roteiro e o tempo. Se entrar, dizer "montado com o Claude", sem sugerir que o app usa IA (a camada de IA está desligada) |

### Ideias a mais do guia do Fatô

| Dica do guia | No Mapiii | Por quê |
|---|---|---|
| Notificação no topo da tela, no estilo do celular ("Sua fatura fechou") | **Sim** | Cena 10: o aviso "Ônibus acessível chegando · 2 min" desce do topo como notificação, com o som de notificação |
| Uma palavra por frase em destaque, como marca-texto | **Sim, com sublinhado** | Os quadros já usam sublinhado Almond Silk na palavra-chave ("rampa", "direito", "tela"). Manter uma palavra por frase |
| Extrato que desenrola de cima para baixo, linha por linha | **Sim (ideia nova)** | Cena 7: o cartão "Pode ter direito" e a lista de passos da Rota descem linha por linha. As linhas são cinza, sem lei, valor, prazo, telefone ou link |
| Tesoura cortando as linhas que não prestam | **Sim, adaptado (ideia nova)** | Cena 3: no cartão "Com golpe", um risco passa sobre uma linha cinza de "site falso" e o ícone `golpe` aparece. Sem endereço de site de verdade, nem falso |
| Barra de progresso ("parcela 7 de 12") | **Só se existir no app** | Pode mostrar o avanço da triagem na cena 7, desde que seja igual à tela real. Se o app não tiver, não entra |
| A fórmula em 8 frases: número que assusta, a negação de todo mundo, 3 exemplos da dor, quanto custa por ano, a solução, o app resolvendo, 3 palavras + slogan, a virada | **Já coberta pelo roteiro v2, com duas exceções** | Número (7:40 e Censo), 3 exemplos (espalhada, difícil, com golpe), solução (cena 6), app resolvendo (7 a 11), slogan (cena 17). **"Quanto custa por ano" não entra**: não temos número com fonte. **3 palavras antes do slogan**: a dupla pode decidir, por exemplo "Descubra. Mostre. Garanta.", que seguem os atos do roteiro; isso muda a locução e precisa caber no tempo |

## O que preparar antes de pedir a montagem

| Item | Onde salvar | Quem | Situação em 07/11 |
|---|---|---|---|
| Narração: as falas em off, em **um arquivo só**, uma frase por vez com 1 s de pausa | `video/remotion/public/narracao.wav` | Dupla | Falta (depende do número do Censo) |
| Cenas na câmera (2, 3, 5, 14, 17) | `video/remotion/public/camera/cena-02.mp4` etc. | Dupla | Falta |
| Mapi 3D (7 poses) | `video/mapi-3d/` (já existe) | — | Pronto |
| Quadros de referência | `video/quadros/` (já existe) | — | Prontos (04 e 13 corrigidos) |
| Efeitos: pop, whoosh, tique, ding, notificação, papel rasgando | `video/sons/` com `CREDITOS.txt` (faixa, autor, link, licença) | Dupla, no Openverse (CC0 ou CC BY) | Falta |
| Trilha bem baixa (a partir da cena 6) | `video/sons/trilha.mp3` | Dupla | Falta |
| Número do Censo 2022 com link e data | no roteiro e na [checklist](checklist-final.md) | Dupla | Falta |
| Ícones ODS 10 e 11 (página oficial da ONU) e confirmação na lista da GS | `video/ods/` | Dupla | Falta |
| Mapa-múndi de uso livre (Natural Earth, domínio público) | `video/mapa/` | Dupla ou Claude Code, se o site for liberado | Falta |
| IBM Plex Mono (licença OFL), usada nas datas do quadro 8 | `design-system/fonts/` | Claude Code | Falta |
| Cortes de 2 s do app real (cenas 7 e 9) e print do Lighthouse (cena 12) | `video/remotion/public/app/` | Claude Code (Playwright) + dupla | Depois das fichas reais (H1) |

## O pedido para o Claude Code (copiar e colar)

Abra o Claude Code na pasta do repositório depois que os itens acima estiverem salvos e mande:

```text
Monte o vídeo pitch do Mapiii no Remotion, seguindo video/roteiro-v2.md e video/montagem-remotion.md.

IMPORTANTE: se ainda houver [PENDENTE] ou [CONFIRMAR] no roteiro, ou se faltar algum arquivo da tabela "O que preparar", PARE e me diga o que falta antes de começar. Não invente número, lei, valor, prazo, telefone ou link.

VOZ E RITMO
- Transcreva video/remotion/public/narracao.wav com o tempo de cada palavra (faster-whisper) e salve a transcrição em JSON.
- Uma cena por frase da tabela do roteiro. Prenda cada animação na palavra certa.
- Troca de cena com whoosh e borrão horizontal curto (120 a 200 ms).

VISUAL
- Projeto em video/remotion/, composição 1920x1080, 30 fps.
- Use só os tokens, as fontes (Nunito; IBM Plex Mono nas datas) e os ícones de design-system/. Fundos sólidos: sem degradê, sem desfoque, sem transparência, sem emoji.
- Os quadros de video/quadros/ são o modelo de cada cena animada.
- O Mapi 3D (video/mapi-3d/) entra subindo suave, flutua de leve e tem uma sombra em elipse sólida Almond Silk embaixo. Sem quique.
- O número grande rola com borrão vertical e para no valor.
- Um chip de relógio "7:40" entra na cena 1 e fica no canto até a cena 4.
- Cena 7: o cartão "Pode ter direito" e os passos da Rota descem linha por linha, com linhas cinza no lugar de texto de lei, valor, prazo, telefone ou link.
- Cena 3: no cartão "Com golpe", um risco corta uma linha cinza de "site falso". Nenhum endereço de site.
- Cena 10: o aviso "Ônibus acessível chegando · 2 min" desce do topo como notificação do celular.
- Selo VISÃO DE FUTURO o tempo todo na cena 15. Aviso de protótipo no fecho.
- Legenda completa queimada no vídeo, gerada da mesma transcrição, e também um .srt.

SOM
- Narração, efeitos de video/sons/ e a trilha baixa só a partir da cena 6.

REGRAS
- Tudo determinístico: nada de Math.random.
- Arredonde os valores de transform para 2 casas decimais.
- Antes do render, tire um quadro de cada cena, olhe e corrija o que estiver cortado, sobreposto ou com contraste abaixo de 4,5:1.
- Render final em H.264 (CRF 12, 30 fps). Diga onde ficou o arquivo.
```

## Revisão antes do render (do guia)

1. Peça ao Claude Code para abrir o **Remotion Studio** e assista inteiro, com som e sem som.
2. Peça os ajustes por escrito e um de cada vez: "a cena 4 está rápida", "o Mapi da cena 8 está em cima do texto", "a legenda da cena 12 cobre o número".
3. Confira que nenhum texto ficou cortado ou em cima do Mapi, e que não aparece "você tem direito" em lugar nenhum.
4. Só então peça o render final. Depois, a revisão de quem não editou (item 19 da [checklist](checklist-final.md)).

## Opcional: objetos 3D no mesmo estilo do Mapi

O guia usa um personagem 3D para cada exemplo da dor. Se a dupla quiser algo parecido, o caminho é um **pedido 4 no Claude Design**, na mesma conversa do Mapi 3D, para manter o estilo, com objetos (não personagens novos) para as cenas 1 a 4: ônibus com a porta aberta, rampa recolhida, uma pilha de papéis (cena 3, "espalhada") e um cadeado ou escudo de alerta (cena 3, "com golpe"). Sem rosto, sem texto, PNG transparente. Não é necessário: os quadros atuais já cobrem essas cenas.
