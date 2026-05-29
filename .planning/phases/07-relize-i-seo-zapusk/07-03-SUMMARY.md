---
phase: 07
plan: 03
status: complete
date: 2026-05-29
---

# Phase 7, Wave 3 — DNS-переезд и публикация на крылья.life

## Что готово

- **Зона крылья.life в Cloudflare:** Active, Free plan
- **DNS-серверы домена (в nic.ru):** `bethany.ns.cloudflare.com`, `cleo.ns.cloudflare.com`
- **Cloudflare Pages → Custom domains:** `xn--j1aco8bgs.life` — Active, SSL enabled
- **CNAME @ → krylya.pages.dev** прописан в Cloudflare DNS зоне (заменил старую A → 176.57.64.107 Tilda)
- **noindex снят** с 9 публичных страниц (`/`, `/about/`, `/contacts/`, `/privacy/`, `/pricing/`, `/services/`, `/services/[slug]/`, `/cases/`, `/cases/[slug]/`)
- **noindex сохранён** на `/thanks/` (плановое поведение — страница после формы)
- **Tilda** на домене крылья.life больше не отдаётся (DNS перешёл на Cloudflare, Tilda-аккаунт сохранён как backup)

## Verification

```
curl -I https://xn--j1aco8bgs.life/
→ HTTP/2 200, server: cloudflare, cf-cache-status: DYNAMIC

curl -s https://xn--j1aco8bgs.life/ | grep -c noindex
→ 0 (главная индексируется)

curl -s https://xn--j1aco8bgs.life/thanks/ | grep -c noindex
→ 1 (страница спасибо НЕ индексируется)

curl -s https://xn--j1aco8bgs.life/sitemap-0.xml | grep -oP '<loc>[^<]+' | wc -l
→ 19 URL (все публичные страницы)
```

## Что не пошло по плану

- **DNS пропагация заняла ~12 часов** (от 19:00 28 мая до 11:00 29 мая). План закладывал «15 мин – несколько часов».
- **Кириллический домен крылья.life не принимается Cloudflare** в форму Custom domain (валидация требует ASCII). Добавили только Punycode `xn--j1aco8bgs.life`. Этого достаточно — браузеры конвертируют кириллицу в Punycode перед DNS-запросом, поэтому оба варианта работают через одну CNAME-запись.
- **Cloudflare WAF подменяет robots.txt** на новую страницу про Content Signals — наш `/robots.txt` с `Host: xn--j1aco8bgs.life` и `Sitemap: ...` перебивается. Это followup для Wave 4 — отключить WAF override на /robots.txt в Cloudflare Settings (но индексации не блокирует).
- **Sitemap URLs в Punycode**, а не в кириллице (плановое — `канонические URL — кириллицей`). Это followup, не критично для индексации (Яндекс корректно конвертирует).

## Что осталось до Phase 7 close

- **Wave 4 (07-04):** Я.Вебмастер — добавить сайт в обеих формах, регион Калининград, sitemap, переобход 5 ключевых страниц, тексты услуг в «Оригинальные тексты»
- **Wave 5 (07-05):** Google Search Console + цель `form_submitted` в Яндекс.Метрике
- **Followup (не блокер):**
  - robots.txt — отключить Cloudflare WAF override
  - sitemap — переключить на кириллические URL (опционально, для красоты)
