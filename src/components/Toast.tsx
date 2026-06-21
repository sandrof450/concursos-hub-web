// src/components/Toast.tsx
import { useEffect, useState } from "react";
import type { ToastItem } from "../hooks/useToast";

interface Props {
  toast: ToastItem;
  onRemove: (id: number) => void;
}

const config = {
  success: {
    container: { background: "#071a12", borderColor: "rgba(29,158,117,.3)", color: "#9FE1CB" },
    icon:      { background: "rgba(29,158,117,.15)", color: "#1D9E75" },
    progress:  "#1D9E75",
    iconName:  "ti-circle-check",
  },
  error: {
    container: { background: "#1a0707", borderColor: "rgba(239,68,68,.3)", color: "#fca5a5" },
    icon:      { background: "rgba(239,68,68,.12)", color: "#ef4444" },
    progress:  "#ef4444",
    iconName:  "ti-alert-circle",
  },
  info: {
    container: { background: "#070f1a", borderColor: "rgba(59,130,246,.3)", color: "#93c5fd" },
    icon:      { background: "rgba(59,130,246,.12)", color: "#3b82f6" },
    progress:  "#3b82f6",
    iconName:  "ti-info-circle",
  },
};

const Toast = ({ toast, onRemove }: Props) => {
  const [hiding, setHiding] = useState(false);
  const c = config[toast.type];

  const handleRemove = () => {
    setHiding(true);
    setTimeout(() => onRemove(toast.id), 250);
  };

  useEffect(() => {
    const t = setTimeout(handleRemove, 3000);
    return () => clearTimeout(t);
  }, []);

  return (
    <div
      style={{
        ...c.container,
        border: `0.5px solid ${c.container.borderColor}`,
        borderRadius: "12px",
        padding: "12px 16px",
        display: "flex",
        alignItems: "center",
        gap: "10px",
        minWidth: "280px",
        maxWidth: "360px",
        position: "relative",
        overflow: "hidden",
        fontFamily: "'DM Sans', sans-serif",
        animation: hiding
          ? "toastOut .25s ease forwards"
          : "toastIn .3s cubic-bezier(.34,1.56,.64,1) forwards",
      }}
    >
      {/* ícone */}
      <div style={{
        ...c.icon,
        width: "28px", height: "28px",
        borderRadius: "8px",
        display: "flex", alignItems: "center", justifyContent: "center",
        flexShrink: 0, fontSize: "15px",
      }}>
        <i className={`ti ${c.iconName}`} aria-hidden="true" />
      </div>

      {/* texto */}
      <div style={{ flex: 1 }}>
        <div style={{ fontWeight: 500, fontSize: "13px", marginBottom: "1px" }}>
          {toast.title}
        </div>
        <div style={{ fontSize: "12px", opacity: 0.7 }}>
          {toast.message}
        </div>
      </div>

      {/* fechar */}
      <button
        onClick={handleRemove}
        aria-label="Fechar notificação"
        style={{ background: "none", border: "none", cursor: "pointer", color: "rgba(255,255,255,.3)", fontSize: "16px", padding: 0, lineHeight: 1 }}
      >
        <i className="ti ti-x" aria-hidden="true" />
      </button>

      {/* barra de progresso */}
      <div style={{
        position: "absolute", bottom: 0, left: 0,
        height: "2px", background: c.progress,
        borderRadius: "0 0 12px 12px",
        animation: "toastProgress 3s linear forwards",
      }} />

      <style>{`
        @keyframes toastIn { from { opacity:0; transform:translateX(100%) } to { opacity:1; transform:translateX(0) } }
        @keyframes toastOut { from { opacity:1; transform:translateX(0) } to { opacity:0; transform:translateX(100%) } }
        @keyframes toastProgress { from { width:100% } to { width:0% } }
      `}</style>
    </div>
  );
};

export default Toast;