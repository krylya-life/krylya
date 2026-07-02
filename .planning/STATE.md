---
gsd_state_version: 1.0
milestone: v2.0
milestone_name: "— «Рост: рынок, контент и партнёрства»"
status: executing
last_updated: "2026-07-02T14:58:14.021Z"
last_activity: 2026-07-02
progress:
  total_phases: 18
  completed_phases: 5
  total_plans: 33
  completed_plans: 23
  percent: 70
---

# Project State: Крылья — сайт и цифровое присутствие

## Current Position

Phase: 13 (formaty-meropriyatij) — EXECUTING
Plan: 1 of 2

- **Milestone:** v2.0 «Рост: рынок, контент и партнёрства»
- **Phase:** 09
- **Plan:** 09-02 Complete → следующий: 09-03
- **Status:** Executing Phase 13
- **Last activity:** 2026-07-02

```
[███░░░░░] 3/8 фаз v2.0 выполнено
```

## Project Reference

**Milestone v2.0 Core Value:** 2–3 крупных контракта/партнёрства из системной работы этапа (аутрич к федералам/застройщикам + органика), к 31 декабря 2026.

**v1.0 (завершён):** крылья.life построен на Astro + Cloudflare Pages, проиндексирован, Я.Вебмастер + Google Search Console + Метрика подключены, форма заявок работает через @krylya_zayavki_bot.

**Current Focus:** Phase 13 — formaty-meropriyatij

**Хостинг:** Cloudflare Pages (с Phase 7 Wave 2), автодеплой из GitHub в main. Форма работает через Cloudflare Pages Function `/api/contact` → Telegram-бот @krylya_zayavki_bot. Custom domain `xn--j1aco8bgs.life` (Punycode), кириллический алиас `крылья.life` через DNS-CNAME.

**Timeline v2.0:**

- Старт: 2026-06-26
- Исследовательский блок: Июль 2026 (Phase 9–12 параллельно)
- Форматы: Июль–Август 2026 (Phase 13)
- Контент-хаб + Аутрич: Август–Октябрь 2026 (Phase 14 + 15 параллельно)
- SMM: Октябрь 2026 (Phase 16)
- Дедлайн Core Value: 2026-12-31

## v2.0 Phase Overview

| Phase | Название | Зависит от | Параллельна с | Статус |
|-------|----------|-----------|---------------|--------|
| 9 | SEO-аудит и базлайн | Phase 8 (v1 done) | Phase 10, 11, 12 | Not started |
| 10 | Конкуренты мира | — | Phase 9, 11, 12 | Not started |
| 11 | Конкуренты РФ и Калининград | — | Phase 9, 10, 12 | ✓ Complete (2026-07-01) |
| 12 | Тренды индустрии | — | Phase 9, 10, 11 | ✓ Complete (2026-07-02) |
| 13 | Форматы мероприятий | Phase 10, 11, 12 | — | Executing (13-01 done) |
| 14 | Семантика 2.0 + контент-хаб | Phase 9, 10, 11, 13 | Phase 15 | Not started |
| 15 | Партнёрский аутрич | Phase 11, 13 | Phase 14 | Not started |
| 16 | SMM-стратегия | Phase 12, 13, 14 | Phase 15 | Not started |

## Performance Metrics

| Metric | Target | Current |
|--------|--------|---------|
| Крупных контрактов/партнёрств из системной работы | 2–3 к 31.12.2026 | 0 |
| Проиндексированных страниц (Я.Вебмастер) | Базлайн зафиксирован в Phase 9 | — |
| Позиции по топ-20 коммерческим ключам | Базлайн зафиксирован в Phase 9 | — |
| Аутрич-касаний за v2.0 | ≥ 30 персональных (5–10/мес) | 0 |
| Статей в /идеи/ | ≥ 5 к концу Phase 14 | 0 |
| SMM-постов (после Phase 16) | 4 TG + 4 IG в месяц | 0 |
| Phase 12 P02 | 25min | 2 tasks | 1 files |
| Phase 09-seo P09-01 | 10min | 3 tasks | 6 files |
| Phase 09-seo P09-02 | 12min | 2 tasks | 2 files |
| Phase 13-formaty-meropriyatij P13-01 | 4min | 2 tasks | 1 files |

## Accumulated Context

### Key Decisions v2.0 (зафиксированы в PROJECT.md)

