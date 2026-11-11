// Componentes do assistente de direitos (design-system v2.0, "Mapiii Mapa dos Direitos.dc.html", seção 05):
// DisclaimerBanner, SourceChip, SourceTypeBadge, EligibilityChip, ChatBubble, WizardStep, Checklist,
// Timeline, ScamCheckResult, RightCard e AnswerCard.
import { useId, type ReactNode } from 'react';
import { Icon } from '../../design-system/components/icons/Icon';
import type { IconName } from '../../design-system/components/icons/Icon';
import { MapiPersonagem, ESTADOS_MAPI, type EstadoMapi } from './MapiPersonagem';
import type { TipoFonte } from '../core/kb-schema.ts';
import css from './assistente.module.css';

import { AVISO_PROTOTIPO_TEXTO } from '../core/avisos.ts';
import { haQuantosDias } from '../core/garantia.ts';
import { BotaoOuvir } from './acoes';

export const AVISO_PROTOTIPO = AVISO_PROTOTIPO_TEXTO;
export { AVISO_CHECAGEM } from '../core/oficial.ts';

export type { TipoFonte };
export type Elegibilidade = 'pode' | 'talvez' | 'nao';
export type ResultadoChecagem = 'oficial' | 'suspeito' | 'nao_sei';

/** "2026-10-28" → "28/10/2026". */
export function dataBR(iso: string): string {
  const [a, m, d] = iso.split('-');
  return a && m && d ? `${d}/${m}/${a}` : iso;
}

export function DisclaimerBanner({ className }: { className?: string }) {
  return (
    <div role="note" className={[css.aviso, className].filter(Boolean).join(' ')}>
      <span className={css.avisoIcone}>
        <Icon name="alerta" size={22} />
      </span>
      {AVISO_PROTOTIPO}
    </div>
  );
}

const TIPOS_FONTE: Record<TipoFonte, { icone: IconName; texto: string; classe: string }> = {
  oficial: { icone: 'escudo_check', texto: 'Fonte oficial', classe: css.tomOficial },
  secundaria: { icone: 'link', texto: 'Fonte secundária', classe: css.tomSecundaria },
  desatualizada: { icone: 'prazo', texto: 'Pode estar desatualizada', classe: css.tomAlerta }
};

export function SourceTypeBadge({ tipo }: { tipo: TipoFonte }) {
  const t = TIPOS_FONTE[tipo];
  return (
    <span className={`${css.pilula} ${css.fonte} ${t.classe}`}>
      <Icon name={t.icone} size={20} />
      {t.texto}
    </span>
  );
}

export const ELEGIBILIDADE: Record<Elegibilidade, { icone: IconName; texto: string; classe: string }> = {
  pode: { icone: 'ok', texto: 'Pode ter direito', classe: css.tomPode },
  talvez: { icone: 'duvida', texto: 'Talvez', classe: css.tomAlerta },
  nao: { icone: 'fechar', texto: 'Provavelmente não se aplica', classe: css.tomNao }
};

export function EligibilityChip({ valor }: { valor: Elegibilidade }) {
  const e = ELEGIBILIDADE[valor];
  return (
    <span className={`${css.pilula} ${css.elegibilidade} ${e.classe}`}>
      <Icon name={e.icone} size={20} />
      {e.texto}
    </span>
  );
}

/** Link da fonte: sempre abre em nova aba, com a data de verificação. */
export function SourceChip({ nome, url, verificadoEm }: { nome: string; url: string; verificadoEm: string }) {
  let dominio = '';
  try {
    dominio = new URL(url).hostname.replace(/^www\./, '');
  } catch {
    /* url inválida: mostra só o nome */
  }
  return (
    <a className={css.fonteLink} href={url} target="_blank" rel="noopener noreferrer">
      <span className={css.iconeMuted}>
        <Icon name="link" size={22} />
      </span>
      <span className={css.fonteLinkTextos}>
        <span className={css.fonteNome}>
          {nome}
          {dominio && ` · ${dominio}`}
          <span className="visualmente-oculto"> (abre em nova aba)</span>
        </span>
        <span className={css.fonteData}>
          verificado em {dataBR(verificadoEm)}
          {haQuantosDias(verificadoEm) && ` (${haQuantosDias(verificadoEm)})`}
        </span>
      </span>
    </a>
  );
}

