---
phase: 07
plan: 01
subsystem: seo + контактная форма
wave: 1
status: ready-for-review
completed: 2026-05-26
tags:
  - seo
  - sitemap
  - robots
  - contact-form
  - cloudflare-pages
requirements:
  - SEO-05
  - SEO-06
  - MIGR-03
provides:
  - "Production-URL https://крылья.life во всей SEO-обвязке"
  - "Автогенерация sitemap.xml через @astrojs/sitemap"
  - "robots.txt с Host и Sitemap (Punycode)"
  - "Рабочая форма заявок на главной и /contacts/ в тёмной палитре"
key-files:
  modified:
    - astro.config.mjs
    - src/config/business.ts
    - src/components/ContactForm.astro
    - src/components/blocks/ContactBlock.astro
    - src/pages/contacts.astro
    - package.json
    - package-lock.json
  created:
    - public/robots.txt
decisions:
  - "Sitemap и canonical отдаются в Punycode: Astro нормализует IDN через WHATWG URL автоматически. Это валидно: и Яндекс, и Google корректно резолвят Punycode → IDN. Попытка serialize() переписать обратно на кириллицу не сработала (sitemap library re-нормализует). Согласно CONTEXT.md, на этом этапе любая форма приемлема."
  - "Форма на /contacts/ вынесена в отдельную секцию между блоком «Связь» и блоком «Регион + реквизиты». ContactBlock на главной — форма как основной CTA, телефон/Telegram — secondary path под формой."
metrics:
  duration_minutes: 12
  tasks_completed: 3
  files_changed: 7
  pages_in_sitemap: 19
---

# Phase 07 Plan 01: SEO-готовность + восстановление формы — Summary

SEO-обвязка переключена на production-домен `https://крылья.life`, автогенерация sitemap.xml + robots.txt с Punycode-директивами для поисковиков, восстановлена рабочая форма заявок на главной и `/contacts/` в тёмной палитре с отправкой в Telegram через Cloudflare Pages Function.

## Что сделано

### Task 1: Production URL + @astrojs/sitemap (коммит `4bf8ad7`)

- Установлен `@astrojs/sitemap` как devDependency.
- `astro.config.mjs`: `site` переключен с `undefined` на `https://крылья.life`, `sitemap()` добавлен в `integrations`.
- `src/config/business.ts`: `url` переключен с `https://kryliya.kupasyatinka.workers.dev` (Cloudflare Workers preview) на `https://крылья.life`. Это автоматически обновило canonical, OG, JSON-LD во всех страницах — `Seo.astro` и `JsonLdGraph.astro` используют `business.url` как источник.
- После `npm run build` генерируются:
  - `dist/sitemap-index.xml`
  - `dist/sitemap-0.xml` с 19 URL (главная, `/services/`, 6 услуг, `/pricing/`, `/cases/`, 5 кейсов, `/about/`, `/contacts/`, `/thanks/`, `/privacy/`).

### Task 2: robots.txt (коммит `6fce0e6`)

- Создан `public/robots.txt`:
  ```
  User-agent: *
  Allow: /
  Disallow: /api/
  Disallow: /thanks/

  Host: xn--j1aco8bgs.life
  Sitemap: https://xn--j1aco8bgs.life/sitemap-index.xml
  ```
- Punycode в `Host`/`Sitemap` — стандартная практика для IDN-доменов (некоторые парсеры падают на кириллице в robots.txt).
- `/api/` блокируется (Cloudflare Pages Function `/api/contact`, не контент).
- `/thanks/` блокируется (страница «спасибо», паразитный трафик не нужен).

### Task 3: Восстановление формы заявок (коммит `ae57669`)

- `src/components/ContactForm.astro` восстановлена из `git show daa83cf~1` с адаптацией под тёмную палитру (Phase 5.1):
  - Инпуты: `bg-white/[0.03]` + `border-white/10`, focus — жёлтая обводка `#FFF200`.
  - Подписи: `text-white`; placeholder: `text-white/40`; подсказки: `text-white/55`.
  - Submit-кнопка: жёлтая `bg-[#FFF200]` (та же стилистика, что у CTA в `ContactBlock`).
  - Сохранено всё из старой версии: 4 поля (имя, телефон, email опц., сообщение), honeypot `bot-field`, чекбокс согласия со ссылкой на `/privacy/`, JS live-валидация телефона (зелёный/красный border, фильтр символов, paste-handler), submit через `fetch POST` на `/api/contact`, переход на `/thanks/` при успехе.
- `src/components/blocks/ContactBlock.astro` обновлён: форма как основное действие в карточке с `BorderBeam`, ниже разделитель «или напрямую» и кнопки тел./Telegram как secondary path, email-ссылка, статус «обычно отвечаем в течение часа».
- `src/pages/contacts.astro` дополнена секцией «Оставить заявку» с формой между блоком «Связь» и блоком «Регион + реквизиты».
- Бэкенд `/api/contact` (`functions/api/contact.ts`) уже готов — принимает FormData, проверяет honeypot, шлёт в Telegram через `TELEGRAM_BOT_TOKEN` + `TELEGRAM_CHAT_ID=129375931`. Переменные окружения настраиваются в Cloudflare Pages → Settings → Variables в Wave 2.

