---
phase: 14
slug: semantika-kontent-hab
status: draft
nyquist_compliant: false
wave_0_complete: false
created: 2026-07-03
---

# Phase 14 — Validation Strategy

> Per-phase validation contract. Это статический Astro-контент-сайт без юнит-тест-фреймворка,
> поэтому «тесты» = детерминированные проверки сборки, grep по `dist/` и curl по живому сайту.
> Именно они ловят регрессии (Punycode в canonical/RSS, пропавшие статьи в sitemap, каннибализацию).

---

## Test Infrastructure

| Property | Value |
|----------|-------|
| **Framework** | none — Astro build + grep(dist/) + curl(live) assertions |
| **Config file** | none |
| **Quick run command** | `npm run build` |
| **Full suite command** | `npm run build && bash .planning/phases/14-semantika-kontent-hab/checks.sh` (checks.sh создаётся в Wave 0) |
| **Estimated runtime** | ~30–60 сек (build) |

---

## Sampling Rate

- **After every task commit:** `npm run build` (должен быть зелёным)
- **After every plan wave:** `npm run build` + grep-проверки dist/
- **Before publish/deploy:** полный набор grep + curl по живому URL
- **Max feedback latency:** ~60 сек

---

## Per-Task Verification Map

| Task ID | Plan | Wave | Requirement | Secure Behavior | Test Type | Automated Command | Status |
|---------|------|------|-------------|-----------------|-----------|-------------------|--------|
| 14-01-xx | 01 | 1 | HUB-01 | N/A | grep | `grep -c "интент" seo/keywords-2.0.md` (кластеры с интент-тегами существуют) | ⬜ pending |
| 14-01-xx | 01 | 1 | HUB-01 | anti-cannibalization | grep | ни один информационный кластер не дублирует 16 запросов из BASELINE.md | ⬜ pending |
| 14-02-xx | 02 | 2 | HUB-02, HUB-03 | IDN canonical | grep | `grep -r "xn--" dist/идеи/` → 0 совпадений в `<link rel=canonical>` и `<loc>` | ⬜ pending |
| 14-02-xx | 02 | 2 | HUB-03 | build green | build | `npm run build` exits 0; `dist/идеи/index.html` существует | ⬜ pending |
| 14-02-xx | 02 | 2 | HUB-03 | RSS cyrillic | grep | `grep "xn--" dist/rss.xml` → 0; ссылки статей в кириллице | ⬜ pending |
| 14-02-xx | 02 | 2 | HUB-03 | sitemap | grep | каждая статья `/идеи/<slug>/` присутствует в `dist/sitemap.xml` | ⬜ pending |
| 14-02-xx | 02 | 2 | HUB-03 | JSON-LD | grep | `dist/идеи/<slug>/index.html` содержит `"@type":"BlogPosting"` и BreadcrumbList | ⬜ pending |
| 14-03-xx | 03 | 3 | HUB-04 | — | grep | план тем содержит ≥ 20 строк тем с привязкой к кластеру | ⬜ pending |
| 14-03-xx | 03 | 3 | HUB-05 | interlink | grep | опубликованная статья содержит ссылку на ≥ 1 страницу `/services/` | ⬜ pending |

*Status: ⬜ pending · ✅ green · ❌ red*

---

## Wave 0 Requirements

- [ ] `.planning/phases/14-semantika-kontent-hab/checks.sh` — bash-скрипт grep/curl-проверок (canonical без xn--, sitemap содержит статьи, RSS в кириллице, JSON-LD BlogPosting). Создаётся до реализации раздела, чтобы служить регресс-щитом.

*Существующая инфраструктура (Astro build, dist/) покрывает остальное.*

---

## Manual-Only Verifications

| Behavior | Requirement | Why Manual | Test Instructions |
|----------|-------------|------------|-------------------|
| Качество и тон текста статьи | HUB-05 | Редакционная оценка — не автоматизируется | Мария читает черновик, правит фактуру, утверждает; голос «мы», тон интеллигентный |
| Разведение флагманской статьи с базлайн-запросом №12 | HUB-01, HUB-05 | Оценка каннибализации требует смыслового суждения | Проверить, что H1/title статьи не дублируют коммерческую страницу под «организовать мероприятие из москвы»; статья информационная (как), страница услуги — коммерческая |
| Кириллические имена файлов после деплоя (NFD/NFC) | HUB-03 | Проявляется только на живом Cloudflare | `curl -I https://крылья.life/идеи/<slug>/` → 200 после первого деплоя |
| Core Web Vitals витрины и статьи | HUB-03 | PageSpeed требует браузер | pagespeed.web.dev по `/идеи/` и статье, mobile |

---

## Validation Sign-Off

- [ ] Все задачи имеют grep/build/curl-проверку или Wave 0 зависимость
- [ ] Непрерывность сэмплинга: нет 3 задач подряд без автоматической проверки
- [ ] Wave 0 создаёт checks.sh, покрывающий IDN/sitemap/RSS/JSON-LD
- [ ] Нет watch-режимов
- [ ] Feedback latency < 60с
- [ ] `nyquist_compliant: true` выставлен после утверждения плана

**Approval:** pending
