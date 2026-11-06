// Botões A, A+ e A++ para o tamanho do texto. Grupo de botões com aria-pressed (48 px cada).
import { ROTULOS_TAMANHO, type Tamanho } from '../core/tamanho';
import { useEstado } from './estado';
import css from './app.module.css';

const NOMES: Record<Tamanho, string> = { normal: 'A, texto normal', grande: 'A+, texto grande', maior: 'A++, texto maior' };

export function TamanhoTexto() {
  const { tamanho, escolherTamanho } = useEstado();
  return (
    <div className={css.tamanhoTexto} role="group" aria-label="Tamanho do texto">
      <span aria-hidden="true">Tamanho do texto</span>
      {(Object.keys(ROTULOS_TAMANHO) as Tamanho[]).map((t) => (
        <button key={t} type="button" className={css.botaoTamanho} aria-pressed={tamanho === t} aria-label={NOMES[t]} onClick={() => escolherTamanho(t)}>
          {ROTULOS_TAMANHO[t]}
        </button>
      ))}
    </div>
  );
}
