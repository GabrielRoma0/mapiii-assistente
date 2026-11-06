// Peças comuns das telas: cabeçalho com "Voltar", título que recebe o foco ao trocar de tela.
import { useEffect, useRef, type ReactNode } from 'react';
import { Icon } from '../../design-system/components/icons/Icon';
import css from './app.module.css';

let primeiraTela = true;

/**
 * Ao trocar de tela, leva o foco para o título: quem usa leitor de tela ou teclado
 * começa a nova tela do topo. Na primeira carga o foco fica onde o navegador deixou.
 */
export function Titulo({ children, grande }: { children: ReactNode; grande?: boolean }) {
  const ref = useRef<HTMLHeadingElement>(null);
  useEffect(() => {
    if (primeiraTela) {
      primeiraTela = false;
      return;
    }
    ref.current?.focus();
    window.scrollTo(0, 0);
  }, []);
  return (
    <h1 ref={ref} tabIndex={-1} className={grande ? css.tituloGrande : css.titulo}>
      {children}
    </h1>
  );
}

export function Voltar({ para, rotulo, aoVoltar }: { para?: string; rotulo: string; aoVoltar?: () => void }) {
  const icone = <Icon name="voltar" size={24} />;
  return (
    <div className={css.voltar}>
      {aoVoltar ? (
        <button type="button" className={css.botaoVoltar} onClick={aoVoltar} aria-label={`Voltar: ${rotulo}`}>
          {icone}
        </button>
      ) : (
        <a className={css.botaoVoltar} href={para} aria-label={`Voltar: ${rotulo}`}>
          {icone}
        </a>
      )}
      <span aria-hidden="true">{rotulo}</span>
    </div>
  );
}
