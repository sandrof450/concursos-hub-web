// src/__tests__/unit/components/Paginacao.test.tsx
import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import Paginacao from "../../../components/Paginacao";

describe("Paginacao", () => {

  const defaultProps = {
    currentPage: 1,
    totalPages: 5,
    totalCount: 50,
    pageSize: 10,
    onPageChange: vi.fn(),
  };

  it("deve renderizar os botoes de pagina", () => {
    render(<Paginacao {...defaultProps} />);
    expect(screen.getByText("1")).toBeInTheDocument();
    expect(screen.getByText("2")).toBeInTheDocument();
  });

  it("deve chamar onPageChange ao clicar em proxima pagina", () => {
    const onPageChange = vi.fn();
    render(<Paginacao {...defaultProps} onPageChange={onPageChange} />);
    fireEvent.click(screen.getByLabelText("Próxima página"));
    expect(onPageChange).toHaveBeenCalledWith(2);
  });

  it("deve chamar onPageChange ao clicar em pagina anterior", () => {
    const onPageChange = vi.fn();
    render(<Paginacao {...defaultProps} currentPage={3} onPageChange={onPageChange} />);
    fireEvent.click(screen.getByLabelText("Página anterior"));
    expect(onPageChange).toHaveBeenCalledWith(2);
  });

  it("deve desabilitar botao anterior na primeira pagina", () => {
    render(<Paginacao {...defaultProps} currentPage={1} />);
    expect(screen.getByLabelText("Página anterior")).toBeDisabled();
  });

  it("deve desabilitar botao proximo na ultima pagina", () => {
    render(<Paginacao {...defaultProps} currentPage={5} />);
    expect(screen.getByLabelText("Próxima página")).toBeDisabled();
  });

  it("deve exibir informacao de registros", () => {
    render(<Paginacao {...defaultProps} />);
    expect(screen.getByText(/Mostrando/i)).toBeInTheDocument();
    expect(screen.getByText(/concursos/i)).toBeInTheDocument();
  });

  it("nao deve renderizar quando totalPages for 1", () => {
    const { container } = render(<Paginacao {...defaultProps} totalPages={1} totalCount={5} />);
    expect(container.firstChild).toBeNull();
  });

  it("deve chamar onPageChange ao clicar em numero de pagina", () => {
    const onPageChange = vi.fn();
    render(<Paginacao {...defaultProps} onPageChange={onPageChange} />);
    fireEvent.click(screen.getByText("3"));
    expect(onPageChange).toHaveBeenCalledWith(3);
  });
});