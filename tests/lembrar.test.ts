import assert from 'node:assert/strict';
import { test as teste } from 'vitest';
import {
  CHAVE_RESPOSTAS,
  apagarRespostasGuardadas,
  guardarRespostas,
  lerRespostasGuardadas,
  limparRespostasGuardadas,
  quantasRespondidas
} from '../src/core/lembrar.ts';
import type { Armazenamento } from '../src/core/registro.ts';

function falso(): Armazenamento & { dados: Map<string, string> } {
  const dados = new Map<string, string>();
  return { dados, getItem: (k) => dados.get(k) ?? null, setItem: (k, v) => void dados.set(k, v), removeItem: (k) => void dados.delete(k) };
}

teste('lembrar: sem nada guardado (caixa desmarcada), não há o que ler', () => {
  assert.equal(lerRespostasGuardadas(falso()), null);
  assert.equal(lerRespostasGuardadas(null), null);
});

teste('lembrar: guarda e lê de volta as respostas e o modo', () => {
  const arm = falso();
  const respostas = { p_objetivo: 'transporte', p_necessidade: ['mobilidade', 'visual'], p_cidade: 'sim' };
  assert.equal(guardarRespostas(arm, { respostas, modo: 'pessoa' }), true);
  assert.deepEqual(lerRespostasGuardadas(arm), { respostas, modo: 'pessoa' });
});

teste('lembrar: só ids e valores das perguntas; texto livre, pergunta inexistente e valor inventado são descartados', () => {
  const r = limparRespostasGuardadas({
    p_objetivo: 'transporte',
    p_quem: 'Minha mãe Maria',
    p_renda: 1200,
    nome: 'Maria',
    p_necessidade: ['mobilidade', 'cadeirante', 'mobilidade'],
    p_cidade: ['sim', 'nao'],
    p_laudo: 'prefiro_nao_responder'
  });
  assert.deepEqual(r, { p_objetivo: 'transporte', p_necessidade: ['mobilidade'], p_cidade: 'sim', p_laudo: 'prefiro_nao_responder' });
  assert.deepEqual(limparRespostasGuardadas('texto'), {});
  assert.deepEqual(limparRespostasGuardadas(null), {});
});

teste('lembrar: o que vai para o aparelho já sai limpo, e modo inválido vira null', () => {
  const arm = falso();
  guardarRespostas(arm, { respostas: { p_objetivo: 'transporte', cpf: '123.456.789-09' } as never, modo: 'admin' as never });
  const bruto = arm.dados.get(CHAVE_RESPOSTAS)!;
  assert.equal(bruto.includes('123'), false);
  assert.deepEqual(JSON.parse(bruto), { respostas: { p_objetivo: 'transporte' }, modo: null });
});

teste('lembrar: dado corrompido ou armazenamento bloqueado não quebra; apagar limpa tudo', () => {
  const arm = falso();
  arm.setItem(CHAVE_RESPOSTAS, '{isso não é json');
  assert.equal(lerRespostasGuardadas(arm), null);
  const bloqueado: Armazenamento = {
    getItem: () => {
      throw new Error('x');
    },
    setItem: () => {
      throw new Error('x');
    },
    removeItem: () => {
      throw new Error('x');
    }
  };
  assert.equal(guardarRespostas(bloqueado, { respostas: {}, modo: null }), false);
  assert.equal(lerRespostasGuardadas(bloqueado), null);
  assert.doesNotThrow(() => apagarRespostasGuardadas(bloqueado));
  guardarRespostas(arm, { respostas: { p_cidade: 'sim' }, modo: null });
  apagarRespostasGuardadas(arm);
  assert.equal(arm.dados.has(CHAVE_RESPOSTAS), false);
});

teste('quantasRespondidas: conta perguntas com resposta', () => {
  assert.equal(quantasRespondidas({ p_cidade: 'sim', p_necessidade: [], p_objetivo: 'escola' }), 2);
});

teste('lembrar: resposta guardada com a opção antiga da renda ("sim") é descartada, e a faixa nova fica', () => {
  assert.deepEqual(limparRespostasGuardadas({ p_renda: 'sim', p_objetivo: 'beneficio_financeiro' }), { p_objetivo: 'beneficio_financeiro' });
  assert.deepEqual(limparRespostasGuardadas({ p_renda: 'ate_um_quarto' }), { p_renda: 'ate_um_quarto' });
});
