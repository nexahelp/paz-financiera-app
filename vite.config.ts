import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  build: {
    sourcemap: false,
    rollupOptions: {
      onwarn(warning, warn) {
        // Ignorar advertencias de tipos o importaciones que no detienen el build
        if (warning.code === "THIS_IS_UNDEFINED" || warning.code === "PLUGIN_WARNING") return;
        warn(warning);
      },
    },
  },
});
