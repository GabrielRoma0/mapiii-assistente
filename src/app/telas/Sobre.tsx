import { useState } from 'react';
import { Icon } from '../../../design-system/components/icons/Icon';
import { tipoFonteNaTela, type TipoEntrada } from '../../core/kb-schema';
import { escolhaAtual, escolherTema, type EscolhaTema } from '../../tema';
import { LinhaDoTempo, OpcoesEmCartao, SourceTypeBadge, dataBR } from '../../ui/assistente';
import { Titulo, Voltar } from '../comum';
import { DOMINIOS, KB } from '../dados';
import { href } from '../rotas';
import css from '../app.module.css';

const TIPOS: Record<TipoEntrada, string> = { direito: 'Direito', servico: 'Serviço', norma: 'Norma' };

export function Sobre() {
  const [tema, setTema] = useState<EscolhaTema>(escolhaAtual);
  const fontesDominios = [...DOMINIOS.sufixos.slice(0, 1), ...DOMINIOS.dominios];

  return (
    <>
      <Voltar para={href.inicio} rotulo="Início" />
      <Titulo>Sobre e fontes</Titulo>

      <section className={css.secao} aria-labelledby="como-funciona">
        <h2 id="como-funciona" className={css.subtitulo}>Como funciona</h2>
        <LinhaDoTempo
          passos={[
            'Você conta a situação ou faz uma pergunta.',
            'O assistente procura só numa base de fontes conferidas.',
            'Cada resposta mostra a fonte e a data da conferência.'
          ]}
        />
      </section>

      <section className={css.secao} aria-labelledby="fontes">
        <h2 id="fontes" className={css.subtitulo}>De onde vêm as informações</h2>
        {KB.length ? (
          <ul className={css.listaFontes}>
            {KB.map((e) => (
              <li key={e.id}>
                <b>{e.titulo}</b>
                <span className={css.apoio}>
                  {TIPOS[e.tipo]} · conferido em {dataBR(e.verificado_em)}
                </span>
                <span style={{ alignSelf: 'flex-start' }}>
                  <SourceTypeBadge tipo={tipoFonteNaTela(e)} />
                </span>
                <a className={css.linkFonte} href={e.fonte_url} target="_blank" rel="noopener noreferrer">
                  {e.fonte_nome}
                  <span className="visualmente-oculto"> (abre em nova aba)</span>
                </a>
              </li>
            ))}
          </ul>
        ) : (
          <p className={css.texto}>A base ainda não tem entradas cadastradas.</p>
        )}
        <p className={css.apoio}>
          Fontes oficiais têm o selo de escudo. Guias de associações aparecem como fonte secundária. Uma fonte conferida há mais de 6 meses
          aparece como “Pode estar desatualizada”.
        </p>
      </section>

      <section className={css.secao} aria-labelledby="sites-oficiais">
        <h2 id="sites-oficiais" className={css.subtitulo}>Lista de sites oficiais</h2>
        <p className={css.texto}>
          “Conferir se é oficial” usa os finais de endereço reservados ao poder público ({DOMINIOS.sufixos.map((s) => `.${s.sufixo}`).join(', ')}) e
          os sites oficiais cadastrados ({DOMINIOS.dominios.map((d) => d.nome).join(', ')}).
        </p>
        <ul className={css.listaFontes}>
          {fontesDominios.map((f) => (
            <li key={f.fonte_url}>
              <a className={css.linkFonte} href={f.fonte_url} target="_blank" rel="noopener noreferrer">
                {f.fonte_nome}
                <span className="visualmente-oculto"> (abre em nova aba)</span>
              </a>
              <span className={css.apoio}>conferido em {dataBR(f.verificado_em)}</span>
            </li>
          ))}
        </ul>
      </section>

      <section className={css.secao} aria-labelledby="acerto">
        <h2 id="acerto" className={css.subtitulo}>Como medimos acerto</h2>
        <ul className={css.listaPontos}>
          <li>Respostas com fonte oficial citada.</li>
          <li>Respostas conferidas por especialistas numa amostra.</li>
          <li>Perguntas sem resposta na base que receberam um “não encontrei” em vez de um palpite.</li>
        </ul>
      </section>

      <section className={css.secao} aria-labelledby="nao-faz">
        <h2 id="nao-faz" className={css.subtitulo}>O que o assistente não faz</h2>
        <ul className={css.listaPontos}>
          <li>Não é canal oficial nem faz pedidos por você.</li>
          <li>Não diz que você tem direito. Só o órgão responsável decide.</li>
          <li>Não dá diagnóstico nem parecer jurídico.</li>
          <li>Não guarda nome, documentos nem dados de saúde.</li>
        </ul>
      </section>

      <section className={css.secao} aria-labelledby="privacidade">
        <h2 id="privacidade" className={css.subtitulo}>Privacidade</h2>
        <p className={css.garantia}>
          <span style={{ flex: 'none' }}>
            <Icon name="escudo_check" size={22} />
          </span>
          Suas respostas da triagem ficam só na memória desta página e somem ao fechá-la. Não há conta, cookies de rastreamento nem analytics.
        </p>
        <p className={css.texto}>
          Para avaliar o protótipo, cada pergunta livre guarda <b>neste aparelho</b> só o tema, se achou resposta, os segundos até a resposta e o
          voto “Esta resposta ajudou?”. Sem o texto da pergunta e sem identificar você. Nada é enviado.
        </p>
        <a className={css.linkFonte} href="./avaliacao.html">
          Ver os números, baixar em CSV ou apagar
        </a>
      </section>

      <section className={css.secao}>
        <OpcoesEmCartao<EscolhaTema>
          pergunta="Aparência"
          opcoes={[
            { valor: 'aparelho', texto: 'Igual ao aparelho' },
            { valor: 'claro', texto: 'Clara' },
            { valor: 'escuro', texto: 'Escura' }
          ]}
          valor={tema}
          aoEscolher={(v) => {
            setTema(v);
            escolherTema(v);
          }}
        />
      </section>
    </>
  );
}
