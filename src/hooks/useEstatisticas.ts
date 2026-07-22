import { getEstatisticas } from "../services/estatisticasConcursoService";
import { useQuery } from "@tanstack/react-query";

const useEstatisticas = () => {
  const { data, isLoading, error } = useQuery({
    queryKey: ["estatisticas"],
    queryFn: async () => {
      console.log("Buscando estatísticas...");
      return getEstatisticas();
    },

    staleTime: Infinity, // Infinito minutos Tempo que os dados são considerados "frescos" e não precisam ser recarregados
    gcTime: 1000 * 60 * 15, // 15 minutos Tempo que os dados permanecem na memória(cache) antes de serem descartados
  });

  return {
    data,
    loading: isLoading,
    error: error ? (error as Error).message : null
  };
};

export default useEstatisticas;