# Mapiii · o mapa dos seus direitos

Protótipo de estudo (FIAP, Global Solution CitizenTech, case **Citizen Assist AI**). Um assistente digital introdutório que orienta famílias de pessoas com deficiência, começando por quem usa cadeira de rodas, e cidadãos em geral sobre direitos e serviços públicos em São Paulo. Toda resposta vem com fonte verificável, data de conferência e aviso de limitação.

> **Sou um protótipo de estudo, não um canal oficial. Confirme nas fontes indicadas.**

O mapa colaborativo de calçadas é só visão de futuro e não está implementado.

> **Pegando o projeto agora?** Leia [PENDENCIAS.md](PENDENCIAS.md): o que está pronto, o que falta, o que é parte humana e em que ordem.

## O que o app faz

O escopo segue o guia da dupla (versão 2, 04/11/2026): o produto em três atos, **Descubra → Prepare → Garanta na rua**.

| Tela | O que faz |
|---|---|
| **Início** | "Quem está usando?" (**Sou a pessoa** ou **Cuido de alguém**: muda o texto das perguntas), as entradas principais e os **atalhos** (Como eu me desloco?, Quero dirigir, Calçada ruim?), que só aparecem quando há fichas marcadas com eles. |
| **Descobrir o que posso pedir** | Triagem em passos (só as perguntas que a base usa, sempre com "Prefiro não responder" e "Por que perguntamos isso?"). Um motor de regras classifica cada direito como **Pode ter direito**, **Talvez** ou **Provavelmente não se aplica**, explicando o porquê em uma frase. Nunca diz "você tem direito". |
| **Detalhe de um direito** | O que levar (checklist para **compartilhar no WhatsApp, copiar ou imprimir**), o que o laudo precisa ter, onde ir, prazo típico, como pedir, "Se negarem", base legal, fonte com **selo de confiança** ("conferida há 12 dias") e limitação. Botão **Ouvir**. |
| **Lista única para o laudo** | Junta o que o laudo precisa conter para todos os direitos que podem se aplicar, para pedir tudo numa consulta só. |
| **Fazer uma pergunta** | Busca própria, sem biblioteca externa. Dá para **falar** a pergunta (o texto aparece para conferir antes de enviar) e **ouvir** a resposta. Abaixo de um limite configurável responde "Não encontrei isso na minha base" e indica o canal oficial. Recusa dados pessoais, pedidos de conselho jurídico ou médico e, em emergência de saúde, responde só "Em emergência, ligue 192." |
| **Me negaram, e agora?** | Acolhimento, o caminho de recurso de cada ficha e o **modelo de pedido** que cita a lei, para copiar ou imprimir e completar fora do app. |
| **Garanta na rua** | Junta o Embarque garantido, o Cartão da cadeira, o Mostre ao motorista e a Reclamação pronta. |
| **Cartão da cadeira** | Cinco escolhas (tipo de cadeira, peso, porta-malas, transferência, acompanhante) viram uma mensagem educada para o chat do motorista de aplicativo ou táxi. Fica só na página, ou no aparelho se a pessoa marcar. |
| **Mostre ao motorista** | O direito em letra grande, a lei e um **QR code** para o texto oficial, para virar a tela para o motorista. Lembra que a segurança vem primeiro. |
| **Reclamação pronta** | Formulário só em memória (linha, data, hora, prefixo e o que aconteceu, sem nome nem CPF) que gera um texto neutro para copiar. |
| **Conferir se é oficial** | A pessoa cola um link ou um valor cobrado. Sem nenhuma requisição de rede, o app responde **Oficial**, **Suspeito** ou **Não sei**, com o motivo. |
| **Sobre e fontes** | Todas as fontes com data de verificação, como medimos se funciona, ODS, o que o assistente não faz, privacidade e tema. |
| **`avaliacao.html`** | Números do registro local anônimo e exportação em CSV. |
| **Embarque garantido** (atrás da flag) | **Por ponto:** o próximo ônibus acessível que chega ao ponto e em quantos minutos, e quantos sem acessibilidade passam antes, segundo a SPTrans. **Por linha:** quantos veículos da linha estão acessíveis agora. Com modo exemplo. Veja a seção própria abaixo. |

