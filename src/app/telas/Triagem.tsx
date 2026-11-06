// Descobrir o que posso pedir: triagem em passos. Só aparecem as perguntas que alguma condição da base usa.
// As respostas ficam só na memória (useEstado): nunca na URL nem em armazenamento.
import { useId, useState } from 'react';
import { Icon } from '../../../design-system/components/icons/Icon';
import { FalaMapi, OpcoesEmCartao, OpcoesMultiplasEmCartao } from '../../ui/assistente';
import { comoLista, opcoesNaTela, perguntasDaTriagem, perguntasNoModo, type Pergunta } from '../../core/perguntas';
import { Titulo, Voltar } from '../comum';
import { CAMPOS_USADOS } from '../dados';
import { useEstado } from '../estado';
import { href, navegar } from '../rotas';
import css from '../app.module.css';

function CampoDaPergunta({ pergunta, valor, aoMudar }: { pergunta: Pergunta; valor: string | string[] | undefined; aoMudar: (v: string | string[] | undefined) => void }) {
  const id = useId();
  const opcoes = opcoesNaTela(pergunta);
  if (pergunta.tipo === 'multipla') {
    return (
      <OpcoesMultiplasEmCartao
        pergunta={pergunta.texto}
        opcoes={opcoes}
        valores={comoLista(valor)}
        exclusivas={[...(pergunta.exclusivas ?? []), 'prefiro_nao_responder']}
        aoMudar={aoMudar}
      />
    );
  }
  if (pergunta.tipo === 'lista') {
    // Lista longa (ex.: 32 subprefeituras): um seletor nativo é mais fácil no celular e no leitor de tela.
    return (
      <div className={css.campo}>
        <label htmlFor={id} className={css.subtitulo} style={{ fontSize: 26, lineHeight: '32px' }}>
          {pergunta.texto}
        </label>
        <select id={id} className={css.campoTexto} value={typeof valor === 'string' ? valor : ''} onChange={(e) => aoMudar(e.target.value || undefined)}>
          <option value="">Escolha uma opção</option>
          {opcoes.map((o) => (
            <option key={o.valor} value={o.valor}>
              {o.texto}
            </option>
          ))}
        </select>
      </div>
    );
  }
  return <OpcoesEmCartao pergunta={pergunta.texto} opcoes={opcoes} valor={typeof valor === 'string' ? valor : null} aoEscolher={aoMudar} />;
}

export function Triagem() {
  const { respostas, responder, modo } = useEstado();
  const [passo, setPasso] = useState(0);
  const [faltou, setFaltou] = useState(false);
  // No modo "Sou a pessoa", a pergunta "Para quem é?" já está respondida (eu) e não aparece.
  const perguntas = perguntasDaTriagem(CAMPOS_USADOS, respostas, perguntasNoModo(modo)).filter((p) => !(modo === 'pessoa' && p.id === 'p_quem'));

  if (!perguntas.length) {
    return (
      <>
        <Voltar para={href.inicio} rotulo="Início" />
        <Titulo>Descobrir o que posso pedir</Titulo>
        <FalaMapi estado="duvida">A base ainda não tem direitos cadastrados, então não tenho perguntas para fazer. Tente “Fazer uma pergunta”.</FalaMapi>
      </>
    );
  }

  const atual = Math.min(passo, perguntas.length - 1);
  const pergunta = perguntas[atual];
  const ultima = atual === perguntas.length - 1;
  // Pergunta opcional de lista pode ficar sem resposta.
  const respondida = pergunta.tipo === 'lista' || comoLista(respostas[pergunta.id]).length > 0;

  const avancar = () => {
    if (!respondida) {
      setFaltou(true);
      return;
    }
    setFaltou(false);
    if (ultima) navegar(href.rota);
    else setPasso(atual + 1);
  };

  return (
    <>
      <Voltar
        rotulo="Descobrir o que posso pedir"
        aoVoltar={() => (atual === 0 ? navegar(href.inicio) : (setFaltou(false), setPasso(atual - 1)))}
      />
      {/* key: cada passo monta o título de novo e o foco vai para ele, para o leitor de tela anunciar a nova pergunta. */}
      <Titulo key={`titulo-${pergunta.id}`}>
        <span className="visualmente-oculto">Descobrir o que posso pedir: </span>
        Passo {atual + 1} de {perguntas.length}
      </Titulo>
      <div className={css.progresso} aria-hidden="true">
        <div className={css.barras} style={{ gridTemplateColumns: `repeat(${perguntas.length}, minmax(0, 1fr))` }}>
          {perguntas.map((p, i) => (
            <span key={p.id} className={i <= atual ? css.barraFeita : css.barra} />
          ))}
        </div>
      </div>

      <FalaMapi estado="ouvindo">{ultima ? 'Última pergunta. Depois mostro o que pode se aplicar.' : (pergunta.fala ?? 'Escolha a opção mais próxima.')}</FalaMapi>

      <div key={pergunta.id} className={css.pilha}>
        <CampoDaPergunta
          pergunta={pergunta}
          valor={respostas[pergunta.id]}
          aoMudar={(v) => {
            setFaltou(false);
            responder(pergunta.id, v);
          }}
        />
        <div aria-live="assertive">
          {faltou && (
            <p className={css.erroCampo} role="alert">
              <Icon name="alerta" size={20} />
              Escolha uma opção ou “Prefiro não responder”.
            </p>
          )}
        </div>
        <details className={css.porQue}>
          <summary>
            <Icon name="duvida" size={22} />
            Por que perguntamos isso?
          </summary>
          <p>{pergunta.por_que_perguntamos}</p>
        </details>
      </div>

      <p className={css.garantia}>
        <span style={{ flex: 'none' }}>
          <Icon name="escudo_check" size={22} />
        </span>
        Não pedimos nome, diagnóstico, idade exata nem renda exata.
      </p>

      <div className={css.acaoFixa}>
        <button type="button" className={css.botaoPrincipal} onClick={avancar}>
          {ultima ? 'Ver minha rota' : 'Continuar'}
        </button>
      </div>
    </>
  );
}
