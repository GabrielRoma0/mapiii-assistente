import assert from 'node:assert/strict';
import { test as teste } from 'vitest';
import {
  CHAVE_REGISTRO,
  MAX_REGISTROS,
  apagarRegistros,
  lerRegistros,
  paraCsv,
  registrar,
  registrarVoto,
  resumir,
  resumirPorTema,
  temaDaEntrada,
  type Armazenamento
} from '../src/core/registro.ts';

function falso(): Armazenamento & { dados: Map<string, string> } {
  const dados = new Map<string, string>();
  return {
    dados,
    getItem: (k) => dados.get(k) ?? null,
    setItem: (k, v) => void dados.set(k, v),
    removeItem: (k) => void dados.delete(k)
  };
}

teste('registrar: grava só tema, achou, segundos e voto, sem nada mais', () => {
  const arm = falso();
  const extra = { tema: 'transporte', achou: true, segundos: 4.27, pergunta: 'texto que não pode ficar', id: 'abc' };
  const pos = registrar(arm, extra as never);
  assert.equal(pos, 0);
  assert.deepEqual(JSON.parse(arm.dados.get(CHAVE_REGISTRO)!), [{ tema: 'transporte', achou: true, segundos: 4.3, ajudou: null }]);
  assert.equal(arm.dados.get(CHAVE_REGISTRO)!.includes('texto'), false);
});

teste('registrarVoto: grava o voto na busca certa e recusa posição inválida', () => {
  const arm = falso();
  registrar(arm, { tema: 'a', achou: true, segundos: 1 });
  const p = registrar(arm, { tema: 'b', achou: false, segundos: 2 })!;
  assert.equal(registrarVoto(arm, p, false), true);
  assert.deepEqual(lerRegistros(arm).map((r) => r.ajudou), [null, false]);
  assert.equal(registrarVoto(arm, 9, true), false);
  assert.equal(registrarVoto(arm, -1, true), false);
});

teste('registrar: guarda no máximo MAX_REGISTROS, descartando os mais antigos', () => {
  const arm = falso();
  arm.setItem(CHAVE_REGISTRO, JSON.stringify(Array.from({ length: MAX_REGISTROS }, () => ({ tema: 'velho', achou: true, segundos: 1, ajudou: null }))));
  registrar(arm, { tema: 'novo', achou: true, segundos: 1 });
  const lista = lerRegistros(arm);
  assert.equal(lista.length, MAX_REGISTROS);
  assert.equal(lista.at(-1)!.tema, 'novo');
});

teste('lerRegistros: armazenamento ausente, bloqueado ou corrompido não quebra', () => {
  assert.deepEqual(lerRegistros(null), []);
  const arm = falso();
  arm.setItem(CHAVE_REGISTRO, '{isso não é json');
  assert.deepEqual(lerRegistros(arm), []);
  arm.setItem(CHAVE_REGISTRO, JSON.stringify([{ tema: 'ok', achou: true, segundos: 1, ajudou: null }, { tema: 'x', pergunta: 'a' }, null]));
  assert.equal(lerRegistros(arm).length, 1);
  const bloqueado: Armazenamento = {
    getItem: () => {
      throw new Error('bloqueado');
    },
    setItem: () => {
      throw new Error('bloqueado');
    },
    removeItem: () => {
      throw new Error('bloqueado');
    }
  };
  assert.equal(registrar(bloqueado, { tema: 'a', achou: true, segundos: 1 }), null);
  assert.doesNotThrow(() => apagarRegistros(bloqueado));
});

teste('registrar: recusa tema com texto livre (só ids e categorias)', () => {
  const arm = falso();
  assert.equal(registrar(arm, { tema: 'Minha pergunta inteira com espaços', achou: false, segundos: 1 }), null);
  assert.deepEqual(lerRegistros(arm), []);
});

teste('apagarRegistros: limpa tudo', () => {
  const arm = falso();
  registrar(arm, { tema: 'a', achou: true, segundos: 1 });
  apagarRegistros(arm);
  assert.deepEqual(lerRegistros(arm), []);
});

teste('resumir: totais, taxas, média e mediana', () => {
  const r = resumir([
    { tema: 'a', achou: true, segundos: 2, ajudou: true },
    { tema: 'a', achou: true, segundos: 4, ajudou: false },
    { tema: 'b', achou: false, segundos: 9, ajudou: null },
    { tema: 'b', achou: true, segundos: 5, ajudou: true }
  ]);
  assert.deepEqual(r, {
    total: 4,
    achou: 3,
    taxaAchou: 0.75,
    mediaSegundos: 5,
    medianaSegundos: 4.5,
    votosSim: 2,
    votosNao: 1,
    semVoto: 1,
    taxaAjudou: 2 / 3
  });
});

