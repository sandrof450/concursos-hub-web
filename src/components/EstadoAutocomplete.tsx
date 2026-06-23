// src/components/EstadoAutocomplete.tsx
import { useState, useRef, useEffect } from "react";
import useEstadosDisponiveis from "../hooks/useEstadosDisponiveis";

const ESTADOS = [
  { nome: "Nacional", uf: "NACIONAL" }, { nome: "Acre", uf: "AC" },
  { nome: "Alagoas", uf: "AL" }, { nome: "Amapá", uf: "AP" },
  { nome: "Amazonas", uf: "AM" }, { nome: "Bahia", uf: "BA" },
  { nome: "Ceará", uf: "CE" }, { nome: "Distrito Federal", uf: "DF" },
  { nome: "Espírito Santo", uf: "ES" }, { nome: "Goiás", uf: "GO" },
  { nome: "Maranhão", uf: "MA" }, { nome: "Mato Grosso", uf: "MT" },
  { nome: "Mato Grosso do Sul", uf: "MS" }, { nome: "Minas Gerais", uf: "MG" },
  { nome: "Pará", uf: "PA" }, { nome: "Paraíba", uf: "PB" },
  { nome: "Paraná", uf: "PR" }, { nome: "Pernambuco", uf: "PE" },
  { nome: "Piauí", uf: "PI" }, { nome: "Rio de Janeiro", uf: "RJ" },
  { nome: "Rio Grande do Norte", uf: "RN" }, { nome: "Rio Grande do Sul", uf: "RS" },
  { nome: "Rondônia", uf: "RO" }, { nome: "Roraima", uf: "RR" },
  { nome: "Santa Catarina", uf: "SC" }, { nome: "São Paulo", uf: "SP" },
  { nome: "Sergipe", uf: "SE" }, { nome: "Tocantins", uf: "TO" },
];

interface Estado { nome: string; uf: string }
interface Props { value: string; onChange: (value: string) => void }

const highlight = (text: string, query: string) => {
  if (!query) return <span>{text}</span>;
  const parts = text.split(new RegExp(`(${query})`, "gi"));
  return (
    <span>
      {parts.map((part, i) =>
        part.toLowerCase() === query.toLowerCase()
          ? <strong key={i} className="text-emerald-400 font-medium">{part}</strong>
          : <span key={i}>{part}</span>
      )}
    </span>
  );
};

const EstadoAutocomplete = ({ value, onChange }: Props) => {
  const { estadosDisponiveis } = useEstadosDisponiveis();

  const [inputValue, setInputValue] = useState(value);
  const [open, setOpen] = useState(false);
  const [focused, setFocused] = useState(-1);
  const [filtered, setFiltered] = useState<Estado[]>(ESTADOS);

  const containerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const temConcursos = (uf: string) => {
    if (!estadosDisponiveis.length) return true;
    return estadosDisponiveis.includes(uf.toUpperCase());
  };

  // fecha ao clicar fora
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node))
        setOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const handleInput = (val: string) => {
    setInputValue(val);
    setFocused(-1);
    onChange("");
    setFiltered(
      ESTADOS.filter(e =>
        e.nome.toLowerCase().includes(val.toLowerCase()) ||
        e.uf.toLowerCase().includes(val.toLowerCase())
      )
    );
    setOpen(true);
  };

  const handleSelect = (estado: Estado) => {
    if (!temConcursos(estado.uf)) return; // bloqueia estados sem concursos
    setInputValue(estado.nome);
    onChange(estado.uf === "Nacional" ? "Nacional" : estado.uf.toUpperCase());
    setOpen(false);
    setFocused(-1);
  };

  const handleClear = () => {
    setInputValue("");
    onChange("");
    setFiltered(ESTADOS);
    setOpen(false);
    inputRef.current?.focus();
  };

  const handleKey = (e: React.KeyboardEvent) => {
    if (!open) return;
    if (e.key === "ArrowDown") {
      e.preventDefault();
      // pula estados desabilitados
      let next = focused + 1;
      while (next < filtered.length && !temConcursos(filtered[next].uf)) next++;
      if (next < filtered.length) setFocused(next);
    }
    if (e.key === "ArrowUp") {
      e.preventDefault();
      let prev = focused - 1;
      while (prev >= 0 && !temConcursos(filtered[prev].uf)) prev--;
      if (prev >= 0) setFocused(prev);
    }
    if (e.key === "Enter" && focused >= 0) handleSelect(filtered[focused]);
    if (e.key === "Escape") setOpen(false);
  };

  const isSelected = ESTADOS.some(e => e.nome === inputValue);

  return (
    <div ref={containerRef} className="flex flex-col gap-1.5">
      <label className="text-[11px] uppercase tracking-widest text-white/30">Estado</label>
      <div className="relative">
        <input
          ref={inputRef}
          value={inputValue}
          onChange={e => handleInput(e.target.value)}
          onFocus={() => setOpen(true)}
          onKeyDown={handleKey}
          placeholder="Digite ou selecione..."
          autoComplete="off"
          aria-label="Filtrar por estado"
          aria-expanded={open}
          className={`w-full bg-white/[0.04] border rounded-xl px-4 py-2.5 text-sm text-white placeholder-white/20 outline-none transition-all pr-9
            ${isSelected
              ? "border-emerald-500/30 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/10"
              : "border-white/10 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/10"
            }`}
        />

        {inputValue ? (
          <button onClick={handleClear} aria-label="Limpar estado"
            className="absolute right-3 top-1/2 -translate-y-1/2 text-white/30 hover:text-white transition-colors">
            <i className="ti ti-x text-sm" aria-hidden="true" />
          </button>
        ) : (
          <i className={`ti ti-chevron-down absolute right-3 top-1/2 -translate-y-1/2 text-white/30 text-sm transition-transform ${open ? "rotate-180" : ""}`} aria-hidden="true" />
        )}

        {open && (
          <div role="listbox"
            className="absolute top-[calc(100%+4px)] left-0 right-0 bg-[#0d1824] border border-white/10 rounded-xl overflow-hidden z-50 shadow-[0_8px_24px_rgba(0,0,0,.4)] max-h-56 overflow-y-auto">
            {filtered.length === 0 ? (
              <div className="px-4 py-3 text-sm text-white/25 text-center">
                Nenhum estado encontrado
              </div>
            ) : (
              filtered.map((estado, i) => {
                const disponivel = temConcursos(estado.uf);
                return (
                  <div
                    key={estado.uf}
                    role="option"
                    aria-selected={inputValue === estado.nome}
                    aria-disabled={!disponivel}
                    onClick={() => handleSelect(estado)}
                    className={`flex items-center justify-between px-4 py-2.5 text-sm transition-all
                      ${!disponivel
                        ? "opacity-35 cursor-not-allowed"
                        : i === focused
                          ? "bg-emerald-500/[0.08] text-white cursor-pointer"
                          : "text-white/60 hover:bg-white/[0.05] hover:text-white cursor-pointer"
                      }
                      ${inputValue === estado.nome ? "text-emerald-400" : ""}
                    `}
                  >
                    {highlight(estado.nome, inputValue)}
                    <div className="flex items-center gap-2 flex-shrink-0 ml-2">
                      {!disponivel && (
                        <span className="text-[10px] text-white/25">sem vagas</span>
                      )}
                      <span className={`text-xs ${inputValue === estado.nome ? "text-emerald-500/50" : "text-white/25"}`}>
                        {estado.uf}
                      </span>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default EstadoAutocomplete;