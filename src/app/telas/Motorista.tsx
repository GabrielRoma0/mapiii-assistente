// "Mostre ao motorista": tela em letra grande para virar para o motorista ou atendente.
// A frase, a lei e o link vêm só da ficha (frase_motorista e base_legal). O QR abre o texto oficial da lei.
import { FalaMapi, SourceChip } from '../../ui/assistente';
import { AVISO_SEGURANCA, citarNorma, fichasParaMotorista } from '../../core/garantia';
import { qrParaSvg } from '../../core/qr';
import { Entradas, Titulo, Voltar } from '../comum';
import { KB } from '../dados';
import { href } from '../rotas';
import css from '../app.module.css';

function Qr({ url, rotulo }: { url: string; rotulo: string }) {
  let desenho: { lado: number; caminho: string } | null = null;
  try {
    desenho = qrParaSvg(url);
  } catch {
    desenho = null; // link longo demais para o QR: fica só o link escrito
  }
  if (!desenho) return null;
  return (
    <div className={css.qr}>
      <svg viewBox={`0 0 ${desenho.lado} ${desenho.lado}`} role="img" aria-label={rotulo} shapeRendering="crispEdges">
        <rect width={desenho.lado} height={desenho.lado} fill="var(--mapi-white)" />
        <path d={desenho.caminho} fill="var(--mapi-indigo-900)" />
      </svg>
    </div>
  );
}

export function Motorista({ id }: { id?: string }) {
  const fichas = fichasParaMotorista(KB);
  const ficha = id ? fichas.find((e) => e.id === id) : fichas.length === 1 ? fichas[0] : undefined;

  if (!ficha) {
    return (
      <>
        <Voltar para={href.naRua} rotulo="Garanta na rua" />
        <Titulo>Mostre ao motorista</Titulo>
        {fichas.length ? (
          <>
            <FalaMapi estado="ouvindo">Escolha a situação. A próxima tela fica em letra grande, para mostrar ao motorista ou atendente.</FalaMapi>
            <Entradas
              rotulo="Situações"
              itens={fichas.map((e) => ({ href: href.motorista(e.id), icone: 'escudo_check' as const, titulo: e.titulo, apoio: citarNorma(e.base_legal![0]) }))}
            />
          </>
        ) : (
          <FalaMapi estado="duvida">Ainda não tenho na base uma frase conferida com a lei para mostrar ao motorista.</FalaMapi>
        )}
      </>
    );
  }

  const lei = ficha.base_legal![0];
  return (
    <>
      <Voltar para={fichas.length > 1 ? href.motorista() : href.naRua} rotulo={fichas.length > 1 ? 'Mostre ao motorista' : 'Garanta na rua'} />
      <Titulo>Mostre ao motorista</Titulo>
      <section className={css.telaMotorista} aria-label="Texto para mostrar">
        <p className={css.fraseMotorista} lang="pt-BR">
          {ficha.frase_motorista}
        </p>
        {ficha.base_legal!.map((b) => (
          <p key={b.url + b.norma} className={css.normaMotorista}>
            {citarNorma(b)}
          </p>
        ))}
        <Qr url={lei.url} rotulo={`QR code com o link oficial: ${citarNorma(lei)}`} />
        <p className={css.normaMotorista} style={{ fontSize: 17, lineHeight: '24px', textAlign: 'center' }}>
          Aponte a câmera para ver a fonte oficial.
        </p>
      </section>
      <p className={css.alertaCampo} role="note" style={{ margin: 0 }}>
        {AVISO_SEGURANCA}
      </p>
      <section className={css.secao} aria-labelledby="fonte-motorista">
        <h2 id="fonte-motorista" className={css.subtitulo}>
          Fonte
        </h2>
        {ficha.base_legal!.map((b) => (
          <SourceChip key={b.url} nome={citarNorma(b)} url={b.url} verificadoEm={ficha.verificado_em} />
        ))}
        <p className={css.apoio} style={{ fontWeight: 400 }}>
          <b style={{ color: 'var(--text-body)' }}>Limitação:</b> {ficha.limitacao}
        </p>
        <a className={css.linkFonte} href={href.reclamacao}>
          Preparar uma reclamação
        </a>
      </section>
    </>
  );
}
