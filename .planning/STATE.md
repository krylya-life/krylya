---
gsd_state_version: 1.0
milestone: v1.0
milestone_name: milestone
status: completed
last_updated: "2026-04-26T12:04:14.343Z"
progress:
  total_phases: 9
  completed_phases: 0
  total_plans: 3
  completed_plans: 0
  percent: 0
---

# Project State: Крылья — сайт и цифровое присутствие

## Project Reference

**Core Value:** Один реальный контракт, пришедший через органический поиск на сайт к 30 июня 2026.

**Current Focus:** Phase 4 — услуги и семантика. Phase 3 закрыта 2026-04-25 (главная end-to-end работает с формой и уведомлениями в Telegram). Финальную полировку дизайна Мария попросила вернуть после сборки всех страниц (Phase 6.5 — добавим в roadmap).

**Timeline:**

- Старт: 2026-04-23
- Релиз сайта: ≤ 2026-05-15
- Дедлайн Core Value: 2026-06-30

## Current Position

- **Milestone:** Initial release (v1)
- **Phase:** 4 — Услуги и семантика
- **Plan:** ещё не создан (следующий шаг — `/gsd-plan-phase 4`)
- **Status:** Phase 3 done — переход к Phase 4
- **Progress:** 4/9 фаз выполнено (Phase 0, 1, 2, 3)

```
[████░░░░░] 4/9 фаз выполнено
```

**Live preview:** https://krylya-life.netlify.app (главная end-to-end работает: форма → Telegram, /thanks/, Метрика, JSON-LD)
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

Phase 2 закрыта 2026-04-25 (см. `.planning/phases/02-design-system/02-CONTEXT.md`):

- [x] Tailwind v4 через `@tailwindcss/vite` (DS-02)
- [x] Self-hosted Jost (4 веса × 2 субсета, ~58 КБ суммарно) (DS-01)
- [x] Brand tokens в `@theme`: жёлтый, чёрный, два серых, белый (DS-02)
- [x] UI-примитивы: Container, Section, Heading (с акцентом), Button (primary/secondary) (DS-03)
- [x] BaseLayout + Header (с жёлтым подчёркиванием меню) + Footer (тёмно-серый, не чёрный) (DS-04)
- [x] Logo как PNG-компонент (sm/md/lg). SVG-конверсия отложена — followup для финальной полировки (DS-05)
- [x] 4 Content Collections с Zod + references (services, cases, testimonials, team) (CONT-01..05)
- [x] Тестовые записи: 1 услуга, 1 кейс, 1 отзыв, 3 члена команды
- [x] Тестовая страница `/test-design/` с превью всех примитивов
- [⏸] Финальная полировка визуала — после сборки всех страниц (Phase 3-6), сделаем общим проходом
- [⏸] SVG-логотип — с финальной полировкой

Phase 3 закрыта 2026-04-25 (см. `.planning/phases/03-vertical-slice/03-CONTEXT.md`):

- [x] Главная со всеми блоками: Hero, Audience (3 колонки), WhyTurnkey, LocalExpertise (чёрный блок), ServicesPreview, CasesPreview, HowWeWork, ContactBlock (PAGE-01)
- [x] Форма с 4 полями + чекбокс согласия + honeypot, живая валидация телефона (red/green подсветка + JS-блокировка submit) (FORM-01, FORM-02)
- [x] Netlify Forms интеграция через `__forms.html` + видимая форма с data-netlify (FORM-03, FORM-05)
- [x] Netlify Function `submission-created.ts` → дубль в Telegram-бот (FORM-04). Тест прошёл: Маша получила уведомление в чат
- [x] Страница `/thanks/` на русском, страница-заглушка `/privacy/`
- [x] `<Seo>` компонент: canonical, OG, Twitter-card (SEO-01)
- [x] `<JsonLdGraph>` с Organization + LocalBusiness + ContactPoint (SEO-02)
- [x] Микроразметка Organization + PostalAddress в футере (SEO-04)
- [x] Метрика 99532899 через `requestIdleCallback` (ANL-01, ANL-03 webvisor включён)
- [⏸] Цель `form_submitted` в Метрике — операционная задача в кабинете Метрики после Phase 7 (ANL-02)
- [⏸] Замер Lighthouse Performance / LCP — будет в Phase 7 перед релизом

Phase 4 (стартует следующим):

- [ ] Research-phase в начале: семантическое ядро под сегмент C через wordstat
- [ ] Кластеризация ключей под 6 услуг
- [ ] 6 страниц услуг ≥800 слов каждая (corporate-parties, business-events, client-events, teambuilding, coordination, private)
- [ ] Витрина `/services/` с 6 карточками
- [ ] Страница `/pricing/` (или блок в /about/values/) — разбор 10%-модели
- [ ] JSON-LD Service-schema на каждой подстранице
- [ ] BreadcrumbList микроразметка
- [ ] Каждая страница имеет ссылку на ≥1 кейс + форму

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

2026-04-25 (вечер): Phase 3 закрыта. Главная end-to-end: 8 блоков, форма с живой валидацией телефона (live-подсветка + JS-блокировка submit), Netlify Forms через `__forms.html`, Netlify Function для дубля в Telegram-бот. Тестовая заявка прошла полный цикл (форма → email → Telegram → редирект на /thanks/). Метрика 99532899 подключена. SEO-разметка (JSON-LD + микроразметка). По ходу решены 3 нетривиальные проблемы: (1) Astro стрипал data-netlify → spread-атрибуты + `__forms.html`, (2) дефолтная страница Netlify вместо нашей /thanks/ → action="/thanks/" в `__forms.html`, (3) HTML pattern не работал → двойное экранирование backslashes + JS-блокировка submit как страховка. Маша попросила фиксировать все будущие правки текстов и дизайна, проходить общим заходом в Phase 6.5.

### Next Action

`/gsd-plan-phase 4` — план Phase 4 «Услуги и семантика»: research-phase для семядра под сегмент C → 6 страниц услуг ≥800 слов с фактурой из `.business/` → витрина → блок 10%-модели → JSON-LD Service-schema.

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

**Planned Phase:** 4 (Услуги и семантика) — 1 plans — 2026-04-26T12:04:14.331Z
