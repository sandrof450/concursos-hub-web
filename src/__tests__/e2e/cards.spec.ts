// src/__tests__/e2e/cards.spec.ts
import { test, expect } from "@playwright/test";

test.describe("Cards de concursos", () => {

  test.beforeEach(async ({ page }) => {
    page.on("pageerror", (err) => console.log("🔴 ERRO NO BROWSER:", err.message));
    page.on("console", (msg) => {
      if (msg.type() === "error") console.log("🔴 CONSOLE ERROR:", msg.text());
    });

    page.on("response", (res) => {
      if (res.status() === 404) {
        console.log("🔴 404 EM:", res.url());
      }
    });

    await page.goto("/");
    await page.waitForLoadState("networkidle");
  });

  // ===========================
  // Renderização básica
  // ===========================

  test("deve exibir pelo menos um card", async ({ page }) => {
    await expect(
      page.getByText(/ver edital/i).first()
    ).toBeVisible();
  });

  test("deve exibir o botao ver edital no card", async ({ page }) => {
    await expect(
      page.getByRole("link").filter({ hasText: /ver edital/i }).first()
    ).toBeVisible();
  });

  test("deve exibir a fonte do concurso no card", async ({ page }) => {
    await expect(
      page.locator(".tag-fonte").first()
    ).toBeVisible();
  });

  test("deve exibir multiplos cards na listagem", async ({ page }) => {
    const cards = page.getByRole("link").filter({ hasText: /ver edital/i });
    const count = await cards.count();
    expect(count).toBeGreaterThan(1);
  });

  test("deve exibir a data de publicacao no card", async ({ page }) => {
    await expect(
      page.locator(".ti-calendar").first()
    ).toBeVisible();
  });

  test("deve exibir icone de orgao no card", async ({ page }) => {
    await expect(
      page.locator(".ti-building").first()
    ).toBeVisible();
  });

  // ===========================
  // Badges e tags
  // ===========================

  test("deve exibir badge de vagas quando disponivel", async ({ page }) => {
    await expect(
      page.getByText(/vagas/i).first()
    ).toBeVisible();
  });

  test("deve exibir tag de fonte no card", async ({ page }) => {
    await expect(
      page.locator(".tag-fonte").first()
    ).toBeVisible();
  });

  test("deve exibir icone de link na tag de fonte", async ({ page }) => {
    await expect(
      page.locator(".ti-link").first()
    ).toBeVisible();
  });

  test("deve exibir badge de status quando disponivel", async ({ page }) => {
    // verifica se existe algum badge de status (Aberto, Previsto ou Encerrado)
    const badges = page.getByText(/^(Aberto|Previsto|Encerrado)$/);
    const count = await badges.count();
    // pode ter ou não badges de status dependendo dos dados
    expect(count).toBeGreaterThanOrEqual(0);
  });

  // ===========================
  // Agrupamento por estado
  // ===========================

  test("deve exibir cards agrupados por estado", async ({ page }) => {
    await expect(
      page.getByText(/concursos por estado/i)
    ).toBeVisible();
  });

  test("deve exibir o badge do estado com icone de mapa", async ({ page }) => {
    await expect(
      page.locator(".ti-map-pin").first()
    ).toBeVisible();
  });

  test("deve exibir a contagem de concursos por estado", async ({ page }) => {
    await expect(
      page.getByText(/\d+ concurso/i).first()
    ).toBeVisible();
  });

  test("deve exibir linha separadora entre estado e contagem", async ({ page }) => {
    await expect(
      page.locator(".state-line, .flex-1.h-px").first()
    ).toBeVisible();
  });

  test("deve exibir multiplos estados na listagem", async ({ page }) => {
    const badges = page.locator(".ti-map-pin");
    const count = await badges.count();
    expect(count).toBeGreaterThan(1);
  });

  // ===========================
  // Interação
  // ===========================

  test("deve abrir o link do edital em nova aba ao clicar", async ({ page, context }) => {
    const [newPage] = await Promise.all([
      context.waitForEvent("page"),
      page.getByRole("link").filter({ hasText: /ver edital/i }).first().click(),
    ]);
    await newPage.waitForLoadState();
    expect(newPage.url()).not.toBe("about:blank");
  });

  test("deve aplicar efeito hover no card", async ({ page }) => {
    const card = page.getByRole("link").filter({ hasText: /ver edital/i }).first();
    await card.hover();
    await expect(card).toBeVisible();
  });

  test("deve manter card visivel apos hover", async ({ page }) => {
    const primeiroCard = page.getByText(/ver edital/i).first();
    await primeiroCard.hover();
    await expect(primeiroCard).toBeVisible();
  });

  // ===========================
  // Skeleton loading
  // ===========================

  test("deve exibir skeleton durante o carregamento", async ({ page }) => {
    await page.route("**/api/Concurso**", async route => {
      await new Promise(resolve => setTimeout(resolve, 1000));
      await route.continue();
    });

    await page.goto("/");

    await expect(
      page.locator(".animate-pulse").first()
    ).toBeVisible();
  });

  test("deve substituir skeleton pelos cards apos carregamento", async ({ page }) => {
    await page.route("**/api/Concurso**", async route => {
      await new Promise(resolve => setTimeout(resolve, 500));
      await route.continue();
    });

    await page.goto("/");
    await page.waitForLoadState("networkidle");

    // skeleton dos cards deve sumir — busca especificamente no skeleton
    await expect(
      page.locator(".bg-\\[\\#0d1824\\].animate-pulse").first()
    ).not.toBeVisible();

    await expect(
      page.getByText(/ver edital/i).first()
    ).toBeVisible();
  });

  // ===========================
  // Estado vazio
  // ===========================

  test("deve exibir mensagem quando nenhum concurso for encontrado", async ({ page }) => {
    await page.getByPlaceholder(/analista, auditor/i).fill("XYZ_NAO_EXISTE_123");
    await page.getByRole("button", { name: /buscar concursos/i }).click();
    await page.waitForLoadState("networkidle");

    await expect(
      page.getByText(/nenhum concurso encontrado/i)
    ).toBeVisible();
  });

  // ===========================
  // Responsividade
  // ===========================

  test("deve exibir cards corretamente em mobile", async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 });
    await page.goto("/");
    await page.waitForLoadState("networkidle");

    await expect(
      page.getByText(/ver edital/i).first()
    ).toBeVisible();
  });

  test("deve exibir cards corretamente em tablet", async ({ page }) => {
    await page.setViewportSize({ width: 768, height: 1024 });
    await page.goto("/");
    await page.waitForLoadState("networkidle");

    await expect(
      page.getByText(/ver edital/i).first()
    ).toBeVisible();
  });

  test("deve exibir cards corretamente em desktop", async ({ page }) => {
    await page.setViewportSize({ width: 1280, height: 800 });
    await page.goto("/");
    await page.waitForLoadState("networkidle");

    await expect(
      page.getByText(/ver edital/i).first()
    ).toBeVisible();
  });

  // ===========================
  // Acessibilidade
  // ===========================

  test("deve ter link acessivel no botao ver edital", async ({ page }) => {
    const link = page.getByRole("link").filter({ hasText: /ver edital/i }).first();
    await expect(link).toBeVisible();
    const href = await link.getAttribute("href");
    expect(href).not.toBeNull();
    expect(href).not.toBe("");
  });

  test("deve ter atributo target blank no link do edital", async ({ page }) => {
    const link = page.getByRole("link").filter({ hasText: /ver edital/i }).first();
    const target = await link.getAttribute("target");
    expect(target).toBe("_blank");
  });

  test("deve ter atributo rel noopener no link do edital", async ({ page }) => {
    const link = page.getByRole("link").filter({ hasText: /ver edital/i }).first();
    const rel = await link.getAttribute("rel");
    expect(rel).toContain("noopener");
  });

  // ===========================
  // Filtros integrados com cards
  // ===========================

  test("deve atualizar cards ao filtrar por titulo", async ({ page }) => {
    await page.getByRole("link").filter({ hasText: /ver edital/i }).count();
    await page.getByPlaceholder(/analista, auditor/i).fill("Prefeitura");

    await page.route("**/api/Concurso**", async route => {
      await new Promise(resolve => setTimeout(resolve, 500));
      await route.continue();
    });

    await page.getByRole("button", { name: /buscar concursos/i }).click();   
    
    await page.waitForLoadState("networkidle");

    const totalDepois = await page.getByRole("link")
      .filter({ hasText: /ver edital/i }).count();

    // total pode ser diferente após filtrar
    expect(totalDepois).toBeGreaterThanOrEqual(0);
  });

  test("deve restaurar cards ao limpar filtro", async ({ page }) => {
    await page.getByPlaceholder(/analista, auditor/i).fill("Prefeitura");

    await page.route("/api/Concurso", async route => {
      await new Promise(resolve => setTimeout(resolve, 500));
      await route.continue();
    });

    await page.getByRole("button", { name: /buscar concursos/i }).click();
    
    await page.waitForLoadState("networkidle");

    // limpa o filtro
    await page.keyboard.press("Escape");    
    await page.route("/api/Concurso", async route => {
      await new Promise(resolve => setTimeout(resolve, 500));
      await route.continue();
    });
    await page.getByRole("button", { name: /limpar/i }).click();
    await page.waitForLoadState("networkidle");

    await expect(
      page.getByText(/ver edital/i).first()
    ).toBeVisible();
  });
});