// Tema atual para componentes que precisam trocar de versão (ex.: logo invertido no escuro).
import { useEffect, useState } from 'react';
import type { Tema } from '../tema';

function lerTema(): Tema {
  return document.documentElement.dataset.theme === 'dark' ? 'escuro' : 'claro';
}

export function useTema(): Tema {
  const [tema, setTema] = useState(lerTema);
  useEffect(() => {
    const obs = new MutationObserver(() => setTema(lerTema()));
    obs.observe(document.documentElement, { attributes: true, attributeFilter: ['data-theme'] });
    return () => obs.disconnect();
  }, []);
  return tema;
}
