import { test, expect } from "@playwright/test";

test.describe("Filtros de concursos", () => {

  test.beforeEach(async ({ page }) => {
    await page.goto("/");
  });

  // ===========================
  // Renderização
  // ===========================

  test("deve exibir o campo de titulo", async ({ page }) => {
    await expect(page.getByPlaceholder(/analista, auditor/i)).toBeVisible();
  });

  test("deve exibir o campo de orgao", async ({ page }) => {
    await expect(page.getByPlaceholder(/INSS, Receita/i)).toBeVisible();
  });

  test("deve exibir o campo de area", async ({ page }) => {
    await expect(page.getByPlaceholder(/tecnologia, direito/i)).toBeVisible();
  });

  test("deve exibir o dropdown de fonte", async ({ page }) => {
    await expect(page.getByText(/todas as fontes/i)).toBeVisible();
  });

  test("deve exibir o campo de estado", async ({ page }) => {
    await expect(page.getByText(/selecione um ou mais estados/i)).toBeVisible();
  });

  test("deve exibir o botão de buscar", async ({ page }) => {
    await expect(
      page.getByRole("button", { name: /buscar concursos/i })
    ).toBeVisible();
  });

  // ===========================
  // Busca
  // ===========================

  test("deve buscar concursos sem informar filtros", async ({ page }) => {

    const resposta = page.waitForResponse(r =>
      /\/api\/concurso/i.test(r.url())&&
      r.status() === 200
    );

    await page.getByRole("button", {
      name: /buscar concursos/i
    }).click();

    await resposta;

    await expect(
      page.getByText(/concursos por estado/i)
    ).toBeVisible();
  });

  test("deve filtrar concursos por titulo", async ({ page }) => {

    await page
      .getByPlaceholder(/analista, auditor/i)
      .fill("Prefeitura");

    const resposta = page.waitForResponse(r =>
      /\/api\/concurso/i.test(r.url()) &&
      r.status() === 200
    );
    
    await page.getByRole("button", {
      name: /buscar concursos/i
    }).click();

    await resposta;

    await expect(
      page.getByRole("link", { name: /ver edital/i }).first()
    ).toBeVisible();
  });

  test("deve filtrar concursos por órgão", async ({ page }) => {

    await page
      .getByPlaceholder(/INSS, Receita/i)
      .fill("IBGE");

    const resposta = page.waitForResponse(r =>
      /\/api\/concurso/i.test(r.url()) &&
      r.status() === 200
    );

    await page.getByRole("button", {
      name: /buscar concursos/i
    }).click();

    await resposta;

    // Aceita os dois cenários: existe resultado OU aparece mensagem de vazio
    const temResultado = await page
      .getByRole("link", { name: /ver edital/i })
      .first()
      .isVisible()
      .catch(() => false);

    const semResultado = await page
      .getByText(/nenhum concurso encontrado/i)
      .isVisible()
      .catch(() => false);

    expect(temResultado || semResultado).toBeTruthy();
  });

  test("deve filtrar concursos por área", async ({ page }) => {

    await page
      .getByPlaceholder(/tecnologia, direito/i)
      .fill("Tecnologia");

    const resposta = page.waitForResponse(r =>
      /\/api\/concurso/i.test(r.url()) &&
      r.status() === 200
    );

    await page.getByRole("button", {
      name: /buscar concursos/i
    }).click();

    await resposta;

  });

  test("deve filtrar concursos por fonte", async ({ page }) => {
    const respostaConcursoFontes = page.waitForResponse(r =>
      /\/api\/concurso\/concursofontes/i.test(r.url()) &&
      r.status() === 200
    );

    const respostaConcurso = page.waitForResponse(r =>
      /\/api\/concurso/i.test(r.url()) &&
      !/\/api\/concurso\/concursofontes/i.test(r.url()) &&
      r.status() === 200
    );

    await page.getByText(/todas as fontes/i).click();
    await page.getByRole("main").getByText("PCI Concursos", { exact: true }).click();

    await page.getByRole("button", {
      name: /buscar concursos/i
    }).click();

    await respostaConcursoFontes;
    await respostaConcurso;

    const temResultado = await page
      .getByRole("link", { name: /ver edital/i })
      .first()
      .isVisible()
      .catch(() => false);

    const semResultado = await page
      .getByText(/nenhum concurso encontrado/i)
      .isVisible()
      .catch(() => false);

    expect(temResultado || semResultado).toBeTruthy();
  });

  // ===========================
  // Limpeza
  // ===========================

  test("deve limpar os filtros", async ({ page }) => {

    await page
      .getByPlaceholder(/analista, auditor/i)
      .fill("Teste");

    await page.getByRole("button", {
      name: /limpar/i
    }).click();

    await expect(
      page.getByPlaceholder(/analista, auditor/i)
    ).toHaveValue("");
  });

  test("deve limpar todos os filtros", async ({ page }) => {

    // título
    await page.getByPlaceholder(/analista, auditor/i).fill("Analista");

    // órgão
    await page.getByPlaceholder(/INSS, Receita/i).fill("INSS");

    // área
    await page.getByPlaceholder(/tecnologia, direito/i).fill("TI");

    // fonte
    await page.getByText(/todas as fontes/i).click();
    await page.getByRole("main").getByText("PCI Concursos", { exact: true }).click();

    // estado
    await page.getByText(/Selecione um ou mais estados/i).click();
    await page.getByPlaceholder(/Buscar estado/i).fill("São");
    await page.getByRole("option", { name: /São Paulo/i }).click();

    // limpar
    await page.mouse.click(0, 0);

    await page.getByRole("button", {
      name: /limpar/i
    }).click();

    // título
    await expect(
      page.getByPlaceholder(/analista, auditor/i)
    ).toHaveValue("");

    // órgão
    await expect(
      page.getByPlaceholder(/INSS, Receita/i)
    ).toHaveValue("");

    // área
    await expect(
      page.getByPlaceholder(/tecnologia, direito/i)
    ).toHaveValue("");

    // fonte
    await expect(
      page.getByText(/Todas as fontes/i)
    ).toBeVisible();

    // estado
    await expect(
      page.getByText(/Selecione um ou mais estados/i)
    ).toBeVisible();
  });

  test("deve permitir buscar novamente após limpar os filtros", async ({ page }) => {
    // preenche um filtro
    await page.getByPlaceholder(/analista, auditor/i).fill("Analista");

    const respostaConcurso = page.waitForResponse(r =>
      /\/api\/concurso/i.test(r.url()) && r.status() === 200
    );
    await page.getByRole("button", { name: /buscar concursos/i }).click();
    await respostaConcurso;

    // limpa
    await page.getByRole("button", { name: /limpar/i }).click();
    await expect(page.getByPlaceholder(/analista, auditor/i)).toHaveValue("");

    // busca novamente — pode vir do cache, então não esperamos rede,
    // esperamos o resultado final na tela
    await page.getByRole("button", { name: /buscar concursos/i }).click();

    await expect(
      page.getByRole("link", { name: /ver edital/i }).first()
    ).toBeVisible();
});

  test("deve permitir buscar mesmo com espaços extras no título", async ({ page }) => {
    await page
      .getByPlaceholder(/analista, auditor/i)
      .fill("     IBGE     ");

    const respostaConcurso = page.waitForResponse(response =>
      /\/api\/concurso/i.test(response.url()) &&
      response.status() === 200
    );

    await page.getByRole("button", {
      name: /buscar concursos/i,
    }).click();

    await respostaConcurso;

    const temAgrupamentoPorEstado = await page
      .getByText(/concursos por estado/i)
      .first()
      .isVisible()
      .catch(() => false);

    const semResultado = await page
      .getByText(/nenhum concurso encontrado/i)
      .isVisible()
      .catch(() => false);

    expect(temAgrupamentoPorEstado || semResultado).toBeTruthy();
  });

});