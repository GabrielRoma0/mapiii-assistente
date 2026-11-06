import assert from 'node:assert/strict';
import { test as teste } from 'vitest';
import {
  AVISO_JURIDICO,
  atalhosComFichas,
  citarNorma,
  fichasDoAtalho,
  fichasParaMotorista,
  fichasParaNegativa,
  haQuantosDias,
  laudoUnico,
  textoChecklist,
  textoDoModelo
} from '../src/core/garantia.ts';
import { apagarCartao, CHAVE_CARTAO, guardarCartao, lerCartao, mensagemDoCartao, type Cartao } from '../src/core/cartao.ts';
import { PERGUNTAS, perguntasNoModo, validarPerguntas } from '../src/core/perguntas.ts';
import { avaliarEntrada } from '../src/core/regras.ts';
import type { Armazenamento } from '../src/core/registro.ts';
import type { Entrada } from '../src/core/kb-schema.ts';

// Fichas fictícias: os textos não são informação sobre direitos.
const LEI = [{ norma: 'Lei de exemplo 1/2000', artigo: 'art. 1º', url: 'https://exemplo.gov.br/lei' }];
const ficha = (id: string, extra: Partial<Entrada> = {}): Entrada => ({
  id,
  tipo: 'direito',
  titulo: `Direito ${id}`,
  resumo: 'Resumo.',
  publico: ['pessoa com deficiência'],
  cidade: 'SP',
  condicoes: { todas: [{ campo: 'p_objetivo', em: ['transporte'] }] },
  documentos: ['Documento A', 'Documento B'],
  onde: { texto: 'Posto de exemplo.', link: 'https://exemplo.gov.br/pedido' },
  prazo_tipico: 'Prazo de exemplo.',
  se_negarem: ['Passo de exemplo.'],
  perguntas_exemplo: ['x'],
  palavras_chave: ['x'],
  fonte_nome: 'Fonte de exemplo',
  fonte_url: 'https://exemplo.gov.br',
  tipo_fonte: 'oficial',
  verificado_em: '2026-10-28',
  limitacao: 'Limitação.',
  ...extra
});

// ---------- filtros ----------

teste('fichasParaMotorista: só fichas com frase e base legal', () => {
  const kb = [ficha('a'), ficha('b', { frase_motorista: 'Frase.', base_legal: LEI }), ficha('c', { frase_motorista: 'Frase.' })];
  assert.deepEqual(fichasParaMotorista(kb).map((e) => e.id), ['b']);
});

teste('fichasParaNegativa: fichas com modelo vêm primeiro; normas ficam de fora', () => {
  const kb = [
    ficha('so-passos'),
    ficha('com-modelo', { base_legal: LEI, modelo_recurso: { titulo: 'T', para: 'P', texto: '(preencha seu nome)' } }),
    ficha('norma', { tipo: 'norma' }),
    ficha('sem-nada', { se_negarem: undefined })
  ];
  assert.deepEqual(fichasParaNegativa(kb).map((e) => e.id), ['com-modelo', 'so-passos']);
});

teste('atalhos: só aparecem os que têm fichas', () => {
  const kb = [ficha('a', { atalhos: ['deslocamento'] }), ficha('b', { atalhos: ['deslocamento', 'dirigir'] })];
  assert.deepEqual(atalhosComFichas(kb), ['deslocamento', 'dirigir']);
  assert.deepEqual(fichasDoAtalho(kb, 'dirigir').map((e) => e.id), ['b']);
  assert.deepEqual(atalhosComFichas([]), []);
});

// ---------- textos ----------

teste('textoDoModelo: modelo, base legal com link, fonte e aviso jurídico', () => {
  const e = ficha('m', { base_legal: LEI, modelo_recurso: { titulo: 'Recurso de exemplo', para: 'Órgão de exemplo', texto: 'Eu, (preencha seu nome), peço revisão.' } });
  const t = textoDoModelo(e);
  assert.match(t, /^Recurso de exemplo\nPara: Órgão de exemplo\n\nEu, \(preencha seu nome\), peço revisão\./);
  assert.ok(t.includes('- Lei de exemplo 1/2000, art. 1º: https://exemplo.gov.br/lei'));
  assert.ok(t.includes('conferida em 28/10/2026'));
  assert.ok(t.endsWith(AVISO_JURIDICO));
  assert.equal(textoDoModelo(ficha('sem')), '');
  assert.equal(citarNorma({ norma: 'Lei X', url: 'https://a.gov.br' }), 'Lei X');
});

teste('textoChecklist: marca o que já foi separado e leva fonte e aviso de protótipo', () => {
  const t = textoChecklist(ficha('c', { requisitos_laudo: ['Item do laudo'] }), ['Documento B']);
  assert.ok(t.includes('[ ] Documento A\n[x] Documento B'));
  assert.ok(t.includes('O laudo precisa ter:\n- Item do laudo'));
  assert.ok(t.includes('Onde ir: Posto de exemplo. (https://exemplo.gov.br/pedido)'));
  assert.ok(t.includes('não um canal oficial'));
});

