---
phase: 14-semantika-kontent-hab
plan: 02
subsystem: ui
tags: [astro, content-collections, rss, json-ld, seo, idn, tailwind]

requires:
  - phase: 09-seo
    provides: "кириллический canonical через строковую конкатенацию (не new URL()), ручной sitemap.xml.ts"
  - phase: 13-formaty-meropriyatij
    provides: "formats.md — линейка форматов (вход для тем статей)"
provides:
  - "Раздел /идеи/ — нативная Astro Content Collection ideas (HUB-02)"
  - "Витрина /идеи/ карточками по 4 рубрикам, страница статьи /идеи/<slug>/"
  - "IdeaLayout с мостиком на услугу (D-08), ArticleSchema (BlogPosting, author=Organization)"
  - "RSS /rss.xml с обходом Punycode-бага @astrojs/rss"
  - "Гибридный sitemap: статьи /идеи/ включаются автоматически через getCollection"
  - "checks.sh — регресс-скрипт grep-проверок IDN/RSS/sitemap/JSON-LD"
affects: [14-03, 14-04, 16-smm]

tech-stack:
  added: ["@astrojs/rss@4.0.19"]
  patterns:
    - "Content Collection ideas по образцу cases (glob loader, Zod, reference('services'))"
    - "Отдельный IdeaLayout (в отличие от cases/services) — гарантирует одинаковую концовку-мостик у каждой статьи (D-08)"
    - "RSS item.link — абсолютный кириллический URL для обхода new URL()-нормализации в Punycode"
    - "Гибридный sitemap: статичный массив routes + динамический блок getCollection('ideas')"

key-files:
  created:
    - src/content/ideas/korporativ-iz-drugogo-goroda.md
    - src/layouts/IdeaLayout.astro
    - src/components/ArticleSchema.astro
    - src/components/blocks/IdeaCard.astro
    - src/pages/идеи/index.astro
    - src/pages/идеи/[slug].astro
    - src/pages/rss.xml.ts
    - .planning/phases/14-semantika-kontent-hab/checks.sh
  modified:
    - src/content.config.ts
    - src/pages/sitemap.xml.ts
    - src/components/dark/DarkHeader.astro
    - src/components/dark/DarkFooter.astro
    - package.json

key-decisions:
  - "Контент-хаб — нативная Astro Content Collection ideas (5-я коллекция), plain Markdown без MDX (HUB-02/D-09)"
  - "JSON-LD author = Organization (@id ref на #organization), не Person — голос статей «мы в Крыльях» (D-02)"
  - "Канальный <link> RSS остаётся в Punycode (xn--) — известное ограничение @astrojs/rss, item.link обойдён кириллицей (D-11)"
  - "Sitemap переведён на гибрид — новые статьи включаются автоматически без ручной правки массива"

patterns-established:
  - "Раздел /идеи/: content ASCII (src/content/ideas), route Cyrillic (src/pages/идеи) — минимум площади Unicode-риска"
  - "checks.sh как per-build регресс-проверка dist/ (расширение grep-паттерна Phase 09-01)"

requirements-completed: [HUB-02, HUB-03]

duration: 6min
completed: 2026-07-04
---

# Phase 14 Plan 02: Контент-хаб /идеи/ Summary

**Раздел /идеи/ на нативных Astro Content Collections: коллекция ideas с Zod, витрина по рубрикам, страница статьи с кириллическим canonical + JSON-LD BlogPosting, RSS с обходом Punycode-бага @astrojs/rss и гибридный sitemap с авто-включением статей.**

## Performance

- **Duration:** ~6 мин
- **Started:** 2026-07-04T13:21:00+02:00
- **Completed:** 2026-07-04T13:25:55+02:00
- **Tasks:** 3
- **Files modified:** 13 (8 создано, 5 изменено)

## Accomplishments

- Коллекция `ideas` — 5-я Content Collection по отработанному паттерну `cases` (glob loader, Zod-схема, `reference("services")`), технология контент-хаба зафиксирована (HUB-02).
- Витрина `/идеи/` — карточки статей, сгруппированные по 4 рубрикам (D-07), пустые рубрики скрыты; страница статьи `/идеи/<slug>/` через отдельный `IdeaLayout` с мостиком на услугу (D-08) и формой заявки.
- SEO-разметка полностью корректна для IDN: canonical статей в кириллице (0 xn--), JSON-LD BlogPosting (author = Organization, D-02) + BreadcrumbList + микроразметка Article (itemscope/itemprop) — двойная разметка под Google и Яндекс (D-11).
- RSS `/rss.xml` с обходом Punycode-бага `@astrojs/rss`: `item.link` — абсолютный кириллический URL; единственное xn-- в фиде — служебный канальный `<link>` (задокументированное ограничение пакета).
- Гибридный `sitemap.xml.ts`: статьи `/идеи/` включаются динамически через `getCollection` — новые статьи 14-04 попадут в sitemap автоматически.
- `checks.sh` — регресс-скрипт grep-проверок IDN/RSS/sitemap/JSON-LD, все проверки зелёные.

## Task Commits

