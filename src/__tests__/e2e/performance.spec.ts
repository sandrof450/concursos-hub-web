// src/__tests__/e2e/performance.spec.ts
import { test, expect } from "@playwright/test";

test.describe("Performance", () => {

  // ===========================
  // Tempo de carregamento
  // ===========================

  test("deve carregar a pagina inicial em menos de 3 segundos", async ({ page }) => {
    const inicio = Date.now();
    await page.goto("/");
    await page.waitForLoadState("networkidle");
    const tempo = Date.now() - inicio;
    expect(tempo).toBeLessThan(3000);
  });

  test("deve carregar os concursos em menos de 5 segundos", async ({ page }) => {
    await page.goto("/");
    const inicio = Date.now();
    await page.waitForSelector(".tag-fonte", { timeout: 5000 });
    const tempo = Date.now() - inicio;
    expect(tempo).toBeLessThan(5000);
  });

  test("deve exibir o skeleton antes dos dados carregarem", async ({ page }) => {
    let skeletonVisto = false;

    await page.route("**/api/Concurso**", async route => {
      await new Promise(resolve => setTimeout(resolve, 800));
      await route.continue();
    });

    await page.goto("/");

    // verifica skeleton antes dos dados
    const skeleton = page.locator(".animate-pulse").first();
    if (await skeleton.isVisible()) {
      skeletonVisto = true;
    }

    await page.waitForLoadState("networkidle");
    expect(skeletonVisto).toBe(true);
  });

  // ===========================
  // Requisições HTTP
  // ===========================

  test("deve fazer requisicao para API ao carregar", async ({ page }) => {
    let requisicaoFeita = false;

    page.on("request", req => {
      if (req.url().includes("/api/Concurso")) {
        requisicaoFeita = true;
      }
    });

    await page.goto("/");
    await page.waitForLoadState("networkidle");
    expect(requisicaoFeita).toBe(true);
  });

  test("deve receber status 200 da API", async ({ page }) => {
    let statusCode = 0;

    page.on("response", res => {
      if (res.url().includes("/api/Concurso") && !res.url().includes("estados") && !res.url().includes("Estatisticas")) {
        statusCode = res.status();
      }
    });

    await page.goto("/");
    await page.waitForLoadState("networkidle");
    expect(statusCode).toBe(200);
  });

  test("deve fazer requisicao para estatisticas", async ({ page }) => {
    let requisicaoFeita = false;

    page.on("request", req => {
      if (req.url().includes("/api/Concurso/Estatisticas")) {
        requisicaoFeita = true;
      }
    });

    await page.goto("/");
    await page.waitForLoadState("networkidle");
    expect(requisicaoFeita).toBe(true);
  });

  test("deve fazer requisicao para estados disponiveis", async ({ page }) => {
    let requisicaoFeita = false;

    page.on("request", req => {
      if (req.url().includes("/api/concurso/estados")) {
        requisicaoFeita = true;
      }
    });

    await page.goto("/");
    await page.waitForLoadState("networkidle");
    expect(requisicaoFeita).toBe(true);
  });

  test("deve fazer requisicao para fontes disponiveis", async ({ page }) => {
    let requisicaoFeita = false;

    page.on("request", req => {
      if (req.url().includes("/api/Concurso/ConcursoFontes")) {
        requisicaoFeita = true;
      }
    });

    await page.goto("/");
    await page.waitForLoadState("networkidle");
    expect(requisicaoFeita).toBe(true);
  });

  test("nao deve fazer requisicoes desnecessarias ao carregar", async ({ page }) => {
    const requisicoes: string[] = [];

    page.on("request", req => {
      if (req.url().includes("/api/")) {
        requisicoes.push(req.url());
      }
    });

    await page.goto("/");
    await page.waitForLoadState("networkidle");

    // verifica que nao há requisições duplicadas
    const urlsUnicas = new Set(requisicoes);
    expect(requisicoes.length).toBe(urlsUnicas.size);
  });

  // ===========================
  // Cache e re-requisições
  // ===========================

  test("nao deve re-requisitar dados ao voltar para a pagina inicial", async ({ page }) => {
    let requisicoes = 0;

    page.on("request", req => {
      if (req.url().toLowerCase().includes("/api/Concurso/Estatisticas")) {
        requisicoes++;
      }
    });

    await page.goto("/");
    await page.waitForLoadState("networkidle");

    await page.getByRole("link", { name: "Concursos", exact: true }).click();
    await page.waitForLoadState("networkidle");

    await page.getByRole("link", { name: "Início", exact: true }).click();
    await page.waitForLoadState("networkidle");

    // aceita até 2 requisições — uma por rota única visitada
    expect(requisicoes).toBeLessThanOrEqual(2);
  });

  test("deve re-requisitar concursos ao mudar de pagina", async ({ page }) => {
    await page.goto("/");
    await page.waitForLoadState("networkidle");

    let requisicoes = 0;
    page.on("request", req => {
      if (req.url().includes("/api/concurso") &&
          !req.url().toLowerCase().includes("estados") &&
          !req.url().toLowerCase().includes("estatisticas") &&
          !req.url().toLowerCase().includes("fontes") &&
          !req.url().toLowerCase().includes("concursofontes")) {
        requisicoes++;
      }
    });

    await page.getByLabel("Próxima página").click();
    await page.waitForLoadState("networkidle");

    console.log("Total requisicoes:", requisicoes);
    expect(requisicoes).toBeGreaterThan(0);
  });

  // ===========================
  // Erros de rede
  // ===========================

  test("deve exibir erro quando API estiver indisponivel", async ({ page }) => {
    await page.route("**/api/concurso**", route => {
      console.log("Interceptou:", route.request().url());
      route.abort()
    });

    await page.goto("/");
    await page.waitForLoadState("networkidle");
    
    await expect(page.locator("p",{ hasText: "Network error" })).toBeVisible();
    
  });

  test("deve exibir pagina mesmo com erro na API de estatisticas", async ({ page }) => {
    await page.route("**/api/Concurso/Estatisticas**", route => route.abort());

    await page.goto("/");
    await page.waitForLoadState("networkidle");

    // a página deve continuar carregando mesmo sem as estatísticas
    await expect(
      page.getByText(/encontre oportunidades/i)
    ).toBeVisible();
  });

  // ===========================
  // Responsividade de performance
  // ===========================

  test("deve carregar rapidamente em mobile", async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 });
    const inicio = Date.now();
    await page.goto("/");
    await page.waitForLoadState("networkidle");
    const tempo = Date.now() - inicio;
    expect(tempo).toBeLessThan(5000);
  });

  test("deve carregar rapidamente em desktop", async ({ page }) => {
    await page.setViewportSize({ width: 1280, height: 800 });
    const inicio = Date.now();
    await page.goto("/");
    await page.waitForLoadState("networkidle");
    const tempo = Date.now() - inicio;
    expect(tempo).toBeLessThan(3000);
  });

  // ===========================
  // Sem erros no console
  // ===========================

  test("nao deve ter erros de JavaScript no console", async ({ page }) => {
    const erros: string[] = [];
    page.on("pageerror", e => erros.push(e.message));

    await page.goto("/");
    await page.waitForLoadState("networkidle");

    expect(erros).toHaveLength(0);
  });

  test("nao deve ter erros de rede no console", async ({ page }) => {
    const errosRede: string[] = [];

    page.on("response", res => {
      if (res.status() >= 400 && res.url().includes("/api/")) {
        errosRede.push(`${res.status()} - ${res.url()}`);
      }
    });

    await page.goto("/");
    await page.waitForLoadState("networkidle");

    expect(errosRede).toHaveLength(0);
  });
});