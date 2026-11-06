// Embarque Garantido: diferencial da Fase 3, DESLIGADO por padrão.
// Liga com VITE_EMBARQUE_ATIVO=true (arquivo .env.local ou variável de ambiente no build).
// Desligado: a rota #/embarque dá 404, o Início não mostra a entrada e o indicador de tempo não aparece.
export const EMBARQUE_ATIVO = import.meta.env.VITE_EMBARQUE_ATIVO === 'true';

/** Endereço e chave publicável do Supabase, para chamar a Edge Function `onibus`. Vazios = não configurado. */
export const SUPABASE_URL = (import.meta.env.VITE_SUPABASE_URL ?? '').replace(/\/+$/, '');
export const SUPABASE_CHAVE = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY ?? '';
