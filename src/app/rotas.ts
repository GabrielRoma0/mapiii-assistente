// Rotas por "#", que funcionam em qualquer hospedagem estática.
// Nenhuma resposta da pessoa vai para a URL: só o nome da tela e, no detalhe, o id da entrada da base.
import { useEffect, useState } from 'react';

export type Rota =
  | { tela: 'inicio' }
  | { tela: 'triagem'; pergunta?: string }
  | { tela: 'rota' }
  | { tela: 'direito'; id: string }
  | { tela: 'perguntar' }
  | { tela: 'conferir' }
  | { tela: 'sobre' }
  | { tela: 'projeto' }
  | { tela: 'embarque' }
  | { tela: 'reclamacao' }
  | { tela: 'na_rua' }
  | { tela: 'negaram'; id?: string }
  | { tela: 'motorista'; id?: string }
  | { tela: 'cartao' }
  | { tela: 'atalho'; id: string }
  | { tela: 'laudo' }
  | { tela: 'componentes' }
  | { tela: 'teste_erro' }
  | { tela: 'nao_encontrada' };

/**
 * O app mora em ".../" ou ".../index.html" (pode estar numa subpasta). Qualquer outro caminho
 * (ex.: "/qualquer-coisa", que o service worker responde com o index.html) é página não encontrada.
 */
export function caminhoDoApp(pathname: string): boolean {
  const ultimo = pathname.split('/').pop() ?? '';
  return ultimo === '' || ultimo === 'index.html';
}

export function lerRota(hash: string, pathname = '/'): Rota {
  if (!caminhoDoApp(pathname)) return { tela: 'nao_encontrada' };
  const caminho = hash.replace(/^#\/?/, '').replace(/\/+$/, '').split('?')[0];
  const partes = caminho.split('/').filter(Boolean);
  if (!partes.length) return { tela: 'inicio' };
  const [primeira, segunda] = partes;
  if (partes.length === 1) {
    if (primeira === 'situacao') return { tela: 'triagem' };
    if (primeira === 'rota') return { tela: 'rota' };
    if (primeira === 'perguntar') return { tela: 'perguntar' };
    if (primeira === 'conferir') return { tela: 'conferir' };
    if (primeira === 'sobre') return { tela: 'sobre' };
    if (primeira === 'projeto') return { tela: 'projeto' };
    if (primeira === 'embarque') return { tela: 'embarque' };
    if (primeira === 'reclamacao') return { tela: 'reclamacao' };
    if (primeira === 'componentes') return { tela: 'componentes' };
    if (primeira === 'teste-erro') return { tela: 'teste_erro' };
    if (primeira === 'na-rua') return { tela: 'na_rua' };
    if (primeira === 'negaram') return { tela: 'negaram' };
    if (primeira === 'motorista') return { tela: 'motorista' };
    if (primeira === 'cartao') return { tela: 'cartao' };
    if (primeira === 'laudo') return { tela: 'laudo' };
  }
  // "Mudar uma resposta": a triagem abre direto na pergunta (#/situacao/p_cidade).
  if (partes.length === 2 && primeira === 'situacao' && /^p_[a-z0-9_]+$/.test(segunda)) return { tela: 'triagem', pergunta: segunda };
  if (partes.length === 2 && /^[a-z0-9-]+$/.test(segunda)) {
    if (primeira === 'direito') return { tela: 'direito', id: segunda };
    if (primeira === 'negaram') return { tela: 'negaram', id: segunda };
    if (primeira === 'motorista') return { tela: 'motorista', id: segunda };
    if (primeira === 'atalho') return { tela: 'atalho', id: segunda };
  }
  return { tela: 'nao_encontrada' };
}

export const href = {
  inicio: '#/',
  triagem: '#/situacao',
  mudarResposta: (pergunta: string) => `#/situacao/${pergunta}`,
  rota: '#/rota',
  direito: (id: string) => `#/direito/${id}`,
  perguntar: '#/perguntar',
  conferir: '#/conferir',
  sobre: '#/sobre',
  projeto: '#/projeto',
  embarque: '#/embarque',
  reclamacao: '#/reclamacao',
  naRua: '#/na-rua',
  negaram: (id?: string) => (id ? `#/negaram/${id}` : '#/negaram'),
  motorista: (id?: string) => (id ? `#/motorista/${id}` : '#/motorista'),
  cartao: '#/cartao',
  atalho: (id: string) => `#/atalho/${id}`,
  laudo: '#/laudo'
};

export function navegar(destino: string) {
  window.location.hash = destino;
}

export function useRota(): Rota {
  const [rota, setRota] = useState(() => lerRota(window.location.hash, window.location.pathname));
  useEffect(() => {
    const aoMudar = () => setRota(lerRota(window.location.hash, window.location.pathname));
    window.addEventListener('hashchange', aoMudar);
    return () => window.removeEventListener('hashchange', aoMudar);
  }, []);
  return rota;
}

export type Aba = 'inicio' | 'perguntar' | 'na_rua' | 'sobre';

/**
 * Aba acesa na barra inferior. null = a barra não aparece: na triagem (fluxo passo a passo, com ação fixa
 * no rodapé), na página não encontrada e nas telas só de desenvolvimento.
 */
export function abaDaRota(rota: Rota): Aba | null {
  switch (rota.tela) {
    case 'perguntar':
      return 'perguntar';
    case 'sobre':
    case 'projeto':
      return 'sobre';
    case 'na_rua':
    case 'embarque':
    case 'cartao':
    case 'motorista':
    case 'reclamacao':
      return 'na_rua';
    case 'triagem':
    case 'nao_encontrada':
    case 'componentes':
    case 'teste_erro':
      return null;
    default:
      return 'inicio';
  }
}

export const HREF_DA_ABA: Record<Aba, string> = { inicio: href.inicio, perguntar: href.perguntar, na_rua: href.naRua, sobre: href.sobre };
