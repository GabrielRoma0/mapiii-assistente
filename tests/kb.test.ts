import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { test as teste } from 'vitest';
import { validarKb, tipoFonteNaTela, TIPOS, TIPOS_FONTE } from '../src/core/kb-schema.ts';

const HOJE = new Date('2026-11-04T12:00:00Z');

// Entrada fictícia só para os testes: não é informação sobre direitos.
const base = (): Record<string, unknown> => ({
  id: 'direito-exemplo',
  tipo: 'direito',
  titulo: 'Direito de exemplo',
  resumo: 'Resumo de exemplo.',
  publico: ['pessoa com deficiência'],
  cidade: 'SP',
  condicoes: {
    todas: [{ campo: 'p_objetivo', em: ['transporte'] }],
    alguma: [{ campo: 'p_necessidade', em: ['mobilidade'] }]
  },
  documentos: ['Documento com foto'],
  onde: { texto: 'Posto de exemplo.', link: 'https://exemplo.gov.br/pedido' },
  prazo_tipico: 'Algumas semanas.',
  se_negarem: ['Peça o motivo por escrito.'],
  perguntas_exemplo: ['Como peço o direito de exemplo?'],
  palavras_chave: ['exemplo'],
  fonte_nome: 'Fonte de exemplo',
  fonte_url: 'https://exemplo.gov.br/norma',
  tipo_fonte: 'oficial',
  verificado_em: '2026-10-01',
  limitacao: 'Quem decide é o órgão responsável.'
});
const com = (mudancas: Record<string, unknown>) => ({ ...base(), ...mudancas });
const sem = (...campos: string[]) => {
  const e = base();
  for (const c of campos) delete e[c];
  return e;
};
const erros = (...entradas: unknown[]) => validarKb(entradas, HOJE);
const soErro = (entrada: unknown, trecho: string) => {
  const e = validarKb([entrada], HOJE);
  assert.ok(e.some((m) => m.includes(trecho)), `esperava erro sobre "${trecho}", veio: ${JSON.stringify(e)}`);
};

teste('validarKb: entrada completa e base vazia são válidas', () => {
  assert.deepEqual(erros(base()), []);
  assert.deepEqual(validarKb([], HOJE), []);
});

teste('validarKb: a base precisa ser uma lista de objetos', () => {
  assert.ok(validarKb({}, HOJE).length > 0);
  assert.ok(validarKb(null, HOJE).length > 0);
  soErro('texto', 'objeto');
});

teste('validarKb: id obrigatório, em minúsculas com hífen, e único', () => {
  soErro(com({ id: '' }), 'id');
  soErro(com({ id: 'Bilhete Único' }), 'id');
  assert.ok(erros(base(), base()).some((m) => m.includes('repetido')));
});

teste('validarKb: tipo só aceita direito, servico ou norma', () => {
  assert.deepEqual([...TIPOS], ['direito', 'servico', 'norma']);
  soErro(com({ tipo: 'beneficio' }), 'tipo');
  assert.deepEqual(erros(com({ tipo: 'servico' })), []);
});

teste('validarKb: titulo, resumo, publico e cidade são obrigatórios', () => {
  soErro(sem('titulo'), 'titulo');
  soErro(com({ resumo: ' ' }), 'resumo');
  soErro(com({ publico: [] }), 'publico');
  soErro(com({ publico: 'todos' }), 'publico');
  soErro(com({ cidade: 'RJ' }), 'cidade');
});

teste('validarKb: nenhuma entrada sem fonte (nome e link https)', () => {
  soErro(com({ fonte_nome: '' }), 'fonte_nome');
  soErro(sem('fonte_url'), 'fonte_url');
  soErro(com({ fonte_url: 'www.exemplo.gov.br' }), 'fonte_url');
  soErro(com({ fonte_url: 'http://exemplo.gov.br' }), 'fonte_url');
  soErro(com({ fonte_url: 'javascript:alert(1)' }), 'fonte_url');
});

teste('validarKb: tipo_fonte só aceita oficial, secundaria ou desatualizada', () => {
  assert.deepEqual([...TIPOS_FONTE], ['oficial', 'secundaria', 'desatualizada']);
  soErro(com({ tipo_fonte: 'primaria' }), 'tipo_fonte');
  for (const t of TIPOS_FONTE) assert.deepEqual(erros(com({ tipo_fonte: t })), []);
});

