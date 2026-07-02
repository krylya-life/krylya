import type { APIRoute } from "astro";
import { business } from "../config/business.ts";

// Индексируемые маршруты (без /thanks/ — она noindex).
// Витрины услуг, кейсов и их подстраницы. Список синхронизирован с src/pages/ и dist/.
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
  "/pricing/",
  "/about/",
  "/contacts/",
  "/privacy/",
];

export const GET: APIRoute = () => {
  const base = business.urlCyrillic.replace(/\/$/, "");
  const urls = routes
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
