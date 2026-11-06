import { DisclaimerBanner } from './ui/assistente';
import { ProvedorEstado } from './app/estado';
import { abaDaRota, HREF_DA_ABA, navegar, useRota, type Aba, type Rota } from './app/rotas';
import { TabBar } from '../design-system/components/navigation/TabBar';
import { USANDO_EXEMPLO } from './app/dados';
import { useOnline } from './app/conexao';
import { Icon } from '../design-system/components/icons/Icon';
import { Inicio } from './app/telas/Inicio';
import { NaoEncontrada } from './app/telas/NaoEncontrada';
import { EMBARQUE_ATIVO } from './app/embarque/recurso';
import { LimiteDeErro, TelaQueQuebra } from './app/LimiteDeErro';
import { AvisoAtualizacao } from './app/AvisoAtualizacao';
import { ModoVarredura } from './ui/varredura';
import { useEstado } from './app/estado';
import { VELOCIDADES } from './core/varredura';
import css from './app/app.module.css';
import { lazy, Suspense } from 'react';

// Cada tela (menos o Início) carrega só quando é aberta: o app abre mais rápido em internet fraca.
// O service worker continua guardando todas para uso sem internet.
const Triagem = lazy(() => import('./app/telas/Triagem').then((m) => ({ default: m.Triagem })));
const RotaDosDireitos = lazy(() => import('./app/telas/RotaDosDireitos').then((m) => ({ default: m.RotaDosDireitos })));
const DetalheDireito = lazy(() => import('./app/telas/DetalheDireito').then((m) => ({ default: m.DetalheDireito })));
const Perguntar = lazy(() => import('./app/telas/Perguntar').then((m) => ({ default: m.Perguntar })));
const Conferir = lazy(() => import('./app/telas/Conferir').then((m) => ({ default: m.Conferir })));
const Sobre = lazy(() => import('./app/telas/Sobre').then((m) => ({ default: m.Sobre })));
const Embarque = lazy(() => import('./app/telas/Embarque').then((m) => ({ default: m.Embarque })));
const Reclamacao = lazy(() => import('./app/telas/Reclamacao').then((m) => ({ default: m.Reclamacao })));
const NaRua = lazy(() => import('./app/telas/NaRua').then((m) => ({ default: m.NaRua })));
const Negaram = lazy(() => import('./app/telas/Negaram').then((m) => ({ default: m.Negaram })));
const Motorista = lazy(() => import('./app/telas/Motorista').then((m) => ({ default: m.Motorista })));
const Cartao = lazy(() => import('./app/telas/Cartao').then((m) => ({ default: m.Cartao })));
const Atalho = lazy(() => import('./app/telas/Atalho').then((m) => ({ default: m.Atalho })));
const Laudo = lazy(() => import('./app/telas/Laudo').then((m) => ({ default: m.Laudo })));
const Vitrine = lazy(() => import('./vitrine/Vitrine').then((m) => ({ default: m.Vitrine })));

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

/** Liga o modo um toque quando a pessoa pede (Início ou Sobre). */
function VarreduraSeLigada() {
  const { varredura, ligarVarredura, velocidade } = useEstado();
  return varredura ? <ModoVarredura intervaloMs={VELOCIDADES[velocidade]} aoSair={() => ligarVarredura(false)} /> : null;
}

export function App() {
  const rota = useRota();
  const online = useOnline();
  const aba = abaDaRota(rota);
  // A chave força a tela a montar de novo ao trocar de rota (foco no título, rolagem no topo).
  const chave = 'id' in rota && rota.id ? `${rota.tela}-${rota.id}` : rota.tela;
  return (
    <ProvedorEstado>
      <a className={css.pular} data-varredura-ignorar="" href="#conteudo" onClick={(e) => { e.preventDefault(); document.getElementById('conteudo')?.focus(); }}>
        Pular para o conteúdo
      </a>
      <div className={css.casca}>
        {/* O conteúdo rola aqui dentro; a barra inferior fica fora, sem cobrir nada. */}
        <VarreduraSeLigada />
        <div id="rolagem" className={css.rolagem}>
          <AvisoAtualizacao />
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
        <main key={chave} id="conteudo" tabIndex={-1} className={css.conteudo}>
          <LimiteDeErro key={chave}>
            <Suspense fallback={<p className={css.apoio} role="status">Carregando…</p>}>
              <Tela rota={rota} />
            </Suspense>
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
