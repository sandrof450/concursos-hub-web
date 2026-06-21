import { useEffect, useState } from "react";

import { useToastContext } from "../contexts/ToastContext";

import type { ConcursoFilterType } from "../types/concurso";

import { PAGE_SIZE } from "../constants";

import useConcursos from "../hooks/useConcursos";

import Hero from "../components/Hero";
import Paginacao from "../components/Paginacao";
import ConcursoFilter from "../components/ConcursoFilter";
import ConcursosList from "../components/ConcursoList";
import ToastContainer from "../components/ToastContainer";


const ConcursosPage = () => {
  const [filters, setFilters] = useState<ConcursoFilterType>({
    pageNumber: 1,
    pageSize: PAGE_SIZE
  });
  const { data, isLoading, error } = useConcursos(filters);
  
  const  {showToast} = useToastContext();

  const handleFiltersChange = (newFilters: ConcursoFilterType) => {
    // ao filtrar, volta para página 1
    setFilters({ ...newFilters, pageNumber: 1, pageSize: PAGE_SIZE });
  };

  const handlePageChange = (page: number) => {
    setFilters(f => ({ ...f, pageNumber: page }));
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // exibe toast quando os dados chegam
  useEffect(() => {
    if (!isLoading && data) {
      showToast("success", "Concursos encontrados", `${data.totalCount} concursos carregados.`);
    }
  }, [data]);

  // exibe toast de erro
  useEffect(() => {
    if (error) {
      showToast("error", "Erro ao buscar", error);
    }
  }, [error]);

  
  return(
    <div className="flex flex-col gap-6 px-8 min-h-screen bg-slate-950 text-white">
      {/* Hero */}
      <Hero />

      {/* Busca */}
      <ConcursoFilter
        onFiltersChange={handleFiltersChange}/>

      {/* Lista */}
      {<ConcursosList
        data={data?.data || []}
        loading={isLoading} 
        error={error}
      />}
      {data && (
        <Paginacao
          currentPage={data.pageNumber}
          totalPages={data.totalPages}
          totalCount={data.totalCount}
          pageSize={data.pageSize}
          onPageChange={handlePageChange}
        />
      )}
      <ToastContainer />
    </div>
  );
}

export default ConcursosPage;