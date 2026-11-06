// Reclamação pronta (Fase 3): monta um texto neutro e factual para a pessoa copiar e enviar ela mesma.
// Nada é enviado nem guardado. Sem nome, CPF ou contato: a pessoa preenche isso fora do app.
// Não cita lei: o texto só descreve o fato. (Citar lei exigiria uma ficha da base com fonte oficial.)
import type { Entrada } from './kb-schema.ts';
import { tipoFonteNaTela } from './kb-schema.ts';

export const AVISO_NAO_ENVIA = 'O app não envia a reclamação por você.';
export const SEM_CANAL = 'Canal oficial ainda não confirmado na base';

export const OCORRIDOS = {
  rampa_elevador: 'Rampa ou elevador com defeito',
  nao_parou: 'O veículo não parou',
  recusa_embarque: 'Recusa de embarque',
  outro: 'Outro'
} as const;
export type Ocorrido = keyof typeof OCORRIDOS;

export interface DadosReclamacao {
  /** Número ou nome da linha, como no letreiro (ex.: 8000-10). */
  linha: string;
  /** AAAA-MM-DD. */
  data: string;
  /** HH:MM aproximado; opcional. */
  hora?: string;
  /** Prefixo do veículo; opcional. */
  prefixo?: string;
  ocorrido: Ocorrido;
}

export type ErrosReclamacao = Partial<Record<keyof DadosReclamacao, string>>;

/** Erros por campo, em linguagem simples. Vazio quando dá para gerar o texto. */
export function validarReclamacao(d: Partial<Record<keyof DadosReclamacao, unknown>>, hoje: Date): ErrosReclamacao {
  const erros: ErrosReclamacao = {};
  const linha = typeof d.linha === 'string' ? d.linha.trim() : '';
  if (!/^[\p{L}\p{N}-]{1,10}$/u.test(linha)) erros.linha = 'Escreva a linha como no letreiro, até 10 caracteres. Por exemplo: 8000-10.';

  const data = typeof d.data === 'string' ? d.data : '';
  const quando = /^\d{4}-\d{2}-\d{2}$/.test(data) ? new Date(`${data}T12:00:00Z`) : null;
  const limite = new Date(hoje.getTime() - 366 * 24 * 3600 * 1000);
  if (!quando || Number.isNaN(quando.getTime()) || quando.toISOString().slice(0, 10) !== data) erros.data = 'Escolha a data em que aconteceu.';
  else if (data > hoje.toISOString().slice(0, 10)) erros.data = 'A data não pode ser no futuro.';
  else if (quando < limite) erros.data = 'Use uma data do último ano.';

  if (d.hora !== undefined && d.hora !== '' && !(typeof d.hora === 'string' && /^([01]\d|2[0-3]):[0-5]\d$/.test(d.hora))) erros.hora = 'Use o formato de hora, por exemplo 14:30.';
  if (d.prefixo !== undefined && d.prefixo !== '' && !(typeof d.prefixo === 'string' && /^[0-9]{3,6}$/.test(d.prefixo.trim()))) {
    erros.prefixo = 'O prefixo tem só números, de 3 a 6 dígitos, e fica pintado no ônibus.';
  }
  if (typeof d.ocorrido !== 'string' || !(d.ocorrido in OCORRIDOS)) erros.ocorrido = 'Escolha o que aconteceu.';
  return erros;
}

// Frases factuais: descrevem o que aconteceu, sem apontar culpados nem adjetivos.
const FATOS: Record<Ocorrido, string> = {
  rampa_elevador: 'a rampa ou o elevador de acesso do veículo não funcionou no momento do embarque de uma pessoa com deficiência.',
  nao_parou: 'o veículo não parou no ponto para o embarque de uma pessoa com deficiência que aguardava.',
  recusa_embarque: 'o embarque de uma pessoa com deficiência foi recusado.',
  outro: 'houve um problema de acessibilidade no embarque de uma pessoa com deficiência.'
};

const dataBR = (iso: string) => iso.split('-').reverse().join('/');

/** Texto pronto para copiar. Só usa os campos do formulário, já validados. */
export function gerarTextoReclamacao(d: DadosReclamacao): string {
  const linha = d.linha.trim();
  const prefixo = d.prefixo?.trim();
  const quando = `Em ${dataBR(d.data)}${d.hora ? `, por volta das ${d.hora.replace(':', 'h')}` : ''}`;
  const onde = `na linha ${linha}${prefixo ? ` (veículo de prefixo ${prefixo})` : ''}`;
  return [
    `Assunto: Problema de acessibilidade no ônibus da linha ${linha}`,
    '',
    `${quando}, ${onde}, ${FATOS[d.ocorrido]}`,
    '',
    'Peço que a ocorrência seja registrada e verificada, e que eu receba um retorno sobre as providências tomadas.',
    '',
    'Nome: (preencha ao enviar)',
    'Contato para resposta: (preencha ao enviar)'
  ].join('\n');
}

/**
 * "Onde enviar": só canais que estão na base como ficha com fonte OFICIAL e verificada.
 * Fonte secundária, desatualizada (inclusive por ter mais de 6 meses) ou id que não existe ficam de fora.
 */
export function canaisDeReclamacao(kb: Entrada[], ids: string[], hoje: Date): Entrada[] {
  return ids
    .map((id) => kb.find((e) => e.id === id))
    // tipoFonteNaTela já devolve 'secundaria' ou 'desatualizada' (inclusive por idade); a data precisa existir.
    .filter((e): e is Entrada => !!e && /^\d{4}-\d{2}-\d{2}$/.test(e.verificado_em) && tipoFonteNaTela(e, hoje) === 'oficial' && !!e.onde);
}
