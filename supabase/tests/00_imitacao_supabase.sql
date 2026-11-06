-- SÓ PARA TESTE LOCAL (npm run test:banco). Não vai para o Supabase.
-- Imita o mínimo do Supabase para as migrações rodarem num Postgres comum:
-- papéis anon/authenticated/service_role, schema auth com auth.users e auth.uid(),
-- e os privilégios padrão do Supabase (ALL para anon e authenticated em public), que a migração precisa revogar.
create role anon nologin noinherit;
create role authenticated nologin noinherit;
create role service_role nologin noinherit bypassrls;

create schema auth;
create table auth.users (id uuid primary key, email text);

-- Igual ao Supabase: o id da pessoa vem do JWT (aqui, de uma configuração da sessão).
create function auth.uid() returns uuid
language sql stable
as $$ select nullif(current_setting('request.jwt.claim.sub', true), '')::uuid $$;

grant usage on schema auth to anon, authenticated, service_role;
grant execute on function auth.uid() to anon, authenticated, service_role;

grant usage on schema public to anon, authenticated, service_role;
alter default privileges in schema public grant all on tables to anon, authenticated, service_role;
alter default privileges in schema public grant all on sequences to anon, authenticated, service_role;
alter default privileges in schema public grant all on functions to anon, authenticated, service_role;

-- Ajudantes dos testes.
create schema teste;
grant usage on schema teste to public;

create function teste.afirmar(condicao boolean, mensagem text) returns void
language plpgsql as $$
begin
  if condicao is not true then
    raise exception 'FALHOU: %', mensagem;
  end if;
  raise notice 'ok   %', mensagem;
end $$;

-- Executa o SQL e exige que dê erro com o trecho esperado (ex.: "permission denied", "row-level security").
create function teste.deve_falhar(comando text, trecho text, mensagem text) returns void
language plpgsql as $$
begin
  begin
    execute comando;
  exception when others then
    if position(trecho in sqlerrm) > 0 then
      raise notice 'ok   %', mensagem;
      return;
    end if;
    raise exception 'FALHOU: % (erro inesperado: %)', mensagem, sqlerrm;
  end;
  raise exception 'FALHOU: % (o comando deveria ter dado erro)', mensagem;
end $$;

grant execute on all functions in schema teste to public;
