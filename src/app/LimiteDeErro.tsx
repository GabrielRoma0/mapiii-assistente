// Se uma tela quebrar, mostra uma mensagem amigável em vez de tela branca.
// O aviso de protótipo (no rodapé do App) continua aparecendo. Volta ao normal ao trocar de tela (key no App).
import { Component, type ReactNode } from 'react';
import { FalaMapi } from '../ui/assistente';
import { Titulo } from './comum';
import { href } from './rotas';
import css from './app.module.css';

export class LimiteDeErro extends Component<{ children: ReactNode }, { quebrou: boolean }> {
  state = { quebrou: false };

  static getDerivedStateFromError() {
    return { quebrou: true };
  }

  render() {
    if (!this.state.quebrou) return this.props.children;
    return (
      <>
        <div style={{ paddingTop: 12 }} />
        <Titulo>Algo deu errado nesta tela</Titulo>
        <FalaMapi estado="duvida">Desculpe, esta tela não abriu direito. Nada do que você fez foi enviado. Tente voltar ao início.</FalaMapi>
        <a className={css.botaoPrincipal} href={href.inicio}>
          Voltar ao início
        </a>
      </>
    );
  }
}

/** Só em desenvolvimento (#/teste-erro): uma tela que quebra de propósito, para testar o LimiteDeErro. */
export function TelaQueQuebra(): ReactNode {
  throw new Error('Erro de teste (só em desenvolvimento).');
}
