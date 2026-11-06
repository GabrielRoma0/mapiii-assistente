import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { test as teste } from 'vitest';
import {
  AVISO_CHECAGEM,
  analisarLink,
  conferirSeEOficial,
  desconfundir,
  extrairLinks,
  extrairValores,
  levenshtein,
  validarDominios,
  validarServicosValores,
  type ListaDominios,
  type ServicoValor
} from '../src/core/oficial.ts';

const ler = (nome: string) => JSON.parse(readFileSync(fileURLToPath(new URL(`../data/${nome}`, import.meta.url)), 'utf8'));
const LISTA: ListaDominios = ler('dominios-oficiais.json');

// Serviços fictícios: só para testar a comparação de valores.
const fonte = { fonte_nome: 'Fonte de exemplo', fonte_url: 'https://exemplo.gov.br', verificado_em: '2026-10-01' };
const SERVICOS: ServicoValor[] = [
  { id: 'cartao-gratis', servico: 'o cartão de exemplo', valor_oficial: 0, palavras_chave: ['cartão de exemplo', 'segunda via'], ...fonte },
  { id: 'taxa-paga', servico: 'a taxa de exemplo', valor_oficial: 12.5, palavras_chave: ['taxa de exemplo'], ...fonte }
];
const link = (l: string) => analisarLink(l, LISTA);
const resultado = (l: string) => link(l).resultado;

// ---------- arquivos reais ----------

teste('dominios-oficiais.json e servicos-valores.json reais são válidos', () => {
  assert.deepEqual(validarDominios(LISTA), []);
  assert.deepEqual(validarServicosValores(ler('servicos-valores.json')), []);
});

teste('dominios-oficiais.json: os sufixos do Poder público têm fonte e data', () => {
  assert.deepEqual(LISTA.sufixos.map((s) => s.sufixo).sort(), ['def.br', 'gov.br', 'jus.br', 'leg.br', 'mil.br', 'mp.br', 'tc.br']);
});

// ---------- oficial ----------

teste('analisarLink: domínios terminados exatamente num sufixo oficial são oficiais', () => {
  for (const l of ['https://www.gov.br/inss', 'gov.br', 'capital.sp.gov.br/servicos', 'http://www.tjsp.jus.br', 'WWW.DEFENSORIA.SP.DEF.BR', 'meu.inss.gov.br.']) {
    assert.equal(resultado(l), 'oficial', l);
  }
});

teste('analisarLink: só vale o domínio inteiro, não um final de palavra parecido', () => {
  for (const l of ['golpegov.br', 'xsptrans.com.br', 'naojus.br']) assert.notEqual(resultado(l), 'oficial', l);
});

teste('analisarLink: domínio oficial cadastrado (SPTrans) é oficial e traz a fonte', () => {
  const r = link('https://www.sptrans.com.br/bilhete-unico');
  assert.equal(r.resultado, 'oficial');
  assert.match(r.motivo, /SPTrans/);
  assert.equal(r.fonte?.fonte_url, 'https://www.sptrans.com.br/');
});

// ---------- suspeito ----------

teste('analisarLink: "gov.br" dentro de outro domínio é suspeito', () => {
  for (const l of ['https://www.gov.br.beneficio-agora.com', 'inss-gov-br.com', 'govbr-pagamentos.net/inss']) {
    assert.equal(resultado(l), 'suspeito', l);
  }
  assert.match(link('www.gov.br.beneficio-agora.com').motivo, /^Tem “gov.br” no endereço, mas o site termina em “beneficio-agora.com”/);
});

teste('analisarLink: "gov.br" só no caminho, depois da barra, é suspeito', () => {
  const r = link('https://sitequalquer.com/gov.br/inss');
  assert.equal(r.resultado, 'suspeito');
  assert.match(r.motivo, /depois da barra/);
});

teste('analisarLink: letra trocada por número ou hífen é suspeito', () => {
  for (const l of ['sptr4ns.com.br', 'sp-trans.com.br', 'meu1nss.com', 'prefe1tura-sp.com']) {
    assert.equal(resultado(l), 'suspeito', l);
  }
  assert.match(link('sptr4ns.com.br').motivo, /troca letras por números/);
});

teste('analisarLink: nome oficial com outro final (TLD diferente) é suspeito', () => {
  for (const l of ['sptrans.com', 'sptrans.net.br', 'inss.com.br']) assert.equal(resultado(l), 'suspeito', l);
  assert.match(link('sptrans.com').motivo, /termina em “sptrans.com”/);
});

