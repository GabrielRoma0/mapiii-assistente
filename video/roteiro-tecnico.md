# Estrutura do vídeo técnico (2 a 3 min)

Separado do pitch. Aqui pode haver termos técnicos, mas cada um vem com uma explicação em uma frase. Confira no enunciado de cada disciplina o que o professor pede: os vídeos técnicos vão na entrega de cada disciplina.

| Tempo | Bloco | O que mostrar | O que dizer (resumo) |
|---|---|---|---|
| 0:00–0:15 | O que é | Tela inicial do app | Um app instalável que orienta sobre direitos com base em fontes oficiais. Funciona sem internet e sem login. |
| 0:15–0:45 | Arquitetura simples | Desenho de 3 caixas: dados (`data/`), lógica (`src/core/`), telas (`src/app/`) | A lógica fica separada da tela. O mesmo código roda no app, nos testes e na avaliação, então o que medimos é o que o app faz. Vite, React e TypeScript, sem servidor próprio. |
| 0:45–1:10 | Base verificável | Uma ficha de `data/kb.json` e o `npm run validar-kb` passando | Cada ficha tem link oficial em https, tipo de fonte e data de conferência. O validador recusa ficha sem fonte e recusa a frase "você tem direito". |
| 1:10–1:35 | Busca própria e regras | A pergunta virando resposta; trecho de `src/core/busca.ts` e de `src/core/regras.ts` | Busca escrita por nós, sem biblioteca. Abaixo de um limite, responde "não encontrei" e indica o canal oficial. As regras da triagem classificam em "pode ter direito", "talvez" ou "provavelmente não se aplica". |
| 1:35–1:55 | Segurança das respostas | As recusas acontecendo | Recusa dados pessoais, conselho jurídico ou médico, e emergência ("ligue 192"). **Não há IA no app.** Se for citar a camada de IA, ela é só um plano (BACKLOG, item 4), com validador previsto antes de ligar. |
| 1:55–2:20 | Testes | `npm run verificar` e `npm run e2e` passando | [PENDENTE: números do dia da gravação] testes de lógica e [PENDENTE] testes de tela, rodando no CI a cada envio. Em 06/11 eram 294 e 106. |
| 2:20–2:45 | Indicadores | `npm run eval`, `avaliacao.html` e o Lighthouse | Acerto com gabarito [PENDENTE], 12 de 12 recusas corretas, acessibilidade 100 [refazer com as fichas], tempo e facilidade de uso no teste com pessoas [PENDENTE]. |
| 2:45–3:00 | Limites e próximos passos | O README, seção de limitações | O que ainda não foi conferido (API real da SPTrans, se ainda faltar) e o que vem depois. |

Regras: mostrar comandos rodando de verdade, sem montagem; nada de número que não esteja medido no dia da gravação.
