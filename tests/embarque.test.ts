import assert from 'node:assert/strict';
import { test as teste } from 'vitest';
import {
  falhaDoStatus,
  fraseResumo,
  lerBuscaLinhas,
  lerPosicaoLinha,
  resumirVeiculos,
  validarCodigoLinha,
  validarTermoLinha,
  MENSAGENS_FALHA,
  type Veiculo
} from '../supabase/functions/_shared/embarque.ts';

const AGORA = new Date('2026-11-05T15:00:00Z');
const haSegundos = (s: number) => new Date(AGORA.getTime() - s * 1000).toISOString();

// Respostas no formato da documentação oficial (exemplos de data/README.md), com valores fictícios.
const BUSCA_OK = [
  { cl: 1273, lc: false, lt: '8000', sl: 1, tl: 10, tp: 'PCA.RAMOS DE AZEVEDO', ts: 'TERMINAL LAPA' },
  { cl: 34041, lc: false, lt: '8000', sl: 2, tl: 10, tp: 'PCA.RAMOS DE AZEVEDO', ts: 'TERMINAL LAPA' }
];
const POSICAO_OK = {
  hr: '11:58',
  vs: [
    { p: '11433', a: false, ta: haSegundos(30), py: -23.54, px: -46.64 },
    { p: 11201, a: true, ta: haSegundos(20), py: -23.55, px: -46.65 },
    { p: '11002', a: true, ta: haSegundos(400), py: -23.56, px: -46.66 }
  ]
};

// ---------- entrada ----------

teste('validarTermoLinha: aceita número, nome e hífen, de 1 a 10 caracteres', () => {
  for (const t of ['8000', 'Lapa', '8000-10', 'Jabaquara', 'São', ' 875A ']) assert.equal(validarTermoLinha(t).ok, true, t);
  assert.deepEqual(validarTermoLinha(' 875A '), { ok: true, termo: '875A' });
});

teste('validarTermoLinha: recusa vazio, longo, espaço, símbolos e tentativa de injetar URL ou parâmetro', () => {
  for (const t of ['', '   ', null, 42, 'abcdefghijk', 'Terminal Lapa', '8000&x=1', '../Login', 'http://x', "8000'--", '8000;', '<b>']) {
    const r = validarTermoLinha(t);
    assert.equal(r.ok, false, String(t));
    assert.ok(!r.ok && r.mensagem.length > 10);
  }
});

teste('validarCodigoLinha: só inteiro positivo', () => {
  assert.equal(validarCodigoLinha(1273), 1273);
  assert.equal(validarCodigoLinha('34041'), 34041);
  for (const v of [0, -1, 1.5, '12a', '', null, '1273&x=1', 1e12]) assert.equal(validarCodigoLinha(v), null, String(v));
});

// ---------- busca de linha ----------

teste('lerBuscaLinhas: monta letreiro e sentido a partir dos campos da API', () => {
  const r = lerBuscaLinhas(BUSCA_OK);
  assert.ok(r.ok && r.acao === 'linhas');
  assert.deepEqual(r.linhas[0], { codigo: 1273, letreiro: '8000-10', sentido: 1, descricao: 'PCA.RAMOS DE AZEVEDO → TERMINAL LAPA', circular: false });
  assert.equal(r.linhas[1].descricao, 'TERMINAL LAPA → PCA.RAMOS DE AZEVEDO');
});

teste('lerBuscaLinhas: lista vazia vira "linha inexistente"', () => {
  assert.deepEqual(lerBuscaLinhas([]), { ok: false, erro: 'linha_inexistente', mensagem: MENSAGENS_FALHA.linha_inexistente });
});

teste('lerBuscaLinhas: itens fora do formato são descartados; resposta que não é lista é "API fora"', () => {
  const r = lerBuscaLinhas([{ cl: 'x' }, null, { cl: 1, lt: '1', sl: 3 }, BUSCA_OK[0]]);
  assert.ok(r.ok && r.acao === 'linhas' && r.linhas.length === 1);
  assert.equal(lerBuscaLinhas({ erro: 'qualquer' }).ok, false);
  assert.equal(!lerBuscaLinhas('<html>erro</html>').ok && (lerBuscaLinhas('x') as { erro: string }).erro, 'api_fora');
});

// ---------- posição ----------

