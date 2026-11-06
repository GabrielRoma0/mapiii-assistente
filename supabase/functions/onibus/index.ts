// Edge Function `onibus` (Supabase, Deno): consulta a API Olho Vivo da SPTrans pelo servidor.
// Toda a lógica está em ../_shared/onibus-servidor.ts (testada no Node com a API simulada).
//
// Segredos (Supabase → Edge Functions → Secrets), nunca no código nem no navegador:
//   SPTRANS_TOKEN            chave do aplicativo cadastrado na área de desenvolvedor da SPTrans
//   ONIBUS_ORIGENS           opcional: origens permitidas, separadas por vírgula (padrão: todas)
//   ONIBUS_LIMITE_POR_MINUTO opcional: pedidos por minuto por IP (padrão: 30)
import { criarServico } from '../_shared/onibus-servidor.ts';

const limite = Number(Deno.env.get('ONIBUS_LIMITE_POR_MINUTO'));

Deno.serve(
  criarServico({
    fetch,
    token: Deno.env.get('SPTRANS_TOKEN'),
    origens: (Deno.env.get('ONIBUS_ORIGENS') ?? '*').split(',').map((o) => o.trim()).filter(Boolean),
    limitePorMinuto: Number.isInteger(limite) && limite > 0 ? limite : undefined,
    // Só mensagens de situação (sem IP, termo, token ou corpo do pedido).
    log: (mensagem) => console.error(mensagem)
  })
);
