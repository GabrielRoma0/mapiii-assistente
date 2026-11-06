/// <reference types="vitest/config" />
import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';
import { VitePWA } from 'vite-plugin-pwa';
import { simuladorOlhoVivo } from './scripts/simulador-olho-vivo.ts';

// base relativa: o build funciona em qualquer hospedagem estática, inclusive numa subpasta.
export default defineConfig(({ mode }) => {
  // O atalho "Próximo ônibus acessível" só entra no ícone se o Embarque estiver ligado neste build.
  const embarque = { ...process.env, ...loadEnv(mode, process.cwd(), 'VITE_') }.VITE_EMBARQUE_ATIVO === 'true';
  const icone = [{ src: 'icons/icon-192.png', sizes: '192x192', type: 'image/png' }];
  return {
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
      // "prompt": o app instalado mostra "Nova versão disponível" em vez de trocar no meio do uso (AvisoAtualizacao).
      registerType: 'prompt',
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
        // Segurar o ícone do app (Android) mostra estes atalhos.
        shortcuts: [
          ...(embarque ? [{ name: 'Próximo ônibus acessível', short_name: 'Ônibus acessível', url: './#/embarque', icons: icone }] : []),
          { name: 'Me negaram, e agora?', short_name: 'Me negaram', url: './#/negaram', icons: icone },
          { name: 'Fazer uma pergunta', short_name: 'Perguntar', url: './#/perguntar', icons: icone }
        ],
        // Prévias na tela de instalação (geradas do modo exemplo; veja docs/icones.md).
        screenshots: [
          { src: 'screenshots/inicio.png', sizes: '1024x2216', type: 'image/png', form_factor: 'narrow', label: 'Início do Mapiii' },
          { src: 'screenshots/embarque.png', sizes: '1024x2216', type: 'image/png', form_factor: 'narrow', label: 'Próximo ônibus acessível (exemplo)' }
        ],
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
        // As capturas só servem na tela de instalação: não precisam ocupar o aparelho.
        globIgnores: ['screenshots/**'],
        navigateFallback: 'index.html',
        cleanupOutdatedCaches: true
      }
    })
  ],
  test: {
    include: ['tests/**/*.test.ts'],
    environment: 'node'
  }
};
});
