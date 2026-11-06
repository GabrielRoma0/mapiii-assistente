// Conferir se é oficial: link ou valor cobrado, checado no aparelho, sem rede.
import { useId, useState, type FormEvent } from 'react';
import { Icon } from '../../../design-system/components/icons/Icon';
import type { IconName } from '../../../design-system/components/icons/Icon';
import { SourceChip } from '../../ui/assistente';
import { MapiPersonagem, ESTADOS_MAPI, type EstadoMapi } from '../../ui/MapiPersonagem';
import { AVISO_CHECAGEM, conferirSeEOficial, type Checagem, type ResultadoOficial } from '../../core/oficial';
import { Titulo, Voltar } from '../comum';
import { DOMINIOS, SERVICOS } from '../dados';
import { href } from '../rotas';
import css from '../app.module.css';

const VISUAL: Record<ResultadoOficial, { texto: string; icone: IconName; estado: EstadoMapi; classe: string }> = {
  oficial: { texto: 'Oficial', icone: 'escudo_check', estado: 'verificado', classe: css.resultadoOficial },
  suspeito: { texto: 'Suspeito', icone: 'golpe', estado: 'atencao', classe: css.resultadoSuspeito },
  nao_sei: { texto: 'Não sei', icone: 'duvida', estado: 'duvida', classe: css.resultadoNaoSei }
};

function Resultado({ checagem }: { checagem: Extract<Checagem, { ok: true }> }) {
  const v = VISUAL[checagem.resultado];
  return (
    <section className={v.classe} aria-labelledby="resultado-checagem">
      <div className={css.resultadoTopo}>
        <MapiPersonagem estado={v.estado} size={52} />
        <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          <span style={{ fontSize: 16, fontWeight: 800 }}>Mapi · {ESTADOS_MAPI[v.estado].rotulo}</span>
          <h2 id="resultado-checagem" className={css.resultadoNome} style={{ margin: 0 }}>
            <Icon name={v.icone} size={28} />
            {v.texto}
          </h2>
        </div>
      </div>
      <ul className={css.achados}>
        {checagem.achados.map((a, i) => (
          <li key={i} className={css.achado}>
            <span>
              {checagem.achados.length > 1 && <b>{VISUAL[a.resultado].texto}: </b>}
              {a.motivo}
            </span>
            {a.fonte && <SourceChip nome={a.fonte.fonte_nome} url={a.fonte.fonte_url} verificadoEm={a.fonte.verificado_em} />}
          </li>
        ))}
      </ul>
      {checagem.resultado === 'suspeito' && (
        <ul className={css.listaPontos} style={{ fontWeight: 700, color: 'var(--text-body)' }}>
          <li>Não pague.</li>
          <li>Não envie documentos.</li>
          <li>Confirme no site oficial, digitando o endereço você mesmo.</li>
        </ul>
      )}
    </section>
  );
}

export function Conferir() {
  const id = useId();
  const [texto, setTexto] = useState('');
  const [checagem, setChecagem] = useState<Checagem | null>(null);

  const aoConferir = (e: FormEvent) => {
    e.preventDefault();
    const r = conferirSeEOficial(texto, DOMINIOS, SERVICOS);
    setChecagem(r);
    // Texto com dado pessoal não fica no campo.
    if (!r.ok && r.motivo === 'dados_pessoais') setTexto('');
  };
  const erro = checagem && !checagem.ok ? checagem.mensagem : '';

  return (
    <>
      <Voltar para={href.inicio} rotulo="Início" />
      <Titulo>Conferir se é oficial</Titulo>
      <form className={css.pilha} onSubmit={aoConferir} noValidate>
        <div className={css.campo}>
          <label htmlFor={id} style={{ fontSize: 17, fontWeight: 800 }}>
            Link ou valor cobrado
          </label>
          <textarea
            id={id}
            className={css.campoTexto}
            rows={2}
            value={texto}
            placeholder="Ex.: www.exemplo.gov.br ou R$ 50,00 para liberar o cartão"
            aria-invalid={Boolean(erro)}
            aria-describedby={`${id}-dica${erro ? ` ${id}-erro` : ''}`}
            onChange={(e) => setTexto(e.target.value)}
          />
          <span id={`${id}-dica`} style={{ fontSize: 16, lineHeight: '23px', color: 'var(--text-muted)' }}>
            Não cole senha, CPF nem número de cartão. A checagem é feita neste aparelho e nada é enviado.
          </span>
          {erro && (
            <p id={`${id}-erro`} className={css.erroCampo} role="alert" style={{ margin: 0 }}>
              <Icon name="alerta" size={20} />
              {erro}
            </p>
          )}
        </div>
        <button type="submit" className={css.botaoPrincipal}>
          <Icon name="escudo_check" size={22} />
          Conferir
        </button>
      </form>

      <div aria-live="polite">{checagem?.ok && <Resultado checagem={checagem} />}</div>

      <div role="note" className={css.notaBranca}>
        <span style={{ flex: 'none' }}>
          <Icon name="alerta" size={22} />
        </span>
        {AVISO_CHECAGEM}
      </div>
    </>
  );
}
