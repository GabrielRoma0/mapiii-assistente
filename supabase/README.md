# Supabase (conta opcional)

O app funciona inteiro **sem conta**. A conta só guarda o perfil (respostas da triagem) e o histórico entre aparelhos, depois do termo de consentimento.

## Migrações

`migrations/20261105120000_conta_opcional.sql` cria:

| Tabela | O que guarda | Quem lê e escreve |
|---|---|---|
| `perfis` | `user_id`, `respostas` (jsonb só com ids e valores de `data/perguntas.json`), `consentimento_em` (data carimbada pelo banco), `termo_versao`, `atualizado_em` | Cada pessoa, só a própria linha. |
| `historico` | `user_id`, `tema`, `fichas_ids`, `criado_em`. **Nunca o texto da pergunta.** | Cada pessoa, só as próprias linhas; só grava depois do consentimento (precisa ter perfil). Não dá para alterar, só apagar. |
| `feedback` | `tema`, `ajudou`, `segundos`, `criado_em`. **Sem `user_id`.** | Qualquer um envia; ninguém lê pela API (só pelo painel). |

- RLS ligado nas três tabelas, com `(select auth.uid())` nas políticas.
- Privilégios mínimos: o padrão do Supabase (`ALL` para `anon` e `authenticated`) é revogado e cada papel recebe só o necessário, coluna por coluna nas escritas. O aparelho não escolhe datas nem `user_id`.
- Checagens no banco recusam texto livre: `respostas` só aceita chaves `p_...` e valores em minúsculas; `tema` e `fichas_ids` só aceitam ids.
- Apagar a pessoa em `auth.users` apaga perfil e histórico em cascata.

## Testar sem Supabase

```bash
npm run test:banco
```

Sobe um Postgres descartável no Docker (`postgres:16-alpine`), cria uma imitação mínima do Supabase (`tests/00_imitacao_supabase.sql`: papéis, `auth.users`, `auth.uid()` e os privilégios padrão), aplica as migrações e roda `tests/10_rls.sql`. Cada verificação imprime `ok ...`; a primeira que falhar para tudo.

## Aplicar num projeto Supabase

Ainda não foi aplicado em nenhum projeto. Quando houver projeto:

1. Copie `.env.example` para `.env.local` e preencha `VITE_SUPABASE_URL` e `VITE_SUPABASE_PUBLISHABLE_KEY`.
2. Aplique a migração (Supabase CLI `supabase db push`, ou cole o arquivo no SQL Editor).
3. No painel, configure o Auth: URL do site e de redirecionamento, SMTP próprio (o e-mail padrão só entrega para a equipe do projeto) e os modelos de e-mail.

## Edge Function `onibus` (Embarque Garantido)

Consulta a API Olho Vivo da SPTrans pelo servidor, para o token nunca ir ao navegador. O que foi confirmado na documentação da API está em [../data/README.md](../data/README.md).

- `functions/onibus/index.ts`: entrada Deno; só lê os segredos e chama a lógica.
- `functions/_shared/onibus-servidor.ts`: a lógica (testada no Node com a API simulada, em `tests/onibus-servidor.test.ts`).
- `functions/_shared/embarque.ts`: regras puras usadas também pelo app.

**Pedido** (só `POST`, JSON, até 1 KB):

```json
{ "acao": "linhas", "termo": "8000" }
{ "acao": "veiculos", "codigo": 1273 }
{ "acao": "paradas", "termo": "Paulista" }
{ "acao": "previsao", "codigo": 340015329 }
```

Só essas quatro ações e essas chaves. Nenhuma URL vem do app. Os termos são validados de novo no servidor: linha com letras, números e hífen (1 a 10 caracteres); ponto com letras, números, espaço, ponto, barra e hífen (2 a 40 caracteres).

**Resposta:** `{ ok: true, acao: "linhas", linhas }`, `{ ok: true, acao: "veiculos", veiculos, horaReferencia, consultadoEm }`, `{ ok: true, acao: "paradas", paradas }`, `{ ok: true, acao: "previsao", parada, linhas, horaReferencia, consultadoEm }` ou `{ ok: false, erro, mensagem }`, com `erro` em `termo_invalido`, `linha_inexistente`, `sem_veiculos`, `limite`, `tempo_esgotado` ou `api_fora`. Latitude e longitude dos veículos e dos pontos são descartadas.

**Proteções:** login reaproveitado (refaz uma vez se a API recusar a sessão), cache de 15 s por linha, ponto e busca, limite de pedidos por minuto por IP (o IP vira um hash em memória, com sal aleatório, e não é guardado), tempo limite de 6 s por chamada, logs só com códigos de situação (sem IP, termo nem token). O limite e o cache valem por instância da função: com várias instâncias ao mesmo tempo, o limite real pode ser maior.

**Publicar** (quando houver projeto Supabase e token da SPTrans):

```bash
supabase secrets set SPTRANS_TOKEN=coloque-aqui-o-token
```

```bash
supabase functions deploy onibus
```

Por padrão o Supabase exige o cabeçalho com a chave publicável nas chamadas da função; o app manda `VITE_SUPABASE_PUBLISHABLE_KEY`.

**A confirmar com o token real:** a documentação não diz como a sessão continua depois do login. A função guarda os cookies devolvidos pelo login e os envia nas consultas seguintes. Se a API usar outro mecanismo, só `onibus-servidor.ts` muda.
