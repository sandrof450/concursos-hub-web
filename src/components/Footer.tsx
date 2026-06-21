const Footer = () => {
  const ano = new Date().getFullYear();

  const fontes = [
    { label: "PCI Concursos", url: "https://www.pciconcursos.com.br" },
    { label: "Concursos Brasil", url: "https://www.concursosnobrasil.com.br" },
  ];

  return (
    <footer
      className="bg-[#080d14] border-t border-white/[0.08] px-8 py-8 mt-auto"
      style={{ fontFamily: "'DM Sans', sans-serif" }}>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-7">
        {/* Coluna 1 — sobre */}
        <div>
          <div className="flex items-center gap-2 mb-3">
            <div className="w-7 h-7 bg-emerald-500/10 border border-emerald-500/30 rounded-lg flex items-center justify-center">
              <i className="ti ti-award text-emerald-500 text-base" aria-hidden="true" />
            </div>
            <span className="font-bold text-sm text-white" style={{ fontFamily: "'Syne', sans-serif" }}>
              Concursos<span className="text-emerald-500">Hub</span>
            </span>
          </div>
          <p className="text-xs text-white/35 leading-relaxed max-w-[200px]">
            Plataforma inteligente para centralizar e filtrar concursos públicos de diversas fontes.
          </p>
        </div>

        {/* Coluna 2 — fontes */}
        <div>
          <p className="text-xs font-medium text-white/30 uppercase tracking-widest mb-3">
            Fontes de dados
          </p>
          <div className="flex flex-col gap-1">
            {fontes.map(f => (
              <a
                key={f.label}
                href={f.url}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1.5 text-sm text-white/40 hover:text-emerald-400 transition-colors py-1"
              >
                <i className="ti ti-external-link text-sm" aria-hidden="true" />
                {f.label}
              </a>
            ))}
          </div>
        </div>

        {/* Coluna 3 — atualização */}
        <div>
          <p className="text-xs font-medium text-white/30 uppercase tracking-widest mb-3">
            Atualização
          </p>
          <div className="inline-flex items-center gap-2 bg-emerald-500/[0.08] border border-emerald-500/20 rounded-full px-3 py-1.5 mb-3">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
            <span className="text-xs text-emerald-400/80">Atualizado diariamente</span>
          </div>
          <p className="text-xs text-white/30 leading-relaxed">
            Os dados são coletados automaticamente todo dia via scraping das fontes listadas.
          </p>
        </div>
      </div>

      {/* Bottom */}
      <div className="border-t border-white/[0.06] pt-5 flex flex-col md:flex-row items-start md:items-center justify-between gap-3">
        <span className="text-xs text-white/20">
          © <span className="text-white/35">{ano}</span> ConcursosHub. Todos os direitos reservados.
        </span>
        <span className="text-xs text-white/18 md:text-right leading-relaxed max-w-sm">
          Os dados exibidos são coletados de fontes públicas. Consulte sempre o edital oficial.
        </span>
      </div>

    </footer>
  );
}

export default Footer;