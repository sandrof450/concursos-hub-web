// src/components/Hero.tsx
import { motion } from "framer-motion";

import useParticleCanvas from "../hooks/useParticleCanvas";
import useCountUp from "../hooks/useCountUp";
import useEstatisticas from "../hooks/useEstatisticas";


const fadeUp = {
  hidden: { opacity: 0, y: 18 },
  visible: (delay: number) => ({
    opacity: 1, y: 0,
    transition: { duration: 0.6, delay }
  })
};

const Hero = () => { 
  const canvasRef = useParticleCanvas();

  const { data } = useEstatisticas();

  useCountUp([
    { id: "stat-concursos", target: data?.totalDeConcursos ?? 0 },
    { id: "stat-vagas", target: data?.totalDeVagas ?? 0, suffix: "+" },
    { id: "stat-fontes", target: data?.totalDeFontes ?? 0},
  ]);

  return (
    <div className="relative bg-[#080d14] flex flex-col items-center text-center rounded-2xl px-6 md:px-12 py-16 overflow-hidden min-h-[380px]">
      <canvas ref={canvasRef} className="absolute inset-0 pointer-events-none" />

      {/* Badge */}
      <motion.div
        variants={fadeUp} initial="hidden" animate="visible" custom={0.1}
        className="inline-flex items-center gap-2 bg-white/5 border border-white/10 rounded-full px-4 py-1.5 mb-7"
      >
        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
        <span className="text-xs text-white/50">Plataforma inteligente de concursos</span>
      </motion.div>

      {/* Título */}
      <motion.h1
        variants={fadeUp} initial="hidden" animate="visible" custom={0.25}
        className="font-extrabold text-3xl md:text-5xl leading-[1.05] tracking-tight text-white mb-5 max-w-xl"
        style={{ fontFamily: "'Syne', sans-serif" }}
      >
        Encontre oportunidades
        <br />
        públicas com{" "}
        <span className="text-emerald-500">rapidez</span>
        <br />
        e organização
      </motion.h1>

      {/* Subtítulo */}
      <motion.p
        variants={fadeUp} initial="hidden" animate="visible" custom={0.4}
        className="text-white/40 text-base leading-relaxed mb-9 max-w-md font-light"
      >
        Centralize concursos, filtre por área e acompanhe vagas em um só lugar. Atualizado diariamente.
      </motion.p>

      {/* Botões */}
      <motion.div
        variants={fadeUp} initial="hidden" animate="visible" custom={0.55}
        className="flex flex-row gap-2 justify-center"
      >
        <button className="whitespace-nowrap bg-emerald-600 hover:bg-emerald-700 active:scale-95 text-white rounded-xl px-4 py-2.5 md:px-6 md:py-3 text-sm font-medium transition-all cursor-pointer">
          Explorar concursos
        </button>
        <button className="whitespace-nowrap bg-transparent hover:bg-white/5 text-white/60 hover:text-white border border-white/20 rounded-xl px-4 py-2.5 md:px-6 md:py-3 text-sm transition-all cursor-pointer">
          Saiba mais
        </button>
      </motion.div>

      {/* Stats */}
      <motion.div
        variants={fadeUp} initial="hidden" animate="visible" custom={0.7}
        className="flex flex-col md:flex-row gap-2 md:gap-8 mt-8 items-center justify-center w-full"
      >
        {[
          { id: "stat-concursos", label: "Concursos ativos" },
          { id: "stat-vagas", label: "Vagas disponíveis" },
          { id: "stat-fontes", label: "Fontes monitoradas" },
        ].map((s, i) => (
          <div key={s.id} className="flex items-stretch gap-8">
            {i > 0 && <div className="hidden md:block w-px bg-white/10" />}
            <div className="flex flex-col gap-0.5">
              <span id={s.id} className="text-2xl font-bold text-white" style={{ fontFamily: "'Syne', sans-serif" }}>0</span>
              <span className="text-xs text-white/30 tracking-wide">{s.label}</span>
            </div>
          </div>
        ))}
      </motion.div>
    </div>
  );
};

export default Hero;