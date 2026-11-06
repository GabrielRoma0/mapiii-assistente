// Testes de tela (npm run e2e): o Playwright abre o app num Chromium de verdade e faz os fluxos principais.
// Sempre com a base fictícia de exemplo e o Embarque ligado no simulador, para não depender de conteúdo real nem de token.
import { defineConfig, devices } from '@playwright/test';

const PORTA = 5174;

export default defineConfig({
  testDir: 'e2e',
  fullyParallel: true,
  retries: process.env.CI ? 1 : 0,
  reporter: process.env.CI ? [['list'], ['html', { open: 'never' }]] : 'list',
  use: {
    baseURL: `http://localhost:${PORTA}`,
    locale: 'pt-BR',
    timezoneId: 'America/Sao_Paulo',
    trace: 'retain-on-failure'
  },
  projects: [
    { name: 'celular', use: { ...devices['Pixel 7'] } },
    { name: 'computador', use: { ...devices['Desktop Chrome'] } }
  ],
  webServer: {
    command: `npm run dev -- --port ${PORTA} --strictPort`,
    url: `http://localhost:${PORTA}`,
    reuseExistingServer: !process.env.CI,
    env: {
      VITE_BASE_EXEMPLO: 'true',
      VITE_EMBARQUE_ATIVO: 'true',
      VITE_SUPABASE_URL: `http://localhost:${PORTA}/__simulador`,
      VITE_SUPABASE_PUBLISHABLE_KEY: 'simulador'
    }
  }
});
