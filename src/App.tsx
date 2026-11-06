import { DisclaimerBanner } from './ui/assistente';
import { ProvedorEstado } from './app/estado';
import { useRota, type Rota } from './app/rotas';
import { USANDO_EXEMPLO } from './app/dados';
import { useOnline } from './app/conexao';
import { Icon } from '../design-system/components/icons/Icon';
import { Inicio } from './app/telas/Inicio';
import { Triagem } from './app/telas/Triagem';
import { RotaDosDireitos } from './app/telas/RotaDosDireitos';
import { DetalheDireito } from './app/telas/DetalheDireito';
import { Perguntar } from './app/telas/Perguntar';
import { Conferir } from './app/telas/Conferir';
import { Sobre } from './app/telas/Sobre';
import { NaoEncontrada } from './app/telas/NaoEncontrada';
import { Vitrine } from './vitrine/Vitrine';
import { Embarque } from './app/telas/Embarque';
import { Reclamacao } from './app/telas/Reclamacao';
import { EMBARQUE_ATIVO } from './app/embarque/recurso';
import css from './app/app.module.css';

function Tela({ rota }: { rota: Rota }) {
  switch (rota.tela) {
    case 'inicio':
      return <Inicio />;
    case 'triagem':
      return <Triagem />;
    case 'rota':
      return <RotaDosDireitos />;
    case 'direito':
      return <DetalheDireito id={rota.id} />;
    case 'perguntar':
      return <Perguntar />;
    case 'conferir':
      return <Conferir />;
    case 'sobre':
      return <Sobre />;
    case 'embarque':
      // Diferencial desligado por padrão: sem a flag, o endereço não existe.
      return EMBARQUE_ATIVO ? <Embarque /> : <NaoEncontrada />;
    case 'reclamacao':
      return EMBARQUE_ATIVO ? <Reclamacao /> : <NaoEncontrada />;
    case 'componentes':
      return import.meta.env.DEV ? <Vitrine /> : <NaoEncontrada />;
    default:
      return <NaoEncontrada />;
  }
}

export function App() {
  const rota = useRota();
  const online = useOnline();
  // A chave força a tela a montar de novo ao trocar de rota (foco no título, rolagem no topo).
  const chave = rota.tela === 'direito' ? `direito-${rota.id}` : rota.tela;
  return (
    <ProvedorEstado>
      <a className={css.pular} href="#conteudo" onClick={(e) => { e.preventDefault(); document.getElementById('conteudo')?.focus(); }}>
        Pular para o conteúdo
      </a>
      <div className={css.casca}>
        {USANDO_EXEMPLO && (
          <p className={css.avisoDev} role="note">
            Desenvolvimento: a base está vazia, então estas telas usam entradas de exemplo que não são informação real.
          </p>
        )}
        <div aria-live="polite">
          {!online && (
            <p className={css.semInternet}>
              <span style={{ flex: 'none' }}>
                <Icon name="alerta" size={22} />
              </span>
              Você está sem internet. O Mapiii continua funcionando, mas os links das fontes só abrem com internet.
            </p>
          )}
        </div>
        <main id="conteudo" tabIndex={-1} className={css.conteudo}>
          <Tela key={chave} rota={rota} />
        </main>
        <footer className={css.rodape}>
          <DisclaimerBanner />
        </footer>
      </div>
    </ProvedorEstado>
  );
}
