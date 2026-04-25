# Крылья — сайт (крылья.life)

Сайт ивент-агентства «Крылья» (Калининград). Стек: **Astro 6** + Netlify Free + GitHub.

## Карта проекта

- [CLAUDE.md](CLAUDE.md) — навигация по проекту, как с ним работать
- [brief.md](brief.md) — выжимка бизнес-контекста под сайт
- [sitemap.md](sitemap.md) — карта страниц
- [content/](content/) — черновики страниц и кейсов
- [assets/](assets/) — фото команды и кейсов
- [.planning/](.planning/) — GSD-контур: PROJECT, REQUIREMENTS, ROADMAP, STATE, фазы

## Статус

Phase 1 (текущая): инфраструктура — GitHub + Netlify + базовый Astro-скаффолд. Сайт ещё не привязан к домену крылья.life.

## Локальная разработка

```bash
# установить зависимости (один раз после клонирования)
npm install

# поднять dev-сервер на http://localhost:4321
npm run dev

# собрать продакшн-билд в dist/
npm run build

# посмотреть, что собралось (на http://localhost:4321)
npm run preview
```

Требуется **Node.js 22+** (см. `package.json` → `engines`).

## Деплой

Любой push в `main` автоматически собирается на Netlify и публикуется на preview-URL. Production-домен `крылья.life` подключим в Phase 7.

## Переменные окружения

Локально — в `.env` (см. `.env.example` как шаблон).
На продакшне — в Netlify Site settings → Environment variables.

| Ключ | Что | Когда нужен |
|---|---|---|
| `TELEGRAM_BOT_TOKEN` | Токен бота для уведомлений о заявках | Phase 3 (форма) |
| `TELEGRAM_CHAT_ID` | Куда бот шлёт сообщения (Telegram Марии) | Phase 3 (форма) |

`.env` в `.gitignore` — токены НИКОГДА не попадают в репозиторий.