teste('analisarLink: nome oficial misturado ou com uma letra diferente é suspeito', () => {
  assert.equal(resultado('sptrans-recarga.com'), 'suspeito');
  assert.equal(resultado('bilheteunicoespecial.online'), 'suspeito');
  assert.equal(resultado('sptranss.com.br'), 'suspeito');
});

teste('analisarLink: punycode (letras de outro alfabeto) é suspeito', () => {
  assert.equal(resultado('https://xn--sptrns-4ya.com.br'), 'suspeito');
  // A própria URL converte letras de outro alfabeto para punycode.
  assert.equal(resultado('https://sрtrans.com.br'), 'suspeito');
});

teste('analisarLink: "@" no endereço e endereço só de números são suspeitos', () => {
  const arroba = link('https://www.gov.br@golpe.com/inss');
  assert.equal(arroba.resultado, 'suspeito');
  assert.match(arroba.motivo, /golpe.com/);
  assert.equal(resultado('http://192.168.0.10/inss'), 'suspeito');
});

teste('analisarLink: domínio da lista de golpes conhecidos é suspeito, mesmo parecido com oficial', () => {
  const lista = { ...LISTA, golpes_conhecidos: ['golpe-exemplo.com'] };
  assert.equal(analisarLink('https://sub.golpe-exemplo.com/x', lista).resultado, 'suspeito');
});

// ---------- não sei ----------

teste('analisarLink: site desconhecido e sem semelhança fica em "Não sei"', () => {
  const r = link('https://www.jornaldeexemplo.com.br/noticia');
  assert.equal(r.resultado, 'nao_sei');
  assert.match(r.motivo, /Digite você mesmo o endereço oficial/);
});

teste('analisarLink: link encurtado fica em "Não sei" e pede para não abrir', () => {
  const r = link('https://bit.ly/abc123');
  assert.equal(r.resultado, 'nao_sei');
  assert.match(r.motivo, /encurtado/);
});

teste('analisarLink: não confunde nomes comuns com marcas curtas', () => {
  for (const l of ['susanaconsultoria.com.br', 'govinda.com.br', 'governanca.org']) assert.equal(resultado(l), 'nao_sei', l);
});

// ---------- extração ----------

teste('extrairLinks: acha links com e sem http e ignora pontuação, valores e e-mails', () => {
  assert.deepEqual(extrairLinks('Recebi isto: https://www.gov.br/inss, e também sptr4ns.com.br.'), ['https://www.gov.br/inss', 'sptr4ns.com.br']);
  assert.deepEqual(extrairLinks('Cobraram R$ 1.234,56 pelo cartão.'), []);
  assert.deepEqual(extrairLinks('fale com a@b.com'), []);
});

teste('extrairValores: lê reais no formato brasileiro', () => {
  assert.deepEqual(extrairValores('Cobraram R$ 50 e depois R$1.234,56'), [50, 1234.56]);
  assert.deepEqual(extrairValores('pediram 30 reais'), [30]);
  assert.deepEqual(extrairValores('lei 13.146 de 2015'), []);
});

teste('desconfundir e levenshtein', () => {
  assert.equal(desconfundir('sptr4ns'), 'sptrans');
  assert.equal(desconfundir('1nss'), 'inss');
  assert.equal(desconfundir('pref3itura-sp'), 'prefeiturasp');
  assert.equal(levenshtein('sptranss', 'sptrans'), 1);
  assert.equal(levenshtein('', 'abc'), 3);
});

// ---------- valores ----------

teste('conferirSeEOficial: cobrança por serviço gratuito é suspeita e cita a fonte', () => {
  const r = conferirSeEOficial('Cobraram R$ 50,00 para liberar o cartão de exemplo', LISTA, SERVICOS);
  assert.equal(r.ok && r.resultado, 'suspeito');
  assert.ok(r.ok && /não tem custo/.test(r.achados[0].motivo) && /R\$ 50,00/.test(r.achados[0].motivo));
  assert.equal(r.ok && r.achados[0].fonte?.fonte_nome, 'Fonte de exemplo');
});

teste('conferirSeEOficial: valor igual ao oficial bate; diferente é suspeito', () => {
  const igual = conferirSeEOficial('pediram R$ 12,50 da taxa de exemplo', LISTA, SERVICOS);
  assert.equal(igual.ok && igual.resultado, 'oficial');
  const diferente = conferirSeEOficial('pediram R$ 80 da taxa de exemplo', LISTA, SERVICOS);
  assert.equal(diferente.ok && diferente.resultado, 'suspeito');
  assert.match(diferente.ok ? diferente.achados[0].motivo : '', /custa R\$ 12,50/);
});

