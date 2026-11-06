// Detalhe de um direito ou serviço: o que levar (checklist), onde ir, prazo, se negarem e fonte.
import { Icon } from '../../../design-system/components/icons/Icon';
import {
  AvisoTipoFonte,
  Comemoracao,
  EligibilityChip,
  ItemChecklist,
  LinhaDoTempo,
  SourceChip,
  SourceTypeBadge
} from '../../ui/assistente';
import { avaliarEntrada } from '../../core/regras';
import { perguntasNoModo } from '../../core/perguntas';
import { citarNorma, textoChecklist } from '../../core/garantia';
import { AcoesDeTexto, BotaoOuvir } from '../../ui/acoes';
import { tipoFonteNaTela } from '../../core/kb-schema';
import { Titulo, Voltar } from '../comum';
import { entradaPorId } from '../dados';
import { useEstado } from '../estado';
import { href } from '../rotas';
import { NaoEncontrada } from './NaoEncontrada';
import css from '../app.module.css';

export function DetalheDireito({ id }: { id: string }) {
  const { respostas, marcados, alternarDocumento, modo } = useEstado();
  const entrada = entradaPorId(id);
  if (!entrada) return <NaoEncontrada />;

  const respondeu = Object.keys(respostas).length > 0;
  const avaliacao = respondeu && entrada.condicoes ? avaliarEntrada(entrada, respostas, perguntasNoModo(modo)) : null;
  const tipoFonte = tipoFonteNaTela(entrada);
  const documentos = entrada.documentos ?? [];
  const prontos = documentos.filter((d) => marcados[id]?.includes(d));
  const tudoPronto = documentos.length > 0 && prontos.length === documentos.length;

  return (
    <>
      {respondeu ? <Voltar para={href.rota} rotulo="Sua rota dos direitos" /> : <Voltar para={href.inicio} rotulo="Início" />}
      <div className={css.pilha}>
        <Titulo>{entrada.titulo}</Titulo>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
          {avaliacao && <EligibilityChip valor={avaliacao.classe} />}
          <SourceTypeBadge tipo={tipoFonte} />
        </div>
      </div>

      <section className={css.secao} aria-labelledby="quem-pode">
        <h2 id="quem-pode" className={css.subtitulo}>Quem pode</h2>
        <p className={css.texto}>{entrada.resumo}</p>
        <p className={css.apoio}>Para: {entrada.publico.join(', ')}.</p>
        {avaliacao && <p className={css.texto}>{avaliacao.porque}</p>}
        <BotaoOuvir texto={[entrada.titulo, entrada.resumo, avaliacao?.porque ?? ''].join('. ')} />
      </section>

      {documentos.length > 0 && (
        <section className={css.secao} aria-labelledby="documentos">
          <div className={css.cabecalhoSecao}>
            <h2 id="documentos" className={css.subtitulo}>O que levar</h2>
            <span className={css.contador} aria-live="polite">
              {prontos.length} de {documentos.length} prontos
            </span>
          </div>
          <p className={css.apoio}>Marque o que você já separou. Fica só nesta página.</p>
          {documentos.map((d) => (
            <ItemChecklist key={d} texto={d} marcado={prontos.includes(d)} aoAlternar={() => alternarDocumento(id, d)} />
          ))}
          {tudoPronto && entrada.onde && <Comemoracao titulo="Você juntou todos os documentos." texto={`Agora faça o pedido: ${entrada.onde.texto}`} />}
          <AcoesDeTexto titulo={`${entrada.titulo}: o que levar`} texto={textoChecklist(entrada, prontos)} />
        </section>
      )}

      {entrada.requisitos_laudo && entrada.requisitos_laudo.length > 0 && (
        <section className={css.secao} aria-labelledby="laudo">
          <h2 id="laudo" className={css.subtitulo}>O que o laudo precisa ter</h2>
          <ul className={css.listaPontos}>
            {entrada.requisitos_laudo.map((r) => (
              <li key={r}>{r}</li>
            ))}
          </ul>
        </section>
      )}

      {(entrada.onde || entrada.prazo_tipico) && (
        <section className={css.cartaoBranco} aria-label="Onde ir e prazo">
          {entrada.onde && (
            <div className={css.linhaIcone}>
              <span>
                <Icon name="onde_ir" size={24} />
              </span>
              <div className={css.linhaIconeTextos}>
                <b>Onde ir</b>
                <span>{entrada.onde.texto}</span>
                {entrada.onde.link && (
                  <a href={entrada.onde.link} target="_blank" rel="noopener noreferrer" style={{ minHeight: 48, display: 'inline-flex', alignItems: 'center', fontWeight: 800 }}>
                    Abrir o site do pedido<span className="visualmente-oculto"> (abre em nova aba)</span>
                  </a>
                )}
              </div>
            </div>
          )}
          {entrada.prazo_tipico && (
            <div className={css.linhaIcone}>
              <span>
                <Icon name="prazo" size={24} />
              </span>
              <div className={css.linhaIconeTextos}>
                <b>Prazo típico</b>
                <span>{entrada.prazo_tipico}</span>
              </div>
            </div>
          )}
        </section>
      )}

      {entrada.passos && entrada.passos.length > 0 && (
        <section className={css.secao} aria-labelledby="passos">
          <h2 id="passos" className={css.subtitulo}>Como pedir</h2>
          <LinhaDoTempo passos={entrada.passos} />
        </section>
      )}

      {entrada.se_negarem && entrada.se_negarem.length > 0 && (
        <section className={css.secao} aria-labelledby="se-negarem">
          <h2 id="se-negarem" className={css.subtitulo}>Se negarem</h2>
          <LinhaDoTempo passos={entrada.se_negarem} />
        </section>
      )}

      {(entrada.frase_motorista || entrada.modelo_recurso) && (
        <div className={`${css.acoesLinha} naoImprimir`}>
          {entrada.frase_motorista && entrada.base_legal && (
            <a className={css.botaoSecundario} href={href.motorista(entrada.id)} style={{ textDecoration: 'none' }}>
              Mostre ao motorista
            </a>
          )}
          {entrada.modelo_recurso && (
            <a className={css.botaoSecundario} href={href.negaram(entrada.id)} style={{ textDecoration: 'none' }}>
              Modelo de pedido se negarem
            </a>
          )}
        </div>
      )}

      {entrada.base_legal && (
        <section className={css.secao} aria-labelledby="base-legal">
          <h2 id="base-legal" className={css.subtitulo}>Base legal</h2>
          {entrada.base_legal.map((b) => (
            <SourceChip key={b.url} nome={citarNorma(b)} url={b.url} verificadoEm={entrada.verificado_em} />
          ))}
        </section>
      )}

      <section className={css.secao} aria-labelledby="fonte">
        <h2 id="fonte" className={css.subtitulo}>Fonte</h2>
        <AvisoTipoFonte tipo={tipoFonte} />
        <SourceChip nome={entrada.fonte_nome} url={entrada.fonte_url} verificadoEm={entrada.verificado_em} />
        <p className={css.apoio} style={{ fontWeight: 400 }}>
          <b style={{ color: 'var(--text-body)' }}>Limitação:</b> {entrada.limitacao}
        </p>
      </section>
    </>
  );
}
