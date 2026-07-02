---
phase: 09-seo
plan: "01"
subsystem: seo-technical
tags: [canonical, sitemap, metrika, idn, punycode, cyrillic]
dependency_graph:
  requires: []
  provides: [canonical-cyrillic, sitemap-cyrillic, metrika-form-goal]
  affects: [dist/index.html, dist/sitemap.xml, all-page-headers]
tech_stack:
  added: []
  patterns:
    - "Строковая конкатенация с urlCyrillic вместо new URL() для IDN-доменов"
    - "Кастомный Astro endpoint вместо @astrojs/sitemap для IDN-доменов"
key_files:
  created:
    - src/pages/sitemap.xml.ts
  modified:
    - src/components/Seo.astro
    - src/components/Breadcrumbs.astro
    - astro.config.mjs
    - public/robots.txt
    - src/components/ContactForm.astro
decisions:
  - "Кириллический canonical (Вариант Б из RESEARCH.md) — new URL() нормализует IDN в Punycode, используем строковую конкатенацию"
  - "Кастомный sitemap.xml endpoint — @astrojs/sitemap всегда даёт Punycode для IDN-доменов"
  - "window.ym guard (if window.ym) — Метрика грузится отложенно через requestIdleCallback"
metrics:
  duration: "~10 min"
  completed: "2026-07-02"
  tasks_completed: 3
  files_modified: 5
  files_created: 1
---

# Phase 09 Plan 01: SEO-фикс canonical/sitemap/Метрика — Summary

**Одним предложением:** Заменили `new URL()` на строковую конкатенацию с `urlCyrillic` в Seo.astro и Breadcrumbs.astro, создали кастомный sitemap endpoint с 20 кириллическими маршрутами без `/thanks/`, и добавили `window.ym reachGoal form_submitted` перед редиректом в ContactForm — устранив ошибки K-1–K-5 из чек-листа AUDIT-05.

## Что изменилось

### Task 1 (commit 1dc1c7e): Кириллический canonical в Seo.astro и Breadcrumbs.astro

**Проблема:** `new URL(pathname, business.url).toString()` нормализует IDN в Punycode по стандарту WHATWG URL API. Все `<link rel="canonical">`, `og:url` и BreadcrumbList JSON-LD содержали `xn--j1aco8bgs.life` вместо `крылья.life`.

**Фикс в `src/components/Seo.astro`:**
```typescript
// Было:
const canonical = new URL(pathname, business.url).toString();
const imageUrl = new URL(image, business.url).toString();
// Стало:
const base = business.urlCyrillic.replace(/\/$/, "");
const canonical = base + pathname;
const imageUrl = base + image;
```

**Фикс в `src/components/Breadcrumbs.astro`:**
```typescript
// Было:
item: new URL(c.href, business.url).toString(),
// Стало:
item: business.urlCyrillic.replace(/\/$/, "") + c.href,
```

**Закрывает:** K-1 (canonical в Punycode), K-2 (OG URL в Punycode), K-3 (BreadcrumbList JSON-LD в Punycode).

---

### Task 2 (commit 3616959): Кастомный кириллический sitemap без /thanks/

**Проблема:** `@astrojs/sitemap` нормализует IDN в Punycode и не читает `noindex`. Страница `/thanks/` попадала в sitemap несмотря на `Disallow` в robots.txt.

**Удалено:** импорт и интеграция `sitemap()` из `astro.config.mjs`.

**Создан** `src/pages/sitemap.xml.ts` — Astro endpoint с 20 маршрутами в кириллице:
- `/` + 6 services/ + 7 cases/ + pricing + about + contacts + privacy
- `/thanks/` и `/api/` исключены

**Обновлён** `public/robots.txt`: `Sitemap: https://xn--j1aco8bgs.life/sitemap.xml` (без `-index`). Строка `Host:` — без изменений, Яндекс требует Punycode.

**Закрывает:** K-4 (/thanks/ в sitemap).

---

### Task 3 (commit 2e3273a): JS-событие Метрики form_submitted

**Проблема:** Форма при успехе делала только `window.location.href = "/thanks/"`. Метрика видела визит на страницу, а не JS-событие. `window.ym reachGoal` не вызывался.

