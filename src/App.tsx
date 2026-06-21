// src/App.tsx
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

import { ToastProvider } from "./contexts/ToastContext";

import { ROUTES, STALE_TIME } from "./constants";

import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import PageTransition from "./components/PageTransition";
import ErrorBoundary from "./components/ErrorBoundary";

import ConcursosPage from "./pages/ConcursosPage";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: STALE_TIME,
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
});

const App = () => (
  <QueryClientProvider client={queryClient}>
    <BrowserRouter>
      <ToastProvider>
        <div className="min-h-screen bg-[#060b11]">
          <Navbar />

          <main className="flex-1">
            <ErrorBoundary>
              <Routes>
                <Route
                  path={ROUTES.home}
                  element={
                    <PageTransition>
                      <ConcursosPage />
                    </PageTransition>
                } />

                <Route path={ROUTES.concursos}
                  element={
                    <PageTransition>
                      <ConcursosPage />
                    </PageTransition>
                } />
              </Routes>
            </ErrorBoundary>
          </main>

          <Footer />
        </div>
      </ToastProvider>
      
    </BrowserRouter>
  </QueryClientProvider>
);

export default App;