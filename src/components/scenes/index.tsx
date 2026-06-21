// src/components/scenes/index.tsx

export interface Scene {
  label: string;
  render: (el: HTMLDivElement) => () => void;
}

export const scenes: Scene[] = [
  {
    label: "🐉 dragão voando",
    render(el) {
      el.innerHTML = `
        <svg width="100%" height="150" viewBox="0 0 300 150" fill="none">
          <g id="dragon">
            <ellipse cx="160" cy="80" rx="38" ry="18" fill="#1D9E75" opacity="0.85"/>
            <circle cx="198" cy="74" r="14" fill="#1D9E75" opacity="0.9"/>
            <circle cx="208" cy="70" r="5" fill="#085041"/>
            <circle cx="210" cy="68" r="2" fill="#9FE1CB"/>
            <path d="M198 62 L202 52 L206 62" fill="#0F6E56"/>
            <path d="M198 62 L194 50 L200 62" fill="#0F6E56"/>
            <path d="M122 80 Q100 60 80 75 Q100 78 122 85Z" fill="#0F6E56" opacity="0.8"/>
            <path d="M122 80 Q100 95 85 88 Q105 86 122 85Z" fill="#085041" opacity="0.7"/>
            <ellipse cx="148" cy="90" rx="12" ry="6" fill="#0F6E56" opacity="0.7"/>
            <path d="M160 95 Q170 110 155 118 Q162 108 158 98Z" fill="#0F6E56"/>
          </g>
          <g id="fire" opacity="0">
            <ellipse cx="220" cy="72" rx="18" ry="7" fill="#EF9F27" opacity="0.8"/>
            <ellipse cx="232" cy="72" rx="10" ry="4" fill="#FAC775" opacity="0.9"/>
          </g>
        </svg>`;
      let t = 0, fireT = 0;
      let animId: number;
      function anim() {
        t += 0.03; fireT++;
        const g = el.querySelector<SVGGElement>("#dragon")!;
        const f = el.querySelector<SVGGElement>("#fire")!;
        g.setAttribute("transform", `translate(${Math.sin(t) * 12},${Math.cos(t * 0.7) * 8})`);
        f.style.opacity = fireT % 60 < 20 ? "1" : "0";
        animId = requestAnimationFrame(anim);
      }
      anim();
      return () => cancelAnimationFrame(animId);
    },
  },
  {
    label: "🥊 boneco lutando",
    render(el) {
      el.innerHTML = `
        <svg width="100%" height="150" viewBox="0 0 300 150" fill="none">
          <circle cx="100" cy="40" r="12" fill="#3a4f6e"/>
          <rect x="92" y="52" width="16" height="32" rx="6" fill="#2a3a52"/>
          <g id="fa1r"><rect x="100" y="56" width="24" height="10" rx="5" fill="#1D9E75"/></g>
          <rect x="94" y="84" width="6" height="28" rx="3" fill="#2a3a52"/>
          <rect x="100" y="84" width="6" height="28" rx="3" fill="#2a3a52"/>
          <circle cx="200" cy="40" r="12" fill="#3a4f6e"/>
          <rect x="192" y="52" width="16" height="32" rx="6" fill="#2a3a52"/>
          <g id="fa2l"><rect x="176" y="56" width="24" height="10" rx="5" fill="#0F6E56"/></g>
          <rect x="194" y="84" width="6" height="28" rx="3" fill="#2a3a52"/>
          <rect x="200" y="84" width="6" height="28" rx="3" fill="#2a3a52"/>
          <text id="hit" x="150" y="70" text-anchor="middle" font-size="22"
            fill="#FAC775" font-weight="bold" opacity="0">POW!</text>
          <line x1="150" y1="20" x2="150" y2="115"
            stroke="rgba(255,255,255,.08)" stroke-width="1" stroke-dasharray="4,4"/>
        </svg>`;
      let t = 0, hit = 0, animId: number;
      function anim() {
        t += 0.06; hit++;
        const a1 = el.querySelector<SVGGElement>("#fa1r")!;
        const a2 = el.querySelector<SVGGElement>("#fa2l")!;
        const htxt = el.querySelector<SVGTextElement>("#hit")!;
        const punch = Math.max(0, Math.sin(t * 2));
        a1.setAttribute("transform", `translate(${punch * 18},0)`);
        a2.setAttribute("transform", `translate(${-punch * 18},0)`);
        if (hit % 80 === 40) {
          htxt.style.opacity = "1";
          setTimeout(() => (htxt.style.opacity = "0"), 300);
        }
        animId = requestAnimationFrame(anim);
      }
      anim();
      return () => cancelAnimationFrame(animId);
    },
  },
  {
    label: "🚀 foguete decolando",
    render(el) {
      el.innerHTML = `
        <svg width="100%" height="150" viewBox="0 0 300 150" fill="none">
          <g id="rocket">
            <ellipse cx="150" cy="55" rx="14" ry="28" fill="#3a4f6e"/>
            <ellipse cx="150" cy="32" rx="14" ry="16" fill="#1D9E75"/>
            <rect x="136" y="72" width="28" height="16" rx="4" fill="#2a3a52"/>
            <polygon points="136,72 124,88 136,88" fill="#0F6E56"/>
            <polygon points="164,72 176,88 164,88" fill="#0F6E56"/>
            <circle cx="150" cy="58" r="7" fill="#085041"/>
            <circle cx="150" cy="58" r="4" fill="#9FE1CB" opacity="0.6"/>
            <g id="flame">
              <ellipse cx="150" cy="92" rx="7" ry="12" fill="#EF9F27" opacity="0.9"/>
              <ellipse cx="150" cy="96" rx="4" ry="8" fill="#FAC775"/>
            </g>
          </g>
          <circle id="s1" cx="60" cy="30" r="3" fill="#1D9E75" opacity="0.4"/>
          <circle id="s2" cx="240" cy="50" r="2" fill="#1D9E75" opacity="0.3"/>
          <circle id="s3" cx="90" cy="100" r="2" fill="#1D9E75" opacity="0.5"/>
          <circle id="s4" cx="220" cy="110" r="3" fill="#1D9E75" opacity="0.3"/>
        </svg>`;
      let t = 0, animId: number;
      function anim() {
        t += 0.04;
        const r = el.querySelector<SVGGElement>("#rocket")!;
        const f = el.querySelector<SVGGElement>("#flame")!;
        r.setAttribute("transform", `translate(${Math.sin(t) * 8},${Math.sin(t * 1.3) * 6})`);
        f.setAttribute("transform", `scale(1,${0.8 + Math.sin(t * 6) * 0.3})`);
        ["s1", "s2", "s3", "s4"].forEach((id, i) => {
          const s = el.querySelector<SVGCircleElement>(`#${id}`)!;
          s.style.opacity = String(0.2 + Math.abs(Math.sin(t + i)) * 0.5);
        });
        animId = requestAnimationFrame(anim);
      }
      anim();
      return () => cancelAnimationFrame(animId);
    },
  },
  {
    label: "🏆 troféu brilhando",
    render(el) {
      el.innerHTML = `
        <svg width="100%" height="150" viewBox="0 0 300 150" fill="none">
          <g id="trophy" transform="translate(110,10)">
            <rect x="25" y="90" width="30" height="8" rx="2" fill="#BA7517"/>
            <rect x="18" y="98" width="44" height="8" rx="3" fill="#BA7517"/>
            <rect x="33" y="70" width="14" height="22" rx="2" fill="#EF9F27"/>
            <path d="M10 20 Q10 65 40 70 Q70 65 70 20 Z" fill="#EF9F27"/>
            <path d="M10 20 Q0 20 0 35 Q0 55 15 58"
              stroke="#BA7517" stroke-width="5" fill="none" stroke-linecap="round"/>
            <path d="M70 20 Q80 20 80 35 Q80 55 65 58"
              stroke="#BA7517" stroke-width="5" fill="none" stroke-linecap="round"/>
            <text x="40" y="52" text-anchor="middle" font-size="24" fill="#633806">1</text>
          </g>
          <circle id="sp1" cx="130" cy="30" r="3" fill="#FAC775" opacity="0"/>
          <circle id="sp2" cx="175" cy="20" r="2" fill="#FAC775" opacity="0"/>
          <circle id="sp3" cx="190" cy="45" r="3" fill="#EF9F27" opacity="0"/>
          <circle id="sp4" cx="115" cy="50" r="2" fill="#FAC775" opacity="0"/>
          <circle id="sp5" cx="200" cy="30" r="2" fill="#EF9F27" opacity="0"/>
        </svg>`;
      let t = 0, animId: number;
      function anim() {
        t += 0.05;
        const trophy = el.querySelector<SVGGElement>("#trophy")!;
        trophy.setAttribute("transform", `translate(110,10) rotate(${Math.sin(t) * 5},40,55)`);
        ["sp1", "sp2", "sp3", "sp4", "sp5"].forEach((id, i) => {
          const s = el.querySelector<SVGCircleElement>(`#${id}`)!;
          s.style.opacity = String(Math.max(0, Math.sin(t * 2 + i * 1.2)));
        });
        animId = requestAnimationFrame(anim);
      }
      anim();
      return () => cancelAnimationFrame(animId);
    },
  },
  {
    label: "📄 documentos voando",
    render(el) {
      el.innerHTML = `
        <svg width="100%" height="150" viewBox="0 0 300 150" fill="none">
          <g id="doc1">
            <rect x="80" y="40" width="40" height="52" rx="4" fill="#1a2535" stroke="#1D9E75" stroke-width="1"/>
            <rect x="87" y="54" width="26" height="3" rx="1" fill="#1D9E75" opacity="0.5"/>
            <rect x="87" y="62" width="20" height="3" rx="1" fill="#1D9E75" opacity="0.3"/>
            <rect x="87" y="70" width="24" height="3" rx="1" fill="#1D9E75" opacity="0.4"/>
            <path d="M100 40 L100 30 L112 40Z" fill="#0F6E56"/>
          </g>
          <g id="doc2">
            <rect x="170" y="55" width="36" height="48" rx="4" fill="#1a2535" stroke="#0F6E56" stroke-width="1"/>
            <rect x="177" y="68" width="22" height="3" rx="1" fill="#1D9E75" opacity="0.4"/>
            <rect x="177" y="76" width="16" height="3" rx="1" fill="#1D9E75" opacity="0.3"/>
            <path d="M188 55 L188 46 L198 55Z" fill="#085041"/>
          </g>
          <g id="lupa">
            <circle cx="230" cy="85" r="20" stroke="#1D9E75" stroke-width="3" fill="none" opacity="0.7"/>
            <line x1="244" y1="100" x2="256" y2="114"
              stroke="#1D9E75" stroke-width="4" stroke-linecap="round" opacity="0.7"/>
          </g>
        </svg>`;
      let t = 0, animId: number;
      function anim() {
        t += 0.025;
        el.querySelector<SVGGElement>("#doc1")!
          .setAttribute("transform", `translate(${Math.sin(t) * 10},${Math.cos(t * 0.8) * 8}) rotate(${Math.sin(t) * 6},100,66)`);
        el.querySelector<SVGGElement>("#doc2")!
          .setAttribute("transform", `translate(${Math.cos(t) * 8},${Math.sin(t * 1.1) * 6}) rotate(${Math.cos(t) * 5},188,79)`);
        el.querySelector<SVGGElement>("#lupa")!
          .setAttribute("transform", `translate(${Math.cos(t * 0.7) * 5},${Math.sin(t * 0.9) * 5}) rotate(${Math.sin(t) * 8},230,85)`);
        animId = requestAnimationFrame(anim);
      }
      anim();
      return () => cancelAnimationFrame(animId);
    },
  },
];