# Чек-лист аудита крылья.life — Phase 9

**Дата аудита:** 2026-07-02
**Страниц проаудировано:** 21 (20 индексируемых + /thanks/ с noindex; sitemap содержит 20 URL)
**Инструменты:** `npm run build` + dist/ view-source, grep-обход dist/*.html, robots.txt, sitemap.xml
**PageSpeed Insights / Rich Results Test / Screaming Frog:** недоступны в headless-окружении — строки с результатами помечены (см. раздел ЖЕЛАТЕЛЬНО и примечание к CWV ниже)

---

## КРИТИЧНО (чиним в Phase 9 — планы 01/03)

| # | Ошибка | Где | Как проверить | Статус |
|---|--------|-----|---------------|--------|
| K-1 | Canonical в Punycode вместо кириллицы | src/components/Seo.astro | view-source любой страницы: `<link rel="canonical">` | ✅ исправлено (09-01), проверено на живом сайте 09-03 |
| K-2 | og:url в Punycode | src/components/Seo.astro | view-source: `<meta property="og:url">` | ✅ исправлено (09-01), проверено на живом сайте 09-03 |
| K-3 | BreadcrumbList @id в Punycode | src/components/Breadcrumbs.astro | Rich Results Test → элемент BreadcrumbList | ✅ исправлено (09-01), проверено на живом сайте 09-03 |
| K-4 | /thanks/ в sitemap | astro.config.mjs / src/pages/sitemap.xml.ts | `grep thanks dist/sitemap.xml` | ✅ исправлено: кастомный endpoint исключает /thanks/, проверено на живом сайте 09-03 |
| K-5 | Нет JS-события form_submitted | src/components/ContactForm.astro | Метрика → Цели → «JavaScript-событие» `form_submitted` | ✅ код исправлено (09-01), проверено `reachGoal` на живом сайте 09-03; цель «Отправка заявки» (ID 577204210, содержит `form_submitted`) создана и проверена тестовой отправкой в кабинете 2 июля 2026 (09-04). Замечены дубли автоцелей — считать реальные заявки по одной цели |

**Состояние K-1..K-5 на ЖИВОМ сайте на 2026-07-02 (после деплоя 09-03):**
- `curl https://xn--j1aco8bgs.life/` → canonical `href="https://крылья.life/"` — кириллица ✓
- `curl .../sitemap.xml` → 20 URL в кириллице, 0 `xn--`, 0 `thanks` ✓
- `curl https://xn--j1aco8bgs.life/` → `reachGoal` присутствует (1) ✓
- Деплой Cloudflare применился ~40 сек после push. Все K-1..K-5 закрыты на продакшн (K-5 — код-часть; цель в кабинете Метрики настраивается в 09-04).

**Core Web Vitals после деплоя:** PageSpeed Insights недоступен в headless-окружении — реальные значения LCP/CLS/INP НЕ сняты автоматически и не сфабрикованы. Остаётся ручная проверка (G-1): открыть pagespeed.web.dev → `https://крылья.life` → Mobile. Ожидание из RESEARCH.md — хорошие показатели по умолчанию (Astro + Cloudflare + preload-шрифты); главный риск LCP — обложки кейсов.

---

## ВАЖНО (чиним в Phase 9)

| # | Ошибка | Где | Как проверить | Статус |
|---|--------|-----|---------------|--------|
| V-1 | Дублирующий `<h1>` на страницах услуг | src/pages/services/[slug].astro + src/content/services/*.md | `grep -c '<h1' dist/services/*/index.html` — все 6 страниц теперь 1 | [x] исправлено — убран `# Заголовок` из 6 md-файлов услуг; деплой в 09-03 |
| V-2 | Logo URL в JSON-LD Organization — Punycode | src/components/JsonLdGraph.astro (строка 16: `new URL(...)`) | `grep '"logo"' dist/index.html` → `крылья.life` | [x] исправлено — конкатенация вместо `new URL()`; деплой в 09-03 |

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
| G-5 | «Не учитывать мои визиты» в Метрике — активировать cookie на всех устройствах | metrika.yandex.ru | Инструкция в 09-RESEARCH.md §«Не учитывать мои визиты» | 🟡 частично 2 июля 2026: галочка «Не учитывать мои визиты» включена в фильтрах на компьютере; метка на телефоне — ⏳ Мария сделает позже |

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
| ВАЖНО | 2 | V-1 (двойной H1 на /services/*/), V-2 (logo Punycode в JSON-LD) — оба исправлены в коде, деплой → 09-03 |
| ЖЕЛАТЕЛЬНО | 5 | G-1..G-5 — бэклог; G-1..G-3 требуют ручной проверки внешними инструментами |

---

## Кабинеты — настройка и проверка (план 09-04, 2 июля 2026)

| # | Что | Статус |
|---|-----|--------|
| C-1 | Яндекс.Метрика — цель `form_submitted` («Отправка заявки», ID 577204210) | ✅ создана и проверена тестовой отправкой; вебвизор пишет; счётчик 99532899 один (дублей нет). Замечены дубли автоцелей — реальные заявки считать по одной цели |
| C-2 | Яндекс.Метрика — «Не учитывать мои визиты» | 🟡 галочка включена в фильтрах на компьютере; метка в браузере телефона — ⏳ Мария поставит позже |
| C-3 | Google Search Console — property | ✅ один ресурс `https://крылья.life/` (внутренне `xn--j1aco8bgs.life`), дубля кириллица/Punycode нет (AUDIT-03) |
| C-4 | Google Search Console — sitemap | ✅ `sitemap.xml` подан 2 июля 2026, статус «Успешно», выявлено 20 страниц (старый `sitemap-index.xml` оставлен, тоже «Успешно») |
| C-5 | Google Search Console — число проиндексированных | ⏳ на 3 июля отчёт «Страницы» всё ещё пишет «данные обрабатываются, повторить через день» — снять цифру ~4 июля, дописать в BASELINE.md. Базлайн 09-05 заморожен без этой одной ячейки |

Действия в кабинетах выполнены через управляемый браузер (Мария вошла под своим аккаунтом, Claude выполнил клики). AUDIT-02 (Метрика) и AUDIT-03 (GSC) по кабинетной части закрыты, кроме двух отложенных пунктов (C-2 телефон, C-5 цифра индексации).
