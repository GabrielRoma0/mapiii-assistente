# Folha de teste com pessoas

Roteiro para testar o Mapiii com participantes e juntar os números para o relatório. Imprima ou copie para uma planilha.

**Sem dados pessoais:** cada participante recebe só um código (P01, P02...). Não anote nome, idade exata, CPF, contato nem diagnóstico. Peça permissão antes de começar e explique que pode parar quando quiser.

Antes de cada sessão: abra `avaliacao.html` no aparelho de teste e apague os registros, para os números serem só dessa rodada. No fim, use "Baixar CSV" (e "Baixar CSV do Embarque", se estiver ligado) e guarde os arquivos com o código da rodada.

## 1. Indicadores do case (sempre)

São os três indicadores de "Sobre e fontes → Como medimos acerto".

| Código | Tarefa | Resposta citou fonte oficial? (sim/não) | Especialista conferiu e concordou? (sim/não/não conferido) | Pergunta fora da base recebeu "Não encontrei" em vez de palpite? (sim/não/não se aplica) | Observações |
|---|---|---|---|---|---|
| P01 | Fazer uma pergunta sobre um direito | | | | |
| P01 | Fazer uma pergunta que não está na base | | | | |
| P02 | | | | | |

O tempo até a resposta e o voto "Esta resposta ajudou?" de cada pergunta já ficam no registro local e saem no CSV de `avaliacao.html`.

## 2. Embarque garantido: tempo até achar o ônibus certo (só com `VITE_EMBARQUE_ATIVO=true`)

Se o Embarque estiver desligado, pule esta parte: valem só os três indicadores acima.

**Desafio (o mesmo nos dois métodos):** "Descubra quantos ônibus da linha ______, no sentido ______, estão acessíveis agora."

- **No Mapiii:** o app mede sozinho, do abrir a tela do Embarque até aparecer o resumo de veículos. Anote também com o cronômetro, para conferir.
- **No método habitual da pessoa:** o app ou site que ela já usa para ver ônibus. Cronometre do momento em que ela abre esse app ou site até dizer a resposta (ou desistir).
- Alterne a ordem entre participantes (metade começa pelo Mapiii, metade pelo método habitual), para não favorecer um lado por já conhecer a linha.
- Se a API da SPTrans estiver fora no dia, use o botão "Ver exemplo" e marque "exemplo" na coluna Modo. Os números do modo exemplo **não** valem como comparação com o mundo real, só como demonstração.

| Código | Linha e sentido | Modo do Mapiii (real/exemplo) | Tempo no Mapiii (s) | Achou no Mapiii? | Método habitual (nome do app ou site) | Tempo no método habitual (s) | Achou no método habitual? | Ordem (Mapiii primeiro / habitual primeiro) | Observações |
|---|---|---|---|---|---|---|---|---|---|
| P01 | | | | | | | | | |
| P02 | | | | | | | | | |
| P03 | | | | | | | | | |

**Para o relatório:** mediana dos dois tempos (só de quem achou), quantos acharam em cada método e a diferença por participante. Separe as linhas em modo real das linhas em modo exemplo.

## 3. Depois da sessão

- Junte as tabelas acima com os CSVs de `avaliacao.html`.
- Não guarde gravações de tela que mostrem notificações, contatos ou outros dados do aparelho da pessoa.
