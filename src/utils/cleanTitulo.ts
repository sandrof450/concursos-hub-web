// src/utils/cleanTitulo.ts
export const cleanTitulo = (titulo: string): string => {
  if (!titulo) return "";
  // pega só o conteúdo antes de números de vagas ou valores
  return titulo
    .split(/\d+\s*vagas/i)[0]     // corta em "X vagas"
    .split(/R\$\s*[\d.,]+/i)[0]   // corta em "R$ X"
    .split(/\n/)[0]                // corta na primeira quebra de linha
    .trim();
};