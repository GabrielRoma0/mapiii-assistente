// Sabe se o aparelho está sem internet, para avisar que os links das fontes não vão abrir.
// O app em si funciona offline: dados e telas ficam no service worker.
import { useEffect, useState } from 'react';

export function useOnline(): boolean {
  const [online, setOnline] = useState(() => navigator.onLine);
  useEffect(() => {
    const ligar = () => setOnline(true);
    const desligar = () => setOnline(false);
    window.addEventListener('online', ligar);
    window.addEventListener('offline', desligar);
    return () => {
      window.removeEventListener('online', ligar);
      window.removeEventListener('offline', desligar);
    };
  }, []);
  return online;
}
