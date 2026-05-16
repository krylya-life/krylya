---
gsd_state_version: 1.0
milestone: v1.0
milestone_name: milestone
status: completed
last_updated: "2026-05-05T20:09:36.866Z"
progress:
  total_phases: 9
  completed_phases: 0
  total_plans: 7
  completed_plans: 0
  percent: 0
---

# Project State: Крылья — сайт и цифровое присутствие

## Project Reference

**Core Value:** Один реальный контракт, пришедший через органический поиск на сайт к 30 июня 2026.

**Current Focus:** Phase 5 — discuss-phase прошла 2026-05-05, контекст зафиксирован в `05-CONTEXT.md`. Маша собрала фото и согласия для 5 кейсов: ВКЛЮЧИ (ССК), Расцвет, ДОМ-фестиваль, АЭРО, юбилей в кругу близких (анонимная подача). Решено: hero — большое фото-обложка с заголовком поверх, факты чипами, текст «задача → решение → итог», в конце CTA + следующий кейс. Сетка 3 колонки, топ-12 фото на кейс, без лайтбокса, обложка вручную в frontmatter. Витрина — карточки по дате, релиз всех 5 одновременно. Фотоальбом откладываем. Следующий шаг — `/gsd-plan-phase 5`.

**Хостинг (2026-05-01):** Netlify приостановил сайт за превышение бесплатного лимита кредитов (биллинговый цикл сбрасывается ~23 мая, что не подходит при дедлайне релиза 15 мая). Сайт переехал на Cloudflare Workers (Static Assets) через Direct Upload. Текущий URL preview: `https://kryliya.kupasyatinka.workers.dev`. Форма заявок временно отключена — показывает контактные кнопки (телефон + Telegram). Автодеплой через Git временно не настроен — деплой через ручной upload ZIP в Cloudflare Workers UI. Возврат формы и автодеплой — следующая итерация (после Phase 4 ревью).

**Timeline:**

- Старт: 2026-04-23
- Релиз сайта: ≤ 2026-05-15
- Дедлайн Core Value: 2026-06-30

## Current Position

- **Milestone:** Initial release (v1)
- **Phase:** 5 — Кейсы и портфолио (контекст зафиксирован, готово к планированию)
- **Plan:** ещё не создан, следующий шаг — `/gsd-plan-phase 5`
- **Status:** Phase 5 discuss-phase done — переход к планированию
- **Progress:** 5/9 фаз выполнено (Phase 0, 1, 2, 3, 4)

```
[█████░░░░] 5/9 фаз выполнено
```

**Live preview:** https://kryliya.kupasyatinka.workers.dev (Cloudflare Workers Static Assets; форма временно показывает контакты вместо отправки)
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

### Roadmap Evolution

- Phase 5.1 inserted after Phase 5: Dark Redesign — перенос дизайна из песочницы на основной сайт (URGENT). Дедлайн релиза 15.05 прошёл, роадмап пересобирается. Phase 6 (О нас, Контакты, Политика) впитывается в эту фазу — страницы перепишутся в новом тёмном дизайне.

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

Phase 4 закрыта 2026-05-02 (см. `.planning/phases/04-services/04-PLAN.md`):

- [x] Research-phase: семантическое ядро под сегмент C, кластеризация ключей под 6 услуг (`04-SEMANTICS.md`)
- [x] 6 страниц услуг ≥800 слов каждая (corporate-parties, business-events, client-events, teambuilding, coordination, private)
- [x] Витрина `/services/` с 6 карточками
- [x] Страница `/pricing/` — разбор 10%-модели + блок «Что входит в наши 10%» в виде структурированного списка из 7 пунктов
- [x] JSON-LD Service-schema на каждой подстранице (без слова «агентских»)
- [x] BreadcrumbList микроразметка
- [x] Каждая страница имеет ссылку на форму (ссылка на кейс — отложено до Phase 5, когда будут страницы кейсов)
- [x] Вычитка Маши: 8 страниц утверждены за одну сессию, 8 коммитов
- [x] Тон Крыльев записан в долговременную память агента (`feedback_krylya_tone.md`)
- [⏸] Ссылки на конкретные кейсы со страниц услуг — переносится на Phase 5 (требуются страницы кейсов сначала)

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

2026-05-05: Discuss-phase для Phase 5 пройдена. Маша подтвердила 5 кейсов с согласиями (ВКЛЮЧИ-ССК, Расцвет, ДОМ-фестиваль, АЭРО, юбилей в кругу близких — анонимная подача). Прошли 4 области (структура страницы, подача фото, витрина, фотоальбом) — все решения по recommended. Контекст зафиксирован в `.planning/phases/05-cases-portfolio/05-CONTEXT.md` (коммит 819405e). Параллельно (2026-05-04): уточнили скоуп Phase 5 — без логотипов, отзывов и бюджетов, удалены упоминания Быстринского из brief.md / template / README assets (коммит 43f185a).

### Next Action

`/gsd-plan-phase 5` — план фазы. На входе: 05-CONTEXT.md с 15 решениями, фотоархив в `assets/cases/` (5 папок с фото — 26-331 фото на кейс), 2 драфта кейсов в `src/content/cases/` (dom-festival, vklyuchi-partnerskij-vecher) — нужно дописать; плюс 3 новых кейса (Расцвет, АЭРО, юбилей в кругу близких) написать с нуля. Также построить шаблон страницы кейса `src/pages/cases/[slug].astro`, витрину `src/pages/cases/index.astro`, новый компонент JsonLdEvent.astro, расширить Content Collections schema (поле `cover`). Все 5 кейсов публикуются одновременно после завершения работы.

Решения, зафиксированные ранее (см. `05-CONTEXT.md`):

- Hero страницы кейса — большое фото-обложка с заголовком поверх, чипы фактов под H1
- Текст — «Задача → Решение → Итог», ≥600 слов
- Конец страницы — кнопка «Обсудить мероприятие» + карточка следующего кейса
- Сетка фото — 3 колонки, топ-12 на кейс, без лайтбокса, обложка вручную в frontmatter
- Витрина — карточки одинаковой сетки, по дате, фото + название + клиент + 1 чип факта
- Не публикуем: логотипы, цитаты-отзывы, бюджеты
- Лица крупным планом не используем; при необходимости размываем
- Юбилей подаётся анонимно («юбилей в кругу близких, 60 лет»)
- Фотоальбом (PAGE-14b) откладываем

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

**Planned Phase:** 5 (Кейсы и портфолио) — 4 plans — 2026-05-05T20:09:36.849Z
