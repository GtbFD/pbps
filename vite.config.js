import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    // ADICIONE ESTA SEÇÃO DE PROXY
    proxy: {
      // Quando o Vite vê '/api', ele o substitui pelo target
      "/modulo-pesquisa-preco": {
        target: "https://dadosabertos.compras.gov.br",
        changeOrigin: true, // Necessário para host baseados em nomes
        secure: true, // Usar true se o target for HTTPS (como é o caso)
        // O rewrite remove '/api' da URL final, mas aqui você quer manter a primeira parte do caminho
        // Se você usar o caminho completo no proxy, não precisa de rewrite.
      },
    },
  },
});
