import { Logo } from '../../../design-system/components/brand/Logo';
import { Icon } from '../../../design-system/components/icons/Icon';
import type { IconName } from '../../../design-system/components/icons/Icon';
import { FalaMapi } from '../../ui/assistente';
import { Titulo } from '../comum';
import { href } from '../rotas';
import { useTema } from '../tema';
import { EMBARQUE_ATIVO } from '../embarque/recurso';
import css from '../app.module.css';

const ENTRADAS: { href: string; icone: IconName; titulo: string; apoio: string; principal?: boolean }[] = [
  { href: href.triagem, icone: 'passos', titulo: 'Escolher minha situação', apoio: 'Responda algumas perguntas e veja o que pode se aplicar.', principal: true },
  { href: href.perguntar, icone: 'conversa', titulo: 'Fazer uma pergunta', apoio: 'Escreva com suas palavras.' },
  { href: href.conferir, icone: 'escudo_check', titulo: 'Conferir se é oficial', apoio: 'Cole um link ou um valor cobrado.' },
  // Só aparece com a flag EMBARQUE_ATIVO.
  ...(EMBARQUE_ATIVO
    ? [{ href: href.embarque, icone: 'onde_ir' as IconName, titulo: 'Embarque garantido', apoio: 'Veja quantos ônibus de uma linha são acessíveis agora.' }]
    : [])
];

export function Inicio() {
  const tema = useTema();
  return (
    <>
      <header className={css.topoInicio}>
        <Logo size={30} tone={tema === 'escuro' ? 'inverse' : 'color'} cut={tema === 'escuro' ? 'var(--bg-app)' : undefined} title="Mapiii" />
        <a className={css.linkTopo} href={href.sobre}>
          Sobre e fontes
        </a>
      </header>
      <FalaMapi estado="ola" size={64}>
        Olá. Eu ajudo você a entender direitos e serviços públicos em São Paulo.
      </FalaMapi>
      <Titulo grande>Seu mapa de direitos</Titulo>
      <nav aria-label="O que você quer fazer">
        <ul className={css.entradas} style={{ listStyle: 'none', margin: 0, padding: 0 }}>
          {ENTRADAS.map((e) => (
            <li key={e.href}>
              <a className={e.principal ? css.entradaPrincipal : css.entrada} href={e.href}>
                <span className={css.entradaIcone}>
                  <Icon name={e.icone} size={28} />
                </span>
                <span className={css.entradaTextos}>
                  <span className={css.entradaTitulo}>{e.titulo}</span>
                  <span className={css.entradaApoio}>{e.apoio}</span>
                </span>
              </a>
            </li>
          ))}
        </ul>
      </nav>
    </>
  );
}
