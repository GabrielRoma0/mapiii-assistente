# Notas para a edição do vídeo pitch

Para quem edita. O texto exato e os tempos estão no [roteiro](roteiro.md); as capturas, em [gravacoes.md](gravacoes.md).

## Ritmo

- **Duração final: 3:00**, aceitando até 3:10. Passou disso, corte as frases indicadas no roteiro (seção c).
- Um corte de imagem a cada 3 a 5 segundos. Cena com mais de 5 s (por exemplo, 3, 11, 18 e 20) ganha um corte interno: zoom num detalhe, troca de take ou um texto novo na tela.
- **Gancho em até 10 s:** a cena 1 começa já com o ônibus chegando. Sem logo, sem vinheta e sem tela preta no começo.
- Uma ideia por cena. O texto na tela repete a ideia em poucas palavras, sem copiar a locução inteira.

## Transições

- Cortes secos na maior parte do vídeo.
- Entre os atos (cenas 9, 14 e 17): um cartão de título com fade de 150 ms. O design system pede transições de 120 a 200 ms, só de cor e opacidade, **sem quiques nem zoom elástico**.
- Zoom em gravação de tela: suave e lento, de no máximo 1,5×, para mostrar o selo da fonte, o "Pode ter direito" e o QR.

## Tipografia e cores (design system Mapiii v2.0)

- **Fonte:** Nunito, com peso 900 nos títulos, 800 nos rótulos e 400 no corpo. A fonte está em `design-system/fonts/` (licença OFL, pode usar no vídeo).
- **Tamanho do texto na tela:** no mínimo 48 px em 1080p para o texto principal e 32 px para a fonte e o rodapé. Até 6 palavras por linha.
- **Cores:**
  - Fundo **Seashell `#F2E9E4`** com texto **Space Indigo `#22223B`**.
  - Texto secundário em **Dusty Grape `#4A4E69`**.
  - Destaques em **Almond Silk `#C9ADA7`**, sempre com texto indigo.
  - Lilac Ash `#9A8C98` é só decorativo e **nunca** vai em texto.
- **Fundos sólidos**, sem degradê, sem desfoque e sem transparência.
- **Sem emoji.** Ícones só do conjunto da marca (`design-system/assets/icons/`).
- Números no formato brasileiro (12 de 12; 100; 4,5:1).

## Uso do Mapi

- Use só as poses que existem: **bom** (cena 6), **verificado** (7), **recusa** (21) e **comemorando** (28). Outras disponíveis: ouvindo, procurando, achei, dúvida, atenção, agradecendo, esperando.
- **Não redesenhe, não anime o corpo e não mude as cores do Mapi.** O personagem tem pose estática. Pode entrar e sair com fade, nada além disso.
- O Mapi não tem versão para fundo escuro: use sempre fundo claro atrás dele.
- Arquivos: `design-system/MapiPersonagem.dc.html` e `design-system/assets/logo/`.

## Selos

Eles aparecem na tela **o tempo todo** em que a imagem correspondente estiver visível.

| Selo | Onde | Estilo |
|---|---|---|
| **EXEMPLO, não é dado real** | Cena 20 (Embarque), do primeiro ao último quadro | Selo de alerta do design system: fundo âmbar, borda de 2 px e ícone de alerta, no canto superior. A gravação já traz o selo do app; o selo do vídeo é um reforço. |
| **VISÃO DE FUTURO** | Cena 26 (mapa de calçadas) | Mesmo estilo de alerta, no canto superior. |
| Aviso de protótipo | Cenas 8 e 29, e visível no topo de toda gravação do app | Faixa do próprio app. Na cena 29, como texto do rodapé final. |
| Fonte do número | Cenas 5 e 24 | Texto pequeno (32 px) embaixo do número: "Fonte: IBGE, Censo 2022" e "Lighthouse, [data da medição]". |

## Áudio

- **Locução:** gravada limpa, sem música, num lugar silencioso (um closet com roupas funciona bem), com o celular a 20 cm da boca. Normalize em −16 LUFS. Grave duas vezes.
- **Trilha:** bem baixa, por volta de −28 a −30 LUFS sob a voz e com ducking automático. Pode subir só nas cenas 6, 24 e 28, sempre sem cobrir a voz.
- Aviso falado do app (cena 20) e "Ouvir" (cena 13): no máximo 2 a 3 s, com a trilha abaixada.
- Termine com 1 s de silêncio.

