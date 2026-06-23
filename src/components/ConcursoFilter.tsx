// src/components/ConcursoFilter.tsx

// Bibliotecas nativas
import { useState } from "react";

//components
import TypingCharacter from "./TypingCharacter";
import SideScene from "./SideScene";
import EstadoAutocomplete from "./EstadoAutocomplete";

//hooks
import useTypingCharacter from "../hooks/useTypingCharacter";
import useFontes from "../hooks/useFontesConcurso";

//types/interfaces
import type { ConcursoFilterType } from "../types/concurso";
import CustomSelect from "./CustomSelect";

interface Props {
  onFiltersChange: (filters: ConcursoFilterType) => void;
}

const ConcursoFilter = ({ onFiltersChange }: Props) => {
  const [titulo, setTitulo] = useState("");
  const [orgao, setOrgao] = useState("");
  const [area, setArea] = useState("");
  const [fonte, setFonte] = useState("");
  const [estado, setEstado] = useState("");

  const { data: fontes } = useFontes();
  const { isTyping, bubble, onInput } = useTypingCharacter();

  const handleBuscar = () => onFiltersChange({ titulo: titulo, orgao: orgao, area: area, fonte: fonte, estado: estado });

  const handleLimpar = () => {
    setTitulo(""); setOrgao(""); setArea(""); setFonte(""); setEstado("");
    onFiltersChange({});
  };

  const tags = [
    { label: "Título", value: titulo, clear: () => setTitulo("") },
    { label: "Órgão", value: orgao,  clear: () => setOrgao("") },
    { label: "Área",  value: area,   clear: () => setArea("") },
    { label: "Fonte", value: fonte,  clear: () => setFonte("") },
    { label: "Estado", value: estado, clear: () => setEstado("") },
  ].filter(t => t.value);

  const inputClass = "w-full bg-white/[0.04] border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white placeholder-white/20 outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/10 transition-all";

  return (
    <div className="bg-[#080d14] rounded-2xl p-8">

      {/* Personagem + cena */}
      <div className="flex items-start gap-4 mb-6">

        <div className="flex flex-col items-center gap-0 flex-shrink-0">
          
          <div className="bg-emerald-500/10 border border-emerald-500/25 rounded-xl rounded-bl-none p-2 text-xs text-white/60 w-28 md:w-36 leading-relaxed">
            {bubble}
          </div>

          <div className="-mt-2">
            <TypingCharacter isTyping={isTyping} />
          </div>

        </div>
        
        <div className="hidden md:flex flex-1 overflow-hidden relative" style={{height: "160px"}}>
          <SideScene />
        </div>

      </div>

      {/* Campos */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 mb-4">
        <div className="lg:col-span-2 flex flex-col gap-1.5">
          <label className="text-[11px] uppercase tracking-widest text-white/30">Título</label>
          <div className="relative">
            <i className="ti ti-search absolute left-3 top-1/2 -translate-y-1/2 text-white/20 text-base" aria-hidden="true"/>
            <input value={titulo}
              onChange={e => { setTitulo(e.target.value); onInput("titulo", e.target.value); }}
              placeholder="Ex: Analista, Auditor..."
              className={`${inputClass} pl-9`}/>
          </div>
        </div>

        <div className="flex flex-col gap-1.5">
          <label className="text-[11px] uppercase tracking-widest text-white/30">Órgão</label>
          <input value={orgao}
            onChange={e => { setOrgao(e.target.value); onInput("orgao", e.target.value); }}
            placeholder="Ex: INSS, Receita..."
            className={inputClass}/>
        </div>

        <div className="flex flex-col gap-1.5">
          <label className="text-[11px] uppercase tracking-widest text-white/30">Área</label>
          <input value={area}
            onChange={e => { setArea(e.target.value); onInput("area", e.target.value); }}
            placeholder="Ex: Tecnologia, Direito..."
            className={inputClass}/>
        </div>

        <div className="flex flex-col gap-1.5">
          <label className="text-[11px] uppercase tracking-widest text-white/30">Fonte</label>
          <CustomSelect
            value={fonte}
            onChange={val => { setFonte(val); onInput("fonte", val); }}
            placeholder="Todas as fontes"
            options={fontes.map(f => ({ label: f.fonteNome, value: f.fonteNome }))}
          />
        </div>

        <EstadoAutocomplete
          value={estado}
          onChange={val => { setEstado(val); onInput("estado", val); }}
        />
        
      </div>

      {/* Botões */}
      <div className="flex gap-3 mb-4">
        <button onClick={handleBuscar}
          className="flex-1 whitespace-nowrap bg-emerald-600 hover:bg-emerald-700 active:scale-[.98] text-white rounded-xl py-3 text-sm font-medium flex items-center justify-center gap-2 transition-all">
          <i className="ti ti-search text-base" aria-hidden="true"/>
          Buscar concursos
        </button>
        <button onClick={handleLimpar}
          className="bg-transparent border border-white/10 hover:border-white/25 text-white/35 hover:text-white/60 rounded-xl px-5 text-sm transition-all">
          <i className="ti ti-refresh text-sm mr-1" aria-hidden="true"/>
          Limpar
        </button>
      </div>

      {/* Tags */}
      {tags.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {tags.map(t => (
            <span key={t.label}
              className="inline-flex items-center gap-1.5 bg-emerald-500/10 border border-emerald-500/30 rounded-full pl-3 pr-2 py-1 text-xs text-white/70">
              <span className="text-white/30 text-[11px]">{t.label}:</span>
              {t.value}
              <button onClick={t.clear}
                className="text-white/30 hover:text-white transition-colors"
                aria-label={`Remover ${t.label}`}>
                <i className="ti ti-x text-xs" aria-hidden="true"/>
              </button>
            </span>
          ))}
        </div>
      )}
    </div>
  );
};

export default ConcursoFilter;