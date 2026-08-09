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
interface Props { value: string[]; onChange: (value: string[]) => void }

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

  const [search, setSearch] = useState("");
  const [open, setOpen] = useState(false);
  const [focused, setFocused] = useState(-1);
  const [filtered, setFiltered] = useState<Estado[]>(ESTADOS);

  const containerRef = useRef<HTMLDivElement>(null);

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
    setSearch(val);
    setFocused(-1);
    //onChange([]);
    setFiltered(
      ESTADOS.filter(e =>
        e.nome.toLowerCase().includes(val.toLowerCase()) ||
        e.uf.toLowerCase().includes(val.toLowerCase())
      )
    );
    setOpen(true);
  };

  const handleSelect = (estado: Estado) => {
    if (!temConcursos(estado.uf)) return;
    const uf = estado.uf.toUpperCase();
    const novoValor = value.includes(uf)
      ? value.filter(v => v !== uf)  // remove se já selecionado
      : [...value, uf];               // adiciona se não selecionado
    onChange(novoValor);
  };

  const handleClear = () => {
    onChange([]);
    setSearch("");
    setFiltered(ESTADOS);
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

  return (
    <div ref={containerRef} className="flex flex-col gap-1.5">
      <label className="text-[11px] uppercase tracking-widest text-white/30">Estado</label>
      <div className="relative">
        {/*div do trigger */}
        <div
          data-testid="estado-trigger"
          onClick={() => setOpen(o => !o)}
          className="w-full bg-white/[0.04] border border-white/10 rounded-xl px-3 py-2 min-h-[42px] flex flex-wrap gap-1.5 items-center cursor-pointer transition-all focus-within:border-emerald-500"
        >
          {value.length === 0 && (
            <span className="text-sm text-white/20">Selecione um ou mais estados...</span>
          )}
          {value.map(uf => {
            const estado = ESTADOS.find(e => e.uf === uf);
            return (
              <span key={uf} className="inline-flex items-center gap-1 bg-emerald-500/10 border border-emerald-500/25 rounded-full px-2.5 py-0.5 text-xs text-emerald-400">
                {estado?.nome}
                <button
                  onClick={e => { e.stopPropagation(); handleSelect({ nome: estado?.nome ?? "", uf }); }}
                  aria-label={`Remover ${estado?.nome}`}
                  className="text-emerald-400/60 hover:text-emerald-400 transition-colors"
                >
                  <i className="ti ti-x text-xs" aria-hidden="true" />
                </button>
              </span>
            );
          })}
        </div>
        
        <i className={`ti ti-chevron-down absolute right-3 top-1/2 -translate-y-1/2 text-white/30 text-sm pointer-events-none transition-transform ${open ? "rotate-180" : ""}`} aria-hidden="true" />

        {open && (
          <div role="listbox" aria-multiselectable="true"
            className="absolute top-[calc(100%+4px)] left-0 right-0 bg-[#0d1824] border border-white/10 rounded-xl overflow-hidden z-50 shadow-[0_8px_24px_rgba(0,0,0,.4)]">

            {/* campo de busca interno */}
            <div className="p-2 border-b border-white/[0.06]">
              <input
                value={search}
                onChange={e => handleInput(e.target.value)}
                onKeyDown={handleKey}
                placeholder="Buscar estado..."
                autoFocus
                className="w-full bg-white/[0.04] border border-white/10 rounded-lg px-3 py-2 text-sm text-white placeholder-white/20 outline-none focus:border-emerald-500"
              />
            </div>

            {/* lista de opções */}
            <div className="max-h-48 overflow-y-auto">
              {filtered.length === 0 ? (
                <div className="px-4 py-3 text-sm text-white/25 text-center">Nenhum estado encontrado</div>
              ) : (
                filtered.map((estado, i) => {
                  const disponivel = temConcursos(estado.uf);
                  const selecionado = value.includes(estado.uf.toUpperCase());
                  return (
                    <div key={estado.uf} role="option"
                      aria-selected={selecionado}
                      aria-disabled={!disponivel}
                      onClick={() => handleSelect(estado)}
                      className={`flex items-center justify-between px-4 py-2.5 text-sm transition-all
                        ${!disponivel ? "opacity-35 cursor-not-allowed" : "cursor-pointer"}
                        ${i === focused ? "bg-emerald-500/[0.08]" : "hover:bg-white/[0.05]"}
                      `}
                    >
                      <div className="flex items-center gap-2.5">
                        {/* checkbox */}
                        <div className={`w-4 h-4 rounded border flex items-center justify-center flex-shrink-0 transition-all
                          ${selecionado
                            ? "bg-emerald-500/20 border-emerald-500/50"
                            : "border-white/20"
                          }`}
                        >
                          {selecionado && <i className="ti ti-check text-emerald-400" style={{ fontSize: "10px" }} aria-hidden="true" />}
                        </div>
                        <span className={selecionado ? "text-emerald-400" : "text-white/60"}>
                          {highlight(estado.nome, search)}
                        </span>
                        {!disponivel && <span className="text-[10px] text-white/25">sem vagas</span>}
                      </div>
                      <span className="text-xs text-white/25 ml-2 flex-shrink-0">{estado.uf}</span>
                    </div>
                  );
                })
              )}
            </div>

            {/* footer */}
            <div className="flex items-center justify-between px-4 py-2 border-t border-white/[0.06]">
              <span className="text-xs text-white/30">{value.length} selecionado{value.length !== 1 ? "s" : ""}</span>
              {value.length > 0 && (
                <button onClick={handleClear} className="text-xs text-white/40 hover:text-white transition-colors">
                  Limpar seleção
                </button>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default EstadoAutocomplete;