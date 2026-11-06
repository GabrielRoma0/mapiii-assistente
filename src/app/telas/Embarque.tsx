// Embarque garantido (atrás da flag EMBARQUE_ATIVO). Dois jeitos, sem nunca usar a localização da pessoa:
// - por ponto (padrão, guia v2): o próximo ônibus acessível que chega ao ponto, com o tempo de chegada;
// - por linha: quantos veículos de uma linha estão acessíveis agora. O app fala só com a Edge Function `onibus`.
import { useEffect, useId, useRef, useState, type FormEvent } from 'react';
import { Icon } from '../../../design-system/components/icons/Icon';
import { FalaMapi, SourceChip } from '../../ui/assistente';
import {
  DOC_CONFERIDA_EM,
  FONTE_OLHO_VIVO,
  SELO_TEMPO_REAL,
  fraseResumo,
  resumirVeiculos,
  validarTermoLinha,
  type Linha,
  type Veiculo
} from '../../../supabase/functions/_shared/embarque';
import { consultarOnibus, type PedidoOnibus, type RespostaCliente } from '../embarque/cliente';
import { consultarExemplo, SELO_EXEMPLO, type DadosExemplo } from '../embarque/exemplo';
import dadosExemplo from '../../../data/embarque-exemplo.json';
import { SUPABASE_CHAVE, SUPABASE_URL } from '../embarque/recurso';
import { PainelReclamacao } from '../reclamacao/PainelReclamacao';
import { BuscaPonto } from '../embarque/BuscaPonto';
import { armazenamentoDoNavegador, registrarEmbarque } from '../../core/registro';
import { Titulo, Voltar } from '../comum';
import { DOMINIOS } from '../dados';
import { href } from '../rotas';
import css from '../app.module.css';

type Estado =
  | { fase: 'inicio' }
  | { fase: 'buscando' }
  | { fase: 'linhas'; linhas: Linha[] }
  | { fase: 'carregando'; linha: Linha }
  | { fase: 'veiculos'; linha: Linha; veiculos: Veiculo[]; horaReferencia: string | null; consultadoEm: string }
  | { fase: 'erro'; mensagem: string; linha?: Linha };

const hora = (d: Date | string, segundos = false) =>
  new Intl.DateTimeFormat('pt-BR', { hour: '2-digit', minute: '2-digit', second: segundos ? '2-digit' : undefined, timeZone: 'America/Sao_Paulo' }).format(
    new Date(d)
  );

const minutosAtras = (d: string, agora: Date) => Math.max(0, Math.round((agora.getTime() - new Date(d).getTime()) / 60000));

const EXEMPLO = dadosExemplo as DadosExemplo;

/** Canal oficial da SPTrans, vindo da lista de sites oficiais conferida (data/dominios-oficiais.json). */
const SPTRANS = DOMINIOS.dominios.find((d) => d.dominio === 'sptrans.com.br');

function SeloTempoReal() {
  return (
    <p className={css.alertaCampo} role="note" style={{ margin: 0 }}>
      <span style={{ flex: 'none' }}>
        <Icon name="alerta" size={22} />
      </span>
      {SELO_TEMPO_REAL}
    </p>
  );
}

/** Selo do modo demonstração: aparece em todas as telas desse modo. */
function SeloExemplo() {
  return (
    <p className={css.seloExemplo} role="note">
      <Icon name="alerta" size={24} />
      {SELO_EXEMPLO}
    </p>
  );
}

function BotaoReclamar({ aberto, alternar }: { aberto: boolean; alternar: () => void }) {
  return (
    <button type="button" className={css.botaoSecundario} aria-expanded={aberto} onClick={alternar} style={{ alignSelf: 'flex-start' }}>
      <Icon name="documento" size={22} />
      {aberto ? 'Fechar reclamação' : 'Algo deu errado? Preparar reclamação'}
    </button>
  );
}

function CanalSptrans() {
  if (!SPTRANS) return null;
  return (
    <div className={css.cartaoBranco}>
      <span className={css.subtitulo} style={{ fontSize: 18 }}>
        Canal oficial
      </span>
      <SourceChip nome={SPTRANS.nome} url={SPTRANS.fonte_url} verificadoEm={SPTRANS.verificado_em} />
    </div>
  );
}

export interface EmbarqueProps {
  /** Injetável para testes e para o modo exemplo; padrão: a Edge Function `onibus`. */
  consultar?: (p: PedidoOnibus) => Promise<RespostaCliente>;
  /** Relógio injetável. */
  agora?: () => Date;
}

