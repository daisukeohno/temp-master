import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// SPA is served from the FastAPI backend at the domain root, so use an
// absolute base path. The backend's SPA fallback handles client routing.
export default defineConfig({
  base: "/",
  plugins: [react()],
  build: {
    outDir: "dist",
  },
});
