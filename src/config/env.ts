// src/config/env.ts

declare global {
  interface Window {
    __ENV__?: {
      VITE_API_URL?: string;
    };
  }
}

export const env = {
  apiUrl: window.__ENV__?.VITE_API_URL || (import.meta.env.VITE_API_URL as string),
} as const;