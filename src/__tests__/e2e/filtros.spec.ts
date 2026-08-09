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
  const respostaConcurso = page.waitForResponse(r =>
    /\/api\/concurso(?!\/concursofontes)/i.test(r.url()) &&
    r.status() === 200
  );

  await page.getByText(/todas as fontes/i).click();
    await page.getByRole("main").getByText("PCI Concursos", { exact: true }).click();

    await page.getByRole("button", { name: /buscar concursos/i }).click();

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

test.describe("Filtros de busca — tags", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/");
  });

  test("nenhuma tag de filtro aparece com os filtros vazios", async ({ page }) => {
    await expect(page.getByRole("button", { name: /^Remover /i })).toHaveCount(0);
  });

  test("tag Título aparece com o valor digitado e some ao limpar", async ({ page }) => {
    await page.getByPlaceholder("Ex: Analista, Auditor...").fill("Analista");

    const removerBtn = page.getByRole("button", { name: "Remover Título" });
    await expect(removerBtn).toBeVisible();
    await expect(removerBtn.locator("xpath=..")).toContainText(/Título:\s*Analista/);

    await removerBtn.click();
    await expect(removerBtn).not.toBeVisible();
    await expect(page.getByPlaceholder("Ex: Analista, Auditor...")).toHaveValue("");
  });

  test("tag Órgão aparece com o valor digitado e some ao limpar", async ({ page }) => {
    await page.getByPlaceholder("Ex: INSS, Receita...").fill("INSS");

    const removerBtn = page.getByRole("button", { name: "Remover Órgão" });
    await expect(removerBtn.locator("xpath=..")).toContainText(/Órgão:\s*INSS/);

    await removerBtn.click();
    await expect(removerBtn).not.toBeVisible();
  });

  test("tag Área aparece com o valor digitado e some ao limpar", async ({ page }) => {
    await page.getByPlaceholder("Ex: Tecnologia, Direito...").fill("Tecnologia");

    const removerBtn = page.getByRole("button", { name: "Remover Área" });
    await expect(removerBtn.locator("xpath=..")).toContainText(/Área:\s*Tecnologia/);

    await removerBtn.click();
    await expect(removerBtn).not.toBeVisible();
  });

  test("tag Fonte aparece ao selecionar e some ao limpar", async ({ page }) => {
    await page.getByText("Todas as fontes").click();
    await page.locator(".cursor-pointer", { hasText: "PCI Concursos" }).click();

    const removerBtn = page.getByRole("button", { name: "Remover Fonte" });
    await expect(removerBtn.locator("xpath=..")).toContainText(/Fonte:\s*PCI Concursos/);

    await removerBtn.click();
    await expect(removerBtn).not.toBeVisible();
  });

  test("tag Estados NÃO aparece com o array vazio (regressão do bug original)", async ({ page }) => {
    await expect(page.getByRole("button", { name: "Remover Estados" })).not.toBeVisible();
  });

  test("tag Estados aparece formatada com um único estado", async ({ page }) => {
    await page.getByTestId("estado-trigger").click();
    await page.getByRole("option", { name: /Santa Catarina/ }).click();

    const removerBtn = page.getByRole("button", { name: "Remover Estados" });
    await expect(removerBtn.locator("xpath=..")).toContainText(/Estados:\s*SC/);
  });

  test("tag Estados formata múltiplos estados com vírgula e espaço (regressão do bug 'grudado')", async ({ page }) => {
    await page.getByTestId("estado-trigger").click();
    await page.getByRole("option", { name: /Santa Catarina/ }).click();
    await page.getByRole("option", { name: /^São Paulo/ }).click();

    const removerBtn = page.getByRole("button", { name: "Remover Estados" });
    await expect(removerBtn.locator("xpath=..")).toContainText(/Estados:\s*SC,\s*SP/);
  });

  test("remover um estado individualmente pela tag interna do trigger", async ({ page }) => {
    await page.getByTestId("estado-trigger").click();
    await page.getByRole("option", { name: /Santa Catarina/ }).click();

    await expect(page.getByRole("button", { name: "Remover Santa Catarina" })).toBeVisible();
    await page.getByRole("button", { name: "Remover Santa Catarina" }).click();

    await expect(page.getByRole("button", { name: "Remover Estados" })).not.toBeVisible();
  });

  test("limpar a tag Estados (filtro geral) remove a seleção inteira", async ({ page }) => {
    await page.getByTestId("estado-trigger").click();
    await page.getByRole("option", { name: /Santa Catarina/ }).click();

    const removerBtn = page.getByRole("button", { name: "Remover Estados" });
    await removerBtn.click();

    await expect(removerBtn).not.toBeVisible();
    await page.getByTestId("estado-trigger").click();
    await expect(page.getByRole("option", { name: /Santa Catarina/ })).toHaveAttribute("aria-selected", "false");
  });

  test("botão 'Limpar seleção' dentro do dropdown limpa os estados", async ({ page }) => {
    await page.getByTestId("estado-trigger").click();
    await page.getByRole("option", { name: /Santa Catarina/ }).click();

    await page.getByRole("button", { name: "Limpar seleção" }).click();

    await expect(page.getByRole("button", { name: "Remover Estados" })).not.toBeVisible();
  });

  test("busca interna filtra a lista de estados", async ({ page }) => {
    await page.getByTestId("estado-trigger").click();
    await page.getByPlaceholder("Buscar estado...").fill("catarina");

    await expect(page.getByRole("option", { name: /Santa Catarina/ })).toBeVisible();
    await expect(page.getByRole("option", { name: /^São Paulo/ })).not.toBeVisible();
  });

  test("múltiplos filtros preenchidos ao mesmo tempo mostram todas as tags correspondentes", async ({ page }) => {
    await page.getByPlaceholder("Ex: Analista, Auditor...").fill("Analista");
    await page.getByPlaceholder("Ex: INSS, Receita...").fill("INSS");
    await page.getByTestId("estado-trigger").click();
    await page.getByRole("option", { name: /Santa Catarina/ }).click();

    await expect(page.getByRole("button", { name: "Remover Título" })).toBeVisible();
    await expect(page.getByRole("button", { name: "Remover Órgão" })).toBeVisible();
    await expect(page.getByRole("button", { name: "Remover Estados" })).toBeVisible();
    await expect(page.getByRole("button", { name: "Remover Área" })).not.toBeVisible();
    await expect(page.getByRole("button", { name: "Remover Fonte" })).not.toBeVisible();
  });
});