// Rotas por "#", que funcionam em qualquer hospedagem estática.
// Nenhuma resposta da pessoa vai para a URL: só o nome da tela e, no detalhe, o id da entrada da base.
import { useEffect, useState } from 'react';

export type Rota =
  | { tela: 'inicio' }
  | { tela: 'triagem' }
  | { tela: 'rota' }
  | { tela: 'direito'; id: string }
  | { tela: 'perguntar' }
  | { tela: 'conferir' }
  | { tela: 'sobre' }
  | { tela: 'embarque' }
  | { tela: 'reclamacao' }
  | { tela: 'componentes' }
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
    if (primeira === 'embarque') return { tela: 'embarque' };
    if (primeira === 'reclamacao') return { tela: 'reclamacao' };
    if (primeira === 'componentes') return { tela: 'componentes' };
  }
  if (partes.length === 2 && primeira === 'direito' && /^[a-z0-9-]+$/.test(segunda)) return { tela: 'direito', id: segunda };
  return { tela: 'nao_encontrada' };
}

export const href = {
  inicio: '#/',
  triagem: '#/situacao',
  rota: '#/rota',
  direito: (id: string) => `#/direito/${id}`,
  perguntar: '#/perguntar',
  conferir: '#/conferir',
  sobre: '#/sobre',
  embarque: '#/embarque',
  reclamacao: '#/reclamacao'
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
