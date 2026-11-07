// Testa a função `onibus` publicada contra a SPTrans de verdade. Uso: npm run testar-sptrans
// Lê VITE_SUPABASE_URL e VITE_SUPABASE_PUBLISHABLE_KEY do ambiente ou do .env.local (as duas são públicas).
// Nunca usa nem mostra o token da SPTrans: ele fica só no segredo da função.
import { existsSync, readFileSync } from 'node:fs';

function ler(nome: string): string {
  if (process.env[nome]) return process.env[nome]!.trim();
  if (!existsSync('.env.local')) return '';
  const linha = readFileSync('.env.local', 'utf8').split('\n').find((l) => l.startsWith(`${nome}=`));
  return linha ? linha.slice(nome.length + 1).trim() : '';
}

const url = ler('VITE_SUPABASE_URL').replace(/\/+$/, '');
const chave = ler('VITE_SUPABASE_PUBLISHABLE_KEY');
if (!url || !chave) {
  console.error('Falta VITE_SUPABASE_URL ou VITE_SUPABASE_PUBLISHABLE_KEY no .env.local (veja PENDENCIAS.md, "Atualizações de 07/11").');
  process.exit(2);
}

const termo = process.argv[2] ?? 'Paulista';
const res = await fetch(`${url}/functions/v1/onibus`, {
  method: 'POST',
  headers: { apikey: chave, authorization: `Bearer ${chave}`, 'content-type': 'application/json' },
  body: JSON.stringify({ acao: 'paradas', termo })
});
const corpo = (await res.json().catch(() => ({}))) as { ok?: boolean; erro?: string; paradas?: { nome?: string }[] };

if (corpo.ok) {
  console.log(`SPTrans OK: ${corpo.paradas?.length ?? 0} ponto(s) para "${termo}".`);
  for (const p of (corpo.paradas ?? []).slice(0, 5)) console.log(`  - ${p.nome ?? JSON.stringify(p)}`);
  console.log('Próximo passo: ligar VITE_EMBARQUE_ATIVO=true e conferir os 4 pontos da H8 (sessão, horário, acessibilidade, sentido).');
} else {
  console.error(`SPTrans ainda falhando (HTTP ${res.status}, erro: ${corpo.erro ?? 'desconhecido'}).`);
  console.error('Se for "api_fora": a SPTrans recusou a chave. Veja PENDENCIAS.md, "Atualizações de 07/11", item H8.');
  process.exit(1);
}
