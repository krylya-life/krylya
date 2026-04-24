# Project State: Крылья — сайт и цифровое присутствие

## Project Reference

**Core Value:** Один реальный контракт, пришедший через органический поиск на сайт к 30 июня 2026.

**Current Focus:** Phase 0 — подготовка, закрытие Open Questions, сбор фактуры и согласий перед стартом разработки.

**Timeline:**
- Старт: 2026-04-23
- Релиз сайта: ≤ 2026-05-15
- Дедлайн Core Value: 2026-06-30

## Current Position

- **Milestone:** Initial release (v1)
- **Phase:** 0 — Подготовка и уточнения
- **Plan:** ещё не создан (следующий шаг — `/gsd-plan-phase 0`)
- **Status:** Not started
- **Progress:** Phase 0/8 (0%)

```
[░░░░░░░░░] 0/8 фаз выполнено
```

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

Phase 0 (до старта Phase 1):
- [ ] Мария подтверждает: TG chat_id (через @userinfobot) — значение для `TELEGRAM_CHAT_ID`
- [ ] Проинспектировать фото-архив `~/Documents/Крылья. Общее./` на фото команды и кейсов
- [ ] Сверить черновики `../content/pages/` с текущим Tilda-сайтом
- [ ] Начать переписку с клиентами (Быстринское, ВКЛЮЧИ, ДОМ, Нити дочерей ночи) о согласиях на публикацию имени/логотипа/отзыва

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
2026-04-23: Создан ROADMAP.md по результатам research. 9 фаз (Phase 0–8), Phase 7 и 8 параллельны. Все 65 v1 REQ-ID замаплены, покрытие 100%.

### Next Action
`/gsd-plan-phase 0` — декомпозиция Phase 0 на план с must-have критериями (закрытие Open Questions, инспекция фото, сверка текстов, старт переписки по согласиям).

### Files Touched This Session
- `.planning/ROADMAP.md` (создан)
- `.planning/STATE.md` (создан)
- `.planning/REQUIREMENTS.md` (обновлён traceability-раздел)

---

*State initialized: 2026-04-23*
*Update cadence: после каждого `/gsd-transition` и `/gsd-complete-milestone`*