Telas que dependem de conteúdo (Mostre ao motorista, modelos de pedido, laudo, atalhos) só aparecem quando a base tiver fichas com esses campos. Em `npm run dev`, a base fictícia de exemplo mostra todas.

O app funciona sem internet depois da primeira visita e pode ser instalado (PWA).

## Privacidade

- Sem login, sem cookies de rastreamento, sem analytics e sem envio de dados para nenhum servidor.
- As respostas da triagem ficam só na memória da página. Não vão para a URL nem para o armazenamento do navegador.
- Texto com CPF, telefone ou e-mail é recusado sem ser processado nem guardado.
- O Cartão da cadeira só fica no aparelho se a pessoa marcar "Guardar neste aparelho" (e sai ao desmarcar). Só tem escolhas fixas, sem texto livre.
- O Embarque busca pelo nome do ponto ou da linha: nunca usa a localização da pessoa.
- Falar a pergunta usa o reconhecimento de voz do navegador; alguns navegadores enviam o áudio ao serviço do fabricante, e a tela avisa. Ouvir a resposta roda no aparelho.
- Cada pergunta livre guarda **neste aparelho** (`localStorage`) só quatro coisas: o tema, se achou resposta, os segundos até a resposta e o voto "Esta resposta ajudou?". Não guarda o texto da pergunta, identificador nem data. Recusas não entram. A pessoa vê, baixa e apaga tudo em `avaliacao.html`.

## Como rodar

Precisa do **Node.js 20.19 ou mais novo** (ou 22.12+) e do npm.

```bash
npm install
```

```bash
npm run dev
```

