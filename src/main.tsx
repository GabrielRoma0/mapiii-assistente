import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './global.css';
import { seguirSistema } from './tema';
import { App } from './App';

seguirSistema();

createRoot(document.getElementById('raiz')!).render(
  <StrictMode>
    <App />
  </StrictMode>
);
