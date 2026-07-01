# Phase 9: SEO-аудит и базлайн — Research

**Researched:** 2026-07-01
**Domain:** SEO-аудит, аналитика (Яндекс.Метрика), Google Search Console, IDN-домен, Astro + Cloudflare Pages
**Confidence:** HIGH (критические находки подтверждены прямым анализом кода и билда)

---

<user_constraints>
## User Constraints (from CONTEXT.md)

### Locked Decisions

- **D-01:** В базлайн берём ВСЕ коммерческие запросы групп 1–3 из `seo/keywords.md` (~17–18 запросов). Группа 4 (информационные) — в базлайн НЕ входит.
- **D-02:** Позиции фиксируем и в Яндексе, и в Google по каждому запросу. Список запросов замораживается на старте фазы.
- **D-03:** Свой трафик Марии исключаем через встроенную функцию «не учитывать мои визиты» (браузерная cookie-метка). Метку нужно проставить на компьютере И на телефоне.
- **D-04:** Фильтр по IP-адресу НЕ используем (мобильный IP динамический).
- **D-05:** В Phase 9 чиним ошибки ранга «критично» И «важно». Ранг «желательно» — в чек-лист бэклога.

### Claude's Discretion

- Доступы к кабинетам (Метрика/Вебмастер/GSC): рабочее допущение — логины у Марии есть. Все шаги пишутся пошагово «куда кликнуть, что ввести, что должно появиться».
- Инструментарий аудита (краулер, CWV, позиции) — на усмотрение Claude, в рамках бесплатных/разовых инструментов.
- Формат и место хранения чек-листа аудита и таблицы базлайна — на усмотрение Claude (роадмап предполагает `.planning/audit/`).

### Deferred Ideas (OUT OF SCOPE)

- Ошибки ранга «желательно» — в чек-лист бэклога, не чиним в Phase 9.
- Информационные запросы (группа 4) и расширение семантики — Phase 14.
- Кластеризация семантики — Phase 14.

</user_constraints>

<phase_requirements>
## Phase Requirements

| ID | Description | Research Support |
|----|-------------|------------------|
| AUDIT-01 | Полный технический SEO-аудит крылья.life с чек-листом исправлений по приоритету | Инструментарий: PageSpeed Insights + Screaming Frog + Rich Results Test; найдены критические ошибки в коде |
| AUDIT-02 | Проверка и исправление корректности Яндекс.Метрики | Счётчик без дублей, цель отправки формы — URL-редирект на /thanks/ (нужна JS-цель), «не учитывать мои визиты» |
| AUDIT-03 | Проверка корректности Google Search Console | IDN-домен: Punycode-property основная; Кириллица опционально; дублей быть не должно |
| AUDIT-04 | Фиксация базлайна метрик | Я.Вебмастер «Управление группами» + GSC Performance; 17–18 запросов из групп 1–3 |
| AUDIT-05 | Исправление критических и важных ошибок | Главная критичная ошибка в коде найдена: canonical и sitemap в Punycode вместо кириллицы |

</phase_requirements>

---

## Summary

Исследование проведено на реальном коде и билде сайта крылья.life (Astro + Cloudflare Pages, 22 страницы в `dist/`). Выявлена одна **критичная ошибка в исходном коде**, которая существует с момента запуска и требует немедленного исправления: все `<link rel="canonical">`, OG-теги, BreadcrumbList JSON-LD и `<loc>` в sitemap содержат **Punycode-домен `xn--j1aco8bgs.life`** вместо кириллического `крылья.life`. Это происходит потому, что JavaScript-метод `new URL(path, 'https://крылья.life').toString()` автоматически нормализует IDN-домен в Punycode по стандарту WHATWG URL API. При этом JSON-LD Organization/LocalBusiness в `JsonLdGraph.astro` корректно использует кириллицу (он формирует URL через шаблонные строки, а не через `new URL()`), что создаёт внутреннее противоречие.

Для Яндекс.Метрики: счётчик 99532899 подключён через единый компонент `MetrikaCounter.astro`, вебвизор включён, дубля счётчика нет. Критичная проблема: цель «отправка формы» не настроена как JS-событие (`reachGoal`) — форма при успехе делает `window.location.href = "/thanks/"`, и Метрика видит только визит на `/thanks/`. Это URL-тип цели (переход на страницу), а не JavaScript-событие. Требование ANL-02 (цель `form_submitted` как JS-событие) не выполнено — нужно добавить `window.ym(id, 'reachGoal', 'form_submitted')` перед редиректом. Опция «не учитывать мои визиты» не настроена.

Для Google Search Console: верификационный файл `google0793dafce34f21f1.html` присутствует. Для IDN-домена GSC работает по правилу «введи в нативной форме» — можно добавить Punycode-property (основная) и/или кириллическую форму. Ключевой риск: если canonical=Punycode, Google будет считать Punycode canonical (это соответствует текущему состоянию), и кириллическая форма в выдаче не будет показываться. Нужно определиться: или исправить canonical на кириллицу (и она появится в сниппетах Яндекса), или оставить Punycode как единственный canonical.

