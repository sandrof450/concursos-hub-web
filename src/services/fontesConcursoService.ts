import { FonteSchema } from "../schemas/concurso.schema";
import { z } from "zod";

import api from "./api";

import type { Fonte } from "../types/fonte";

const getAllFontesConcurso = async (): Promise<Fonte[]> => {
  const { data } = await api.get('/Concurso/ConcursoFontes');
  return z.array(FonteSchema).parse(data);
}

export { getAllFontesConcurso };