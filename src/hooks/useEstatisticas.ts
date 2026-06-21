import { getEstatisticas } from "../services/estatisticasConcursoService";
import { useQuery } from "@tanstack/react-query";

const useEstatisticas = () => {
  const { data, isLoading, error } = useQuery({
    queryKey: ["estatisticas"],
    queryFn: getEstatisticas,
  });

  return {
    data,
    loading: isLoading,
    error: error ? (error as Error).message : null
  };
};

export default useEstatisticas;