**Главная рекомендация:** До начала аудита кабинетов и снятия базлайна — сначала исправить `Seo.astro` (canonical), `astro.config.mjs` (sitemap) и `Breadcrumbs.astro` (BreadcrumbList JSON-LD), задеплоить через git push, и только потом снимать базлайн: он должен отражать корректное состояние сайта.

---

## Architectural Responsibility Map

| Capability | Primary Tier | Secondary Tier | Rationale |
|------------|-------------|----------------|-----------|
| Canonical URL | Frontend Build (Astro) | — | Генерируется при сборке в `<link rel="canonical">` через `Seo.astro` |
| Sitemap | Build-time | CDN (Cloudflare) | `@astrojs/sitemap` генерирует при `astro build`, Cloudflare Pages отдаёт статику |
| Robots.txt | Static (public/) | — | Лежит в `public/`, копируется в `dist/` при сборке |
| JSON-LD разметка | Frontend Build (Astro) | — | Inline-скрипты в `<head>`, генерируются компонентами |
| Яндекс.Метрика | Browser (Client) | — | Скрипт тега загружается в браузере, `ym()` вызывается на клиенте |
| Metrika-цель (JS-событие) | Browser (Client) | — | `window.ym(id, 'reachGoal', ...)` нужно вызвать в `ContactForm.astro` перед редиректом |
| Core Web Vitals | Browser/CDN | Build-time | LCP/CLS/INP зависят от CDN (Cloudflare), шрифтов и генерируемого Astro HTML |
| GSC и Вебмастер | External Cabinets | — | Настройки делаются в кабинетах вручную Марией; plan даёт пошаговые инструкции |
| Базлайн позиций | External Cabinets | Manual | Данные снимаются из Я.Вебмастер + GSC Performance + ручная проверка инкогнито |

---

## Critical Findings (AUDIT-ZERO: исправить до базлайна)

### КРИТИЧНО-1: Canonical и OG-URL в Punycode вместо кириллицы

**Где:** `src/components/Seo.astro` — строка `const canonical = new URL(pathname, business.url).toString()`

**Что происходит:** JavaScript WHATWG URL API метод `.toString()` нормализует IDN-домен в Punycode:

```javascript
// Проверено в Node.js:
new URL('/', 'https://крылья.life').toString()
// Результат: 'https://xn--j1aco8bgs.life/'
```

**Следствие в build-выводе (`dist/index.html`, проверено):**
```html
<link rel="canonical" href="https://xn--j1aco8bgs.life/">
<meta property="og:url" content="https://xn--j1aco8bgs.life/">
```

**Также затронуты:**
- `src/components/Breadcrumbs.astro` — BreadcrumbList JSON-LD: `"item": "https://xn--j1aco8bgs.life/"`
- `astro.config.mjs` → `dist/sitemap-0.xml`: все `<loc>` в Punycode
- `dist/sitemap-index.xml`: `<loc>` в Punycode

**КРОМЕ:** `src/components/JsonLdGraph.astro` — Organization и LocalBusiness корректно используют кириллицу через шаблонные строки (`${business.url}`), без `new URL()`. Это создаёт внутреннее противоречие: canonical = Punycode, но @id Organization = кириллица.

**Фикс для `Seo.astro`:**
```typescript
// Вместо:
const canonical = new URL(pathname, business.url).toString();
// Использовать:
const canonical = business.urlCyrillic.replace(/\/$/, '') + pathname;
```

**Фикс для `Breadcrumbs.astro`:**
```typescript
// Вместо:
item: new URL(c.href, business.url).toString(),
// Использовать:
item: business.urlCyrillic.replace(/\/$/, '') + c.href,
```

**Фикс для sitemap (astro.config.mjs):** `@astrojs/sitemap` использует значение `site` из конфига и нормализует через WHATWG URL API. Единственный способ получить кириллические `<loc>` — написать собственный sitemap. Альтернатива: оставить Punycode в sitemap (валидно), но тогда canonical тоже должен быть Punycode для консистентности. **Решение**: решить, какой домен является canonical и быть консистентным везде.

**Рекомендация плановику:** Зафиксировать единое решение по доменной форме canonical. Два варианта:
- Вариант А (Punycode canonical, консистентный): оставить ВСЁ в Punycode. Тогда ничего не чинить в sitemap/canonical, только добавить JS-цель Метрики и проверить GSC. Минус: в Яндексе сниппет показывает Punycode в адресной строке.
- Вариант Б (Кириллица canonical): исправить `Seo.astro` и `Breadcrumbs.astro` на шаблонные строки (`business.urlCyrillic + path`). Для sitemap — написать простой кастомный `sitemap.xml.js` endpoint, который генерирует `<loc>` с кириллицей. Плюс: Яндекс покажет красивый кириллический URL в сниппете.

Исходная архитектура проекта (CONTEXT.md: «canonical и `<loc>` в sitemap — в кириллице») предполагает **Вариант Б**.

[VERIFIED: прямая проверка dist/index.html и node -e "new URL()"]

---

### КРИТИЧНО-2: Цель «отправка формы» — URL-редирект, не JS-событие

**Где:** `src/components/ContactForm.astro`

