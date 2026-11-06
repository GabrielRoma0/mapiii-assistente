import assert from 'node:assert/strict';
import { test as teste } from 'vitest';
import { lerRota } from '../src/app/rotas.ts';

teste('lerRota: telas conhecidas', () => {
  assert.deepEqual(lerRota(''), { tela: 'inicio' });
  assert.deepEqual(lerRota('#/'), { tela: 'inicio' });
  assert.deepEqual(lerRota('#/situacao'), { tela: 'triagem' });
  assert.deepEqual(lerRota('#/rota/'), { tela: 'rota' });
  assert.deepEqual(lerRota('#/direito/bilhete-exemplo'), { tela: 'direito', id: 'bilhete-exemplo' });
  assert.deepEqual(lerRota('#/sobre'), { tela: 'sobre' });
});

teste('lerRota: endereço desconhecido ou id estranho vai para a tela 404', () => {
  assert.deepEqual(lerRota('#/qualquer'), { tela: 'nao_encontrada' });
  assert.deepEqual(lerRota('#/direito/<script>'), { tela: 'nao_encontrada' });
  assert.deepEqual(lerRota('#/rota/extra/coisa'), { tela: 'nao_encontrada' });
});

teste('lerRota: caminho que não é o do app vai para 404, mesmo servido pelo index.html', () => {
  assert.deepEqual(lerRota('', '/qualquer-coisa'), { tela: 'nao_encontrada' });
  assert.deepEqual(lerRota('#/sobre', '/x/pagina.html'), { tela: 'nao_encontrada' });
  assert.deepEqual(lerRota('#/sobre', '/'), { tela: 'sobre' });
  assert.deepEqual(lerRota('#/sobre', '/mapiii/index.html'), { tela: 'sobre' });
  assert.deepEqual(lerRota('', '/mapiii/'), { tela: 'inicio' });
});

teste('lerRota: #/embarque existe como rota (a flag decide se a tela abre)', () => {
  assert.deepEqual(lerRota('#/embarque'), { tela: 'embarque' });
});

teste('lerRota: telas do guia v2 (na rua, me negaram, motorista, cartão, atalho e laudo)', () => {
  assert.deepEqual(lerRota('#/na-rua'), { tela: 'na_rua' });
  assert.deepEqual(lerRota('#/negaram'), { tela: 'negaram' });
  assert.deepEqual(lerRota('#/negaram/bpc-exemplo'), { tela: 'negaram', id: 'bpc-exemplo' });
  assert.deepEqual(lerRota('#/motorista/passe'), { tela: 'motorista', id: 'passe' });
  assert.deepEqual(lerRota('#/cartao'), { tela: 'cartao' });
  assert.deepEqual(lerRota('#/atalho/dirigir'), { tela: 'atalho', id: 'dirigir' });
  assert.deepEqual(lerRota('#/laudo'), { tela: 'laudo' });
  assert.deepEqual(lerRota('#/motorista/<x>'), { tela: 'nao_encontrada' });
});

teste('lerRota: #/teste-erro existe como rota (o App só abre a tela que quebra em desenvolvimento)', () => {
  assert.deepEqual(lerRota('#/teste-erro'), { tela: 'teste_erro' });
});

import { abaDaRota } from '../src/app/rotas.ts';

teste('abaDaRota: cada tela acende a aba certa; triagem, 404 e telas de dev não mostram a barra', () => {
  const aba = (h: string) => abaDaRota(lerRota(h));
  for (const h of ['#/', '#/rota', '#/direito/x', '#/laudo', '#/atalho/dirigir', '#/negaram', '#/negaram/x', '#/conferir']) assert.equal(aba(h), 'inicio', h);
  assert.equal(aba('#/perguntar'), 'perguntar');
  for (const h of ['#/na-rua', '#/embarque', '#/cartao', '#/motorista', '#/motorista/x', '#/reclamacao']) assert.equal(aba(h), 'na_rua', h);
  assert.equal(aba('#/sobre'), 'sobre');
  for (const h of ['#/situacao', '#/qualquer', '#/componentes', '#/teste-erro']) assert.equal(aba(h), null, h);
});

teste('lerRota: #/situacao/p_cidade abre a triagem direto numa pergunta', () => {
  assert.deepEqual(lerRota('#/situacao/p_cidade'), { tela: 'triagem', pergunta: 'p_cidade' });
  assert.deepEqual(lerRota('#/situacao/P-x'), { tela: 'nao_encontrada' });
});
