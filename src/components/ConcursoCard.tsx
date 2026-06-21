// src/components/ConcursoCard.tsx
import type { Concurso } from "../types/concurso";
import { cleanTitulo } from "../utils/cleanTitulo";
import { getStatus } from "../utils/getStatus";

interface Props {
  concurso: Concurso;
}

const formatDate = (iso: string) => {
  if (!iso) return "";
  return new Date(iso).toLocaleDateString("pt-BR");
};

const formatSalario = (s: string | null) => {
  if (!s) return null;
  return parseFloat(s).toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
};

const statusStyle: Record<string, React.CSSProperties> = {
  Aberto:    { background: "rgba(29,158,117,.1)", border: "0.5px solid rgba(29,158,117,.3)", color: "#1D9E75" },
  Previsto:  { background: "rgba(234,179,8,.1)",  border: "0.5px solid rgba(234,179,8,.3)",  color: "#ca8a04" },
  Encerrado: { background: "rgba(239,68,68,.1)",  border: "0.5px solid rgba(239,68,68,.3)",  color: "#ef4444" },
};

const ConcursoCard = ({ concurso: c }: Props) => {
  const status = getStatus(c.status || "");

  return (
    <div className="bg-[#0d1824] border border-white/[0.08] rounded-2xl p-4 flex flex-col gap-3 relative overflow-hidden transition-all duration-200 hover:border-emerald-500/35 hover:translate-x-1 active:scale-[.995] group">

      {/* brilho sutil no hover */}
      <div className="absolute inset-0 bg-emerald-500/[0.02] opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none rounded-2xl" />

      {/* título + badges */}
      <div className="flex items-start justify-between gap-3">
        <h3 className="text-sm font-bold text-white leading-snug flex-1" style={{ fontFamily: "'Syne', sans-serif" }}>
          {cleanTitulo(c.titulo || "")}
        </h3>
        <div className="flex items-center gap-2 flex-shrink-0 flex-wrap justify-end">
          {status && (
            <span style={statusStyle[status]} className="rounded-full px-2.5 py-0.5 text-xs">
              {status}
            </span>
          )}
          {c.vagas && c.vagas !== "0" && (
            <span className="bg-emerald-500/10 border border-emerald-500/30 rounded-full px-2.5 py-0.5 text-xs text-emerald-400 flex items-center gap-1">
              <i className="ti ti-users text-xs" aria-hidden="true" />
              {c.vagas} vagas
            </span>
          )}
        </div>
      </div>

      {/* órgão + cidade */}
      {c.orgao && (
        <div className="flex items-center gap-1.5 text-xs text-white/40">
          <i className="ti ti-building text-sm" aria-hidden="true" />
          {c.orgao}{c.cidade ? ` · ${c.cidade}` : ""}
        </div>
      )}

      {/* divider */}
      <div className="h-px bg-white/[0.06] group-hover:bg-emerald-500/15 transition-colors duration-300" />

      {/* tags */}
      <div className="flex flex-wrap gap-1.5">
        {c.area && (
          <span className="tag group-hover:border-white/15 group-hover:text-white/60 transition-all duration-200">
            <i className="ti ti-briefcase text-xs" aria-hidden="true" />
            {c.area}
          </span>
        )}
        {c.nivel && (
          <span className="tag">
            <i className="ti ti-school text-xs" aria-hidden="true" />
            {c.nivel}
          </span>
        )}
        {formatSalario(c.salario?.toString() || null) && (
          <span className="tag">
            <i className="ti ti-currency-dollar text-xs" aria-hidden="true" />
            {formatSalario(c.salario?.toString() || null)}
          </span>
        )}
        {c.fonte && (
          <span className="tag-fonte">
            <i className="ti ti-link text-xs" aria-hidden="true" />
            {c.fonte}
          </span>
        )}
      </div>

      {/* data + botão */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-1 text-xs text-white/25">
          <i className="ti ti-calendar text-sm" aria-hidden="true" />
          {formatDate(c.dataPublicacao?.toString() || "")}
        </div>
        <a href={c.link} target="_blank" rel="noopener noreferrer">
          <button className="bg-emerald-600 hover:bg-emerald-700 hover:-translate-y-0.5 hover:shadow-[0_4px_12px_rgba(29,158,117,.3)] active:translate-y-0 active:scale-95 text-white rounded-lg px-3 py-1.5 text-xs font-medium flex items-center gap-1.5 transition-all duration-200">
            Ver edital
            <i className="ti ti-external-link text-xs" aria-hidden="true" />
          </button>
        </a>
      </div>
    </div>
  );
};

export default ConcursoCard;