teste('conferirSeEOficial: valor de serviço que não está na lista fica em "Não sei"', () => {
  const r = conferirSeEOficial('cobraram R$ 30 pela vistoria', LISTA, SERVICOS);
  assert.equal(r.ok && r.resultado, 'nao_sei');
});

// ---------- checagem completa ----------

teste('conferirSeEOficial: o pior resultado vence (suspeito > não sei > oficial)', () => {
  const r = conferirSeEOficial('www.gov.br/inss e também sptr4ns.com.br', LISTA, SERVICOS);
  assert.equal(r.ok && r.resultado, 'suspeito');
  assert.equal(r.ok && r.achados.length, 2);
  const s = conferirSeEOficial('www.gov.br e jornaldeexemplo.com.br', LISTA, SERVICOS);
  assert.equal(s.ok && s.resultado, 'nao_sei');
});

teste('conferirSeEOficial: todo resultado traz o aviso de que a checagem não garante nada', () => {
  const r = conferirSeEOficial('https://www.gov.br', LISTA, SERVICOS);
  assert.equal(r.ok && r.aviso, AVISO_CHECAGEM);
  assert.equal(AVISO_CHECAGEM, 'Esta checagem não garante nada. Confirme no site oficial.');
});

teste('conferirSeEOficial: vazio, longo demais ou sem link nem valor dá mensagem amigável', () => {
  assert.equal(conferirSeEOficial('   ', LISTA, SERVICOS).ok, false);
  assert.equal(conferirSeEOficial(null, LISTA, SERVICOS).ok, false);
  const longo = conferirSeEOficial('gov.br ' + 'a'.repeat(600), LISTA, SERVICOS);
  assert.equal(!longo.ok && longo.motivo, 'longo');
  const nada = conferirSeEOficial('isso é golpe?', LISTA, SERVICOS);
  assert.equal(!nada.ok && nada.motivo, 'nada_para_conferir');
});

teste('conferirSeEOficial: CPF, telefone ou cartão são recusados e não voltam no resultado', () => {
  for (const t of ['meu cpf 123.456.789-09 e o link gov.br', 'cartão 4111 1111 1111 1111 R$ 50', 'me ligue (11) 91234-5678']) {
    const r = conferirSeEOficial(t, LISTA, SERVICOS);
    assert.equal(!r.ok && r.motivo, 'dados_pessoais', t);
    assert.equal(JSON.stringify(r).includes('123') || JSON.stringify(r).includes('4111') || JSON.stringify(r).includes('91234'), false);
  }
});

teste('conferirSeEOficial: número comprido dentro do link não é dado pessoal', () => {
  const r = conferirSeEOficial('https://www.gov.br/pedido/12345678901234', LISTA, SERVICOS);
  assert.equal(r.ok && r.resultado, 'oficial');
});

teste('conferirSeEOficial: o texto colado não volta no resultado', () => {
  const r = conferirSeEOficial('palavraunicaxyz em https://jornaldeexemplo.com.br/palavraunicaxyz', LISTA, SERVICOS);
  assert.equal(JSON.stringify(r).includes('palavraunicaxyz'), false);
});

// ---------- validadores ----------

teste('validarDominios: aponta sufixo, domínio e fonte errados', () => {
  const ruim = { ...LISTA, sufixos: [{ ...LISTA.sufixos[0], sufixo: '.gov.br', verificado_em: '2999-01-01' }], dominios: [{ ...LISTA.dominios[0], dominio: 'www.sptrans.com.br' }], extra: 1 };
  const e = validarDominios(ruim).join(' | ');
  for (const t of ['sufixo', 'verificado_em', 'dominio', 'campo desconhecido']) assert.ok(e.includes(t), t);
});

teste('validarServicosValores: exige fonte, valor numérico e kb_id existente', () => {
  const e = validarServicosValores(
    [{ id: 'x', servico: 'S', valor_oficial: '10', palavras_chave: ['s'], fonte_nome: 'F', fonte_url: 'http://a', verificado_em: '2026-01-01', kb_id: 'nao-existe' }],
    new Set(['outra'])
  ).join(' | ');
  for (const t of ['valor_oficial', 'fonte_url', 'kb_id']) assert.ok(e.includes(t), t);
  assert.deepEqual(validarServicosValores(SERVICOS), []);
});
