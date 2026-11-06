# O que falta no Mapiii (e quem faz)

Documento de passagem de bastão da dupla (Thor e Gabriel). Diz o que já está pronto, o que falta, **o que só uma pessoa pode fazer (parte humana)** e o que o Claude Code faz. Cada tarefa tem: por que importa, **quando** fazer, o passo a passo e como conferir.

O escopo e o cronograma vêm do **guia da dupla, versão 2 (04/11/2026)**. **Entrega final de tudo: 19/11/2026.** Deixem tudo pronto até **18/11 à noite** (17/11 já é período de substitutivas).

> Para o Claude Code de quem pegar o projeto: leia também o [CLAUDE.md](CLAUDE.md). Quando perguntarem "o que eu faço agora?", siga a [Ordem recomendada](#2-ordem-recomendada) e confira o estado com os comandos de [Como saber onde estamos](#6-como-saber-onde-estamos).

Última atualização: 06/11/2026.

> **Outros registros:** o que já foi feito, sessão por sessão, está em [docs/registro.md](docs/registro.md). As melhorias de código (fluidez, visual, técnicas e produto), com ordem, plano e os destaques para o vídeo, estão em [docs/plano-de-melhorias.md](docs/plano-de-melhorias.md).

---

## 1. Onde o projeto está

**Pronto e testado** (271 testes automáticos, mais 36 verificações de banco):

| Parte | O que faz | Onde |
|---|---|---|
| Rota dos Direitos (MVP) | Busca própria, resposta com fonte, selo de confiança ("conferida há X dias"), "Não encontrei", recusas (emergência 192, dado pessoal, conselho jurídico ou médico) | `src/core/`, `src/app/telas/Perguntar.tsx` |
| Descubra o que posso pedir | Triagem + motor de regras ("Pode ter direito", "Talvez", "Provavelmente não se aplica") | `Triagem.tsx`, `RotaDosDireitos.tsx` |
| Prepare | Detalhe com checklist para compartilhar, copiar ou imprimir; o que o laudo precisa ter; lista única para o laudo | `DetalheDireito.tsx`, `Laudo.tsx` |
| Me negaram, e agora? | Caminho de recurso e modelo de pedido com a lei | `Negaram.tsx` |
| Garanta na rua | Embarque **por ponto** (próximo ônibus acessível com tempo de chegada) e por linha, Cartão da cadeira, Mostre ao motorista (com QR), Reclamação pronta | `NaRua.tsx`, `Embarque.tsx`, `embarque/`, `Cartao.tsx`, `Motorista.tsx` |
| Acessibilidade | Falar e ouvir (voz do navegador), modos "Sou a pessoa" e "Cuido de alguém", teclado, leitor de tela, contraste, 320 px | `src/ui/acoes.tsx`, `perguntas.json` (`texto_eu`) |
| Atalhos do Início | Como eu me desloco?, Quero dirigir, Calçada ruim? (aparecem quando há fichas marcadas) | `Inicio.tsx`, `Atalho.tsx` |
| Bônus já feito | Verificador de golpes ("Conferir se é oficial") | `Conferir.tsx`, `src/core/oficial.ts` |
| PWA | Instalável, funciona sem internet depois da 1ª visita | `vite.config.ts`, `public/icons/` |
| Avaliação | `npm run eval` com gabaritos; `avaliacao.html` com números e CSV; folha de teste com os 4 indicadores (inclui facilidade de uso e SUS) | `eval/`, `src/avaliacao/`, `docs/folha-de-teste.md` |
| Edge Function `onibus` | Guarda o token da SPTrans; ações `linhas`, `veiculos`, `paradas` e `previsao` | `supabase/functions/` |
| CI | GitHub Actions roda `verificar`, `build` e os testes de banco em cada push | `.github/workflows/verificar.yml` |

**O que impede a entrega hoje:** a base de conhecimento (`data/kb.json`) está **vazia**. Sem ela, o app publicado não mostra nenhum direito, a triagem não tem perguntas e as telas de motorista, modelo de pedido, laudo e atalhos ficam vazias. Em `npm run dev` aparece uma base fictícia de exemplo só para ver as telas; ela não vai para o build.

### Decisões

| Decisão | Situação |
|---|---|
| Embarque por ponto (como no guia) ou por linha | **Decidido em 06/11: por ponto**, com "por linha" como opção. Feito. |
| Embarque na entrega | Precisa estar ligado no build (`VITE_EMBARQUE_ATIVO=true`) para aparecer. Com dado real (H8) ou só com o exemplo. Decidir antes de H10. |
| Conta opcional (antiga "Fase 2": login, perfil salvo, histórico) | **Proposta: cortar**, porque o guia v2 pede "nenhum login". O banco já pronto fica no repositório, sem uso. Falta a dupla confirmar. |
| IA de reformulação | Desligada (o guia a deixa opcional, atrás de uma chave). Só ligar se sobrar tempo e com pedido explícito. |
| Lembrar respostas da triagem no aparelho | **Decidido em 06/11: sim**, desmarcado por padrão, com aviso de celular compartilhado; desmarcar apaga. Feito. |
| Repositório público | Decidido em 05/11/2026. Por isso nenhum segredo pode entrar no git. |

---

## 2. Ordem recomendada

Seguindo o cronograma do guia v2:

| Quando | Produto | Quem |
|---|---|---|
| até 9/11 | **H1** base com 10 a 13 fichas (começar pelos 3 temas mais fortes), **H2** canais oficiais, **H8** token da SPTrans e teste da API | Thor (fichas), Gabriel (token) |
| até 9/11 | **H5** perguntas do grupo `teste` do gabarito, **H4** subprefeituras | Gabriel (quem não monta as fichas) |
| 10 a 12/11 | **H10** publicar o site; **C1** ajustes da SPTrans real | Dupla; Claude Code |
| 13 a 14/11 | **H6** revisão por especialista; marcar os testes | Dupla |
| 15 a 16/11 | **H9** teste com 5 a 8 pessoas e coleta dos indicadores | Dupla |
| 17 a 18/11 | Corrigir o que o teste mostrou; **H11** vídeo pitch e entrega | Dupla + Claude Code |

As 8 entregas das disciplinas (Python, C, Computer Science, IA/RAG, Energia, Modelagem Linear, Computer Organization, Modelagem Matemática) correm em paralelo e reaproveitam o mesmo `data/kb.json`. Ficam fora deste repositório.

---

## 3. Parte humana (Thor e Gabriel)

Coisas que exigem pesquisa em fonte oficial, conta em serviço externo, decisão ou teste com gente. O Claude Code pode **explicar, preparar e conferir**, mas **não pode** inventar conteúdo, criar conta, entrar com senha nem guardar segredo no repositório.

### H1. Preencher a base de conhecimento (`data/kb.json`): PRIMEIRO

- **Por que:** o app só responde com o que está na base. É o que mais pesa na nota e o que destrava todas as telas.
- **Quando:** agora. Meta do guia: 10 a 13 fichas até 9/11.
- **Passo a passo:**
  1. Leia [data/README.md](data/README.md): campos, exemplo e como escrever `condicoes`.
  2. Comece pelos 3 temas mais fortes para cadeirante em SP. Sugestões do guia: gratuidade no transporte, BPC, transporte adaptado porta a porta, táxi acessível, vaga especial, habilitação e compra de carro adaptado, pedido de conserto de calçada (SP156). **Confirme cada um na fonte oficial**; não use a sugestão como fato.
  3. Para cada ficha: abra a fonte oficial e copie só o que está lá, em linguagem simples. Anote o link (https), o tipo da fonte e a data em que você abriu.
  4. Traga também, quando a fonte tiver: **a lei e o artigo** (`base_legal`, com o link do texto oficial), a frase curta para mostrar ao motorista (`frase_motorista`), o que o laudo precisa conter (`requisitos_laudo`) e, para as negativas mais comuns, um modelo de pedido (`modelo_recurso`, com os dados da pessoa como "(preencha seu nome)"). Diga também em qual atalho a ficha entra (`deslocamento`, `dirigir`, `calcada`).
  5. Cole o texto da fonte para o Claude Code: ele monta o JSON e roda os validadores.
- **Como conferir:**

  ```bash
  npm run validar-kb
  ```

  ```bash
  npm run auditar-perguntas
  ```

  ```bash
  npm test
  ```

  `auditar-perguntas` falha enquanto alguma pergunta da triagem não for usada por nenhuma ficha: ou use a pergunta numa condição, ou peça ao Claude Code para tirá-la de `data/perguntas.json`.

### H2. Canais oficiais (fichas de serviço)

- **Por que:** "Não encontrei" precisa indicar um canal oficial, e "Onde enviar" da Reclamação pronta só mostra canais que estão na base.
- **Quando:** junto com as primeiras fichas de H1.
- **Passo a passo:** crie fichas `tipo: "servico"` para os canais (ex.: Central 156 da Prefeitura, canal de reclamação da SPTrans), com `onde.texto`, `onde.link` e fonte **oficial**. Diga ao Claude Code os ids: ele põe `canalOficialId` e `canaisReclamacaoIds` em `src/core/config.ts`.
- **Como conferir:** no app, faça uma pergunta fora da base e veja o canal aparecer; abra a Reclamação pronta e veja "Onde enviar".

### H3. Valores oficiais de serviços (`data/servicos-valores.json`)

- **Por que:** "Conferir se é oficial" compara o valor cobrado com o oficial. Vazio, toda cobrança dá "Não sei". É bônus: só depois de H1.
- **Passo a passo:** formato em [data/README.md](data/README.md). Cada item precisa de fonte e data.

### H4. Conferir a lista das 32 subprefeituras

- **Por que:** foi escrita de memória.
- **Passo a passo:** compare `p_subprefeitura` em `data/perguntas.json` com a lista oficial da Prefeitura de São Paulo e diga ao Claude Code o que muda.

### H5. Gabaritos da avaliação

- **Por que:** o `npm run eval` mede o acerto. O grupo `teste` é o número honesto, então precisa ser escrito **por quem não montou as fichas** (Gabriel), **antes** de olhar as `perguntas_exemplo`.
- **Passo a passo:** formatos em [eval/README.md](eval/README.md). Em `eval/gabarito_perguntas.csv`, escreva perguntas como uma pessoa faria, com o id esperado (combine os ids com o Thor) e o grupo. Em `eval/gabarito_cenarios.json`, situações com as respostas da triagem e os direitos que deveriam aparecer.
- **Como conferir:** `npm run eval`.

### H6. Revisão por especialista

- **Por que:** "respostas conferidas por especialistas numa amostra" faz parte do indicador de acerto.
- **Quando:** depois de H1 e H5.
- **Passo a passo:** peça a alguém da área (assistente social, Defensoria, associação) para ler uma amostra das fichas, dos modelos de pedido e das frases para o motorista. Anote na [folha de teste](docs/folha-de-teste.md), seção 1.

### H7. Projeto Supabase (só para o Embarque com dado real)

- **Quando:** antes de H8. O resto do app não precisa.
- **Passo a passo:**
  1. Crie um projeto em https://supabase.com (a conta gratuita permite 2 projetos ativos).
  2. Copie `.env.example` para `.env.local` e preencha `VITE_SUPABASE_URL` e `VITE_SUPABASE_PUBLISHABLE_KEY` (Project Settings → API). **A chave secreta nunca vai para o `.env.local` nem para o git.**
  3. Não precisa aplicar a migração do banco: a conta opcional está fora do escopo.

### H8. Token da SPTrans (Embarque com dado real)

- **Por que:** a API Olho Vivo exige um token. Sem ele, o Embarque funciona só no modo exemplo.
- **Quando:** o quanto antes (o guia pede para testar a API na primeira semana).
- **Passo a passo:**
  1. Cadastre-se em https://www.sptrans.com.br/desenvolvedores/ e confirme o e-mail.
  2. Em "Meus Aplicativos", crie um aplicativo e copie o token.
  3. Guarde **só** como segredo da Edge Function (nunca no código, no `.env.local` ou no chat):

     ```bash
     supabase secrets set SPTRANS_TOKEN=coloque-aqui-o-token
     ```

     ```bash
     supabase functions deploy onibus
     ```

  4. Ligue a flag (`VITE_EMBARQUE_ATIVO=true` no `.env.local`) e teste um ponto real, por exemplo um ponto que vocês usam.
  5. **Confira e conte ao Claude Code:** (a) se a consulta funciona depois do login; (b) se o horário previsto bate com o relógio; (c) se o campo de acessibilidade vem preenchido; (d) se o texto do sentido da linha está certo.

### H9. Testes com pessoas e testes manuais

- **Quando:** 15 e 16/11, com o site publicado.
- **Passo a passo:**
  1. Siga a [folha de teste](docs/folha-de-teste.md): participantes só por código, sem nome; os 4 indicadores e as perguntas abertas.
  2. Instale o PWA num celular de verdade (Android: menu → "Instalar app"; iPhone: Compartilhar → "Adicionar à Tela de Início") e abra sem internet.
  3. No celular, teste: falar a pergunta, ouvir a resposta, "Compartilhar" do checklist no WhatsApp e ler o QR do "Mostre ao motorista" com a câmera.
  4. No fim, baixe os CSVs em `avaliacao.html`.

### H10. Publicar o site

- **Quando:** assim que H1 tiver as primeiras fichas (dá para publicar de novo depois).
- **Passo a passo:** decida a flag do Embarque **antes** do build (ela é lida no build). `npm run build` e publique a pasta `dist/` numa hospedagem estática com `https` (Netlify, Vercel, Cloudflare Pages ou GitHub Pages).
- **Como conferir:** abra o endereço no celular, navegue, desligue a internet e recarregue.

### H11. Vídeo pitch e entrega

- **Quando:** por último. O pitch tem até 3 min, é opcional e vai na pasta "Entrega do vídeo pitch"; os vídeos técnicos vão na entrega de cada disciplina.
- **Passo a passo:** siga o roteiro do guia (persona → problema → os três atos ao vivo → números do teste → ODS e visão de futuro). Se a API falhar, use "Ver exemplo" (o selo "EXEMPLO, não é dado real" aparece em toda tela). O mapa de calçadas entra **só** como visão de futuro.

---

## 4. Parte de código (o Claude Code faz)

Feito em 06/11/2026: escopo do guia v2 (campos novos das fichas, Me negaram, Mostre ao motorista com QR, Cartão da cadeira, Embarque por ponto, voz, modos pessoa e cuidador, checklist para compartilhar, atalhos, laudo único, selo "há X dias", folha de teste com facilidade de uso, ODS), validação de datas, `.gitattributes`, CI.

| # | Tarefa | Precisa antes | Pronto quando |
|---|---|---|---|
| C1 | Ajustes depois do primeiro teste real da SPTrans (sessão, horário previsto, sentido) | H8 | Consulta real funciona por ponto e por linha |
| C2 | Montar as fichas a partir do texto das fontes e configurar os canais (`config.ts`) | H1, H2 | `validar-kb`, `auditar-perguntas` e `eval` passam |
| C3 | Corrigir o que o teste com pessoas mostrar | H9 | Dupla aprova |
| C4 | Melhorias de fluidez, visual, técnicas e produto, na ordem do [plano de melhorias](docs/plano-de-melhorias.md) (fases A a E, código congelado em 14/11) | Decisões da seção 4 do plano | Cada uma marcada no plano e no registro |

---

## 5. Regras que não podem ser quebradas

- **Nada fora da base, nenhuma ficha sem fonte.** Não inventar direito, valor, prazo, telefone, e-mail, link ou lei.
- **Nunca dizer "você tem direito".** Só "Pode ter direito", "Talvez" ou "Provavelmente não se aplica". O validador recusa a frase em qualquer texto da ficha.
- **Sem dados pessoais:** não pedir nome, CPF, diagnóstico, idade exata ou renda exata. Respostas da triagem só em memória, a não ser que a pessoa marque "Lembrar neste aparelho" (nada sai do aparelho).
- **Sem login, sem cookies de rastreamento, sem analytics.**
- **Não se apresentar como canal oficial.** O aviso fixo de protótipo fica em todas as telas.
- **Emergência de saúde:** só "Em emergência, ligue 192."
- **Segredos** (`SPTRANS_TOKEN`, service_role, chave da Anthropic) só como segredo de Edge Function. Nunca no git, no `.env.local` ou no navegador.
- **Embarque:** nunca usar a localização da pessoa; "acessível" é o que a SPTrans informa (não prometer rampa ou elevador).
- **Mostre ao motorista:** tom firme e respeitoso, sem acusar; a segurança da pessoa vem antes.
- **Design:** só tokens, ícones e componentes do `design-system/`; o personagem Mapi não é redesenhado.

---

## 6. Como saber onde estamos

```bash
npm install
```

```bash
npm run verificar
```

```bash
npm run auditar-perguntas
```

```bash
npm run eval
```

- `verificar` = tipos + testes + arquivos de `data/` válidos. Tem que passar sempre.
- `auditar-perguntas` passa quando a base usa todas as perguntas da triagem (falha com a base vazia).
- `eval` mostra o acerto atual.
- `npm run test:banco` (precisa de Docker) testa a migração do banco (sem uso no app).

Quantas fichas a base tem:

```bash
node -e "console.log(require('./data/kb.json').length + ' fichas')"
```