Abra o endereço que aparecer (normalmente http://localhost:5173).

> Enquanto `data/kb.json` estiver vazio, o `npm run dev` usa uma **base de exemplo fictícia** (`src/app/kb-exemplo.ts`) para dar para ver as telas, com uma faixa no topo avisando. Ela não entra no build de produção. A vitrine de componentes fica em http://localhost:5173/#/componentes, também só em desenvolvimento.

### Build de produção

```bash
npm run build
```

```bash
npm run preview
```

O build vai para `dist/`: arquivos estáticos que funcionam em qualquer hospedagem (inclusive numa subpasta, porque o `base` é relativo). O service worker só funciona em `https://` ou em `localhost`.

## Como testar

```bash
npm test
```

Roda os testes com o Vitest, em Node: normalização, busca, validação da pergunta, motor de regras, esquema da base, triagem e auditoria, "Conferir se é oficial", registro local, avaliação, rotas e o personagem.

```bash
npm run verificar
```

Checa os tipos (TypeScript), roda os testes e valida os arquivos de `data/`. Rode antes de entregar.

| Comando | O que faz |
|---|---|
| `npm run typecheck` | Só a checagem de tipos. |
| `npm run test:watch` | Testes em modo contínuo, enquanto você edita. |
| `npm run validar-kb` | Confere `kb.json`, `dominios-oficiais.json` e `servicos-valores.json` contra os esquemas e lista cada problema. |
| `npm run auditar-perguntas` | Falha se houver pergunta da triagem que nenhuma condição da base usa, ou condição que cita pergunta inexistente. **Com a base vazia, todas aparecem como sem uso: é esperado.** |
| `npm run test:banco` | Aplica as migrações do Supabase num Postgres descartável (Docker) e roda os testes de RLS. |

## Como avaliar

```bash
npm run eval
```

Mede o assistente com gabaritos escritos à mão, só com a base real (`data/kb.json`), e grava `eval/resultados.csv`.

- **Pergunta livre** (`eval/gabarito_perguntas.csv`): acerto geral, no grupo `teste` (o número honesto) e no grupo `ajuste`, acerto contando as 2 sugestões, recusas corretas, respostas que faltaram, acerto por tema e lista de erros.
- **Rota dos Direitos** (`eval/gabarito_cenarios.json`): precisão, cobertura e conjunto exato, só com "Pode ter direito" e também somando "Talvez".

Formatos e significado de cada número em [eval/README.md](eval/README.md).

## Como alimentar a base

Os dados ficam em `data/` e entram no build (funcionam offline):

| Arquivo | O que é |
|---|---|
| `kb.json` | Base de conhecimento: direitos, serviços e normas. **Nenhuma entrada sem fonte.** |
| `perguntas.json` | Perguntas da triagem (`p_quem`, `p_objetivo`...). As `condicoes` da base usam esses ids. |
| `dominios-oficiais.json` | Finais de endereço do poder público (Registro.br) e sites oficiais cadastrados, com fonte e data. |
| `servicos-valores.json` | Custo oficial de serviços, para conferir cobranças. Cada valor com fonte. |

Passo a passo para colar uma entrada, esquema completo, como as condições viram "Pode / Talvez / Não" e dicas para a busca acertar: [data/README.md](data/README.md). Depois de mudar a base:

```bash
npm run validar-kb
```

```bash
npm run auditar-perguntas
```

```bash
npm test
```

```bash
npm run eval
```

O limite da busca, o número de sugestões, os tamanhos mínimo e máximo da pergunta e o id da entrada usada como canal oficial ficam em `src/core/config.ts`.

## Como publicar

Qualquer hospedagem estática serve:

1. Rode `npm run build`.
2. Publique a pasta `dist/` (Netlify, Vercel, GitHub Pages, Cloudflare Pages, um bucket estático...).
3. Use `https://`, que o service worker precisa para o modo offline e a instalação.

As telas usam rotas com `#` (`#/perguntar`, `#/sobre`...), então não é preciso configurar redirecionamento no servidor.

## Acessibilidade

Feito para teclado e leitor de tela: foco visível em tudo (anel duplo do design system), "Pular para o conteúdo", o foco vai para o título ao trocar de tela ou de passo, rótulos e regiões ARIA, `aria-live` nas respostas, contraste de pelo menos 4,5:1 nos temas claro e escuro, alvos de toque de 48 px ou mais, texto de pelo menos 16 px e layout que aguenta 320 px de largura (o mesmo que zoom de 200%). O tema escuro segue o aparelho e pode ser trocado em "Sobre e fontes". O personagem tem pose estática, então `prefers-reduced-motion` já é respeitado.

## Como o código está organizado

```
data/              base de conhecimento, triagem, domínios e valores (JSON)
design-system/     design system Mapiii v2.0 (tokens, ícones, componentes React, telas de referência)
src/core/          lógica pura, sem tela: busca, regras, validação, checagem oficial, registro, avaliação
src/ui/            componentes do assistente e o personagem Mapi
src/app/           telas, rotas por #, estado em memória
src/avaliacao/     página avaliacao.html
src/app/embarque/  Embarque garantido: flag, cliente da função e modo exemplo
src/app/reclamacao/ Reclamação pronta
supabase/          migrações, testes de banco e Edge Functions (onibus)
tests/             testes (Vitest)
scripts/           validar-kb, auditar-perguntas, testar-banco e o simulador da SPTrans (só dev)
eval/              gabaritos, script de avaliação e resultados
docs/              folha de teste com pessoas e notas de manutenção (ícones do PWA)
```

O mesmo código de `src/core/` roda no navegador, nos testes e no `npm run eval`. Assim a avaliação mede exatamente o que o app faz.

**Stack:** Vite, React 18, TypeScript, Vitest, vite-plugin-pwa e tsx. A busca, o motor de regras e a checagem de domínio são algoritmos próprios, sem biblioteca externa. A fonte Nunito é servida pelo próprio app (sem Google Fonts), para funcionar offline e não enviar o IP de ninguém a terceiros.

## Limitações conhecidas

- **A base ainda está vazia.** O app de produção só mostra direitos depois que as fichas com fonte forem coladas em `data/kb.json`. Também estão vazios `servicos-valores.json` e o grupo `teste` dos gabaritos.
- A lista das 32 subprefeituras em `data/perguntas.json` precisa ser conferida com a fonte da Prefeitura.
- "Conferir se é oficial" só compara com listas locais: não garante nada, e a tela diz isso.
- O registro de uso fica só em cada aparelho. Para juntar números de várias pessoas, cada uma precisa exportar o CSV.
- O desenho do personagem não tem versão própria para o tema escuro (lacuna do design system). O design system também não tem ícone de microfone nem de alto-falante: falar e ouvir usam o ícone de conversa, sempre com texto.
- Voz (falar e ouvir) depende do navegador: some onde não houver suporte. Ainda não testada num celular.
- Prompt de instalação do PWA ainda não testado num celular.
- Embarque: a API real da SPTrans ainda não foi chamada (falta o token); só o modo exemplo e o simulador foram testados.

## Embarque garantido (diferencial, desligado por padrão)

Apps comuns mostram o próximo ônibus; o Mapiii mostra o próximo que a pessoa consegue usar. Por padrão a busca é **por ponto**: a pessoa digita o nome do ponto ou da rua, escolhe o ponto e vê o próximo ônibus acessível e em quantos minutos chega, segundo a API Olho Vivo da SPTrans (`/Parada/Buscar` e `/Previsao/Parada`). Também dá para buscar **por linha** e ver quantos veículos em operação são acessíveis agora. **Nunca usa a localização da pessoa:** a busca é só pelo texto digitado. O que foi confirmado na documentação da API está em [data/README.md](data/README.md).

Junto vêm:

- **Reclamação pronta:** um formulário só em memória (linha, data, hora, prefixo e o que aconteceu, sem nome nem CPF) que gera um texto neutro para copiar. "Onde enviar" só mostra canais de fichas oficiais e verificadas da base (`canaisReclamacaoIds` em `src/core/config.ts`); sem elas, fica desabilitado. O app não envia nada.
- **Indicador "tempo até achar o ônibus certo":** medido do abrir a tela até ver o resumo, separado por modo (tempo real ou exemplo), em `avaliacao.html` e num CSV próprio. A comparação com o método que a pessoa já usa vai na [folha de teste](docs/folha-de-teste.md).

### Ligar e desligar

O Embarque só existe com a flag. Crie um arquivo `.env.local` (ele não vai para o git) com:

```
VITE_EMBARQUE_ATIVO=true
```

Reinicie o `npm run dev` (ou rode o `npm run build` de novo) depois de mudar a flag. **Desligado** (padrão): o Início mostra só as 3 entradas, `#/embarque` e `#/reclamacao` dão "Página não encontrada", o indicador some da avaliação e nada disso entra no build.

### Testar sem a API

Dois jeitos, sem token nem Supabase:

1. **Modo exemplo (Plano B):** com a flag ligada, abra o Embarque e toque em **"Ver exemplo"**. Os dados vêm de `data/embarque-exemplo.json` (pontos fictícios "central", "flores" e "praça"; linhas fictícias `EX01`, `EX02`, `EX03`) e toda tela desse modo mostra o selo **"EXEMPLO, não é dado real"**. Funciona offline e serve para o vídeo se a API falhar no dia.
2. **Simulador da SPTrans (só `npm run dev`):** roda a lógica real da Edge Function contra uma SPTrans fictícia. No `.env.local`:

   ```
   VITE_EMBARQUE_ATIVO=true
   VITE_SUPABASE_URL=http://localhost:5173/__simulador
   VITE_SUPABASE_PUBLISHABLE_KEY=simulador
   ```

   **Por ponto:** qualquer nome lista três pontos fictícios: "central" (acessível em 14 min, depois de 2 sem acessibilidade), "sem acessível" e "vazio" (sem previsão); `fora` simula a API fora do ar. **Por linha:** `8000` (dois sentidos, um com dado desatualizado), `999` (sem veículos), `vazia` (linha inexistente), `fora` (API fora do ar), `limite` (muitos pedidos) ou `lento` (tempo esgotado). O simulador não entra no build.

Os testes automáticos da função usam a API simulada e rodam junto com o `npm test`.

### Testar com a API real

Precisa de um projeto Supabase e de um token da SPTrans (cadastro em https://www.sptrans.com.br/desenvolvedores/, área "Meus Aplicativos").

1. Guarde o token **só** como segredo da Edge Function. Nunca no código, no `.env.local` nem no navegador:

   ```bash
   supabase secrets set SPTRANS_TOKEN=coloque-aqui-o-token
   ```

2. Publique a função:

   ```bash
   supabase functions deploy onibus
   ```

3. No `.env.local`, ponha `VITE_EMBARQUE_ATIVO=true`, `VITE_SUPABASE_URL` e `VITE_SUPABASE_PUBLISHABLE_KEY` do projeto (Project Settings → API).

Na primeira consulta real, confira três coisas que a documentação da SPTrans não deixa claras: se a sessão continua depois do login (a função reenvia os cookies do login), se o texto do sentido da linha está certo e se o horário previsto (`t`) bate com o relógio do ponto. Detalhes da função, limites e cache em [supabase/README.md](supabase/README.md).

## Problema, persona e ODS

- **Problema:** famílias de pessoas com deficiência gastam tempo e energia para descobrir o que podem pedir, onde e com quais documentos. A informação existe, mas está espalhada, em linguagem difícil e misturada com golpes. Na rua, o embarque acessível é negado na hora.
- **Quem se beneficia:** pessoas que usam cadeira de rodas e quem cuida delas; também idosos, pessoas com mobilidade reduzida e pais com carrinho de bebê.
- **Persona:** definida pelas entrevistas com cuidadores (veja `docs/folha-de-teste.md`, seção 5).
- **ODS:** 10, Redução das desigualdades (meta 10.2), e 11, Cidades e comunidades sustentáveis (metas 11.2 e 11.7).

## Como seria no mundo real

- **Custo baixo:** o app é estático e funciona offline; a única parte com servidor é a função que guarda o token da SPTrans. Roda em celular simples e com internet fraca.
- **Sem depender de integração com o governo:** a base é própria, com fonte e data em cada ficha. Manter a base é o trabalho principal: conferir as fontes a cada 6 meses (o app já avisa quando uma ficha passa disso).
- **Parcerias que fariam diferença:** revisão das fichas por quem orienta essas famílias (assistência social, Defensoria Pública, associações) e um canal para a SPTrans e a Prefeitura receberem as reclamações.
- **Próximas etapas:** o mapa colaborativo de calçadas e a rede de voluntários ficam como visão de futuro (`design-system/Mapiii Visao de Futuro.dc.html`). Outras ideias, com esforço e risco, em [BACKLOG.md](BACKLOG.md).

## Conta opcional (fora do escopo do guia v2)

O guia v2 pede **nenhum login**, então as telas de conta não foram feitas. O banco da conta opcional ficou pronto e testado de uma fase anterior (`supabase/migrations/`), mas **não é usado pelo app** e não precisa ser aplicado em nenhum projeto. Para testar só o banco (precisa do Docker):

```bash
npm run test:banco
```

Detalhes em [supabase/README.md](supabase/README.md). Variáveis de ambiente em `.env.example` (sem valores reais).
