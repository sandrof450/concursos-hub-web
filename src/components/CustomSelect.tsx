// src/components/CustomSelect.tsx
import { useState, useRef, useEffect } from "react";

interface Props {
  value: string;
  onChange: (value: string) => void;
  options: { label: string; value: string }[];
  placeholder?: string;
}

const CustomSelect = ({ value, onChange, options, placeholder = "Selecione..." }: Props) => {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  // fecha ao clicar fora
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const selected = options.find(o => o.value === value);

  return (
    <div ref={ref} className="relative">
      <button
        type="button"
        onClick={() => setOpen(o => !o)}
        className="w-full bg-white/[0.04] border border-white/10 rounded-xl px-4 py-2.5 text-sm text-left flex items-center justify-between transition-all outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/10"
        style={{ color: selected ? "#fff" : "rgba(255,255,255,.2)" }}
      >
        {selected ? selected.label : placeholder}
        <i className={`ti ti-chevron-down text-white/30 text-sm transition-transform ${open ? "rotate-180" : ""}`} aria-hidden="true"/>
      </button>

      {open && (
        <div className="absolute z-50 mt-1 w-full bg-[#0d1824] border border-white/10 rounded-xl overflow-hidden shadow-xl">
          <div
            onClick={() => { onChange(""); setOpen(false); }}
            className="px-4 py-2.5 text-sm text-white/30 hover:bg-white/5 cursor-pointer transition-colors"
          >
            {placeholder}
          </div>
          {options.map(opt => (
            <div
              key={opt.value}
              onClick={() => { onChange(opt.value); setOpen(false); }}
              className={`px-4 py-2.5 text-sm cursor-pointer transition-colors flex items-center justify-between
                ${opt.value === value
                  ? "text-emerald-400 bg-emerald-500/10"
                  : "text-white/70 hover:bg-white/5"
                }`}
            >
              {opt.label}
              {opt.value === value && <i className="ti ti-check text-emerald-400 text-sm" aria-hidden="true"/>}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default CustomSelect;