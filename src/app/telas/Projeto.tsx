// P2: "Sobre o projeto", para a banca. O conteúdo vem de data/projeto.json (escrito pela dupla, validado em src/core/projeto.ts).
import projetoJson from '../../../data/projeto.json';
import type { Projeto as DadosProjeto } from '../../core/projeto';
import { Titulo, Voltar } from '../comum';
import { href } from '../rotas';
import css from '../app.module.css';

const PROJETO = projetoJson as DadosProjeto;

export function Projeto() {
  const p = PROJETO;
  return (
    <>
      <Voltar para={href.sobre} rotulo="Sobre e fontes" />
      <Titulo>Sobre o projeto</Titulo>
      <p className={css.texto}>Protótipo de estudo da FIAP (Global Solution 2026, case Citizen Assist AI).</p>

      <section className={css.secao} aria-labelledby="projeto-problema">
        <h2 id="projeto-problema" className={css.subtitulo}>O problema</h2>
        <p className={css.texto}>{p.problema}</p>
      </section>

      {p.persona && (
        <section className={css.secao} aria-labelledby="projeto-persona">
          <h2 id="projeto-persona" className={css.subtitulo}>Para quem fizemos</h2>
          <p className={css.texto}>{p.persona}</p>
        </section>
      )}

      <section className={css.secao} aria-labelledby="projeto-teste">
        <h2 id="projeto-teste" className={css.subtitulo}>Como testamos</h2>
        <ul className={css.listaPontos}>
          {p.como_testamos.map((t) => (
            <li key={t}>{t}</li>
          ))}
        </ul>
      </section>

      <section className={css.secao} aria-labelledby="projeto-numeros">
        <h2 id="projeto-numeros" className={css.subtitulo}>Números do teste</h2>
        {p.numeros.length ? (
          <ul className={css.listaPontos}>
            {p.numeros.map((n) => (
              <li key={n.rotulo}>
                <b>{n.rotulo}:</b> {n.valor} <span className={css.apoio}>(fonte: {n.fonte})</span>
              </li>
            ))}
          </ul>
        ) : (
          <p className={css.texto}>Os números aparecem aqui depois do teste com pessoas.</p>
        )}
        <p className={css.apoio}>Mostramos todos os números, inclusive os ruins.</p>
      </section>

      <section className={css.secao} aria-labelledby="projeto-futuro">
        <h2 id="projeto-futuro" className={css.subtitulo}>Visão de futuro</h2>
        <p className={css.seloExemplo}>Visão de futuro: não existe no app</p>
        <p className={css.texto}>{p.visao_de_futuro}</p>
      </section>

      <section className={css.secao} aria-labelledby="projeto-equipe">
        <h2 id="projeto-equipe" className={css.subtitulo}>Equipe</h2>
        <p className={css.texto}>{p.equipe.join(' e ')}</p>
        <a className={css.linkFonte} href={href.sobre}>
          Fontes, ODS e privacidade
        </a>
      </section>
    </>
  );
}