**Что происходит:** При успешной отправке форма делает `window.location.href = "/thanks/"`. Метрика фиксирует это как визит на страницу `/thanks/`, а не как JavaScript-событие. `window.ym(id, 'reachGoal', 'form_submitted')` в коде НЕ вызывается — проверено grep по всем файлам `src/`.

**Требование ANL-02 выполнено частично:** Можно настроить в Метрике цель типа «Посещение страницы» для `/thanks/` — это работает. НО: задача AUDIT-02 требует именно JS-событие (надёжнее, не зависит от загрузки страницы-благодарности).

**Фикс:** Добавить в `ContactForm.astro` перед `window.location.href = "/thanks/"`:
```javascript
if (window.ym) {
  window.ym(99532899, 'reachGoal', 'form_submitted');
}
```

Дополнительно: в кабинете Метрики нужно создать цель типа «JavaScript-событие» с идентификатором `form_submitted`.

[VERIFIED: прямой анализ ContactForm.astro и grep по src/]

---

### ВАЖНО-1: `/thanks/` включена в sitemap (не должна быть)

**Где:** `dist/sitemap-0.xml`

**Что:** Страница `/thanks/` имеет `noindex` в DarkLayout и закрыта в `robots.txt Disallow: /thanks/`, но всё равно попадает в sitemap. `@astrojs/sitemap` не учитывает `noindex` автоматически.

**Фикс:** В `astro.config.mjs` добавить к конфигу sitemap:
```javascript
sitemap({
  filter: (page) => !page.includes('/thanks/'),
})
```

[VERIFIED: dist/sitemap-0.xml]

---

### ВАЖНО-2: Дублирующий JSON-LD @id между Organization и canonical

**Что:** `JsonLdGraph.astro` — `@id` организации = `https://крылья.life/#organization` (кириллица), но canonical страниц = `https://xn--j1aco8bgs.life/` (Punycode). Роботы видят несовпадение.

**Фикс:** После исправления canonical на кириллицу (КРИТИЧНО-1, Вариант Б) — это расхождение устраняется само.

[VERIFIED: dist/index.html — JSON-LD в <head>]

---

## Standard Stack (инструментарий аудита)

### Инструменты аудита

| Инструмент | Версия/URL | Назначение | Условие использования |
|------------|-----------|------------|----------------------|
| Screaming Frog SEO Spider | Free (≤500 URL) | Краулинг: broken links, title/desc, canonical, H1, alt, редиректы | Скачать, запустить на URL крылья.life |
| Google PageSpeed Insights | pagespeed.web.dev | Core Web Vitals mobile + Lighthouse | Бесплатно, без установки |
| Google Rich Results Test | search.google.com/test/rich-results | Валидация JSON-LD + микроразметки | Бесплатно, по URL или вставкой кода |
| Schema.org Validator | schema.org/docs/validator.html | Валидация schema.org разметки | Бесплатно |
| Google Search Console | search.google.com/search-console | Индексация, покрытие, позиции, ошибки | Кабинет Марии |
| Яндекс.Вебмастер | webmaster.yandex.ru | Индексация, позиции, ошибки | Кабинет Марии |
| Яндекс.Метрика | metrika.yandex.ru | Счётчик, цели, вебвизор | Кабинет Марии |
| Ручная проверка инкогнито | браузер | Снятие позиций по конкретным запросам | Бесплатно, по 17–18 запросам |

**Screaming Frog: 22 страницы в билде** — хорошо вписывается в лимит 500 URL бесплатной версии.

**Core Web Vitals на Astro + Cloudflare Pages:** Astro генерирует статический HTML, что даёт преимущество по LCP (нет SSR-задержки). По данным 2026 года, Astro на CDN в среднем на 65% быстрее по LCP, чем WordPress. Шрифты Jost уже настроены на preload + self-hosted woff2. Главный риск для LCP — изображения-обложки кейсов (lazy-loaded, большие JPEG/PNG).

[VERIFIED: pagespeed.web.dev official; CITED: developers.cloudflare.com/web-analytics]

### Чек-лист аудита (структура файлов)

Место хранения артефактов: `.planning/audit/` (новая папка, создать в Phase 9).

```
.planning/audit/
├── CHECKLIST.md          ← чек-лист аудита: ошибки + приоритеты + статус исправления
├── BASELINE.md           ← таблица базлайна позиций (17–18 запросов)
└── screenshots/          ← скриншоты кабинетов (GSC coverage, Метрика)
```

---

## Architecture Patterns

### Как работает IDN-домен на сайте сейчас

```
Пользователь → крылья.life (кириллица, DNS-CNAME → Cloudflare Pages)
                      ↓
         Cloudflare Pages отдаёт статику
                      ↓
         dist/index.html с canonical=xn--j1aco8bgs.life  ← ОШИБКА
         dist/sitemap-0.xml с <loc>=xn--j1aco8bgs.life   ← ОШИБКА
         JSON-LD Organization @id=крылья.life             ← OK
```

**Как должно быть после фикса:**
```
canonical=крылья.life        ← единая форма
<loc> в sitemap=крылья.life  ← единая форма
JSON-LD @id=крылья.life      ← уже OK
robots.txt Host=xn--j1aco8bgs.life  ← OK (Яндекс требует ACE для Host/Sitemap)
```

