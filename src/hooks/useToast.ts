// src/hooks/useToast.ts
import { useState, useCallback } from "react";

import { TOAST_DURATION } from "../constants";

export type ToastType = "success" | "error" | "info";

export interface ToastItem {
  id: number;
  type: ToastType;
  title: string;
  message: string;
}

const useToast = () => {
  const [toasts, setToasts] = useState<ToastItem[]>([]);

  const removeToast = useCallback((id: number) => {
    setToasts(t => t.filter(toast => toast.id !== id));
  }, []);

  const showToast = useCallback((type: ToastType, title: string, message: string) => {
    const id = Date.now();
    setToasts(t => [...t, { id, type, title, message }]);
    setTimeout(() => removeToast(id), TOAST_DURATION);
  }, []);

  

  return { toasts, showToast, removeToast };
};

export default useToast;