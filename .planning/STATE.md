---
gsd_state_version: 1.0
milestone: v2.0
milestone_name: rost-rynok-kontent-partnerstva
status: roadmap_ready
last_updated: "2026-06-26T00:00:00.000Z"
progress:
  total_phases: 8
  completed_phases: 0
  total_plans: 0
  completed_plans: 0
  percent: 0
---

# Project State: Крылья — сайт и цифровое присутствие

## Current Position

- **Milestone:** v2.0 «Рост: рынок, контент и партнёрства»
- **Phase:** 9 — SEO-аудит и базлайн (Not started)
- **Plan:** —
- **Status:** Roadmap v2.0 создан, готов к планированию первых фаз
- **Last activity:** 2026-06-26 — Роадмап v2.0 создан (8 фаз: Phase 9–16)

```
[░░░░░░░░] 0/8 фаз v2.0 выполнено
```

## Project Reference

**Milestone v2.0 Core Value:** 2–3 крупных контракта/партнёрства из системной работы этапа (аутрич к федералам/застройщикам + органика), к 31 декабря 2026.

**v1.0 (завершён):** крылья.life построен на Astro + Cloudflare Pages, проиндексирован, Я.Вебмастер + Google Search Console + Метрика подключены, форма заявок работает через @krylya_zayavki_bot.

**Current Focus:** Phase 9 — технический SEO-аудит крылья.life + исправление ошибок Метрики/GSC + фиксация базлайна. Параллельно можно запустить Phase 10, 11, 12 (все три — исследовательские, независимые).

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
| 11 | Конкуренты РФ и Калининград | — | Phase 9, 10, 12 | Not started |
| 12 | Тренды индустрии | — | Phase 9, 10, 11 | Not started |
| 13 | Форматы мероприятий | Phase 10, 11, 12 | — | Not started |
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

## Accumulated Context

### Key Decisions v2.0 (зафиксированы в PROJECT.md)

- **Контент-хаб:** нативный Astro Content Collections в `/идеи/` — не поддомен, не case.so/WIZR. URL: `крылья.life/идеи/slug/`, slug латиницей внутри кириллического раздела
- **Семантика:** сначала карта интентов (Phase 14), потом написание статей — не наоборот (риск каннибализации)
- **SMM:** режим «информирование» для Instagram (без цен/CTA = не реклама = нет штрафа 4–20 тыс ₽ по 38-ФЗ); Telegram — Стратегия-1 без erid (мораторий ФАС до 31.12.2026)
- **Аутрич:** персонализированный, 5–10 писем/мес, не 50; оффер строится на надёжности + локальной экспертизе Калининграда, не на цене; только публичные контакты (152-ФЗ)
- **Ритм контента:** реалистичный минимум — 1 статья + 4 TG-поста + 4 IG-поста в месяц; принцип «один контент-стрим» (блог → тезис в TG → visual в IG)
- **KPI органики из блога:** не ставить раньше Q1 2027 (блог требует 3–6 мес прогрева)
- **Инструменты:** бесплатные или разово (<1 200 ₽); Wordstat + Screaming Frog ≤500 URL + SMMplanner + Контур.Компас + Rusprofile

### Blockers and Warnings

- **Phase 14 (контент-хаб):** перед запуском обязателен CI-grep на `xn--` в `dist/` — должно быть 0 совпадений в `<link rel="canonical">` и `<loc>` тегах sitemap. Иначе — дубли canonical на IDN-домене
- **Phase 15 (аутрич):** отдельный email для рассылки, не личный @yandex.ru Марии — риск блокировки домена
- **Phase 16 (Instagram):** контент-фильтр из 5 вопросов обязателен перед каждым постом; смайлики-призывы и мягкий CTA тоже попадают под 38-ФЗ
- **Конец 2026:** провести аудит архива Telegram-постов до 31.12.2026 — мораторий ФАС заканчивается, посты с CTA без erid станут основанием для претензий

### Research Artifacts (готовы к использованию)

- `.planning/research/SUMMARY.md` — рекомендованный порядок фаз, ключевые находки
- `.planning/research/ARCHITECTURE.md` — граф зависимостей, схема контент-хаба, UTM-архитектура
- `.planning/research/PITFALLS.md` — 10 критических рисков с превенцией и recovery

## Session Continuity

### Last Action

2026-06-26: Роадмап v2.0 создан gsd-roadmapper. Зафиксированы 8 фаз (Phase 9–16), покрытие 32/32 требований, Traceability обновлена в REQUIREMENTS.md.

### Next Action

Запустить планирование первого блока фаз. Поскольку Phase 9–12 параллельны, рекомендуется начать с:

1. `/gsd-plan-phase 9` — SEO-аудит (наиболее критичная: даёт базлайн и исправляет Метрику)
2. `/gsd-plan-phase 11` — Конкуренты РФ/Калининград (питает аутрич, самый прямой путь к контрактам)

Phase 10 (мир) и Phase 12 (тренды) можно запустить параллельно или чуть позже — они менее срочные.

### Files Touched This Session (2026-06-26)

- `.planning/ROADMAP.md` — добавлен раздел «## Milestone v2.0» (фазы 9–16)
- `.planning/STATE.md` — обновлён (переход на v2.0, текущая позиция Phase 9)
- `.planning/REQUIREMENTS.md` — добавлена v2.0 Traceability (32 требования)

---

*State initialized: 2026-04-23*
*Updated: 2026-06-26 — v2.0 roadmap ready (Phase 9–16, 32 requirements mapped)*
*Update cadence: после каждого `/gsd-transition` и `/gsd-complete-milestone`*
