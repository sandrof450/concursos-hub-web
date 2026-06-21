// src/hooks/useCountUp.ts

/**
 * Anima números do zero até um valor alvo no DOM.
 *
 * - Aguarda um delay antes de iniciar (padrão: 700ms)
 * - Busca cada elemento pelo id e incrementa o texto progressivamente
 * - Aceita sufixo opcional (ex: "+", "%")
 * - Cancela o timer se o componente for desmontado antes de terminar
 *
 * @param stats  - Lista de { id, target, suffix } para animar
 * @param delay  - Tempo em ms antes de iniciar (padrão: 700)
 */


import { useEffect } from "react";

interface StatConfig {
  id: string;
  target: number;
  suffix?: string;
}

const useCountUp = (stats: StatConfig[], delay = 700) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      stats.forEach(({ id, target, suffix = "" }) => {
        const el = document.getElementById(id);
        if (!el) return;
        let v = 0;
        const step = Math.ceil(target / 50);
        const t = setInterval(() => {
          v = Math.min(v + step, target);
          el.textContent = v.toLocaleString("pt-BR") + suffix;
          if (v >= target) clearInterval(t);
        }, 30);
      });
    }, delay);
    return () => clearTimeout(timer);
  }, [stats.map(s => s.target).join(",")] ); // ← re-executa quando os targets mudarem
};

export default useCountUp;