### Поток снятия базлайна

```
Открыть Я.Вебмастер → Эффективность → Управление группами
                        → Создать группу «Базлайн Phase 9»
                        → Добавить 17–18 запросов из seo/keywords.md группы 1–3
                        → Подождать 24–48 ч → снять позиции + показы + клики

Открыть GSC → Performance → Search results
           → Фильтр по Date: Last 28 days
           → Queries → выгрузить / проверить каждый запрос вручную
           → Pages → посмотреть сколько страниц с impressions > 0
```

### Структура чек-листа аудита (CHECKLIST.md)

```markdown
## Чек-лист аудита крылья.life — Phase 9

**Дата аудита:** YYYY-MM-DD
**Страниц проаудировано:** 22

### КРИТИЧНО (чиним в Phase 9)
| # | Ошибка | Где | Как проверить | Статус |
|---|--------|-----|---------------|--------|
| K-1 | Canonical в Punycode вместо кириллицы | Seo.astro | view-source любой страницы | [ ] |
| K-2 | OG URL в Punycode | Seo.astro | view-source | [ ] |
| K-3 | BreadcrumbList @id в Punycode | Breadcrumbs.astro | Rich Results Test | [ ] |
| K-4 | /thanks/ в sitemap | astro.config.mjs | /sitemap-0.xml | [ ] |
| K-5 | Нет JS-события form_submitted | ContactForm.astro | Метрика → Цели | [ ] |

### ВАЖНО (чиним в Phase 9)
| # | Ошибка | Где | Как проверить | Статус |
|---|--------|-----|---------------|--------|
| V-1 | ... | ... | ... | [ ] |

### ЖЕЛАТЕЛЬНО (бэклог для будущих фаз)
| # | Пожелание | Где | Приоритет |
|---|-----------|-----|-----------|
| G-1 | ... | ... | низкий |
```

---

## Don't Hand-Roll

| Проблема | Не делать | Использовать | Почему |
|----------|-----------|--------------|--------|
| Краулинг сайта | Писать свой crawler | Screaming Frog (бесплатно, ≤500 URL) | Охватывает все 300+ SEO-параметров за одну сессию |
| Core Web Vitals | Ручной замер JS | PageSpeed Insights pagespeed.web.dev | Использует реальные данные Chrome UX + Lighthouse lab |
| Валидация JSON-LD | Вручную читать JSON | Rich Results Test + schema.org Validator | Проверяют соответствие Google-критериям на rich results |
| Снятие позиций | Руками в Google/Яндекс по одному | Вебмастер «Управление группами» + GSC Performance | Дают исторические данные, показы, клики, CTR — то, что ручная проверка не даёт |
| Конвертация IDN | `new URL()` в JS | Шаблонные строки `business.urlCyrillic + path` | `new URL()` автоматически нормализует Punycode — это баг в данном контексте |

---

## Common Pitfalls

### Pitfall 1: `new URL()` нормализует IDN в Punycode

**Что идёт не так:** В Seo.astro, Breadcrumbs.astro используется `new URL(path, base).toString()`. JavaScript WHATWG URL API автоматически конвертирует Cyrillic hostname в Punycode. Это стандартное поведение — не баг интерпретатора, а спецификация.

**Почему так:** IDN-домены в URL должны передаваться в Punycode на уровне DNS и HTTP. Браузеры и Node.js следуют этому стандарту.

**Как избежать:** Никогда не строить URL с IDN-доменом через `new URL()` если нужна кириллическая форма. Использовать строковую конкатенацию: `business.urlCyrillic.replace(/\/$/, '') + path`.

**Признак ошибки:** `view-source` страницы показывает `xn--` в canonical.

[VERIFIED: node -e "new URL('/', 'https://крылья.life').toString()"]

### Pitfall 2: `@astrojs/sitemap` всегда выдаёт Punycode для IDN

**Что идёт не так:** Плагин `@astrojs/sitemap` использует значение `site` из `astro.config.mjs` и нормализует его через WHATWG URL API при генерации `<loc>` тегов. Настройкой `site: "https://крылья.life"` добиться кириллических URL в sitemap через стандартный плагин нельзя.

**Как избежать:** Написать собственный endpoint `public/sitemap.xml` (статичный) или `src/pages/sitemap.xml.js` (динамичный через Astro endpoint), который строит `<loc>` через шаблонные строки. Стандартный `@astrojs/sitemap` при IDN-домене даёт Punycode всегда.

**Альтернатива:** Принять Punycode как canonical (Вариант А выше) и оставить sitemap как есть.

[VERIFIED: dist/sitemap-0.xml — все <loc> в xn-- форме]

### Pitfall 3: `@astrojs/sitemap` включает noindex-страницы

**Что идёт не так:** Плагин не читает мета-тег `noindex` из HTML. Страница `/thanks/` с атрибутом `noindex=true` в `DarkLayout` тем не менее появляется в sitemap.

**Как избежать:** Использовать опцию `filter` в конфиге:
```javascript
sitemap({ filter: (page) => !page.includes('/thanks/') })
```

[VERIFIED: dist/sitemap-0.xml содержит /thanks/]

### Pitfall 4: GSC — два property для одного IDN-домена

