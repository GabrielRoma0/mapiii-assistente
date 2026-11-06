// Plano B do Embarque: modo demonstração com dados FIXOS e fictícios (data/embarque-exemplo.json).
// Serve para o vídeo e para testar a tela quando a API da SPTrans não estiver disponível.
// Responde no mesmo contrato da Edge Function `onibus`, sem rede.
import { falha, type Linha, type RespostaOnibus } from '../../../supabase/functions/_shared/embarque';
import type { PedidoOnibus } from './cliente';

export const SELO_EXEMPLO = 'EXEMPLO, não é dado real';

export interface LinhaExemplo extends Linha {
  veiculos: { prefixo: string; acessivel: boolean; segundos_atras: number }[];
}
export interface DadosExemplo {
  aviso: string;
  linhas: LinhaExemplo[];
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
  return erros;
}

const sem = (s: string) => s.normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase();

/** Mesma resposta que a Edge Function daria, montada com os dados fixos. Horários relativos ao "agora". */
export function consultarExemplo(pedido: PedidoOnibus, dados: DadosExemplo, agora: Date): RespostaOnibus {
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
