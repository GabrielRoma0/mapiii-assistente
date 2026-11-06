// Início: os três atos do guia (Descubra, Prepare, Garanta na rua), "Me negaram", o verificador e os atalhos.
import { Logo } from '../../../design-system/components/brand/Logo';
import { FalaMapi, OpcoesEmCartao } from '../../ui/assistente';
import { atalhosComFichas, NOMES_ATALHOS } from '../../core/garantia';
import type { Modo } from '../../core/perguntas';
import { Entradas, Titulo, type ItemEntrada } from '../comum';
import { KB } from '../dados';
import { useEstado } from '../estado';
import { href } from '../rotas';
import { useTema } from '../tema';
import { AvisoRespostasGuardadas } from '../LembrarRespostas';
import { TamanhoTexto } from '../TamanhoTexto';
import { BoasVindas } from '../BoasVindas';
import { BotaoUmToque } from '../UmToque';
import css from '../app.module.css';

const ENTRADAS: ItemEntrada[] = [
  { href: href.triagem, icone: 'passos', titulo: 'Descobrir o que posso pedir', apoio: 'Responda algumas perguntas e veja o que pode se aplicar.', principal: true },
  { href: href.perguntar, icone: 'conversa', titulo: 'Fazer uma pergunta', apoio: 'Escreva ou fale com suas palavras.' },
  { href: href.naRua, icone: 'onde_ir', titulo: 'Garanta na rua', apoio: 'Ônibus acessível, mensagem para o motorista e reclamação.' },
  { href: href.negaram(), icone: 'documento', titulo: 'Me negaram, e agora?', apoio: 'O caminho de recurso e um modelo de pedido.' },
  { href: href.conferir, icone: 'escudo_check', titulo: 'Conferir se é oficial', apoio: 'Cole um link ou um valor cobrado.' }
];

export function Inicio() {
  const tema = useTema();
  const { modo, escolherModo, respostas, responder } = useEstado();
  const atalhos = atalhosComFichas(KB);

  const trocarModo = (m: Modo) => {
    escolherModo(m);
    // "Sou a pessoa" responde "Para quem é?" com "Para mim"; ao trocar para cuidador, essa resposta sai.
    if (m === 'pessoa') responder('p_quem', 'eu');
    else if (respostas.p_quem === 'eu') responder('p_quem', undefined);
  };

  return (
    <>
      <header className={css.topoInicio}>
        <Logo size={30} tone={tema === 'escuro' ? 'inverse' : 'color'} cut={tema === 'escuro' ? 'var(--bg-app)' : undefined} title="Mapiii" />
        <a className={css.linkTopo} href={href.sobre}>
          Sobre e fontes
        </a>
      </header>
      <FalaMapi estado="ola" size={64}>
        Olá. Eu ajudo você a entender direitos e serviços públicos em São Paulo.
      </FalaMapi>
      <Titulo grande>Seu mapa de direitos</Titulo>
      <TamanhoTexto />
      <BotaoUmToque />
      <AvisoRespostasGuardadas />
      <BoasVindas />
      <Entradas itens={ENTRADAS} rotulo="O que você quer fazer" />
      <OpcoesEmCartao<Modo>
        pergunta="Quem está usando?"
        opcoes={[
          { valor: 'pessoa', texto: 'Sou a pessoa com deficiência' },
          { valor: 'cuidador', texto: 'Cuido de alguém ou estou ajudando' }
        ]}
        valor={modo}
        aoEscolher={trocarModo}
      />
      {atalhos.length > 0 && (
        <section className={css.secao} aria-labelledby="atalhos">
          <h2 id="atalhos" className={css.subtitulo}>
            Atalhos
          </h2>
          <Entradas
            rotulo="Atalhos"
            itens={atalhos.map((a) => ({ href: href.atalho(a), icone: a === 'calcada' ? ('mapa' as const) : a === 'dirigir' ? ('carro' as const) : ('onde_ir' as const), ...NOMES_ATALHOS[a] }))}
          />
        </section>
      )}
    </>
  );
}
