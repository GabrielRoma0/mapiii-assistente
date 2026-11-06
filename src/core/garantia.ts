// Garantia de direitos (guia v2): "Me negaram, e agora?", "Mostre ao motorista", laudo único, checklist e atalhos.
// Tudo sai das fichas da base: nenhum texto de lei, frase ou modelo é escrito aqui.
import { AVISO_PROTOTIPO_TEXTO } from './avisos.ts';
import type { Atalho, BaseLegal, Entrada } from './kb-schema.ts';
import type { ItemRota } from './regras.ts';

export const AVISO_JURIDICO = 'Este modelo não substitui orientação jurídica. Se precisar de ajuda, procure a Defensoria Pública.';
export const AVISO_SEGURANCA = 'Sua segurança vem primeiro. Se a conversa ficar tensa, não insista: registre depois com a Reclamação pronta.';

export const NOMES_ATALHOS: Record<Atalho, { titulo: string; apoio: string }> = {
  deslocamento: { titulo: 'Como eu me desloco?', apoio: 'Transporte adaptado, gratuidade, táxi acessível e vaga especial.' },
  dirigir: { titulo: 'Quero dirigir', apoio: 'Habilitação e compra de carro adaptado.' },
  calcada: { titulo: 'Calçada ruim?', apoio: 'Como pedir o conserto e acompanhar o pedido.' }
};

/** Fichas com frase para a tela "Mostre ao motorista" (o validador garante base_legal). */
export const fichasParaMotorista = (kb: Entrada[]) => kb.filter((e) => e.frase_motorista && e.base_legal?.length);

/** Fichas com caminho para quando negarem: modelo de recurso ou passos de "Se negarem". Com modelo primeiro. */
export const fichasParaNegativa = (kb: Entrada[]) =>
  kb
    .filter((e) => e.tipo !== 'norma' && (e.modelo_recurso || e.se_negarem?.length))
    .sort((a, b) => Number(Boolean(b.modelo_recurso)) - Number(Boolean(a.modelo_recurso)));

export const fichasDoAtalho = (kb: Entrada[], atalho: Atalho) => kb.filter((e) => e.atalhos?.includes(atalho));

export const atalhosComFichas = (kb: Entrada[]) => (Object.keys(NOMES_ATALHOS) as Atalho[]).filter((a) => fichasDoAtalho(kb, a).length);

/** "Lei 13.146/2015, art. 46" */
export const citarNorma = (b: BaseLegal) => (b.artigo ? `${b.norma}, ${b.artigo}` : b.norma);

/** Texto do modelo para copiar ou imprimir: o modelo da ficha, a base legal com os links e o aviso. */
export function textoDoModelo(e: Entrada): string {
  if (!e.modelo_recurso) return '';
  const m = e.modelo_recurso;
  const base = (e.base_legal ?? []).map((b) => `- ${citarNorma(b)}: ${b.url}`);
  return [
    m.titulo,
    `Para: ${m.para}`,
    '',
    m.texto.trim(),
    '',
    'Base legal:',
    ...base,
    '',
    `Fonte: ${e.fonte_nome} (${e.fonte_url}), conferida em ${dataBR(e.verificado_em)}.`,
    AVISO_JURIDICO
  ].join('\n');
}

const dataBR = (iso: string) => iso.split('-').reverse().join('/');

/** Lista "O que levar" pronta para compartilhar no WhatsApp ou imprimir. */
export function textoChecklist(e: Entrada, marcados: string[] = []): string {
  const linhas = [`${e.titulo}: o que levar`, ''];
  for (const d of e.documentos ?? []) linhas.push(`${marcados.includes(d) ? '[x]' : '[ ]'} ${d}`);
  if (e.requisitos_laudo?.length) {
    linhas.push('', 'O laudo precisa ter:');
    for (const r of e.requisitos_laudo) linhas.push(`- ${r}`);
  }
  if (e.onde) linhas.push('', `Onde ir: ${e.onde.texto}${e.onde.link ? ` (${e.onde.link})` : ''}`);
  if (e.prazo_tipico) linhas.push(`Prazo típico: ${e.prazo_tipico}`);
  linhas.push('', `Fonte: ${e.fonte_nome} (${e.fonte_url}), conferida em ${dataBR(e.verificado_em)}.`, AVISO_PROTOTIPO_TEXTO);
  return linhas.join('\n');
}

export interface RequisitoLaudo {
  texto: string;
  /** Títulos das fichas que pedem este item. */
  para: string[];
}

/**
 * Laudo único: junta o que o laudo precisa conter para todos os direitos que podem se aplicar ("pode" e "talvez"),
 * sem repetir itens iguais (ignorando caixa e espaços), para pedir tudo numa consulta só.
 */
export function laudoUnico(rota: ItemRota[]): RequisitoLaudo[] {
  const porChave = new Map<string, RequisitoLaudo>();
  for (const { entrada, classe } of rota) {
    if (classe === 'nao') continue;
    for (const texto of entrada.requisitos_laudo ?? []) {
      const chave = texto.trim().toLowerCase().replace(/\s+/g, ' ').replace(/[.;]$/, '');
      const item = porChave.get(chave) ?? { texto: texto.trim(), para: [] };
      if (!item.para.includes(entrada.titulo)) item.para.push(entrada.titulo);
      porChave.set(chave, item);
    }
  }
  return [...porChave.values()];
}

/** Quantos dias desde a conferência ("hoje", "há 1 dia", "há 12 dias"), para o selo de confiança. */
export function haQuantosDias(verificadoEm: string, hoje: Date = new Date()): string {
  const conferida = Date.UTC(+verificadoEm.slice(0, 4), +verificadoEm.slice(5, 7) - 1, +verificadoEm.slice(8, 10));
  const agora = Date.UTC(hoje.getUTCFullYear(), hoje.getUTCMonth(), hoje.getUTCDate());
  const dias = Math.max(0, Math.round((agora - conferida) / 86_400_000));
  if (Number.isNaN(dias)) return '';
  return dias === 0 ? 'hoje' : dias === 1 ? 'há 1 dia' : `há ${dias} dias`;
}

const NOME_CLASSE = { pode: 'Pode ter direito', talvez: 'Talvez' } as const;

/**
 * "Compartilhar minha rota": só os direitos que podem se aplicar ("Pode ter direito" e "Talvez"), com o que levar,
 * onde ir e a fonte. Não inclui o porquê, que repete as respostas da triagem (dados sensíveis). Vazio se não há nada.
 */
export function textoDaRota(itens: ItemRota[]): string {
  const possiveis = itens.filter((i) => i.classe !== 'nao');
  if (!possiveis.length) return '';
  const blocos = possiveis.map(({ entrada: e, classe }, n) =>
    [
      `${n + 1}. ${e.titulo} · ${NOME_CLASSE[classe as 'pode' | 'talvez']}`,
      e.documentos?.length ? `   O que levar: ${e.documentos.join(', ')}` : '',
      e.onde ? `   Onde ir: ${e.onde.texto}${e.onde.link ? ` (${e.onde.link})` : ''}` : '',
      `   Fonte: ${e.fonte_nome} (${e.fonte_url}), conferida em ${dataBR(e.verificado_em)}.`
    ]
      .filter(Boolean)
      .join('\n')
  );
  return ['Minha rota dos direitos (Mapiii)', '', ...blocos.flatMap((b) => [b, '']), 'Quem decide é sempre o órgão responsável.', AVISO_PROTOTIPO_TEXTO].join('\n');
}
