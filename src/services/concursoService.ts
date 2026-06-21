import api from './api';

import { ConcursoSchema, PaginacaoSchema } from "../schemas/concurso.schema";

import type { ConcursoFilterType} from '../types/concurso';

const ConcursoPaginadoSchema = PaginacaoSchema(ConcursoSchema);

const getAllConcursos = async () => {
  const { data } = await api.get('/Concurso/All');
  return ConcursoPaginadoSchema.parse(data);
};

const getConcursos = async (filter?: ConcursoFilterType) => {
  const { data } = await api.get('/concurso', { params: filter });
  return ConcursoPaginadoSchema.parse(data); // ← valida e lança erro se vier errado
};

export const executarJob = async (): Promise<void> => {
  await api.post("/Concurso");
};

export { getAllConcursos, getConcursos };