1. **Task 1: коллекция ideas + IdeaLayout + ArticleSchema + флагман-seed** — `6fd422a` (feat)
2. **Task 2: витрина /идеи/, страница статьи, пункт «Идеи» в навигации** — `15b75ad` (feat)
3. **Task 3: RSS /rss.xml (обход Punycode), гибридный sitemap, checks.sh** — `0e94b7f` (feat)

## Files Created/Modified

- `src/content.config.ts` — добавлена коллекция `ideas` (Zod: title, slug/regex, rubric enum, relatedService reference и др.)
- `src/content/ideas/korporativ-iz-drugogo-goroda.md` — флагманская статья-seed (D-03), «Как»-фрейминг, вступление; полное тело допишет 14-04
- `src/components/ArticleSchema.astro` — JSON-LD BlogPosting, author/publisher = Organization по @id
- `src/layouts/IdeaLayout.astro` — единый шаблон статьи: Seo (кириллица, ogType=article) + JsonLdGraph + ArticleSchema + Breadcrumbs + микроразметка Article + мостик D-08 + ContactBlock
- `src/components/blocks/IdeaCard.astro` — карточка статьи для витрины (обложка 4:3, рубрика, заголовок, описание)
- `src/pages/идеи/index.astro` — витрина, группировка по рубрикам, сортировка по publishDate desc
- `src/pages/идеи/[slug].astro` — маршрут (getStaticPaths + render), вёрстка делегирована IdeaLayout
- `src/pages/rss.xml.ts` — RSS-лента с обходом Punycode
- `src/pages/sitemap.xml.ts` — переведён на async + гибридный блок статей через getCollection; добавлен `/идеи/`
- `src/components/dark/DarkHeader.astro`, `DarkFooter.astro` — пункт «Идеи»
- `package.json` / `package-lock.json` — `@astrojs/rss@4.0.19`

## Decisions Made

- **author = Organization, не Person** — соответствует голосу «мы в Крыльях» (D-02); ссылается на существующий `#organization`-узел из JsonLdGraph.
- **Sitemap → гибрид** (вместо ручного добавления каждой статьи, как предполагал план как минимум) — «лучшее решение фазы» из RESEARCH Pitfall 4: снимает риск забыть статью в sitemap при 14-04.
- **Канальный `<link>` RSS в Punycode принят как ограничение пакета** — обход существует только для `item.link`; это единственное допустимое xn-- в `dist/rss.xml` (RESEARCH Pitfall 2).

## Deviations from Plan

None — план выполнен ровно как написан. Все кириллические файлы/папки созданы через Write-инструмент (NFC), grep-набор и checks.sh — по коду из RESEARCH.

## Known Stubs

- **`src/content/ideas/korporativ-iz-drugogo-goroda.md`** — тело статьи это вступление (2 абзаца + пометка «полный текст готовится»); frontmatter полный и валидный. Это намеренный seed: полное тело статьи пишет план 14-04 (D-01, D-03). Инфраструктура раздела от этого не страдает — статья рендерится, попадает в витрину/RSS/sitemap, вся SEO-разметка на месте.
- **Обложка `public/assets/ideas/korporativ-iz-drugogo-goroda/cover.jpg`** — плейсхолдер-путь, файл ещё не добавлен (даёт 404 на `<img>` в витрине и в статье, на сборку не влияет). Реальную обложку добавят в 14-04 / Мария. Путь задан по конвенции `cases`.

## Issues Encountered

None — smoke-билд после `npm install @astrojs/rss` прошёл сразу (снял риск A1: ESM-совместимость с Astro 6.1.9).

## Verification Results

- `npm run build` — код 0, 23 страницы (было 21: +витрина +статья).
- `bash checks.sh` — все проверки зелёные, exit 0.
- `grep -c "xn--" dist/sitemap.xml` = 0.
- canonical статьи `https://крылья.life/идеи/korporativ-iz-drugogo-goroda/` — 0 xn--.
- `grep -c "xn--" dist/rss.xml` = 1 (только канальный `<link>` = `https://xn--j1aco8bgs.life/`); item.link статьи — кириллица.
- BlogPosting + BreadcrumbList присутствуют в HTML статьи; карточка статьи есть в витрине; «Идеи» в шапке и футере.

## User Setup Required

None — внешней конфигурации не требуется. (Реальную обложку статьи и полное тело добавит план 14-04.)

## Next Phase Readiness

- Инфраструктура блога полностью готова: 14-04 добавляет `.md`-файлы в `src/content/ideas/` — они автоматически попадают в витрину, RSS и sitemap.
- **Пост-деплой (после первого пуша раздела):** выполнить `curl -sI https://крылья.life/идеи/` и одной статьи — проверка на 404 из-за возможной Unicode-нормализации кириллической папки на Linux-раннере (RESEARCH Pitfall 3, A2). Push в этом плане не делался.

## Self-Check: PASSED

Все 8 созданных файлов присутствуют на диске; все 3 task-коммита (6fd422a, 15b75ad, 0e94b7f) найдены в git-истории.

---
*Phase: 14-semantika-kontent-hab*
*Completed: 2026-07-04*
