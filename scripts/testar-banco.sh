#!/usr/bin/env bash
# Roda as migrações de supabase/migrations/ e os testes de supabase/tests/ num Postgres descartável (Docker).
# Uso: npm run test:banco   (precisa do Docker; usa a imagem postgres:16-alpine)
set -euo pipefail
cd "$(dirname "$0")/.."

IMAGEM="${IMAGEM_POSTGRES:-postgres:16-alpine}"
NOME="mapiii-banco-teste-$$"

docker run -d --rm --name "$NOME" -e POSTGRES_PASSWORD=teste "$IMAGEM" >/dev/null
trap 'docker stop "$NOME" >/dev/null 2>&1 || true' EXIT

for _ in $(seq 1 60); do
  docker exec "$NOME" pg_isready -U postgres -q && break
  sleep 0.5
done
sleep 1

rodar() {
  echo "-- $1"
  docker exec -i "$NOME" psql -q -o /dev/null -v ON_ERROR_STOP=1 -U postgres -d postgres < "$1" 2>&1 | sed -e 's/^psql:[^ ]* NOTICE:  /  /' -e 's/^NOTICE:  /  /'
  return "${PIPESTATUS[0]}"
}

rodar supabase/tests/00_imitacao_supabase.sql
for f in supabase/migrations/*.sql; do rodar "$f"; done
for f in supabase/tests/[1-9]*.sql; do rodar "$f"; done
echo "Banco: todos os testes passaram."
