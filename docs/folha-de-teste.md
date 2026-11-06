# Folha de teste com pessoas

Roteiro para testar o Mapiii com participantes e juntar os números do relatório e do pitch. Imprima ou copie para uma planilha. O case pede três indicadores: **acerto das orientações**, **tempo para encontrar a informação** e **facilidade de uso**. O Embarque garantido tem um quarto: **tempo até achar o ônibus certo**.

Meta do guia v2: de 5 a 8 participantes, testes em 15 e 16/11. Mostre todos os números, inclusive os ruins.

**Sem dados pessoais:** cada participante recebe só um código (P01, P02...). Não anote nome, idade exata, CPF, contato nem diagnóstico. Leia o termo de consentimento, peça permissão antes de começar e explique que a pessoa pode parar quando quiser. Anote só o perfil geral: "pessoa com deficiência", "cuidador(a)", "idoso(a)" ou "outro".

## 0. Antes de cada sessão

- Abra `avaliacao.html` no aparelho de teste e apague os registros, para os números serem só dessa rodada.
- Tenha um cronômetro (o do celular serve).
- Alterne a ordem entre participantes: metade começa pelo Mapiii, metade pelo método habitual. Assim ninguém fica mais rápido no segundo só por já conhecer a tarefa.
- No fim, use "Baixar CSV" (e "Baixar CSV do Embarque", se estiver ligado) e guarde os arquivos com o código da rodada.

## 1. Acerto das orientações

Para cada pergunta, confira a resposta com a fonte oficial da ficha.

| Código | Tarefa ou pergunta | A resposta estava certa? (sim/não) | Citou fonte oficial? (sim/não) | Especialista conferiu e concordou? (sim/não/não conferido) | Pergunta fora da base recebeu "Não encontrei" em vez de palpite? (sim/não/não se aplica) | Observações |
|---|---|---|---|---|---|---|
| P01 | Fazer uma pergunta sobre um direito | | | | | |
| P01 | Fazer uma pergunta que não está na base | | | | | |
| P02 | | | | | | |

O `npm run eval` dá o acerto automático com os gabaritos (`eval/`). Esta tabela é o acerto com pessoas de verdade. A meta do guia é 85% ou mais, e 100% das perguntas fora do escopo recusadas.

## 2. Tempo para encontrar a informação

**Tarefa (a mesma nos dois métodos):** "Descubra que documentos levar para pedir ______ e onde fazer o pedido." Escolha um direito que esteja na base.

- **No Mapiii:** cronometre do toque em "Descobrir o que posso pedir" ou "Fazer uma pergunta" até a pessoa dizer a resposta.
- **Na busca habitual:** o Google ou o site que a pessoa costuma usar. Cronometre do abrir o navegador até a pessoa dizer a resposta (ou desistir).

| Código | Direito pesquisado | Tempo no Mapiii (s) | Achou no Mapiii? | Tempo na busca habitual (s) | Achou na busca? | A resposta da busca estava certa? | Ordem (Mapiii primeiro / busca primeiro) | Observações |
|---|---|---|---|---|---|---|---|---|
| P01 | | | | | | | | |
| P02 | | | | | | | | |

O registro local também guarda os segundos até cada resposta da pergunta livre (CSV de `avaliacao.html`). Meta do guia: mediana pelo menos 50% menor que a da busca.

## 3. Embarque garantido: tempo até achar o ônibus certo (só com `VITE_EMBARQUE_ATIVO=true`)

Se o Embarque estiver desligado, pule esta parte.

**Desafio (o mesmo nos dois métodos):** "Você está no ponto ______. Descubra qual é o próximo ônibus acessível e em quantos minutos ele chega."

- **No Mapiii:** o app mede sozinho, do abrir a tela do Embarque até aparecer a previsão do ponto. Anote também com o cronômetro, para conferir.
- **No método habitual:** o app de transporte que a pessoa já usa. Cronometre do abrir o app até a pessoa dizer a resposta (ou desistir).
- Se a API da SPTrans estiver fora no dia, use "Ver exemplo" e marque "exemplo" na coluna Modo. Os números do modo exemplo **não** valem como comparação com o mundo real, só como demonstração.

| Código | Ponto | Modo do Mapiii (real/exemplo) | Tempo no Mapiii (s) | Achou no Mapiii? | Método habitual (nome do app) | Tempo no habitual (s) | Achou no habitual? | Errou o veículo (pegaria um sem acessibilidade)? | Ordem | Observações |
|---|---|---|---|---|---|---|---|---|---|---|
| P01 | | | | | | | | | | |
| P02 | | | | | | | | | | |

Meta do guia: mediana menor que a do método habitual e nenhum erro de veículo.

## 4. Facilidade de uso

Ao final, peça para a pessoa responder sozinha, de 1 (discordo totalmente) a 5 (concordo totalmente). Leia em voz alta se ela preferir.

**Versão curta (3 perguntas, a do guia):**

| Código | Foi fácil achar o que eu precisava | Entendi as respostas | Eu usaria o Mapiii de novo | Média |
|---|---|---|---|---|
| P01 | | | | |
| P02 | | | | |

Meta do guia: média 4 ou mais.

**Versão completa (opcional): SUS, System Usability Scale.** Dez afirmações, de 1 a 5. A tradução abaixo é livre: se o professor indicar uma versão validada em português, use a dele.

1. Eu acho que gostaria de usar este app com frequência.
2. Eu achei o app mais complicado do que precisava.
3. Eu achei o app fácil de usar.
4. Eu acho que precisaria de ajuda de outra pessoa para conseguir usar o app.
5. Eu achei que as partes do app combinam bem entre si.
6. Eu achei que o app tem muita coisa inconsistente.
7. Eu imagino que a maioria das pessoas aprenderia a usar este app rapidamente.
8. Eu achei o app muito cansativo de usar.
9. Eu me senti confiante usando o app.
10. Eu precisei aprender muitas coisas antes de conseguir usar o app.

**Como calcular:** nas afirmações ímpares, faça nota − 1; nas pares, faça 5 − nota. Some as dez e multiplique por 2,5. O resultado vai de 0 a 100 (acima de 68 costuma ser considerado acima da média).

| Código | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | SUS (0 a 100) |
|---|---|---|---|---|---|---|---|---|---|---|---|
| P01 | | | | | | | | | | | |

## 5. Perguntas abertas (para o pitch e para a análise)

- Qual foi a última vez que você precisou descobrir um direito ou serviço? O que você fez?
- Já teve o embarque negado ou pegou um ônibus sem rampa funcionando?
- Já precisou voltar ao médico para refazer um laudo?
- O que faltou no Mapiii? O que você tiraria?

Anote frases curtas, sem nada que identifique a pessoa. Uma frase real pode virar a fala da persona no pitch, com permissão.

## 6. Depois da sessão

- Junte as tabelas acima com os CSVs de `avaliacao.html`.
- Para o relatório e o pitch: mediana dos tempos (só de quem achou), quantos acharam em cada método, a diferença por participante, o acerto e a média de facilidade. Separe o Embarque em modo real do modo exemplo.
- Não guarde gravações de tela que mostrem notificações, contatos ou outros dados do aparelho da pessoa.
