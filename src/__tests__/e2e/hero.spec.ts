import { test, expect } from "@playwright/test";
import { selectors } from "./fixtures/selectors";

test.describe("Hero", () => {

    test.beforeEach(async ({ page }) => {

        await page.goto("/");

        await page.waitForLoadState("networkidle");

    });

    test("deve exibir titulo", async ({ page }) => {

        await expect(page.getByText(selectors.hero.titulo)).toBeVisible();

    });

    test("deve exibir quantidade de concursos", async ({ page }) => {

        await expect(page.getByText(selectors.hero.concursos)).toBeVisible();

    });

    test("deve exibir vagas", async ({ page }) => {

        await expect(page.getByText(selectors.hero.vagas)).toBeVisible();

    });

    test("deve exibir fontes", async ({ page }) => {

        await expect(page.getByText(selectors.hero.fontes)).toBeVisible();

    });

});