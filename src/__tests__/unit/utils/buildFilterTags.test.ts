// src/__tests__/unit/utils/buildFilterTags.test.ts
import { describe, it, expect, vi } from "vitest";
import { buildFilterTags } from "./buildFilterTags";
console.log("DEBUG:", typeof buildFilterTags, buildFilterTags);

const noopSetters = () => ({
  setTitulo: vi.fn(),
  setOrgao: vi.fn(),
  setArea: vi.fn(),
  setFonte: vi.fn(),
  setEstados: vi.fn(),
});

describe("buildFilterTags", () => {
  it("não inclui a tag Estados quando o array está vazio", () => {
    const tags = buildFilterTags(
      { titulo: "", orgao: "", area: "", fonte: "", estados: [] },
      noopSetters()
    );
    expect(tags.find(t => t.label === "Estados")).toBeUndefined();
  });

  it("formata múltiplos estados separados por vírgula e espaço", () => {
    const tags = buildFilterTags(
      { titulo: "", orgao: "", area: "", fonte: "", estados: ["SC", "SP"] },
      noopSetters()
    );
    const estadosTag = tags.find(t => t.label === "Estados");
    expect(estadosTag?.value).toBe("SC, SP");
  });

  it("inclui a tag Estados quando há apenas um estado selecionado", () => {
    const tags = buildFilterTags(
      { titulo: "", orgao: "", area: "", fonte: "", estados: ["SC"] },
      noopSetters()
    );
    expect(tags.find(t => t.label === "Estados")?.value).toBe("SC");
  });

  it("chama setEstados([]) ao limpar a tag Estados", () => {
    const setters = noopSetters();
    const tags = buildFilterTags(
      { titulo: "", orgao: "", area: "", fonte: "", estados: ["SC", "SP"] },
      setters
    );
    tags.find(t => t.label === "Estados")?.clear();
    expect(setters.setEstados).toHaveBeenCalledWith([]);
  });

  it("não quebra outras tags string quando estados é o único preenchido", () => {
    const tags = buildFilterTags(
      { titulo: "", orgao: "", area: "", fonte: "", estados: ["SC"] },
      noopSetters()
    );
    expect(tags).toHaveLength(1);
  });
});