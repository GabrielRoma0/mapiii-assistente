// App instalado: quando sai uma versão nova, avisa e deixa a pessoa escolher a hora de atualizar,
// em vez de trocar no meio do uso (registerType: 'prompt' no vite.config).
import { useRegisterSW } from 'virtual:pwa-register/react';
import css from './app.module.css';

export function AvisoAtualizacao() {
  const {
    needRefresh: [temNova, setTemNova],
    updateServiceWorker
  } = useRegisterSW();
  if (!temNova) return null;
  return (
    <div className={css.cartaoBranco} role="status" style={{ margin: 'var(--space-3) var(--space-4) 0' }}>
      <b>Nova versão do Mapiii disponível.</b>
      <div className={css.acoesLinha}>
        <button type="button" className={css.botaoPrincipal} onClick={() => updateServiceWorker(true)}>
          Atualizar agora
        </button>
        <button type="button" className={css.botaoSecundario} onClick={() => setTemNova(false)}>
          Depois
        </button>
      </div>
    </div>
  );
}
