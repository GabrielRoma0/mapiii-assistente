// Laudo único (bônus do guia v2): junta o que o laudo precisa conter para os direitos que podem se aplicar,
// para a pessoa pedir tudo numa consulta só. Usa as respostas da triagem, que ficam só na memória.
import { FalaMapi } from '../../ui/assistente';
import { AcoesDeTexto } from '../../ui/acoes';
import { AVISO_PROTOTIPO_TEXTO } from '../../core/avisos';
import { laudoUnico } from '../../core/garantia';
import { perguntasNoModo } from '../../core/perguntas';
import { montarRota } from '../../core/regras';
import { Titulo, Voltar } from '../comum';
import { KB } from '../dados';
import { useEstado } from '../estado';
import { href } from '../rotas';
import css from '../app.module.css';

export function Laudo() {
  const { respostas, modo } = useEstado();
  const respondeu = Object.keys(respostas).length > 0;
  const itens = respondeu ? laudoUnico(montarRota(KB, respostas, perguntasNoModo(modo))) : [];
  const texto = [
    'O laudo precisa ter:',
    ...itens.map((i) => `- ${i.texto} (para: ${i.para.join(', ')})`),
    '',
    'Confira cada item na fonte oficial de cada pedido.',
    AVISO_PROTOTIPO_TEXTO
  ].join('\n');

  return (
    <>
      <Voltar para={respondeu ? href.rota : href.inicio} rotulo={respondeu ? 'Sua rota dos direitos' : 'Início'} />
      <Titulo>Lista única para o laudo</Titulo>
      {!respondeu ? (
        <>
          <FalaMapi estado="esperando">Para montar a lista, responda primeiro as perguntas sobre a situação.</FalaMapi>
          <a className={css.botaoPrincipal} href={href.triagem}>
            Descobrir o que posso pedir
          </a>
        </>
      ) : itens.length ? (
        <>
          <FalaMapi estado="achei">Leve esta lista à consulta: assim o médico pode incluir tudo num laudo só.</FalaMapi>
          <ul className={css.listaSimples}>
            {itens.map((i) => (
              <li key={i.texto} className={css.cartaoBranco}>
                <b>{i.texto}</b>
                <span className={css.apoio}>Para: {i.para.join(', ')}</span>
              </li>
            ))}
          </ul>
          <AcoesDeTexto titulo="Lista para o laudo" texto={texto} />
          <p className={css.alertaCampo} role="note" style={{ margin: 0 }}>
            Quem define o que o laudo precisa ter é cada órgão. Confira na fonte de cada pedido antes da consulta.
          </p>
        </>
      ) : (
        <FalaMapi estado="duvida">Os direitos da sua rota ainda não têm na base o que o laudo precisa conter.</FalaMapi>
      )}
    </>
  );
}
