// Botão para ligar o modo um toque e a escolha da velocidade.
import { OpcoesEmCartao } from '../ui/assistente';
import { NOMES_VELOCIDADE, type Velocidade } from '../core/varredura';
import { useEstado } from './estado';
import css from './app.module.css';

export function BotaoUmToque() {
  const { varredura, ligarVarredura } = useEstado();
  if (varredura) return null;
  return (
    <button type="button" className={css.botaoSecundario} style={{ alignSelf: 'flex-start' }} onClick={() => ligarVarredura(true)}>
      Usar com um toque
    </button>
  );
}

export function VelocidadeUmToque() {
  const { velocidade, escolherVelocidade } = useEstado();
  return (
    <OpcoesEmCartao<Velocidade>
      pergunta="Velocidade do modo um toque"
      opcoes={(Object.keys(NOMES_VELOCIDADE) as Velocidade[]).map((v) => ({ valor: v, texto: NOMES_VELOCIDADE[v] }))}
      valor={velocidade}
      aoEscolher={escolherVelocidade}
    />
  );
}