**Что идёт не так:** Можно случайно добавить оба — Punycode (`xn--j1aco8bgs.life`) и кириллицу (`крылья.life`) — как отдельные property. Данные будут дублироваться, отчёты разделятся, будет путаница.

**Как правильно:** Добавить ОДИН Domain property через DNS-верификацию — и он автоматически покрывает обе формы (http/https, www/без www, кириллица/Punycode). Альтернатива: URL-prefix property на Punycode-форму (основная, уже верифицирована через HTML-файл).

**Текущая ситуация:** Верификационный файл `google0793dafce34f21f1.html` присутствует — это HTML-верификация URL-prefix property. Скорее всего, в GSC добавлен Punycode-property. Нужно проверить в кабинете.

[ASSUMED: Punycode-property в GSC предположительно добавлен на основе наличия верификационного файла; точное состояние кабинета — проверить вручную]

### Pitfall 5: Позиции у нового сайта — данные могут быть скудными

**Что идёт не так:** Для свежеиндексированного сайта в GSC и Вебмастере может быть мало данных по позициям — если по запросу меньше ~10 показов за 28 дней, данные не отображаются.

**Как обойти:** Ручная проверка позиций в инкогнито по каждому из 17–18 запросов (записывать страницу результатов, на которой появился сайт). Это единственный способ получить данные, если кабинеты не показывают запрос.

**Предупреждение:** Если сайт ещё не получил ни одного показа по некоторым запросам — в базлайне для этих запросов ставить «н/д» (нет данных), не придумывать.

[VERIFIED: webmaster.yandex.ru support — менее 10 показов не отображается]

### Pitfall 6: «Не учитывать мои визиты» — нужно активировать браузер отдельно

**Что идёт не так:** Включение опции в кабинете Метрики само по себе не исключает визиты. Нужно: (1) включить опцию в настройках, (2) открыть кабинет Метрики в КАЖДОМ браузере (на компьютере и на телефоне), в котором Мария заходит на сайт. Фильтр начинает работать через 15 минут после авторизации в браузере.

**Проверка:** Зайти на сайт крылья.life в браузере с авторизованной Метрикой, потом в Метрике открыть Вебвизор и убедиться, что этот визит не записан.

[CITED: yandex.ru/support/metrica/ru/general/filters.html]

---

## Пошаговые инструкции для кабинетов

### Яндекс.Метрика — «Не учитывать мои визиты»

**Шаг 1.** Открыть metrika.yandex.ru в браузере компьютера. Войти под учёткой Марии.

**Шаг 2.** Выбрать счётчик «99532899 — крылья.life» (или похожее название).

**Шаг 3.** В левом меню найти «Настройка» → нажать на него.

**Шаг 4.** Сверху будет несколько вкладок. Нажать «Фильтры».

**Шаг 5.** Найти строку «Не учитывать мои визиты» и поставить галочку рядом.

**Шаг 6.** Нажать «Сохранить» внизу страницы.

**Шаг 7.** Подождать 15 минут. Зайти на сайт крылья.life в этом же браузере. Открыть Метрику → Вебвизор — этот визит **не должен отображаться**.

**Шаг 8 (телефон).** Открыть тот же браузер на телефоне. Зайти на metrika.yandex.ru и войти под той же учёткой. Просто открыть страницу Метрики — этого достаточно, чтобы cookie запомнился. Закрыть. Теперь визиты с этого браузера тоже не считаются.

**Важно:** Если Мария ходит с телефона в двух разных браузерах (например, Safari и Chrome) — повторить шаг 8 в каждом из них.

[VERIFIED: yandex.ru/support/metrica — описание работы фильтра]

### Яндекс.Метрика — Создать JS-цель «form_submitted»

**Шаг 1.** В кабинете Метрики: «Настройка» → вкладка «Цели».

**Шаг 2.** Нажать «Добавить цель».

**Шаг 3.** Тип цели: «JavaScript-событие».

**Шаг 4.** Идентификатор (код цели): ввести `form_submitted`.

**Шаг 5.** Название: «Отправка заявки».

**Шаг 6.** Нажать «Добавить цель».

**Шаг 7.** Код цели (для разработчика) — добавить в `ContactForm.astro` перед `window.location.href = "/thanks/"`:
```javascript
if (window.ym) { window.ym(99532899, 'reachGoal', 'form_submitted'); }
```

**Шаг 8.** Проверить: отправить тестовую заявку через сайт. Открыть Метрику → Цели → «Отправка заявки» — должен быть счётчик «1».

### Google Search Console — Проверить и настроить property

**Шаг 1.** Открыть search.google.com/search-console. Войти под учёткой Gmail Марии.

**Шаг 2.** Посмотреть список Properties (слева вверху выпадающий список). Если видно `xn--j1aco8bgs.life` или `крылья.life` — это уже добавленный сайт.

**Шаг 3.** Если property нет: нажать «+ Добавить ресурс». Выбрать «Префикс URL». Ввести `https://xn--j1aco8bgs.life`. Верификация: выбрать «HTML-файл» → файл уже загружен → нажать «Подтвердить».

