# O que falta no Mapiii (e quem faz)

Documento de passagem de bastão. Diz o que já está pronto, o que falta, **o que só uma pessoa pode fazer (parte humana, com o Thor)** e o que o Claude Code pode fazer depois. Cada tarefa tem: por que importa, **quando** fazer (o que precisa vir antes), o passo a passo e como conferir que deu certo.

> Para o Claude Code de quem pegar o projeto: leia também o [CLAUDE.md](CLAUDE.md). Quando perguntarem "o que eu faço agora?", siga a seção [Ordem recomendada](#ordem-recomendada) e confira o estado com os comandos de [Como saber onde estamos](#como-saber-onde-estamos).

Última atualização: 05/11/2026.

---

## 1. Onde o projeto está

**Pronto e testado** (236 testes automáticos, mais 34 verificações de banco):

| Parte | O que faz | Onde |
|---|---|---|
| App (MVP) | Início, "Escolher minha situação" (triagem + Rota dos Direitos), detalhe de cada direito, "Fazer uma pergunta", "Conferir se é oficial", "Sobre e fontes", 404, aviso fixo de protótipo | `src/app/` |
| Núcleo | Busca própria, motor de regras, validação (emergência 192, dado pessoal, conselho jurídico/médico), checagem de link e valor, registro local anônimo, avaliação | `src/core/` |
| PWA | Instalável, funciona sem internet depois da 1ª visita | `vite.config.ts`, `public/icons/` |
| Avaliação | `npm run eval` com gabaritos; `avaliacao.html` com números e CSV | `eval/`, `src/avaliacao/` |
| Banco (Fase 2, F2.2) | Tabelas `perfis`, `historico`, `feedback` com RLS, testadas num Postgres local | `supabase/migrations/`, `supabase/tests/` |
| Embarque garantido (Fase 3) | Tela atrás da flag, Edge Function `onibus`, modo exemplo, Reclamação pronta, indicador de tempo | `src/app/telas/Embarque.tsx`, `supabase/functions/` |

**O que impede a entrega hoje:** a base de conhecimento (`data/kb.json`) está **vazia**. Sem ela, o app publicado não mostra nenhum direito. Em `npm run dev` aparece uma base fictícia de exemplo, só para ver as telas; ela não vai para o build.

---

## 2. Ordem recomendada

```
H1 Base de conhecimento ─┬─> H2 Canais oficiais ──> H5 Gabaritos ──> H6 Especialista ──> H9 Teste com pessoas ──> H11 Vídeo e entrega
                         └─> H3 Valores de serviços
H4 Subprefeituras (a qualquer momento)
H10 Publicar o site (assim que H1 tiver as primeiras fichas)
H7 Supabase ──┬─> C1–C5 (código da conta, Claude Code) ──> H9
              └─> H8 Token SPTrans (só se o Embarque for usado com dado real)
H12 Decisões (antes de H10 e H11)
```

**Prioridade:** H1 → H2 → H5 → H10 → H9 → H11 são o MVP. H7, H8 e o código da Fase 2 (C1–C5) são diferenciais: só se der tempo, e nada deles pode atrapalhar o MVP.

---

## 3. Parte humana (Thor)

Coisas que exigem pesquisa em fonte oficial, conta em serviço externo, decisão ou teste com gente. O Claude Code pode **explicar, preparar e conferir**, mas **não pode** inventar conteúdo, criar conta, entrar com senha nem guardar segredo no repositório.

### H1. Preencher a base de conhecimento (`data/kb.json`) — PRIMEIRO

- **Por que:** o app só responde com o que está na base. Sem fichas, nada aparece. É o que mais pesa na nota.
- **Quando:** agora. Todo o resto depende disso.
- **Passo a passo:**
  1. Leia [data/README.md](data/README.md): campos, exemplo e como escrever `condicoes`.
  2. Escolha os direitos e serviços do recorte (pessoa que usa cadeira de rodas em SP). Sugestões do design: Bilhete Único Especial, BPC, Atende+, isenção de IPVA, Central 156. **Confirme cada um na fonte oficial**; não use a sugestão como fato.
  3. Para cada ficha: abra a fonte oficial, copie só o que está lá, em linguagem simples. Preencha `fonte_url` (https), `tipo_fonte` (`oficial`, `secundaria` ou `desatualizada`) e `verificado_em` com a data em que você abriu a fonte.
  4. Escreva as `condicoes` usando os ids de `data/perguntas.json` (ex.: `{"todas": [{"campo": "p_objetivo", "em": ["transporte"]}]}`).
  5. Escreva 2 a 4 `perguntas_exemplo` do jeito que uma pessoa perguntaria e as `palavras_chave`.
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
- **Claude Code ajuda a:** montar o JSON a partir do texto que você colar da fonte, apontar erro de formato, sugerir `perguntas_exemplo`. **Não pode:** escrever o conteúdo do direito sem você trazer a fonte.

### H2. Canais oficiais (fichas de serviço)

- **Por que:** "Não encontrei isso na minha base" precisa indicar um canal oficial, e "Onde enviar" da Reclamação pronta só mostra canais que estão na base. Sem eles, essas partes ficam vazias ou desabilitadas.
- **Quando:** depois das primeiras fichas de H1.
- **Passo a passo:**
  1. Crie fichas `tipo: "servico"` para os canais (ex.: Central 156 da Prefeitura, Ouvidoria da SPTrans), com `onde.texto`, `onde.link` e fonte **oficial**.
  2. Em `src/core/config.ts`, ponha o `id` do canal geral em `canalOficialId` e os ids dos canais de reclamação em `canaisReclamacaoIds`.
- **Como conferir:** `npm test`; no app, faça uma pergunta fora da base e veja o canal aparecer; com o Embarque ligado, abra a reclamação e veja "Onde enviar". Uma ficha com mais de 6 meses de `verificado_em` sai de "Onde enviar" (aparece como desatualizada).

### H3. Valores oficiais de serviços (`data/servicos-valores.json`)

- **Por que:** "Conferir se é oficial" compara o valor cobrado com o oficial. Vazio, toda cobrança dá "Não sei".
- **Quando:** depois de H1 (para ligar com `kb_id`).
- **Passo a passo:** formato em [data/README.md](data/README.md), seção "Conferir se é oficial". Cada item precisa de fonte e data. `valor_oficial` em reais (0 = gratuito). Escreva `servico` com artigo ("a segunda via do cartão").
- **Como conferir:** `npm run validar-kb`; no app, cole "cobraram R$ 50 para liberar o ..." e veja o resultado.

### H4. Conferir a lista das 32 subprefeituras

- **Por que:** foi escrita de memória.
- **Quando:** a qualquer momento.
- **Passo a passo:** compare `p_subprefeitura` em `data/perguntas.json` com a lista oficial da Prefeitura de São Paulo. Corrija nomes, junte ou separe o que mudou.
- **Como conferir:** `npm test` (o validador de perguntas roda junto). Observação: a pergunta só aparece na triagem se alguma ficha usar `p_subprefeitura`.

### H5. Gabaritos da avaliação

- **Por que:** o `npm run eval` mede o acerto. O grupo `teste` é o número honesto para o relatório, então precisa ser escrito **por quem não ajustou a base**.
- **Quando:** depois de H1. Escreva as perguntas do grupo `teste` **antes** de olhar as `perguntas_exemplo`.
- **Passo a passo:** formatos em [eval/README.md](eval/README.md).
  - `eval/gabarito_perguntas.csv`: `pergunta,id_esperado,grupo`. Já tem 12 casos `RECUSAR`. Faltam perguntas com `id_esperado` reais, nos grupos `ajuste` e `teste`.
  - `eval/gabarito_cenarios.json`: situações com as respostas da triagem e os direitos que deveriam aparecer como "Pode ter direito".
- **Como conferir:**

  ```bash
  npm run eval
  ```

  Os números vão para o terminal e para `eval/resultados.csv`.

### H6. Revisão por especialista (indicador do case)

- **Por que:** "Respostas conferidas por especialistas numa amostra" é um dos três indicadores (tela "Sobre e fontes").
- **Quando:** depois de H1 e H5.
- **Passo a passo:** peça a alguém da área (assistente social, Defensoria, associação) para ler uma amostra das fichas e das respostas. Anote na [folha de teste](docs/folha-de-teste.md), seção 1.

### H7. Supabase (só para a conta opcional e o Embarque real)

- **Por que:** a Fase 2 (conta opcional) e a Edge Function `onibus` precisam de um projeto Supabase.
- **Quando:** só se for fazer a Fase 2 ou o Embarque com dado real. O MVP não precisa.
- **Passo a passo:**
  1. Crie um projeto em https://supabase.com (a conta gratuita permite 2 projetos ativos por organização).
  2. Copie `.env.example` para `.env.local` e preencha `VITE_SUPABASE_URL` e `VITE_SUPABASE_PUBLISHABLE_KEY` (Project Settings → API). **A chave secreta (service_role) nunca vai para o `.env.local` nem para o git.**
  3. Aplique a migração: cole `supabase/migrations/20261105120000_conta_opcional.sql` no SQL Editor, ou use a Supabase CLI (`supabase db push`).
  4. No painel, em Authentication: configure Site URL e Redirect URLs com o endereço onde o site for publicado (H10).
  5. Configure um **SMTP próprio** (Authentication → Emails → SMTP). O e-mail padrão do Supabase só entrega para a equipe do projeto. O mais simples: Gmail com "senha de app" (`smtp.gmail.com`, porta 465).
- **Como conferir:** `npm run test:banco` (precisa de Docker) testa a migração localmente. No projeto, a tabela `perfis` deve aparecer com RLS ligado.

### H8. Token da SPTrans (só para o Embarque com dado real)

- **Por que:** a API Olho Vivo exige um token. Sem ele, o Embarque funciona só no modo exemplo.
- **Quando:** depois de H7, e só se o Embarque for mostrado com dado real.
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

  4. Ligue a flag (`VITE_EMBARQUE_ATIVO=true` no `.env.local`) e teste uma linha real.
  5. **Confira e conte ao Claude Code:** (a) se a consulta funciona depois do login (a função reenvia os cookies do login; a documentação não explica como a sessão continua); (b) se o texto do sentido da linha está certo (ex.: "PCA.RAMOS DE AZEVEDO → TERMINAL LAPA" no sentido 1).
- **Como conferir:** a tela mostra "X de Y veículos em operação são acessíveis" com a hora da consulta. Detalhes em [supabase/README.md](supabase/README.md).

### H9. Testes com pessoas e testes manuais

- **Por que:** os indicadores do case e o do Embarque saem daqui; e há duas coisas que o navegador do Claude Code não consegue testar.
- **Quando:** depois de H1, H2 e H10 (com o site publicado).
- **Passo a passo:**
  1. Siga a [folha de teste](docs/folha-de-teste.md): participantes só por código, sem nome.
  2. Instale o PWA num celular de verdade (Android: menu → "Instalar app"; iPhone: Compartilhar → "Adicionar à Tela de Início") e abra sem internet.
  3. Num navegador comum, com o Embarque ligado, gere uma reclamação e toque em "Copiar texto": o texto deve ir para a área de transferência.
  4. No fim, baixe os CSVs em `avaliacao.html`.

### H10. Publicar o site

- **Quando:** assim que H1 tiver as primeiras fichas (dá para publicar de novo depois).
- **Passo a passo:**
  1. `npm run build`.
  2. Publique a pasta `dist/` numa hospedagem estática com `https` (Netlify, Vercel, Cloudflare Pages ou GitHub Pages). As rotas usam `#`, então não precisa de redirecionamento.
  3. Decida a flag do Embarque **antes** do build (H12): ela é lida no build.
- **Como conferir:** abra o endereço no celular, navegue, desligue a internet e recarregue.

### H11. Vídeo e entrega

- **Quando:** por último.
- **Passo a passo:** grave o fluxo principal (Início → situação → rota → detalhe → pergunta → conferir). Se mostrar o Embarque e a API falhar, use "Ver exemplo" (o selo "EXEMPLO, não é dado real" aparece em toda tela). O mapa de calçadas entra **só** como visão de futuro (`design-system/Mapiii Visao de Futuro.dc.html`), nunca como funcionalidade.

### H12. Decisões que são do time

| Decisão | Opções | Onde muda |
|---|---|---|
| Embarque na entrega? | Ligado (com dado real ou só exemplo) ou desligado | `VITE_EMBARQUE_ATIVO` no build |
| Fazer a Fase 2 (conta)? | Sim (precisa de H7) ou deixar só o banco pronto | — |
| Ligar a IA de reformulação? | Só quando pedido explicitamente; desligada por padrão | ver [BACKLOG.md](BACKLOG.md), item 5 |
| Repositório público ou privado? | **Decidido: público** (05/11/2026). Por isso nenhum segredo pode entrar no git | — |

---

## 4. Parte de código (o Claude Code faz)

Só depois das tarefas humanas indicadas. Peça uma de cada vez e confira cada uma antes da próxima.

| # | Tarefa | Precisa antes | Pronto quando |
|---|---|---|---|
| C1 | **F2.3 Telas de conta:** Boas-vindas ("Continuar sem conta" é o botão principal), Entrar, Criar conta (e-mail e senha, ou código/link por e-mail), Recuperar senha. Erros sem revelar se o e-mail existe. `supabase-js` em versão fixa. | H7 | Dá para usar o app inteiro sem conta; com conta, entra e sai |
| C2 | **F2.4 Consentimento e perfil:** termo curto com aceite e data (o banco carimba), "Salvar meu perfil" (respostas sensíveis só com essa marca), exportar dados em JSON, Edge Function `apagar-conta` (apaga em cascata) | C1 | Exportar devolve só os dados da pessoa; apagar remove tudo |
| C3 | **F2.5 Histórico** (só logado, sem o texto da pergunta) | C2 | Histórico mostra temas e fichas vistas |
| C4 | **F2.6 IA de reformulação**, desligada por padrão: Edge Function `responder`, validador no app, selos "Reformulado por IA..." e "texto da base, sem IA" | H7 e decisão H12 | Validador recusa id não enviado, URL, número, valor, lei ou prazo fora das fichas e "você tem direito" |
| C5 | **F2.7–F2.8:** perguntas armadilha no `eval/` e README com o fluxo completo da conta | C1–C4 | `npm run eval` mede recusa correta, resposta com fonte e rejeições do validador |
| C6 | Ajustes depois do primeiro teste real da SPTrans (sessão e sentido) | H8 | Consulta real funciona e o sentido está certo |

---

## 5. Regras que não podem ser quebradas

- **Nada fora da base, nenhuma ficha sem fonte.** Não inventar direito, valor, prazo, telefone, e-mail, link ou lei.
- **Nunca dizer "você tem direito".** Só "Pode ter direito", "Talvez" ou "Provavelmente não se aplica".
- **Sem dados pessoais:** não pedir nome, CPF, diagnóstico, idade exata ou renda exata. Respostas da triagem só em memória (nem URL, nem armazenamento), a não ser com conta e "Salvar meu perfil".
- **Sem login obrigatório, sem cookies de rastreamento, sem analytics.**
- **Não se apresentar como canal oficial.** O aviso fixo de protótipo fica em todas as telas.
- **Emergência de saúde:** só "Em emergência, ligue 192."
- **Segredos** (service_role, `SPTRANS_TOKEN`, chave da Anthropic) só como segredo de Edge Function. Nunca no git, no `.env.local` ou no navegador.
- **Embarque:** nunca usar a localização da pessoa; "acessível" é o que a SPTrans informa (não prometer rampa ou elevador).
- **Design:** só tokens, ícones e componentes do `design-system/`; o personagem Mapi não é redesenhado.

---

## 6. Como saber onde estamos

Rode estes comandos para conferir o estado antes de cada tarefa:

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
- `npm run test:banco` (precisa de Docker) testa as migrações do Supabase.

Quantas fichas a base tem:

```bash
node -e "console.log(require('./data/kb.json').length + ' fichas')"
```
