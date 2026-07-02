# Чек-лист аудита крылья.life — Phase 9

**Дата аудита:** 2026-07-02
**Страниц проаудировано:** 21 (20 индексируемых + /thanks/ с noindex; sitemap содержит 20 URL)
**Инструменты:** `npm run build` + dist/ view-source, grep-обход dist/*.html, robots.txt, sitemap.xml
**PageSpeed Insights / Rich Results Test / Screaming Frog:** недоступны в headless-окружении — строки с результатами помечены (см. раздел ЖЕЛАТЕЛЬНО и примечание к CWV ниже)

---

## КРИТИЧНО (чиним в Phase 9 — планы 01/03)

| # | Ошибка | Где | Как проверить | Статус |
|---|--------|-----|---------------|--------|
| K-1 | Canonical в Punycode вместо кириллицы | src/components/Seo.astro | view-source любой страницы: `<link rel="canonical">` | → 09-01, исправлено в коде, деплой в 09-03 |
| K-2 | og:url в Punycode | src/components/Seo.astro | view-source: `<meta property="og:url">` | → 09-01, исправлено в коде, деплой в 09-03 |
| K-3 | BreadcrumbList @id в Punycode | src/components/Breadcrumbs.astro | Rich Results Test → элемент BreadcrumbList | → 09-01, исправлено в коде, деплой в 09-03 |
| K-4 | /thanks/ в sitemap | astro.config.mjs / src/pages/sitemap.xml.ts | `grep thanks dist/sitemap.xml` | → 09-01, исправлено: кастомный endpoint исключает /thanks/, деплой в 09-03 |
| K-5 | Нет JS-события form_submitted | src/components/ContactForm.astro | Метрика → Цели → «JavaScript-событие» `form_submitted` | → 09-01 (код), → 09-04 (кабинет Метрики) |

**Состояние K-1..K-5 в dist/ на 2026-07-02 (после 09-01):**
- `grep -oP 'rel="canonical" href="\K[^"]+'` → `https://крылья.life/` — кириллица ✓
- `grep "xn--" dist/sitemap.xml` → 0 совпадений ✓
- `grep "thanks" dist/sitemap.xml` → 0 совпадений ✓
- `grep "reachGoal" src/components/ContactForm.astro` → 1 совпадение ✓
- Все K-1..K-5 закрыты в коде; после деплоя (09-03) — закрыты на продакшн.

---

## ВАЖНО (чиним в Phase 9)

| # | Ошибка | Где | Как проверить | Статус |
|---|--------|-----|---------------|--------|
| V-1 | Дублирующий `<h1>` на страницах услуг | src/pages/services/[slug].astro + src/content/services/*.md | `grep -c '<h1' dist/services/*/index.html` — все 6 страниц показывают 2 | [ ] чинить в 09-03 |
| V-2 | Logo URL в JSON-LD Organization — Punycode | src/components/JsonLdGraph.astro (строка 16: `new URL(...)`) | `grep '"logo"' dist/index.html` → `xn--j1aco8bgs.life` | [ ] чинить в 09-03 |

**Детали V-1:** В `[slug].astro` страница услуги рендерит `<h1>` с заголовком из frontmatter (строка 56), и одновременно `<Content />` рендерит markdown-тело файла, начинающегося с `# Заголовок` → второй `<h1>`. Пример: `/services/corporate-parties/` содержит `<h1>Корпоративные праздники</h1>` (из шаблона) и `<h1>Корпоративные мероприятия</h1>` (из markdown). Затронуто: все 6 страниц услуг.

**Детали V-2:** `JsonLdGraph.astro` строит URL логотипа через `new URL("/brand/wings-logo-horizontal.png", business.url).toString()` — `new URL()` нормализует IDN в Punycode (тот же pitfall, что K-1). В `dist/index.html`: `"logo":"https://xn--j1aco8bgs.life/brand/wings-logo-horizontal.png"`. Не критично для индексации страниц, но создаёт внутреннее противоречие: Organization `@id` и `url` — кириллица, `logo` — Punycode.

---

## ЖЕЛАТЕЛЬНО (бэклог, будущие фазы — D-05)

| # | Пожелание | Где | Как проверить | Приоритет |
|---|-----------|-----|---------------|-----------|
| G-1 | Core Web Vitals (LCP, CLS, INP) — проверить через PageSpeed Insights (mobile) | крылья.life (живой сайт) | pagespeed.web.dev → ввести URL → Mobile → Performance score + LCP/CLS/INP | средний |
| G-2 | Валидация JSON-LD через Rich Results Test | крылья.life/services/* (живой сайт) | search.google.com/test/rich-results → проверить BreadcrumbList + LocalBusiness | средний |
| G-3 | Краулинг Screaming Frog — битые ссылки, редиректы, дубли | крылья.life (живой сайт, ≤500 URL) | Скачать Screaming Frog, прогнать сайт, раздел «Response Codes» → 4xx | низкий |
| G-4 | robots.txt: Sitemap URL → кириллица (сейчас Punycode) | public/robots.txt | Просмотр файла: `Sitemap: https://xn--j1aco8bgs.life/sitemap.xml` | низкий |
| G-5 | «Не учитывать мои визиты» в Метрике — активировать cookie на всех устройствах | metrika.yandex.ru | Инструкция в 09-RESEARCH.md §«Не учитывать мои визиты» | низкий |

---

## Примечание по Core Web Vitals

PageSpeed Insights (pagespeed.web.dev) требует живого публичного URL и работает только в браузере — недоступен в автоматическом окружении. Значения LCP / CLS / INP для крылья.life **необходимо снять вручную** (приоритет G-1):

1. Открыть pagespeed.web.dev в браузере
2. Ввести `https://крылья.life` → нажать Analyse → вкладка **Mobile**
3. Записать: **Performance score**, **LCP** (цель < 2.5 с), **CLS** (цель < 0.1), **INP** (цель < 200 мс)
4. Повторить для страницы услуги, например `https://крылья.life/services/corporate-parties/`
5. Если LCP в красной зоне (> 4 с) → перенести в раздел КРИТИЧНО; если жёлтой (2.5–4 с) → ВАЖНО

**Ожидаемый результат (из RESEARCH.md):** Astro + Cloudflare Pages + preload-шрифты → хороший показатель по умолчанию. Главный риск — lazy-loaded изображения кейсов (JPEG/PNG) как источник высокого LCP.

---

## Итог аудита

| Раздел | Кол-во | Примечание |
|--------|--------|-----------|
| КРИТИЧНО | 5 | K-1..K-5 — все исправлены в коде (09-01), деплой → 09-03 |
| ВАЖНО | 2 | V-1 (двойной H1 на /services/*/), V-2 (logo Punycode в JSON-LD) → 09-03 |
| ЖЕЛАТЕЛЬНО | 5 | G-1..G-5 — бэклог; G-1..G-3 требуют ручной проверки внешними инструментами |