**Шаг 4.** После входа в property: левое меню → «Индексирование» → «Страницы» (Coverage). Посмотреть сколько страниц «Проиндексировано» — записать цифру в таблицу базлайна.

**Шаг 5.** Если sitemap ещё не подан: левое меню → «Индексирование» → «Файлы Sitemap». Ввести `sitemap-index.xml`. Нажать «Отправить».

**Шаг 6.** Левое меню → «Производительность» → «Результаты поиска». Период: «Последние 28 дней». Нажать вкладку «Запросы». Посмотреть список запросов — записать показы/клики/позиции по каждому из 17–18 ключей.

### Яндекс.Вебмастер — Группы запросов для базлайна

**Шаг 1.** Открыть webmaster.yandex.ru. Войти под учёткой Марии. Выбрать сайт.

**Шаг 2.** В левом меню: «Эффективность» → «Управление группами».

**Шаг 3.** Нажать «Создать группу». Назвать «Базлайн Phase 9».

**Шаг 4.** Добавить запросы по одному — все 17–18 из seo/keywords.md (группы 1–3). Нажать «Сохранить».

**Шаг 5.** Подождать 24–48 часов. Вернуться в «Управление группами» → открыть группу → посмотреть среднюю позицию, показы, клики.

**Шаг 6.** Для детальной проверки позиций по каждому запросу: «Эффективность» → «Поисковые запросы» → «Мониторинг запросов» → найти нужный запрос → посмотреть динамику по дням.

---

## Baseline Table Structure (AUDIT-04)

Формат таблицы в `.planning/audit/BASELINE.md`:

```markdown
# Базлайн позиций — крылья.life
**Дата снятия:** YYYY-MM-DD
**Состояние сайта:** после исправления canonical (Phase 9)

## Общая индексация

| Параметр | Яндекс.Вебмастер | Google Search Console |
|----------|-----------------|----------------------|
| Проиндексированных страниц | __ | __ |
| Страниц в sitemap | 21 (без /thanks/) | — |
| Ошибок индексации | __ | __ |

## Показы и клики (последние 30 дней, все запросы)

| | Яндекс.Вебмастер | Google Search Console |
|--|--|--|
| Суммарные показы | __ | __ |
| Суммарные клики | __ | __ |

## Позиции по коммерческим запросам (группы 1–3)

| # | Запрос | Группа | Позиция Яндекс | Показы Я (28д) | Клики Я (28д) | Позиция Google | Показы G (28д) | Клики G (28д) |
|---|--------|--------|---------------|----------------|---------------|----------------|----------------|---------------|
| 1 | ивент агентство калининград | 1 | | | | | | |
| 2 | организация мероприятий калининград | 1 | | | | | | |
| 3 | организация корпоратива калининград | 1+2 | | | | | | |
| 4 | event-агентство калининград | 1 | | | | | | |
| 5 | агентство праздников калининград | 1 | | | | | | |
| 6 | новогодний корпоратив калининград под ключ | 2 | | | | | | |
| 7 | организация конференции калининград | 2 | | | | | | |
| 8 | организация презентации объекта калининград | 2 | | | | | | |
| 9 | организация тимбилдинга калининград | 2 | | | | | | |
| 10 | ведущий и команда на корпоратив калининград | 2 | | | | | | |
| 11 | координация свадьбы / юбилея калининград | 2 | | | | | | |
| 12 | организовать мероприятие в калининграде из москвы | 3 | | | | | | |
| 13 | выездной корпоратив в калининграде | 3 | | | | | | |
| 14 | провести конференцию в калининграде | 3 | | | | | | |
| 15 | корпоратив на море калининградская область | 3 | | | | | | |
| 16 | площадки для корпоратива калининград | 3 | | | | | | |

*Позиции: число (1, 2…), н/д — нет данных в кабинете, >100 — не попадает в топ-100*
*Для запросов с н/д в кабинете — проверить вручную в инкогнито, записать страницу результатов*
```

**Примечание:** Запрос «организация корпоратива калининград» входит и в группу 1 и в группу 2 — в таблице одна строка.

---

## State of the Art

| Старый подход | Текущий подход | Изменение | Значение |
|--------------|----------------|-----------|---------|
| IP-фильтр в Метрике | Браузерный cookie «не учитывать мои визиты» | Актуально с появления мобильного трафика | IP динамический на 4G/5G — cookie-метка надёжнее |
| URL-цель (посещение страницы /thanks/) | JS-событие reachGoal | Не изменилось технически, но JS-событие надёжнее | reachGoal не зависит от загрузки страницы-благодарности |
| Пуш sitemap через Ping API Google | GSC → Файлы Sitemap → ввести URL вручную | Google убрал Ping API в 2023 | Только GSC |
| Google Search Console данные по позициям исторически 3 мес | Расширено до 16 месяцев (2023+) | Расширение глубины данных | Для старых сайтов удобнее, для новых сайтов — данные накопятся |
| GSC позиция = 1 страница результатов | Средняя позиция по всем показам | Не изменилось | Позиция в GSC = средняя, может быть нецелым числом |

**Устаревшее:**
- **Google Structured Data Testing Tool (SDTT)** — закрыт, заменён на Rich Results Test (search.google.com/test/rich-results)
- **Яндекс.Метрика: фильтр по IP на одном устройстве** — ненадёжен при мобильном доступе

