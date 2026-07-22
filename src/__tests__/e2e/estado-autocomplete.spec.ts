import { test, expect } from "@playwright/test";

test.describe("EstadoAutocomplete", () => {

  test.beforeEach(async ({ page }) => {
    await page.goto("/");
  });

  test("deve abrir o dropdown", async ({ page }) => {

    await page
      .getByText(/Selecione um ou mais estados/i)
      .click();

    await expect(
      page.getByPlaceholder(/Buscar estado/i)
    ).toBeVisible();
  });

  test("deve pesquisar estados", async ({ page }) => {

    await page
      .getByText(/Selecione um ou mais estados/i)
      .click();

    await page
      .getByPlaceholder(/Buscar estado/i)
      .fill("São");

    await expect(
      page.getByRole("option", { name: /São Paulo/i })
    ).toBeVisible();
  });

  test("deve pesquisar pela UF", async ({ page }) => {

    await page
      .getByText(/Selecione um ou mais estados/i)
      .click();

    await page
      .getByPlaceholder(/Buscar estado/i)
      .fill("SP");

    await expect(
      page.getByRole("option", { name: /São Paulo/i })
    ).toBeVisible();
  });

  test("deve selecionar um estado", async ({ page }) => {

    await page.getByText(/Selecione um ou mais estados/i).click();

    await page.getByPlaceholder(/buscar estado/i).fill("São Paulo");

    await page
      .getByRole("option", { name: /São Paulo/i })
      .click();

    await expect(page.getByText("São Paulo").first()).toBeVisible();

    await expect(
      page.getByText(/1 selecionado/i)
    ).toBeVisible();
  });

  test("deve permitir selecionar múltiplos estados", async ({ page }) => {

    await page
      .getByText(/Selecione um ou mais estados/i)
      .click();

    await page.getByPlaceholder(/Buscar estado/i).fill("São");

    await page.getByRole("option", {
      name: /São Paulo/i
    }).click();

    await page.getByPlaceholder(/Buscar estado/i).clear();

    await page.getByPlaceholder(/Buscar estado/i).fill("Rio");

    await page.getByRole("option", {
      name: /Rio de Janeiro/i
    }).click();

    await expect(page.getByText("São Paulo")).toBeVisible();
    await expect(page.getByRole("option", { name: "Rio de Janeiro" })).toBeVisible();
    

    await expect(
      page.getByText(/2 selecionados/i)
    ).toBeVisible();
  });

  test("deve remover um estado", async ({ page }) => {

    await page
      .getByText(/Selecione um ou mais estados/i)
      .click();

    await page.getByPlaceholder(/Buscar estado/i).fill("São Paulo");

    await page.getByRole("option", { name: /São Paulo/i }).click();
    
    await page.getByLabel("Remover São Paulo").click();

    await page.getByRole("option", {name: /São Paulo/i}).click();
  });

  test("deve limpar toda a seleção", async ({ page }) => {

    await page
      .getByText(/Selecione um ou mais estados/i)
      .click();

    await page.getByPlaceholder(/Buscar estado/i).fill("São");

    await page.getByRole("option", {
      name: /São Paulo/i
    }).click();

    await page.getByPlaceholder(/Buscar estado/i).clear();

    await page.getByPlaceholder(/Buscar estado/i).fill("Minas");

    await page.getByRole("option", {
      name: /Minas Gerais/i
    }).click();

    await expect(
      page.getByText(/2 selecionados/i)
    ).toBeVisible();

    await page.getByRole("button", {
      name: /Limpar seleção/i
    }).click();

    await expect(
      page.getByText(/0 selecionados/i)
    ).toBeVisible();
  });

  test("deve mostrar mensagem quando nenhum estado for encontrado", async ({ page }) => {

    await page
      .getByText(/Selecione um ou mais estados/i)
      .click();

    await page
      .getByPlaceholder(/Buscar estado/i)
      .fill("XXXXXXXX");

    await expect(
      page.getByText(/Nenhum estado encontrado/i)
    ).toBeVisible();
  });

  test("deve selecionar usando teclado", async ({ page }) => {

    await page
      .getByText(/Selecione um ou mais estados/i)
      .click();

    const input = page.getByPlaceholder(/Buscar estado/i);

    await input.fill("São");

    await input.press("ArrowDown");
    await input.press("Enter");

    await expect(
      page.getByRole("option", { name: "São Paulo" })
    ).toBeVisible();
  });

  test("deve fechar ao pressionar Escape", async ({ page }) => {

    await page
      .getByText(/Selecione um ou mais estados/i)
      .click();

    const input = page.getByPlaceholder(/Buscar estado/i);

    await expect(input).toBeVisible();

    await input.press("Escape");

    await expect(input).not.toBeVisible();
  });

});