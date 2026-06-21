// src/components/ConcursoList.tsx
import ConcursoCard from "./ConcursoCard";
import SkeletonCard from "./SkeletonCard";

import type { Concurso } from "../types/concurso";
import { motion, type Variants } from "framer-motion";

interface Props {
  data: Concurso[];
  loading: boolean;
  error: string | null;
}

const groupByEstado = (list: Concurso[]): Record<string, Concurso[]> => {
  return list.reduce<Record<string, Concurso[]>>((acc, c) => {
    const key = c.estado || "Não informado";
    if (!acc[key]) acc[key] = [];
    acc[key].push(c);
    return acc;
  }, {});
};

const ConcursoList = ({ data, loading, error }: Props) => {
  const cardVariants: Variants = {
    hidden: { opacity: 0, y: 16 },
    visible: (i: number) => ({
      opacity: 1, y: 0,
      transition: { duration: 0.4, delay: i * 0.08, ease: [0.34, 1.2, 0.64, 1] }
    })
  };

  if (error) return (
    <div className="flex flex-col items-center gap-3 py-16 text-white/25">
      <i className="ti ti-alert-circle text-4xl" aria-hidden="true" />
      <p className="text-sm">{error}</p>
    </div>
  );

  if (loading) return (
    <div className="flex flex-col gap-6">
      {Array(3).fill(null).map((_, i) => (
        <div key={i}>
          {/* skeleton do header do estado */}
          <div className="flex items-center gap-3 mb-3">
            <div className="h-7 w-24 bg-white/[0.06] rounded-full animate-pulse" />
            <div className="flex-1 h-px bg-white/[0.06]" />
          </div>
          <div className="flex flex-col gap-2">
            <SkeletonCard />
            <SkeletonCard />
          </div>
        </div>
      ))}
    </div>
  );

  if (!data.length) return (
    <div className="flex flex-col items-center gap-3 py-16 text-white/25">
      <i className="ti ti-search-off text-4xl" aria-hidden="true" />
      <p className="text-sm">Nenhum concurso encontrado</p>
    </div>
  );
  
  const grouped = groupByEstado(data);
  const estados = Object.keys(grouped).sort();

  return (
    <div className="flex flex-col gap-2">

      {/* header da lista */}
      <div className="flex items-center justify-between mb-2">
        <h2 className="text-base font-bold text-white" style={{ fontFamily: "'Syne', sans-serif" }}>
          Concursos <span className="text-emerald-500">por estado</span>
        </h2>
        <span className="text-xs text-white/30">
          {data.length} concurso{data.length > 1 ? "s" : ""} em {estados.length} estado{estados.length > 1 ? "s" : ""}
        </span>
      </div>

      {/* seções por estado */}
      {estados.map(estado => (
        <div key={estado} className="mb-4">

          {/* header do estado */}
          <div className="flex items-center gap-3 mb-2">
            <span className="flex items-center gap-1.5 bg-emerald-500/10 border border-emerald-500/25 rounded-full px-3 py-1 text-xs font-medium text-emerald-400 flex-shrink-0"
              style={{ fontFamily: "'Syne', sans-serif" }}>
              <i className="ti ti-map-pin text-xs" aria-hidden="true" />
              {estado}
            </span>
            <div className="flex-1 h-px bg-white/[0.07]" />
            <span className="text-xs text-white/25 flex-shrink-0">
              {grouped[estado].length} concurso{grouped[estado].length > 1 ? "s" : ""}
            </span>
          </div>

          {/* cards do estado */}
          <div className="flex flex-col gap-2">
            {grouped[estado].map((concurso, i) => (
              <motion.div
                key={concurso.concursoId}
                variants={cardVariants}
                initial="hidden"
                animate="visible"
                custom={i}
              >
                <ConcursoCard concurso={concurso} />
              </motion.div>
            ))}
          </div>

        </div>
      ))}
    </div>
  );
};

export default ConcursoList;