teste('lerPosicaoLinha: lê prefixo, acessibilidade e horário, e descarta latitude e longitude', () => {
  const r = lerPosicaoLinha(POSICAO_OK, 1273, AGORA);
  assert.ok(r.ok && r.acao === 'veiculos');
  assert.equal(r.horaReferencia, '11:58');
  assert.equal(r.veiculos.length, 3);
  assert.deepEqual(r.veiculos[1], { prefixo: '11201', acessivel: true, capturadoEm: haSegundos(20) });
  const texto = JSON.stringify(r);
  for (const proibido of ['py', 'px', '-23.5', '-46.6']) assert.equal(texto.includes(proibido), false, proibido);
});

teste('lerPosicaoLinha: sem veículos vira "sem veículos"; formato inválido vira "API fora"', () => {
  assert.equal((lerPosicaoLinha({ hr: '12:00', vs: [] }, 1, AGORA) as { erro: string }).erro, 'sem_veiculos');
  assert.equal((lerPosicaoLinha({ hr: '12:00', vs: [{ p: 1 }] }, 1, AGORA) as { erro: string }).erro, 'sem_veiculos');
  assert.equal((lerPosicaoLinha([], 1, AGORA) as { erro: string }).erro, 'api_fora');
  assert.equal((lerPosicaoLinha({ hr: '12:00' }, 1, AGORA) as { erro: string }).erro, 'api_fora');
});

// ---------- erros da API ----------

teste('falhaDoStatus: 429 é limite, tempo esgotado é próprio, 401/403/500/rede são "API fora"', () => {
  assert.equal(falhaDoStatus(429), 'limite');
  assert.equal(falhaDoStatus('tempo'), 'tempo_esgotado');
  for (const s of [401, 403, 500, 502, 503, 'rede'] as const) assert.equal(falhaDoStatus(s), 'api_fora', String(s));
});

teste('mensagens de falha: amigáveis e sem dado inventado', () => {
  for (const [erro, m] of Object.entries(MENSAGENS_FALHA)) {
    assert.ok(m.length > 20, erro);
    // Sem link, e-mail ou telefone: canais oficiais só vêm de fichas da base.
    assert.doesNotMatch(m, /https?:|www\.|@|\b\d{4}-?\d{4}\b|\(\d{2}\)|\b156\b|\b0800/, erro);
  }
});

// ---------- resumo e dado desatualizado ----------

const v = (prefixo: string, acessivel: boolean, segundos: number): Veiculo => ({ prefixo, acessivel, capturadoEm: haSegundos(segundos) });

teste('resumirVeiculos: conta acessíveis e põe os acessíveis primeiro', () => {
  const r = resumirVeiculos([v('300', false, 10), v('200', true, 10), v('100', true, 10)], AGORA)!;
  assert.equal(r.total, 3);
  assert.equal(r.acessiveis, 2);
  assert.deepEqual(r.lista.map((x) => x.prefixo), ['100', '200', '300']);
});

teste('resumirVeiculos: dado desatualizado quando a posição mais recente tem mais de 2 minutos', () => {
  assert.equal(resumirVeiculos([v('1', true, 119), v('2', true, 500)], AGORA)!.desatualizado, false);
  assert.equal(resumirVeiculos([v('1', true, 121), v('2', true, 500)], AGORA)!.desatualizado, true);
  const r = resumirVeiculos([v('1', true, 30), v('2', true, 500)], AGORA)!;
  assert.deepEqual(r.lista.map((x) => x.desatualizado), [false, true]);
  assert.equal(r.ultimaPosicao.toISOString(), haSegundos(30));
});

teste('resumirVeiculos: lista vazia dá null', () => {
  assert.equal(resumirVeiculos([], AGORA), null);
});

teste('fraseResumo: plural, singular e "nenhum"', () => {
  assert.equal(fraseResumo({ total: 5, acessiveis: 3 }), '3 de 5 veículos em operação são acessíveis.');
  assert.equal(fraseResumo({ total: 5, acessiveis: 1 }), '1 de 5 veículos em operação é acessível.');
  assert.equal(fraseResumo({ total: 4, acessiveis: 0 }), 'Nenhum dos 4 veículos em operação é acessível.');
  assert.equal(fraseResumo({ total: 1, acessiveis: 1 }), 'O único veículo em operação é acessível.');
  assert.equal(fraseResumo({ total: 1, acessiveis: 0 }), 'O único veículo em operação não é acessível.');
});
