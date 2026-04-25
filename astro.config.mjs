// @ts-check
import { defineConfig } from "astro/config";
import tailwindcss from "@tailwindcss/vite";

// Phase 2: подключили Tailwind v4 через Vite-плагин.
// Production-домен `https://крылья.life` поставим в Phase 7.
export default defineConfig({
  site: undefined,
  vite: {
    plugins: [tailwindcss()],
  },
});
