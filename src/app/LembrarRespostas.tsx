// Caixa "Lembrar minhas respostas neste aparelho": desmarcada por padrão; desmarcar apaga do aparelho.
import { useEffect, useId, useRef, useState } from 'react';
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
 * e quem usa o mesmo aparelho fica sabendo que há algo guardado e pode apagar.
 * "Apagar" pede confirmação na própria tela (sem janela pop-up): o foco vai para a pergunta, que o leitor
 * de tela lê; Esc ou "Não, manter" cancelam e o foco volta ao "Apagar". Evita apagar por um toque sem querer.
 */
export function AvisoRespostasGuardadas() {
  const { lembrar, respostas, alternarLembrar, limparRespostas } = useEstado();
  const [aviso, setAviso] = useState('');
  const [confirmando, setConfirmando] = useState(false);
  // Para onde o foco vai depois de fechar a confirmação (aplicado depois que a tela atualiza).
  const [focoDepois, setFocoDepois] = useState<'apagar' | 'titulo' | null>(null);
  const pergunta = useRef<HTMLParagraphElement>(null);
  const botaoApagar = useRef<HTMLButtonElement>(null);
  const visivel = lembrar && quantasRespondidas(respostas) > 0;

  useEffect(() => {
    if (confirmando) pergunta.current?.focus();
  }, [confirmando]);
  useEffect(() => {
    if (focoDepois === 'apagar') botaoApagar.current?.focus();
    // O aviso some depois de apagar: o foco vai para o título da tela, para ninguém ficar perdido.
    if (focoDepois === 'titulo') document.querySelector<HTMLElement>('main h1')?.focus();
    if (focoDepois) setFocoDepois(null);
  }, [focoDepois]);

  const cancelar = () => {
    setConfirmando(false);
    setFocoDepois('apagar');
  };
  const apagar = () => {
    alternarLembrar(false);
    limparRespostas();
    setConfirmando(false);
    setAviso('Respostas apagadas deste aparelho.');
    setFocoDepois('titulo');
  };

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
          {!confirmando ? (
            <div className={css.acoesLinha}>
              <a className={css.botaoSecundario} href={href.rota} style={{ textDecoration: 'none' }}>
                Ver minha rota
              </a>
              <button ref={botaoApagar} type="button" className={css.botaoSecundario} onClick={() => setConfirmando(true)}>
                Apagar
              </button>
            </div>
          ) : (
            <div
              role="group"
              aria-labelledby="confirmar-apagar"
              className={css.pilha}
              onKeyDown={(e) => {
                if (e.key === 'Escape') {
                  e.preventDefault();
                  cancelar();
                }
              }}
            >
              <p id="confirmar-apagar" ref={pergunta} tabIndex={-1} className={css.texto} style={{ margin: 0, fontWeight: 800 }}>
                Apagar as respostas guardadas neste aparelho? Não dá para desfazer.
              </p>
              <div className={css.acoesLinha}>
                <button type="button" className={css.botaoPrincipal} onClick={apagar}>
                  Sim, apagar
                </button>
                <button type="button" className={css.botaoSecundario} onClick={cancelar}>
                  Não, manter
                </button>
              </div>
            </div>
          )}
        </section>
      )}
      <p className="visualmente-oculto" aria-live="polite">
        {aviso}
      </p>
    </>
  );
}