## Legendas e acessibilidade

- Legendas: [legendas.srt](legendas.srt). Ressincronize pelo áudio gravado, porque os tempos foram estimados. **Grave as legendas no vídeo** (queimadas), porque nem toda plataforma de entrega mostra o .srt, e entregue o .srt também.
- Contraste do texto na tela de pelo menos 4,5:1 (indigo sobre Seashell passa com folga).
- Nada piscando mais de 3 vezes por segundo.
- Audiodescrição: [audiodescricao.md](audiodescricao.md).

## Exportação

- [ ] 1920 × 1080, 30 qps, H.264 (MP4), áudio AAC 48 kHz e 192 kbps.
- [ ] Duração entre 2:50 e 3:10.
- [ ] Legendas queimadas e o .srt separado, com o mesmo nome do vídeo.
- [ ] Nenhum **[PENDENTE]** ou **[CONFIRMAR]** visível na tela.
- [ ] O selo EXEMPLO aparece em toda a cena 20, e o selo VISÃO DE FUTURO em toda a cena 26.
- [ ] O aviso de protótipo aparece pelo menos nas cenas 8 e 29.
- [ ] Nenhum rosto, criança, nome, CPF, telefone, contato ou conversa aparece na tela.
- [ ] A frase "você tem direito" só aparece na cena 11, em "Ele nunca diz...", e nunca como afirmação. No resto, só "pode ter direito".
- [ ] Vídeo assistido inteiro com som e sem som (só pelas legendas) por quem não editou.
- [ ] Nome do arquivo: `mapiii-pitch-gs2026.mp4`.

## Lista de ativos

| Ativo | Arquivo | Origem | Licença | Quem produz | Situação |
|---|---|---|---|---|---|
| Locução | `locucao.wav` | Gravação da dupla | Própria | [DECIDIR: Thor ou Gabriel] | A gravar em 17/11 |
| Trilha | [ESCOLHER] | YouTube Audio Library (filtro "não exige atribuição") ou Pixabay Music | A da faixa escolhida: anote o nome da faixa, o autor, o link e a licença aqui | Quem edita | A escolher até 12/11 |
| Gravações G1 a G6 | `G1-...mp4` a `G6-...mp4` | Gravação de tela do app real | Própria | Dupla | G5 e G6 já podem ser gravadas; o resto depois da H1 |
| Animação do ponto de ônibus (cenas 1, 2 e 28) | [A PRODUZIR] | Formas planas no estilo do design system | Própria | Quem edita | A produzir |
| Mãos com celular (cenas 3 e 18) | [A GRAVAR] | Adulto voluntário, só as mãos | Própria, com autorização por escrito | Dupla | A gravar |
| Mapi (4 poses) | `design-system/MapiPersonagem.dc.html` | Design system Mapiii v2.0 | Do projeto | — | Pronto |
| Logo | `design-system/assets/logo/`, `design-system/exports/mapiii-logo.jpg` | Design system | Do projeto | — | Pronto |
| Ícones | `design-system/assets/icons/` | Design system | Do projeto | — | Pronto |
| Mapa de calçadas (cena 26) | `design-system/Mapiii Visao de Futuro 16x9.dc.html` | Design system | Do projeto | Quem edita (gravar a tela do arquivo aberto) | Pronto para gravar |
| Peça de vídeo 16:9 do design system | `design-system/Mapiii Direitos Video 16x9.dc.html` | Design system | Do projeto | Quem edita | Conferir o que serve |
| Ícones dos ODS 10 e 11 | [BAIXAR] | Site oficial da ONU sobre os ODS | [CONFIRMAR as regras de uso dos ícones da ONU] | Quem edita | A baixar |
| Print do Lighthouse | `lighthouse-100.png` | `npm run lighthouse` depois das fichas | Própria | Claude Code roda; a dupla tira o print | A refazer com as fichas |
| Número do Censo | — | IBGE, Censo 2022 | Dado público, citar a fonte | Dupla | [CONFIRMAR NA FONTE] |

**Não use foto de banco de imagens.** O design system proíbe, e o roteiro não precisa.
