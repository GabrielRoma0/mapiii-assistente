# Formulário do teste com pessoas

**Link para mandar às pessoas:** https://docs.google.com/forms/d/e/1FAIpQLSfEOVKYIH9_19hVdXwO5Vo6Kfwglwxrg1lwgYx2OHYBYEvHTQ/viewform

Decisão do Gabriel (09/11/2026): o teste da H9 é **a distância**. A pessoa recebe o link, faz as tarefas sozinha no celular (uns 15 minutos) e responde. Ninguém da dupla precisa estar junto. Texto do convite para mandar com o link: [convite-e-termo.md](convite-e-termo.md).

Conferido em 09/11: o link abre sem login, não coleta e-mail e tem as 17 perguntas abaixo.

## O que o formulário pergunta

| Seção | Perguntas |
|---|---|
| 1. Antes de começar | P1 aceite (quem não aceita vai direto para o fim) · P2 pode usar uma frase sua · P3 perfil geral (opcional) |
| 2. Tarefa no Mapiii | "Descubra quais documentos levar para pedir o Bilhete Único Especial da Pessoa com Deficiência e onde fazer o pedido." P4 tempo (em faixas) · P5 o que achou · P6 viu a fonte oficial · P7 pergunta que o Mapiii deve recusar |
| 3. A mesma tarefa no Google | P8 tempo (em faixas) · P9 o que achou · P10 onde achou |
| 4. O que achou do Mapiii | P11 a P13 de 1 a 5 (fácil de achar, entendeu, usaria de novo) · P14 SUS (opcional) |
| 5. Para terminar | P15 a P17 abertas (opcionais) |

## O que dizer no relatório (limites do teste)

- **Tempo informado pela própria pessoa, em faixas**, não cronometrado.
- **Todos fazem o Mapiii primeiro.** No Google a pessoa já sabe o que procurar, o que tende a deixar o Google mais rápido. Ou seja, a comparação é desfavorável ao Mapiii, e isso precisa estar escrito.
- **Acerto conferido pela dupla depois** (P5 e P9).
- **O Embarque (ônibus) ficou fora**: está desligado no site publicado.

## Depois das respostas

1. A dupla confere P5 e P9 com a ficha `bilhete-unico-especial-pcd` e a fonte oficial, marcando certo, parcial ou errado.
2. Antes de passar a planilha adiante, apaga qualquer coisa pessoal que alguém tenha escrito nas perguntas abertas.
3. Baixa a planilha em CSV e passa para o Claude Code. Ele calcula as faixas de tempo, o acerto, a média de 1 a 5 e o SUS, e atualiza o relatório (C2).
