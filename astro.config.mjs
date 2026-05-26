// @ts-check
import { defineConfig } from "astro/config";
import tailwindcss from "@tailwindcss/vite";
import react from "@astrojs/react";
import sitemap from "@astrojs/sitemap";

// Phase 2: подключили Tailwind v4 через Vite-плагин.
// React-интегратор нужен только для песочницы /design-lab/ (Aceternity / Magic UI).
// Phase 7: production-домен `https://крылья.life` подключён, sitemap генерируется
// автоматически через @astrojs/sitemap (см. dist/sitemap-index.xml после build).
export default defineConfig({
  site: "https://крылья.life",
  integrations: [
    react(),
    sitemap({
      // Astro и @astrojs/sitemap нормализуют IDN-домен через WHATWG URL → Punycode
      // (https://xn--j1aco8bgs.life/...). Это валидно для поисковых ботов: и Яндекс,
      // и Google корректно резолвят Punycode → IDN. В UI Яндекс.Вебмастера sitemap
      // подаём в Punycode-property, кириллический property подбирает данные по mirror-связке.
    }),
  ],
  vite: {
    plugins: [tailwindcss()],
  },
});
