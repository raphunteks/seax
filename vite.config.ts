import { defineConfig, loadEnv, type Plugin } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

const DEFAULT_GSC = "cbSE7olGd0ibEx_bhjC3aitjIovXCSwUKYbVOh7nbLs";

/** Ensures %VITE_GOOGLE_SITE_VERIFICATION% is always replaced even if .env is missing in remote CI/Vercel. */
function htmlEnvFallback(token: string): Plugin {
  return {
    name: "html-env-fallback",
    transformIndexHtml(html) {
      return html.replace(/%VITE_GOOGLE_SITE_VERIFICATION%/g, token);
    },
  };
}

/** Fonts are otherwise requested only after the JS has rendered text, which delays the headline and shifts layout. */
function preloadFonts(): Plugin {
  return {
    name: "preload-fonts",
    transformIndexHtml: {
      order: "post",
      handler(_html, ctx) {
        if (!ctx.bundle) return;
        return Object.keys(ctx.bundle)
          .filter((f) => /(unbounded|instrument-sans)-latin-wght-normal[^/]*\.woff2$/.test(f))
          .map((f) => ({
            tag: "link",
            attrs: { rel: "preload", as: "font", type: "font/woff2", crossorigin: "", href: `/${f}` },
            injectTo: "head" as const,
          }));
      },
    },
  };
}

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, ".", "");
  const gscToken = env.VITE_GOOGLE_SITE_VERIFICATION || DEFAULT_GSC;

  return {
    plugins: [react(), tailwindcss(), htmlEnvFallback(gscToken), preloadFonts()],
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
  };
});
