// @ts-check
import { defineConfig } from "astro/config";
import tailwindcss from "@tailwindcss/vite";
import react from "@astrojs/react";

// Phase 2: подключили Tailwind v4 через Vite-плагин.
// React-интегратор нужен только для песочницы /design-lab/ (Aceternity / Magic UI).
// Phase 9: sitemap генерируется кастомным endpoint src/pages/sitemap.xml.ts в кириллице —
// @astrojs/sitemap нормализует IDN в Punycode и не исключает noindex-страницы (RESEARCH.md Pitfall 2, 3).
export default defineConfig({
  site: "https://крылья.life",
  integrations: [
    react(),
  ],
  vite: {
    plugins: [tailwindcss()],
  },
});