/** Fala do assistente: Leco de 44 px, rótulo "Leco · Estado" e o texto. */
export function FalaMapi({ estado, size = 44, children }: { estado: EstadoMapi; size?: number; children?: ReactNode }) {
  return (
    <div className={css.falaMapi}>
      <MapiPersonagem estado={estado} size={size} />
      <div className={css.falaCorpo}>
        <span className={css.rotulo}>Leco · {ESTADOS_MAPI[estado].rotulo}</span>
        {children && <div className={css.baloaoMapi}>{children}</div>}
      </div>
    </div>
  );
}

export function FalaVoce({ children }: { children: ReactNode }) {
  return (
    <div className={css.falaVoce}>
      <span className={css.rotulo}>Você</span>
      <div className={css.baloaoVoce}>{children}</div>
    </div>
  );
}

/** WizardStep: grupo de opções em cartão de 72 px, com escolha única. */
export function OpcoesEmCartao<T extends string>({
  pergunta,
  opcoes,
  valor,
  aoEscolher
}: {
  pergunta: string;
  opcoes: { valor: T; texto: string }[];
  valor: T | null;
  aoEscolher: (v: T) => void;
}) {
  const id = useId();
  // Setas movem a escolha, como num grupo de rádio nativo.
  const mover = (atual: number, passo: number) => {
    const prox = (atual + passo + opcoes.length) % opcoes.length;
    aoEscolher(opcoes[prox].valor);
    document.getElementById(`${id}-${prox}`)?.focus();
  };
  const indiceFocavel = Math.max(0, opcoes.findIndex((o) => o.valor === valor));
  return (
    <fieldset className={css.opcoes}>
      <legend className={css.opcoesLegenda} id={`${id}-legenda`}>
        {pergunta}
      </legend>
      <div role="radiogroup" aria-labelledby={`${id}-legenda`} style={{ display: 'contents' }}>
        {opcoes.map((o, i) => {
          const marcada = o.valor === valor;
          return (
            <button
              key={o.valor}
              id={`${id}-${i}`}
              type="button"
              role="radio"
              aria-checked={marcada}
              tabIndex={i === indiceFocavel ? 0 : -1}
              className={css.opcao}
              onClick={() => aoEscolher(o.valor)}
              onKeyDown={(e) => {
                if (e.key === 'ArrowDown' || e.key === 'ArrowRight') {
                  e.preventDefault();
                  mover(i, 1);
                } else if (e.key === 'ArrowUp' || e.key === 'ArrowLeft') {
                  e.preventDefault();
                  mover(i, -1);
                }
              }}
            >
              <span className={css.marcaRadio}>{marcada && <Icon name="check" size={18} />}</span>
              {o.texto}
            </button>
          );
        })}
      </div>
    </fieldset>
  );
}

/** Grupo de opções em cartão com múltipla escolha. Escolher uma opção "exclusiva" desmarca as outras. */
export function OpcoesMultiplasEmCartao({
  pergunta,
  opcoes,
  valores,
  exclusivas = [],
  aoMudar
}: {
  pergunta: string;
  opcoes: { valor: string; texto: string }[];
  valores: string[];
  exclusivas?: string[];
  aoMudar: (v: string[]) => void;
}) {
  const alternar = (v: string) => {
    if (valores.includes(v)) return aoMudar(valores.filter((x) => x !== v));
    if (exclusivas.includes(v)) return aoMudar([v]);
    aoMudar([...valores.filter((x) => !exclusivas.includes(x)), v]);
  };
  return (
    <fieldset className={css.opcoes}>
      <legend className={css.opcoesLegenda}>{pergunta}</legend>
      {opcoes.map((o) => {
        const marcada = valores.includes(o.valor);
        return (
          <button key={o.valor} type="button" role="checkbox" aria-checked={marcada} className={css.opcao} onClick={() => alternar(o.valor)}>
            <span className={css.marcaCheck}>{marcada && <Icon name="check" size={20} />}</span>
            {o.texto}
          </button>
        );
      })}
    </fieldset>
  );
}

export function ItemChecklist({ texto, marcado, aoAlternar }: { texto: string; marcado: boolean; aoAlternar: () => void }) {
  return (
    <button type="button" role="checkbox" aria-checked={marcado} className={css.itemChecklist} onClick={aoAlternar}>
      <span className={css.marcaCheck}>{marcado && <Icon name="check" size={20} />}</span>
      <span>{texto}</span>
    </button>
  );
}

