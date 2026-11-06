// Embarque por ponto (guia v2): a pessoa digita o nome do ponto ou da rua, escolhe o ponto e vê
// o próximo ônibus acessível com o tempo de chegada, e quantos sem acessibilidade passam antes.
// Busca só pelo nome digitado: nunca usa a localização da pessoa.
import { useEffect, useId, useState, type FormEvent } from 'react';
import { Icon } from '../../../design-system/components/icons/Icon';
import { FalaMapi } from '../../ui/assistente';
import {
  emMinutos,
  frasePonto,
  horaSP,
  resumirPonto,
  validarTermoParada,
  type LinhaNoPonto,
  type Parada
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
  | { fase: 'previsao'; parada: Parada; linhas: LinhaNoPonto[]; referencia: string; consultadoEm: string }
  | { fase: 'erro'; mensagem: string; parada?: Parada };

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

  const verPrevisao = async (parada: Parada) => {
    setEstado({ fase: 'carregando', parada });
    anunciar(`Procurando os ônibus que chegam ao ponto ${parada.nome}.`);
    const r = await consultar({ acao: 'previsao', codigo: parada.codigo });
    if (!r.ok) return falhou(r, parada);
    if (r.acao !== 'previsao') return falhou({ ok: false, erro: 'api_fora', mensagem: 'Resposta inesperada. Tente de novo.' }, parada);
    const referencia = r.horaReferencia ?? horaSP(agora());
    setEstado({ fase: 'previsao', parada, linhas: r.linhas, referencia, consultadoEm: r.consultadoEm });
    aoAchar();
    anunciar(frasePonto(resumirPonto(r.linhas, referencia)));
  };

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
              <p className={css.apoio} style={{ margin: 0 }}>
                Previsão {fonte}, consultada às {hora(estado.consultadoEm)}. O horário pode mudar com o trânsito.
              </p>
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
                <button type="button" className={css.botaoSecundario} onClick={() => verPrevisao(estado.parada)}>
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
