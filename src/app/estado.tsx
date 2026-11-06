// Estado da sessão. Por padrão fica só em memória: some ao fechar ou recarregar a página.
// Exceção, escolhida pela pessoa: com "Lembrar minhas respostas neste aparelho", as respostas da triagem
// e o modo ficam no navegador (src/core/lembrar.ts), sem rede e sem conta. Nada vai para a URL, cookies ou rede.
import { createContext, useContext, useEffect, useMemo, useRef, useState, type ReactNode } from 'react';
import type { Modo, Respostas } from '../core/perguntas.ts';
import { apagarRespostasGuardadas, guardarRespostas, lerRespostasGuardadas } from '../core/lembrar.ts';
import { armazenamentoDoNavegador } from '../core/registro.ts';

interface EstadoApp {
  respostas: Respostas;
  responder: (id: string, valor: string | string[] | undefined) => void;
  limparRespostas: () => void;
  /** Documentos marcados no checklist de cada entrada. */
  marcados: Record<string, string[]>;
  alternarDocumento: (entradaId: string, documento: string) => void;
  /** "Sou a pessoa" ou "Cuido de alguém": muda o texto das perguntas. null = não escolheu. */
  modo: Modo | null;
  escolherModo: (m: Modo | null) => void;
  /** As respostas estão sendo guardadas neste aparelho (a pessoa marcou a caixa). */
  lembrar: boolean;
  /** Liga (guarda já) ou desliga (apaga do aparelho). Devolve false se o navegador não deixar guardar. */
  alternarLembrar: (ligar: boolean) => boolean;
  /** O navegador deixa guardar (não está em modo privado nem bloqueado). */
  podeLembrar: boolean;
}

const Contexto = createContext<EstadoApp | null>(null);

export function ProvedorEstado({ children }: { children: ReactNode }) {
  const armazenamento = useRef(armazenamentoDoNavegador()).current;
  // Se a pessoa marcou "Lembrar" numa visita anterior, começa com as respostas guardadas.
  const [guardado] = useState(() => lerRespostasGuardadas(armazenamento));
  const [respostas, setRespostas] = useState<Respostas>(guardado?.respostas ?? {});
  const [marcados, setMarcados] = useState<Record<string, string[]>>({});
  const [modo, setModo] = useState<Modo | null>(guardado?.modo ?? null);
  const [lembrar, setLembrar] = useState(Boolean(guardado));

  // Com "Lembrar" ligado, cada mudança é gravada; desligado, nada é escrito.
  useEffect(() => {
    if (lembrar) guardarRespostas(armazenamento, { respostas, modo });
  }, [lembrar, respostas, modo, armazenamento]);

  const valor = useMemo<EstadoApp>(
    () => ({
      respostas,
      responder: (id, v) =>
        setRespostas((r) => {
          const novo = { ...r };
          if (v === undefined || (Array.isArray(v) && !v.length)) delete novo[id];
          else novo[id] = v;
          return novo;
        }),
      limparRespostas: () => setRespostas({}),
      marcados,
      alternarDocumento: (entradaId, documento) =>
        setMarcados((m) => {
          const atuais = m[entradaId] ?? [];
          const novos = atuais.includes(documento) ? atuais.filter((d) => d !== documento) : [...atuais, documento];
          return { ...m, [entradaId]: novos };
        }),
      modo,
      escolherModo: setModo,
      lembrar,
      podeLembrar: armazenamento !== null,
      alternarLembrar: (ligar) => {
        if (!ligar) {
          apagarRespostasGuardadas(armazenamento);
          setLembrar(false);
          return true;
        }
        const ok = guardarRespostas(armazenamento, { respostas, modo });
        setLembrar(ok);
        return ok;
      }
    }),
    [respostas, marcados, modo, lembrar, armazenamento]
  );
  return <Contexto.Provider value={valor}>{children}</Contexto.Provider>;
}

export function useEstado(): EstadoApp {
  const v = useContext(Contexto);
  if (!v) throw new Error('useEstado precisa estar dentro de <ProvedorEstado>.');
  return v;
}
