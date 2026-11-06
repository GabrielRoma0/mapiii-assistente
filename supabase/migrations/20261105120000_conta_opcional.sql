-- Mapiii · conta opcional (Fase 2, F2.2)
--
-- O app funciona inteiro sem conta. A conta só serve para guardar o perfil (respostas da triagem)
-- e o histórico entre aparelhos, depois de um termo de consentimento.
--
-- Tabelas:
--   perfis     uma linha por pessoa: respostas da triagem (jsonb), data e versão do consentimento.
--   historico  temas e ids das fichas vistas. NUNCA o texto da pergunta.
--   feedback   "Esta resposta ajudou?" anônimo: sem user_id, ninguém lê pela API.
--
-- RLS: cada pessoa só lê e altera as próprias linhas. Apagar a pessoa em auth.users apaga tudo em cascata.
-- Privilégios mínimos: o Supabase dá ALL para anon e authenticated por padrão; aqui isso é revogado
-- e cada papel recebe só o que precisa, coluna por coluna nas escritas.

-- ---------------------------------------------------------------------------
-- Validações (funções imutáveis, usadas nos CHECK). Ficam num schema que a API não expõe.
-- ---------------------------------------------------------------------------
create schema if not exists privado;
revoke all on schema privado from public;
grant usage on schema privado to anon, authenticated;

