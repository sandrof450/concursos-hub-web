// src/__tests__/e2e/footer.spec.ts
import { test, expect } from "@playwright/test";

test.describe("Footer", () => {

  test.beforeEach(async ({ page }) => {
    await page.goto("/");
    await page.waitForLoadState("networkidle");
  });

  // ===========================
  // Renderização básica
  // ===========================

  test("deve exibir o footer na pagina", async ({ page }) => {
    await expect(
      page.getByRole("contentinfo")
    ).toBeVisible();
  });

  test("deve exibir o logo no footer", async ({ page }) => {
    await expect(
      page.getByRole("contentinfo")
        .getByText(/ConcursosHub/i)
        .first()
    ).toBeVisible();
  });

  test("deve exibir a descricao da plataforma", async ({ page }) => {
    await expect(
      page.getByRole("contentinfo").getByText(/plataforma inteligente/i)
    ).toBeVisible();
  });

  test("deve exibir o ano atual no copyright", async ({ page }) => {
    const ano = new Date().getFullYear().toString();
    await expect(
      page.getByRole("contentinfo").getByText(new RegExp(ano))
    ).toBeVisible();
  });

  test("deve exibir o texto de copyright", async ({ page }) => {
    await expect(
      page.getByRole("contentinfo").getByText(/todos os direitos reservados/i)
    ).toBeVisible();
  });

  test("deve exibir o disclaimer sobre fontes publicas", async ({ page }) => {
    await expect(
      page.getByRole("contentinfo").getByText(/fontes públicas/i)
    ).toBeVisible();
  });

  // ===========================
  // Fontes de dados
  // ===========================

  test("deve exibir secao de fontes de dados", async ({ page }) => {
    await expect(
      page.getByRole("contentinfo").getByText(/fontes de dados/i)
    ).toBeVisible();
  });

  test("deve exibir link do PCI Concursos", async ({ page }) => {
    await expect(
      page.getByRole("contentinfo").getByText(/PCI Concursos/i)
    ).toBeVisible();
  });

  test("deve exibir link do Concursos Brasil", async ({ page }) => {
    await expect(
      page.getByRole("contentinfo").getByText(/Concursos Brasil/i)
    ).toBeVisible();
  });

  test("deve ter href correto no link do PCI Concursos", async ({ page }) => {
    const link = page.getByRole("contentinfo")
      .getByRole("link", { name: /PCI Concursos/i });
    const href = await link.getAttribute("href");
    expect(href).toContain("pciconcursos");
  });

  test("deve ter href correto no link do Concursos Brasil", async ({ page }) => {
    const link = page.getByRole("contentinfo")
      .getByRole("link", { name: /Concursos Brasil/i });
    const href = await link.getAttribute("href");
    expect(href).toContain("concursosnobrasil");
  });

  test("deve abrir link do PCI Concursos em nova aba", async ({ page }) => {
    const link = page.getByRole("contentinfo")
      .getByRole("link", { name: /PCI Concursos/i });
    const target = await link.getAttribute("target");
    expect(target).toBe("_blank");
  });

  test("deve abrir link do Concursos Brasil em nova aba", async ({ page }) => {
    const link = page.getByRole("contentinfo")
      .getByRole("link", { name: /Concursos Brasil/i });
    const target = await link.getAttribute("target");
    expect(target).toBe("_blank");
  });

  test("deve ter atributo rel noopener nos links", async ({ page }) => {
    const links = page.getByRole("contentinfo").getByRole("link");
    const count = await links.count();
    for (let i = 0; i < count; i++) {
      const rel = await links.nth(i).getAttribute("rel");
      expect(rel).toContain("noopener");
    }
  });

  // ===========================
  // Atualização
  // ===========================

  test("deve exibir secao de atualizacao", async ({ page }) => {
    await expect(
      page.getByRole("contentinfo").getByText(/atualização/i)
    ).toBeVisible();
  });

  test("deve exibir badge de atualizado diariamente", async ({ page }) => {
    await expect(
      page.getByRole("contentinfo").getByText(/atualizado diariamente/i)
    ).toBeVisible();
  });

  test("deve exibir texto sobre scraping automatico", async ({ page }) => {
    await expect(
      page.getByRole("contentinfo").getByText(/coletados automaticamente/i)
    ).toBeVisible();
  });

  test("deve exibir o ponto pulsante no badge de atualizacao", async ({ page }) => {
    await expect(
      page.getByRole("contentinfo").locator(".animate-pulse")
    ).toBeVisible();
  });

  // ===========================
  // Responsividade
  // ===========================

  test("deve exibir footer corretamente em mobile", async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 });
    await page.goto("/");
    await page.waitForLoadState("networkidle");

    await expect(
      page.getByRole("contentinfo").getByText(/ConcursosHub/i).first()
    ).toBeVisible();
  });

  test("deve exibir footer corretamente em tablet", async ({ page }) => {
    await page.setViewportSize({ width: 768, height: 1024 });
    await page.goto("/");
    await page.waitForLoadState("networkidle");

    await expect(
      page.getByRole("contentinfo").getByText(/ConcursosHub/i).first()
    ).toBeVisible();
  });

  test("deve exibir footer corretamente em desktop", async ({ page }) => {
    await page.setViewportSize({ width: 1280, height: 800 });
    await page.goto("/");
    await page.waitForLoadState("networkidle");

    await expect(
      page.getByRole("contentinfo").getByText(/ConcursosHub/i).first()
    ).toBeVisible();
  });

  // ===========================
  // Acessibilidade
  // ===========================

  test("deve ter role contentinfo no footer", async ({ page }) => {
    await expect(
      page.getByRole("contentinfo")
    ).toBeVisible();
  });

  test("deve exibir icone nos links das fontes", async ({ page }) => {
    await expect(
      page.getByRole("contentinfo").locator(".ti-external-link").first()
    ).toBeVisible();
  });
});