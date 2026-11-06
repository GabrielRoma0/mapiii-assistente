// Estado da sessão: só em memória. Some ao fechar ou recarregar a página.
// Nada daqui vai para a URL, localStorage, cookies ou rede.
import { createContext, useContext, useMemo, useState, type ReactNode } from 'react';
import type { Modo, Respostas } from '../core/perguntas.ts';

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
}

const Contexto = createContext<EstadoApp | null>(null);

export function ProvedorEstado({ children }: { children: ReactNode }) {
  const [respostas, setRespostas] = useState<Respostas>({});
  const [marcados, setMarcados] = useState<Record<string, string[]>>({});
  const [modo, setModo] = useState<Modo | null>(null);

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
      escolherModo: setModo
    }),
    [respostas, marcados, modo]
  );
  return <Contexto.Provider value={valor}>{children}</Contexto.Provider>;
}

export function useEstado(): EstadoApp {
  const v = useContext(Contexto);
  if (!v) throw new Error('useEstado precisa estar dentro de <ProvedorEstado>.');
  return v;
}
