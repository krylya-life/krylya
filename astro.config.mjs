// @ts-check
import { defineConfig } from "astro/config";

// Phase 1: минимальная конфигурация. Tailwind, MDX, Content Collections и
// production-домен подключаем в Phase 2 и Phase 7 соответственно.
export default defineConfig({
  // В Phase 7 заменим на 'https://крылья.life' (cyrillic, IDN-домен).
  // Пока пусто — Netlify deploy preview сам подставит свой URL.
  site: undefined,
});
