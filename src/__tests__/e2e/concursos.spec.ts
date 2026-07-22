// src/__tests__/e2e/concursos.spec.ts
import { test, expect } from "@playwright/test";

test.describe("Página de concursos", () => {

  test.beforeEach(async ({ page }) => {
    await page.goto("/");
  });

  // ===========================
  // Hero
  // ===========================

  test("deve exibir o titulo da plataforma", async ({ page }) => {
    await expect(page.getByText(/encontre oportunidades/i)).toBeVisible();
  });

  test("deve exibir os stats do hero", async ({ page }) => {
    await expect(page.getByText(/concursos ativos/i)).toBeVisible();
    await expect(page.getByText(/vagas disponíveis/i)).toBeVisible();
    await expect(page.getByText(/fontes monitoradas/i)).toBeVisible();
  });

  test("deve exibir logo", async ({ page }) => {
    await expect(
      page.getByRole("link", { name: /ConcursosHub/i })
    ).toBeVisible();
  });

  test("deve exibir a navbar com o logo", async ({ page }) => {
    await expect(
      page.getByRole("navigation").getByText(/ConcursosHub/i)
    ).toBeVisible();
  });

  // ===========================
  // Listagem
  // ===========================

  test("deve exibir a listagem de concursos", async ({ page }) => {
    await expect(page.getByText(/concursos por estado/i)).toBeVisible();
  });

  test("deve exibir cards de concursos", async ({ page }) => {
    await expect(page.getByText(/ver edital/i).first()).toBeVisible();
  });

  test("deve exibir a paginacao", async ({ page }) => {
    await expect(page.getByLabel("Próxima página")).toBeVisible();
  });

  // ===========================
  // Footer
  // ===========================

  test("deve exibir o footer", async ({ page }) => {
    await expect(
      page.getByRole("contentinfo").getByText(/atualizado diariamente/i)
    ).toBeVisible();
  });

  test("deve exibir links das fontes no footer", async ({ page }) => {
    await expect(page.getByText(/PCI Concursos/i)).toBeVisible();
  });
});