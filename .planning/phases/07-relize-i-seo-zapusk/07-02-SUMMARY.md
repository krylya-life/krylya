---
phase: 07
plan: 02
status: complete
date: 2026-05-28
---

# Phase 7, Wave 2 — Cloudflare Pages + форма заявок

## Что готово

- **Cloudflare Pages проект `krylya`** создан в аккаунте Kupasyatinka@gmail.com (account `7c6be0ef...`)
- **GitHub-привязка:** `krylya-life/krylya`, production branch `main`, автодеплой включён
- **Build config:** `npm run build` → `dist/`
- **Env vars:**
  - `NODE_VERSION = 22` (Plaintext)
  - `TELEGRAM_BOT_TOKEN` (Secret, encrypted)
  - `TELEGRAM_CHAT_ID = 129375931` (Plaintext)
- **Preview URL:** https://krylya.pages.dev
- **Форма /api/contact** проверена через POST: HTTP 200, `{"ok":true}`. Маша получает заявку в @krylya_zayavki_bot.

## Что было сделано в процессе

1. Создан проект через Cloudflare UI (через Playwright-автоматизацию, аккаунт Маши)
2. Первый билд упал на симлинке `public/assets/cases → ../../assets/cases` (папка `assets/cases/` в `.gitignore`, на CF-сервере её нет). Фикс в коммите `7c9bc9e`: реальная папка с обложками (5 файлов × ~16 МБ), .gitignore: `/assets/cases/` исключён, `!public/assets/cases/` разрешён.
3. Маша сгенерировала новый Bot Token через `@BotFather` `/token` → `@krylya_zayavki_bot` (старый Netlify-токен инвалидирован, что нормально — Netlify приостановлен).
4. Env vars прописаны в Settings → Variables and Secrets.
5. Пустой коммит `95ac1c0` — триггер автодеплоя для подхвата env vars.

## Что осталось до полного релиза

- **Wave 3 (07-03):** DNS-переезд nic.ru → Cloudflare nameservers, SSL, снятие `noindex` с публичных страниц.
- **Wave 4 (07-04 + 07-05):** Я.Вебмастер, GSC, цель `form_submitted` в Метрике.

## Старые проекты в аккаунте Cloudflare

В Workers & Pages остались 3 старых тестовых проекта (Workers Static Assets, ручные ZIP-деплои):
- `kryliya.kupasyatinka.workers.dev`
- `muddy-scene-a2c8.kupasyatinka.workers.dev`
- `krylya.kupasyatinka.workers.dev`

Они не мешают, но можно удалить после успешного релиза основного сайта на крылья.life.
