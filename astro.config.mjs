// @ts-check
import { defineConfig } from "astro/config";
import tailwindcss from "@tailwindcss/vite";
import react from "@astrojs/react";

// Phase 2: подключили Tailwind v4 через Vite-плагин.
// React-интегратор нужен только для песочницы /design-lab/ (Aceternity / Magic UI).
// Production-домен `https://крылья.life` поставим в Phase 7.
export default defineConfig({
  site: undefined,
  integrations: [react()],
  vite: {
    plugins: [tailwindcss()],
  },
});
