// src/__tests__/unit/components/ConcursoCard.test.tsx
import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import ConcursoCard from "../../../components/ConcursoCard";
import type { Concurso } from "../../../types/concurso";

const concursoMock: Concurso = {
  concursoId: "123",
  titulo: "Analista de TI - INSS",
  orgao: "INSS",
  area: "Tecnologia",
  estado: "AL",
  cidade: "Maceió",
  vagas: "10",
  nivel: "Superior",
  salario: 5000,
  status: "Aberto",
  dataPublicacao: "2026-05-24T00:00:00Z",
  link: "https://example.com",
  fonte: "PCIConcursos",
  extras: {},
};

describe("ConcursoCard", () => {

  it("deve renderizar o titulo do concurso", () => {
    render(<ConcursoCard concurso={concursoMock} />);
    expect(screen.getByText(/Analista de TI/i)).toBeInTheDocument();
  });

  it("deve renderizar o orgao do concurso", () => {
    render(<ConcursoCard concurso={concursoMock} />);
    const elementos = screen.getAllByText(/INSS/i);
    expect(elementos.length).toBeGreaterThan(0);
  });

  it("deve renderizar o numero de vagas", () => {
    render(<ConcursoCard concurso={concursoMock} />);
    expect(screen.getByText(/10 vagas/i)).toBeInTheDocument();
  });

  it("deve renderizar o badge de status Aberto", () => {
    render(<ConcursoCard concurso={concursoMock} />);
    expect(screen.getByText("Aberto")).toBeInTheDocument();
  });

  it("deve renderizar o botao Ver edital", () => {
    render(<ConcursoCard concurso={concursoMock} />);
    expect(screen.getByText(/ver edital/i)).toBeInTheDocument();
  });

  it("nao deve renderizar badge de status quando status for vazio", () => {
    render(<ConcursoCard concurso={{ ...concursoMock, status: "" }} />);
    expect(screen.queryByText("Aberto")).not.toBeInTheDocument();
    expect(screen.queryByText("Previsto")).not.toBeInTheDocument();
    expect(screen.queryByText("Encerrado")).not.toBeInTheDocument();
  });

  it("nao deve renderizar vagas quando for zero", () => {
    render(<ConcursoCard concurso={{ ...concursoMock, vagas: "0" }} />);
    expect(screen.queryByText(/0 vagas/i)).not.toBeInTheDocument();
  });

  it("deve renderizar a fonte do concurso", () => {
    render(<ConcursoCard concurso={concursoMock} />);
    expect(screen.getByText(/PCIConcursos/i)).toBeInTheDocument();
  });

  it("deve renderizar a area do concurso", () => {
    render(<ConcursoCard concurso={concursoMock} />);
    expect(screen.getByText(/Tecnologia/i)).toBeInTheDocument();
  });

  it("deve renderizar o nivel do concurso", () => {
    render(<ConcursoCard concurso={concursoMock} />);
    expect(screen.getByText(/Superior/i)).toBeInTheDocument();
  });
});