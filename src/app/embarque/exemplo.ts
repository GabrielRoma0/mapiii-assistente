// Plano B do Embarque: modo demonstração com dados FIXOS e fictícios (data/embarque-exemplo.json).
// Serve para o vídeo e para testar a tela quando a API da SPTrans não estiver disponível.
// Responde no mesmo contrato da Edge Function `onibus`, sem rede.
import { falha, horaSP, MENSAGEM_PARADA_INEXISTENTE, MENSAGEM_SEM_PREVISAO, type Linha } from '../../../supabase/functions/_shared/embarque';
import type { RespostaServico } from '../../../supabase/functions/_shared/onibus-servidor';
import type { PedidoOnibus } from './cliente';

export const SELO_EXEMPLO = 'EXEMPLO, não é dado real';

export interface LinhaExemplo extends Linha {
  veiculos: { prefixo: string; acessivel: boolean; segundos_atras: number }[];
}
export interface ParadaExemplo {
  codigo: number;
  nome: string;
  endereco: string;
  linhas: { codigo: number; letreiro: string; sentido: 1 | 2; destino: string; veiculos: { prefixo: string; acessivel: boolean; minutos: number }[] }[];
}
export interface DadosExemplo {
  aviso: string;
  linhas: LinhaExemplo[];
  paradas: ParadaExemplo[];
}

/** Lista de erros; vazia quando o arquivo de exemplo está no formato certo. */
export function validarExemplo(dados: unknown): string[] {
  const erros: string[] = [];
  if (!dados || typeof dados !== 'object' || Array.isArray(dados)) return ['embarque-exemplo.json precisa ser um objeto.'];
  const o = dados as Record<string, unknown>;
  if (typeof o.aviso !== 'string' || !/fict[íi]c/i.test(o.aviso)) erros.push('aviso precisa dizer que os dados são fictícios.');
  if (!Array.isArray(o.linhas) || !o.linhas.length) return [...erros, 'linhas precisa ter ao menos 1 linha.'];
  const codigos = new Set<number>();
  o.linhas.forEach((l: unknown, i) => {
    const erro = (m: string) => erros.push(`linhas[${i}]: ${m}`);
    const x = (l ?? {}) as Record<string, unknown>;
    if (typeof x.codigo !== 'number' || !Number.isInteger(x.codigo) || x.codigo <= 0) erro('codigo precisa ser inteiro positivo.');
    else if (codigos.has(x.codigo)) erro('codigo repetido.');
    else codigos.add(x.codigo);
    if (typeof x.letreiro !== 'string' || !/^EX/.test(x.letreiro)) erro('letreiro precisa começar com "EX", para nunca parecer uma linha real.');
    if (x.sentido !== 1 && x.sentido !== 2) erro('sentido precisa ser 1 ou 2.');
    if (typeof x.descricao !== 'string' || !/EXEMPLO/.test(x.descricao)) erro('descricao precisa ter a palavra EXEMPLO.');
    if (typeof x.circular !== 'boolean') erro('circular precisa ser true ou false.');
    if (!Array.isArray(x.veiculos)) return erro('veiculos precisa ser uma lista (pode ser vazia).');
    x.veiculos.forEach((v: unknown, j) => {
      const y = (v ?? {}) as Record<string, unknown>;
      if (typeof y.prefixo !== 'string' || !/^[0-9]{3,6}$/.test(y.prefixo)) erro(`veiculos[${j}].prefixo precisa ser texto com 3 a 6 dígitos.`);
      if (typeof y.acessivel !== 'boolean') erro(`veiculos[${j}].acessivel precisa ser true ou false.`);
      if (typeof y.segundos_atras !== 'number' || y.segundos_atras < 0) erro(`veiculos[${j}].segundos_atras precisa ser um número ≥ 0.`);
    });
  });
  if (!Array.isArray(o.paradas) || !o.paradas.length) return [...erros, 'paradas precisa ter ao menos 1 ponto.'];
  const pontos = new Set<number>();
  o.paradas.forEach((p: unknown, i) => {
    const erro = (m: string) => erros.push(`paradas[${i}]: ${m}`);
    const x = (p ?? {}) as Record<string, unknown>;
    if (typeof x.codigo !== 'number' || !Number.isInteger(x.codigo) || x.codigo <= 0) erro('codigo precisa ser inteiro positivo.');
    else if (pontos.has(x.codigo)) erro('codigo repetido.');
    else pontos.add(x.codigo);
    if (typeof x.nome !== 'string' || !/EXEMPLO/.test(x.nome)) erro('nome precisa ter a palavra EXEMPLO, para nunca parecer um ponto real.');
    if (typeof x.endereco !== 'string' || !/EXEMPLO/.test(x.endereco)) erro('endereco precisa ter a palavra EXEMPLO.');
    if (!Array.isArray(x.linhas)) return erro('linhas precisa ser uma lista (pode ser vazia).');
    x.linhas.forEach((l: unknown, j) => {
      const y = (l ?? {}) as Record<string, unknown>;
      if (typeof y.letreiro !== 'string' || !/^EX/.test(y.letreiro)) erro(`linhas[${j}].letreiro precisa começar com "EX".`);
      if (typeof y.codigo !== 'number' || (y.sentido !== 1 && y.sentido !== 2) || typeof y.destino !== 'string') erro(`linhas[${j}] precisa de codigo, sentido (1 ou 2) e destino.`);
      if (!Array.isArray(y.veiculos)) return erro(`linhas[${j}].veiculos precisa ser uma lista.`);
      y.veiculos.forEach((v: unknown, k) => {
        const z = (v ?? {}) as Record<string, unknown>;
        if (typeof z.prefixo !== 'string' || !/^[0-9]{3,6}$/.test(z.prefixo)) erro(`linhas[${j}].veiculos[${k}].prefixo precisa ter 3 a 6 dígitos.`);
        if (typeof z.acessivel !== 'boolean') erro(`linhas[${j}].veiculos[${k}].acessivel precisa ser true ou false.`);
        if (typeof z.minutos !== 'number' || !Number.isInteger(z.minutos) || z.minutos < 0 || z.minutos > 120) erro(`linhas[${j}].veiculos[${k}].minutos precisa ser inteiro de 0 a 120.`);
      });
    });
  });
  return erros;
}

