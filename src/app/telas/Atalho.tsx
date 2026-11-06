// Atalhos da tela inicial (guia v2): levam direto às fichas marcadas com o atalho, sem triagem.
import { FalaMapi } from '../../ui/assistente';
import { ATALHOS, type Atalho as IdAtalho } from '../../core/kb-schema';
import { fichasDoAtalho, NOMES_ATALHOS } from '../../core/garantia';
import { Entradas, Titulo, Voltar } from '../comum';
import { KB } from '../dados';
import { href } from '../rotas';
import { NaoEncontrada } from './NaoEncontrada';

export function Atalho({ id }: { id: string }) {
  if (!ATALHOS.includes(id as IdAtalho)) return <NaoEncontrada />;
  const atalho = id as IdAtalho;
  const fichas = fichasDoAtalho(KB, atalho);
  return (
    <>
      <Voltar para={href.inicio} rotulo="Início" />
      <Titulo>{NOMES_ATALHOS[atalho].titulo}</Titulo>
      {fichas.length ? (
        <>
          <FalaMapi estado="achei">{NOMES_ATALHOS[atalho].apoio}</FalaMapi>
          <Entradas rotulo={NOMES_ATALHOS[atalho].titulo} itens={fichas.map((e) => ({ href: href.direito(e.id), icone: 'documento' as const, titulo: e.titulo, apoio: e.resumo }))} />
        </>
      ) : (
        <FalaMapi estado="duvida">Ainda não tenho fichas sobre isso na base.</FalaMapi>
      )}
    </>
  );
}
