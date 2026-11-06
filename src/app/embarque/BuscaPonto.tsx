// Embarque por ponto (guia v2): a pessoa digita o nome do ponto ou da rua, escolhe o ponto e vê
// o próximo ônibus acessível com o tempo de chegada, e quantos sem acessibilidade passam antes.
// Busca só pelo nome digitado: nunca usa a localização da pessoa.
import { useEffect, useId, useRef, useState, type FormEvent } from 'react';
import { Icon } from '../../../design-system/components/icons/Icon';
import { FalaMapi } from '../../ui/assistente';
import { falar } from '../../ui/acoes';
import { guardarUltimoPonto, lerUltimosPontos } from '../../core/lembrar';
import { armazenamentoDoNavegador } from '../../core/registro';
import { useEstado } from '../estado';
import {
  deveAvisar,
  emMinutos,
  frasePonto,
  mudouOProximo,
  horaSP,
  resumirPonto,
  validarTermoParada,
  type LinhaNoPonto,
  type Parada,
  type ResumoPonto
} from '../../../supabase/functions/_shared/embarque';
import { fichasParaMotorista } from '../../core/garantia';
import { PainelReclamacao } from '../reclamacao/PainelReclamacao';
import { KB } from '../dados';
import { href } from '../rotas';
import type { PedidoOnibus, RespostaCliente } from './cliente';
import { SELO_EXEMPLO } from './exemplo';
import css from '../app.module.css';

type Estado =
  | { fase: 'inicio' }
  | { fase: 'buscando' }
  | { fase: 'paradas'; paradas: Parada[] }
  | { fase: 'carregando'; parada: Parada }
  | { fase: 'previsao'; parada: Parada; linhas: LinhaNoPonto[]; referencia: string; consultadoEm: string; semAtualizar?: 'sem_internet' | 'falhou' }
  | { fase: 'erro'; mensagem: string; parada?: Parada };

/** De quanto em quanto tempo a previsão se atualiza sozinha. */
export const INTERVALO_ATUALIZACAO_MS = 30_000;

const hora = (d: string) =>
  new Intl.DateTimeFormat('pt-BR', { hour: '2-digit', minute: '2-digit', second: '2-digit', timeZone: 'America/Sao_Paulo' }).format(new Date(d));

export interface BuscaPontoProps {
  consultar: (p: PedidoOnibus) => Promise<RespostaCliente>;
  exemplo: boolean;
  agora: () => Date;
  /** A pessoa mexeu na tela (para o indicador de tempo). */
  aoInteragir: () => void;
  /** Chegou à previsão do ponto (fecha a medição de tempo como "achou"). */
  aoAchar: () => void;
  /** Mensagem para o leitor de tela. */
  anunciar: (m: string) => void;
}

