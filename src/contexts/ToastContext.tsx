// src/contexts/ToastContext.tsx
import React from "react";

import type { ToastItem, ToastType } from "../hooks/useToast";

import { createContext, useContext, useState, useCallback } from "react";


interface ToastContextType {
  toasts: ToastItem[];
  showToast: (type: ToastType, title: string, message: string) => void;
  removeToast: (id: number) => void;
}

const ToastContext = createContext<ToastContextType | null>(null);

export const ToastProvider = ({ children }: { children: React.ReactNode }) => {
  const [toasts, setToasts] = useState<ToastItem[]>([]);

  const removeToast = useCallback((id: number) => {
    setToasts(t => t.filter(toast => toast.id !== id));
  }, []);

  const showToast = useCallback((type: ToastType, title: string, message: string) => {
    const id = Date.now();
    setToasts(t => [...t, { id, type, title, message }]);
    setTimeout(() => removeToast(id), 3000);
  }, [removeToast]);

  return (
    <ToastContext.Provider value={{ toasts, showToast, removeToast }}>
      {children}
    </ToastContext.Provider>
  );
  
};

// eslint-disable-next-line react-refresh/only-export-components
export const useToastContext = () => {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error("useToastContext deve ser usado dentro do ToastProvider");
  return ctx;
};