// Resultado da triagem: cada direito e serviço da base classificado pelo motor de regras.
import { CartaoDireito, FalaMapi } from '../../ui/assistente';
import { montarRota } from '../../core/regras';
import { tipoFonteNaTela } from '../../core/kb-schema';
import { PERGUNTAS, comoLista, perguntasNoModo, textoDaOpcao } from '../../core/perguntas';
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

export function RotaDosDireitos() {
  const { respostas, limparRespostas, modo } = useEstado();
  const respondeu = Object.keys(respostas).length > 0;
  const rota = montarRota(KB, respostas, perguntasNoModo(modo));
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
      <ul className={css.pilha} style={{ listStyle: 'none', margin: 0, padding: 0 }} aria-label="Direitos e serviços">
        {rota.map(({ entrada, classe, porque }) => (
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
