// Caixa "Lembrar minhas respostas neste aparelho": desmarcada por padrão; desmarcar apaga do aparelho.
import { useId, useState } from 'react';
import { AVISO_LEMBRAR } from '../core/lembrar';
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
