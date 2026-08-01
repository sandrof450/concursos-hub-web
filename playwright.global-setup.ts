// playwright.global-setup.ts
/// <reference types="node" />
import { FullConfig } from "@playwright/test";

const API_URL = process.env.VITE_API_URL ?? "http://localhost:5000";
const CONCURSO_API_KEY = process.env.CONCURSO_API_KEY ?? "";
const TIMEOUT_BACKEND_MS = 60_000;
const INTERVALO_MS = 2000;

async function aguardarComPrazo(
  nome: string,
  timeoutMs: number,
  verificar: () => Promise<boolean>
) {
  const prazoFinal = Date.now() + timeoutMs;
  let tentativa = 0;

  while (Date.now() < prazoFinal) {
    tentativa++;
    try {
      if (await verificar()) {
        console.log(`✅ ${nome} pronto (tentativa ${tentativa})`);
        return;
      }
    } catch {
      // ainda não está pronto, segue tentando
    }
    console.log(`⏳ Aguardando ${nome}... (tentativa ${tentativa})`);
    await new Promise(r => setTimeout(r, INTERVALO_MS));
  }

  throw new Error(
    `❌ ${nome} não ficou pronto em ${timeoutMs / 1000}s. Abortando testes.`
  );
}

async function backendEstaNoAr(): Promise<boolean> {
  const res = await fetch(`${API_URL}/health`);
  return res.ok;
}

async function contarConcursos(): Promise<number> {
  const res = await fetch(`${API_URL}/api/Concurso?pageSize=1`);
  if (!res.ok) return 0;
  const data = await res.json();
  return data.totalCount ?? data.length ?? 0;
}

async function garantirDadosDisponiveis(): Promise<void> {
  const totalInicial = await contarConcursos();

  if (totalInicial > 0) {
    console.log(`✅ ${totalInicial} concurso(s) já disponível(is) no banco.`);
    return;
  }

  console.log("📦 Banco vazio, disparando CreateConcurso...");

  const res = await fetch(`${API_URL}/api/Concurso`, {
    method: "POST",
    headers: { "X-Api-Key": CONCURSO_API_KEY },
  });

  if (!res.ok) {
    const corpo = await res.text().catch(() => "(sem corpo)");
    throw new Error(`❌ Falha ao executar CreateConcurso: ${res.status} ${res.statusText} — ${corpo}`);
  }

  if (!res.ok) {
    throw new Error(`❌ Falha ao executar CreateConcurso: ${res.status} ${res.statusText}`);
  }

  const totalFinal = await contarConcursos();
  if (totalFinal === 0) {
    throw new Error("❌ CreateConcurso executou com sucesso, mas nenhum concurso foi populado no banco.");
  }

  console.log(`✅ ${totalFinal} concurso(s) populado(s) com sucesso.`);
}

export default async function globalSetup(config: FullConfig) {
  await aguardarComPrazo("backend", TIMEOUT_BACKEND_MS, backendEstaNoAr);
  await garantirDadosDisponiveis();
}