// Validação da pergunta digitada. Nada aqui devolve ou guarda o texto de uma entrada recusada:
// o resultado de recusa só tem { ok: false, motivo, mensagem }.
import { CONFIG, type ConfigEntrada } from './config.ts';
import { normalizar, tokenizar } from './normalizar.ts';
import type { Indice } from './busca.ts';

export type MotivoRecusa =
  | 'vazio'
  | 'emergencia'
  | 'curto'
  | 'longo'
  | 'simbolos_numeros'
  | 'dados_pessoais'
  | 'aconselhamento_juridico'
  | 'aconselhamento_medico';

export type ResultadoValidacao = { ok: true; texto: string } | { ok: false; motivo: MotivoRecusa; mensagem: string };

/** Em emergência de saúde, esta é a resposta inteira: nenhuma outra orientação. */
export const MENSAGEM_EMERGENCIA = 'Em emergência, ligue 192.';

const MENSAGENS = {
  vazio: 'Escreva sua pergunta antes de enviar. Por exemplo: “Como peço o passe livre?”',
  curto: (min: number) => `Sua pergunta ficou curta demais. Escreva com pelo menos ${min} caracteres.`,
  longo: (max: number) => `Sua pergunta passou de ${max} caracteres. Tente resumir em uma ou duas frases.`,
  simbolos_numeros: 'Não consegui ler uma pergunta aqui. Use palavras, por exemplo: “Quem pode pedir o BPC?”',
  dados_pessoais:
    'Parece que você digitou um dado pessoal, como CPF, telefone ou e-mail. Não precisamos dele. Apague e tente de novo. Este texto não foi processado nem guardado.',
  aconselhamento_juridico:
    'Não posso orientar sobre um caso na Justiça, como processos ou indenizações. Para isso, procure a Defensoria Pública ou um advogado. Posso mostrar como funcionam os direitos e serviços da minha base.',
  aconselhamento_medico:
    'Não posso dar orientação de saúde para um caso, como remédio, dose ou diagnóstico. Procure um serviço de saúde. Posso mostrar direitos e serviços públicos ligados à saúde.'
};

// Dados pessoais (padrões de formato; não verificam dígitos).
const RE_EMAIL = /[^\s@]+@[^\s@]+\.[^\s@]+/;
const RE_CPF = /\b\d{3}\.?\d{3}\.?\d{3}-?\d{2}\b/;
const RE_TELEFONE = /(?:\+?55\s?)?\(?\b\d{2}\)?[\s.-]?9?\d{4}[\s.-]?\d{4}\b|\b9?\d{4}-\d{4}\b/;
// Qualquer sequência de 10 ou mais dígitos, mesmo com espaço, ponto, hífen ou parênteses no meio.
const RE_DIGITOS_LONGOS = /\d{10,}/;

export function temDadosPessoais(texto: string): boolean {
  if (RE_EMAIL.test(texto) || RE_CPF.test(texto) || RE_TELEFONE.test(texto)) return true;
  return RE_DIGITOS_LONGOS.test(texto.replace(/[\s.\-()]/g, ''));
}

// Aplicadas ao texto normalizado (minúsculas, sem acento, pontuação virou espaço).
// Emergência: situação acontecendo agora. Termos que também aparecem em perguntas sobre direitos
// ("sequela de AVC", "pronto-socorro", "SAMU") só contam quando a frase diz que está acontecendo.
const RE_EMERGENCIA = new RegExp(
  [
    'emergencia',
    '(?<!pronto )socorro',
    'ambulancia',
    'desmai\\w*',
    'nao (esta|ta) respirando',
    'parou de respirar',
    'sem respirar',
    'convulsionando',
    '(esta|ta|estou|to) (tendo|com) (uma? )?(convulsao|infarto|avc|derrame|parada)',
    'sangrando muito',
    'hemorragia',
    'engasgad[oa]|engasgando',
    'overdose',
    'envenenad[oa]|envenenamento',
    'perdeu a consciencia|inconsciente',
    'nao acorda',
    'caiu e bateu a cabeca',
    '(quero|vou|quer|vai) (me|se) matar',
    'suicid\\w*'
  ]
    .map((p) => `\\b(?:${p})\\b`)
    .join('|')
);

// Pedido de orientação para um caso na Justiça. "Recorrer" de um pedido negado é caminho administrativo e passa.
const RE_JURIDICO =
  /\b(processar|processo judicial|acao judicial|entrar na justica|entrar com (uma )?acao|indenizacao|indenizar|liminar|mandado de seguranca|ganh(ar|o) a causa)\b/;

