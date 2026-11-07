# Gravações de tela do app real

Roteiro de captura para o [vídeo pitch](roteiro.md). Cada gravação (G1 a G6) diz o que fazer, onde começar e onde parar. Os números das cenas são os da tabela do roteiro.

> **Não dá para gravar ainda.** A base `data/kb.json` tem 0 fichas (07/11). As gravações G1, G3 e G4, e a parte "achou resposta" da G2, precisam das fichas reais (H1, prazo 9/11). G5 (Embarque no modo exemplo) e G6 (Conferir se é oficial) já podem ser gravadas. Data alvo para gravar tudo: **11 a 13/11**.

## Antes de qualquer gravação

1. **Use o build de produção, nunca o `npm run dev`.** O dev mostra a base fictícia de exemplo, e ela não pode aparecer no vídeo.

   ```bash
   npm run build
   ```

   ```bash
   npm run preview
   ```

   Para a G5 (Embarque), o build precisa ter `VITE_EMBARQUE_ATIVO=true` no `.env.local`. Faça um build só para a G5 e volte a flag para o valor decidido antes do build que vai ser publicado.
2. **Navegador limpo:** Chrome numa janela anônima ou num perfil novo, sem extensões visíveis, sem favoritos e sem abas de outras coisas.
3. **Tamanho de celular:** abra as ferramentas de desenvolvedor (F12), ligue a barra de dispositivos (Ctrl+Shift+M) e escolha um celular de 412 × 915 (por exemplo "Pixel 7"), com zoom de 100%. O editor coloca a gravação dentro de uma moldura de celular sobre o fundo Seashell.
4. **Captura em 1080p:** OBS Studio (gratuito) com a tela em 1920 × 1080, 30 ou 60 quadros por segundo. Grave só a área da página, sem a barra do sistema.
5. **Tema claro:** em "Sobre e fontes", escolha o tema claro. Tamanho do texto: **A+** (fica legível no vídeo).
6. **Começar do zero:** em `avaliacao.html`, apague o registro local. Nas ferramentas de desenvolvedor, em Application → Storage, clique em "Clear site data". Assim as boas-vindas e as respostas guardadas não atrapalham.
7. **Ritmo:** toque devagar, pare 2 segundos em cada tela antes de tocar de novo. Fica mais fácil cortar.
8. **Nada pessoal:** não digite nome, CPF, telefone, e-mail nem endereço em nenhum campo. O aviso fixo de protótipo tem que aparecer no topo em todas as gravações.
9. Grave cada G pelo menos duas vezes.

## G1 · Descubra (cenas 7, 8, 10, 11 e 12)

**Precisa de:** fichas reais de transporte e gratuidade.

1. Comece no Início, parado por 2 s, com o aviso de protótipo visível (cena 8).
2. Toque em **"Cuido de alguém"** e depois em **Descobrir o que posso pedir**.
3. Responda a triagem nesta ordem (as perguntas que aparecem dependem das fichas; se alguma não aparecer, siga em frente):

   | Pergunta | Resposta |
   |---|---|
   | Para quem é a orientação? | Para outra pessoa da família |
   | Que tipo de apoio a pessoa precisa no dia a dia? | Mobilidade ou cadeira de rodas |
   | O que você quer resolver? | Transporte e passe livre |
   | Em qual faixa de idade a pessoa está? | De 18 a 59 anos |
   | A pessoa usa cadeira de rodas, andador...? | Sim |
   | Existe um laudo ou relatório médico...? | Sim |
   | A pessoa mora na cidade de São Paulo? | Sim |
   | Em qual subprefeitura? | toque em **"Prefiro não responder"** (cena 10) |
   | A renda da casa...? | Não sei |
   | Como a pessoa costuma se deslocar? | Ônibus |

4. Na Rota dos Direitos, pare 3 s com os cartões "Pode ter direito" e "Talvez" visíveis (cena 11).
5. Abra o primeiro "Pode ter direito" e role devagar até o selo da fonte ("conferida há X dias"). **Pare ali 3 s** (cenas 7 e 12).
6. **Pare a gravação.**

**[PENDENTE]:** confirmar, depois da H1, que essas respostas mostram pelo menos um "Pode ter direito" de transporte. Se não mostrarem, ajustar as respostas aqui.

## G2 · Fazer uma pergunta e recusa (cenas 13 e 22)

**Parte A, a pergunta que a base responde (precisa das fichas):**

