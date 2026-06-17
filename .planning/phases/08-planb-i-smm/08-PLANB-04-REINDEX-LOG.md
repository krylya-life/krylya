---
phase: 08
requirement: PLANB-04
status: in_progress
started: 2026-06-17
---

# Phase 8 — PLANB-04: Журнал переобхода страниц

Ритм переобхода: подавать URL ежедневно в обоих поисковиках, минимум 60 дней после релиза, пока не достигнем «Страницы в поиске» ≥ 70% от sitemap.

## Я.Вебмастер (Переобход страниц)

**Лимит:** 150 URL/день
**Sitemap:** sitemap-0.xml содержит 18 публичных URL

| Дата | Подано | Источник | Накопительно | Остаток дневного лимита |
|---|---|---|---|---|
| 2026-05-29 | 5 (Wave 4) | главная, /services/, /services/corporate-parties/, /cases/, /about/ | 5 | 145 |
| 2026-06-17 | 13 | /contacts/, /pricing/, /privacy/, 5 услуг (кроме corporate-parties), 5 кейсов | 18 | 137 |

**18/18 публичных URL переданы в очередь Я.Вебмастера.** Дальше — повторно сабмитить страницы при изменении контента (раз в 1-3 дня для свежих кейсов).

## Google Search Console (URL Inspection → Request Indexing)

**Лимит:** ~10 URL/день
**Property:** https://xn--j1aco8bgs.life/

| Дата | Подано | URL | Накопительно |
|---|---|---|---|
| 2026-06-17 (Wave 5) | 3 | /, /services/, /cases/ | 3 |
| 2026-06-17 (Phase 8 d1) | 5 | /about/, /pricing/, /contacts/, /services/corporate-parties/, /cases/dom-festival/ | 8 |

**Резерв на 2026-06-17:** 2 URL.

## Очередь приоритетов на следующие дни (GSC, ~10/день)

Не «жгём» лимит сразу — Google не любит повторных запросов на одну страницу. Лучше распределить.

**День 2:**
- /services/business-events/
- /services/client-events/
- /services/teambuilding/
- /services/coordination/
- /services/private/

**День 3:**
- /cases/60-zhemchuzhin-schastya/
- /cases/aero-otkrytie/
- /cases/rasscvet-ng-korporativ/
- /cases/vklyuchi-partnerskij-vecher/
- /privacy/

## Мониторинг

Каждые 3-7 дней проверять:

- **Я.Вебмастер → Страницы в поиске** — счётчик должен расти. Цель: ≥ 12 из 18 (≈70%) к 2026-07-31
- **GSC → Покрытие → Проиндексированные** — цель та же: ≥ 12 из 18
- **GSC → Sitemap → статус** — должен перейти из «Не получено» в «Успешно»
- **Я.Вебмастер → Регион** — отвечает на заявку до 2026-06-24 (через 7 дней от подачи 2026-06-17)
