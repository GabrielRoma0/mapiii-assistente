// Caixa "Lembrar minhas respostas neste aparelho": desmarcada por padrão; desmarcar apaga do aparelho.
import { useId, useState } from 'react';
import { Icon } from '../../design-system/components/icons/Icon';
import { AVISO_LEMBRAR, quantasRespondidas } from '../core/lembrar';
import { href } from './rotas';
import { useEstado } from './estado';
import css from './app.module.css';

export function LembrarRespostas() {
  const { lembrar, alternarLembrar, podeLembrar } = useEstado();
  const id = useId();
  const [aviso, setAviso] = useState('');
  if (!podeLembrar) return null;
  return (
    <div className={`${css.cartaoBranco} naoImprimir`}>
      <label htmlFor={id} className={css.garantia} style={{ cursor: 'pointer', minHeight: 48, margin: 0 }}>
        <input
          id={id}
          type="checkbox"
          checked={lembrar}
          aria-describedby={`${id}-aviso`}
          onChange={(e) => {
            const ligar = e.target.checked;
            const ok = alternarLembrar(ligar);
            setAviso(!ok ? 'Este navegador não deixa guardar. As respostas valem só enquanto a página estiver aberta.' : ligar ? 'Respostas guardadas neste aparelho.' : 'Respostas apagadas deste aparelho.');
          }}
          style={{ width: 24, height: 24, flex: 'none' }}
        />
        Lembrar minhas respostas neste aparelho
      </label>
      <span id={`${id}-aviso`} className={css.apoio} style={{ margin: 0 }}>
        {AVISO_LEMBRAR}
      </span>
      <p className="visualmente-oculto" aria-live="polite">
        {aviso}
      </p>
    </div>
  );
}

/**
 * Aviso no Início quando há respostas guardadas neste aparelho: quem volta vai direto à rota,
 * e quem usa o mesmo aparelho fica sabendo que há algo guardado e pode apagar com um toque.
 */
export function AvisoRespostasGuardadas() {
  const { lembrar, respostas, alternarLembrar, limparRespostas } = useEstado();
  const [aviso, setAviso] = useState('');
  const visivel = lembrar && quantasRespondidas(respostas) > 0;
  return (
    <>
      {visivel && (
        <section className={css.cartaoBranco} aria-labelledby="respostas-guardadas">
          <p id="respostas-guardadas" className={css.garantia} style={{ margin: 0 }}>
            <span style={{ flex: 'none' }}>
              <Icon name="escudo_check" size={22} />
            </span>
            Suas respostas estão guardadas neste aparelho.
          </p>
          <div className={css.acoesLinha}>
            <a className={css.botaoSecundario} href={href.rota} style={{ textDecoration: 'none' }}>
              Ver minha rota
            </a>
            <button
              type="button"
              className={css.botaoSecundario}
              onClick={() => {
                alternarLembrar(false);
                limparRespostas();
                setAviso('Respostas apagadas deste aparelho.');
              }}
            >
              Apagar
            </button>
          </div>
        </section>
      )}
      <p className="visualmente-oculto" aria-live="polite">
        {aviso}
      </p>
    </>
  );
}
