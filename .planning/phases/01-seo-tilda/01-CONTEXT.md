# Phase 1: Инфраструктура и SEO-аудит Tilda — Context

**Gathered:** 2026-04-25
**Status:** Ready for planning
**Source:** Operational phase — все decisions уже зафиксированы в PROJECT.md и Phase 0

<domain>
## Phase Boundary

Завести базовую инфраструктуру для разработки сайта и зафиксировать состояние текущей Tilda для будущих 301-редиректов.

**В скоупе:**
- GitHub-аккаунт + репозиторий с initial Astro 6 scaffold (INFRA-01)
- Netlify-аккаунт, привязка к GitHub, автодеплой preview-URL (INFRA-02)
- Telegram-бот через @BotFather, токен в Netlify Environment Variables рядом с уже известным `TELEGRAM_CHAT_ID=129375931` (INFRA-05)
- Полная выгрузка публичных URL Tilda-сайта (MIGR-01)
- Таблица соответствия `old_tilda_url → new_astro_url` для будущих 301-редиректов (MIGR-02)

**Вне скоупа:**
- Подключение домена крылья.life к Netlify (это INFRA-03, INFRA-04 — Phase 7)
- Реализация `_redirects` в коде (MIGR-03 — Phase 7)
- Фактическое отключение Tilda и DNS-переезд (MIGR-04 — Phase 7)
- Дизайн-система, контент, типографика (Phase 2)

</domain>

<decisions>
## Implementation Decisions

### GitHub
- **D-01:** Аккаунт GitHub создаётся под основным email Марии. Репозиторий называется `krylya` (или `krylya-life`, окончательно в момент создания).
- **D-02:** Видимость репозитория — **публичная**. Контент сайта итак будет публичным; публичный репозиторий даёт бесплатные GitHub Actions без лимитов и проще шарить.
- **D-03:** Initial-коммит — минимальный Astro 6 scaffold через `npm create astro@latest` с шаблоном «empty» или «minimal». Ничего лишнего, никаких Tailwind/MDX в этой фазе — это всё Phase 2.

### Netlify
- **D-04:** Аккаунт Netlify создаётся через GitHub OAuth (один логин, один пароль на голову — github + netlify).
- **D-05:** Сайт в Netlify создаётся «New site from Git» с привязкой к свежесозданному репо. Build command — стандартный для Astro (`npm run build`), publish directory — `dist`. Netlify сам подхватит.
- **D-06:** Имя сайта в Netlify — какое-то стандартное вида `krylya-life-{random}.netlify.app`. На крылья.life переключим в Phase 7. Сейчас работаем на этом preview-URL.

### Telegram-бот
- **D-07:** Бот создаётся через @BotFather. Имя бота человекочитаемое: «Крылья — заявки» или похожее. Username — `KryliaZayavkiBot` или `wings_zayavki_bot` (BotFather потребует `*bot` в конце).
- **D-08:** Токен бота кладём **только** в Netlify Environment Variables как `TELEGRAM_BOT_TOKEN`. В git-репозитории токенов НЕТ. Файл `.env.example` (без значений) — допустим как шаблон, но `.env` в `.gitignore`.
- **D-09:** `TELEGRAM_CHAT_ID=129375931` (получен в Phase 0) — кладём туда же в Netlify env.

### SEO-аудит Tilda
- **D-10:** Публичные URL Tilda-сайта извлекаем тремя способами и сводим в один список:
  1. Парсим `sitemap.md` (наш собственный целевой sitemap — он же ориентир для соответствия)
  2. Делаем запрос `site:крылья.life` через Яндекс/Google и собираем все URL из выдачи (пока сайт не индексирован — может быть пусто)
  3. WebFetch главной + переход по всем внутренним ссылкам (depth-2 crawl)
- **D-11:** Для каждого Tilda-URL составляем строку в таблице: `old_url → new_url → priority (high/med/low)`. Если у Tilda-URL нет прямого аналога — мапим на тематически ближайший (не на главную).
- **D-12:** Таблица сохраняется в `.planning/phases/01-seo-tilda/01-URL-MAP.md`. В Phase 7 будет конвертирована в `public/_redirects`.

### Что Мария делает руками, что — Claude

**Мария делает (нельзя автоматизировать — нужны её аккаунты и решения):**
1. Создаёт GitHub-аккаунт (если ещё нет), даёт мне username
2. Создаёт Netlify-аккаунт через GitHub OAuth
3. Создаёт Telegram-бота через @BotFather, копирует токен — присылает мне
4. Кладёт токены (`TELEGRAM_BOT_TOKEN` + `TELEGRAM_CHAT_ID=129375931`) в Netlify Environment Variables

**Claude (я) делает:**
1. Подсказываю и веду Марию пошагово через каждый шаг выше
2. Создаю Astro 6 scaffold локально, пушу в репо
3. Проверяю автодеплой Netlify (open preview URL)
4. Парсю текущую Tilda через WebFetch, собираю URL
5. Составляю URL-MAP.md
6. Пишу `.gitignore`, `.env.example`, `README.md` для репо
</decisions>

<canonical_refs>
## Canonical References

- `.planning/PROJECT.md` — Key Decisions (хостинг, токены, бот, аналитика)
- `.planning/REQUIREMENTS.md` — INFRA-01, INFRA-02, INFRA-05, MIGR-01, MIGR-02
- `.planning/ROADMAP.md` — Phase 1 success criteria
- `.planning/research/STACK.md` — Astro 6 + Netlify конфигурация
- `.planning/research/PITFALLS.md` — лицензия шрифтов, IDN, маркировка реклама — для контекста
- `.planning/phases/00-podgotovka/00-CONTEXT.md` — Phase 0 решения (TG chat_id, структура assets/)
- `sitemap.md` — целевая карта сайта (18–23 страницы), используется как ориентир для URL-MAP
- `https://крылья.life/` — текущий Tilda-сайт, источник для MIGR-01
</canonical_refs>

<code_context>
## Existing Code Insights

### Существующие активы
- `content/pages/{home,about,services,contacts}.md` — драфты (Phase 0), не трогаем в Phase 1
- `content/cases/` — пусто, наполняется в Phase 5
- `assets/team/`, `assets/cases/<slug>/` — фото-структура (Phase 0)
- `sitemap.md` — целевая карта (Phase 0)
- `brief.md` — выжимка под сайт

### Чего ещё нет
- `package.json`, `astro.config.mjs`, `src/`, `public/` — появятся в Phase 1
- `.gitignore`, `.env.example` — Phase 1
- `README.md` — Phase 1 (короткий, как мы обновляем сайт)

### Integration Points
- Phase 1 кладёт фундамент. Phase 2 на нём построит дизайн-систему. Phase 3+ — страницы.
</code_context>

<deferred>
## Deferred Ideas

- **Подключение домена крылья.life** — Phase 7
- **Реализация _redirects файла** — Phase 7 (используя URL-MAP.md из Phase 1)
- **Telegram-канал агентства** — Phase 8 (это другой Telegram-канал, не путать с ботом для уведомлений)
</deferred>

---

*Phase: 01-seo-tilda*
*Context gathered: 2026-04-25 (operational, decisions inherited from PROJECT.md + Phase 0)*