/** Aparece só quando todos os itens do checklist estão marcados. */
export function Comemoracao({ titulo, texto }: { titulo: string; texto: string }) {
  return (
    <div role="status" className={css.comemoracao}>
      <MapiPersonagem estado="comemorando" size={64} />
      <div className={css.falaCorpo}>
        <span className={css.rotulo}>Leco · Comemorando</span>
        <span style={{ fontSize: 19, lineHeight: '25px', fontWeight: 900 }}>{titulo}</span>
        <span style={{ fontSize: 16, lineHeight: '23px', fontWeight: 600 }}>{texto}</span>
      </div>
    </div>
  );
}

/** Timeline: usada em "Se negarem" e "Como funciona". */
export function LinhaDoTempo({ passos }: { passos: string[] }) {
  return (
    <ol className={css.linhaTempo}>
      {passos.map((p, i) => (
        <li key={i}>
          <span className={css.linhaTempoMarca} aria-hidden="true">
            <span className={css.numero}>{i + 1}</span>
            {i < passos.length - 1 && <span className={css.trilho} />}
          </span>
          <span className={css.linhaTempoTexto}>{p}</span>
        </li>
      ))}
    </ol>
  );
}

const CHECAGEM: Record<ResultadoChecagem, { icone: IconName; texto: string; estado: EstadoMapi; classe: string }> = {
  oficial: { icone: 'escudo_check', texto: 'Oficial', estado: 'verificado', classe: css.checagemOficial },
  suspeito: { icone: 'golpe', texto: 'Suspeito', estado: 'atencao', classe: css.checagemSuspeito },
  nao_sei: { icone: 'duvida', texto: 'Não sei', estado: 'duvida', classe: css.checagemNaoSei }
};

export function ResultadoChecagemSelo({ resultado }: { resultado: ResultadoChecagem }) {
  const c = CHECAGEM[resultado];
  return (
    <div className={`${css.checagem} ${c.classe}`}>
      <Icon name={c.icone} size={26} />
      {c.texto}
      <span className={css.checagemRotulo}>Leco · {ESTADOS_MAPI[c.estado].rotulo}</span>
    </div>
  );
}

/** Aviso destacado quando a fonte não é oficial. Ícone e texto, nunca só cor. */
export function AvisoTipoFonte({ tipo }: { tipo: TipoFonte }) {
  if (tipo === 'oficial') return null;
  const texto =
    tipo === 'secundaria'
      ? 'Esta fonte não é o texto oficial. Confira no site do órgão responsável antes de agir.'
      : 'Esta informação pode estar desatualizada. Confira no site do órgão responsável antes de agir.';
  return (
    <p className={css.avisoFonte}>
      <span style={{ flex: 'none' }}>
        <Icon name="alerta" size={22} />
      </span>
      {texto}
    </p>
  );
}

export interface DadosDireito {
  titulo: string;
  resumo: string;
  elegibilidade: Elegibilidade;
  porque: string;
  tipoFonte: TipoFonte;
  oQueLevar: string;
  ondeIr: string;
  prazoTipico: string;
}

/** RightCard: título, resumo, EligibilityChip, SourceTypeBadge, o porquê e três linhas fixas. */
/** No "Provavelmente não se aplica" o design mostra só o porquê, sem as três linhas. */
export function CartaoDireito({ direito, hrefDetalhes }: { direito: DadosDireito; hrefDetalhes: string }) {
  const linhas: [IconName, string, string][] = [
    ['documento', 'O que levar', direito.oQueLevar],
    ['onde_ir', 'Onde ir', direito.ondeIr],
    ['prazo', 'Quanto tempo costuma levar', direito.prazoTipico]
  ];
  return (
    <article className={css.cartao}>
      <div className={css.falaCorpo}>
        <h2 className={css.cartaoTitulo}>{direito.titulo}</h2>
        <p className={css.cartaoResumo}>{direito.resumo}</p>
      </div>
      <div className={css.chips}>
        <EligibilityChip valor={direito.elegibilidade} />
        <SourceTypeBadge tipo={direito.tipoFonte} />
      </div>
      <p className={css.porque}>{direito.porque}</p>
      {direito.elegibilidade !== 'nao' && (
      <dl className={css.linhas}>
        {linhas.map(([icone, rotulo, valor]) => (
          <div className={css.linha} key={rotulo}>
            <span className={css.iconeMuted}>
              <Icon name={icone} size={22} />
            </span>
            <div>
              <dt>{rotulo}</dt>
              <dd>{valor}</dd>
            </div>
          </div>
        ))}
      </dl>
      )}
      <a className={css.botaoContorno} href={hrefDetalhes} style={{ display: 'grid', placeItems: 'center', textDecoration: 'none' }}>
        Ver detalhes<span className="visualmente-oculto"> de {direito.titulo}</span>
      </a>
    </article>
  );
}

