// Resultado da triagem: cada direito e serviço da base classificado pelo motor de regras.
import { CartaoDireito, FalaMapi } from '../../ui/assistente';
import { montarRota } from '../../core/regras';
import { tipoFonteNaTela } from '../../core/kb-schema';
import { PERGUNTAS, comoLista, perguntasNoModo, resumoEditavel, textoDaOpcao } from '../../core/perguntas';
import type { ItemRota } from '../../core/regras';
import { Titulo, Voltar } from '../comum';
import { KB } from '../dados';
import { useEstado } from '../estado';
import { href, navegar } from '../rotas';
import { LembrarRespostas } from '../LembrarRespostas';
import css from '../app.module.css';

// Resumo das respostas que a pessoa deu, sem as sensíveis (saúde, renda, idade, benefícios).
function resumoDasRespostas(respostas: Record<string, string | string[] | undefined>): string {
  return PERGUNTAS.filter((p) => !p.sensivel && respostas[p.id] !== undefined)
    // "Sim", "Não" e "Não sei" não se explicam fora da pergunta: ficam de fora do resumo.
    .flatMap((p) => comoLista(respostas[p.id]).filter((v) => !['prefiro_nao_responder', 'sim', 'nao', 'nao_sei'].includes(v)).map((v) => textoDaOpcao(p, v)))
    .join(' · ');
}

/** Lista de cartões de direitos (com o porquê e as três linhas fixas). */
function ListaDeDireitos({ itens, rotulo }: { itens: ItemRota[]; rotulo: string }) {
  if (!itens.length) return null;
  return (
    <ul className={css.pilha} style={{ listStyle: 'none', margin: 0, padding: 0 }} aria-label={rotulo}>
      {itens.map(({ entrada, classe, porque }) => (
        <li key={entrada.id}>
          <CartaoDireito
            hrefDetalhes={href.direito(entrada.id)}
            direito={{
              titulo: entrada.titulo,
              resumo: entrada.resumo,
              elegibilidade: classe,
              porque,
              tipoFonte: tipoFonteNaTela(entrada),
              oQueLevar: entrada.documentos?.join(', ') ?? '',
              ondeIr: entrada.onde?.texto ?? '',
              prazoTipico: entrada.prazo_tipico ?? ''
            }}
          />
        </li>
      ))}
    </ul>
  );
}

export function RotaDosDireitos() {
  const { respostas, limparRespostas, modo } = useEstado();
  const respondeu = Object.keys(respostas).length > 0;
  const rota = montarRota(KB, respostas, perguntasNoModo(modo));
  const naoAplica = rota.filter((i) => i.classe === 'nao');
  const temLaudo = rota.some((i) => i.classe !== 'nao' && i.entrada.requisitos_laudo?.length);
  const resumo = resumoDasRespostas(respostas);

  if (!respondeu) {
    return (
      <>
        <Voltar para={href.inicio} rotulo="Início" />
        <Titulo>Sua rota dos direitos</Titulo>
        <FalaMapi estado="esperando">Para montar sua rota, responda primeiro algumas perguntas sobre a situação.</FalaMapi>
        <a className={css.botaoPrincipal} href={href.triagem}>
          Descobrir o que posso pedir
        </a>
      </>
    );
  }

  return (
    <>
      <Voltar para={href.triagem} rotulo="Descobrir o que posso pedir" />
      <Titulo>Sua rota dos direitos</Titulo>
      {resumo && <p className={css.apoio}>{resumo}</p>}
      {rota.length ? (
        <FalaMapi estado="verificado">Cada resultado mostra a fonte e a data da conferência. Quem decide é sempre o órgão responsável.</FalaMapi>
      ) : (
        <FalaMapi estado="duvida">Não encontrei nenhum direito na minha base para essas respostas. Procure o órgão responsável.</FalaMapi>
      )}
      <ListaDeDireitos itens={rota.filter((i) => i.classe !== 'nao')} rotulo="Direitos e serviços que podem se aplicar" />
      {naoAplica.length > 0 && (
        <details className={css.porQue}>
          <summary>
            {naoAplica.length === 1 ? 'Ver 1 que provavelmente não se aplica' : `Ver ${naoAplica.length} que provavelmente não se aplicam`}
          </summary>
          <ListaDeDireitos itens={naoAplica} rotulo="Direitos e serviços que provavelmente não se aplicam" />
        </details>
      )}
      <details className={css.porQue}>
        <summary>Mudar uma resposta</summary>
        <ul className={css.listaSimples} style={{ marginTop: 12 }}>
          {resumoEditavel(respostas, perguntasNoModo(modo)).map((r) => (
            <li key={r.id} className={css.linhaIconeTextos}>
              <span className={css.apoio} style={{ margin: 0 }}>{r.pergunta}</span>
              <b>{r.resposta}</b>
              <a className={css.linkFonte} href={href.mudarResposta(r.id)}>
                Mudar<span className="visualmente-oculto"> a resposta de “{r.pergunta}”</span>
              </a>
            </li>
          ))}
        </ul>
      </details>
      <LembrarRespostas />
      {temLaudo && (
        <a className={css.botaoSecundario} href={href.laudo} style={{ textDecoration: 'none' }}>
          Ver a lista única para o laudo
        </a>
      )}
      <button
        type="button"
        className={css.botaoSecundario}
        onClick={() => {
          limparRespostas();
          navegar(href.triagem);
        }}
      >
        Apagar respostas e começar de novo
      </button>
    </>
  );
}
