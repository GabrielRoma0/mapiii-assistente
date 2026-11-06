-- Testes de RLS e privilégios da migração conta_opcional. Rodam como os papéis do Supabase.
-- Cada verificação imprime "ok ..." ou para tudo com "FALHOU: ...".
\set ON_ERROR_STOP on

insert into auth.users (id, email) values
  ('00000000-0000-0000-0000-00000000000a', 'a@teste.invalid'),
  ('00000000-0000-0000-0000-00000000000b', 'b@teste.invalid');

-- ---------- anônimo ----------
set role anon;
select set_config('request.jwt.claim.sub', '', false);
select teste.deve_falhar($$select * from public.perfis$$, 'permission denied', 'anon não lê perfis');
select teste.deve_falhar($$select * from public.historico$$, 'permission denied', 'anon não lê histórico');
select teste.deve_falhar($$insert into public.perfis (user_id, termo_versao) values ('00000000-0000-0000-0000-00000000000a', '2026-11-v1')$$, 'permission denied', 'anon não cria perfil');
insert into public.feedback (tema, ajudou, segundos) values ('transporte', true, 3.4);
select teste.afirmar(true, 'anon envia feedback anônimo');
select teste.deve_falhar($$select * from public.feedback$$, 'permission denied', 'anon não lê feedback');
select teste.deve_falhar($$insert into public.feedback (tema, ajudou, segundos, criado_em) values ('transporte', true, 1, '2000-01-01')$$, 'permission denied', 'feedback não aceita data escolhida pelo aparelho');
select teste.deve_falhar($$insert into public.feedback (tema, ajudou, segundos) values ('minha pergunta inteira', true, 1)$$, 'violates check constraint', 'feedback recusa tema com texto livre');
select teste.deve_falhar($$insert into public.feedback (tema, ajudou, segundos) values ('transporte', true, -1)$$, 'violates check constraint', 'feedback recusa segundos negativos');
reset role;

-- ---------- pessoa A ----------
set role authenticated;
select set_config('request.jwt.claim.sub', '00000000-0000-0000-0000-00000000000a', false);

select teste.deve_falhar($$insert into public.historico (tema, fichas_ids) values ('transporte', '{exemplo-a}')$$, 'row-level security', 'sem consentimento (sem perfil) não grava histórico');
select teste.deve_falhar($$insert into public.perfis (user_id, termo_versao, consentimento_em) values ('00000000-0000-0000-0000-00000000000a', '2026-11-v1', '2000-01-01')$$, 'permission denied', 'aparelho não escolhe a data do consentimento');
select teste.deve_falhar($$insert into public.perfis (user_id, termo_versao) values ('00000000-0000-0000-0000-00000000000b', '2026-11-v1')$$, 'row-level security', 'A não cria perfil em nome de B');
select teste.deve_falhar($$insert into public.perfis (user_id, termo_versao, respostas) values ('00000000-0000-0000-0000-00000000000a', '2026-11-v1', '{"nome": "Maria"}')$$, 'violates check constraint', 'respostas recusam chave que não é p_...');
select teste.deve_falhar($$insert into public.perfis (user_id, termo_versao, respostas) values ('00000000-0000-0000-0000-00000000000a', '2026-11-v1', '{"p_quem": "Minha mãe Maria"}')$$, 'violates check constraint', 'respostas recusam texto livre');
select teste.deve_falhar($$insert into public.perfis (user_id, termo_versao, respostas) values ('00000000-0000-0000-0000-00000000000a', '2026-11-v1', '{"p_renda": 1200}')$$, 'violates check constraint', 'respostas recusam número (renda exata)');
select teste.deve_falhar($$insert into public.perfis (user_id, termo_versao) values ('00000000-0000-0000-0000-00000000000a', 'aceito')$$, 'violates check constraint', 'versão do termo tem formato fixo');

insert into public.perfis (user_id, termo_versao, respostas)
values ('00000000-0000-0000-0000-00000000000a', '2026-11-v1', '{"p_quem": "filho_filha", "p_necessidade": ["mobilidade"]}');
select teste.afirmar((select consentimento_em > now() - interval '1 minute' from public.perfis), 'A cria o próprio perfil com o consentimento datado pelo banco');

