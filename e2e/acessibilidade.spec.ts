// Auditoria automática de acessibilidade (axe) em cada tela, nos temas claro e escuro.
// Falha com qualquer problema "serious" ou "critical" (regras WCAG 2.0, 2.1 e 2.2, níveis A e AA).
import AxeBuilder from '@axe-core/playwright';
import { expect, test } from '@playwright/test';

const TELAS = [
  '/#/',
  '/#/situacao',
  '/#/perguntar',
  '/#/conferir',
  '/#/sobre',
  '/#/na-rua',
  '/#/negaram',
  '/#/negaram/exemplo-transporte',
  '/#/motorista/exemplo-transporte',
  '/#/cartao',
  '/#/reclamacao',
  '/#/embarque',
  '/#/direito/exemplo-transporte',
  '/#/atalho/deslocamento',
  '/#/rota',
  '/#/laudo',
  '/#/qualquer-coisa'
];

for (const tema of ['light', 'dark'] as const) {
  for (const tela of TELAS) {
    test(`acessibilidade (${tema === 'light' ? 'claro' : 'escuro'}): ${tela}`, async ({ page }) => {
      await page.emulateMedia({ colorScheme: tema });
      await page.goto(tela);
      await expect(page.getByRole('heading', { level: 1 }).first()).toBeVisible();
      const r = await new AxeBuilder({ page }).withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa', 'wcag22aa']).analyze();
      const graves = r.violations.filter((v) => v.impact === 'serious' || v.impact === 'critical');
      expect(graves.map((v) => `${v.id}: ${v.help} (${v.nodes.map((n) => n.target.join(' ')).slice(0, 3).join(' | ')})`)).toEqual([]);
    });
  }
}
