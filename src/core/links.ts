// Conferência dos links das fontes (npm run conferir-links e o robô semanal do GitHub).
// Só abre os links oficiais que já estão em data/; não manda nada além do pedido da página.

type Obj = Record<string, unknown>;
export interface Link {
  url: string;
  /** Onde o link aparece, para saber qual ficha corrigir. */
  onde: string[];
}

export function coletarLinks(kb: unknown[], dominios: unknown, servicos: unknown[]): Link[] {
  const mapa = new Map<string, string[]>();
  const poe = (url: unknown, onde: string) => {
    if (typeof url !== 'string' || !url.startsWith('https://')) return;
    mapa.set(url, [...(mapa.get(url) ?? []), onde]);
  };
  for (const e of kb as Obj[]) {
    poe(e.fonte_url, `kb.json: ${e.id} (fonte)`);
    poe((e.onde as Obj | undefined)?.link, `kb.json: ${e.id} (onde.link)`);
    for (const b of (e.base_legal as Obj[] | undefined) ?? []) poe(b.url, `kb.json: ${e.id} (base_legal)`);
  }
  const d = (dominios ?? {}) as Obj;
  for (const s of [...((d.sufixos as Obj[]) ?? []), ...((d.dominios as Obj[]) ?? [])]) poe(s.fonte_url, 'dominios-oficiais.json');
  for (const s of servicos as Obj[]) poe(s.fonte_url, `servicos-valores.json: ${s.id}`);
  return [...mapa.entries()].map(([url, onde]) => ({ url, onde: [...new Set(onde)] }));
}

export interface Problema extends Link {
  situacao: string;
}

/** Abre cada link (GET, 15 s de limite, 4 por vez). Devolve só os que não responderam com 2xx ou 3xx. */
export async function conferirLinks(links: Link[], f: typeof fetch = fetch, tempoMs = 15_000): Promise<Problema[]> {
  const problemas: (Problema | null)[] = new Array(links.length).fill(null);
  let proximo = 0;
  const trabalhar = async () => {
    while (proximo < links.length) {
      const i = proximo++;
      const l = links[i];
      try {
        const res = await f(l.url, { method: 'GET', redirect: 'manual', signal: AbortSignal.timeout(tempoMs), headers: { 'user-agent': 'Mapiii conferencia de fontes' } });
        if (res.status >= 400) problemas[i] = { ...l, situacao: `status ${res.status}` };
      } catch {
        problemas[i] = { ...l, situacao: 'sem resposta' };
      }
    }
  };
  await Promise.all(Array.from({ length: 4 }, trabalhar));
  return problemas.filter((p): p is Problema => p !== null);
}