teste('laudoUnico: junta os itens dos direitos possíveis, sem repetir, e diz para quais servem', () => {
  const a = ficha('a', { requisitos_laudo: ['CID da deficiência', 'Data e assinatura do médico.'] });
  const b = ficha('b', { requisitos_laudo: ['data e assinatura do médico', 'Descrição da mobilidade'] });
  const c = ficha('c', { requisitos_laudo: ['Item que não se aplica'] });
  const r = laudoUnico([
    { entrada: a, classe: 'pode', porque: '' },
    { entrada: b, classe: 'talvez', porque: '' },
    { entrada: c, classe: 'nao', porque: '' }
  ]);
  assert.deepEqual(r.map((x) => [x.texto, x.para]), [
    ['CID da deficiência', ['Direito a']],
    ['Data e assinatura do médico.', ['Direito a', 'Direito b']],
    ['Descrição da mobilidade', ['Direito b']]
  ]);
});

teste('haQuantosDias: hoje, singular e plural', () => {
  const hoje = new Date('2026-11-06T15:00:00Z');
  assert.equal(haQuantosDias('2026-11-06', hoje), 'hoje');
  assert.equal(haQuantosDias('2026-11-05', hoje), 'há 1 dia');
  assert.equal(haQuantosDias('2026-10-25', hoje), 'há 12 dias');
});

// ---------- cartão da cadeira ----------

const CARTAO: Cartao = { cadeira: 'dobravel', peso: 'ate_15', portaMalas: 'sim', transferencia: 'pouca_ajuda', acompanhante: 'sim' };

teste('mensagemDoCartao: frase educada só com as escolhas, sem dado pessoal', () => {
  assert.equal(
    mensagemDoCartao(CARTAO),
    'Olá! Uso cadeira de rodas dobrável, de até 15 kg, que cabe no porta-malas de carro pequeno. Faço a transferência para o banco com um pouco de ajuda. Estou com um acompanhante. Agradeço!'
  );
  assert.equal(
    mensagemDoCartao({ cadeira: 'motorizada', peso: 'nao_sei', portaMalas: 'nao', transferencia: 'nao_faco', acompanhante: 'nao' }),
    'Olá! Uso cadeira de rodas motorizada. Ela não cabe no porta-malas de carro pequeno: preciso de carro maior ou adaptado. Viajo na própria cadeira: preciso de veículo adaptado. Agradeço!'
  );
});

function falso(): Armazenamento & { dados: Map<string, string> } {
  const dados = new Map<string, string>();
  return { dados, getItem: (k) => dados.get(k) ?? null, setItem: (k, v) => void dados.set(k, v), removeItem: (k) => void dados.delete(k) };
}

teste('cartão: guarda só os cinco campos, lê de volta e apaga', () => {
  const arm = falso();
  assert.equal(guardarCartao(arm, { ...CARTAO, nome: 'Maria' } as never), false, 'campo a mais é recusado');
  assert.equal(guardarCartao(arm, CARTAO), true);
  assert.deepEqual(lerCartao(arm), CARTAO);
  arm.setItem(CHAVE_CARTAO, '{"cadeira":"voadora"}');
  assert.equal(lerCartao(arm), null);
  apagarCartao(arm);
  assert.equal(arm.dados.has(CHAVE_CARTAO), false);
  assert.equal(lerCartao(null), null);
});

// ---------- modo pessoa / cuidador ----------

teste('perguntasNoModo: "Sou a pessoa" fala com você; os outros modos não mudam nada', () => {
  assert.deepEqual(validarPerguntas(PERGUNTAS), []);
  const eu = perguntasNoModo('pessoa');
  assert.equal(eu.find((p) => p.id === 'p_cidade')!.texto, 'Você mora na cidade de São Paulo?');
  assert.equal(perguntasNoModo('cuidador'), PERGUNTAS);
  assert.equal(perguntasNoModo(null), PERGUNTAS);
  const r = avaliarEntrada({ condicoes: { todas: [{ campo: 'p_cidade', em: ['sim'] }] } }, { p_cidade: 'sim' }, eu);
  assert.equal(r.porque, 'Combina com o que você respondeu: “Sim” para “Você mora na cidade de São Paulo?”.');
});

import { textoDaRota } from '../src/core/garantia.ts';

teste('textoDaRota: só "Pode ter direito" e "Talvez", com o que levar, onde ir e fonte; sem respostas da triagem', () => {
  const a = ficha('a');
  const b = ficha('b', { onde: { texto: 'Posto B.' } });
  const c = ficha('c');
  const t = textoDaRota([
    { entrada: a, classe: 'pode', porque: 'Combina com o que você respondeu: “Sim” para “Renda?”.' },
    { entrada: b, classe: 'talvez', porque: 'Depende da resposta.' },
    { entrada: c, classe: 'nao', porque: 'Não.' }
  ]);
  assert.ok(t.startsWith('Minha rota dos direitos (Mapiii)'));
  assert.ok(t.includes('1. Direito a · Pode ter direito'));
  assert.ok(t.includes('2. Direito b · Talvez'));
  assert.ok(t.includes('O que levar: Documento A, Documento B'));
  assert.ok(t.includes('Onde ir: Posto B.'));
  assert.ok(t.includes('Fonte: Fonte de exemplo (https://exemplo.gov.br), conferida em 28/10/2026.'));
  assert.ok(!t.includes('Direito c'), 'não inclui "Provavelmente não se aplica"');
  assert.ok(!t.includes('Renda'), 'não inclui as respostas da triagem (o porquê)');
  assert.ok(t.includes('não um canal oficial'));
  assert.equal(textoDaRota([{ entrada: c, classe: 'nao', porque: '' }]), '');
});
