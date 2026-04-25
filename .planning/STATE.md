---
gsd_state_version: 1.0
milestone: v1.0
milestone_name: milestone
status: completed
last_updated: "2026-04-25T17:47:57.521Z"
progress:
  total_phases: 9
  completed_phases: 0
  total_plans: 2
  completed_plans: 0
  percent: 0
---

# Project State: Крылья — сайт и цифровое присутствие

## Project Reference

**Core Value:** Один реальный контракт, пришедший через органический поиск на сайт к 30 июня 2026.

**Current Focus:** Phase 2 — дизайн-система и контент-модели. Phase 1 закрыта 2026-04-25 (preview-URL: https://krylya-life.netlify.app).

**Timeline:**

- Старт: 2026-04-23
- Релиз сайта: ≤ 2026-05-15
- Дедлайн Core Value: 2026-06-30

## Current Position

- **Milestone:** Initial release (v1)
- **Phase:** 2 — Дизайн-система и контент-модели
- **Plan:** ещё не создан (следующий шаг — `/gsd-plan-phase 2`)
- **Status:** Phase 1 done — переход к Phase 2
- **Progress:** 2/9 фаз выполнено (Phase 0, Phase 1)

```
[██░░░░░░░] 2/9 фаз выполнено
```

**Live preview:** https://krylya-life.netlify.app (Astro 6 placeholder)
**Repo:** https://github.com/krylya-life/krylya
**Telegram bot:** @krylya_zayavki_bot (заявки приходят Марии в личку)

## Performance Metrics

| Metric | Target | Current |
|--------|--------|---------|
| Релиз сайта на крылья.life | ≤ 2026-05-15 | — |
| Первая органическая заявка | ≤ 2026-06-30 | — |
| Страниц проиндексировано (Я.Вебмастер) на 14/30/60 день после релиза | >0 / >30% / полный sitemap | — |
| Контрольные точки Core Value | 14/30/60 дней после релиза | — |

## Accumulated Context

### Key Decisions (на момент старта)

Перенесены из PROJECT.md. Все ключевые решения зафиксированы, статус `Pending` до валидации в соответствующей фазе:

- Astro 6 + Tailwind v4 + MDX + Content Collections + Netlify Free (не Vercel — ToS)
- Canonical и внутренние ссылки — кириллицей; Punycode только в TLS CN, robots.txt (Host/Sitemap), SMTP
- Двойная SEO-разметка: JSON-LD (Google) + микроразметка schema.org (Яндекс)
- Шрифт Jost (OFL), Demetriss — только в SVG-логотипе
- SMM регистры: Instagram — информирование без CTA, Telegram — Стратегия-1 без erid до конца 2026
- Форма: Netlify Forms + Netlify Function → Telegram @mashavostrik
- Аналитика: только Яндекс.Метрика (GA4 не ставим)
- План B как штатная параллельная фаза (Phase 8)

### Active Todos

Phase 0 закрыта 2026-04-25 (см. `.planning/phases/00-podgotovka/00-CONTEXT.md`):

- [x] TG chat_id Марии = `129375931`, пойдёт в Netlify env как `TELEGRAM_CHAT_ID` в Phase 1
- [x] Сверка черновиков с живой Tilda проведена (см. `00-TEXTS-GAP.md`); 2 фактические ошибки исправлены (отчество, фамилии команды)
- [x] Драфты `content/pages/{home,about,services,contacts}.md` обновлены: реквизиты ИП, био команды, формат работы, тон «частных мероприятий»
- [x] Структура для фото создана: `assets/team/`, `assets/cases/<slug>/` под 8 известных кейсов + `_prochee/`. Сбор фото — постепенный
- [⏸] Согласия клиентов — отложены, решим перед Phase 5
- [⏸] Сам сбор фото-архива — параллельно с Phase 1+, не блокер

Phase 1 закрыта 2026-04-25 (см. `.planning/phases/01-seo-tilda/01-CONTEXT.md`):

- [x] GitHub-аккаунт `krylya-life`, репо `github.com/krylya-life/krylya` — public, Astro 6 scaffold (INFRA-01)
- [x] Netlify-сайт `krylya-life.netlify.app`, автодеплой `main → Netlify` (INFRA-02)
- [x] Telegram-бот `@krylya_zayavki_bot` создан через @BotFather, тест прошёл (Мария получила сообщение)
- [x] `TELEGRAM_BOT_TOKEN` + `TELEGRAM_CHAT_ID=129375931` лежат в Netlify Environment Variables (INFRA-05)
- [x] SEO-аудит Tilda проведён: сайт одностраничный, единственный URL — корень. Таблица 301 минимальна (MIGR-01, MIGR-02)
- [x] PAT GitHub `ghp_y9qRUAF...` сохранён в macOS keychain Марии (для будущих push)

Phase 2 (стартует следующим):

- [ ] Подключить Tailwind v4 через `@tailwindcss/vite`
- [ ] Self-hosted Jost (3-4 начертания .woff2)
- [ ] Brand tokens (монохром + жёлтый `#FFF200`) в Tailwind config
- [ ] BaseLayout + Header + Footer + Container + Section + Button + Heading
- [ ] SVG-компонент логотипа Крыльев (Demetriss внутри SVG)
- [ ] 4 Content Collections с Zod-схемами: services, cases, testimonials, team
- [ ] По одной тестовой записи в каждой коллекции для проверки references

### Known Blockers

- **Согласия клиентов** — операционный блокер Phase 5 (кейсы). Сбор стартует в Phase 0 параллельно, минимум 1–2 недели до Phase 5
- **Семантическое ядро** — блокер Phase 4. Research-phase нужен в начале Phase 4 (wordstat, кластеризация)
- **Первая заявка к 30 июня** — на грани возможного для нового IDN-домена. Риск митигируется Phase 8 (план B), но успех не гарантирован — гипотеза, не план

### Research Flags

Дополнительный research-phase нужен в:

- Phase 4: семантическое ядро под сегмент C
- Phase 5: шаблон B2B-ивент кейса (domain-specific)
- Phase 8: SMM-рубрики и шаблоны постов под 38-ФЗ

## Session Continuity

### Last Action

2026-04-25: Phase 1 закрыта целиком за одну сессию. Заведены GitHub (`krylya-life`) + Netlify (`krylya-life.netlify.app`) + Telegram-бот (`@krylya_zayavki_bot`). Astro 6 minimal scaffold собран и деплоится автоматически по push в main. SEO-аудит Tilda показал, что текущий сайт одностраничный — таблица 301 минимальна. Все 5 v1 REQ-ID Phase 1 выполнены: INFRA-01, INFRA-02, INFRA-05, MIGR-01, MIGR-02.

### Next Action

`/gsd-plan-phase 2` — план Phase 2 «Дизайн-система и контент-модели»: Tailwind v4 + Jost + брендовые токены + BaseLayout + 4 Content Collections со Zod-схемами.

### Files Touched This Session (2026-04-24..25)

- `.planning/STATE.md` (обновлён: Phase 0 → Phase 1)
- `.planning/phases/00-podgotovka/00-CONTEXT.md` (создан)
- `.planning/phases/00-podgotovka/00-TEXTS-GAP.md` (создан)
- `content/pages/home.md` (исправлено отчество, добавлены реквизиты)
- `content/pages/about.md` (фамилии и био команды)
- `content/pages/services.md` (смягчены «частные мероприятия»)
- `content/pages/contacts.md` (исправлено отчество, добавлен формат работы)
- `assets/README.md` (создан — инструкция по фото)
- `assets/team/`, `assets/cases/<8 slug>/`, `assets/cases/_prochee/` (созданы пустые папки)
- `~/claude/CLAUDE.md` (добавлено правило тона общения с Марией)
- Память Claude: `user_profile.md` — Мария не программист, общаться по-человечески

---

*State initialized: 2026-04-23*
*Update cadence: после каждого `/gsd-transition` и `/gsd-complete-milestone`*

**Planned Phase:** 2 (Дизайн-система и контент-модели) — 1 plans — 2026-04-25T17:47:57.510Z
