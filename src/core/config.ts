// Configuração do app. Usada pelo navegador, pelos testes e por eval/avaliar.ts.
export const CONFIG = {
  busca: {
    // Pontuação final vai de 0 a 1. Abaixo de limiteResposta: "não encontrei isso na minha base".
    limiteResposta: 0.25,
    // Entradas abaixo disso não aparecem em "Você quis dizer?".
    limiteSugestao: 0.15,
    maxSugestoes: 2,
    // Peso de cada sinal na pontuação final (somam 1).
    pesoPalavrasChave: 0.5,
    pesoSimilaridade: 0.5
  },
  // Entrada da base (tipo servico) mostrada como canal oficial quando a resposta é "Não encontrei isso na minha base".
  // null: mostra só o aviso para procurar o órgão responsável. Nenhum canal fora da base.
  canalOficialId: 'central-156' as string | null,
  // "Onde enviar" da Reclamação pronta: ids de fichas da base (tipo servico) com os canais de reclamação.
  // Só aparecem se a ficha tiver fonte oficial e verificada. Vazio: a parte fica desabilitada.
  canaisReclamacaoIds: ['reclamacao-onibus-sptrans', 'ouvidoria-sptrans'] as string[],
  entrada: {
    minCaracteres: 3,
    maxCaracteres: 300
  },
  // Camada de IA: desligada por padrão (só depois de pedida).
  ia: {
    ativada: false
  }
};

export type ConfigBusca = typeof CONFIG.busca;
export type ConfigEntrada = typeof CONFIG.entrada;