const sem = (s: string) => s.normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase();

/** Mesma resposta que a Edge Function daria, montada com os dados fixos. Horários relativos ao "agora". */
/** Soma minutos a um horário HH:MM, dando a volta na meia-noite. */
function somarMinutos(hhmm: string, minutos: number): string {
  const total = (Number(hhmm.slice(0, 2)) * 60 + Number(hhmm.slice(3, 5)) + minutos) % (24 * 60);
  return `${String(Math.floor(total / 60)).padStart(2, '0')}:${String(total % 60).padStart(2, '0')}`;
}

/**
 * `ancora`: quando a consulta ao ponto começou. Os horários previstos ficam presos a ela, então os minutos
 * diminuem a cada atualização (a contagem aparece no exemplo, como no dado real).
 */
export function consultarExemplo(pedido: PedidoOnibus, dados: DadosExemplo, agora: Date, ancora: Date = agora): RespostaServico {
  if (pedido.acao === 'paradas') {
    const t = sem(pedido.termo);
    const achadas = dados.paradas.filter((p) => sem(p.nome).includes(t) || sem(p.endereco).includes(t) || t === 'exemplo');
    if (!achadas.length) return { ok: false, erro: 'linha_inexistente', mensagem: MENSAGEM_PARADA_INEXISTENTE };
    return { ok: true, acao: 'paradas', paradas: achadas.map(({ codigo, nome, endereco }) => ({ codigo, nome, endereco })) };
  }
  if (pedido.acao === 'previsao') {
    const parada = dados.paradas.find((p) => p.codigo === pedido.codigo);
    if (!parada) return { ok: false, erro: 'linha_inexistente', mensagem: MENSAGEM_PARADA_INEXISTENTE };
    const hr = horaSP(agora);
    const linhas = parada.linhas
      .filter((l) => l.veiculos.length)
      .map((l) => ({ ...l, veiculos: l.veiculos.map((v) => ({ prefixo: v.prefixo, acessivel: v.acessivel, previsto: somarMinutos(horaSP(ancora), v.minutos) })) }));
    if (!linhas.length) return { ok: false, erro: 'sem_veiculos', mensagem: MENSAGEM_SEM_PREVISAO };
    return { ok: true, acao: 'previsao', parada: { codigo: parada.codigo, nome: parada.nome }, horaReferencia: hr, linhas, consultadoEm: agora.toISOString() };
  }
  if (pedido.acao === 'linhas') {
    const t = sem(pedido.termo);
    const achadas = dados.linhas.filter((l) => sem(l.letreiro).includes(t) || sem(l.descricao).includes(t) || t === 'exemplo');
    if (!achadas.length) return falha('linha_inexistente');
    return { ok: true, acao: 'linhas', linhas: achadas.map(({ veiculos: _v, ...linha }) => linha) };
  }
  const linha = dados.linhas.find((l) => l.codigo === pedido.codigo);
  if (!linha) return falha('linha_inexistente');
  if (!linha.veiculos.length) return falha('sem_veiculos');
  return {
    ok: true,
    acao: 'veiculos',
    codigo: linha.codigo,
    horaReferencia: null,
    consultadoEm: agora.toISOString(),
    veiculos: linha.veiculos.map((v) => ({
      prefixo: v.prefixo,
      acessivel: v.acessivel,
      capturadoEm: new Date(agora.getTime() - v.segundos_atras * 1000).toISOString()
    }))
  };
}
