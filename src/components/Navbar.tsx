// src/components/Navbar.tsx
import { useState } from "react";

import { executarJob } from "../services/concursoService";

import { useToastContext } from "../contexts/ToastContext";

import { ROUTES } from "../constants";



const Navbar = () => {
  const [running, setRunning] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  const { showToast } = useToastContext();

  const handleJob = async () => {
    if (running) return;
    setRunning(true);
    try {
      await executarJob();
      showToast("success", "Job executado!", "Scraping concluído. Dados atualizados.");
    } catch (err) {
      console.error("Erro ao executar job:", err);
      showToast("error", "Erro no job", "Não foi possível executar o scraping.");
    } finally {
      setRunning(false);
    }
  };

  const navLinkClass = "flex items-center gap-1.5 text-white/45 text-sm px-3 py-1.5 rounded-lg hover:text-white hover:bg-white/[0.06] transition-all";
  const mobileLinkClass = "flex items-center gap-2 text-white/45 text-sm px-3 py-2.5 rounded-lg hover:text-white hover:bg-white/[0.06] transition-all cursor-pointer";


  return (
    <nav className="bg-[#080d14] border-b border-white/[0.08] relative z-50">
      <div className="flex items-center justify-between px-8 h-[60px]">

        {/* Logo */}
        <a href={ROUTES.home} className="flex items-center gap-2.5 no-underline">
          <div className="w-8 h-8 bg-emerald-500/10 border border-emerald-500/30 rounded-lg flex items-center justify-center">
            <i className="ti ti-award text-emerald-500 text-lg" aria-hidden="true" />
          </div>
          <span className="font-bold text-base text-white" style={{ fontFamily: "'Syne', sans-serif" }}>
            Concursos<span className="text-emerald-500">Hub</span>
          </span>
        </a>

        {/* Links — desktop */}
        <div className="hidden md:flex items-center gap-1">
          <a href={ROUTES.home} className={navLinkClass}>
            <i className="ti ti-home text-sm" aria-hidden="true" />
            Início
          </a>
          <a href={ROUTES.concursos} className={navLinkClass}>
            <i className="ti ti-list-search text-sm" aria-hidden="true" />
            Concursos
          </a>
        </div>

        {/* Direita — desktop */}
        {import.meta.env.DEV && (
          <div className="hidden md:flex items-center gap-3">
            <div className="flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
              <span className="text-xs text-white/30" style={{ fontFamily: "'DM Sans', sans-serif" }}>
                Atualizado hoje
              </span>
            </div>
            <button
              onClick={handleJob}
              disabled={running}
              className="flex items-center gap-1.5 bg-emerald-500/10 border border-emerald-500/30 rounded-lg px-3.5 py-1.5 text-emerald-400 text-sm transition-all hover:bg-emerald-500/20 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <i className={`ti ti-refresh text-sm ${running ? "animate-spin" : ""}`} aria-hidden="true" />
              {running ? "Executando..." : "Executar Job"}
            </button>
          </div>     
        )}

        {/* Hamburguer — mobile */}
        <button
          onClick={() => setMenuOpen(o => !o)}
          className="flex md:hidden items-center justify-center border border-white/10 rounded-lg p-1.5 text-white/50 hover:text-white hover:border-white/25 transition-all"
          aria-label="Abrir menu"
        >
          <i className={`ti ${menuOpen ? "ti-x" : "ti-menu-2"} text-lg`} aria-hidden="true" />
        </button>
      </div>

      {/* Menu mobile */}
      {menuOpen && (
        <div className="md:hidden border-t border-white/[0.08] px-4 py-3 flex flex-col gap-1">
          <a href={ROUTES.home} className={mobileLinkClass}>
            <i className="ti ti-home text-base" aria-hidden="true" />
            Início
          </a>
          <a href={ROUTES.concursos} className={mobileLinkClass}>
            <i className="ti ti-list-search text-base" aria-hidden="true" />
            Concursos
          </a>
          <div className="h-px bg-white/[0.08] my-1.5" />
          <button
            onClick={handleJob}
            disabled={running}
            className="flex items-center gap-2 bg-emerald-500/10 border border-emerald-500/25 rounded-lg px-3 py-2.5 text-emerald-400 text-sm transition-all hover:bg-emerald-500/18 disabled:opacity-50"
          >
            <i className={`ti ti-refresh text-base ${running ? "animate-spin" : ""}`} aria-hidden="true" />
            {running ? "Executando..." : "Executar Job"}
          </button>
        </div>
      )}
    </nav>
  );
};

export default Navbar;