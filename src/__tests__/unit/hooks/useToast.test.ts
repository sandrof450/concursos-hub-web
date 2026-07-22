// src/__tests__/unit/hooks/useToast.test.ts
import { describe, it, expect, vi, beforeEach } from "vitest";
import { renderHook, act } from "@testing-library/react";
import useToast from "../../../hooks/useToast";

describe("useToast", () => {

  beforeEach(() => {
    vi.useFakeTimers();
  });

  it("deve iniciar com lista vazia", () => {
    const { result } = renderHook(() => useToast());
    expect(result.current.toasts).toHaveLength(0);
  });

  it("deve adicionar toast ao chamar showToast", () => {
    const { result } = renderHook(() => useToast());

    act(() => {
      result.current.showToast("success", "Título", "Mensagem");
    });

    expect(result.current.toasts).toHaveLength(1);
    expect(result.current.toasts[0].type).toBe("success");
    expect(result.current.toasts[0].title).toBe("Título");
    expect(result.current.toasts[0].message).toBe("Mensagem");
  });

  it("deve remover toast ao chamar removeToast", () => {
    const { result } = renderHook(() => useToast());

    act(() => {
      result.current.showToast("success", "Título", "Mensagem");
    });

    const id = result.current.toasts[0].id;

    act(() => {
      result.current.removeToast(id);
    });

    expect(result.current.toasts).toHaveLength(0);
  });

  it("deve remover toast automaticamente apos 3 segundos", () => {
    const { result } = renderHook(() => useToast());

    act(() => {
      result.current.showToast("success", "Título", "Mensagem");
    });

    expect(result.current.toasts).toHaveLength(1);

    act(() => {
      vi.advanceTimersByTime(3000);
    });

    expect(result.current.toasts).toHaveLength(0);
  });

  it("deve adicionar multiplos toasts", () => {
    const { result } = renderHook(() => useToast());

    act(() => {
      result.current.showToast("success", "Toast 1", "Mensagem 1");
      result.current.showToast("error", "Toast 2", "Mensagem 2");
      result.current.showToast("info", "Toast 3", "Mensagem 3");
    });

    expect(result.current.toasts).toHaveLength(3);
  });
});