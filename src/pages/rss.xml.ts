/*
 * /rss.xml — RSS-лента раздела /идеи/ (Phase 14, HUB-03).
 *
 * ОБХОД БАГА @astrojs/rss (Punycode): библиотека прогоняет канальный <link>
 * (site) через createCanonicalURL → new URL(), который нормализует IDN-хост
 * в Punycode. Поэтому канальный <link> ВСЕГДА выйдет в форме
 * https://xn--j1aco8bgs.life/ — это единственное допустимое совпадение xn--
 * в dist/rss.xml, известное ограничение пакета (см. 14-RESEARCH Pitfall 2).
 *
 * Для item.link обход есть: isValidURL() внутри пакета лишь ТЕСТИРУЕТ
 * абсолютный URL на парсируемость и оставляет исходную строку без
 * нормализации. Поэтому item.link — АБСОЛЮТНЫЙ кириллический URL,
 * а не относительный путь: тогда ссылки статей остаются в кириллице.
 */
import rss from "@astrojs/rss";
import { getCollection } from "astro:content";
import { business } from "../config/business.ts";

export async function GET() {
  const ideas = (await getCollection("ideas", ({ data }) => !data.draft)).sort(
    (a, b) => b.data.publishDate.getTime() - a.data.publishDate.getTime()
  );

  const base = business.urlCyrillic.replace(/\/$/, "");

  return rss({
    title: "Идеи — Крылья",
    description:
      "Практические гайды и наблюдения об организации мероприятий в Калининграде",
    // канальный <link> всё равно уйдёт в Punycode — известное ограничение @astrojs/rss
    site: business.urlCyrillic,
    items: ideas.map((post) => ({
      title: post.data.title,
      pubDate: post.data.publishDate,
      description: post.data.description,
      // КРИТИЧНО: абсолютный кириллический URL, НЕ относительный путь —
      // isValidURL() пропускает валидный абсолютный URL без нормализации в Punycode
      link: `${base}/идеи/${post.data.slug}/`,
    })),
  });
}
