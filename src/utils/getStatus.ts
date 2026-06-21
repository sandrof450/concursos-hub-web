// src/utils/getStatus.ts
export type StatusConcurso = "Aberto" | "Previsto" | "Encerrado" | null;

export const getStatus = (status: string): StatusConcurso => {
  if (!status?.trim()) return null;
  const s = status.toLowerCase();
  if (s.includes("aberto")) return "Aberto";
  if (s.includes("previsto")) return "Previsto";
  if (s.includes("encerrado")) return "Encerrado";
  return null;
};