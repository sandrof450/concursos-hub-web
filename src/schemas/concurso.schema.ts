// src/schemas/concurso.schema.ts
import { z } from "zod";

export const ConcursoSchema = z.object({
  concursoId: z.string(),
  titulo: z.string(),
  estado: z.string().nullable().default(""),
  cidade: z.string().nullable().default(""),
  orgao: z.string().nullable().default(""),
  area: z.string().nullable().default(""),
  vagas: z.string().nullable().default("0"),
  nivel: z.string().nullable(),
  salario: z.number().nullable(),
  status: z.string().nullable().default(""),
  dataPublicacao: z.string(),
  link: z.string(),
  fonte: z.string().nullable().default(""),
  extras: z.record(z.string(), z.unknown()).optional(),
});

export const PaginacaoSchema = <T extends z.ZodTypeAny>(itemSchema: T) =>
  z.object({
    data: z.array(itemSchema),
    pageNumber: z.number(),
    pageSize: z.number(),
    totalCount: z.number(),
    totalPages: z.number(),
  });

export const FonteSchema = z.object({
  fonteNome: z.string(),
});

export const EstatisticasSchema = z.object({
  totalDeConcursos: z.number(),
  totalDeVagas: z.number(),
  totalDeFontes: z.number(),
});

// tipos inferidos do schema — substitui as interfaces manuais
export type Concurso = z.infer<typeof ConcursoSchema>;
export type Fonte = z.infer<typeof FonteSchema>;
export type Estatisticas = z.infer<typeof EstatisticasSchema>;