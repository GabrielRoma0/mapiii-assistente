# Mapiii · instruções para o Claude Code

Protótipo de estudo (FIAP, Global Solution CitizenTech, case Citizen Assist AI): "o mapa dos seus direitos". PWA em português do Brasil que orienta famílias de pessoas com deficiência (começando por quem usa cadeira de rodas) e cidadãos em geral sobre direitos e serviços públicos em São Paulo, sempre com fonte verificável, data de conferência e aviso de limitação. **Não é canal oficial.**

## Quem está usando e como ajudar

O projeto foi passado ao **Thor**, que vai fazer a parte humana (pesquisar fontes, criar contas, decidir, testar com pessoas). O seu papel é **explicar com detalhe o que fazer, em que ordem e por quê, preparar o que for código e conferir o resultado**.

Quando o Thor perguntar "o que eu faço agora?", "o que falta?" ou algo parecido:

1. Leia [PENDENCIAS.md](PENDENCIAS.md). Ali estão as tarefas humanas (H1 a H12), as de código (C1 a C6), a ordem e como conferir cada uma.
2. Confira o estado real antes de responder (não confie só no documento):

   ```bash
   npm run verificar
   ```

   ```bash
   node -e "console.log(require('./data/kb.json').length + ' fichas')"
   ```

   Rode também `npm run auditar-perguntas` e `npm run eval` quando a base já tiver fichas.
3. Diga qual é a **próxima** tarefa (uma só), por que ela vem agora, e explique o passo a passo em linguagem simples, com os comandos e os arquivos exatos. Ofereça fazer junto a parte que for código.
4. Ao terminar uma tarefa, rode os comandos de conferência e atualize o [PENDENCIAS.md](PENDENCIAS.md) (marque o que foi feito, com a data).

O que você **não** faz, mesmo se pedirem: inventar conteúdo de direito, valor, prazo, telefone, e-mail, link ou lei; criar conta ou entrar com senha em serviço externo; colocar token, senha ou chave secreta em arquivo do repositório, no `.env.local` ou no chat. Nesses casos, explique como o Thor faz e confira depois.

## Comandos

| Comando | Para quê |
|---|---|
| `npm install` | Instalar (Node 20.19+ ou 22.12+) |
| `npm run dev` | App em http://localhost:5173 (com a base vazia usa uma base fictícia de exemplo, só no dev) |
| `npm run verificar` | Tipos + testes + validação de `data/`. Tem que passar sempre |
| `npm test` | Testes (Vitest) |
| `npm run validar-kb` | Confere os JSON de `data/` |
| `npm run auditar-perguntas` | Confere se toda pergunta da triagem é usada pela base (falha com a base vazia) |
| `npm run eval` | Mede o acerto com os gabaritos e grava `eval/resultados.csv` |
| `npm run test:banco` | Testa as migrações do Supabase num Postgres descartável (Docker) |
| `npm run build` | Build estático em `dist/` |

## Como o código está organizado

- `data/`: base (`kb.json`), triagem (`perguntas.json`), domínios oficiais, valores de serviços e o exemplo do Embarque. Formatos em `data/README.md`.
- `src/core/`: lógica pura sem tela (busca própria, motor de regras, validação, checagem oficial, registro local, avaliação, reclamação). O mesmo código roda no app, nos testes e no `eval`.
- `src/ui/`: componentes do assistente e o personagem Mapi. `src/app/`: telas e rotas por `#`. `src/avaliacao/`: `avaliacao.html`.
- `supabase/`: migrações, testes de banco e Edge Functions (`onibus`; a lógica fica em `functions/_shared/`).
- `design-system/`: design system Mapiii v2.0. Use só os tokens, ícones e componentes dele. **Não redesenhe o personagem.**
- `eval/`, `docs/folha-de-teste.md`, `BACKLOG.md` (ideias, não implementar sem pedido).

Stack: Vite 8, React 18, TypeScript, Vitest 4, vite-plugin-pwa, tsx. Sem outras bibliotecas, sem analytics, sem cookies.

## Regras do projeto

- **Nada fora da base; nenhuma ficha sem fonte** (`fonte_url` https, `tipo_fonte`, `verificado_em`).
- **Nunca "você tem direito".** Só "Pode ter direito", "Talvez" ou "Provavelmente não se aplica", com o porquê.
- **Sem dados pessoais.** Não pedir nome, CPF, diagnóstico, idade exata, renda exata ou endereço. Respostas da triagem só em memória. Texto com CPF, telefone ou e-mail é recusado sem ser guardado.
- **Emergência de saúde:** só "Em emergência, ligue 192."
- **Aviso fixo** "Sou um protótipo de estudo, não um canal oficial. Confirme nas fontes indicadas." em todas as telas.
- **Flags desligadas por padrão:** `VITE_EMBARQUE_ATIVO` (Embarque garantido) e a camada de IA (só quando pedido explicitamente).
- **Segredos só em Edge Function** (`SPTRANS_TOKEN`, service_role, chave da Anthropic).
- **Acessibilidade:** teclado, foco visível, ARIA, `aria-live`, contraste 4,5:1 nos temas claro e escuro, alvos de 48 px, texto de 16 px ou mais, sem rolagem lateral em 320 px.
- Toda mudança de lógica vem com teste. Antes de dizer que terminou, rode `npm run verificar`.
