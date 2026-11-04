import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

export default defineConfig({
  plugins: [react(), tailwindcss()],
  build: {
    target: "es2022",
    cssCodeSplit: true,
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes("node_modules/react") || id.includes("node_modules/react-dom")) {
            return "react-vendor";
          }
          if (id.includes("node_modules/gsap") || id.includes("node_modules/@gsap")) {
            return "gsap-vendor";
          }
          if (id.includes("node_modules/motion")) {
            return "motion-vendor";
          }
        },
      },
    },
  },
});
