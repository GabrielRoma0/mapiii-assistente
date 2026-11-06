// Reclamação pronta: formulário só em memória que gera um texto neutro para a pessoa copiar e enviar ela mesma.
// Sem nome, CPF ou contato. Nada é enviado nem guardado.
import { useId, useRef, useState, type FormEvent, type ReactNode } from 'react';
import { Icon } from '../../../design-system/components/icons/Icon';
import { OpcoesEmCartao, SourceChip } from '../../ui/assistente';
import { CONFIG } from '../../core/config';
import {
  AVISO_NAO_ENVIA,
  OCORRIDOS,
  SEM_CANAL,
  canaisDeReclamacao,
  gerarTextoReclamacao,
  validarReclamacao,
  type ErrosReclamacao,
  type Ocorrido
} from '../../core/reclamacao';
import { KB } from '../dados';
import css from '../app.module.css';

/** Data de hoje no fuso de São Paulo, no formato do campo de data (AAAA-MM-DD). */
function hojeSP(agora: Date): string {
  return new Intl.DateTimeFormat('en-CA', { timeZone: 'America/Sao_Paulo' }).format(agora);
}

function Campo({
  id,
  rotulo,
  dica,
  erro,
  children
}: {
  id: string;
  rotulo: string;
  dica?: string;
  erro?: string;
  children: (descricao: string) => ReactNode;
}) {
  const descricao = [dica ? `${id}-dica` : '', erro ? `${id}-erro` : ''].filter(Boolean).join(' ');
  return (
    <div className={css.campo}>
      <label htmlFor={id} style={{ fontSize: 17, fontWeight: 800 }}>
        {rotulo}
      </label>
      {children(descricao)}
      {dica && (
        <span id={`${id}-dica`} style={{ fontSize: 16, lineHeight: '23px', color: 'var(--text-muted)' }}>
          {dica}
        </span>
      )}
      {erro && (
        <p id={`${id}-erro`} className={css.erroCampo} style={{ margin: 0 }}>
          <Icon name="alerta" size={20} />
          {erro}
        </p>
      )}
    </div>
  );
}

