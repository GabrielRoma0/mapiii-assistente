// Boas-vindas na primeira visita: os três atos do guia num cartão, com "Entendi". Não bloqueia o uso.
import { useRef, useState } from 'react';
import { LinhaDoTempo } from '../ui/assistente';
import { boasVindasVistas, marcarBoasVindas } from '../core/preferencias';
import { armazenamentoDoNavegador } from '../core/registro';
import css from './app.module.css';

export function BoasVindas() {
  const armazenamento = useRef(armazenamentoDoNavegador()).current;
  const [visivel, setVisivel] = useState(() => !boasVindasVistas(armazenamento));
  if (!visivel) return null;
  return (
    <section className={css.cartaoBranco} aria-labelledby="boas-vindas">
      <h2 id="boas-vindas" className={css.subtitulo} style={{ margin: 0 }}>
        Primeira vez aqui? É assim que funciona
      </h2>
      <LinhaDoTempo
        passos={[
          'Descubra: responda algumas perguntas e veja o que você pode pedir.',
          'Prepare: veja o que levar, onde ir e o que fazer se negarem.',
          'Garanta na rua: ônibus acessível, mensagem para o motorista e reclamação pronta.'
        ]}
      />
      <button
        type="button"
        className={css.botaoSecundario}
        style={{ alignSelf: 'flex-start' }}
        onClick={() => {
          marcarBoasVindas(armazenamento);
          setVisivel(false);
          document.querySelector<HTMLElement>('main h1')?.focus();
        }}
      >
        Entendi
      </button>
    </section>
  );
}
