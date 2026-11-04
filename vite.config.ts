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

import fs from "node:fs";
import path from "node:path";

interface RouteMeta {
  path: string;
  title: string;
  description: string;
}

const STATIC_ROUTES: RouteMeta[] = [
  {
    path: "menu",
    title: "Menu Favorit & Minuman Segar | Kopi SEA Makassar",
    description: "Daftar menu andalan Toko Kopi Sea Makassar: es kopi gula aren, kopi susu, Peach Mont Blanc, dan Matcha Cloud. Buka tiap hari 09.00–22.00 WITA.",
  },
  {
    path: "jam",
    title: "Jam Buka & Saran Minum | Kopi SEA Makassar",
    description: "Panduan jam minum Toko Kopi Sea Makassar: sunrise starter, siang balance, aren boost, hingga malam chill. Buka 09.00–22.00 WITA.",
  },
  {
    path: "pesan",
    title: "Pesan Online & QR Menu | Kopi SEA Makassar",
    description: "Pesan kopi favoritmu langsung tanpa ribet melalui aplikasi resmi dan kode QR tiap cabang Toko Kopi Sea Makassar.",
  },
  {
    path: "lokasi",
    title: "Lokasi Cabang & Peta | Kopi SEA Makassar",
    description: "Kunjungi cabang Toko Kopi Sea di Mappaoddang, PK7, dan Toddopuli 10 Makassar. Petunjuk arah Google Maps tersedia.",
  },
];

/** Prerenders dedicated, indexable route HTML files for sitemap and clean URL routing. */
function generateRoutePages(): Plugin {
  return {
    name: "generate-route-pages",
    closeBundle() {
      const outDir = path.resolve("dist");
      const indexPath = path.join(outDir, "index.html");
      if (!fs.existsSync(indexPath)) return;

      const rawHtml = fs.readFileSync(indexPath, "utf-8");

      for (const route of STATIC_ROUTES) {
        let routeHtml = rawHtml;
        const pageUrl = `https://kopisea.vercel.app/${route.path}`;

        // 1. Update Title
        routeHtml = routeHtml.replace(/<title>.*?<\/title>/, `<title>${route.title}</title>`);
        routeHtml = routeHtml.replace(/<meta property="og:title" content=".*?" \/>/, `<meta property="og:title" content="${route.title}" />`);
        routeHtml = routeHtml.replace(/<meta name="twitter:title" content=".*?" \/>/, `<meta name="twitter:title" content="${route.title}" />`);

        // 2. Update Canonical & OG URL
        routeHtml = routeHtml.replace(/<link rel="canonical" href=".*?" \/>/, `<link rel="canonical" href="${pageUrl}" />`);
        routeHtml = routeHtml.replace(/<meta property="og:url" content=".*?" \/>/, `<meta property="og:url" content="${pageUrl}" />`);

        // 3. Update Description
        routeHtml = routeHtml.replace(/<meta name="description" content=".*?" \/>/, `<meta name="description" content="${route.description}" />`);
        routeHtml = routeHtml.replace(/<meta property="og:description" content=".*?" \/>/, `<meta property="og:description" content="${route.description}" />`);
        routeHtml = routeHtml.replace(/<meta name="twitter:description" content=".*?" \/>/, `<meta name="twitter:description" content="${route.description}" />`);

        const routeDir = path.join(outDir, route.path);
        fs.mkdirSync(routeDir, { recursive: true });
        fs.writeFileSync(path.join(routeDir, "index.html"), routeHtml, "utf-8");
      }
    },
  };
}

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, ".", "");
  const gscToken = env.VITE_GOOGLE_SITE_VERIFICATION || DEFAULT_GSC;

  return {
    plugins: [react(), tailwindcss(), htmlEnvFallback(gscToken), preloadFonts(), generateRoutePages()],
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
