export type { Concurso } from "../schemas/concurso.schema";

export interface PaginacaoResponse<T> {
  data: T[];
  pageNumber: number;
  pageSize: number;
  totalCount: number;
  totalPages: number;
}

export interface ConcursoFilterType {
  pageNumber?: number;
  pageSize?: number;
  titulo?: string;
  orgao?: string;
  area?: string;
  fonte?: string;
  estado?: string;
}