export function BuscaPonto({ consultar, exemplo, agora, aoInteragir, aoAchar, anunciar }: BuscaPontoProps) {
  const id = useId();
  const [termo, setTermo] = useState('');
  const [erroCampo, setErroCampo] = useState('');
  const [estado, setEstado] = useState<Estado>({ fase: 'inicio' });
  const [reclamar, setReclamar] = useState(false);
  const temMotorista = fichasParaMotorista(KB).length > 0;
  const fonte = exemplo ? 'no exemplo' : 'segundo a SPTrans';
  const { lembrar } = useEstado();
  const armazenamento = useRef(armazenamentoDoNavegador()).current;
  const ultimos = lembrar ? lerUltimosPontos(armazenamento) : [];
  // Embarque ao vivo: atualiza sozinho, conta o tempo desde a consulta e avisa a chegada (se a pessoa pedir).
  const [pausado, setPausado] = useState(false);
  const [avisarChegada, setAvisarChegada] = useState(false);
  const [relogio, setRelogio] = useState(() => Date.now());
  const ultimoResumo = useRef<ResumoPonto | null>(null);
  const avisado = useRef<string | null>(null);
  const estadoAtual = useRef(estado);
  estadoAtual.current = estado;

  useEffect(() => {
    if (estado.fase === 'paradas' || estado.fase === 'previsao' || estado.fase === 'erro') {
      document.getElementById(`${id}-resultado`)?.scrollIntoView({ block: 'nearest', behavior: 'smooth' });
    }
  }, [estado.fase, id]);

  const falhou = (r: Extract<RespostaCliente, { ok: false }>, parada?: Parada) => {
    const mensagem = !exemplo
      ? r.mensagem
      : r.erro === 'linha_inexistente'
        ? 'Esse ponto não está no exemplo. Digite central, flores, praça ou exemplo.'
        : r.erro === 'sem_veiculos'
          ? 'Neste exemplo, nenhum ônibus está chegando a este ponto.'
          : r.mensagem;
    setEstado({ fase: 'erro', mensagem, parada });
    anunciar(mensagem);
  };

  const buscar = async (e: FormEvent) => {
    e.preventDefault();
    aoInteragir();
    const t = validarTermoParada(termo);
    if (!t.ok) return setErroCampo(t.mensagem);
    setErroCampo('');
    setEstado({ fase: 'buscando' });
    anunciar('Procurando o ponto.');
    const r = await consultar({ acao: 'paradas', termo: t.termo });
    if (!r.ok) return falhou(r);
    if (r.acao !== 'paradas') return falhou({ ok: false, erro: 'api_fora', mensagem: 'Resposta inesperada. Tente de novo.' });
    setEstado({ fase: 'paradas', paradas: r.paradas });
    anunciar(`Encontrei ${r.paradas.length === 1 ? '1 ponto' : `${r.paradas.length} pontos`}. Escolha o seu.`);
  };

  /**
   * "nova": escolheu o ponto (mostra "procurando"). "auto": atualização sozinha (só fala se mudou o próximo).
   * "atualizar": botão Atualizar. Nos dois últimos, se falhar, a última previsão continua na tela.
   */
  const verPrevisao = async (parada: Parada, modo: 'nova' | 'auto' | 'atualizar' = 'nova') => {
    const automatico = modo === 'auto';
    if (modo === 'nova') {
      ultimoResumo.current = null;
      setEstado({ fase: 'carregando', parada });
      anunciar(`Procurando os ônibus que chegam ao ponto ${parada.nome}.`);
    }
    const r = await consultar({ acao: 'previsao', codigo: parada.codigo });
    const ok = r.ok && r.acao === 'previsao';
    if (!ok) {
      // Sem internet ou falha ao atualizar: a última previsão continua na tela, com a hora dela e um aviso.
      const semAtualizar = typeof navigator !== 'undefined' && !navigator.onLine ? 'sem_internet' : 'falhou';
      const atual = estadoAtual.current;
      if (atual.fase === 'previsao' && atual.parada.codigo === parada.codigo) {
        setEstado({ ...atual, semAtualizar });
        if (!automatico) anunciar(semAtualizar === 'sem_internet' ? 'Sem internet. Mostrando a última consulta.' : 'Não consegui atualizar. Mostrando a última consulta.');
        return;
      }
      return falhou(r.ok ? { ok: false, erro: 'api_fora', mensagem: 'Resposta inesperada. Tente de novo.' } : r, parada);
    }
    if (!r.ok || r.acao !== 'previsao') return;
    const referencia = r.horaReferencia ?? horaSP(agora());
    const resumo = resumirPonto(r.linhas, referencia);
    setEstado({ fase: 'previsao', parada, linhas: r.linhas, referencia, consultadoEm: r.consultadoEm });
    setRelogio(Date.now());
    if (modo === 'nova') aoAchar();
    if (lembrar) guardarUltimoPonto(armazenamento, { codigo: parada.codigo, nome: parada.nome });
    // O leitor de tela só fala quando muda o próximo acessível, não a cada 30 segundos.
    if (!automatico || mudouOProximo(ultimoResumo.current, resumo)) anunciar(frasePonto(resumo));
    ultimoResumo.current = resumo;
    if (avisarChegada) {
      const aviso = deveAvisar(resumo, avisado.current);
      if (aviso) {
        avisado.current = aviso.chave;
        falar(aviso.frase);
        navigator.vibrate?.([200, 100, 200]);
        anunciar(aviso.frase);
      }
    }
  };

  // Atualiza a cada 30 s enquanto a previsão está na tela, a página está visível e a pessoa não pausou.
  const paradaAtual = estado.fase === 'previsao' ? estado.parada : null;
  useEffect(() => {
    if (!paradaAtual || pausado) return;
    const t = setInterval(() => {
      if (document.visibilityState === 'visible') verPrevisao(paradaAtual, 'auto');
    }, INTERVALO_ATUALIZACAO_MS);
    return () => clearInterval(t);
  }, [paradaAtual?.codigo, pausado, avisarChegada, lembrar]); // eslint-disable-line react-hooks/exhaustive-deps
  // "Atualizado há X s": relógio da tela, a cada 5 s.
  useEffect(() => {
    if (!paradaAtual) return;
    const t = setInterval(() => setRelogio(Date.now()), 5000);
    return () => clearInterval(t);
  }, [paradaAtual?.codigo]); // eslint-disable-line react-hooks/exhaustive-deps

  const resumo = estado.fase === 'previsao' ? resumirPonto(estado.linhas, estado.referencia) : null;

  return (
    <>
      <form className={css.pilha} onSubmit={buscar} noValidate role="search" aria-label="Buscar ponto de ônibus">
        <div className={css.campo}>
          <label htmlFor={id} style={{ fontSize: 17, fontWeight: 800 }}>
            Ponto de ônibus
          </label>
          <input
            id={id}
            className={css.campoTexto}
            value={termo}
            autoComplete="off"
            maxLength={40}
            placeholder="Ex.: Paulista ou Afonso Braz"
            aria-invalid={Boolean(erroCampo)}
            aria-describedby={`${id}-dica${erroCampo ? ` ${id}-erro` : ''}`}
            onChange={(e) => {
              aoInteragir();
              setTermo(e.target.value);
              if (erroCampo) setErroCampo('');
            }}
          />
          <span id={`${id}-dica`} style={{ fontSize: 16, lineHeight: '23px', color: 'var(--text-muted)' }}>
            {exemplo ? 'No exemplo, digite central, flores, praça ou exemplo.' : 'Nome do ponto ou da rua.'} Não usamos a sua localização.
          </span>
          {erroCampo && (
            <p id={`${id}-erro`} className={css.erroCampo} role="alert" style={{ margin: 0 }}>
              <Icon name="alerta" size={20} />
              {erroCampo}
            </p>
          )}
        </div>
        <button type="submit" className={css.botaoPrincipal} disabled={estado.fase === 'buscando' || estado.fase === 'carregando'}>
          <Icon name="busca" size={22} />
          Buscar ponto
        </button>
      </form>

      <section id={`${id}-resultado`} className={css.pilha} aria-label="Resultado">
        {estado.fase === 'inicio' && <FalaMapi estado="esperando">Digite o nome do ponto onde você vai esperar o ônibus.</FalaMapi>}
        {estado.fase === 'inicio' && ultimos.length > 0 && (
          <div className={css.sugestoes}>
            <span className={css.contador}>Últimos pontos</span>
            {ultimos.map((p) => (
              <button key={p.codigo} type="button" className={css.sugestao} onClick={() => verPrevisao({ codigo: p.codigo, nome: p.nome, endereco: '' })}>
                {p.nome}
              </button>
            ))}
          </div>
        )}
        {(estado.fase === 'buscando' || estado.fase === 'carregando') && (
          <FalaMapi estado="procurando">{estado.fase === 'buscando' ? 'Procurando o ponto.' : `Procurando os ônibus que chegam ao ponto ${estado.parada.nome}.`}</FalaMapi>
        )}

        {estado.fase === 'paradas' && (
          <>
            <FalaMapi estado="achei">Encontrei estes pontos. Escolha o seu.</FalaMapi>
            <ul className={css.listaSimples}>
              {estado.paradas.map((p) => (
                <li key={p.codigo}>
                  <button type="button" className={css.opcaoLinha} onClick={() => verPrevisao(p)}>
                    <b>{p.nome}</b>
                    {p.endereco && <span>{p.endereco}</span>}
                  </button>
                </li>
              ))}
            </ul>
          </>
        )}

        {estado.fase === 'previsao' && resumo && (
          <>
            <FalaMapi estado={resumo.proximaAcessivel ? 'achei' : 'atencao'}>Ponto {estado.parada.nome}.</FalaMapi>
            <div className={css.cartaoBranco}>
              {exemplo && (
                <p className={css.seloExemplo} role="note">
                  <Icon name="alerta" size={24} />
                  {SELO_EXEMPLO}
                </p>
              )}
              <p className={css.chegadaDestaque}>{frasePonto(resumo)}</p>
              {estado.semAtualizar && (
                <p className={css.alertaCampo} role="note" style={{ margin: 0 }}>
                  <span style={{ flex: 'none' }}>
                    <Icon name="alerta" size={22} />
                  </span>
                  {estado.semAtualizar === 'sem_internet' ? 'Sem internet agora.' : 'Não consegui atualizar agora.'} Esta é a consulta das {hora(estado.consultadoEm)}: os
                  ônibus já podem estar em outro lugar.
                </p>
              )}
              <p className={css.apoio} style={{ margin: 0 }}>
                Previsão {fonte}, consultada às {hora(estado.consultadoEm)}
                {!estado.semAtualizar && ` (há ${Math.max(0, Math.round((relogio - new Date(estado.consultadoEm).getTime()) / 1000))} s)`}.{' '}
                {pausado ? 'Atualização pausada.' : 'Atualiza sozinha a cada 30 segundos.'} O horário pode mudar com o trânsito.
              </p>
              <div className={css.acoesLinha}>
                <button type="button" className={css.botaoSecundario} aria-pressed={pausado} onClick={() => setPausado((p) => !p)}>
                  {pausado ? 'Retomar atualização' : 'Pausar atualização'}
                </button>
                <button
                  type="button"
                  className={avisarChegada ? css.botaoPrincipal : css.botaoSecundario}
                  aria-pressed={avisarChegada}
                  onClick={() => {
                    const ligar = !avisarChegada;
                    setAvisarChegada(ligar);
                    avisado.current = null;
                    anunciar(ligar ? 'Vou avisar com voz e vibração quando o ônibus acessível estiver a 2 minutos. Deixe esta tela aberta.' : 'Aviso de chegada desligado.');
                  }}
                >
                  <Icon name="alerta" size={22} />
                  {avisarChegada ? 'Aviso de chegada ligado' : 'Me avise quando estiver chegando'}
                </button>
              </div>
              {avisarChegada && (
                <p className={css.apoio} style={{ margin: 0 }}>
                  Aviso com voz e vibração quando o próximo ônibus acessível estiver a 2 minutos. Funciona com esta tela aberta.
                </p>
              )}
              <ul className={css.listaVeiculos} aria-label="Ônibus previstos, do mais próximo para o mais distante">
                {resumo.chegadas.map((c) => (
                  <li key={`${c.letreiro}-${c.prefixo}`}>
                    <span className={c.acessivel ? css.veiculoAcessivel : css.veiculoNaoAcessivel}>
                      <Icon name={c.acessivel ? 'check' : 'fechar'} size={20} />
                    </span>
                    <span>
                      <b>
                        {c.letreiro} {emMinutos(c.minutos)}
                      </b>
                      <span className={css.apoio} style={{ display: 'block', fontWeight: 600 }}>
                        {c.acessivel ? `Acessível, ${fonte}` : `Sem acessibilidade, ${fonte}`}
                        {c.destino ? ` · para ${c.destino}` : ''} · prefixo {c.prefixo}
                      </span>
                    </span>
                  </li>
                ))}
              </ul>
              <div className={css.acoesLinha}>
                <button type="button" className={css.botaoSecundario} onClick={() => verPrevisao(estado.parada, 'atualizar')}>
                  Atualizar
                </button>
                <button type="button" className={css.botaoSecundario} onClick={() => setEstado({ fase: 'inicio' })}>
                  Outro ponto
                </button>
              </div>
            </div>
            {temMotorista && (
              <a className={css.botaoSecundario} href={href.motorista()} style={{ alignSelf: 'flex-start', textDecoration: 'none' }}>
                <Icon name="escudo_check" size={22} />
                Negaram o embarque? Mostre ao motorista
              </a>
            )}
            <button type="button" className={css.botaoSecundario} aria-expanded={reclamar} onClick={() => setReclamar((r) => !r)} style={{ alignSelf: 'flex-start' }}>
              <Icon name="documento" size={22} />
              {reclamar ? 'Fechar reclamação' : 'Algo deu errado? Preparar reclamação'}
            </button>
            {reclamar && <PainelReclamacao linhaInicial={resumo.proximaAcessivel?.letreiro ?? ''} agora={agora} />}
          </>
        )}

        {estado.fase === 'erro' && (
          <>
            <FalaMapi estado="duvida">{estado.mensagem}</FalaMapi>
            {estado.parada && (
              <button type="button" className={css.botaoSecundario} onClick={() => verPrevisao(estado.parada!)}>
                Tentar de novo
              </button>
            )}
          </>
        )}
      </section>
    </>
  );
}
