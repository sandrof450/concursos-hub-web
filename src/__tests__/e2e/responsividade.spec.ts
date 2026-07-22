import { test, expect } from "@playwright/test";

const DEVICES = [
  {
    name: "Mobile",
    width: 375,
    height: 667,
  },
  {
    name: "Tablet",
    width: 768,
    height: 1024,
  },
  {
    name: "Desktop",
    width: 1366,
    height: 768,
  },
  {
    name: "FullHD",
    width: 1920,
    height: 1080,
  },
];

for (const device of DEVICES) {
  test.describe(`Responsividade - ${device.name}`, () => {

    test.beforeEach(async ({ page }) => {
      await page.setViewportSize({
        width: device.width,
        height: device.height,
      });

      await page.goto("/");
      await page.waitForLoadState("networkidle");
    });

    test("deve carregar a página", async ({ page }) => {
      await expect(page.locator("body")).toBeVisible();
    });

    test("navbar deve permanecer visível", async ({ page }) => {
      await expect(page.locator("nav")).toBeVisible();
    });

    test("hero deve permanecer visível", async ({ page }) => {
      await expect(page.getByText(/Encontre/i)).toBeVisible();
    });

    test("filtros devem permanecer visíveis", async ({ page }) => {

      await expect(page.locator("label", { hasText: /Título/i })).toBeVisible();

      await expect(
        page.getByRole("button", { name: /buscar/i })
      ).toBeVisible();

      await expect(
        page.getByRole("button", { name: /limpar/i })
      ).toBeVisible();
    });

    test("lista de concursos deve permanecer visível", async ({ page }) => {
      await expect(page.getByText(/Concursos por estado/i)).toBeVisible();
    });

    test("footer deve permanecer visível", async ({ page }) => {

      await page.locator("footer").scrollIntoViewIfNeeded();

      await expect(page.locator("footer")).toBeVisible();
    });

    test("não deve possuir scroll horizontal", async ({ page }) => {

      const overflow = await page.evaluate(() => {
        return (
          document.documentElement.scrollWidth >
          document.documentElement.clientWidth
        );
      });

      expect(overflow).toBeFalsy();
    });

    test("botão buscar deve permanecer clicável", async ({ page }) => {

      await expect(
        page.getByRole("button", { name: /buscar/i })
      ).toBeEnabled();
    });

    test("botão limpar deve permanecer clicável", async ({ page }) => {

      await expect(
        page.getByRole("button", { name: /limpar/i })
      ).toBeEnabled();
    });

    test("paginação deve permanecer funcional", async ({ page }) => {

      const proximo = page
        .getByRole("button", { name: /próxima|proxima/i });

      if (await proximo.count()) {
        await expect(proximo).toBeVisible();
      }
    });
  });
}

test.describe("Resize da janela", () => {

  test("layout deve permanecer íntegro após redimensionar", async ({ page }) => {

    await page.goto("/");

    await page.setViewportSize({
      width: 1366,
      height: 768,
    });

    await page.setViewportSize({
      width: 768,
      height: 1024,
    });

    await page.setViewportSize({
      width: 375,
      height: 667,
    });

    const overflow = await page.evaluate(() => {
      return (
        document.documentElement.scrollWidth >
        document.documentElement.clientWidth
      );
    });

    expect(overflow).toBeFalsy();
  });

});

test.describe("Landscape", () => {

  test("layout deve permanecer íntegro em landscape", async ({ page }) => {

    await page.setViewportSize({
      width: 667,
      height: 375,
    });

    await page.goto("/");

    await page.waitForLoadState("networkidle");

    const overflow = await page.evaluate(() => {
      return (
        document.documentElement.scrollWidth >
        document.documentElement.clientWidth
      );
    });

    expect(overflow).toBeFalsy();
  });

  test("deve manter o layout ao alternar entre desktop e mobile", async ({ page }) => {

    await page.goto("/");

    await page.setViewportSize({
      width: 1366,
      height: 768,
    });

    await page.setViewportSize({
      width: 375,
      height: 667,
    });

    await expect(page.locator("nav")).toBeVisible();

    await expect(page.locator("footer")).toBeVisible();
  });

});