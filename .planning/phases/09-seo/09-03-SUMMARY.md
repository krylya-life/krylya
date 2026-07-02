---
phase: 09-seo
plan: "03"
subsystem: seo-technical
tags: [deploy, cloudflare-pages, canonical, sitemap, live-verification, idn]
dependency_graph:
  requires: [canonical-cyrillic, sitemap-cyrillic, metrika-form-goal, seo-audit-checklist]
  provides: [live-fixes-deployed, checklist-critical-closed]
  affects: [крылья.life (продакшн), .planning/audit/CHECKLIST.md]
tech_stack:
  added: []
  patterns:
    - "Деплой = git push в main → автосборка Cloudflare Pages (~40 сек до применения)"
    - "Верификация IDN-домена через curl по Punycode-хосту (DNS/curl работают с ACE-формой)"
key_files:
  created:
    - .planning/phases/09-seo/09-03-SUMMARY.md
  modified:
    - .planning/audit/CHECKLIST.md
decisions:
  - "V-1 и V-2 (ранг ВАЖНО) дочинены ПЕРЕД деплоем по решению Марии — базлайн снимается на полностью корректном сайте"
  - "Core Web Vitals не сняты автоматически (PageSpeed headless недоступен) — вынесено в ручную проверку G-1, значения не сфабрикованы"
metrics:
  duration: "~5 min"
  completed: "2026-07-02"
  tasks_completed: 2
  files_modified: 1
  files_created: 1
---

# Phase 09 Plan 03: Деплой и проверка на живом сайте — Summary

**Одним предложением:** Запушили все код-правки фазы 9 (K-1…K-5 + V-1, V-2) в main → Cloudflare Pages пересобрал крылья.life за ~40 сек, curl-проверки живого сайта подтвердили кириллический canonical, кириллический sitemap из 20 URL без `/thanks/` и `reachGoal` в HTML; статусы всех критичных ошибок в чек-листе переведены в «проверено на живом сайте».

## Что сделано

### Task 1 (commit 262390d, push 4cec7d8..262390d): Деплой и проверка фиксов

**Публикация:** `git push origin main` — 16 накопленных коммитов (вся работа фазы 9 + не запушенные ранее доки фазы 12). Ветка `main`, branching_strategy=none. Перед пушем — зелёный локальный `npm run build` и grep-проверки (canonical кириллица, sitemap без xn--/thanks, reachGoal).

**Проверка живого сайта** (curl по Punycode-хосту `xn--j1aco8bgs.life`, deploy применился на 3-й попытке опроса, ~40 сек):

| Проверка | Результат |
|----------|-----------|
| canonical главной | `href="https://крылья.life/"` — кириллица ✓ |
| sitemap.xml — кириллических URL | 20 ✓ |
| sitemap.xml — `xn--` | 0 ✓ |
| sitemap.xml — `thanks` | 0 ✓ |
| reachGoal в HTML главной | 1 ✓ |

**Закрывает:** K-1…K-4 на продакшн, код-часть K-5.

### Task 2 (commit — этот): Core Web Vitals + обновление статусов чек-листа

**Core Web Vitals:** PageSpeed Insights требует браузер и живой URL — в headless-окружении недоступен. Реальные LCP/CLS/INP **не сняты и не выдуманы**; вынесено в ручную проверку Марии (G-1) с точной инструкцией в CHECKLIST.md. Ожидание из RESEARCH.md — хорошие показатели по умолчанию (Astro + Cloudflare + preload-шрифты).

**CHECKLIST.md:** статусы K-1…K-5 → «✅ проверено на живом сайте 09-03»; V-1, V-2 отмечены исправленными (дочинены перед деплоем). В разделе КРИТИЧНО не осталось открытых чекбоксов.

## Отклонения от плана

- **Дополнительно дочинены V-1 (двойной `<h1>` на 6 страницах услуг) и V-2 (Punycode-логотип в JSON-LD)** — по явному решению Марии, чтобы деплой и последующий базлайн опирались на полностью корректный сайт. Коммиты `c33d735` (V-2), `5d3b717` (V-1).
- **CWV отложены на ручную проверку** (G-1) вместо автоматического снятия — ограничение окружения, задокументировано честно.

## Self-Check: PASSED

- Фиксы задеплоены и подтверждены на живом крылья.life ✓
- Критичных открытых ошибок в чек-листе нет ✓
- CWV зафиксирован как пункт (ручная проверка) ✓

## Что дальше

- **09-04** (действия Марии): настройка цели `form_submitted` в Яндекс.Метрике, исключение своего трафика, проверка счётчика и вебвизора; в Google Search Console — property, подача sitemap, число проиндексированных страниц.
- **09-05** (действия Марии): снятие стартового базлайна позиций и индексации в BASELINE.md.