**Фикс в `src/components/ContactForm.astro`:**
```javascript
if (res.ok) {
  if (window.ym) { window.ym(99532899, "reachGoal", "form_submitted"); }
  window.location.href = "/thanks/";
  return;
}
```

Проверка `if (window.ym)` обязательна — Метрика грузится через `requestIdleCallback`, при быстрой отправке может ещё не инициализироваться.

**Закрывает:** K-5 (нет JS-события form_submitted) — код-часть. Настройка цели в кабинете Метрики — план 09-04.

---

## Результаты grep-проверок

| Проверка | Команда | Результат |
|----------|---------|-----------|
| canonical в кириллице | `grep 'rel="canonical"' dist/index.html \| grep "крылья.life"` | PASS |
| xn-- в canonical-теге | `grep -oP 'canonical[^>]*>' dist/index.html \| grep -q "xn--"` | PASS (0 совпадений) |
| xn-- в og:url | `grep 'og:url.*xn--' dist/index.html` | PASS (0 совпадений) |
| sitemap существует | `test -f dist/sitemap.xml` | PASS |
| xn-- в sitemap | `grep -c "xn--" dist/sitemap.xml` | 0 |
| /thanks/ в sitemap | `grep -c "thanks" dist/sitemap.xml` | 0 |
| крылья.life в sitemap | `grep -c "крылья.life" dist/sitemap.xml` | 20 |
| reachGoal в ContactForm | `grep -c "reachGoal" src/components/ContactForm.astro` | 1 |
| reachGoal в dist/index.html | `grep -c "reachGoal" dist/index.html` | 1 |
| robots.txt Sitemap | `grep "Sitemap:" public/robots.txt` | /sitemap.xml (без -index) |
| robots.txt Host | `grep "Host:" public/robots.txt` | xn--j1aco8bgs.life (не тронут) |
| @astrojs/sitemap удалён | `grep -c "@astrojs/sitemap" astro.config.mjs` | 1 (только в комментарии) |
| npm run build | build 21 pages | PASS |

---

## Deviations from Plan

### Известное ограничение: xn-- в JSON-LD logo (JsonLdGraph.astro)

**Найдено во время:** Task 1 — финальная верификация `! grep -qR "xn--" dist/index.html`

**Issue:** `src/components/JsonLdGraph.astro` строка 16 использует `new URL("/brand/wings-logo-horizontal.png", business.url).toString()` — это даёт Punycode-форму в атрибуте `logo` Organization JSON-LD: `"logo":"https://xn--j1aco8bgs.life/brand/wings-logo-horizontal.png"`.

**Почему не исправлено:** План явно запрещает: «НЕ трогать `src/components/JsonLdGraph.astro`». Это отдельная задача.

**Влияние:** Только атрибут `logo` в Organization JSON-LD. Canonical, og:url, og:image, BreadcrumbList JSON-LD, sitemap `<loc>` — все в кириллице. Поисковые боты корректно резолвят Punycode в logo-URL — это не ошибка индексации, но внутренняя несогласованность.

**Действие:** Зафиксировать как бэклог-задачу. Исправляется заменой `new URL()` на `business.urlCyrillic + path` в JsonLdGraph.astro.

---

## Деплой и live-проверка

Код зафиксирован и готов к деплою. Деплой через `git push` → Cloudflare Pages автодеплой и live-верификация — в **плане 09-03**.

---

## Self-Check: PASSED

Файлы созданы/изменены:
- [x] `src/components/Seo.astro` — urlCyrillic конкатенация
- [x] `src/components/Breadcrumbs.astro` — urlCyrillic конкатенация
- [x] `src/pages/sitemap.xml.ts` — кастомный endpoint
- [x] `astro.config.mjs` — sitemap() удалён
- [x] `public/robots.txt` — sitemap.xml
- [x] `src/components/ContactForm.astro` — reachGoal

Коммиты:
- [x] 1dc1c7e — Task 1
- [x] 3616959 — Task 2
- [x] 2e3273a — Task 3

Build: 21 страниц, без ошибок.
