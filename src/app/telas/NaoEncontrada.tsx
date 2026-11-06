import { useEffect, useState } from 'react';
import { FalaMapi } from '../../ui/assistente';
import { Titulo } from '../comum';
import { caminhoDoApp, href } from '../rotas';
import css from '../app.module.css';

/**
 * Para onde volta o "início". Num caminho desconhecido (ex.: "/qualquer-coisa"), "#/" ficaria no mesmo caminho errado:
 * usa a raiz do app, que é o escopo do service worker (funciona também numa subpasta).
 */
function useInicio(): string {
  const [destino, setDestino] = useState(() => (caminhoDoApp(window.location.pathname) ? href.inicio : new URL('./', window.location.href).href));
  useEffect(() => {
    if (caminhoDoApp(window.location.pathname) || !('serviceWorker' in navigator)) return;
    navigator.serviceWorker.getRegistration().then((r) => r && setDestino(r.scope));
  }, []);
  return destino;
}

export function NaoEncontrada() {
  const inicio = useInicio();
  return (
    <>
      <div style={{ paddingTop: 12 }} />
      <Titulo>Página não encontrada</Titulo>
      <FalaMapi estado="duvida">Não encontrei esta página. O endereço pode estar errado ou a página mudou de lugar.</FalaMapi>
      <a className={css.botaoPrincipal} href={inicio}>
        Voltar para o início
      </a>
    </>
  );
}
