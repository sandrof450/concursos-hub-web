// src/components/TypingCharacter.tsx
import { useEffect, useRef } from "react";

interface Props { isTyping: boolean }

const TypingCharacter = ({ isTyping }: Props) => {
  const armLRef = useRef<SVGGElement>(null);
  const armRRef = useRef<SVGGElement>(null);
  const mouthRef = useRef<SVGPathElement>(null);
  const sl1Ref = useRef<SVGRectElement>(null);
  const frameRef = useRef(0);
  const animRef = useRef<number>(0);

  useEffect(() => {
    if (isTyping) {
      frameRef.current = 0;
      function animate() {
        frameRef.current++;
        const t = frameRef.current * 0.18;
        armLRef.current?.setAttribute("transform", `rotate(${Math.sin(t * 3) * 10},65,98)`);
        armRRef.current?.setAttribute("transform", `rotate(${-Math.sin(t * 3) * 10},95,98)`);
        sl1Ref.current?.setAttribute("width", String(Math.round(20 + Math.abs(Math.sin(t * 2)) * 35)));
        mouthRef.current?.setAttribute("d", `M75 81 Q80 ${85 + Math.sin(t * 2) * 2} 85 81`);
        animRef.current = requestAnimationFrame(animate);
      }
      animate();
    } else {
      cancelAnimationFrame(animRef.current!);
      armLRef.current?.setAttribute("transform", "");
      armRRef.current?.setAttribute("transform", "");
      mouthRef.current?.setAttribute("d", "M75 81 Q80 85 85 81");
    }
    return () => cancelAnimationFrame(animRef.current!);
  }, [isTyping]);

  return (
    <svg width="100" height="90" viewBox="0 0 160 140" fill="none"
      className="w-24 md:w-32"
    >
      <rect x="10" y="118" width="140" height="8" rx="4" fill="#1a2535"/>
      <rect x="30" y="126" width="8" height="20" rx="2" fill="#1a2535"/>
      <rect x="122" y="126" width="8" height="20" rx="2" fill="#1a2535"/>
      <rect x="38" y="70" width="84" height="52" rx="6" fill="#0d1824" stroke="#1D9E75" strokeWidth="1.5"/>
      <rect x="72" y="122" width="16" height="6" rx="2" fill="#1a2535"/>
      <rect x="60" y="126" width="40" height="4" rx="2" fill="#1a2535"/>
      <rect ref={sl1Ref} x="46" y="80" width="35" height="3" rx="1.5" fill="#1D9E75" opacity="0.6"/>
      <rect x="46" y="87" width="22" height="3" rx="1.5" fill="#1D9E75" opacity="0.4"/>
      <rect x="46" y="94" width="30" height="3" rx="1.5" fill="#1D9E75" opacity="0.3"/>
      <rect x="42" y="112" width="76" height="8" rx="3" fill="#1a2535"/>
      {[46,56,66,76,86,96,106].map(x => (
        <rect key={x} x={x} y="114" width="8" height="4" rx="1" fill="#243044"/>
      ))}
      <rect x="62" y="90" width="36" height="28" rx="10" fill="#2a3a52"/>
      <circle cx="80" cy="76" r="16" fill="#3a4f6e"/>
      <path d="M64 70 Q66 58 80 60 Q94 58 96 70" fill="#1a2535"/>
      <rect x="70" y="71" width="9" height="6" rx="3" stroke="#1D9E75" strokeWidth="1" fill="none" opacity="0.6"/>
      <rect x="81" y="71" width="9" height="6" rx="3" stroke="#1D9E75" strokeWidth="1" fill="none" opacity="0.6"/>
      <line x1="79" y1="74" x2="81" y2="74" stroke="#1D9E75" strokeWidth="1" opacity="0.6"/>
      <circle cx="75" cy="74" r="2" fill="#1D9E75" opacity="0.85"/>
      <circle cx="85" cy="74" r="2" fill="#1D9E75" opacity="0.85"/>
      <path ref={mouthRef} d="M75 81 Q80 85 85 81" stroke="#1D9E75" strokeWidth="1.5" strokeLinecap="round" fill="none"/>
      <g ref={armLRef}>
        <path d="M65 98 Q52 106 50 112" stroke="#2a3a52" strokeWidth="7" strokeLinecap="round"/>
        <circle cx="50" cy="113" r="4" fill="#3a4f6e"/>
      </g>
      <g ref={armRRef}>
        <path d="M95 98 Q108 106 110 112" stroke="#2a3a52" strokeWidth="7" strokeLinecap="round"/>
        <circle cx="110" cy="113" r="4" fill="#3a4f6e"/>
      </g>
    </svg>
  );
};

export default TypingCharacter;