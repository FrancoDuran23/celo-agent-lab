import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import { wgslVitePlugin } from "@vgpu/wgsl/loader-vite";

export default defineConfig({
  // Base pública: "/" en dev y hosting en la raíz; "/<repo>/" para GitHub Pages (VITE_BASE).
  base: process.env.VITE_BASE ?? "/",
  plugins: [wgslVitePlugin(), react(), tailwindcss()],
});
