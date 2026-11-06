// Fazer uma pergunta: busca própria na base, com recusas, emergência e "não encontrei".
// A conversa fica só na memória desta tela. Texto recusado por dado pessoal não aparece nem fica guardado.
// Cada busca gera um registro anônimo neste aparelho (src/core/registro.ts): tema, achou, segundos e voto.
import { useEffect, useId, useRef, useState, type FormEvent } from 'react';
import { Icon } from '../../../design-system/components/icons/Icon';
import { CartaoResposta, FalaMapi, FalaVoce, SourceChip } from '../../ui/assistente';
import { BotaoFalar } from '../../ui/acoes';
import { sugerirPerguntas } from '../../core/busca';
import { perguntasNoModo } from '../../core/perguntas';
import { CONFIG } from '../../core/config';
import { responderPergunta, passosDaEntrada, MENSAGEM_ACOLHIMENTO, type RespostaPergunta } from '../../core/responder';
import { MENSAGEM_EMERGENCIA } from '../../core/validar';
import { avaliarEntrada } from '../../core/regras';
import { tipoFonteNaTela, type Entrada } from '../../core/kb-schema';
import {
  armazenamentoDoNavegador,
  registrar,
  registrarVoto,
  temaDaEntrada,
  TEMA_FORA_DO_TEMA,
  TEMA_SEM_RESPOSTA
} from '../../core/registro';
import { Titulo, Voltar } from '../comum';
import { CANAL_OFICIAL_ID, INDICE, KB } from '../dados';
import { useEstado } from '../estado';
import { href } from '../rotas';
import css from '../app.module.css';

// registro: posição no registro anônimo, para gravar o voto; null quando a busca não foi registrada.
type Conteudo = { de: 'voce'; texto: string } | { de: 'mapi'; resposta: RespostaPergunta; registro: number | null };
type Mensagem = Conteudo & { id: number };

// Recusas que são só erro de preenchimento aparecem junto do campo, não na conversa.
const ERROS_DE_CAMPO = new Set(['vazio', 'curto', 'longo', 'simbolos_numeros']);

function Exemplos({ aoEscolher, titulo }: { aoEscolher: (t: string) => void; titulo: string }) {
  const exemplos = KB.filter((e) => e.tipo !== 'norma').slice(0, 2).map((e) => e.perguntas_exemplo[0]);
  if (!exemplos.length) return null;
  return (
    <div className={css.sugestoes}>
      <span className={css.contador}>{titulo}</span>
      {exemplos.map((t) => (
        <button key={t} type="button" className={css.sugestao} onClick={() => aoEscolher(t)}>
          {t}
        </button>
      ))}
    </div>
  );
}

function Sugestoes({ entradas, titulo, aoAbrir }: { entradas: Entrada[]; titulo: string; aoAbrir: (e: Entrada) => void }) {
  if (!entradas.length) return null;
  return (
    <div className={css.sugestoes}>
      <span className={css.contador}>{titulo}</span>
      {entradas.map((e) => (
        <button key={e.id} type="button" className={css.sugestao} onClick={() => aoAbrir(e)}>
          {e.titulo}
        </button>
      ))}
    </div>
  );
}

