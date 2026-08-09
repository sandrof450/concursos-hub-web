// src/__tests__/unit/utils/buildFilterTags.ts
export type FilterState = {
  titulo: string;
  orgao: string;
  area: string;
  fonte: string;
  estados: string[];
};

export type FilterTag = {
  label: string;
  value: string;
  clear: () => void;
};

export function buildFilterTags(
  state: FilterState,
  setters: {
    setTitulo: (v: string) => void;
    setOrgao: (v: string) => void;
    setArea: (v: string) => void;
    setFonte: (v: string) => void;
    setEstados: (v: string[]) => void;
  }
): FilterTag[] {
  return [
    { label: "Título", value: state.titulo, clear: () => setters.setTitulo("") },
    { label: "Órgão", value: state.orgao, clear: () => setters.setOrgao("") },
    { label: "Área", value: state.area, clear: () => setters.setArea("") },
    { label: "Fonte", value: state.fonte, clear: () => setters.setFonte("") },
    {
      label: "Estados",
      value: state.estados.length > 0 ? state.estados.join(", ") : "",
      clear: () => setters.setEstados([]),
    },
  ].filter(t => t.value);
}

