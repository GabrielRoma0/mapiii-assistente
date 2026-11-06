// Modo varredura ("usar com um toque"): destaca os itens da tela um por vez; um toque em qualquer lugar
// (ou Espaço/Enter, que é o que um acionador manda) escolhe o destacado. O toque não aciona o que está debaixo
// do dedo: só o item destacado. "Sair do modo um toque" entra na varredura como primeiro item.
import { useEffect, useRef } from 'react';
import { proximoIndice } from '../core/varredura.ts';
import css from './assistente.module.css';

const SELETOR = 'button:not([disabled]), a[href], input:not([disabled]):not([type=hidden]), select:not([disabled]), textarea:not([disabled]), summary';
const DESTAQUE = 'data-varredura-destaque';

function itensDaTela(): HTMLElement[] {
  return [...document.querySelectorAll<HTMLElement>(SELETOR)].filter(
    (e) => e.getClientRects().length > 0 && !e.closest('[aria-hidden="true"], [data-varredura-ignorar], [inert]')
  );
}

export function ModoVarredura({ intervaloMs, aoSair }: { intervaloMs: number; aoSair: () => void }) {
  const indice = useRef(-1);
  const atual = useRef<HTMLElement | null>(null);
  const ativando = useRef(false);

  useEffect(() => {
    const limpar = () => atual.current?.removeAttribute(DESTAQUE);
    const destacar = () => {
      const itens = itensDaTela();
      indice.current = proximoIndice(indice.current, itens.length);
      limpar();
      const el = itens[indice.current];
      if (!el) return;
      atual.current = el;
      el.setAttribute(DESTAQUE, '');
      el.focus({ preventScroll: true });
      el.scrollIntoView({ block: 'nearest' });
    };
    const recomecar = () => {
      limpar();
      indice.current = -1;
    };
    const escolher = () => {
      const el = atual.current;
      if (!el || !el.isConnected) return;
      recomecar();
      if (el.matches('input:not([type=checkbox]):not([type=radio]), textarea, select')) {
        el.focus();
        return;
      }
      ativando.current = true;
      el.click();
      ativando.current = false;
    };
    // Captura antes de qualquer outro tratamento: o toque vira "escolher o destacado".
    const aoTocar = (e: Event) => {
      if (ativando.current) return;
      e.preventDefault();
      e.stopPropagation();
      if (e.type === 'click') escolher();
    };
    const aoTeclar = (e: KeyboardEvent) => {
      if (e.key !== ' ' && e.key !== 'Enter') return;
      e.preventDefault();
      e.stopPropagation();
      escolher();
    };
    destacar();
    const t = setInterval(destacar, intervaloMs);
    window.addEventListener('hashchange', recomecar);
    document.addEventListener('pointerdown', aoTocar, true);
    document.addEventListener('click', aoTocar, true);
    document.addEventListener('keydown', aoTeclar, true);
    return () => {
      clearInterval(t);
      limpar();
      window.removeEventListener('hashchange', recomecar);
      document.removeEventListener('pointerdown', aoTocar, true);
      document.removeEventListener('click', aoTocar, true);
      document.removeEventListener('keydown', aoTeclar, true);
    };
  }, [intervaloMs]);

  return (
    <div className={css.barraVarredura} role="region" aria-label="Modo um toque">
      <span>Modo um toque: toque em qualquer lugar para escolher o item destacado.</span>
      <button type="button" className={css.botaoSairVarredura} onClick={aoSair}>
        Sair do modo um toque
      </button>
    </div>
  );
}
