import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { componentTagger } from "lovable-tagger";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  server: {
    host: "::",
    port: 8081,

    // 🔥 Add this block for proxying API calls to backend
    proxy: {
      '/user': 'http://localhost:8080',
      '/restaurant': 'http://localhost:8080',
      '/cart': 'http://localhost:8080',
      '/delivery': 'http://localhost:8080',
      '/review': 'http://localhost:8080',
      '/announcements': 'http://localhost:8080',
      '/notify': 'http://localhost:8080',
    },
  },
  plugins: [
    react(),
    mode === 'development' && componentTagger(),
  ].filter(Boolean),
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
}));
