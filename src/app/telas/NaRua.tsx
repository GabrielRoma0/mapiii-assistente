// Ato 3 do guia, "Garanta na rua": tudo o que ajuda na hora do deslocamento e do embarque.
import { FalaMapi } from '../../ui/assistente';
import { fichasParaMotorista } from '../../core/garantia';
import { Entradas, Titulo, Voltar, type ItemEntrada } from '../comum';
import { KB } from '../dados';
import { EMBARQUE_ATIVO } from '../embarque/recurso';
import { href } from '../rotas';

export function NaRua() {
  const itens: ItemEntrada[] = [
    ...(EMBARQUE_ATIVO
      ? [{ href: href.embarque, icone: 'onde_ir' as const, titulo: 'Qual ônibus serve para mim', apoio: 'O próximo ônibus acessível no seu ponto, segundo a SPTrans.', principal: true }]
      : []),
    { href: href.cartao, icone: 'carro', titulo: 'Cartão da cadeira', apoio: 'Mensagem pronta para o motorista de aplicativo ou táxi.' },
    ...(fichasParaMotorista(KB).length
      ? [{ href: href.motorista(), icone: 'escudo_check' as const, titulo: 'Mostre ao motorista', apoio: 'O direito em letra grande, com a lei e o link oficial.' }]
      : []),
    { href: href.reclamacao, icone: 'documento', titulo: 'Reclamação pronta', apoio: 'Texto neutro para enviar ao canal oficial.' },
    { href: href.negaram(), icone: 'passos', titulo: 'Me negaram, e agora?', apoio: 'O caminho de recurso e um modelo de pedido.' }
  ];
  return (
    <>
      <Voltar para={href.inicio} rotulo="Início" />
      <Titulo>Garanta na rua</Titulo>
      <FalaMapi estado="ola">Ajudo na hora de sair: qual ônibus serve, o que dizer ao motorista e o que fazer se negarem.</FalaMapi>
      <Entradas itens={itens} rotulo="Na rua" />
    </>
  );
}
