// src/__tests__/unit/utils/cleanTitulo.test.ts
import { describe, it, expect } from "vitest";
import { cleanTitulo } from "../../../utils/cleanTitulo";

describe("cleanTitulo", () => {

  it("deve retornar string vazia quando titulo for vazio", () => {
    expect(cleanTitulo("")).toBe("");
  });

  it("deve remover informacoes de vagas do titulo", () => {
    expect(cleanTitulo("Prefeitura de SP 10 vagas ate R$ 5.000")).toBe("Prefeitura de SP");
  });

  it("deve remover salario do titulo", () => {
    expect(cleanTitulo("INSS R$ 3.000,00 analista")).toBe("INSS");
  });

  it("deve retornar apenas a primeira linha quando houver quebra", () => {
    expect(cleanTitulo("Titulo do Concurso\nInformacoes extras")).toBe("Titulo do Concurso");
  });

  it("deve remover espacos extras no inicio e fim", () => {
    expect(cleanTitulo("  Concurso INSS  ")).toBe("Concurso INSS");
  });
});