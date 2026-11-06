import assert from 'node:assert/strict';
import { test as teste } from 'vitest';
import { validarEntrada, foraDoTema, ehEmergencia, MENSAGEM_EMERGENCIA } from '../src/core/validar.ts';
import { criarIndice } from '../src/core/busca.ts';

const motivo = (texto: unknown) => {
  const r = validarEntrada(texto);
  return r.ok ? undefined : r.motivo;
};
const mensagem = (texto: unknown) => {
  const r = validarEntrada(texto);
  return r.ok ? '' : r.mensagem;
};

teste('validarEntrada: pergunta normal passa e volta sem espaços nas pontas', () => {
  const r = validarEntrada('  Quem pode pedir o BPC?  ');
  assert.equal(r.ok, true);
  assert.equal(r.ok && r.texto, 'Quem pode pedir o BPC?');
});

teste('validarEntrada: campo vazio, só espaços ou não-texto', () => {
  assert.equal(motivo(''), 'vazio');
  assert.equal(motivo('    '), 'vazio');
  assert.equal(motivo(null), 'vazio');
  assert.equal(motivo(undefined), 'vazio');
});

teste('validarEntrada: menos de 3 caracteres', () => {
  assert.equal(motivo('ab'), 'curto');
  assert.equal(motivo(' a '), 'curto');
  assert.equal(validarEntrada('bpc').ok, true);
});

teste('validarEntrada: só símbolos ou só números', () => {
  assert.equal(motivo('????'), 'simbolos_numeros');
  assert.equal(motivo('!@#$%'), 'simbolos_numeros');
  assert.equal(motivo('12345'), 'simbolos_numeros');
  assert.equal(motivo('1 2 3 ?'), 'simbolos_numeros');
});

teste('validarEntrada: mais de 300 caracteres (300 ainda passa)', () => {
  assert.equal(validarEntrada('a'.repeat(300)).ok, true);
  assert.equal(motivo('a'.repeat(301)), 'longo');
});

// ---- dados pessoais ----

teste('validarEntrada: detecta CPF com e sem pontuação', () => {
  assert.equal(motivo('meu cpf é 123.456.789-09'), 'dados_pessoais');
  assert.equal(motivo('cpf 12345678909 aqui'), 'dados_pessoais');
});

teste('validarEntrada: detecta telefone em formatos comuns', () => {
  assert.equal(motivo('me ligue em (11) 91234-5678'), 'dados_pessoais');
  assert.equal(motivo('11 91234 5678 pode chamar'), 'dados_pessoais');
  assert.equal(motivo('+55 11 3456-7890'), 'dados_pessoais');
  assert.equal(motivo('91234-5678'), 'dados_pessoais');
  assert.equal(motivo('número 11912345678'), 'dados_pessoais');
});

teste('validarEntrada: detecta e-mail', () => {
  assert.equal(motivo('escreva para maria.silva@exemplo.com.br por favor'), 'dados_pessoais');
});

teste('validarEntrada: números de lei, telefone curto de serviço e valores não são dados pessoais', () => {
  for (const q of ['O que diz a Lei 13.146/2015?', 'Decreto 5.296/2004', 'Para que serve o 156?', 'Cobraram R$ 50,00 pelo cartão, é golpe?']) {
    assert.equal(validarEntrada(q).ok, true, q);
  }
});

teste('validarEntrada: ao recusar por dados pessoais, o texto não volta no resultado', () => {
  const cpf = '123.456.789-09';
  const r = validarEntrada(`meu cpf é ${cpf}`);
  assert.equal(r.ok, false);
  assert.equal(JSON.stringify(r).includes('123'), false);
  assert.equal(JSON.stringify(r).includes(cpf), false);
});

teste('validarEntrada: dados pessoais vencem o limite de tamanho', () => {
  assert.equal(motivo('x'.repeat(400) + ' 123.456.789-09'), 'dados_pessoais');
});

teste('validarEntrada: pede para a pessoa não enviar o dado pessoal', () => {
  assert.match(mensagem('a@b.co'), /dado pessoal/i);
  assert.match(mensagem('a@b.co'), /não foi processado nem guardado/i);
});

// ---- emergência ----

