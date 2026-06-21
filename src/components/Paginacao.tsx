// src/components/Paginacao.tsx
interface Props {
  currentPage: number;
  totalPages: number;
  totalCount: number;
  pageSize: number;
  onPageChange: (page: number) => void;
}

const Paginacao = ({ currentPage, totalPages, totalCount, pageSize, onPageChange }: Props) => {
  if (totalPages <= 1) return null;

  const getPages = () => {
    const pages: (number | "...")[] = [];
    if (totalPages <= 7) {
      return Array.from({ length: totalPages }, (_, i) => i + 1);
    }
    pages.push(1);
    if (currentPage > 3) pages.push("...");
    for (let i = Math.max(2, currentPage - 1); i <= Math.min(totalPages - 1, currentPage + 1); i++) {
      pages.push(i);
    }
    if (currentPage < totalPages - 2) pages.push("...");
    pages.push(totalPages);
    return pages;
  };

  const from = (currentPage - 1) * pageSize + 1;
  const to = Math.min(currentPage * pageSize, totalCount);

  const btnBase = "w-9 h-9 rounded-lg text-sm font-medium flex items-center justify-center transition-all";
  const btnActive = `${btnBase} bg-emerald-600 text-white`;
  const btnInactive = `${btnBase} bg-white/[0.04] border border-white/[0.08] text-white/50 hover:bg-white/[0.08] hover:text-white`;
  const btnDisabled = `${btnBase} bg-white/[0.02] border border-white/[0.05] text-white/20 cursor-not-allowed`;

  return (
    <div className="flex flex-col items-center gap-3 py-4">

      {/* info */}
      <p className="text-xs text-white/30">
        Mostrando <span className="text-white/50">{from}–{to}</span> de <span className="text-white/50">{totalCount}</span> concursos
      </p>

      {/* botões */}
      <div className="flex items-center gap-1.5">

        {/* anterior */}
        <button
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage === 1}
          className={currentPage === 1 ? btnDisabled : btnInactive}
          aria-label="Página anterior"
        >
          <i className="ti ti-chevron-left text-sm" aria-hidden="true" />
        </button>

        {/* páginas */}
        {getPages().map((page, i) =>
          page === "..." ? (
            <span key={`dots-${i}`} className="w-9 h-9 flex items-center justify-center text-white/25 text-sm">
              ...
            </span>
          ) : (
            <button
              key={page}
              onClick={() => onPageChange(page as number)}
              className={page === currentPage ? btnActive : btnInactive}
              aria-label={`Ir para página ${page}`}
              aria-current={page === currentPage ? "page" : undefined}
            >
              {page}
            </button>
          )
        )}

        {/* próximo */}
        <button
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          className={currentPage === totalPages ? btnDisabled : btnInactive}
          aria-label="Próxima página"
        >
          <i className="ti ti-chevron-right text-sm" aria-hidden="true" />
        </button>

      </div>
    </div>
  );
};

export default Paginacao;