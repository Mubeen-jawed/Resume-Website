import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    host: true,
    historyApiFallback: true,
    proxy: {
      "/api": {
        target: "https://thoughtless-arleen-mubeen-jawed-dc2f9845.koyeb.app",
        changeOrigin: true,
        secure: false,
      },
    },
  },
  build: {
    outDir: "dist",
    sourcemap: true,
  },
});
