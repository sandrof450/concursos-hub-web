// src/__tests__/e2e/paginacao.spec.ts
import { test, expect } from "@playwright/test";

test.describe("Paginação", () => {

  test.beforeEach(async ({ page }) => {
    await page.goto("/");
  });

  test("deve exibir botoes de paginacao", async ({ page }) => {
    await expect(page.getByLabel("Próxima página")).toBeVisible();
    await expect(page.getByLabel("Página anterior")).toBeVisible();
  });

  test("deve navegar para proxima pagina", async ({ page }) => {
    await page.waitForLoadState("networkidle");

    await page.getByLabel("Próxima página").click();

    // aguarda todas as requisições terminarem
    await page.waitForLoadState("networkidle");

    await expect(page.getByLabel("Ir para página 2"))
      .toHaveAttribute("aria-current", "page");
  });

  test("deve desabilitar botao anterior na primeira pagina", async ({ page }) => {
    await expect(page.getByLabel("Página anterior")).toBeDisabled();
  });

  test("deve exibir informacao de registros", async ({ page }) => {
    await expect(
      page.locator("p").filter({ hasText: /mostrando/i }).filter({ hasText: /concursos/i })
    ).toBeVisible();
  });

  test("deve rolar para o topo ao mudar de pagina", async ({ page }) => {
    await page.waitForLoadState("networkidle");

    // rola para baixo primeiro para garantir que o scroll funciona
    await page.evaluate(() => window.scrollTo(0, 500));

    await page.getByLabel("Próxima página").click();
    await page.waitForLoadState("networkidle");

    // aguarda o scroll terminar
    await page.waitForFunction(() => window.scrollY === 0);

    const scrollY = await page.evaluate(() => window.scrollY);
    expect(scrollY).toBe(0);
  });
});