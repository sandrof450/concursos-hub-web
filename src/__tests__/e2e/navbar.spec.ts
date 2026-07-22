import { test, expect } from "@playwright/test";

test.describe("Navbar", () => {

    test.beforeEach(async ({ page }) => {

        await page.goto("/");

    });

    test("deve exibir logo", async ({ page }) => {

        await expect(
            page.getByRole("link", { name: /ConcursosHub/i })
        ).toBeVisible();

    });

});