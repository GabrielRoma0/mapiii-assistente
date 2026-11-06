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

### Fora do repositório (só neste computador)

- `.env.local`: liga o Embarque com o simulador. **Antes do build de produção, precisa apontar para o Supabase da dupla.**
- `.claude/launch.json` na pasta acima do repositório: para abrir o app no painel do navegador.
- PDF "Mapiii-o-que-mudou-06-11.pdf".

### O que ainda não foi conferido

- Voz, instalação do app e leitura do QR **num celular de verdade**.
- Leitor de tela real (TalkBack ou VoiceOver).
- API da SPTrans real (falta o token).
- Tudo que depende das fichas reais (base ainda vazia).