insert into public.historico (tema, fichas_ids) values ('transporte', '{exemplo-a,exemplo-b}');
select teste.afirmar((select user_id = '00000000-0000-0000-0000-00000000000a' from public.historico), 'com consentimento, A grava histórico (user_id vem da sessão)');
select teste.deve_falhar($$insert into public.historico (tema, fichas_ids) values ('Qual o valor do BPC?', '{}')$$, 'violates check constraint', 'histórico recusa o texto da pergunta no lugar do tema');
select teste.deve_falhar($$insert into public.historico (tema, fichas_ids) values ('transporte', '{"id com espaço"}')$$, 'violates check constraint', 'histórico recusa id de ficha fora do formato');
select teste.deve_falhar($$insert into public.historico (user_id, tema) values ('00000000-0000-0000-0000-00000000000b', 'transporte')$$, 'permission denied', 'A não escolhe o user_id do histórico');
select teste.deve_falhar($$update public.historico set tema = 'escola'$$, 'permission denied', 'histórico não pode ser alterado, só apagado');
reset role;

-- Consentimento: update comum mantém a data; nova versão do termo carimba de novo.
select pg_sleep(0.05);
set role authenticated;
select set_config('request.jwt.claim.sub', '00000000-0000-0000-0000-00000000000a', false);
create temporary table antes as select consentimento_em, atualizado_em from public.perfis;
update public.perfis set respostas = '{"p_quem": "eu"}';
select teste.afirmar((select p.consentimento_em = a.consentimento_em and p.atualizado_em > a.atualizado_em from public.perfis p, antes a), 'alterar respostas mantém a data do consentimento e atualiza atualizado_em');
update public.perfis set termo_versao = '2026-12-v2';
select teste.afirmar((select p.consentimento_em > a.consentimento_em from public.perfis p, antes a), 'aceitar nova versão do termo grava nova data de consentimento');
select teste.deve_falhar($$update public.perfis set consentimento_em = '2000-01-01'$$, 'permission denied', 'A não altera a data do consentimento à mão');
reset role;

-- ---------- pessoa B não vê nada de A ----------
set role authenticated;
select set_config('request.jwt.claim.sub', '00000000-0000-0000-0000-00000000000b', false);
insert into public.perfis (user_id, termo_versao) values ('00000000-0000-0000-0000-00000000000b', '2026-11-v1');
insert into public.historico (tema) values ('beneficio_financeiro');
select teste.afirmar((select count(*) = 1 from public.perfis), 'B só enxerga o próprio perfil');
select teste.afirmar((select count(*) = 1 and bool_and(tema = 'beneficio_financeiro') from public.historico), 'B só enxerga o próprio histórico');
with mudou as (update public.perfis set respostas = '{}' where user_id = '00000000-0000-0000-0000-00000000000a' returning 1)
select teste.afirmar((select count(*) = 0 from mudou), 'B não altera o perfil de A');
with apagou as (delete from public.historico where user_id = '00000000-0000-0000-0000-00000000000a' returning 1)
select teste.afirmar((select count(*) = 0 from apagou), 'B não apaga o histórico de A');
select teste.deve_falhar($$select * from public.feedback$$, 'permission denied', 'quem tem conta também não lê o feedback');
reset role;

-- ---------- apagar a conta apaga tudo em cascata ----------
delete from auth.users where id = '00000000-0000-0000-0000-00000000000a';
select teste.afirmar((select count(*) = 0 from public.perfis where user_id = '00000000-0000-0000-0000-00000000000a'), 'apagar a conta de A apaga o perfil');
select teste.afirmar((select count(*) = 0 from public.historico where user_id = '00000000-0000-0000-0000-00000000000a'), 'apagar a conta de A apaga o histórico');
select teste.afirmar((select count(*) = 1 from public.perfis) and (select count(*) = 1 from public.historico), 'os dados de B continuam');
select teste.afirmar((select count(*) = 1 from public.feedback), 'o feedback anônimo não depende de conta');

-- ---------- estrutura ----------
select teste.afirmar(
  (select bool_and(relrowsecurity) from pg_class where oid in ('public.perfis'::regclass, 'public.historico'::regclass, 'public.feedback'::regclass)),
  'RLS ligado nas três tabelas');
select teste.afirmar(
  not exists (
    select 1 from pg_constraint c
    join pg_attribute a on a.attrelid = c.conrelid and a.attnum = any (c.conkey)
    where c.contype = 'f' and c.connamespace = 'public'::regnamespace
      and not exists (select 1 from pg_index i where i.indrelid = c.conrelid and a.attnum = i.indkey[0])
  ),
  'toda chave estrangeira tem índice');
select teste.afirmar(
  not exists (select 1 from information_schema.columns where table_schema = 'public' and table_name = 'feedback' and column_name = 'user_id'),
  'feedback não tem user_id');
