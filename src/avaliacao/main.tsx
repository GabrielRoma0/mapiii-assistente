import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import '../global.css';
import { seguirSistema } from '../tema';
import { Avaliacao } from './Avaliacao';

seguirSistema();

createRoot(document.getElementById('raiz')!).render(
  <StrictMode>
    <Avaliacao />
  </StrictMode>
);