- **Контент-хаб:** нативный Astro Content Collections в `/идеи/` — не поддомен, не case.so/WIZR. URL: `крылья.life/идеи/slug/`, slug латиницей внутри кириллического раздела
- **Семантика:** сначала карта интентов (Phase 14), потом написание статей — не наоборот (риск каннибализации)
- **SMM:** режим «информирование» для Instagram (без цен/CTA = не реклама = нет штрафа 4–20 тыс ₽ по 38-ФЗ); Telegram — Стратегия-1 без erid (мораторий ФАС до 31.12.2026)
- **Тренды Phase 12:** маркировка «Сейчас / Кал-д» у форматов 4 (локальность), 6 (wellness), 7 (загородные) — калининградская отстройка; Instagram — только визуальный референс (заблокирован с 2022), Telegram — главная B2B-площадка, VK — органика через Клипы и фотоальбомы
- **Аутрич:** персонализированный, 5–10 писем/мес, не 50; оффер строится на надёжности + локальной экспертизе Калининграда, не на цене; только публичные контакты (152-ФЗ)
- **Ритм контента:** реалистичный минимум — 1 статья + 4 TG-поста + 4 IG-поста в месяц; принцип «один контент-стрим» (блог → тезис в TG → visual в IG)
- **KPI органики из блога:** не ставить раньше Q1 2027 (блог требует 3–6 мес прогрева)
- **Инструменты:** бесплатные или разово (<1 200 ₽); Wordstat + Screaming Frog ≤500 URL + SMMplanner + Контур.Компас + Rusprofile
- **Canonical IDN (Phase 09-01):** кириллический canonical через строковую конкатенацию `urlCyrillic + pathname` — `new URL()` нормализует IDN в Punycode, непригоден для IDN-доменов
- **Sitemap IDN (Phase 09-01):** кастомный `src/pages/sitemap.xml.ts` endpoint вместо `@astrojs/sitemap` — плагин не поддерживает кириллические `<loc>` для IDN-доменов
- **Метрика цель form_submitted (Phase 09-01):** `if (window.ym)` guard обязателен — скрипт Метрики грузится отложенно, вызов без guard может упасть в ошибку
- **Форматы Phase 13-01:** шаблон блока формата (имя+подзаголовок+сегмент+аутентика+4 подраздела) зафиксирован как контракт структуры; 6 ядровых форматов из реального опыта, анонимно, без калининградской аутентики — аутентика идёт в 13-02; «Почему Крылья» строится из differentiation.md без сравнений и не через цену

### Blockers and Warnings

- **Phase 14 (контент-хаб):** перед запуском обязателен CI-grep на `xn--` в `<link rel="canonical">` и `<loc>` тегах sitemap — 0 совпадений. **Canonical и sitemap исправлены в Phase 09-01.** Остаток: logo URL в JsonLdGraph.astro (не критично для индексации).
- **Phase 15 (аутрич):** отдельный email для рассылки, не личный @yandex.ru Марии — риск блокировки домена
- **Phase 16 (Instagram):** контент-фильтр из 5 вопросов обязателен перед каждым постом; смайлики-призывы и мягкий CTA тоже попадают под 38-ФЗ
- **Конец 2026:** провести аудит архива Telegram-постов до 31.12.2026 — мораторий ФАС заканчивается, посты с CTA без erid станут основанием для претензий

### Research Artifacts (готовы к использованию)

- `.planning/research/SUMMARY.md` — рекомендованный порядок фаз, ключевые находки
- `.planning/research/ARCHITECTURE.md` — граф зависимостей, схема контент-хаба, UTM-архитектура
- `.planning/research/PITFALLS.md` — 10 критических рисков с превенцией и recovery
- `.planning/research/trends.md` — тренд-радар 2026: полностью готов (топ-10 форматов + SMM по Telegram/VK/Instagram + 5 применимых трендов через фильтр + процесс мониторинга) ✓ (Phase 12, 2026-07-02)

## Session Continuity

### Last Action

2026-07-02: Phase 13 план 01 выполнен. Создан .planning/outreach/formats.md: вводная рамка + легенда сегментов A/B/C + шаблон блока формата + 6 ядровых форматов (открытие объекта девелопера, корпоратив, деловое событие, отраслевой праздник, координация дня, камерный юбилей) + сводная таблица. FORMAT-02 выполнен. 2 коммита: 95820e1, 2f378df.

### Next Action

Phase 13 план 02 — форматы «умеем и готовы» из 5 трендов + 3–5 форматов с калининградской аутентикой для C + сводный аудит на 10+ форматов.

### Files Touched This Session (2026-07-02)

- `.planning/outreach/formats.md` — создан (каркас + 6 ядровых форматов, FORMAT-02)
- `.planning/phases/13-formaty-meropriyatij/13-01-SUMMARY.md` — создан
- `.planning/STATE.md` — обновлён (Phase 13, план 01 выполнен)

---

*State initialized: 2026-04-23*
*Updated: 2026-06-26 — v2.0 roadmap ready (Phase 9–16, 32 requirements mapped)*
*Update cadence: после каждого `/gsd-transition` и `/gsd-complete-milestone`*

**Planned Phase:** 13 (formaty-meropriyatij) — 2 plans — 2026-07-02T11:35:20.736Z
