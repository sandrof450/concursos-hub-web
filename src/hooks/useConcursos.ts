// src/hooks/useConcursos.ts
import { useQuery } from "@tanstack/react-query";

import type { ConcursoFilterType } from "../types/concurso";

import { getConcursos } from "../services/concursoService";


const useConcursos = (filters?: ConcursoFilterType) => {
  const { data, isLoading, error } = useQuery({
    queryKey: ["concursos", filters],
    queryFn: () => getConcursos(filters),
  });
  return { data, isLoading, error: error ? (error as Error).message : null };  
};

export default useConcursos;