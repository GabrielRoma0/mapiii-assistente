// SÓ PARA DESENVOLVIMENTO. Base fictícia usada quando data/kb.json está vazio e o app roda com `npm run dev`,
// para dar para ver e testar as telas. Não é informação sobre direitos e não entra no build de produção.
import type { Entrada } from '../core/kb-schema.ts';

const fonte = {
  cidade: 'SP' as const,
  fonte_nome: 'Fonte de exemplo',
  fonte_url: 'https://www.exemplo.gov.br/',
  limitacao: 'Entrada de exemplo, só para testar a tela. Não use como informação.'
};

export const KB_EXEMPLO: Entrada[] = [
  {
    id: 'exemplo-transporte',
    tipo: 'direito',
    titulo: 'Direito de exemplo A',
    resumo: 'Texto de exemplo sobre transporte, só para testar a tela.',
    publico: ['pessoa com deficiência', 'familiar ou responsável'],
    condicoes: {
      todas: [{ campo: 'p_objetivo', em: ['transporte'] }, { campo: 'p_cidade', em: ['sim'] }],
      alguma: [{ campo: 'p_necessidade', em: ['mobilidade'] }],
      nenhuma: [{ campo: 'p_beneficios', em: ['passe_livre'] }]
    },
    documentos: ['Documento de exemplo 1', 'Documento de exemplo 2', 'Documento de exemplo 3'],
    onde: { texto: 'Local de exemplo.', link: 'https://www.exemplo.gov.br/pedido' },
    prazo_tipico: 'Prazo de exemplo.',
    passos: ['Primeiro passo de exemplo.', 'Segundo passo de exemplo.'],
    se_negarem: ['Primeiro passo de exemplo se negarem.', 'Segundo passo de exemplo se negarem.'],
    perguntas_exemplo: ['Como peço o passe de exemplo?', 'Cadeirante paga o transporte de exemplo?'],
    palavras_chave: ['passe de exemplo', 'transporte', 'ônibus'],
    tipo_fonte: 'oficial',
    verificado_em: '2026-10-28',
    ...fonte
  },
  {
    id: 'exemplo-beneficio',
    tipo: 'direito',
    titulo: 'Direito de exemplo B',
    resumo: 'Texto de exemplo sobre benefício, só para testar a tela.',
    publico: ['pessoa com deficiência'],
    condicoes: {
      todas: [{ campo: 'p_objetivo', em: ['beneficio_financeiro'] }, { campo: 'p_laudo', em: ['sim'] }]
    },
    documentos: ['Documento de exemplo 1'],
    onde: { texto: 'Atendimento de exemplo por telefone.' },
    prazo_tipico: 'Prazo de exemplo.',
    se_negarem: ['Passo de exemplo se negarem.'],
    perguntas_exemplo: ['Quem pode receber o benefício de exemplo?'],
    palavras_chave: ['benefício de exemplo', 'renda'],
    tipo_fonte: 'secundaria',
    verificado_em: '2026-09-01',
    ...fonte
  },
  {
    id: 'exemplo-central',
    tipo: 'servico',
    titulo: 'Central de exemplo',
    resumo: 'Canal de exemplo, só para testar a tela.',
    publico: ['cidadãos em geral'],
    condicoes: { nenhuma: [{ campo: 'p_quem', em: ['so_pesquisando'] }] },
    documentos: ['Nenhum documento de exemplo.'],
    onde: { texto: 'Telefone de exemplo ou site de exemplo.', link: 'https://www.exemplo.gov.br/central' },
    prazo_tipico: 'Prazo de exemplo.',
    se_negarem: ['Passo de exemplo.'],
    perguntas_exemplo: ['Onde peço ajuda de exemplo?'],
    palavras_chave: ['central de exemplo', 'atendimento'],
    tipo_fonte: 'desatualizada',
    verificado_em: '2025-03-12',
    ...fonte
  }
];
