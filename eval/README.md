# Avaliação (`npm run eval`)

Mede o assistente com gabaritos escritos à mão, sem rede e sem a base de exemplo: só o que está em `data/kb.json`. A lógica fica em `src/core/avaliacao.ts` (a mesma busca e o mesmo motor de regras do app) e o script em `eval/avaliar.ts`.

Saídas: os números no terminal e uma linha por caso em `eval/resultados.csv`.

## (a) Pergunta livre: `gabarito_perguntas.csv`

| Coluna | O que é |
|---|---|
| `pergunta` | Como uma pessoa escreveria. Use aspas se tiver vírgula. |
| `id_esperado` | O `id` da entrada de `kb.json` que deveria responder, ou `RECUSAR`. |
| `grupo` | `ajuste` ou `teste`. |

- **`RECUSAR`**: o assistente não deve responder. Vale como acerto qualquer não-resposta: recusa (emergência, dado pessoal, conselho), "fora do tema" ou "não encontrei".
- **`ajuste`**: perguntas usadas para calibrar a base (`perguntas_exemplo`, `palavras_chave`) e o limite da busca (`src/core/config.ts`).
- **`teste`**: perguntas que **ninguém olhou ao ajustar**. O acerto delas é o número honesto para apresentar. De preferência, escritas por outra pessoa, antes de ver a base.
- Linhas que começam com `#` são comentários.

O arquivo já traz 12 casos `RECUSAR` (grupo `ajuste`) que não dependem da base: emergência, CPF, telefone, e-mail, conselho jurídico e médico, fora do tema e só símbolos.

Números mostrados:

- **Acerto geral**, **no grupo teste** e **no grupo ajuste**.
- **Top 3**: o esperado apareceu como resposta ou como uma das 2 sugestões.
- **Recusas corretas**: entre os `RECUSAR`, quantos ficaram sem resposta.
- **Recusa indevida**: entre os casos com id, quantos ficaram sem resposta (o limite da busca pode estar alto demais).
- **Acerto por tema** (o objetivo da triagem ligado à entrada esperada) e a **lista de erros**, com o que veio e a pontuação.

## (b) Rota dos Direitos: `gabarito_cenarios.json`

Lista de situações e do conjunto de direitos que deveriam aparecer como "Pode ter direito".

```json
[
  {
    "id": "filho-cadeirante-transporte",
    "descricao": "Mãe de criança que usa cadeira de rodas, quer passe livre, mora em SP.",
    "grupo": "teste",
    "respostas": {
      "p_quem": "filho_filha",
      "p_necessidade": ["mobilidade"],
      "p_objetivo": "transporte",
      "p_cidade": "sim"
    },
    "esperados": ["id-de-uma-entrada", "outro-id"]
  }
]
```

`respostas` usa os ids e valores de `data/perguntas.json` (lista só nas perguntas de múltipla escolha). `esperados` pode ser vazio, quando nada deveria aparecer como "Pode ter direito".

Números mostrados, de dois jeitos (só "Pode ter direito", e "Pode ter direito" + "Talvez"):

- **Precisão**: dos direitos que o app mostrou, quantos estavam no gabarito.
- **Cobertura**: dos direitos do gabarito, quantos o app mostrou.
- **Conjunto exato**: cenários em que o app mostrou exatamente o que o gabarito pede.

Precisão e cobertura somam todos os cenários (micro). Um cenário sem previstos não entra na precisão; sem esperados, não entra na cobertura.

## `resultados.csv`

`tipo,id_ou_pergunta,grupo,tema,esperado,obtido,acertou,pontuacao,precisao,cobertura`

- `tipo`: `pergunta`, `cenario_pode` ou `cenario_pode_ou_talvez`.
- Nos cenários, `esperado` e `obtido` são ids separados por `;`.
- `obtido` de pergunta: o id respondido, `recusa:<motivo>`, `fora_do_tema` ou `nao_encontrei`.

Se algum gabarito citar um id que não existe em `kb.json`, ou uma pergunta ou valor que não existe em `perguntas.json`, o script para e lista o problema.