export function PainelReclamacao({ linhaInicial = '', agora = () => new Date() }: { linhaInicial?: string; agora?: () => Date }) {
  const id = useId();
  const hoje = agora();
  const [linha, setLinha] = useState(linhaInicial);
  const [data, setData] = useState(hojeSP(hoje));
  const [hora, setHora] = useState('');
  const [prefixo, setPrefixo] = useState('');
  const [ocorrido, setOcorrido] = useState<Ocorrido | null>(null);
  const [erros, setErros] = useState<ErrosReclamacao>({});
  const [texto, setTexto] = useState('');
  const [aviso, setAviso] = useState('');
  const areaTexto = useRef<HTMLTextAreaElement>(null);
  const canais = canaisDeReclamacao(KB, CONFIG.canaisReclamacaoIds, hoje);

  const gerar = (e: FormEvent) => {
    e.preventDefault();
    const dados = { linha, data, hora, prefixo, ocorrido: ocorrido ?? undefined };
    const novos = validarReclamacao(dados, hoje);
    setErros(novos);
    if (Object.keys(novos).length) {
      setTexto('');
      setAviso('Confira os campos marcados.');
      // Leva o foco ao primeiro campo com problema.
      const primeiro = (['linha', 'data', 'hora', 'prefixo', 'ocorrido'] as const).find((k) => novos[k]);
      document.getElementById(primeiro === 'ocorrido' ? `${id}-ocorrido` : `${id}-${primeiro}`)?.focus();
      return;
    }
    setTexto(gerarTextoReclamacao({ linha, data, hora: hora || undefined, prefixo: prefixo || undefined, ocorrido: ocorrido! }));
    setAviso('Texto pronto. Confira antes de copiar.');
    requestAnimationFrame(() => areaTexto.current?.focus());
  };

  const copiar = async () => {
    try {
      await navigator.clipboard.writeText(texto);
      setAviso('Texto copiado. Cole no canal oficial e preencha seu nome e contato.');
    } catch {
      // Sem permissão de copiar: deixa o texto selecionado para a pessoa copiar pelo aparelho.
      areaTexto.current?.focus();
      areaTexto.current?.select();
      setAviso('Não consegui copiar sozinho. O texto está selecionado: use a opção Copiar do seu aparelho.');
    }
  };

  return (
    <section className={css.cartaoBranco} aria-labelledby={`${id}-titulo`}>
      <h2 id={`${id}-titulo`} className={css.subtitulo}>
        Reclamação pronta
      </h2>
      <p className={css.texto} style={{ margin: 0 }}>
        Preencha o que aconteceu e o app monta um texto neutro, só com os fatos, para você copiar. Não peça nem escreva nome ou CPF aqui.
      </p>

      <form className={css.pilha} onSubmit={gerar} noValidate>
        <Campo id={`${id}-linha`} rotulo="Linha" dica="Como no letreiro. Por exemplo: 8000-10." erro={erros.linha}>
          {(d) => (
            <input id={`${id}-linha`} className={css.campoTexto} value={linha} maxLength={20} autoComplete="off" aria-invalid={Boolean(erros.linha)} aria-describedby={d} onChange={(e) => setLinha(e.target.value)} />
          )}
        </Campo>
        <Campo id={`${id}-data`} rotulo="Data em que aconteceu" erro={erros.data}>
          {(d) => (
            <input id={`${id}-data`} type="date" className={css.campoTexto} value={data} max={hojeSP(hoje)} aria-invalid={Boolean(erros.data)} aria-describedby={d || undefined} onChange={(e) => setData(e.target.value)} />
          )}
        </Campo>
        <Campo id={`${id}-hora`} rotulo="Hora aproximada (opcional)" erro={erros.hora}>
          {(d) => (
            <input id={`${id}-hora`} type="time" className={css.campoTexto} value={hora} aria-invalid={Boolean(erros.hora)} aria-describedby={d || undefined} onChange={(e) => setHora(e.target.value)} />
          )}
        </Campo>
        <Campo id={`${id}-prefixo`} rotulo="Prefixo do veículo (opcional)" dica="O número pintado no ônibus, de 3 a 6 dígitos." erro={erros.prefixo}>
          {(d) => (
            <input id={`${id}-prefixo`} className={css.campoTexto} value={prefixo} inputMode="numeric" maxLength={6} autoComplete="off" aria-invalid={Boolean(erros.prefixo)} aria-describedby={d} onChange={(e) => setPrefixo(e.target.value)} />
          )}
        </Campo>
        <div id={`${id}-ocorrido`} tabIndex={-1}>
          <OpcoesEmCartao<Ocorrido>
            pergunta="O que aconteceu?"
            opcoes={(Object.keys(OCORRIDOS) as Ocorrido[]).map((v) => ({ valor: v, texto: OCORRIDOS[v] }))}
            valor={ocorrido}
            aoEscolher={setOcorrido}
          />
          {erros.ocorrido && (
            <p className={css.erroCampo} style={{ margin: '8px 0 0' }}>
              <Icon name="alerta" size={20} />
              {erros.ocorrido}
            </p>
          )}
        </div>
        <button type="submit" className={css.botaoPrincipal}>
          <Icon name="documento" size={22} />
          Gerar texto
        </button>
      </form>

      <p className="visualmente-oculto" aria-live="polite">
        {aviso}
      </p>

      {texto && (
        <div className={css.pilha}>
          <div className={css.campo}>
            <label htmlFor={`${id}-texto`} style={{ fontSize: 17, fontWeight: 800 }}>
              Texto da reclamação
            </label>
            <textarea id={`${id}-texto`} ref={areaTexto} className={css.campoTexto} value={texto} readOnly rows={9} onFocus={(e) => e.currentTarget.select()} />
          </div>
          <button type="button" className={css.botaoPrincipal} onClick={copiar}>
            Copiar texto
          </button>
          {aviso && <p className={css.apoio} style={{ margin: 0 }}>{aviso}</p>}
          <p className={css.alertaCampo} role="note" style={{ margin: 0 }}>
            <span style={{ flex: 'none' }}>
              <Icon name="alerta" size={22} />
            </span>
            Preencha seu nome e contato ao enviar, fora do app. {AVISO_NAO_ENVIA}
          </p>
        </div>
      )}

      <div className={css.secao}>
        <h3 className={css.subtitulo} style={{ fontSize: 18 }}>
          Onde enviar
        </h3>
        {canais.length ? (
          canais.map((c) => (
            <div key={c.id} className={css.linhaIconeTextos}>
              <b>{c.titulo}</b>
              <span>{c.onde!.texto}</span>
              <SourceChip nome={c.fonte_nome} url={c.onde!.link ?? c.fonte_url} verificadoEm={c.verificado_em} />
            </div>
          ))
        ) : (
          <p className={css.canalDesabilitado} aria-disabled="true">
            <Icon name="duvida" size={22} />
            {SEM_CANAL}. Procure o órgão responsável pelo serviço.
          </p>
        )}
      </div>
      <p className={css.apoio} style={{ margin: 0 }}>{AVISO_NAO_ENVIA} Nada deste formulário é guardado.</p>
    </section>
  );
}
