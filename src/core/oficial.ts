// "Conferir se é oficial": a pessoa cola um link ou um valor cobrado.
// Tudo roda no aparelho, sem nenhuma requisição de rede: só compara com data/dominios-oficiais.json
// e data/servicos-valores.json. O texto colado não é guardado nem devolvido no resultado.
import { buscar, criarIndice } from './busca.ts';
import { temDadosPessoais } from './validar.ts';

export const AVISO_CHECAGEM = 'Esta checagem não garante nada. Confirme no site oficial.';
export const MAX_CARACTERES_CHECAGEM = 500;
const MAX_LINKS = 3;

export type ResultadoOficial = 'oficial' | 'suspeito' | 'nao_sei';

export interface Fonte {
  fonte_nome: string;
  fonte_url: string;
  verificado_em: string;
}

export interface SufixoOficial extends Fonte {
  sufixo: string;
  descricao: string;
}

export interface DominioOficial extends Fonte {
  dominio: string;
  nome: string;
}

export interface ListaDominios {
  sufixos: SufixoOficial[];
  dominios: DominioOficial[];
  /** Nomes que golpes costumam imitar. Só servem para marcar parecidos como suspeitos. */
  marcas: string[];
  golpes_conhecidos: string[];
  encurtadores: string[];
}

export interface ServicoValor extends Fonte {
  id: string;
  servico: string;
  /** Em reais. 0 = gratuito. */
  valor_oficial: number;
  palavras_chave: string[];
  /** Entrada da base sobre o mesmo serviço, se houver. */
  kb_id?: string;
}

export interface Achado {
  resultado: ResultadoOficial;
  motivo: string;
  fonte?: Fonte;
}

export type Checagem =
  | { ok: false; motivo: 'vazio' | 'longo' | 'dados_pessoais' | 'nada_para_conferir'; mensagem: string }
  | { ok: true; resultado: ResultadoOficial; achados: Achado[]; aviso: string };

// ---------- links ----------

