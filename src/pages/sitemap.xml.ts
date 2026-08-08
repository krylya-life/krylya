import type { APIRoute } from "astro";
import { getCollection } from "astro:content";
import { business } from "../config/business.ts";

// Индексируемые маршруты (без /thanks/ — она noindex).
// Гибрид: статичный список страниц + ДИНАМИЧЕСКИЕ блоки кейсов и статей
// через getCollection — новые кейсы и статьи попадают в sitemap
// автоматически, без ручной правки. Если понадобится ручной маршрут —
// добавить строку в routes.
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
  "/идеи/",
  "/pricing/",
  "/about/",
  "/contacts/",
  "/privacy/",
];

const fmtDate = (d: Date) => d.toISOString().slice(0, 10);

export const GET: APIRoute = async () => {
  const base = business.urlCyrillic.replace(/\/$/, "");

  // Динамический блок кейсов, с lastmod (дата правки текста, иначе дата события)
  const cases = await getCollection("cases");
  const caseRoutes = cases.map((entry) => ({
    path: `/cases/${entry.data.slug}/`,
    lastmod: fmtDate(entry.data.updatedDate ?? entry.data.date),
  }));

  // Динамический блок статей раздела /идеи/ (не-draft), с lastmod
  const ideas = await getCollection("ideas", ({ data }) => !data.draft);
  const ideaRoutes = ideas.map((entry) => ({
    path: `/идеи/${entry.data.slug}/`,
    lastmod: fmtDate(entry.data.updatedDate ?? entry.data.publishDate),
  }));

  const urls = [
    ...routes.map((path) => ({ path } as { path: string; lastmod?: string })),
    ...caseRoutes,
    ...ideaRoutes,
  ]
    .map(
      (r) =>
        `  <url><loc>${base}${r.path}</loc>${
          r.lastmod ? `<lastmod>${r.lastmod}</lastmod>` : ""
        }</url>`,
    )
    .join("\n");
  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls}
</urlset>`;
  return new Response(xml, {
    headers: { "Content-Type": "application/xml; charset=utf-8" },
  });
};
