// avaliacao.html: números do registro local anônimo e exportação em CSV.
// Tudo vem do localStorage deste aparelho; nada é enviado.
import { useState } from 'react';
import { Logo } from '../../design-system/components/brand/Logo';
import { Icon } from '../../design-system/components/icons/Icon';
import { DisclaimerBanner } from '../ui/assistente';
import { useTema } from '../app/tema';
import { PERGUNTAS, perguntaPorId, textoDaOpcao } from '../core/perguntas';
import {
  apagarRegistros,
  apagarRegistrosEmbarque,
  lerRegistrosEmbarque,
  paraCsvEmbarque,
  resumirEmbarque,
  type ResumoEmbarque,
  armazenamentoDoNavegador,
  lerRegistros,
  paraCsv,
  resumir,
  resumirPorTema,
  TEMA_FORA_DO_TEMA,
  TEMA_SEM_RESPOSTA,
  type Registro
} from '../core/registro';
import { EMBARQUE_ATIVO } from '../app/embarque/recurso';
import app from '../app/app.module.css';
import css from './avaliacao.module.css';

const armazenamento = armazenamentoDoNavegador();
const pct = (v: number | null) => (v === null ? '—' : new Intl.NumberFormat('pt-BR', { style: 'percent', maximumFractionDigits: 0 }).format(v));
const seg = (v: number | null) => (v === null ? '—' : `${new Intl.NumberFormat('pt-BR', { maximumFractionDigits: 1 }).format(v)} s`);
const num = (v: number) => new Intl.NumberFormat('pt-BR').format(v);
const contagem = (n: number, um: string, varios: string) => (n === 1 ? `1 ${um}` : `${num(n)} ${varios}`);

const NOMES_FIXOS: Record<string, string> = {
  [TEMA_SEM_RESPOSTA]: 'Sem resposta na base',
  [TEMA_FORA_DO_TEMA]: 'Fora do tema',
  direito: 'Direito (sem objetivo)',
  servico: 'Serviço (sem objetivo)',
  norma: 'Norma'
};

function nomeDoTema(tema: string): string {
  if (NOMES_FIXOS[tema]) return NOMES_FIXOS[tema];
  const objetivo = perguntaPorId('p_objetivo', PERGUNTAS);
  return objetivo ? textoDaOpcao(objetivo, tema) : tema;
}

function baixarCsv(registros: Registro[]) {
  baixar(paraCsv(registros), 'mapiii-avaliacao.csv');
}

