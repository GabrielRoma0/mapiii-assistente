// Tela própria da Reclamação pronta (atrás da flag EMBARQUE_ATIVO), oferecida pela resposta de acolhimento.
import { PainelReclamacao } from '../reclamacao/PainelReclamacao';
import { Titulo, Voltar } from '../comum';
import { href } from '../rotas';

export function Reclamacao() {
  return (
    <>
      <Voltar para={href.inicio} rotulo="Início" />
      <Titulo>Me negaram o embarque, e agora?</Titulo>
      <PainelReclamacao />
    </>
  );
}
