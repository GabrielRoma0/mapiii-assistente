// Fluxos principais, de ponta a ponta, num navegador de verdade (base fictícia de exemplo).
import { expect, test, type Page } from '@playwright/test';

/** Escolhe a primeira opção de cada passo da triagem até chegar à rota. */
async function responderTriagem(page: Page) {
  await page.goto('/#/situacao');
  for (let i = 0; i < 12 && page.url().includes('situacao'); i++) {
    await page.locator('fieldset [role=radio], fieldset [role=checkbox]').first().click();
    await page.getByRole('button', { name: /Continuar|Ver minha rota/ }).click();
  }
  await expect(page).toHaveURL(/#\/rota$/);
}

test('triagem completa leva à rota com classificação e porquê', async ({ page }) => {
  await responderTriagem(page);
  await expect(page.getByRole('heading', { level: 1, name: 'Sua rota dos direitos' })).toBeVisible();
  await expect(page.getByText('Pode ter direito').first()).toBeVisible();
  await expect(page.getByText(/Combina com o que você respondeu/).first()).toBeVisible();
  await expect(page.getByText(/você tem direito/i)).toHaveCount(0);
});

test('pergunta com resposta da base e pergunta fora da base', async ({ page }) => {
  await page.goto('/#/perguntar');
  const campo = page.getByLabel('Sua pergunta');
  await campo.fill('Como peço o passe de exemplo?');
  await page.getByRole('button', { name: 'Enviar pergunta' }).click();
  await expect(page.getByText('Direito de exemplo A').first()).toBeVisible();
  await expect(page.getByText(/verificado em/).first()).toBeVisible();

  await campo.fill('Como funciona a isenção de IPVA para carro adaptado?');
  await page.getByRole('button', { name: 'Enviar pergunta' }).click();
  await expect(page.getByText('Não encontrei isso na minha base.', { exact: true })).toBeVisible();
});

test('emergência responde só com o 192', async ({ page }) => {
  await page.goto('/#/perguntar');
  await page.getByLabel('Sua pergunta').fill('Socorro, meu pai desmaiou');
  await page.getByRole('button', { name: 'Enviar pergunta' }).click();
  await expect(page.getByRole('region', { name: 'Conversa' }).getByText('Em emergência, ligue 192.', { exact: true })).toBeVisible();
  await expect(page.getByRole('link', { name: 'Ligar para 192' })).toHaveAttribute('href', 'tel:192');
});

test('Me negaram mostra o caminho e o modelo de pedido com a lei', async ({ page }) => {
  await page.goto('/#/negaram');
  await page.getByRole('link', { name: /Direito de exemplo A/ }).click();
  await expect(page.getByRole('heading', { name: 'Modelo de pedido' })).toBeVisible();
  await expect(page.getByText(/\(preencha seu nome\)/).first()).toBeVisible();
  await expect(page.getByText(/Base legal:/)).toBeVisible();
  await expect(page.getByText(/não substitui orientação jurídica/).first()).toBeVisible();
});

test('Embarque por ponto no modo exemplo mostra o próximo acessível', async ({ page }) => {
  await page.goto('/#/embarque');
  await page.getByRole('button', { name: 'Ver exemplo' }).click();
  await page.getByRole('textbox', { name: 'Ponto de ônibus' }).fill('central');
  await page.getByRole('button', { name: 'Buscar ponto' }).click();
  await page.getByRole('button', { name: /PONTO EXEMPLO AVENIDA CENTRAL/ }).click();
  await expect(page.getByRole('region', { name: 'Resultado' }).getByText('Próximo acessível: EX01-10, em 14 min. Antes dele passam 2 ônibus sem acessibilidade.')).toBeVisible();
  await expect(page.getByText('EXEMPLO, não é dado real').first()).toBeVisible();
});

test('lembrar respostas: guarda, volta depois de recarregar e apaga com confirmação', async ({ page }) => {
  await responderTriagem(page);
  await page.getByLabel('Lembrar minhas respostas neste aparelho').check();
  await page.goto('/#/');
  await page.reload();
  await expect(page.getByText('Suas respostas estão guardadas neste aparelho.')).toBeVisible();

  await page.getByRole('button', { name: 'Apagar', exact: true }).click();
  await expect(page.getByText('Apagar as respostas guardadas neste aparelho? Não dá para desfazer.')).toBeFocused();
  await page.keyboard.press('Escape');
  await expect(page.getByRole('button', { name: 'Apagar', exact: true })).toBeFocused();

  await page.getByRole('button', { name: 'Apagar', exact: true }).click();
  await page.getByRole('button', { name: 'Sim, apagar' }).click();
  await expect(page.getByText('Suas respostas estão guardadas neste aparelho.')).toHaveCount(0);
  await expect(page.getByRole('heading', { level: 1 })).toBeFocused();
  expect(await page.evaluate(() => localStorage.getItem('mapiii.respostas.v1'))).toBeNull();
});

test('ao trocar de tela, o foco vai para o título (leitor de tela começa do topo)', async ({ page }) => {
  await page.goto('/#/');
  await page.getByRole('link', { name: /Fazer uma pergunta/ }).click();
  await expect(page.getByRole('heading', { level: 1, name: 'Fazer uma pergunta' })).toBeFocused();
});

test('o aviso de protótipo aparece em todas as telas principais', async ({ page }) => {
  for (const tela of ['/#/', '/#/situacao', '/#/perguntar', '/#/conferir', '/#/na-rua', '/#/negaram', '/#/cartao', '/#/sobre', '/#/embarque']) {
    await page.goto(tela);
    await expect(page.getByText('Sou um protótipo de estudo, não um canal oficial. Confirme nas fontes indicadas.').first()).toBeVisible();
  }
});

test('se uma tela quebrar, aparece uma mensagem amigável e dá para voltar ao início', async ({ page }) => {
  await page.goto('/#/teste-erro');
  await expect(page.getByRole('heading', { level: 1, name: 'Algo deu errado nesta tela' })).toBeVisible();
  await expect(page.getByText('Sou um protótipo de estudo, não um canal oficial. Confirme nas fontes indicadas.').first()).toBeVisible();
  await page.getByRole('link', { name: 'Voltar ao início' }).click();
  await expect(page.getByRole('heading', { level: 1, name: 'Seu mapa de direitos' })).toBeVisible();
});

test('barra inferior: troca de tela, marca a aba atual e leva o foco ao título', async ({ page }) => {
  await page.goto('/#/');
  const barra = page.getByRole('navigation', { name: 'Navegação principal' });
  await expect(barra.getByRole('button', { name: 'Início' })).toHaveAttribute('aria-current', 'page');
  await barra.getByRole('button', { name: 'Na rua' }).click();
  await expect(page.getByRole('heading', { level: 1, name: 'Garanta na rua' })).toBeFocused();
  await expect(barra.getByRole('button', { name: 'Na rua' })).toHaveAttribute('aria-current', 'page');
  await barra.getByRole('button', { name: 'Perguntar' }).click();
  // O campo da pergunta fica acima da barra, sem ser coberto.
  const campo = await page.getByLabel('Sua pergunta').boundingBox();
  const caixaBarra = await barra.boundingBox();
  expect(campo!.y + campo!.height).toBeLessThanOrEqual(caixaBarra!.y + 1);
  await page.goto('/#/situacao');
  await expect(barra).toHaveCount(0);
});