1. Toque em **Fazer uma pergunta**.
2. Toque no microfone e fale: **[PENDENTE: pergunta escolhida depois da H1, que esteja nas `perguntas_exemplo` de uma ficha de transporte e que acerte no `npm run eval`]**. Se a voz falhar na gravação, digite a mesma pergunta.
3. Mostre o texto aparecendo para conferir e envie.
4. Com a resposta na tela, toque em **Ouvir**. Deixe tocar 3 s (cena 13).
5. **Pare a gravação.**

**Parte B, a recusa (já pode gravar):**

1. Em **Fazer uma pergunta**, digite: `Que remédio tomar para dor nas costas?`
2. Envie. A resposta esperada (conferida no código em 07/11) começa com "Não posso dar orientação de saúde para um caso, como remédio, dose ou diagnóstico. Procure um serviço de saúde."
3. Pare 3 s na resposta (cena 22). **Pare a gravação.**
4. Opcional, para o "Em emergência, ligue 192": digite `Meu pai não está respirando o que eu faço` e grave a resposta.

## G3 · Prepare (cenas 15 e 16)

**Precisa de:** fichas com `o_que_levar` e `requisitos_laudo`.

1. Volte ao direito aberto na G1. Role até **O que levar**.
2. Toque em **Compartilhar**. Quando a folha do sistema abrir, pare 2 s e feche. **Não mostre contatos nem conversas.** No computador, a folha pode não abrir: nesse caso, grave o **Copiar** e o aviso de "copiado", ou grave esta parte no celular de verdade.
3. Vá para **Lista única para o laudo** e role devagar até o fim (cena 16).
4. **Pare a gravação.**

## G4 · Garanta na rua (cenas 18 e 19)

**Precisa de:** uma ficha com `frase_motorista` e `base_legal`, e uma com `modelo_recurso`.

1. No Início, toque em **Garanta na rua** e depois em **Mostre ao motorista**.
2. Escolha a ficha de transporte. Pare 3 s com a letra grande, a lei e o QR (cena 18).
3. Opcional: no celular de verdade, aponte a câmera de outro celular para o QR e mostre o texto oficial abrindo. Grave só as mãos.
4. Volte e toque em **Me negaram, e agora?**. Escolha a mesma ficha, role até o modelo de pedido e toque em **Copiar** (cena 19).
5. **Pare a gravação.**

## G5 · Embarque no modo exemplo (cena 20) · já pode gravar

1. Use o build com `VITE_EMBARQUE_ATIVO=true`.
2. Abra **Garanta na rua** e depois **Embarque garantido**.
3. Toque em **Ver exemplo**. Confirme que o selo **"EXEMPLO, não é dado real"** está visível.
4. Busque o ponto `central` e escolha-o. Pare 4 s com a contagem de minutos e o "passam 2 sem acessibilidade antes".
5. Ligue o aviso de chegada e grave o aviso falado (precisa do som do computador gravado na faixa de áudio do OBS).
6. **Pare a gravação.**

Se o token da SPTrans (H8) funcionar até 13/11, grave de novo com um ponto real, sem o modo exemplo, e anote o ponto, o dia e a hora. Nesse caso, o selo do roteiro muda para "Dados da SPTrans".

## G6 · Conferir se é oficial e sem internet (cenas 13 e 23) · já pode gravar

**Conferir se é oficial:**

1. No Início, toque em **Conferir se é oficial**.
2. Cole o link fictício: `https://beneficio-gov.br.exemplo.com/bpc`
3. O resultado esperado (conferido no código em 07/11) é **Suspeito**, com o motivo "Tem “gov.br” no endereço, mas o site termina em “exemplo.com”, que não é do governo." Pare 3 s.
4. Para contraste, cole `https://www.prefeitura.sp.gov.br` e mostre **Oficial**. Pare 2 s.
5. **Pare a gravação.**

Use só esse link fictício. Não use link de golpe real, nem de site de terceiros.

**Sem internet (melhor no celular de verdade):**

1. Com o app já aberto uma vez, ligue o modo avião.
2. Feche e abra o app. Mostre o Início abrindo e um direito abrindo.
3. **Pare a gravação.**

## Depois de gravar

- Salve os arquivos como `G1-descubra-take1.mp4`, `G1-descubra-take2.mp4` e assim por diante, numa pasta compartilhada da dupla. **Não ponha os vídeos no git** (são grandes).
- Anote na lista de ativos de [edicao.md](edicao.md) o nome de cada arquivo e o dia em que foi gravado.
