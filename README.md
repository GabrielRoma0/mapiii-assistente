# Mapiii · o mapa dos seus direitos

Protótipo de estudo (FIAP, Global Solution CitizenTech, case **Citizen Assist AI**). Um assistente digital introdutório que orienta famílias de pessoas com deficiência, começando por quem usa cadeira de rodas, e cidadãos em geral sobre direitos e serviços públicos em São Paulo. Toda resposta vem com fonte verificável, data de conferência e aviso de limitação.

> **Sou um protótipo de estudo, não um canal oficial. Confirme nas fontes indicadas.**

O mapa colaborativo de calçadas é só visão de futuro e não está implementado.

> **Pegando o projeto agora?** Leia [PENDENCIAS.md](PENDENCIAS.md): o que está pronto, o que falta, o que é parte humana e em que ordem.

## O que o app faz

| Tela | O que faz |
|---|---|
| **Escolher minha situação** | Triagem em passos (só as perguntas que a base usa, sempre com "Prefiro não responder" e "Por que perguntamos isso?"). Um motor de regras classifica cada direito como **Pode ter direito**, **Talvez** ou **Provavelmente não se aplica**, explicando o porquê em uma frase. Nunca diz "você tem direito". |
| **Detalhe de um direito** | O que levar (checklist), onde ir, prazo típico, como pedir, "Se negarem", fonte e limitação. |
| **Fazer uma pergunta** | Busca própria, sem biblioteca externa, na base de conhecimento. Abaixo de um limite configurável responde "Não encontrei isso na minha base" e indica o canal oficial. Recusa dados pessoais, pedidos de conselho jurídico ou médico e, em emergência de saúde, responde só "Em emergência, ligue 192." |
| **Conferir se é oficial** | A pessoa cola um link ou um valor cobrado. Sem nenhuma requisição de rede, o app responde **Oficial**, **Suspeito** ou **Não sei**, com o motivo. |
| **Sobre e fontes** | Todas as fontes da base com data de verificação, como o acerto é medido, o que o assistente não faz, privacidade e escolha de tema. |
| **`avaliacao.html`** | Números do registro local anônimo e exportação em CSV. |
| **Embarque garantido** (opcional, desligado por padrão) | Quantos ônibus de uma linha estão acessíveis agora, segundo a SPTrans, com modo exemplo e Reclamação pronta. Veja a seção própria abaixo. |

O app funciona sem internet depois da primeira visita e pode ser instalado (PWA).

## Privacidade

- Sem login, sem cookies de rastreamento, sem analytics e sem envio de dados para nenhum servidor.
- As respostas da triagem ficam só na memória da página. Não vão para a URL nem para o armazenamento do navegador.
- Texto com CPF, telefone ou e-mail é recusado sem ser processado nem guardado.
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

- **A base ainda está vazia.** O app de produção só mostra direitos depois que as entradas com fonte forem coladas em `data/kb.json`. Também estão vazios `servicos-valores.json` e o grupo `teste` dos gabaritos.
- A lista das 32 subprefeituras em `data/perguntas.json` precisa ser conferida com a fonte da Prefeitura.
- "Conferir se é oficial" só compara com listas locais: não garante nada, e a tela diz isso.
- O registro de uso fica só em cada aparelho. Para juntar números de várias pessoas, cada uma precisa exportar o CSV.
- O desenho do personagem não tem versão própria para o tema escuro (lacuna do design system).
- Prompt de instalação do PWA ainda não testado num celular.
- Embarque: a API real da SPTrans ainda não foi chamada (falta o token); só o modo exemplo e o simulador foram testados. O "Copiar texto" da reclamação só foi testado no caminho de falha (o texto fica selecionado).

## Embarque garantido (diferencial, desligado por padrão)

A pessoa digita o número ou o nome da linha de ônibus e vê quantos veículos em operação são acessíveis agora, segundo a API Olho Vivo da SPTrans, para decidir se vale esperar no ponto. **Nunca usa a localização da pessoa:** a busca é só pela linha. O que foi confirmado na documentação da API está em [data/README.md](data/README.md).

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

1. **Modo exemplo (Plano B):** com a flag ligada, abra o Embarque e toque em **"Ver exemplo"**. Os dados vêm de `data/embarque-exemplo.json` (linhas fictícias `EX01`, `EX02`, `EX03`) e toda tela desse modo mostra o selo **"EXEMPLO, não é dado real"**. Funciona offline e serve para o vídeo se a API falhar no dia.
2. **Simulador da SPTrans (só `npm run dev`):** roda a lógica real da Edge Function contra uma SPTrans fictícia. No `.env.local`:

   ```
   VITE_EMBARQUE_ATIVO=true
   VITE_SUPABASE_URL=http://localhost:5173/__simulador
   VITE_SUPABASE_PUBLISHABLE_KEY=simulador
   ```

   Busque `8000` (dois sentidos, um com dado desatualizado), `999` (sem veículos), `vazia` (linha inexistente), `fora` (API fora do ar), `limite` (muitos pedidos) ou `lento` (tempo esgotado). O simulador não entra no build.

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

Na primeira consulta real, confira duas coisas que a documentação da SPTrans não deixa claras: se a sessão continua depois do login (a função reenvia os cookies do login) e se o texto do sentido da linha está certo. Detalhes da função, limites e cache em [supabase/README.md](supabase/README.md).

## Conta opcional (Fase 2, em andamento)

O banco já está pronto e testado, mas **ainda não foi aplicado em nenhum projeto Supabase** e o app ainda não usa conta. Tabelas, RLS e como testar sem Supabase (só precisa do Docker):

```bash
npm run test:banco
```

Detalhes em [supabase/README.md](supabase/README.md). Variáveis de ambiente em `.env.example` (sem valores reais).

## Próximos passos

Ideias para depois do MVP, com esforço, risco e dependência de cada uma: [BACKLOG.md](BACKLOG.md).


- Fase 2: telas de conta (o botão principal continua sendo "Continuar sem conta"), consentimento, histórico, exportar e apagar dados.
- Camada de IA **desligada por padrão**: uma Edge Function só reformula em linguagem simples o trecho da base escolhido, com validador no navegador. Só será ligada quando pedido.