-- Respostas da triagem: só chaves "p_..." e valores texto ou lista de textos, em minúsculas (os "valor" de data/perguntas.json).
create or replace function privado.respostas_validas(r jsonb)
returns boolean
language sql
immutable
set search_path = ''
as $$
  select jsonb_typeof(r) = 'object'
    and pg_catalog.octet_length(r::text) <= 4096
    and not exists (
      select 1
      from pg_catalog.jsonb_each(r) as e(chave, valor)
      where e.chave !~ '^p_[a-z0-9_]{1,40}$'
         or not (
           (jsonb_typeof(e.valor) = 'string' and (e.valor #>> '{}') ~ '^[a-z0-9_]{1,60}$')
           or (
             jsonb_typeof(e.valor) = 'array'
             and jsonb_array_length(e.valor) between 1 and 20
             and not exists (
               select 1 from pg_catalog.jsonb_array_elements(e.valor) as v(item)
               where jsonb_typeof(v.item) <> 'string' or (v.item #>> '{}') !~ '^[a-z0-9_]{1,60}$'
             )
           )
         )
    );
$$;

-- Ids de fichas da base (mesmo formato do "id" em data/kb.json).
create or replace function privado.ids_validos(ids text[])
returns boolean
language sql
immutable
set search_path = ''
as $$
  select coalesce(pg_catalog.array_length(ids, 1), 0) <= 10
    and not exists (select 1 from pg_catalog.unnest(ids) as i(id) where i.id is null or i.id !~ '^[a-z0-9]+(-[a-z0-9]+)*$' or length(i.id) > 80);
$$;

grant execute on function privado.respostas_validas(jsonb), privado.ids_validos(text[]) to anon, authenticated;

-- Tema: um id de categoria (ex.: "transporte", "sem_resposta"). Nunca texto livre.
create domain public.tema as text check (value ~ '^[a-z0-9_-]{1,60}$');

-- ---------------------------------------------------------------------------
-- perfis
-- ---------------------------------------------------------------------------
create table public.perfis (
  user_id uuid primary key references auth.users (id) on delete cascade,
  respostas jsonb not null default '{}'::jsonb check (privado.respostas_validas(respostas)),
  -- Data do aceite do termo. Preenchida pelo banco: o aparelho não escolhe a data.
  consentimento_em timestamptz not null default now(),
  -- Versão do termo aceito (ex.: "2026-11-v1"), para saber o que a pessoa leu.
  termo_versao text not null check (termo_versao ~ '^[0-9]{4}-[0-9]{2}-v[0-9]{1,3}$'),
  atualizado_em timestamptz not null default now()
);

comment on table public.perfis is 'Perfil opcional: só existe depois do termo de consentimento. Respostas sensíveis só chegam aqui se a pessoa marcar "Salvar meu perfil".';

-- O banco é quem carimba as datas. No update, o consentimento só muda se a versão do termo mudar (novo aceite).
create or replace function privado.carimbar_perfil()
returns trigger
language plpgsql
set search_path = ''
as $$
begin
  if tg_op = 'INSERT' then
    new.consentimento_em := now();
  elsif new.termo_versao is distinct from old.termo_versao then
    new.consentimento_em := now();
  else
    new.consentimento_em := old.consentimento_em;
  end if;
  new.atualizado_em := now();
  return new;
end;
$$;

create trigger perfis_carimbar
  before insert or update on public.perfis
  for each row execute function privado.carimbar_perfil();

alter table public.perfis enable row level security;

create policy perfis_ler_o_proprio on public.perfis
  for select to authenticated
  using ((select auth.uid()) = user_id);

create policy perfis_criar_o_proprio on public.perfis
  for insert to authenticated
  with check ((select auth.uid()) = user_id);

create policy perfis_alterar_o_proprio on public.perfis
  for update to authenticated
  using ((select auth.uid()) = user_id)
  with check ((select auth.uid()) = user_id);

create policy perfis_apagar_o_proprio on public.perfis
  for delete to authenticated
  using ((select auth.uid()) = user_id);

-- ---------------------------------------------------------------------------
-- historico
-- ---------------------------------------------------------------------------
create table public.historico (
  id bigint generated always as identity primary key,
  user_id uuid not null default auth.uid() references auth.users (id) on delete cascade,
  tema public.tema not null,
  fichas_ids text[] not null default '{}' check (privado.ids_validos(fichas_ids)),
  criado_em timestamptz not null default now()
);

comment on table public.historico is 'Temas e ids das fichas vistas por quem tem conta. Nunca guarda o texto da pergunta.';

-- Índice da FK (cascata e RLS) e da listagem "mais recentes primeiro".
create index historico_user_id_criado_em_idx on public.historico (user_id, criado_em desc);

alter table public.historico enable row level security;

create policy historico_ler_o_proprio on public.historico
  for select to authenticated
  using ((select auth.uid()) = user_id);

-- Só grava histórico quem já aceitou o termo (tem perfil).
create policy historico_criar_o_proprio_com_consentimento on public.historico
  for insert to authenticated
  with check (
    (select auth.uid()) = user_id
    and exists (select 1 from public.perfis p where p.user_id = (select auth.uid()))
  );

create policy historico_apagar_o_proprio on public.historico
  for delete to authenticated
  using ((select auth.uid()) = user_id);

-- ---------------------------------------------------------------------------
-- feedback (anônimo)
-- ---------------------------------------------------------------------------
create table public.feedback (
  id bigint generated always as identity primary key,
  tema public.tema not null,
  ajudou boolean not null,
  segundos numeric(6, 1) not null check (segundos >= 0 and segundos < 3600),
  criado_em timestamptz not null default now()
);

comment on table public.feedback is 'Voto "Esta resposta ajudou?" sem user_id. Só inserção pela API; leitura só pelo painel ou service_role.';

alter table public.feedback enable row level security;

create policy feedback_qualquer_um_envia on public.feedback
  for insert to anon, authenticated
  with check (true);
-- Sem política de select, update ou delete: ninguém lê nem muda pela API.

-- ---------------------------------------------------------------------------
-- Privilégios mínimos (o Supabase concede ALL por padrão a anon e authenticated)
-- ---------------------------------------------------------------------------
revoke all on public.perfis, public.historico, public.feedback from anon, authenticated;

grant select, delete on public.perfis to authenticated;
grant insert (user_id, respostas, termo_versao) on public.perfis to authenticated;
grant update (respostas, termo_versao) on public.perfis to authenticated;

grant select, delete on public.historico to authenticated;
grant insert (tema, fichas_ids) on public.historico to authenticated;

grant insert (tema, ajudou, segundos) on public.feedback to anon, authenticated;
