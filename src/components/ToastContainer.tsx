// src/components/ToastContainer.tsx
import { useToastContext } from "../contexts/ToastContext";
import Toast from "./Toast";


const ToastContainer = () => { 
  const { toasts, removeToast } = useToastContext();
  
  return (
    <div style={{
      position: "fixed", bottom: "24px", right: "24px",
      display: "flex", flexDirection: "column", gap: "8px",
      zIndex: 9999, pointerEvents: "none",
    }}>
      {toasts.map(toast => (
        <div key={toast.id} style={{ pointerEvents: "all" }}>
          <Toast toast={toast} onRemove={removeToast} />
        </div>
      ))}
    </div>
  );

}

export default ToastContainer;