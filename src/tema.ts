// Tema claro/escuro. O design system liga o escuro com [data-theme="dark"] no <html>.
// Padrão: segue o aparelho (prefers-color-scheme). A escolha manual vale só enquanto a página está aberta.
export type Tema = 'claro' | 'escuro';
export type EscolhaTema = Tema | 'aparelho';

const consulta = () => window.matchMedia('(prefers-color-scheme: dark)');
let escolha: EscolhaTema = 'aparelho';

export function temaDoSistema(): Tema {
  return consulta().matches ? 'escuro' : 'claro';
}

export function aplicarTema(tema: Tema) {
  document.documentElement.dataset.theme = tema === 'escuro' ? 'dark' : 'light';
  document.querySelector('meta[name="theme-color"]')?.setAttribute('content', tema === 'escuro' ? '#22223B' : '#F2E9E4');
}

export function escolhaAtual(): EscolhaTema {
  return escolha;
}

export function escolherTema(nova: EscolhaTema) {
  escolha = nova;
  aplicarTema(nova === 'aparelho' ? temaDoSistema() : nova);
}

/** Acompanha a mudança do aparelho enquanto a pessoa não escolheu um tema na mão. */
export function seguirSistema(): () => void {
  const m = consulta();
  const aoMudar = () => {
    if (escolha === 'aparelho') aplicarTema(temaDoSistema());
  };
  aoMudar();
  m.addEventListener('change', aoMudar);
  return () => m.removeEventListener('change', aoMudar);
}