---

## Assumptions Log

| # | Утверждение | Раздел | Риск при ошибке |
|---|-------------|--------|-----------------|
| A1 | В GSC добавлен Punycode-property (xn--j1aco8bgs.life) через HTML-файл верификации | GSC инструкции | Если property нет — нужно добавить заново; если добавлен кириллицей — расхождение с canonical |
| A2 | Cloudflare Pages перенаправляет http → https и xn-- → крылья.life (301) автоматически | Общий контекст | Если редирект не настроен — дублирование контента |
| A3 | В кабинете Метрики нет вручную созданной URL-цели на /thanks/ | Метрика цели | Если есть — нужна дополнительная проверка конфликта целей |
| A4 | Вебвизор пишет сессии (настроен в MetrikaCounter.astro: `webvisor: true`) | Метрика | VERIFIED — опция есть в коде. Проверить в кабинете, что вебвизор виден в отчётах |
| A5 | Сайт доступен по обеим формам домена без ошибок SSL | STATE.md | Если SSL не работает — аудит нужно откладывать |

---

## Open Questions (RESOLVED)

1. **Какой домен выбрать canonical — кириллица или Punycode?** — **RESOLVED: кириллица (Вариант Б).** Реализовано в плане 09-01 (Seo.astro / Breadcrumbs.astro / sitemap.xml.ts через строковую конкатенацию `business.urlCyrillic`).
   - Что мы знаем: текущий build = Punycode, архитектурный план = кириллица. Оба технически валидны для Google и Яндекса.
   - Что неясно было: какой домен показывают в поисковых сниппетах сейчас (пока canonical = Punycode).
   - Решение: выбрать кириллицу (Вариант Б) — это оригинальное намерение архитектуры и лучше для CTR в Яндексе, где пользователи видят русский URL в сниппете.

2. **Нужен ли кастомный sitemap.xml endpoint для кириллических URL?** — **RESOLVED: да, кастомный endpoint.** Реализовано в плане 09-01, Task 2 (`src/pages/sitemap.xml.ts`, `@astrojs/sitemap` удаляется, `/thanks/` не включается).
   - Что мы знаем: `@astrojs/sitemap` даёт Punycode, стандартным способом не изменить.
   - Решение: раз canonical = кириллица — написать `src/pages/sitemap.xml.ts` endpoint (~30 строк). Задача Wave 1.

3. **Сколько страниц уже проиндексировано в Яндексе и Google?** — **RESOLVED: снимается в кабинетах на этапе выполнения.** План 09-04 (Task 3) снимает число проиндексированных, план 09-05 переносит в BASELINE.md.
   - Что мы знаем: 22 страницы в build. `/thanks/` — noindex. Остаётся 21 страница для индексации.
   - Что неясно было: реальное состояние индексации — только из кабинетов.
   - Решение: Мария открывает GSC и Вебмастер (Wave 3), цифры фиксируются в базлайне (Wave 4).

---

## Environment Availability

| Зависимость | Требуется для | Доступно | Версия | Fallback |
|-------------|--------------|---------|--------|---------|
| Node.js | astro build, проверки | ✓ | v24.14.1 | — |
| npm | пакеты | ✓ | 11.11.0 | — |
| git | деплой через git push | ✓ | (не проверялась) | — |
| Cloudflare Pages | хостинг | ✓ | — | — |
| Screaming Frog | краулинг | Скачать | Free (≤500 URL) | Ручная проверка через view-source (медленно) |
| pagespeed.web.dev | CWV | ✓ (браузер) | — | Lighthouse CLI |
| Метрика кабинет | AUDIT-02 | У Марии [ASSUMED] | — | — |
| Вебмастер кабинет | AUDIT-04 | У Марии [ASSUMED] | — | — |
| GSC кабинет | AUDIT-03, AUDIT-04 | У Марии [ASSUMED] | — | — |

**Без fallback:** Кабинеты Метрики/Вебмастера/GSC критичны. Если доступов нет — это всплывёт на соответствующем шаге плана.

---

## Validation Architecture

> `workflow.nyquist_validation: true` в config.json — секция обязательна.

### Test Framework

| Property | Value |
|----------|-------|
| Framework | Нет тестового фреймворка (аудит-фаза). Валидация = ручные проверки + автоматические команды |
| Config file | нет |
| Quick run command | `grep -n "canonical" dist/index.html` |
| Full suite command | `npm run build && grep "canonical" dist/index.html && cat dist/sitemap-0.xml` |

### Phase Requirements → Validation Map