teste('validarKb: verificado_em precisa ser uma data real AAAA-MM-DD e não futura', () => {
  soErro(com({ verificado_em: '01/10/2026' }), 'verificado_em');
  soErro(com({ verificado_em: '2026-02-31' }), 'verificado_em');
  soErro(com({ verificado_em: '2026-11-05' }), 'verificado_em');
  soErro(sem('verificado_em'), 'verificado_em');
});

teste('validarKb: limitacao é obrigatória', () => {
  soErro(sem('limitacao'), 'limitacao');
  soErro(com({ limitacao: '' }), 'limitacao');
});

teste('validarKb: direito e serviço exigem condicoes, documentos, onde, prazo e se_negarem', () => {
  for (const tipo of ['direito', 'servico']) {
    for (const campo of ['condicoes', 'documentos', 'onde', 'prazo_tipico', 'se_negarem']) {
      soErro({ ...sem(campo), tipo }, campo);
    }
  }
});

teste('validarKb: norma não exige os campos da Rota, mas valida se vierem', () => {
  const norma = { ...sem('condicoes', 'documentos', 'onde', 'prazo_tipico', 'se_negarem'), tipo: 'norma' };
  assert.deepEqual(erros(norma), []);
  soErro({ ...norma, documentos: [] }, 'documentos');
});

teste('validarKb: onde precisa de texto; link, se houver, é https', () => {
  soErro(com({ onde: 'Posto de exemplo' }), 'onde');
  soErro(com({ onde: { link: 'https://exemplo.gov.br' } }), 'onde');
  soErro(com({ onde: { texto: 'Telefone de exemplo.', link: 'http://exemplo.gov.br' } }), 'onde.link');
  assert.deepEqual(erros(com({ onde: { texto: 'Ligue para o telefone de exemplo.' } })), []);
});

teste('validarKb: condicoes aceita só os grupos todas, alguma e nenhuma', () => {
  soErro(com({ condicoes: { qualquer: [{ campo: 'p_laudo', em: ['nao_sei'] }] } }), 'grupo desconhecido');
  soErro(com({ condicoes: {} }), 'ao menos 1 regra');
  soErro(com({ condicoes: { todas: [] } }), 'condicoes.todas');
  soErro(com({ condicoes: [] }), 'condicoes');
});

teste('validarKb: cada regra usa o id de uma pergunta e valores que existem nela', () => {
  soErro(com({ condicoes: { todas: [{ campo: 'idade', em: ['adulto'] }] } }), 'não é uma pergunta');
  soErro(com({ condicoes: { todas: [{ campo: 'p_necessidade', em: ['cadeirante'] }] } }), 'cadeirante');
  soErro(com({ condicoes: { todas: [{ campo: 'p_laudo', em: [] }] } }), '"em"');
  soErro(com({ condicoes: { todas: [{ campo: 'p_laudo', em: ['sim'], peso: 2 }] } }), 'peso');
  assert.deepEqual(erros(com({ condicoes: { nenhuma: [{ campo: 'p_renda', em: ['nao'] }] } })), []);
});

teste('validarKb: "prefiro não responder" pode ser usado numa regra', () => {
  assert.deepEqual(erros(com({ condicoes: { nenhuma: [{ campo: 'p_quem', em: ['prefiro_nao_responder'] }] } })), []);
});

teste('validarKb: passos é opcional, mas não pode vir vazio', () => {
  assert.deepEqual(erros(com({ passos: ['Um.', 'Dois.'] })), []);
  soErro(com({ passos: ['ok', ''] }), 'passos');
});

teste('validarKb: campo desconhecido (provável erro de digitação) é apontado', () => {
  soErro(com({ palavra_chave: ['x'] }), 'palavra_chave');
  soErro(com({ resposta_curta: 'x' }), 'resposta_curta');
});

teste('validarKb: a mensagem de erro diz qual entrada está errada', () => {
  const e = validarKb([base(), com({ id: 'segunda', tipo_fonte: 'x' })], HOJE);
  assert.ok(e[0].startsWith('segunda:'), e[0]);
});