teste('resumir: sem registros, as taxas ficam null (não 0)', () => {
  const r = resumir([]);
  assert.equal(r.total, 0);
  assert.equal(r.taxaAchou, null);
  assert.equal(r.mediaSegundos, null);
  assert.equal(r.taxaAjudou, null);
});

teste('resumirPorTema: agrupa e ordena do mais buscado para o menos', () => {
  const lista = resumirPorTema([
    { tema: 'b', achou: true, segundos: 1, ajudou: null },
    { tema: 'a', achou: true, segundos: 1, ajudou: null },
    { tema: 'b', achou: false, segundos: 1, ajudou: null }
  ]);
  assert.deepEqual(lista.map((t) => [t.tema, t.resumo.total]), [['b', 2], ['a', 1]]);
});

teste('paraCsv: cabeçalho e uma linha por busca', () => {
  assert.equal(
    paraCsv([
      { tema: 'transporte', achou: true, segundos: 3.5, ajudou: true },
      { tema: 'sem_resposta', achou: false, segundos: 7, ajudou: null }
    ]),
    'tema,achou_resposta,segundos_ate_resposta,ajudou\ntransporte,sim,3.5,sim\nsem_resposta,nao,7,\n'
  );
});

teste('temaDaEntrada: usa o objetivo da triagem; sem ele, o tipo', () => {
  assert.equal(temaDaEntrada({ tipo: 'direito', condicoes: { todas: [{ campo: 'p_objetivo', em: ['transporte', 'escola'] }] } }), 'transporte');
  assert.equal(temaDaEntrada({ tipo: 'servico', condicoes: { alguma: [{ campo: 'p_objetivo', em: ['documentos'] }] } }), 'documentos');
  assert.equal(temaDaEntrada({ tipo: 'norma' }), 'norma');
});

// ---------- Embarque ----------
import {
  CHAVE_REGISTRO_EMBARQUE,
  apagarRegistrosEmbarque,
  lerRegistrosEmbarque,
  paraCsvEmbarque,
  registrarEmbarque,
  resumirEmbarque
} from '../src/core/registro.ts';

teste('registrarEmbarque: grava só modo, segundos e achou', () => {
  const arm = falso();
  assert.equal(registrarEmbarque(arm, { modo: 'real', segundos: 12.34, achou: true, linha: '8000', ip: '1.2.3.4' } as never), true);
  assert.deepEqual(JSON.parse(arm.dados.get(CHAVE_REGISTRO_EMBARQUE)!), [{ modo: 'real', segundos: 12.3, achou: true }]);
  assert.equal(registrarEmbarque(arm, { modo: 'teste' as never, segundos: 1, achou: true }), false);
  assert.equal(registrarEmbarque(null, { modo: 'real', segundos: 1, achou: true }), false);
});

teste('registro do Embarque fica separado do registro das perguntas', () => {
  const arm = falso();
  registrar(arm, { tema: 'transporte', achou: true, segundos: 1 });
  registrarEmbarque(arm, { modo: 'exemplo', segundos: 5, achou: true });
  assert.equal(lerRegistros(arm).length, 1);
  assert.equal(lerRegistrosEmbarque(arm).length, 1);
  apagarRegistrosEmbarque(arm);
  assert.equal(lerRegistros(arm).length, 1);
  assert.equal(lerRegistrosEmbarque(arm).length, 0);
});

teste('resumirEmbarque: separa real e exemplo; tempo só de quem achou', () => {
  const r = resumirEmbarque([
    { modo: 'real', segundos: 10, achou: true },
    { modo: 'real', segundos: 30, achou: true },
    { modo: 'real', segundos: 99, achou: false },
    { modo: 'exemplo', segundos: 8, achou: true }
  ]);
  assert.deepEqual(r.real, { tentativas: 3, achou: 2, taxaAchou: 2 / 3, medianaSegundos: 20, mediaSegundos: 20 });
  assert.deepEqual(r.exemplo, { tentativas: 1, achou: 1, taxaAchou: 1, medianaSegundos: 8, mediaSegundos: 8 });
  assert.deepEqual(resumirEmbarque([]).real, { tentativas: 0, achou: 0, taxaAchou: null, medianaSegundos: null, mediaSegundos: null });
});

teste('paraCsvEmbarque: uma linha por medição, com o modo', () => {
  assert.equal(
    paraCsvEmbarque([
      { modo: 'real', segundos: 12.5, achou: true },
      { modo: 'exemplo', segundos: 40, achou: false }
    ]),
    'modo,segundos_ate_resumo,achou\nreal,12.5,sim\nexemplo,40,nao\n'
  );
});
