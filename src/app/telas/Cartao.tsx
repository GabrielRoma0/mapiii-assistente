// Cartão da cadeira: cinco escolhas viram uma mensagem para o chat do motorista de aplicativo ou táxi.
// Fica só na memória da página; com "Guardar neste aparelho", fica no navegador (sem rede) até a pessoa apagar.
import { useRef, useState } from 'react';
import { FalaMapi, OpcoesEmCartao } from '../../ui/assistente';
import { AcoesDeTexto } from '../../ui/acoes';
import {
  apagarCartao,
  guardarCartao,
  lerCartao,
  mensagemDoCartao,
  OPCOES_CARTAO,
  PERGUNTAS_CARTAO,
  type CampoCartao,
  type Cartao as DadosCartao
} from '../../core/cartao';
import { fichasDoAtalho } from '../../core/garantia';
import { armazenamentoDoNavegador } from '../../core/registro';
import { Entradas, Titulo, Voltar } from '../comum';
import { KB } from '../dados';
import { href } from '../rotas';
import css from '../app.module.css';

const CAMPOS = Object.keys(OPCOES_CARTAO) as CampoCartao[];

export function Cartao() {
  const armazenamento = useRef(armazenamentoDoNavegador()).current;
  const [salvo] = useState(() => lerCartao(armazenamento));
  const [respostas, setRespostas] = useState<Partial<DadosCartao>>(salvo ?? {});
  const [guardar, setGuardar] = useState(Boolean(salvo));
  const [aviso, setAviso] = useState('');
  const completo = CAMPOS.every((c) => respostas[c] !== undefined);
  const cartao = completo ? (respostas as DadosCartao) : null;
  const alternativas = fichasDoAtalho(KB, 'deslocamento');

  const escolher = (campo: CampoCartao, valor: string) => {
    const novo = { ...respostas, [campo]: valor };
    setRespostas(novo);
    if (guardar && CAMPOS.every((c) => novo[c] !== undefined)) guardarCartao(armazenamento, novo as DadosCartao);
  };
  const alternarGuardar = (marcado: boolean) => {
    setGuardar(marcado);
    if (!marcado) {
      apagarCartao(armazenamento);
      setAviso('Apagado deste aparelho.');
    } else if (cartao) {
      setAviso(guardarCartao(armazenamento, cartao) ? 'Guardado só neste aparelho.' : 'Este navegador não deixa guardar. O cartão vale só enquanto a página estiver aberta.');
    }
  };

  return (
    <>
      <Voltar para={href.naRua} rotulo="Garanta na rua" />
      <Titulo>Cartão da cadeira</Titulo>
      <FalaMapi estado="ouvindo">Responda uma vez. Quando a corrida for aceita, copie a mensagem para o chat do motorista: ele sabe o que esperar antes de chegar.</FalaMapi>

      {CAMPOS.map((campo) => (
        <OpcoesEmCartao<string>
          key={campo}
          pergunta={PERGUNTAS_CARTAO[campo]}
          opcoes={Object.entries(OPCOES_CARTAO[campo]).map(([valor, texto]) => ({ valor, texto }))}
          valor={(respostas[campo] as string | undefined) ?? null}
          aoEscolher={(v) => escolher(campo, v)}
        />
      ))}

      <label className={css.garantia} style={{ cursor: 'pointer', minHeight: 48 }}>
        <input type="checkbox" checked={guardar} onChange={(e) => alternarGuardar(e.target.checked)} style={{ width: 24, height: 24, flex: 'none' }} />
        Guardar neste aparelho (nada é enviado; desmarque para apagar)
      </label>
      <p className="visualmente-oculto" aria-live="polite">
        {aviso}
      </p>

      <section className={css.secao} aria-labelledby="mensagem" aria-live="polite">
        <h2 id="mensagem" className={css.subtitulo}>
          Mensagem para o motorista
        </h2>
        {cartao ? (
          <>
            <p className={css.modelo}>{mensagemDoCartao(cartao)}</p>
            <AcoesDeTexto titulo="Mensagem para o motorista" texto={mensagemDoCartao(cartao)} imprimir={false} />
          </>
        ) : (
          <p className={css.apoio}>Responda as {CAMPOS.length} perguntas acima para montar a mensagem.</p>
        )}
      </section>

      {alternativas.length > 0 && (
        <section className={css.secao} aria-labelledby="alternativas">
          <h2 id="alternativas" className={css.subtitulo}>
            Outras formas de se deslocar
          </h2>
          <Entradas rotulo="Outras formas de se deslocar" itens={alternativas.map((e) => ({ href: href.direito(e.id), icone: 'onde_ir' as const, titulo: e.titulo, apoio: e.resumo }))} />
        </section>
      )}
    </>
  );
}
