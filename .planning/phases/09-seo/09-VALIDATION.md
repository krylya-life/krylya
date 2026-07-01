---
phase: 9
slug: seo
status: draft
nyquist_compliant: false
wave_0_complete: false
created: 2026-07-01
---

# Phase 9 — Validation Strategy

> Per-phase validation contract for feedback sampling during execution.

---

## Test Infrastructure

| Property | Value |
|----------|-------|
| **Framework** | none — фаза аудита; проверка через build + grep по `dist/` + внешние кабинеты |
| **Config file** | none |
| **Quick run command** | `npm run build` |
| **Full suite command** | `npm run build && grep -R "крылья.life" dist/` |
| **Estimated runtime** | ~30 seconds |

---

## Sampling Rate

- **After every task commit:** Run `npm run build`
- **After every plan wave:** Run `npm run build && grep -R "xn--" dist/index.html` (должно быть пусто в canonical/loc)
- **Before `/gsd-verify-work`:** Build зелёный, `dist/` без Punycode в canonical/OG/sitemap `<loc>`
- **Max feedback latency:** 30 seconds

---

## Per-Task Verification Map

| Task ID | Plan | Wave | Requirement | Threat Ref | Secure Behavior | Test Type | Automated Command | File Exists | Status |
|---------|------|------|-------------|------------|-----------------|-----------|-------------------|-------------|--------|
| 9-01-01 | 01 | 1 | AUDIT-01 | — | N/A | build+grep | `npm run build` | ❌ W0 | ⬜ pending |

*Status: ⬜ pending · ✅ green · ❌ red · ⚠️ flaky*

*Заполняется планировщиком / gsd-nyquist-auditor на основе итоговых PLAN.md.*

---

## Wave 0 Requirements

*Existing infrastructure covers all phase requirements — фаза аудита не вводит тест-фреймворк; проверки идут через build, grep по `dist/` и ручные проверки в кабинетах.*

---

## Manual-Only Verifications

| Behavior | Requirement | Why Manual | Test Instructions |
|----------|-------------|------------|-------------------|
| Цель «форма отправлена» в Метрике срабатывает как JS-событие | AUDIT-02 | Требует входа в кабинет Метрики и тестовой отправки формы | Отправить тестовую заявку → в Метрике «Отчёты → Конверсии» появляется достижение цели |
| Оба property (кириллица + Punycode) в GSC, sitemap без ошибок, покрытие видно | AUDIT-03 | Внешний кабинет Google | Проверить в GSC отчёт «Индексирование → Страницы» и «Файлы Sitemap» |
| Базлайн зафиксирован (позиции Я+G, показы/клики 30д, число проиндексированных) | AUDIT-04 | Данные только из кабинетов Вебмастера/GSC | Снять цифры в таблицу базлайна, заморозить список запросов |
| Свой трафик Марии исключён на всех устройствах | AUDIT-02 | Браузерная cookie-метка, ручное действие на каждом устройстве | Проставить «не учитывать мои визиты» в браузере ПК и телефона |

---

## Validation Sign-Off

- [ ] All tasks have `<automated>` verify or Wave 0 dependencies
- [ ] Sampling continuity: no 3 consecutive tasks without automated verify
- [ ] Wave 0 covers all MISSING references
- [ ] No watch-mode flags
- [ ] Feedback latency < 30s
- [ ] `nyquist_compliant: true` set in frontmatter

**Approval:** pending