export function PerguntaAjudou({ voto, aoVotar }: { voto: boolean | null; aoVotar: (ajudou: boolean) => void }) {
  return (
    <div className={css.ajudou} role="group" aria-label="Esta resposta ajudou?">
      <span className={css.ajudouPergunta}>Esta resposta ajudou?</span>
      <div className={css.ajudouBotoes}>
        <button type="button" className={css.botaoContorno} aria-pressed={voto === true} onClick={() => aoVotar(true)}>
          Sim
        </button>
        <button type="button" className={css.botaoContorno} aria-pressed={voto === false} onClick={() => aoVotar(false)}>
          Não
        </button>
      </div>
      {voto !== null && (
        <span role="status" className={css.limitacao}>
          Obrigado. Seu voto fica só neste aparelho.
        </span>
      )}
    </div>
  );
}

export interface DadosResposta {
  resumo: string;
  passos: string[];
  fonteNome: string;
  fonteUrl: string;
  verificadoEm: string;
  tipoFonte: TipoFonte;
  limitacao: string;
  elegibilidade?: Elegibilidade;
}

/** AnswerCard: Resumo, Passos, Fonte (com tipo e data), Limitação, aviso de protótipo e "Esta resposta ajudou?". */
export function CartaoResposta({
  resposta,
  voto,
  aoVotar
}: {
  resposta: DadosResposta;
  voto: boolean | null;
  aoVotar: (ajudou: boolean) => void;
}) {
  return (
    <article className={css.cartao} style={{ gap: 16 }}>
      <section className={css.secao}>
        <h2 className={css.secaoTitulo}>Resumo</h2>
        <p className={css.texto}>{resposta.resumo}</p>
        <BotaoOuvir texto={[resposta.resumo, ...resposta.passos].join(' ')} rotulo="Ouvir a resposta" />
        {resposta.elegibilidade && (
          <span style={{ alignSelf: 'flex-start' }}>
            <EligibilityChip valor={resposta.elegibilidade} />
          </span>
        )}
      </section>
      {resposta.passos.length > 0 && (
        <section className={css.secao}>
          <h2 className={css.secaoTitulo}>Passos</h2>
          <ol className={css.passos}>
            {resposta.passos.map((p, i) => (
              <li key={i}>
                <b className={css.passoNumero} aria-hidden="true">
                  {i + 1}
                </b>
                {p}
              </li>
            ))}
          </ol>
        </section>
      )}
      <section className={css.secao}>
        <h2 className={css.secaoTitulo}>Fonte</h2>
        <span style={{ alignSelf: 'flex-start' }}>
          <SourceTypeBadge tipo={resposta.tipoFonte} />
        </span>
        <AvisoTipoFonte tipo={resposta.tipoFonte} />
        <SourceChip nome={resposta.fonteNome} url={resposta.fonteUrl} verificadoEm={resposta.verificadoEm} />
      </section>
      <p className={css.limitacao}>
        <b>Limitação:</b> {resposta.limitacao}
      </p>
      <DisclaimerBanner />
      <PerguntaAjudou voto={voto} aoVotar={aoVotar} />
    </article>
  );
}

/** Blocos cinza no lugar do conteúdo enquanto carrega. Decorativo: o "procurando" vai em texto no aria-live. */
export function Esqueleto({ linhas = 3 }: { linhas?: number }) {
  return (
    <div className={css.esqueleto} aria-hidden="true" data-esqueleto="">
      {Array.from({ length: linhas }, (_, i) => (
        <span key={i} className={css.esqueletoLinha} style={{ width: `${[92, 70, 84, 60][i % 4]}%` }} />
      ))}
    </div>
  );
}
