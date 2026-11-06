import { DisclaimerBanner } from './ui/assistente';
import { ProvedorEstado } from './app/estado';
import { abaDaRota, HREF_DA_ABA, navegar, useRota, type Aba, type Rota } from './app/rotas';
import { TabBar } from '../design-system/components/navigation/TabBar';
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
import { NaRua } from './app/telas/NaRua';
import { Negaram } from './app/telas/Negaram';
import { Motorista } from './app/telas/Motorista';
import { Cartao } from './app/telas/Cartao';
import { Atalho } from './app/telas/Atalho';
import { Laudo } from './app/telas/Laudo';
import { EMBARQUE_ATIVO } from './app/embarque/recurso';
import { LimiteDeErro, TelaQueQuebra } from './app/LimiteDeErro';
import css from './app/app.module.css';

function Tela({ rota }: { rota: Rota }) {
  switch (rota.tela) {
    case 'inicio':
      return <Inicio />;
    case 'triagem':
      return <Triagem pergunta={rota.pergunta} />;
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
      // A Reclamação pronta não depende da API: fica sempre disponível.
      return <Reclamacao />;
    case 'na_rua':
      return <NaRua />;
    case 'negaram':
      return <Negaram id={rota.id} />;
    case 'motorista':
      return <Motorista id={rota.id} />;
    case 'cartao':
      return <Cartao />;
    case 'atalho':
      return <Atalho id={rota.id} />;
    case 'laudo':
      return <Laudo />;
    case 'componentes':
      return import.meta.env.DEV ? <Vitrine /> : <NaoEncontrada />;
    case 'teste_erro':
      return import.meta.env.DEV ? <TelaQueQuebra /> : <NaoEncontrada />;
    default:
      return <NaoEncontrada />;
  }
}

export function App() {
  const rota = useRota();
  const online = useOnline();
  const aba = abaDaRota(rota);
  // A chave força a tela a montar de novo ao trocar de rota (foco no título, rolagem no topo).
  const chave = 'id' in rota && rota.id ? `${rota.tela}-${rota.id}` : rota.tela;
  return (
    <ProvedorEstado>
      <a className={css.pular} href="#conteudo" onClick={(e) => { e.preventDefault(); document.getElementById('conteudo')?.focus(); }}>
        Pular para o conteúdo
      </a>
      <div className={css.casca}>
        {/* O conteúdo rola aqui dentro; a barra inferior fica fora, sem cobrir nada. */}
        <div id="rolagem" className={css.rolagem}>
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
          <LimiteDeErro key={chave}>
            <Tela rota={rota} />
          </LimiteDeErro>
        </main>
        <footer className={css.rodape}>
          <DisclaimerBanner />
        </footer>
        </div>
        {aba && (
          <div className={css.barraInferior}>
            <TabBar
              value={aba}
              onChange={(id) => navegar(HREF_DA_ABA[id as Aba])}
              items={[
                { id: 'inicio', label: 'Início', icon: 'mapa' },
                { id: 'perguntar', label: 'Perguntar', icon: 'conversa' },
                { id: 'na_rua', label: 'Na rua', icon: 'onde_ir' },
                { id: 'sobre', label: 'Sobre', icon: 'lista' }
              ]}
            />
          </div>
        )}
      </div>
    </ProvedorEstado>
  );
}
