// playwright.global-setup.ts
import { FullConfig } from "@playwright/test";

const API_URL = process.env.VITE_API_URL ?? "http://localhost:5000";
const MAX_TENTATIVAS = 30;
const INTERVALO_MS = 2000;

async function aguardarBackend() {
  for (let tentativa = 1; tentativa <= MAX_TENTATIVAS; tentativa++) {
    try {
      const res = await fetch(`${API_URL}/health`);
      if (res.ok) {
        console.log(`✅ Backend respondendo (tentativa ${tentativa})`);
        return;
      }
    } catch {
      // ainda não subiu, tenta de novo
    }
    console.log(`⏳ Aguardando backend... (tentativa ${tentativa}/${MAX_TENTATIVAS})`);
    await new Promise(r => setTimeout(r, INTERVALO_MS));
  }
  throw new Error("❌ Backend não respondeu dentro do tempo esperado.");
}

async function validarDadosDisponiveis() {
  const res = await fetch(`${API_URL}/api/Concurso?pageSize=1`);
  if (!res.ok) {
    throw new Error(`❌ API de Concurso retornou erro: ${res.status}`);
  }
  const data = await res.json();
  const total = data.totalCount ?? data.length ?? 0;

  if (total === 0) {
    throw new Error(
      "❌ Nenhum concurso encontrado no banco. Os testes E2E de cards exigem dados populados. " +
      "Rode o job do Hangfire (ou seed) antes de executar os testes."
    );
  }

  console.log(`✅ ${total} concurso(s) encontrado(s) no banco.`);
}

export default async function globalSetup(config: FullConfig) {
  await aguardarBackend();
  await validarDadosDisponiveis();
}