function baixar(conteudo: string, nome: string) {
  const blob = new Blob([conteudo], { type: 'text/csv;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = nome;
  document.body.append(a);
  a.click();
  a.remove();
  URL.revokeObjectURL(url);
}

function Numero({ rotulo, valor, detalhe }: { rotulo: string; valor: string; detalhe?: string }) {
  return (
    <div className={css.numero}>
      <dt className={css.numeroRotulo}>{rotulo}</dt>
      <dd className={css.numeroValor}>{valor}</dd>
      {detalhe && <dd className={css.numeroDetalhe}>{detalhe}</dd>}
    </div>
  );
}

export function Avaliacao() {
  const tema = useTema();
  const [registros, setRegistros] = useState(() => lerRegistros(armazenamento));
  const [confirmando, setConfirmando] = useState(false);
  // Indicador do Embarque: só existe com a flag EMBARQUE_ATIVO.
  const [embarque, setEmbarque] = useState(() => (EMBARQUE_ATIVO ? lerRegistrosEmbarque(armazenamento) : []));
  const re = resumirEmbarque(embarque);
  const temDados = registros.length + embarque.length > 0;
  const [aviso, setAviso] = useState('');
  const r = resumir(registros);
  const porTema = resumirPorTema(registros);

  return (
    <div className={app.casca} style={{ height: 'auto', minHeight: '100dvh' }}>
      <main className={app.conteudo}>
        <header className={app.topoInicio}>
          <Logo size={30} tone={tema === 'escuro' ? 'inverse' : 'color'} cut={tema === 'escuro' ? 'var(--bg-app)' : undefined} title="Mapiii" />
          <a className={app.linkTopo} href="./index.html#/sobre">
            Voltar ao app
          </a>
        </header>
        <h1 className={app.titulo}>Avaliação do protótipo</h1>
        <p className={app.texto}>
          Números das perguntas feitas <b>neste aparelho</b>. Cada busca guarda só o tema, se achou resposta, os segundos até a resposta e o voto
          “Esta resposta ajudou?”. Sem o texto da pergunta, sem identificar você e sem enviar nada.
        </p>
        {!armazenamento && (
          <p className={app.alertaCampo} role="note">
            <Icon name="alerta" size={22} />
            Este navegador não deixa guardar dados (por exemplo, no modo privado). Nada foi registrado.
          </p>
        )}

        {r.total === 0 ? (
          <p className={app.texto}>Ainda não há buscas registradas. Faça perguntas em “Fazer uma pergunta” e volte aqui.</p>
        ) : (
          <>
            <section aria-labelledby="geral" className={app.secao}>
              <h2 id="geral" className={app.subtitulo}>Geral</h2>
              <dl className={css.numeros}>
                <Numero rotulo="Buscas" valor={num(r.total)} />
                <Numero rotulo="Achou resposta" valor={pct(r.taxaAchou)} detalhe={`${num(r.achou)} de ${num(r.total)}`} />
                <Numero rotulo="Tempo até a resposta" valor={seg(r.medianaSegundos)} detalhe={`mediana · média ${seg(r.mediaSegundos)}`} />
                <Numero
                  rotulo="Ajudou"
                  valor={pct(r.taxaAjudou)}
                  detalhe={`${num(r.votosSim)} sim · ${num(r.votosNao)} não · ${num(r.semVoto)} sem voto`}
                />
              </dl>
            </section>

            <section aria-labelledby="por-tema" className={app.secao}>
              <h2 id="por-tema" className={app.subtitulo}>Por tema</h2>
              <div className={css.rolagem} tabIndex={0} role="region" aria-labelledby="por-tema">
                <table className={css.tabela}>
                  <thead>
                    <tr>
                      <th scope="col">Tema</th>
                      <th scope="col">Buscas</th>
                      <th scope="col">Achou</th>
                      <th scope="col">Tempo (mediana)</th>
                      <th scope="col">Ajudou</th>
                    </tr>
                  </thead>
                  <tbody>
                    {porTema.map(({ tema: t, resumo }) => (
                      <tr key={t}>
                        <th scope="row">{nomeDoTema(t)}</th>
                        <td>{num(resumo.total)}</td>
                        <td>{pct(resumo.taxaAchou)}</td>
                        <td>{seg(resumo.medianaSegundos)}</td>
                        <td>{resumo.taxaAjudou === null ? 'sem voto' : `${pct(resumo.taxaAjudou)} de ${num(resumo.votosSim + resumo.votosNao)}`}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </section>
          </>
        )}

        {EMBARQUE_ATIVO && (
          <section aria-labelledby="embarque" className={app.secao}>
            <h2 id="embarque" className={app.subtitulo}>Embarque garantido: tempo até achar o ônibus certo</h2>
            <p className={app.texto}>
              Do abrir a tela do Embarque até ver a previsão do ponto (ou o resumo da linha). O tempo considera só quem chegou ao resultado. Cada medição guarda
              só o modo, os segundos e se achou.
            </p>
            {embarque.length === 0 ? (
              <p className={app.texto}>Ainda não há medições do Embarque.</p>
            ) : (
              <div className={css.rolagem} tabIndex={0} role="region" aria-labelledby="embarque">
                <table className={css.tabela}>
                  <thead>
                    <tr>
                      <th scope="col">Modo</th>
                      <th scope="col">Tentativas</th>
                      <th scope="col">Achou</th>
                      <th scope="col">Mediana</th>
                      <th scope="col">Média</th>
                    </tr>
                  </thead>
                  <tbody>
                    {([['real', 'Tempo real (SPTrans)'], ['exemplo', 'Exemplo (dados fictícios)']] as const).map(([modo, nome]) => {
                      const m: ResumoEmbarque = re[modo];
                      return (
                        <tr key={modo}>
                          <th scope="row">{nome}</th>
                          <td>{num(m.tentativas)}</td>
                          <td>{m.tentativas ? `${pct(m.taxaAchou)} (${num(m.achou)})` : '—'}</td>
                          <td>{seg(m.medianaSegundos)}</td>
                          <td>{seg(m.mediaSegundos)}</td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}
            <p className={app.apoio} style={{ margin: 0 }}>
              Para comparar, cronometre a mesma tarefa no método que a pessoa já usa (veja docs/folha-de-teste.md).
            </p>
          </section>
        )}

        <section aria-labelledby="dados" className={app.secao}>
          <h2 id="dados" className={app.subtitulo}>Seus dados</h2>
          <div className={css.acoes}>
            <button type="button" className={app.botaoPrincipal} disabled={!r.total} onClick={() => baixarCsv(registros)}>
              <Icon name="download" size={22} />
              Baixar CSV
            </button>
            {EMBARQUE_ATIVO && (
              <button type="button" className={app.botaoSecundario} disabled={!embarque.length} onClick={() => baixar(paraCsvEmbarque(embarque), 'mapiii-embarque.csv')}>
                <Icon name="download" size={22} />
                Baixar CSV do Embarque
              </button>
            )}
            {!confirmando ? (
              <button type="button" className={app.botaoSecundario} disabled={!temDados} onClick={() => setConfirmando(true)}>
                Apagar registros
              </button>
            ) : (
              <div className={css.confirmar} role="group" aria-label="Confirmar exclusão">
                <p className={app.texto}>
                  Apagar tudo o que está guardado neste aparelho ({contagem(r.total, 'busca', 'buscas')}
                  {EMBARQUE_ATIVO ? ` e ${contagem(embarque.length, 'medição do Embarque', 'medições do Embarque')}` : ''})? Não dá para desfazer.
                </p>
                <div className={css.acoesLinha}>
                  <button
                    type="button"
                    className={app.botaoSecundario}
                    onClick={() => {
                      apagarRegistros(armazenamento);
                      setRegistros(lerRegistros(armazenamento));
                      if (EMBARQUE_ATIVO) {
                        apagarRegistrosEmbarque(armazenamento);
                        setEmbarque(lerRegistrosEmbarque(armazenamento));
                      }
                      setConfirmando(false);
                      setAviso('Registros apagados.');
                    }}
                  >
                    Sim, apagar
                  </button>
                  <button type="button" className={app.botaoSecundario} onClick={() => setConfirmando(false)}>
                    Cancelar
                  </button>
                </div>
              </div>
            )}
          </div>
          <p role="status" className={app.apoio}>
            {aviso}
          </p>
        </section>
      </main>
      <footer className={app.rodape}>
        <DisclaimerBanner />
      </footer>
    </div>
  );
}