const FIM_DE_TOKEN = /[),.;:!?"'»”]+$/;
const PARECE_LINK = /^(?:[a-z][a-z0-9+.-]*:\/\/|www\.)|^[^\s/@]*[a-z0-9-]\.[a-z]{2,}(?:[/:?#]|$)/i;

/** Pedaços do texto que parecem endereço de site (com ou sem http). */
export function extrairLinks(texto: string): string[] {
  return texto
    .split(/\s+/)
    .map((t) => t.replace(/^[(<"'«“]+/, '').replace(FIM_DE_TOKEN, ''))
    .filter((t) => t && !t.includes('@') && PARECE_LINK.test(t) && /[a-z]/i.test(t))
    .concat(
      // Links com "@" (truque usuário@site) também entram, mas e-mails soltos não.
      texto.split(/\s+/).filter((t) => /^[a-z][a-z0-9+.-]*:\/\/[^\s]*@/i.test(t))
    );
}

interface LinkLido {
  host: string;
  caminho: string;
  temArroba: boolean;
  protocolo: string;
}

function lerLink(link: string): LinkLido | null {
  const comProtocolo = /^[a-z][a-z0-9+.-]*:/i.test(link) && !/^[^:]+:\d/.test(link) ? link : `https://${link}`;
  try {
    const u = new URL(comProtocolo);
    return {
      host: u.hostname.toLowerCase().replace(/\.$/, ''),
      caminho: `${u.pathname}${u.search}`.toLowerCase(),
      temArroba: Boolean(u.username || u.password),
      protocolo: u.protocol
    };
  } catch {
    return null;
  }
}

const terminaEm = (host: string, dominio: string) => host === dominio || host.endsWith(`.${dominio}`);

/** Troca números e símbolos que imitam letras e tira hífens: "sptr4ns" → "sptrans", "1nss" → "inss". */
export function desconfundir(rotulo: string, umVira: 'i' | 'l' = 'i'): string {
  const mapa: Record<string, string> = { '0': 'o', '1': umVira, '3': 'e', '4': 'a', '5': 's', '7': 't', '8': 'b', '@': 'a' };
  return rotulo.replace(/[0-9@]/g, (c) => mapa[c] ?? c).replace(/[-_]/g, '');
}

export function levenshtein(a: string, b: string): number {
  const linha = Array.from({ length: b.length + 1 }, (_, j) => j);
  for (let i = 1; i <= a.length; i++) {
    let anterior = linha[0];
    linha[0] = i;
    for (let j = 1; j <= b.length; j++) {
      const guardado = linha[j];
      linha[j] = Math.min(linha[j] + 1, linha[j - 1] + 1, anterior + (a[i - 1] === b[j - 1] ? 0 : 1));
      anterior = guardado;
    }
  }
  return linha[b.length];
}

// Rótulos finais comuns que não dizem nada sobre o nome do site.
const TERMINACOES = new Set(['br', 'com', 'net', 'org', 'info', 'online', 'site', 'app', 'top', 'xyz', 'io', 'co', 'www', 'biz', 'me', 'link', 'click']);

const fimDoHost = (host: string) => host.split('.').slice(-2).join('.');
const aspas = (t: string) => `“${t}”`;

function parecido(host: string, lista: ListaDominios): string | null {
  const marcas = [...new Set([...lista.marcas, ...lista.dominios.map((d) => d.dominio.split('.')[0])])];
  const rotulos = host.split('.').filter((r) => !TERMINACOES.has(r));
  for (const rotulo of rotulos) {
    const versoes = [desconfundir(rotulo, 'i'), desconfundir(rotulo, 'l')];
    for (const marca of marcas) {
      if (rotulo === marca) {
        return `Usa o nome ${aspas(marca)}, mas o site termina em ${aspas(fimDoHost(host))}, que não é o endereço oficial.`;
      }
      if (versoes.includes(marca)) {
        return `Parece ${aspas(marca)}, mas troca letras por números ou usa hífen.`;
      }
      if (marca.length >= 4 && versoes.some((v) => v.includes(marca))) {
        return `Usa o nome ${aspas(marca)} misturado com outras palavras. Sites oficiais não fazem isso.`;
      }
      if (marca.length >= 5 && versoes.some((v) => levenshtein(v, marca) === 1)) {
        return `Tem o nome muito parecido com ${aspas(marca)}, com uma letra diferente.`;
      }
    }
  }
  return null;
}

export function analisarLink(link: string, lista: ListaDominios): Achado {
  const lido = lerLink(link);
  if (!lido || !lido.host) return { resultado: 'nao_sei', motivo: 'Não consegui ler este endereço. Digite você mesmo o endereço oficial.' };
  const { host, caminho } = lido;

  if (lido.protocolo !== 'https:' && lido.protocolo !== 'http:') {
    return { resultado: 'suspeito', motivo: 'Isto não é um endereço de site comum. Não abra.' };
  }
  if (lido.temArroba) {
    return { resultado: 'suspeito', motivo: `O endereço tem “@”. O site de verdade é ${aspas(host)}: o que vem antes do “@” serve para enganar.` };
  }
  if (/^\d{1,3}(\.\d{1,3}){3}$/.test(host) || host.startsWith('[')) {
    return { resultado: 'suspeito', motivo: 'O endereço é só números, sem nome de site. Sites oficiais não fazem isso.' };
  }
  if (lista.golpes_conhecidos.some((g) => terminaEm(host, g))) {
    return { resultado: 'suspeito', motivo: 'Este endereço está na lista de golpes conhecidos.' };
  }

  const dominio = lista.dominios.find((d) => terminaEm(host, d.dominio));
  if (dominio) {
    const { fonte_nome, fonte_url, verificado_em } = dominio;
    return { resultado: 'oficial', motivo: `Este endereço é do site da ${dominio.nome}.`, fonte: { fonte_nome, fonte_url, verificado_em } };
  }
  const sufixo = lista.sufixos.find((s) => terminaEm(host, s.sufixo));
  if (sufixo) {
    const { fonte_nome, fonte_url, verificado_em } = sufixo;
    return {
      resultado: 'oficial',
      motivo: `Este endereço termina em ${aspas(`.${sufixo.sufixo}`)}, que no Brasil só pode ser usado por ${sufixo.descricao.toLowerCase()}.`,
      fonte: { fonte_nome, fonte_url, verificado_em }
    };
  }

  if (lista.encurtadores.some((e) => terminaEm(host, e))) {
    return { resultado: 'nao_sei', motivo: 'É um link encurtado: ele esconde o site de destino. Não abra. Digite você mesmo o endereço oficial.' };
  }
  if (host.split('.').some((r) => r.startsWith('xn--'))) {
    return { resultado: 'suspeito', motivo: 'O endereço usa letras de outro alfabeto parecidas com as nossas. É um truque comum de golpe.' };
  }
  if (host.replace(/[^a-z0-9]/g, '').includes('govbr')) {
    return { resultado: 'suspeito', motivo: `Tem “gov.br” no endereço, mas o site termina em ${aspas(fimDoHost(host))}, que não é do governo.` };
  }
  const imitacao = parecido(host, lista);
  if (imitacao) return { resultado: 'suspeito', motivo: imitacao };
  if (caminho.replace(/[^a-z0-9]/g, '').includes('govbr')) {
    return { resultado: 'suspeito', motivo: `O “gov.br” aparece só depois da barra. O site de verdade é ${aspas(host)}, que não é do governo.` };
  }

  return {
    resultado: 'nao_sei',
    motivo: 'Não encontrei este endereço na lista de sites oficiais nem na de golpes conhecidos. Digite você mesmo o endereço oficial, sem clicar no link.'
  };
}

// ---------- valores ----------

const RE_VALOR = /R\$\s*(\d{1,3}(?:\.\d{3})+(?:,\d{1,2})?|\d+(?:,\d{1,2})?)|(\d{1,3}(?:\.\d{3})+(?:,\d{1,2})?|\d+(?:,\d{1,2})?)\s*reais\b/gi;

/** Valores em reais citados no texto: "R$ 50", "R$ 1.234,56", "30 reais". */
export function extrairValores(texto: string): number[] {
  return [...texto.matchAll(RE_VALOR)].map((m) => Number((m[1] ?? m[2]).replace(/\./g, '').replace(',', '.')));
}

export const reais = (v: number) => new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(v).replace(/\s/g, ' ');

export function analisarValor(texto: string, valores: number[], servicos: ServicoValor[]): Achado {
  const indice = criarIndice(servicos.map((s) => ({ ...s, titulo: s.servico })));
  const achado = buscar(texto, indice, { limiteResposta: 0.15, pesoPalavrasChave: 1, pesoSimilaridade: 0 }).melhor?.entrada;
  if (!achado) {
    return { resultado: 'nao_sei', motivo: 'Não sei quanto custa este serviço. Confira o valor no site oficial antes de pagar.' };
  }
  const { fonte_nome, fonte_url, verificado_em } = achado;
  const fonte = { fonte_nome, fonte_url, verificado_em };
  const cobrado = Math.max(...valores);
  if (valores.every((v) => Math.abs(v - achado.valor_oficial) < 0.005)) {
    return { resultado: 'oficial', motivo: `O valor bate com o que ${fonte_nome} informa para ${achado.servico}.`, fonte };
  }
  if (achado.valor_oficial === 0) {
    return {
      resultado: 'suspeito',
      motivo: `Pela fonte, ${achado.servico} não tem custo, e cobraram ${reais(cobrado)}. Cobrança para liberar é sinal comum de golpe. Não pague e não envie documentos.`,
      fonte
    };
  }
  return {
    resultado: 'suspeito',
    motivo: `Pela fonte, ${achado.servico} custa ${reais(achado.valor_oficial)}, e cobraram ${reais(cobrado)}. Valor diferente é sinal de golpe. Não pague antes de confirmar no site oficial.`,
    fonte
  };
}

// ---------- checagem completa ----------

const PIOR: ResultadoOficial[] = ['suspeito', 'nao_sei', 'oficial'];

export function conferirSeEOficial(entrada: unknown, lista: ListaDominios, servicos: ServicoValor[]): Checagem {
  const texto = typeof entrada === 'string' ? entrada.trim() : '';
  if (!texto) return { ok: false, motivo: 'vazio', mensagem: 'Cole um link ou um valor cobrado antes de conferir.' };
  if (texto.length > MAX_CARACTERES_CHECAGEM) {
    return { ok: false, motivo: 'longo', mensagem: `O texto passou de ${MAX_CARACTERES_CHECAGEM} caracteres. Cole só o link ou a frase com o valor.` };
  }

  const links = extrairLinks(texto);
  // Dados pessoais são procurados fora dos links: números de pedido dentro de um endereço não contam.
  const semLinks = links.reduce((t, l) => t.split(l).join(' '), texto);
  if (temDadosPessoais(semLinks.replace(RE_VALOR, ' '))) {
    return {
      ok: false,
      motivo: 'dados_pessoais',
      mensagem: 'Não cole senha, CPF, telefone, e-mail nem número de cartão. Apague e tente de novo. Este texto não foi processado nem guardado.'
    };
  }
  const valores = extrairValores(semLinks);
  if (!links.length && !valores.length) {
    return {
      ok: false,
      motivo: 'nada_para_conferir',
      mensagem: 'Não achei um link nem um valor. Cole um endereço, como www.exemplo.gov.br, ou um valor, como R$ 50,00.'
    };
  }

  const achados = [...new Set(links)].slice(0, MAX_LINKS).map((l) => analisarLink(l, lista));
  if (valores.length) achados.push(analisarValor(semLinks, valores, servicos));
  const resultado = PIOR.find((r) => achados.some((a) => a.resultado === r))!;
  return { ok: true, resultado, achados, aviso: AVISO_CHECAGEM };
}

// ---------- validação dos arquivos ----------

const texto = (v: unknown): v is string => typeof v === 'string' && v.trim().length > 0;
const objeto = (v: unknown): v is Record<string, unknown> => !!v && typeof v === 'object' && !Array.isArray(v);
// Data real (2026-02-31 não passa: Date.parse aceitaria e viraria 03/03) e não futura.
const dataOk = (v: unknown) => {
  if (typeof v !== 'string' || !/^\d{4}-\d{2}-\d{2}$/.test(v)) return false;
  const d = new Date(`${v}T00:00:00Z`);
  return !Number.isNaN(d.getTime()) && d.toISOString().slice(0, 10) === v && d.getTime() <= Date.now();
};
const httpsOk = (v: unknown) => {
  try {
    return texto(v) && new URL(v).protocol === 'https:';
  } catch {
    return false;
  }
};
const RE_DOMINIO = /^(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)*[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.[a-z]{2,}$/;

function validarFonte(o: Record<string, unknown>, erro: (m: string) => void) {
  if (!texto(o.fonte_nome)) erro('fonte_nome obrigatório.');
  if (!httpsOk(o.fonte_url)) erro('fonte_url precisa ser um link https.');
  if (!dataOk(o.verificado_em)) erro('verificado_em precisa ser uma data real e passada (AAAA-MM-DD).');
}

export function validarDominios(dados: unknown): string[] {
  if (!objeto(dados)) return ['dominios-oficiais.json precisa ser um objeto.'];
  const erros: string[] = [];
  const listaDeTextos = (campo: string, padrao?: RegExp) => {
    const v = dados[campo];
    if (!Array.isArray(v) || !v.every((x) => texto(x) && (!padrao || padrao.test(x)))) erros.push(`${campo} precisa ser uma lista de textos${padrao ? ' em minúsculas' : ''}.`);
  };
  if (!Array.isArray(dados.sufixos) || !dados.sufixos.length) erros.push('sufixos precisa ter ao menos 1 item.');
  else
    dados.sufixos.forEach((s: unknown, i) => {
      const erro = (m: string) => erros.push(`sufixos[${i}]: ${m}`);
      if (!objeto(s)) return erro('precisa ser um objeto.');
      if (!texto(s.sufixo) || !/^[a-z0-9]+\.br$/.test(s.sufixo)) erro('sufixo precisa ser como "gov.br" (sem ponto no começo).');
      if (!texto(s.descricao)) erro('descricao obrigatória.');
      validarFonte(s, erro);
    });
  if (!Array.isArray(dados.dominios)) erros.push('dominios precisa ser uma lista.');
  else
    dados.dominios.forEach((d: unknown, i) => {
      const erro = (m: string) => erros.push(`dominios[${i}]: ${m}`);
      if (!objeto(d)) return erro('precisa ser um objeto.');
      if (!texto(d.dominio) || !RE_DOMINIO.test(d.dominio) || d.dominio.startsWith('www.')) erro('dominio precisa ser como "sptrans.com.br", sem www e em minúsculas.');
      if (!texto(d.nome)) erro('nome obrigatório.');
      validarFonte(d, erro);
    });
  listaDeTextos('marcas', /^[a-z0-9]+$/);
  listaDeTextos('golpes_conhecidos', RE_DOMINIO);
  listaDeTextos('encurtadores', RE_DOMINIO);
  for (const k of Object.keys(dados)) {
    if (!['sufixos', 'dominios', 'marcas', 'golpes_conhecidos', 'encurtadores'].includes(k)) erros.push(`campo desconhecido: ${k}.`);
  }
  return erros;
}

export function validarServicosValores(dados: unknown, idsDaBase?: Set<string>): string[] {
  if (!Array.isArray(dados)) return ['servicos-valores.json precisa ser uma lista.'];
  const erros: string[] = [];
  const ids = new Set<string>();
  const conhecidos = new Set(['id', 'servico', 'valor_oficial', 'palavras_chave', 'fonte_nome', 'fonte_url', 'verificado_em', 'kb_id']);
  dados.forEach((s: unknown, i) => {
    const nome = objeto(s) && texto(s.id) ? s.id : `serviço #${i + 1}`;
    const erro = (m: string) => erros.push(`${nome}: ${m}`);
    if (!objeto(s)) return erro('precisa ser um objeto.');
    if (!texto(s.id) || !/^[a-z0-9]+(-[a-z0-9]+)*$/.test(s.id)) erro('id em minúsculas, números e hífen.');
    else if (ids.has(s.id)) erro('id repetido.');
    else ids.add(s.id);
    if (!texto(s.servico)) erro('servico obrigatório.');
    if (typeof s.valor_oficial !== 'number' || !Number.isFinite(s.valor_oficial) || s.valor_oficial < 0) erro('valor_oficial precisa ser um número em reais (0 = gratuito).');
    if (!Array.isArray(s.palavras_chave) || !s.palavras_chave.length || !s.palavras_chave.every(texto)) erro('palavras_chave precisa ter ao menos 1 texto.');
    if (s.kb_id !== undefined && (!texto(s.kb_id) || (idsDaBase && !idsDaBase.has(s.kb_id)))) erro('kb_id precisa ser o id de uma entrada de kb.json.');
    validarFonte(s, erro);
    for (const k of Object.keys(s)) if (!conhecidos.has(k)) erro(`campo desconhecido: ${k}.`);
  });
  return erros;
}
