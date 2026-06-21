// src/constants/index.ts
export const PAGE_SIZE = 10;
export const STALE_TIME = 1000 * 60 * 5; // 5 minutos
export const TOAST_DURATION = 3000;       // 3 segundos

export const STATUS_LABELS = {
  Aberto:    "Aberto",
  Previsto:  "Previsto",
  Encerrado: "Encerrado",
} as const;

export const ROUTES = {
  home:      "/",
  concursos: "/concursos",
} as const;