export function Embarque({ consultar = (p) => consultarOnibus(p, { url: SUPABASE_URL, chave: SUPABASE_CHAVE }), agora = () => new Date() }: EmbarqueProps) {
  const idCampo = useId();
  const [termo, setTermo] = useState('');
  const [erroCampo, setErroCampo] = useState('');
  const [estado, setEstado] = useState<Estado>({ fase: 'inicio' });
  const [anuncio, setAnuncio] = useState('');
  const [reclamar, setReclamar] = useState(false);
  const [busca, setBusca] = useState<'ponto' | 'linha'>('ponto');

  // Indicador "tempo até achar o ônibus certo" (registro local anônimo: só modo, segundos e achou).
  // Começa ao abrir a tela (ou ao trocar de modo) e para no primeiro resumo de veículos.
  // Quem só abre e sai sem mexer não gera registro; quem mexe e sai sem chegar ao resumo conta como "não achou".
  const armazenamento = useRef(armazenamentoDoNavegador()).current;
  const medicao = useRef({ inicio: performance.now(), interagiu: false, registrado: false, modo: 'real' as 'real' | 'exemplo' });
  const fecharMedicao = (achou: boolean) => {
    const m = medicao.current;
    if (m.registrado || (!achou && !m.interagiu)) return;
    m.registrado = true;
    registrarEmbarque(armazenamento, { modo: m.modo, segundos: (performance.now() - m.inicio) / 1000, achou });
  };
  useEffect(() => () => fecharMedicao(false), []); // eslint-disable-line react-hooks/exhaustive-deps
  // Plano B: "exemplo" usa dados fixos e fictícios (data/embarque-exemplo.json), sem rede.
  const [modo, setModo] = useState<'real' | 'exemplo'>('real');
  const exemplo = modo === 'exemplo';
  const consultarAgora = exemplo ? async (p: PedidoOnibus) => consultarExemplo(p, EXEMPLO, agora()) : consultar;
  const trocarModo = (novo: 'real' | 'exemplo') => {
    fecharMedicao(false);
    medicao.current = { inicio: performance.now(), interagiu: false, registrado: false, modo: novo };
    setModo(novo);
    setEstado({ fase: 'inicio' });
    setErroCampo('');
    setTermo('');
    setAnuncio(novo === 'exemplo' ? `Modo exemplo. ${SELO_EXEMPLO}.` : 'Modo tempo real.');
  };

  // No exemplo nada vem da SPTrans: as mensagens não podem dar a entender que vêm.
  const falhou = (r: Extract<RespostaCliente, { ok: false }>, linha?: Linha) => {
    const mensagem = !exemplo
      ? r.mensagem
      : r.erro === 'linha_inexistente'
        ? 'Essa linha não está no exemplo. Digite EX01, EX02, EX03 ou exemplo.'
        : r.erro === 'sem_veiculos'
          ? 'Neste exemplo, a linha está sem ônibus em operação.'
          : r.mensagem;
    setEstado({ fase: 'erro', mensagem, linha });
    setAnuncio(mensagem);
  };
  const fonteDoDado = exemplo ? 'no exemplo' : 'segundo a SPTrans';

  const buscarLinhas = async (e: FormEvent) => {
    e.preventDefault();
    medicao.current.interagiu = true;
    const t = validarTermoLinha(termo);
    if (!t.ok) {
      setErroCampo(t.mensagem);
      return;
    }
    setErroCampo('');
    setEstado({ fase: 'buscando' });
    setAnuncio(exemplo ? 'Procurando a linha no exemplo.' : 'Procurando a linha na SPTrans.');
    const r = await consultarAgora({ acao: 'linhas', termo: t.termo });
    if (!r.ok) return falhou(r);
    if (r.acao !== 'linhas') return falhou({ ok: false, erro: 'api_fora', mensagem: 'Resposta inesperada. Tente de novo.' });
    setEstado({ fase: 'linhas', linhas: r.linhas });
    setAnuncio(`Encontrei ${r.linhas.length === 1 ? '1 linha' : `${r.linhas.length} linhas`}. Escolha o sentido.`);
  };

  const verVeiculos = async (linha: Linha) => {
    setEstado({ fase: 'carregando', linha });
    setAnuncio(`Procurando os ônibus da linha ${linha.letreiro}.`);
    const r = await consultarAgora({ acao: 'veiculos', codigo: linha.codigo });
    if (!r.ok) return falhou(r, linha);
    if (r.acao !== 'veiculos') return falhou({ ok: false, erro: 'api_fora', mensagem: 'Resposta inesperada. Tente de novo.' }, linha);
    setEstado({ fase: 'veiculos', linha, veiculos: r.veiculos, horaReferencia: r.horaReferencia, consultadoEm: r.consultadoEm });
    fecharMedicao(true);
    const resumo = resumirVeiculos(r.veiculos, agora());
    setAnuncio(resumo ? fraseResumo(resumo) : '');
  };

  // Rola até o resultado novo sem tirar o foco de quem usa teclado.
  useEffect(() => {
    if (estado.fase === 'linhas' || estado.fase === 'veiculos' || estado.fase === 'erro') {
      document.getElementById('resultado-embarque')?.scrollIntoView({ block: 'nearest', behavior: 'smooth' });
    }
  }, [estado.fase]);

  const agoraTela = agora();
  const resumo = estado.fase === 'veiculos' ? resumirVeiculos(estado.veiculos, agoraTela) : null;

  return (
    <>
      <Voltar para={href.inicio} rotulo="Início" />
      <Titulo>Embarque garantido</Titulo>
      <p className={css.texto}>Veja o próximo ônibus que você consegue usar, segundo a SPTrans: os apps comuns mostram o próximo ônibus; aqui aparece o próximo acessível.</p>
      {exemplo ? <SeloExemplo /> : <SeloTempoReal />}
      <button type="button" className={css.botaoSecundario} style={{ alignSelf: 'flex-start' }} onClick={() => trocarModo(exemplo ? 'real' : 'exemplo')}>
        {exemplo ? 'Voltar ao tempo real' : 'Ver exemplo'}
      </button>

      <div className={css.abas} role="group" aria-label="Como buscar">
        <button type="button" className={busca === 'ponto' ? css.botaoPrincipal : css.botaoSecundario} aria-pressed={busca === 'ponto'} onClick={() => setBusca('ponto')}>
          Por ponto
        </button>
        <button type="button" className={busca === 'linha' ? css.botaoPrincipal : css.botaoSecundario} aria-pressed={busca === 'linha'} onClick={() => setBusca('linha')}>
          Por linha
        </button>
      </div>

      {busca === 'ponto' ? (
        <BuscaPonto
          key={modo}
          consultar={consultarAgora}
          exemplo={exemplo}
          agora={agora}
          aoInteragir={() => {
            medicao.current.interagiu = true;
          }}
          aoAchar={() => fecharMedicao(true)}
          anunciar={setAnuncio}
        />
      ) : (
        <>
      <form className={css.pilha} onSubmit={buscarLinhas} noValidate role="search" aria-label="Buscar linha de ônibus">
        <div className={css.campo}>
          <label htmlFor={idCampo} style={{ fontSize: 17, fontWeight: 800 }}>
            Linha de ônibus
          </label>
          <input
            id={idCampo}
            className={css.campoTexto}
            value={termo}
            inputMode="text"
            autoComplete="off"
            maxLength={20}
            placeholder="Ex.: 8000 ou Lapa"
            aria-invalid={Boolean(erroCampo)}
            aria-describedby={`${idCampo}-dica${erroCampo ? ` ${idCampo}-erro` : ''}`}
            onChange={(e) => {
              medicao.current.interagiu = true;
              setTermo(e.target.value);
              if (erroCampo) setErroCampo('');
            }}
          />
          <span id={`${idCampo}-dica`} style={{ fontSize: 16, lineHeight: '23px', color: 'var(--text-muted)' }}>
            {exemplo ? 'No exemplo, digite EX01, EX02, EX03 ou exemplo.' : 'Número ou nome da linha.'} Não usamos a sua localização.
          </span>
          {erroCampo && (
            <p id={`${idCampo}-erro`} className={css.erroCampo} role="alert" style={{ margin: 0 }}>
              <Icon name="alerta" size={20} />
              {erroCampo}
            </p>
          )}
        </div>
        <button type="submit" className={css.botaoPrincipal} disabled={estado.fase === 'buscando' || estado.fase === 'carregando'}>
          <Icon name="busca" size={22} />
          Buscar linha
        </button>
      </form>

      <p className="visualmente-oculto" aria-live="polite">
        {anuncio}
      </p>

      <section id="resultado-embarque" className={css.pilha} aria-label="Resultado">
        {estado.fase === 'inicio' && <FalaMapi estado="esperando">Digite o número ou o nome da linha que você quer pegar.</FalaMapi>}
        {(estado.fase === 'buscando' || estado.fase === 'carregando') && (
          <FalaMapi estado="procurando">
            {estado.fase === 'buscando'
              ? exemplo
                ? 'Procurando a linha no exemplo.'
                : 'Procurando a linha na SPTrans.'
              : `Procurando os ônibus da linha ${estado.linha.letreiro}.`}
          </FalaMapi>
        )}

        {estado.fase === 'linhas' && (
          <>
            <FalaMapi estado="achei">Encontrei estas linhas. Escolha o sentido.</FalaMapi>
            <ul className={css.pilha} style={{ listStyle: 'none', margin: 0, padding: 0 }}>
              {estado.linhas.map((l) => (
                <li key={l.codigo}>
                  <button type="button" className={css.opcaoLinha} onClick={() => verVeiculos(l)}>
                    <b>{l.letreiro}</b>
                    <span>{l.descricao || (l.circular ? 'Linha circular' : `Sentido ${l.sentido}`)}</span>
                  </button>
                </li>
              ))}
            </ul>
          </>
        )}

        {estado.fase === 'veiculos' && resumo && (
          <>
            <FalaMapi estado="achei">
              Linha {estado.linha.letreiro}
              {estado.linha.descricao ? `, ${estado.linha.descricao}` : ''}.
            </FalaMapi>
            <div className={css.cartaoBranco}>
              {exemplo && <SeloExemplo />}
              <p className={css.resumoEmbarque}>{fraseResumo(resumo)}</p>
              <p className={css.apoio} style={{ margin: 0 }}>
                Posição mais recente às {hora(resumo.ultimaPosicao)}. Consulta feita às {hora(estado.consultadoEm, true)}.
              </p>
              {resumo.desatualizado && (
                <p className={css.alertaCampo} style={{ margin: 0 }}>
                  <span style={{ flex: 'none' }}>
                    <Icon name="prazo" size={22} />
                  </span>
                  Dado desatualizado: a posição mais recente tem {minutosAtras(resumo.ultimaPosicao.toISOString(), agoraTela)} minutos. Atualize antes de decidir.
                </p>
              )}
              <ul className={css.listaVeiculos} aria-label={`Veículos da linha ${estado.linha.letreiro}`}>
                {resumo.lista.map((v) => (
                  <li key={v.prefixo}>
                    <span className={v.acessivel ? css.veiculoAcessivel : css.veiculoNaoAcessivel}>
                      <Icon name={v.acessivel ? 'check' : 'fechar'} size={20} />
                    </span>
                    <span>
                      <b>Prefixo {v.prefixo}</b>
                      <span className={css.apoio} style={{ display: 'block', fontWeight: 600 }}>
                        {v.acessivel ? `Acessível, ${fonteDoDado}` : `Não acessível, ${fonteDoDado}`}
                        {v.desatualizado ? ` · posição de ${minutosAtras(v.capturadoEm, agoraTela)} min atrás` : ''}
                      </span>
                    </span>
                  </li>
                ))}
              </ul>
              <div className={css.acoesLinha}>
                <button type="button" className={css.botaoSecundario} onClick={() => verVeiculos(estado.linha)}>
                  Atualizar
                </button>
                <button type="button" className={css.botaoSecundario} onClick={() => setEstado({ fase: 'inicio' })}>
                  Outra linha
                </button>
              </div>
            </div>
            <BotaoReclamar aberto={reclamar} alternar={() => setReclamar((r) => !r)} />
            {reclamar && <PainelReclamacao linhaInicial={estado.linha.letreiro} agora={agora} />}
          </>
        )}

        {estado.fase === 'erro' && (
          <>
            <FalaMapi estado="duvida">{estado.mensagem}</FalaMapi>
            {estado.linha && (
              <button type="button" className={css.botaoSecundario} onClick={() => verVeiculos(estado.linha!)}>
                Tentar de novo
              </button>
            )}
            {!exemplo && (
              <button type="button" className={css.botaoSecundario} onClick={() => trocarModo('exemplo')}>
                Ver exemplo
              </button>
            )}
            <CanalSptrans />
            {estado.linha && (
              <>
                <BotaoReclamar aberto={reclamar} alternar={() => setReclamar((r) => !r)} />
                {reclamar && <PainelReclamacao linhaInicial={estado.linha.letreiro} agora={agora} />}
              </>
            )}
          </>
        )}
      </section>

        </>
      )}
      {busca === 'ponto' && (
        <p className="visualmente-oculto" aria-live="polite">
          {anuncio}
        </p>
      )}

      <section className={css.secao} aria-labelledby="fonte-embarque">
        <h2 id="fonte-embarque" className={css.subtitulo}>
          Fonte
        </h2>
        {exemplo ? (
          <p className={css.texto}>{EXEMPLO.aviso} Vêm do arquivo data/embarque-exemplo.json, só para demonstração.</p>
        ) : (
          <SourceChip nome="SPTrans · API Olho Vivo" url={FONTE_OLHO_VIVO} verificadoEm={DOC_CONFERIDA_EM} />
        )}
        <p className={css.apoio} style={{ fontWeight: 400 }}>
          <b style={{ color: 'var(--text-body)' }}>Limitação:</b>{' '}
          {exemplo
            ? 'no exemplo, nada vem da SPTrans: os ônibus e os horários são inventados para mostrar como a tela funciona.'
            : '“acessível” é o que a SPTrans informa sobre cada veículo. O app não sabe se a rampa ou o elevador estão funcionando e não garante o embarque.'}
        </p>
      </section>
    </>
  );
}
