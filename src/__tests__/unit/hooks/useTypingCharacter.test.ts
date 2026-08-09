import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { renderHook, act } from "@testing-library/react";
import useTypingCharacter from "../../../hooks/useTypingCharacter";

const DEBOUNCE_MS = 600;
const MENSAGEM_PADRAO = "Oi! Me diz o que você procura...";

describe("useTypingCharacter", () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it("inicia com a bubble padrão e isTyping false", () => {
    const { result } = renderHook(() => useTypingCharacter());
    expect(result.current.isTyping).toBe(false);
    expect(result.current.bubble).toBe(MENSAGEM_PADRAO);
  });

  describe("fase 1 — resposta imediata ao digitar (valor preenchido)", () => {
    it.each([
      ["titulo", "Analista", 'Buscando por "Analista"...'],
      ["orgao", "INSS", "Órgão INSS, anotado!"],
      ["area", "Tecnologia", "Área Tecnologia, ótima escolha!"],
      ["fonte", "PCI Concursos", "Fonte PCI Concursos selecionada!"],
      ["estados", "SC, SP", "Estados SC, SP selecionados!"],
    ] as const)("campo %s: bubble atualiza na hora com o valor", (field, value, esperado) => {
      const { result } = renderHook(() => useTypingCharacter());
      act(() => result.current.onInput(field, value));
      expect(result.current.bubble).toBe(esperado);
    });

    it("seta isTyping true imediatamente, independente do campo", () => {
      const { result } = renderHook(() => useTypingCharacter());
      act(() => result.current.onInput("titulo", "Analista"));
      expect(result.current.isTyping).toBe(true);
    });
  });

  describe("fase 1 — valor vazio não altera a bubble ainda", () => {
    it.each(["titulo", "orgao", "area", "fonte", "estados"] as const)(
      "campo %s: bubble permanece inalterada ao chamar com string vazia",
      (field) => {
        const { result } = renderHook(() => useTypingCharacter());
        act(() => result.current.onInput(field, "Algo"));
        const bubbleAposDigitar = result.current.bubble;

        act(() => result.current.onInput(field, ""));
        expect(result.current.bubble).toBe(bubbleAposDigitar);
      }
    );

    it("mesmo com valor vazio, isTyping vai pra true na fase 1", () => {
      const { result } = renderHook(() => useTypingCharacter());
      act(() => result.current.onInput("titulo", ""));
      expect(result.current.isTyping).toBe(true);
    });
  });

  describe("fase 2 — após o debounce de 600ms", () => {
    it.each(["titulo", "orgao", "area", "fonte", "estados"] as const)(
      "campo %s: com valor preenchido, bubble vira 'Clique em Buscar...' e isTyping volta a false",
      (field) => {
        const { result } = renderHook(() => useTypingCharacter());
        act(() => result.current.onInput(field, "valor"));
        act(() => vi.advanceTimersByTime(DEBOUNCE_MS));

        expect(result.current.bubble).toBe('Clique em Buscar para encontrar "valor"');
        expect(result.current.isTyping).toBe(false);
      }
    );

    it.each(["titulo", "orgao", "area", "fonte", "estados"] as const)(
      "campo %s: com valor vazio, bubble volta para o texto padrão",
      (field) => {
        const { result } = renderHook(() => useTypingCharacter());
        act(() => result.current.onInput(field, ""));
        act(() => vi.advanceTimersByTime(DEBOUNCE_MS));

        expect(result.current.bubble).toBe(MENSAGEM_PADRAO);
        expect(result.current.isTyping).toBe(false);
      }
    );

    it("não dispara a fase 2 antes dos 600ms completarem", () => {
      const { result } = renderHook(() => useTypingCharacter());
      act(() => result.current.onInput("titulo", "Analista"));
      act(() => vi.advanceTimersByTime(599));

      expect(result.current.isTyping).toBe(true);
      expect(result.current.bubble).toBe('Buscando por "Analista"...');
    });
  });

  describe("debounce — chamadas sucessivas cancelam o timer anterior", () => {
    it("só aplica a fase 2 do último valor digitado", () => {
      const { result } = renderHook(() => useTypingCharacter());

      act(() => result.current.onInput("titulo", "A"));
      act(() => vi.advanceTimersByTime(300));
      act(() => result.current.onInput("titulo", "Analista"));
      act(() => vi.advanceTimersByTime(300));

      // ainda não passaram 600ms desde a última chamada
      expect(result.current.isTyping).toBe(true);

      act(() => vi.advanceTimersByTime(300));

      expect(result.current.isTyping).toBe(false);
      expect(result.current.bubble).toBe('Clique em Buscar para encontrar "Analista"');
    });

    it("trocar de campo no meio do debounce também reinicia o timer", () => {
      const { result } = renderHook(() => useTypingCharacter());

      act(() => result.current.onInput("titulo", "Analista"));
      act(() => vi.advanceTimersByTime(400));
      act(() => result.current.onInput("orgao", "INSS"));
      act(() => vi.advanceTimersByTime(400));

      expect(result.current.isTyping).toBe(true);

      act(() => vi.advanceTimersByTime(200));

      expect(result.current.bubble).toBe('Clique em Buscar para encontrar "INSS"');
    });
  });

  describe("regressão — bug messages['estados'] undefined", () => {
    it("não lança erro ao chamar onInput com field 'estados'", () => {
      const { result } = renderHook(() => useTypingCharacter());
      expect(() => act(() => result.current.onInput("estados", "RJ"))).not.toThrow();
    });

    it("formata múltiplos estados corretamente na fase 1", () => {
      const { result } = renderHook(() => useTypingCharacter());
      act(() => result.current.onInput("estados", "SC, SP, RJ"));
      expect(result.current.bubble).toBe("Estados SC, SP, RJ selecionados!");
    });
  });

  describe("cleanup", () => {
    it("limpa o timeout pendente ao desmontar o hook", () => {
      const clearTimeoutSpy = vi.spyOn(globalThis, "clearTimeout");
      const { result, unmount } = renderHook(() => useTypingCharacter());

      act(() => result.current.onInput("titulo", "Analista"));
      unmount();

      expect(clearTimeoutSpy).toHaveBeenCalled();
      clearTimeoutSpy.mockRestore();
    });
  });
});