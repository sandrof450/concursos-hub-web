// src/__tests__/unit/utils/getStatus.test.ts
import { describe, it, expect } from "vitest";
import { getStatus } from "../../../utils/getStatus";

describe("getStatus", () => {

  it("deve retornar null quando status for vazio", () => {
    expect(getStatus("")).toBeNull();
  });

  it("deve retornar null quando status for nulo", () => {
    expect(getStatus(null as any)).toBeNull();
  });

  it("deve retornar Aberto quando status contiver aberto", () => {
    expect(getStatus("aberto")).toBe("Aberto");
    expect(getStatus("Aberto")).toBe("Aberto");
    expect(getStatus("ABERTO")).toBe("Aberto");
  });

  it("deve retornar Previsto quando status contiver previsto", () => {
    expect(getStatus("previsto")).toBe("Previsto");
    expect(getStatus("Previsto")).toBe("Previsto");
  });

  it("deve retornar Encerrado quando status contiver encerrado", () => {
    expect(getStatus("encerrado")).toBe("Encerrado");
    expect(getStatus("Encerrado")).toBe("Encerrado");
  });

  it("deve retornar null quando status nao for reconhecido", () => {
    expect(getStatus("qualquer coisa")).toBeNull();
    expect(getStatus("xyz")).toBeNull();
  });
});