export function Perguntar() {
  const { respostas, modo } = useEstado();
  const idCampo = useId();
  const [texto, setTexto] = useState('');
  const [erroCampo, setErroCampo] = useState('');
  const [alertaPessoal, setAlertaPessoal] = useState(false);
  const [mensagens, setMensagens] = useState<Mensagem[]>([]);
  const [votos, setVotos] = useState<Record<number, boolean>>({});
  const [anuncio, setAnuncio] = useState('');
  const proximoId = useRef(1);
  const fimDaConversa = useRef<HTMLDivElement>(null);
  const respondeuTriagem = Object.keys(respostas).length > 0;
  // Sugestões enquanto digita (a partir de 3 letras), tiradas das perguntas de exemplo das fichas.
  const sugestoes = erroCampo ? [] : sugerirPerguntas(texto, INDICE);
  const armazenamento = useRef(armazenamentoDoNavegador()).current;
  // "Segundos até a resposta": do primeiro toque ou tecla no campo (ou clique numa sugestão) até a resposta aparecer.
  const inicio = useRef<number | null>(null);
  const marcarInicio = () => {
    if (inicio.current === null) inicio.current = performance.now();
  };

  useEffect(() => {
    if (mensagens.length) fimDaConversa.current?.scrollIntoView({ block: 'nearest', behavior: 'smooth' });
  }, [mensagens.length]);

  const novaMensagem = (m: Conteudo): Mensagem => ({ ...m, id: proximoId.current++ });

  const mostrarEntrada = (entrada: Entrada) => {
    setMensagens((ms) => [
      ...ms,
      novaMensagem({ de: 'mapi', resposta: { tipo: 'resposta', entrada, pontuacao: 1, sugestoes: [], acolher: false }, registro: null })
    ]);
    setAnuncio(`Resposta: ${entrada.titulo}.`);
  };

  const enviar = (pergunta: string) => {
    const r = responderPergunta(pergunta, INDICE, { canalOficialId: CANAL_OFICIAL_ID });
    if (r.tipo === 'recusa' && ERROS_DE_CAMPO.has(r.motivo)) {
      setErroCampo(r.motivo === 'vazio' ? 'Escreva sua pergunta antes de enviar.' : r.mensagem);
      setAnuncio('');
      return;
    }
    setErroCampo('');
    setTexto('');
    const segundos = inicio.current === null ? 0 : (performance.now() - inicio.current) / 1000;
    inicio.current = null;
    // Recusas (emergência, dado pessoal, conselho) não entram no registro.
    const registro =
      r.tipo === 'recusa'
        ? null
        : registrar(armazenamento, {
            tema: r.tipo === 'resposta' ? temaDaEntrada(r.entrada) : r.tipo === 'fora_do_tema' ? TEMA_FORA_DO_TEMA : TEMA_SEM_RESPOSTA,
            achou: r.tipo === 'resposta',
            segundos
          });
    if (r.tipo === 'recusa' && r.motivo === 'dados_pessoais') {
      // O texto com dado pessoal não entra na conversa.
      setAlertaPessoal(true);
      setMensagens((ms) => [...ms, novaMensagem({ de: 'mapi', resposta: r, registro: null })]);
      setAnuncio(r.mensagem);
      return;
    }
    setAlertaPessoal(false);
    setMensagens((ms) => [...ms, novaMensagem({ de: 'voce', texto: pergunta.trim() }), novaMensagem({ de: 'mapi', resposta: r, registro })]);
    setAnuncio(r.tipo === 'resposta' ? `Resposta: ${r.entrada.titulo}.` : r.mensagem);
  };

  const aoEnviar = (e: FormEvent) => {
    e.preventDefault();
    enviar(texto);
  };

  const respostaDaEntrada = (m: Extract<Mensagem, { de: 'mapi' }>, entrada: Entrada) => (
    <CartaoResposta
      resposta={{
        resumo: entrada.resumo,
        passos: passosDaEntrada(entrada),
        fonteNome: entrada.fonte_nome,
        fonteUrl: entrada.fonte_url,
        verificadoEm: entrada.verificado_em,
        tipoFonte: tipoFonteNaTela(entrada),
        limitacao: entrada.limitacao,
        elegibilidade: respondeuTriagem && entrada.condicoes ? avaliarEntrada(entrada, respostas, perguntasNoModo(modo)).classe : undefined
      }}
      voto={votos[m.id] ?? null}
      aoVotar={(v) => {
        setVotos((vs) => ({ ...vs, [m.id]: v }));
        if (m.registro !== null) registrarVoto(armazenamento, m.registro, v);
      }}
    />
  );

  const renderMapi = (m: Extract<Mensagem, { de: 'mapi' }>) => {
    const r = m.resposta;
    switch (r.tipo) {
      case 'recusa':
        if (r.motivo === 'emergencia') {
          return (
            <div className={css.pilha}>
              <FalaMapi estado="atencao">
                <b>{MENSAGEM_EMERGENCIA}</b>
              </FalaMapi>
              <a className={css.ligar} href="tel:192">
                Ligar para 192
              </a>
            </div>
          );
        }
        return <FalaMapi estado="recusa">{r.mensagem}</FalaMapi>;
      case 'fora_do_tema':
        return (
          <div className={css.pilha}>
            <FalaMapi estado="recusa">{r.mensagem}</FalaMapi>
            <Exemplos
              titulo="Você pode perguntar, por exemplo:"
              aoEscolher={(t) => {
                marcarInicio();
                enviar(t);
              }}
            />
          </div>
        );
      case 'nao_encontrei':
        return (
          <div className={css.pilha}>
            {r.acolher && <FalaMapi estado="acolhimento">{MENSAGEM_ACOLHIMENTO}</FalaMapi>}
            {r.acolher && (
              <a className={css.sugestao} href={href.negaram()} style={{ textDecoration: 'none' }}>
                Me negaram, e agora? Ver o caminho de recurso
              </a>
            )}
            <FalaMapi estado="duvida">
              <b>Não encontrei isso na minha base.</b> {r.mensagem.replace('Não encontrei isso na minha base. ', '')}
            </FalaMapi>
            {r.canal ? (
              <div className={css.cartaoBranco}>
                <span className={css.subtitulo}>{r.canal.titulo}</span>
                {r.canal.onde && <span className={css.texto}>{r.canal.onde.texto}</span>}
                <SourceChip nome={r.canal.fonte_nome} url={r.canal.fonte_url} verificadoEm={r.canal.verificado_em} />
              </div>
            ) : (
              <p className={css.apoio}>Procure o órgão responsável pelo assunto.</p>
            )}
            <Sugestoes titulo="Você quis dizer?" entradas={r.sugestoes.map((s) => s.entrada)} aoAbrir={mostrarEntrada} />
          </div>
        );
      case 'resposta':
        return (
          <div className={css.pilha}>
            {r.acolher && <FalaMapi estado="acolhimento">{MENSAGEM_ACOLHIMENTO}</FalaMapi>}
            {r.acolher && (
              <a className={css.sugestao} href={href.negaram()} style={{ textDecoration: 'none' }}>
                Me negaram, e agora? Ver o caminho de recurso
              </a>
            )}
            <FalaMapi estado="achei">{r.entrada.titulo}</FalaMapi>
            {respostaDaEntrada(m, r.entrada)}
            <Sugestoes titulo="Outras respostas parecidas" entradas={r.sugestoes.map((s) => s.entrada)} aoAbrir={mostrarEntrada} />
          </div>
        );
    }
  };

  return (
    <>
      <Voltar para={href.inicio} rotulo="Início" />
      <Titulo>Fazer uma pergunta</Titulo>

      <section className={css.conversa} aria-label="Conversa">
        {!mensagens.length && <FalaMapi estado="esperando">Escreva sua dúvida do seu jeito. Pode ser curta.</FalaMapi>}
        {mensagens.map((m) => (
          <div key={m.id}>{m.de === 'voce' ? <FalaVoce>{m.texto}</FalaVoce> : renderMapi(m)}</div>
        ))}
        <div ref={fimDaConversa} />
      </section>
      <p className="visualmente-oculto" aria-live="polite">
        {anuncio}
      </p>

      <form className={css.campoPergunta} onSubmit={aoEnviar} noValidate>
        {alertaPessoal && (
          <div className={css.alertaCampo} role="alert">
            <span style={{ flex: 'none' }}>
              <Icon name="alerta" size={22} />
            </span>
            Parece que você digitou um dado pessoal. Não precisamos dele. Apague e tente de novo.
          </div>
        )}
        <label className={css.rotuloCampo} htmlFor={idCampo}>
          Sua pergunta
        </label>
        {erroCampo && (
          <p className={css.erroCampo} id={`${idCampo}-erro`} role="alert" style={{ margin: 0 }}>
            <Icon name="alerta" size={20} />
            {erroCampo}
          </p>
        )}
        <div className={css.linhaCampo}>
          <textarea
            id={idCampo}
            className={css.areaTexto}
            rows={2}
            placeholder="Escreva com suas palavras"
            value={texto}
            maxLength={CONFIG.entrada.maxCaracteres + 50}
            aria-invalid={Boolean(erroCampo)}
            aria-describedby={[erroCampo ? `${idCampo}-erro` : '', `${idCampo}-dica`].filter(Boolean).join(' ')}
            onChange={(e) => {
              marcarInicio();
              setTexto(e.target.value);
              if (erroCampo) setErroCampo('');
            }}
            onPointerDown={marcarInicio}
            onKeyDown={(e) => {
              marcarInicio();
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                enviar(texto);
              }
            }}
          />
          <button type="submit" className={css.botaoEnviar} aria-label="Enviar pergunta">
            <Icon name="enviar" size={24} />
          </button>
        </div>
        {sugestoes.length > 0 && (
          <div className={css.sugestoes} aria-label="Sugestões de pergunta" role="group">
            <span className={css.contador}>Você quis perguntar:</span>
            {sugestoes.map((t) => (
              <button key={t} type="button" className={css.sugestao} onClick={() => enviar(t)}>
                {t}
              </button>
            ))}
          </div>
        )}
        <BotaoFalar
          aoOuvir={(t) => {
            marcarInicio();
            setTexto(t.slice(0, CONFIG.entrada.maxCaracteres + 50));
            document.getElementById(idCampo)?.focus();
          }}
          aoAvisar={setAnuncio}
        />
        <span className={css.dicaCampo} id={`${idCampo}-dica`}>
          <span>Não escreva nem fale CPF, telefone ou e-mail.</span>
          <span>
            {texto.trim().length} de {CONFIG.entrada.maxCaracteres}
          </span>
        </span>
      </form>
    </>
  );
}
