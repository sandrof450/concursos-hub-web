// src/__tests__/unit/components/EstadoAutocomplete.test.tsx
import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import EstadoAutocomplete from "../../../components/EstadoAutocomplete";

const queryClient = new QueryClient({
  defaultOptions: { queries: { retry: false } },
});

const Wrapper = ({ children }: { children: React.ReactNode }) => (
  <QueryClientProvider client={queryClient}>
    {children}
  </QueryClientProvider>
);

const renderComponent = (value: string[] = [], onChange = vi.fn()) =>
  render(
    <EstadoAutocomplete value={value} onChange={onChange} />,
    { wrapper: Wrapper }
  );

describe("EstadoAutocomplete", () => {

  it("deve renderizar o placeholder quando nao ha selecao", () => {
    renderComponent();
    expect(screen.getByText(/selecione um ou mais estados/i)).toBeInTheDocument();
  });

  it("deve abrir o dropdown ao clicar no trigger", () => {
    renderComponent();
    fireEvent.click(screen.getByText(/selecione um ou mais estados/i));
    expect(screen.getByPlaceholderText(/buscar estado/i)).toBeInTheDocument();
  });

  it("deve filtrar estados ao digitar na busca", async () => {
    renderComponent();
    fireEvent.click(screen.getByText(/selecione um ou mais estados/i));
    const input = screen.getByPlaceholderText(/buscar estado/i);
    fireEvent.change(input, { target: { value: "São Paulo" } });
    await waitFor(() => {
      expect(screen.getByText("São Paulo")).toBeInTheDocument();
    });
  });

  it("deve exibir chips dos estados selecionados", () => {
    renderComponent(["SP", "AL"]);
    expect(screen.getByText("São Paulo")).toBeInTheDocument();
    expect(screen.getByText("Alagoas")).toBeInTheDocument();
  });

  it("deve exibir mensagem quando nenhum estado for encontrado", async () => {
    renderComponent();
    fireEvent.click(screen.getByText(/selecione um ou mais estados/i));
    const input = screen.getByPlaceholderText(/buscar estado/i);
    fireEvent.change(input, { target: { value: "xxxxx" } });
    await waitFor(() => {
      expect(screen.getByText(/nenhum estado encontrado/i)).toBeInTheDocument();
    });
  });

  it("deve fechar o dropdown ao pressionar Escape", () => {
    renderComponent();
    fireEvent.click(screen.getByText(/selecione um ou mais estados/i));
    expect(screen.getByPlaceholderText(/buscar estado/i)).toBeInTheDocument();
    fireEvent.keyDown(screen.getByPlaceholderText(/buscar estado/i), { key: "Escape" });
    expect(screen.queryByPlaceholderText(/buscar estado/i)).not.toBeInTheDocument();
  });

  it("deve exibir contador de selecionados no footer", () => {
    renderComponent(["SP", "AL"]);
    fireEvent.click(screen.getByText("São Paulo"));
    expect(screen.getByText(/2 selecionados/i)).toBeInTheDocument();
  });
});