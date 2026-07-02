---
phase: 09-seo
plan: 02
subsystem: seo-audit
tags: [seo, audit, checklist, baseline, keywords]
dependency_graph:
  requires: [09-01]
  provides: [.planning/audit/CHECKLIST.md, .planning/audit/BASELINE.md]
  affects: [09-03, 09-05]
tech_stack:
  added: []
  patterns: [static-dist-audit, grep-html-analysis]
key_files:
  created:
    - .planning/audit/CHECKLIST.md
    - .planning/audit/BASELINE.md
  modified: []
decisions:
  - "Два новых пункта ВАЖНО помимо K-1..K-5: V-1 (двойной h1 на /services/*/) и V-2 (logo Punycode в JsonLdGraph) — добавлены в CHECKLIST.md для исправления в 09-03"
  - "Core Web Vitals оставлены как G-1 (ЖЕЛАТЕЛЬНО, ручная проверка) — PageSpeed Insights недоступен в headless-окружении; реальные числа не фабрикуются"
  - "BASELINE.md: 16 запросов (группы 1–3), «организация корпоратива калининград» — одна строка группы 1+2; группа 4 исключена (D-01)"
metrics:
  duration: "12 min"
  completed: "2026-07-02"
  tasks: 2
  files: 2
---

# Phase 09 Plan 02: SEO-аудит и скелет базлайна Summary

**Одна строка:** Технический аудит dist/ выявил 5 критичных + 2 важных ошибки + 5 желательных; K-1..K-5 закрыты в 09-01, V-1/V-2 идут в 09-03; таблица базлайна создана с 16 замороженными запросами групп 1–3.

## Tasks Completed

| Task | Name | Commit | Files |
|------|------|--------|-------|
| 1 | Технический аудит + CHECKLIST.md | a59118e | .planning/audit/CHECKLIST.md |
| 2 | Скелет базлайна BASELINE.md | 52d6346 | .planning/audit/BASELINE.md |

## Audit Results Summary

### Ошибки по приоритетам

| Раздел | Количество | Статус |
|--------|-----------|--------|
| КРИТИЧНО | 5 (K-1..K-5) | Все исправлены в коде (09-01); деплой в 09-03 |
| ВАЖНО | 2 (V-1, V-2) | Не в плане 09-01 — чинятся в 09-03 |
| ЖЕЛАТЕЛЬНО | 5 (G-1..G-5) | Бэклог; G-1..G-3 требуют ручной проверки |

### Новые ошибки, обнаруженные при аудите dist/

**V-1 — Двойной `<h1>` на страницах услуг (6 из 6 страниц)**
- Источник: `src/pages/services/[slug].astro` выводит `<h1>` из frontmatter `title`, а `<Content />` рендерит тело .md-файла, начинающегося с `# Heading` → второй `<h1>` в DOM
- Пример: `/services/corporate-parties/` → H1-1: «Корпоративные праздники», H1-2: «Корпоративные мероприятия»
- Оба заголовка разные, т.е. не дублируют текст, но Google/Яндекс видят 2 `<h1>` — нарушение стандарта «один H1 на страницу»
- Фикс: изменить `#` на `##` в начале .md-файлов контента (6 файлов), либо убрать `<h1>` из шаблона [slug].astro

**V-2 — Logo URL в JSON-LD Organization — Punycode**
- Источник: `src/components/JsonLdGraph.astro` строка 16: `logo: new URL("/brand/wings-logo-horizontal.png", business.url).toString()`
- Та же ошибка, что K-1 (WHATWG URL API нормализует IDN в Punycode)
- Результат в dist/: `"logo":"https://xn--j1aco8bgs.life/brand/wings-logo-horizontal.png"`
- Фикс: заменить `new URL(...)` на `business.urlCyrillic.replace(/\/$/, '') + "/brand/wings-logo-horizontal.png"`

### Core Web Vitals

PageSpeed Insights (pagespeed.web.dev) работает только в браузере — реальные значения LCP/CLS/INP **не получены** в headless-окружении и не фабрикуются. Задача зафиксирована в чек-листе как G-1 (ЖЕЛАТЕЛЬНО, ручная проверка).

**Инструкция для ручной проверки (Мария):**
1. Открыть pagespeed.web.dev в браузере
2. Ввести `https://крылья.life` → нажать Analyse → вкладка Mobile
3. Записать Performance score, LCP, CLS, INP
4. Если LCP > 4 с (красная зона) → перенести G-1 в КРИТИЧНО

Ожидаемый результат по RESEARCH.md: Astro + CDN + preload-шрифты дают хороший показатель. Главный риск — lazy-loaded изображения кейсов (carousel на главной).

### Базлайн (BASELINE.md)

- 16 запросов, группы 1–3 из seo/keywords.md
- Дубль «организация корпоратива калининград» (группы 1 и 2) → одна строка, группа «1+2»
- Группа 4 (информационные) исключена согласно D-01
- Данные пусты — заполняются Марией из Я.Вебмастер + Google Search Console в плане 09-05
- Список заморожен (D-02) — не менять

## Deviations from Plan

### Auto-fixed / Auto-discovered Issues

**1. [Rule 2 - Missing] V-1: Двойной H1 на страницах услуг**
- **Найдено во время:** Task 1 (аудит dist/)
- **Проблема:** Все 6 страниц `/services/*/` содержат 2 `<h1>` — из шаблона `[slug].astro` и из тела markdown `.md`-файла
- **Действие:** Добавлено в CHECKLIST.md как V-1 (ВАЖНО) для исправления в 09-03; план 09-01 не менялся
- **Файлы:** .planning/audit/CHECKLIST.md

**2. [Rule 2 - Missing] V-2: Logo Punycode в JsonLdGraph.astro**
- **Найдено во время:** Task 1 (grep dist/index.html)
- **Проблема:** `JsonLdGraph.astro` использует `new URL()` для logo URL → Punycode. RESEARCH.md упоминал это как незакрытую проблему (отличие от K-1..K-3, которые уже были в интерфейсах плана)
- **Действие:** Добавлено в CHECKLIST.md как V-2 (ВАЖНО) для исправления в 09-03
- **Файлы:** .planning/audit/CHECKLIST.md

### Внешние инструменты (не выполнено, задокументировано)

Screaming Frog, PageSpeed Insights, Rich Results Test — недоступны в headless-окружении. Результаты не фабриковались. Все три включены в чек-лист как G-1..G-3 (ЖЕЛАТЕЛЬНО) с инструкцией для ручной проверки.

## Threat Flags

Нет — план создаёт только аудит-артефакты в .planning/audit/ (не публикуемые).

## Self-Check: PASSED

- `test -f .planning/audit/CHECKLIST.md` → FOUND
- `test -f .planning/audit/BASELINE.md` → FOUND
- `grep -q "КРИТИЧНО" .planning/audit/CHECKLIST.md` → OK
- `grep -cE "^\| [0-9]+ \|" .planning/audit/BASELINE.md` → 16
- `echo "PLAN 02 GREEN"` → PLAN 02 GREEN
- commit a59118e → FOUND (Task 1)
- commit 52d6346 → FOUND (Task 2)
