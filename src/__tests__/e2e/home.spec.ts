import { test, expect } from "@playwright/test";

test.describe("Página inicial", () => {

    test.beforeEach(async ({ page }) => {

        await page.goto("/");

        await page.waitForLoadState("networkidle");

    });

    test("deve carregar a aplicação", async ({ page }) => {

        await expect(page).toHaveTitle(/Concursos/i);

    });

    test("não deve possuir erros javascript", async ({ page }) => {

        const errors: string[] = [];

        page.on("pageerror", e => errors.push(e.message));

        await page.reload();

        expect(errors).toEqual([]);

    });

});