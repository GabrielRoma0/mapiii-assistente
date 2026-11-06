// "Me negaram, e agora?": o caminho de recurso de cada ficha e o modelo de pedido, com a lei.
// Tudo vem da base (se_negarem, modelo_recurso, base_legal). A pessoa completa os próprios dados fora do app.
import { FalaMapi, LinhaDoTempo, SourceChip } from '../../ui/assistente';
import { AcoesDeTexto, BotaoOuvir } from '../../ui/acoes';
import { MENSAGEM_ACOLHIMENTO } from '../../core/responder';
import { AVISO_JURIDICO, citarNorma, fichasParaNegativa, textoDoModelo } from '../../core/garantia';
import { Entradas, Titulo, Voltar } from '../comum';
import { KB } from '../dados';
import { href } from '../rotas';
import css from '../app.module.css';

export function Negaram({ id }: { id?: string }) {
  const fichas = fichasParaNegativa(KB);
  const ficha = id ? fichas.find((e) => e.id === id) : undefined;

  if (!ficha) {
    return (
      <>
        <Voltar para={href.inicio} rotulo="Início" />
        <Titulo>Me negaram, e agora?</Titulo>
        <FalaMapi estado="acolhimento">{MENSAGEM_ACOLHIMENTO}</FalaMapi>
        {fichas.length ? (
          <>
            <p className={css.texto}>O que foi negado?</p>
            <Entradas
              rotulo="Pedidos"
              itens={fichas.map((e) => ({
                href: href.negaram(e.id),
                icone: e.modelo_recurso ? ('documento' as const) : ('passos' as const),
                titulo: e.titulo,
                apoio: e.modelo_recurso ? 'Caminho de recurso e modelo de pedido.' : 'Caminho de recurso.'
              }))}
            />
          </>
        ) : (
          <FalaMapi estado="duvida">Ainda não tenho na base o caminho de recurso de nenhum pedido. Procure o órgão que negou ou a Defensoria Pública.</FalaMapi>
        )}
        <a className={css.linkFonte} href={href.reclamacao}>
          Negaram o embarque no ônibus? Preparar uma reclamação
        </a>
      </>
    );
  }

  const modelo = textoDoModelo(ficha);
  return (
    <>
      <Voltar para={href.negaram()} rotulo="Me negaram, e agora?" />
      <Titulo>{ficha.titulo}: se negarem</Titulo>
      <FalaMapi estado="acolhimento">Você não precisa resolver tudo hoje. Siga um passo de cada vez.</FalaMapi>

      {ficha.se_negarem && ficha.se_negarem.length > 0 && (
        <section className={css.secao} aria-labelledby="caminho">
          <h2 id="caminho" className={css.subtitulo}>
            Caminho
          </h2>
          <LinhaDoTempo passos={ficha.se_negarem} />
          <BotaoOuvir texto={`Se negarem. ${ficha.se_negarem.join(' ')}`} rotulo="Ouvir o caminho" />
        </section>
      )}

      {ficha.modelo_recurso && (
        <section className={css.secao} aria-labelledby="modelo">
          <h2 id="modelo" className={css.subtitulo}>
            Modelo de pedido
          </h2>
          <p className={css.apoio}>
            Para: <b style={{ color: 'var(--text-body)' }}>{ficha.modelo_recurso.para}</b>. Complete o que está entre parênteses no papel ou ao enviar. O app não
            guarda nada.
          </p>
          <pre className={css.modelo}>{modelo}</pre>
          <AcoesDeTexto titulo={ficha.modelo_recurso.titulo} texto={modelo} />
        </section>
      )}

      {ficha.base_legal && (
        <section className={css.secao} aria-labelledby="lei">
          <h2 id="lei" className={css.subtitulo}>
            Base legal
          </h2>
          {ficha.base_legal.map((b) => (
            <SourceChip key={b.url} nome={citarNorma(b)} url={b.url} verificadoEm={ficha.verificado_em} />
          ))}
        </section>
      )}

      <p className={css.alertaCampo} role="note" style={{ margin: 0 }}>
        {AVISO_JURIDICO}
      </p>
      <a className={css.linkFonte} href={href.direito(ficha.id)}>
        Ver tudo sobre {ficha.titulo}
      </a>
    </>
  );
}