| REQ ID | Behaviour | Test Type | Automated Command | File Exists? |
|--------|-----------|-----------|-------------------|-------------|
| AUDIT-01 | Аудит-чек-лист заполнен | manual | `ls .planning/audit/CHECKLIST.md` | ❌ создать в Wave 0 |
| AUDIT-02 | Метрика корректна (счётчик ×1, JS-цель, вебвизор, фильтр) | manual (кабинет) | `grep -c "window.ym" dist/index.html` == 1 | ✓ dist есть |
| AUDIT-02 | form_submitted JS-событие в коде | auto | `grep "reachGoal" src/components/ContactForm.astro` | ❌ надо добавить |
| AUDIT-03 | GSC: property добавлен, sitemap сабмичен | manual (кабинет) | нет CLI — проверить в браузере | ✓ (проверить) |
| AUDIT-03 | Нет дублей canonical кириллица/Punycode в GSC | auto | `grep "canonical" dist/index.html | grep "крылья.life"` | ✓ dist есть |
| AUDIT-04 | Базлайн зафиксирован | manual | `ls .planning/audit/BASELINE.md` | ❌ создать в Wave 1 |
| AUDIT-05 | Canonical исправлен (кириллица) | auto | `npm run build && grep "canonical" dist/index.html | grep "крылья.life"` | ✓ dist есть |
| AUDIT-05 | /thanks/ не в sitemap | auto | `npm run build && grep "thanks" dist/sitemap-0.xml` — должно быть 0 совпадений | ✓ dist есть |
| AUDIT-05 | form_submitted JS-цель в коде | auto | `grep "reachGoal" src/components/ContactForm.astro` | ❌ |

### Sampling Rate

- **Per task commit:** `npm run build && grep "canonical" dist/index.html | head -1`
- **Per wave merge:** `npm run build && grep "крылья.life" dist/index.html | grep canonical && grep "thanks" dist/sitemap-0.xml | wc -l` (должно быть 0)
- **Phase gate:** Все автоматические команды зелёные + Мария вручную подтвердила кабинеты Метрики и GSC

### Wave 0 Gaps

- [ ] `.planning/audit/CHECKLIST.md` — создать пустой чек-лист
- [ ] `.planning/audit/BASELINE.md` — создать пустую таблицу базлайна
- [ ] `.planning/audit/` — создать папку

---

## Security Domain

> `security_enforcement` не выставлен явно → считается включённым.

### Applicable ASVS Categories

| ASVS Category | Applies | Standard Control |
|---------------|---------|-----------------|
| V5 Input Validation | yes (форма ContactForm) | Уже реализовано: honeypot, maxlength, pattern, server-side validation в CF Function |
| V2 Authentication | no — кабинеты Яндекс/Google, не наш сайт | — |
| V4 Access Control | частично | robots.txt Disallow: /api/, /thanks/ — корректно |
| V6 Cryptography | no — статический сайт, нет хранения данных | — |

### Known Threat Patterns

| Pattern | STRIDE | Standard Mitigation |
|---------|--------|---------------------|
| Скрейпинг email из source | Information Disclosure | Не хранить явный email в data-атрибутах — текущий robots.txt не закрывает это |
| Индексация служебных страниц | Information Disclosure | robots.txt Disallow /thanks/, /api/ — реализовано |
| Открытый redirect через form | Tampering | Form делает redirect только на /thanks/ (hardcoded) — OK |

---

## Sources

### Primary (HIGH confidence)

- Прямой анализ кода и dist/ сайта (`dist/index.html`, `dist/sitemap-0.xml`, `src/components/Seo.astro`, `src/components/ContactForm.astro`, `astro.config.mjs`) — [VERIFIED]
- Node.js v24.14.1 behaviour: `new URL('/', 'https://крылья.life').toString()` = Punycode — [VERIFIED]
- [yandex.ru/support/metrica/ru/general/filters.html](https://yandex.ru/support/metrica/ru/general/filters.html) — описание «не учитывать мои визиты» [CITED]
- [support.google.com/webmasters/answer/34592](https://support.google.com/webmasters/answer/34592) — GSC добавление сайта с IDNA — [CITED]

### Secondary (MEDIUM confidence)

- [pagespeed.web.dev](https://pagespeed.web.dev/) — PageSpeed Insights, бесплатный инструмент CWV — [CITED]
- [screamingfrog.co.uk/seo-spider/](https://www.screamingfrog.co.uk/seo-spider/) — Screaming Frog, Free limit 500 URL — [CITED]
- [schema.org/docs/validator.html](https://schema.org/docs/validator.html) — официальный Schema.org validator — [CITED]
- [webmaster.yandex.ru](https://webmaster.yandex.ru) — Вебмастер «Управление группами», снятие позиций — [CITED]
- [developers.google.com/search/docs/crawling-indexing/canonicalization](https://developers.google.com/search/docs/crawling-indexing/canonicalization) — Canonicalization — [CITED]

### Tertiary (LOW confidence)

- Общие данные о Core Web Vitals Astro vs WordPress (2026) — из WebSearch, не верифицировано через официальные источники — [LOW]

---

## Metadata

**Confidence breakdown:**
- Критические ошибки в коде: HIGH — верифицированы прямым анализом dist/ и Node.js
- Архитектура Метрики: HIGH — верифицирован код MetrikaCounter.astro и ContactForm.astro
- Инструментарий аудита: HIGH — официальные документации инструментов
- GSC/Вебмастер пошаговые инструкции: MEDIUM — верифицированы через official support, но UI может немного отличаться
- CWV-бенчмарки Astro: LOW — одиночный источник WebSearch

**Research date:** 2026-07-01
**Valid until:** 2026-10-01 (стабильный стек; Метрика/GSC UI меняются редко)
