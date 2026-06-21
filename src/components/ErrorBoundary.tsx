// src/components/ErrorBoundary.tsx
import { Component, type ReactNode } from "react";

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error) {
    console.error("ErrorBoundary capturou:", error);
  }

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) return this.props.fallback;

      return (
        <div className="flex flex-col items-center justify-center min-h-[300px] gap-4 text-center px-8">
          <div className="w-14 h-14 bg-red-500/10 border border-red-500/20 rounded-2xl flex items-center justify-center">
            <i className="ti ti-alert-triangle text-red-400 text-2xl" aria-hidden="true" />
          </div>
          <div>
            <p className="text-white font-semibold mb-1" style={{ fontFamily: "'Syne', sans-serif" }}>
              Algo deu errado
            </p>
            <p className="text-white/40 text-sm">
              {this.state.error?.message ?? "Erro inesperado. Tente recarregar a página."}
            </p>
          </div>
          <button
            onClick={() => window.location.reload()}
            className="bg-white/[0.06] border border-white/10 rounded-lg px-4 py-2 text-sm text-white/60 hover:text-white hover:bg-white/10 transition-all"
          >
            <i className="ti ti-refresh text-sm mr-1.5" aria-hidden="true" />
            Recarregar página
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;