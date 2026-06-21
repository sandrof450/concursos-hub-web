import { getAllFontesConcurso } from "../services/fontesConcursoService";
import { useQuery } from "@tanstack/react-query";

const useFontesConcurso = () => { 
  const { data, isLoading, error } = useQuery({
    queryKey: ["fontesConcurso"],
    queryFn: getAllFontesConcurso,
    staleTime: Infinity, // os dados não ficam obsoletos, pois as fontes não mudam com frequência
  });

  return {
    data: data || [],
    loading: isLoading,
    error: error ? (error as Error).message : null
  };
}

export default useFontesConcurso;