teste('tipoFonteNaTela: conferência com mais de 6 meses aparece como desatualizada', () => {
  assert.equal(tipoFonteNaTela({ tipo_fonte: 'oficial', verificado_em: '2026-10-28' }, HOJE), 'oficial');
  assert.equal(tipoFonteNaTela({ tipo_fonte: 'oficial', verificado_em: '2026-05-04' }, HOJE), 'oficial');
  assert.equal(tipoFonteNaTela({ tipo_fonte: 'oficial', verificado_em: '2026-05-03' }, HOJE), 'desatualizada');
  assert.equal(tipoFonteNaTela({ tipo_fonte: 'secundaria', verificado_em: '2025-03-12' }, HOJE), 'desatualizada');
  assert.equal(tipoFonteNaTela({ tipo_fonte: 'desatualizada', verificado_em: '2026-11-01' }, HOJE), 'desatualizada');
});

teste('data/kb.json: a base real é válida', () => {
  const caminho = fileURLToPath(new URL('../data/kb.json', import.meta.url));
  const kb = JSON.parse(readFileSync(caminho, 'utf8'));
  assert.deepEqual(validarKb(kb), []);
});

// ---------- campos do guia v2 ----------

const LEI = [{ norma: 'Lei de exemplo 1/2000', artigo: 'art. 1º', url: 'https://exemplo.gov.br/lei' }];
const MODELO = { titulo: 'Recurso de exemplo', para: 'Órgão de exemplo', texto: 'Eu, (preencha seu nome), peço a revisão.' };

teste('validarKb: campos do guia (base_legal, frase_motorista, modelo_recurso, requisitos_laudo, atalhos) são aceitos', () => {
  assert.deepEqual(
    erros(com({ base_legal: LEI, frase_motorista: 'Frase de exemplo.', modelo_recurso: MODELO, requisitos_laudo: ['Item A'], atalhos: ['deslocamento', 'dirigir'] })),
    []
  );
});

teste('validarKb: base_legal exige norma e url https', () => {
  soErro(com({ base_legal: [] }), 'base_legal');
  soErro(com({ base_legal: [{ norma: '', url: 'https://a.gov.br' }] }), 'norma');
  soErro(com({ base_legal: [{ norma: 'Lei', url: 'http://a.gov.br' }] }), 'url');
  soErro(com({ base_legal: [{ norma: 'Lei', url: 'https://a.gov.br', paragrafo: 'x' }] }), 'paragrafo');
});

teste('validarKb: frase_motorista e modelo_recurso exigem base_legal', () => {
  soErro(com({ frase_motorista: 'Frase.' }), 'frase_motorista exige base_legal');
  soErro(com({ modelo_recurso: MODELO }), 'modelo_recurso exige base_legal');
  soErro(com({ base_legal: LEI, frase_motorista: 'x'.repeat(201) }), 'frase_motorista');
});

teste('validarKb: modelo_recurso tem campos "(preencha ...)" em vez de dados pessoais', () => {
  soErro(com({ base_legal: LEI, modelo_recurso: { ...MODELO, texto: 'Eu, Maria, peço.' } }), 'preencha');
  soErro(com({ base_legal: LEI, modelo_recurso: { titulo: 'x', texto: '(preencha)' } }), 'modelo_recurso');
});

teste('validarKb: atalhos só aceita deslocamento, dirigir e calcada', () => {
  soErro(com({ atalhos: ['viajar'] }), 'atalhos');
  soErro(com({ atalhos: [] }), 'atalhos');
});

teste('validarKb: "você tem direito" é recusado em qualquer texto da ficha', () => {
  soErro(com({ resumo: 'Você tem direito ao passe.' }), 'você tem direito');
  soErro(com({ base_legal: LEI, modelo_recurso: { ...MODELO, texto: 'Voce tem direito. (preencha seu nome)' } }), 'você tem direito');
});

teste('kb-exemplo (só dev): a base fictícia segue o esquema, inclusive os campos do guia', async () => {
  const { KB_EXEMPLO } = await import('../src/app/kb-exemplo.ts');
  assert.deepEqual(validarKb(KB_EXEMPLO), []);
});