// Pedido de orientação de saúde para um caso. Perguntas sobre direitos ligados à saúde
// ("remédio de graça", "laudo para o BPC", "terapia pelo SUS") passam.
const RE_MEDICO = new RegExp(
  [
    '(que|qual|quais) (remedio|medicamento)s? (eu |ele |ela )?(tomo|tomar|devo|posso|usar|uso|e bom|e melhor|serve)',
    '(devo|posso) tomar',
    'dose|dosagem',
    'como (tratar|curar)',
    'o que (eu tenho|ele tem|ela tem)',
    'que doenca',
    'qual (o |a )?diagnostico',
    'sintomas? de',
    'e normal sentir',
    'fraturei|me machuquei|me cortei',
    'torci (o|a|meu|minha)'
  ]
    .map((p) => `\\b(?:${p})\\b`)
    .join('|')
);

export function ehEmergencia(texto: string): boolean {
  return RE_EMERGENCIA.test(normalizar(texto));
}

export function validarEntrada(entrada: unknown, cfg: ConfigEntrada = CONFIG.entrada): ResultadoValidacao {
  const recusa = (motivo: MotivoRecusa, mensagem: string): ResultadoValidacao => ({ ok: false, motivo, mensagem });
  const texto = typeof entrada === 'string' ? entrada.trim() : '';

  if (!texto) return recusa('vazio', MENSAGENS.vazio);
  // Emergência vem antes de tudo, até de dados pessoais e do limite de tamanho: a resposta é só o 192.
  if (ehEmergencia(texto)) return recusa('emergencia', MENSAGEM_EMERGENCIA);
  // Dados pessoais logo depois: mesmo um texto longo demais não pode seguir adiante.
  if (temDadosPessoais(texto)) return recusa('dados_pessoais', MENSAGENS.dados_pessoais);
  if (texto.length > cfg.maxCaracteres) return recusa('longo', MENSAGENS.longo(cfg.maxCaracteres));
  if (texto.length < cfg.minCaracteres) return recusa('curto', MENSAGENS.curto(cfg.minCaracteres));

  const normal = normalizar(texto);
  if (!/[a-z]/.test(normal)) return recusa('simbolos_numeros', MENSAGENS.simbolos_numeros);
  if (RE_JURIDICO.test(normal)) return recusa('aconselhamento_juridico', MENSAGENS.aconselhamento_juridico);
  if (RE_MEDICO.test(normal)) return recusa('aconselhamento_medico', MENSAGENS.aconselhamento_medico);

  return { ok: true, texto };
}

// Termos do assunto do app, para separar "fora do tema" de "do tema, mas não está na base".
// Não é informação: só decide qual mensagem mostrar quando a busca não acha nada.
const TERMOS_DOMINIO = new Set(
  [
    'direito', 'direitos', 'beneficio', 'bpc', 'loas', 'auxilio', 'aposentadoria', 'pensao', 'isencao', 'gratuidade',
    'passe livre', 'bilhete', 'onibus', 'metro', 'trem', 'transporte', 'sptrans', 'atende', 'carro', 'ipva', 'icms',
    'estacionamento', 'vaga', 'credencial', 'cartao',
    'deficiencia', 'deficiente', 'pcd', 'cadeirante', 'cadeira de rodas', 'andador', 'muleta', 'cego', 'surdo',
    'autismo', 'autista', 'tea', 'mobilidade', 'acessibilidade', 'acessivel', 'calcada', 'rampa', 'inclusao',
    'laudo', 'relatorio medico', 'pericia', 'inss', 'cadastro unico', 'cadunico', 'cras', 'creas', 'assistencia social',
    'escola', 'matricula', 'professor', 'cuidador', 'acompanhante', 'saude', 'sus', 'ubs', 'terapia', 'fisioterapia',
    'equipamento', 'ortese', 'protese', 'remedio', 'medicamento', 'fralda',
    'prefeitura', 'subprefeitura', 'governo', 'defensoria', 'documento', 'rg', 'ciptea', 'pedido', 'negaram', 'recurso',
    'golpe', 'oficial', 'cobranca', 'taxa', 'idoso', 'crianca'
  ].flatMap(tokenizar)
);

// true se nenhuma palavra da pergunta aparece na base nem no vocabulário do tema.
export function foraDoTema(pergunta: string, indice: Indice<unknown>): boolean {
  const tokens = tokenizar(pergunta);
  const vocabulario = new Set<string>();
  for (const item of indice.entradas) for (const t of item.vocabulario) vocabulario.add(t);
  return !tokens.some((t) => vocabulario.has(t) || TERMOS_DOMINIO.has(t));
}