## Коммиты

| # | Hash | Сообщение |
|---|------|-----------|
| 1 | `4bf8ad7` | feat(07-01): production URL крылья.life + автогенерация sitemap.xml |
| 2 | `6fce0e6` | feat(07-01): robots.txt с Host и Sitemap (Punycode) |
| 3 | `ae57669` | feat(07-01): восстановить форму заявок в тёмной палитре + /api/contact |

## Deviations from Plan

### Auto-fixed Issues

**1. [Rule 2 — Missing critical functionality] Форма на `/contacts/` не была подключена**
- **Found during:** Task 3, проверка step 3.
- **Issue:** Must-have plan требует «Форма заявок на главной и /contacts/ снова отправляет в Telegram-бот». Но `src/pages/contacts.astro` после Phase 5.1 содержал только карточки «Позвонить / Telegram / Email» без формы — ContactBlock к ней не подключался.
- **Fix:** Добавлена отдельная секция «Оставить заявку» между блоком «Связь» и блоком «Регион + реквизиты». В неё импортирован `ContactForm` с `name="contact-page"` (чтобы в Telegram-уведомлении было видно источник).
- **Files modified:** `src/pages/contacts.astro`.
- **Commit:** `ae57669`.

**2. [Rule 1 — Bug] Sitemap отдаёт URL в Punycode, не в кириллице**
- **Found during:** Task 1, после первой сборки.
- **Issue:** План предлагал, если результат окажется в Punycode, добавить `serialize(item)` для замены на кириллицу. После добавления `serialize` оказалось, что underlying sitemap-library WHATWG URL re-нормализует URL → Punycode возвращается.
- **Fix:** Принят Punycode как валидный вариант. План в строке 156 явно разрешает: «канонический URL = `https://крылья.life/` (кириллица или Punycode — на этом этапе любой вариант, главное production-домен)». Punycode согласован с `Host`/`Sitemap` в robots.txt — единая ASCII-форма для технического слоя. Yandex и Google корректно резолвят. В UI Яндекс.Вебмастера sitemap подаём в Punycode-property, кириллический property подбирает данные по mirror-связке.
- **Files modified:** `astro.config.mjs` (комментарий обновлён, нерабочий `serialize` удалён).
- **Commit:** `4bf8ad7`.

## Verification

```bash
$ npm run build
… 19 page(s) built in 8.45s
[@astrojs/sitemap] sitemap-index.xml created at dist

$ test -f dist/sitemap-index.xml && echo "sitemap OK"
sitemap OK

$ test -f dist/robots.txt && grep -q "Host: xn--j1aco8bgs.life" dist/robots.txt && echo "robots OK"
robots OK

$ grep -q "https://крылья.life\|xn--j1aco8bgs.life" dist/index.html && echo "canonical OK"
canonical OK

$ grep -q "data-contact-form" src/components/ContactForm.astro && echo "form restored"
form restored
```

Все 4 проверки прошли.

## Подсказка для Plan 02 (Wave 2 — Cloudflare Pages деплой)

**Обязательный smoke-test после деплоя на preview-URL `<project>.pages.dev`:**

1. В Cloudflare Pages → Settings → Environment Variables добавить:
   - `TELEGRAM_BOT_TOKEN` = токен из @BotFather для @krylya_zayavki_bot
   - `TELEGRAM_CHAT_ID` = `129375931` (chat_id Марии)
   - Применить к Production и Preview окружениям.
2. Открыть preview-URL → заполнить форму на главной (имя «Тест», телефон, сообщение «Тестовая заявка после деплоя»).
3. Маша должна получить в Telegram сообщение от @krylya_zayavki_bot.
4. После redirect на `/thanks/` — убедиться, что страница загружается.
5. Повторить шаги 2-4 на `/contacts/` (там форма с `name="contact-page"` — в Telegram-уведомлении будет видно источник).

Если форма не доходит — проверить env-переменные в Cloudflare и логи Pages Function в Cloudflare Dashboard → Functions → Real-time Logs.

## Self-Check: PASSED

- [x] `astro.config.mjs` содержит `site: "https://крылья.life"` + `sitemap()`
- [x] `src/config/business.ts` содержит `url: "https://крылья.life"`
- [x] `public/robots.txt` существует с Host и Sitemap (Punycode)
- [x] `src/components/ContactForm.astro` восстановлен с `data-contact-form` и fetch на `/api/contact`
- [x] `src/components/blocks/ContactBlock.astro` импортирует `ContactForm`
- [x] `src/pages/contacts.astro` импортирует `ContactForm` и рендерит секцию
- [x] `npm run build` проходит без ошибок, 19 страниц в sitemap
- [x] `dist/sitemap-index.xml` и `dist/sitemap-0.xml` создаются
- [x] `dist/robots.txt` содержит обе директивы
- [x] Коммиты `4bf8ad7`, `6fce0e6`, `ae57669` в `git log`