teste('validarEntrada: emergência de saúde responde só "Em emergência, ligue 192."', () => {
  for (const q of [
    'Socorro, meu filho desmaiou',
    'meu pai não está respirando',
    'minha mãe está tendo um AVC agora',
    'ele caiu e bateu a cabeça, o que faço',
    'É uma emergência!',
    'minha filha está convulsionando'
  ]) {
    const r = validarEntrada(q);
    assert.deepEqual(r, { ok: false, motivo: 'emergencia', mensagem: MENSAGEM_EMERGENCIA }, q);
  }
  assert.equal(MENSAGEM_EMERGENCIA, 'Em emergência, ligue 192.');
});

teste('validarEntrada: emergência vence dados pessoais e o limite de tamanho', () => {
  assert.equal(motivo('socorro, desmaiou aqui, meu telefone é (11) 91234-5678'), 'emergencia');
  assert.equal(motivo('x'.repeat(400) + ' ele desmaiou'), 'emergencia');
});

teste('ehEmergencia: perguntas sobre direitos com termos de saúde não são emergência', () => {
  for (const q of [
    'Pessoa com sequela de AVC pode pedir o BPC?',
    'O pronto-socorro atende de graça?',
    'Quem teve infarto tem direito a isenção?',
    'Como pedir cadeira de rodas pelo SUS?'
  ]) {
    assert.equal(ehEmergencia(q), false, q);
  }
});

// ---- aconselhamento ----

teste('validarEntrada: aconselhamento jurídico', () => {
  assert.equal(motivo('Devo processar a prefeitura?'), 'aconselhamento_juridico');
  assert.equal(motivo('Quanto de indenização eu consigo?'), 'aconselhamento_juridico');
  assert.equal(motivo('Qual o prazo para entrar na justiça contra o INSS?'), 'aconselhamento_juridico');
  assert.equal(motivo('Vou ganhar a causa?'), 'aconselhamento_juridico');
});

teste('validarEntrada: aconselhamento médico', () => {
  assert.equal(motivo('Que remédio tomar para dor na perna?'), 'aconselhamento_medico');
  assert.equal(motivo('Qual a dose de dipirona para criança?'), 'aconselhamento_medico');
  assert.equal(motivo('Tropecei e acho que fraturei o pé'), 'aconselhamento_medico');
  assert.equal(motivo('Qual o diagnóstico para tontura?'), 'aconselhamento_medico');
  assert.equal(motivo('Isso são sintomas de autismo?'), 'aconselhamento_medico');
});

teste('validarEntrada: perguntas sobre direitos ligados a saúde e Justiça passam', () => {
  for (const q of [
    'Quem pode pedir o BPC?',
    'Negaram o BPC da minha mãe. Posso recorrer?',
    'Como conseguir remédio de graça?',
    'Quais remédios o SUS dá de graça?',
    'Precisa de laudo médico para o passe livre?',
    'Preciso de advogado para pedir o BPC?',
    'Como conseguir terapia pelo SUS para meu filho autista?',
    'Precisa de diagnóstico fechado para pedir a carteira?'
  ]) {
    assert.equal(validarEntrada(q).ok, true, q);
  }
});

teste('validarEntrada: toda recusa traz uma mensagem amigável não vazia', () => {
  for (const q of ['', 'ab', '????', 'a'.repeat(301), 'a@b.co', 'devo processar?', 'que remédio tomar?', 'ele desmaiou']) {
    const r = validarEntrada(q);
    assert.equal(r.ok, false, q);
    assert.ok(!r.ok && r.mensagem.length > 10, q);
  }
});

// ---- fora do tema ----
const indice = criarIndice([
  {
    id: 'exemplo',
    perguntas_exemplo: ['Como peço o passe livre?'],
    palavras_chave: ['passe livre', 'ônibus']
  }
]);

teste('foraDoTema: assunto sem nenhuma palavra da base nem do tema', () => {
  assert.equal(foraDoTema('receita de bolo de cenoura', indice), true);
  assert.equal(foraDoTema('quem ganhou o jogo ontem', indice), true);
});

teste('foraDoTema: pergunta do tema que não está na base não é fora do tema', () => {
  assert.equal(foraDoTema('como funciona a isenção de IPVA', indice), false);
  assert.equal(foraDoTema('minha filha autista pode ter acompanhante na escola', indice), false);
  assert.equal(foraDoTema('o ônibus não parou para o cadeirante', indice), false);
});
