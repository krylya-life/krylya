import type { APIRoute } from "astro";
import { getCollection } from "astro:content";
import { business } from "../config/business.ts";

// Индексируемые маршруты (без /thanks/ — она noindex).
// Гибрид: статичный список существующих страниц + витрина /идеи/;
// сами статьи /идеи/<slug>/ добавляются ДИНАМИЧЕСКИ через getCollection
// (см. ниже) — новые статьи попадают в sitemap автоматически, без ручной
// правки. Если понадобится ручной маршрут — добавить строку в routes.
const routes = [
  "/",
  "/services/",
  "/services/corporate-parties/",
  "/services/business-events/",
  "/services/client-events/",
  "/services/teambuilding/",
  "/services/coordination/",
  "/services/private/",
  "/cases/",
  "/cases/60-zhemchuzhin-schastya/",
  "/cases/aero-otkrytie/",
  "/cases/dom-festival/",
  "/cases/rasscvet-ng-korporativ/",
  "/cases/tishina-otkrytie/",
  "/cases/vklyuchi-partnerskij-vecher/",
  "/cases/vklyuchi-vydacha-klyuchey/",
  "/идеи/",
  "/pricing/",
  "/about/",
  "/contacts/",
  "/privacy/",
];

export const GET: APIRoute = async () => {
  const base = business.urlCyrillic.replace(/\/$/, "");

  // Динамический блок статей раздела /идеи/ (не-draft)
  const ideas = await getCollection("ideas", ({ data }) => !data.draft);
  const ideaRoutes = ideas.map((entry) => `/идеи/${entry.data.slug}/`);

  const urls = [...routes, ...ideaRoutes]
    .map((r) => `  <url><loc>${base}${r}</loc></url>`)
    .join("\n");
  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls}
</urlset>`;
  return new Response(xml, {
    headers: { "Content-Type": "application/xml; charset=utf-8" },
  });
};
