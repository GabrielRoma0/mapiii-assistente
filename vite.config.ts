/// <reference types="vitest/config" />
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { VitePWA } from 'vite-plugin-pwa';
import { simuladorOlhoVivo } from './scripts/simulador-olho-vivo.ts';

// base relativa: o build funciona em qualquer hospedagem estática, inclusive numa subpasta.
export default defineConfig({
  base: './',
  build: {
    rollupOptions: {
      // Duas páginas: o app e a página de avaliação (números do registro local).
      input: { main: 'index.html', avaliacao: 'avaliacao.html' }
    }
  },
  plugins: [
    react(),
    // Só no `npm run dev`: SPTrans fictícia para testar o Embarque sem token (scripts/simulador-olho-vivo.ts).
    simuladorOlhoVivo(),
    VitePWA({
      registerType: 'autoUpdate',
      // Ícones gerados a partir de design-system/assets/logo/app-icon.svg (veja docs/icones.md).
      includeAssets: ['icons/*.svg', 'icons/*.png'],
      manifest: {
        name: 'Mapiii · o mapa dos seus direitos',
        short_name: 'Mapiii',
        description: 'Protótipo de estudo que orienta sobre direitos e serviços públicos em São Paulo, com fontes verificáveis.',
        lang: 'pt-BR',
        id: './',
        start_url: './',
        scope: './',
        display: 'standalone',
        background_color: '#F2E9E4',
        theme_color: '#22223B',
        icons: [
          { src: 'icons/icon-192.png', sizes: '192x192', type: 'image/png', purpose: 'any' },
          { src: 'icons/icon-512.png', sizes: '512x512', type: 'image/png', purpose: 'any' },
          { src: 'icons/maskable-512.png', sizes: '512x512', type: 'image/png', purpose: 'maskable' },
          { src: 'icons/app-icon.svg', sizes: 'any', type: 'image/svg+xml', purpose: 'any' }
        ]
      },
      workbox: {
        // Tudo o que o app usa fica guardado no aparelho: funciona sem internet depois da primeira visita.
        globPatterns: ['**/*.{js,css,html,svg,png,woff2,json}'],
        navigateFallback: 'index.html',
        cleanupOutdatedCaches: true
      }
    })
  ],
  test: {
    include: ['tests/**/*.test.ts'],
    environment: 'node'
  }
});
