// src/__tests__/e2e/navegacao.spec.ts
import { test, expect } from "@playwright/test";

test.describe("Navegação", () => {

  test.beforeEach(async ({ page }) => {
    await page.goto("/");
    await page.waitForLoadState("networkidle");
  });

  // ===========================
  // Navbar — renderização
  // ===========================

  test("deve exibir a navbar", async ({ page }) => {
    await expect(
      page.getByRole("navigation")
    ).toBeVisible();
  });

  test("deve exibir o logo na navbar", async ({ page }) => {
    await expect(
      page.getByRole("navigation").locator("a").getByText(/ConcursosHub/i)
    ).toBeVisible();
  });

  test("deve exibir link de inicio na navbar", async ({ page }) => {
    await expect(
      page.getByRole("navigation").getByRole("link", { name: /início/i })
    ).toBeVisible();
  });

  test("deve exibir link de concursos na navbar", async ({ page }) => {
    await expect(
      page.getByRole("navigation").getByRole("link", { name: /concursos/i }).last()
    ).toBeVisible();
  });

  // ===========================
  // Navbar — links
  // ===========================

  test("deve ter href correto no link de inicio", async ({ page }) => {
    const link = page.getByRole("navigation")
      .getByRole("link", { name: /início/i });
    const href = await link.getAttribute("href");
    expect(href).toBe("/");
  });

  test("deve ter href correto no link de concursos", async ({ page }) => {
    const link = page.getByRole("navigation")
      .getByRole("link", { name: /concursos/i }).last();
    const href = await link.getAttribute("href");
    expect(href).toBe("/concursos");
  });

  test("deve navegar para home ao clicar no logo", async ({ page }) => {
    await page.getByRole("navigation").locator("a").first().click();
    await page.waitForLoadState("networkidle");
    expect(page.url()).toContain("localhost:5173");
  });

  test("deve navegar para home ao clicar em inicio", async ({ page }) => {
    await page.getByRole("navigation")
      .getByRole("link", { name: /início/i }).click();
    await page.waitForLoadState("networkidle");
    expect(page.url()).toMatch(/localhost:5173\/?$/);
  });

  test("deve navegar para concursos ao clicar no link", async ({ page }) => {
    await page.getByRole("navigation")
      .getByRole("link", { name: /concursos/i }).last().click();
    await page.waitForLoadState("networkidle");
    expect(page.url()).toContain("/concursos");
  });

  // ===========================
  // Navbar — mobile
  // ===========================

  test("deve exibir botao hamburger em mobile", async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 });
    await page.goto("/");

    await expect(
      page.getByRole("navigation").getByLabel(/abrir menu/i)
    ).toBeVisible();
  });

  test("deve abrir menu mobile ao clicar no hamburger", async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 });
    await page.goto("/");

    await page.getByRole("navigation").getByLabel(/abrir menu/i).click();

    await expect(
      page.getByRole("navigation").getByRole("link", { name: /início/i })
    ).toBeVisible();
  });

  test("deve fechar menu mobile ao clicar novamente no hamburger", async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 });
    await page.goto("/");

    // abre
    await page.getByRole("navigation").getByLabel(/abrir menu/i).click();
    // fecha
    await page.getByRole("navigation").getByLabel(/abrir menu/i).click();

    await expect(
      page.getByRole("navigation").getByRole("link", { name: /início/i })
    ).not.toBeVisible();
  });

  test("deve ocultar links de navegacao em mobile", async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 });
    await page.goto("/");

    // verifica que o container dos links está oculto no mobile
    await expect(
      page.getByRole("navigation").locator(".hidden.md\\:flex").first()
    ).not.toBeVisible();
  });

  // ===========================
  // Responsividade
  // ===========================

  test("deve exibir navbar corretamente em tablet", async ({ page }) => {
    await page.setViewportSize({ width: 768, height: 1024 });
    await page.goto("/");
    await page.waitForLoadState("networkidle");

    await expect(
      page.getByRole("navigation")
    ).toBeVisible();
  });

  test("deve exibir navbar corretamente em desktop", async ({ page }) => {
    await page.setViewportSize({ width: 1280, height: 800 });
    await page.goto("/");
    await page.waitForLoadState("networkidle");

    await expect(
      page.getByRole("navigation").getByRole("link", { name: /concursos/i }).last()
    ).toBeVisible();
  });

  // ===========================
  // Acessibilidade
  // ===========================

  test("deve ter role navigation na navbar", async ({ page }) => {
    await expect(
      page.getByRole("navigation")
    ).toBeVisible();
  });

  test("deve ter aria-label no botao hamburger", async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 });
    await page.goto("/");

    const btn = page.getByRole("navigation").getByLabel(/abrir menu/i);
    const label = await btn.getAttribute("aria-label");
    expect(label).toBeTruthy();
  });
});