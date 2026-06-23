// src/hooks/useEstadosDisponiveis.ts
import { useQuery } from "@tanstack/react-query";
import { getEstadosDisponiveis } from "../services/concursoService";

const useEstadosDisponiveis = () => {
  const { data, isLoading } = useQuery({
    queryKey: ["estados-disponiveis"],
    queryFn: getEstadosDisponiveis,
    staleTime: 1000 * 60 * 5,
  });

  return {
    estadosDisponiveis: data ?? [],
    isLoading,
  };
};

export default useEstadosDisponiveis;