// src/hooks/useConcursos.ts
import { useQuery } from "@tanstack/react-query";

import type { ConcursoFilterType } from "../types/concurso";

import { getConcursos } from "../services/concursoService";


const useConcursos = (filters?: ConcursoFilterType) => {
  const { data, isLoading, error } = useQuery({
    queryKey: ["concursos", filters],
    queryFn: () => getConcursos(filters),

    staleTime: 1000 * 60 * 5, // 5 minutos Tempo que os dados são considerados "frescos" e não precisam ser recarregados
    gcTime: 1000 * 60 * 15, // 15 minutos Tempo que os dados permanecem na memória(cache) antes de serem descartados
  });
  return { data, isLoading, error: error ? (error as Error).message : null };  
};

export default useConcursos;