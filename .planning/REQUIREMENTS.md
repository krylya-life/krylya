# Requirements: Крылья — сайт и цифровое присутствие

**Defined:** 2026-04-23
**Core Value:** Один реальный контракт, пришедший через органический поиск на сайт к 30 июня 2026.

## v1 Requirements

Требования к релизу 15 мая 2026 + добору до 30 июня. Каждое мапится на фазу в roadmap.

### INFRA — Инфраструктура и деплой

- [ ] **INFRA-01**: Репозиторий проекта создан на GitHub под учёткой Марии и залит initial-коммит Astro 6 scaffolding
- [ ] **INFRA-02**: Netlify-сайт привязан к GitHub-репозиторию, автодеплой по push в main настроен
- [ ] **INFRA-03**: Домен крылья.life (Punycode `xn--j1aco8bgs.life`) подключён к Netlify через nic.ru с SAN-сертификатом на обе формы
- [ ] **INFRA-04**: HTTPS работает на обе формы домена (кириллическую и Punycode), кириллическая — primary; Punycode делает 301 на кириллицу
- [ ] **INFRA-05**: Netlify Environment Variables содержат `TELEGRAM_BOT_TOKEN` и `TELEGRAM_CHAT_ID` (токены не в git)

### MIGR — Миграция с Tilda

- [ ] **MIGR-01**: Выгружен полный список публичных URL текущего Tilda-сайта с их HTML-контентом для SEO-аудита
- [ ] **MIGR-02**: Составлена таблица 301-редиректов: старый Tilda-URL → новый Astro-URL
- [ ] **MIGR-03**: Таблица редиректов реализована через `public/_redirects` в Netlify и проверена curl-запросами
- [ ] **MIGR-04**: Финальная отключка Tilda-публикации и переключение DNS-записей nic.ru на Netlify (выполняется последним шагом Phase 7)

### DS — Дизайн-система

- [ ] **DS-01**: Подключён шрифт Jost (OFL, бесплатный) в 3–4 начертаниях через self-hosted `woff2`
- [ ] **DS-02**: Настроена цветовая палитра в Tailwind v4 `@theme`: монохром + акцент `#FFF200`
- [ ] **DS-03**: Реализованы UI-примитивы: Container, Section, Button, Heading
- [ ] **DS-04**: Реализован BaseLayout (html/head/Seo/Header/Footer/Метрика) с микроразметкой Organization+LocalBusiness в футере
- [ ] **DS-05**: Логотип Крыльев встроен как SVG-компонент (шрифт Demetriss внутри SVG, веб-шрифт не подключаем)

### CONT — Content Collections

- [ ] **CONT-01**: Коллекция `services` с Zod-схемой (title, slug, description, content MDX, featured image, order)
- [ ] **CONT-02**: Коллекция `cases` с Zod-схемой (title, slug, client, date, segment, challenge, solution, results, photos, testimonial reference)
- [ ] **CONT-03**: Коллекция `testimonials` с Zod-схемой (author name, role, company, photo, quote, case reference)
- [ ] **CONT-04**: Коллекция `team` с Zod-схемой (name, role, photo, bio)
- [ ] **CONT-05**: Реализованы references между коллекциями (case ↔ service ↔ testimonial)

### SEO — SEO-компоненты и мета

- [ ] **SEO-01**: `<Seo>`-компонент рендерит title, description, canonical (в кириллице), OG-теги, Twitter-карточки
- [ ] **SEO-02**: JSON-LD `@graph` с Organization + LocalBusiness + ContactPoint генерируется на всех страницах из `src/config/business.ts`
- [ ] **SEO-03**: JSON-LD Service-schema на каждой странице услуги, Event-schema на каждом кейсе, BreadcrumbList везде кроме главной
- [ ] **SEO-04**: Микроразметка itemscope/itemprop: Organization в футере, BreadcrumbList в компоненте, PostalAddress на /contacts/
- [ ] **SEO-05**: `sitemap.xml` генерируется `@astrojs/sitemap` с URL в кириллице
- [ ] **SEO-06**: `robots.txt` содержит `Host: xn--j1aco8bgs.life` и `Sitemap: https://xn--j1aco8bgs.life/sitemap.xml` (Punycode в директивах)

### PAGE — Основные страницы сайта

- [ ] **PAGE-01**: Главная (`/`): Hero с CTA, блок «Почему иногородним», 3 ключевые услуги (превью), 3 свежих кейса, форма, блок доверия (реквизиты ИП). Логотипы клиентов не публикуем — решение Маши 2026-05-02
- [ ] **PAGE-02**: Витрина услуг (`/services/`) со всеми 6 подстраницами-карточками
- [ ] **PAGE-03**: Корпоративные праздники (`/services/corporate-parties/`), ≥ 800 слов с фактурой
- [ ] **PAGE-04**: Деловые мероприятия (`/services/business-events/`), ≥ 800 слов
- [ ] **PAGE-05**: Клиентские события (`/services/client-events/`), ≥ 800 слов
- [ ] **PAGE-06**: Тимбилдинги и внутренние корпоративы (`/services/teambuilding/`), ≥ 800 слов
- [ ] **PAGE-07**: Координация дня мероприятия (`/services/coordination/`), ≥ 800 слов
- [ ] **PAGE-08**: Частные мероприятия (`/services/private/`), ≥ 800 слов
- [ ] **PAGE-09**: Страница «Как мы считаем стоимость» (`/pricing/` или блок в `/about/values/`) с прозрачной 10%-моделью
- [ ] **PAGE-10**: «О нас» (`/about/`) — история, миссия, 3 опоры бренда
- [ ] **PAGE-11**: «Команда» (`/about/team/`) с реальными фото Маши, Кристины и ключевых координаторов
- [ ] **PAGE-12**: «Ценности и подход» (`/about/values/`) включая блок «Наш тайминг дня мероприятия»
- [ ] **PAGE-13**: Витрина кейсов (`/cases/`) — несколько кейсов, точное число решим в discuss-phase 5 (минимум 2). Решение 2026-05-02: уменьшили скоуп с 5 до «несколько» — на момент Phase 5 не у всех клиентов есть согласия и фото
- [ ] **PAGE-14**: Детальная страница кейса × несколько (точные кейсы определим на старте Phase 5 — кандидаты: ВКЛЮЧИ, ДОМ, Нити дочерей ночи + свежие). Кейс ГРК «Быстринское» исключён 2026-05-02 (проект Кристины до Крыльев). ≥ 600 слов на кейс
- [ ] **PAGE-14b** (опционально): Фотоальбом с подборкой фото с разных мероприятий — отдельная страница или блок в /cases/. Решим в discuss-phase 5 в зависимости от объёма фотоархива
- [ ] **PAGE-15**: «Контакты» (`/contacts/`) с формой, Яндекс.Картой, реквизитами, телефоном, email, TG @mashavostrik
- [ ] **PAGE-16**: Политика обработки персональных данных (`/privacy/`) — текст, согласованный с 152-ФЗ для ИП

### FORM — Формы и уведомления

- [ ] **FORM-01**: Контактная форма с полями: имя, телефон, краткое описание задачи, чекбокс согласия 152-ФЗ
- [ ] **FORM-02**: Форма имеет honeypot-поле и rate-limit через Netlify встроенные механизмы
- [ ] **FORM-03**: Отправка формы сохраняет заявку в Netlify Forms и шлёт email Марии
- [ ] **FORM-04**: Netlify Function `notify-telegram.ts` дублирует заявку в личный Telegram @mashavostrik через Bot API
- [ ] **FORM-05**: Форма встраивается на главной, каждой странице услуги, на странице контактов

### ANL — Аналитика

- [ ] **ANL-01**: Счётчик Яндекс.Метрики подключён через inline-скрипт с отложенной загрузкой (`requestIdleCallback`), не блокирует LCP
- [ ] **ANL-02**: Цель «form_submitted» настроена в Метрике, триггерится после успешной отправки формы
- [ ] **ANL-03**: Webvisor и карта кликов включены

### SEMA — Семантика и on-page оптимизация

- [ ] **SEMA-01**: Собрано семантическое ядро под сегмент C — кластеры ключей по 6 услугам + общим коммерческим запросам («ивент-агентство Калининград» и производные)
- [ ] **SEMA-02**: Каждая коммерческая страница (6 услуг + витрина + портфолио) оптимизирована под свой кластер ключей: title, description, H1, alt, плотность
- [ ] **SEMA-03**: Каждый кейс оптимизирован под название клиента + тип события + регион

### LAUNCH — Запуск и индексация

- [ ] **LAUNCH-01**: Сайт добавлен в Яндекс.Вебмастер в обеих формах (кириллическая — primary, Punycode — зеркало)
- [ ] **LAUNCH-02**: В Вебмастере указан регион «Калининград» через «Региональность»
- [ ] **LAUNCH-03**: Sitemap.xml (кириллический URL) сабмичен в Вебмастер и Google Search Console
- [ ] **LAUNCH-04**: Ключевые страницы поданы через «Переобход страниц» в Вебмастере (лимит 20/день)
- [ ] **LAUNCH-05**: Оригинальные тексты услуг защищены через «Оригинальные тексты» в Вебмастере до публикации страниц

### PLANB — План B параллельного запуска

- [ ] **PLANB-01**: Карточка Яндекс.Бизнес создана и подтверждена: адрес, телефон, часы работы, описание, фото, ссылка на сайт
- [ ] **PLANB-02**: Telegram-канал агентства запущен (не личный Маши) с первыми 5–10 информационными постами, формат «без erid» (Стратегия-1)
- [ ] **PLANB-03**: Минимум 2 гостевых упоминания/поста в региональных VK/Telegram-пабликах Калининграда со ссылками на сайт
- [ ] **PLANB-04**: Процесс ручного «Переобхода страниц» в Вебмастере поставлен регулярным (20 URL/день) на период первых 60 дней

### SMM — Разовый SMM-план

- [ ] **SMM-01**: Стратегия SMM в виде документа: позиционирование, 4–6 рубрик, тон, KPI, регистры Instagram и Telegram под 38-ФЗ
- [ ] **SMM-02**: Контент-календарь на 8 недель с темами + форматами + датами для Telegram и Instagram (одинаковый контент для обеих площадок)
- [ ] **SMM-03**: Шаблоны структур: reel-кейс, сторис-возражение, пост-экспертиза, сторис-закулисье — каждый с чек-листом «прошло ли фильтр 38-ФЗ»
- [ ] **SMM-04**: Минимум 5 готовых постов/сценариев «под ключ», которые Мария может опубликовать без переработки

## v2 Requirements

Отложено после 30 июня 2026.

### ADS — Платный трафик

- **ADS-01**: Рекламная кампания в Яндекс.Директе на коммерческие поисковые запросы
- **ADS-02**: Ретаргетинг в Директе по посетителям сайта
- **ADS-03**: А/В-тестирование landing-вариантов под Директ-трафик

### BLOG — Контент-маркетинг

- **BLOG-01**: Первые 5–10 SEO-статей в блоге под низкочастотные запросы сегмента C («10 площадок Калининграда для корпоратива» и т. п.)
- **BLOG-02**: Редакционный календарь блога

### PHOTO — Фотоархив

- **PHOTO-01**: Система хранения и систематизации фотографий с мероприятий (тегирование, поиск, подготовка к постам)

### CASES-MORE — Добор кейсов

- **CASES-MORE-01**: Добор портфолио с 5 до 10 кейсов
- **CASES-MORE-02**: PDF-презентация агентства для отправки в переписку

## Out of Scope

Явные исключения — чтобы не всплывали заново.

| Feature | Reason |
|---------|--------|
| Деплой на Vercel | Vercel Fair Use запрещает коммерческое продвижение на Hobby tier |
| Переезд на WordPress | Требует регулярной техподдержки, Astro проще и дешевле |
| Визуальный клон Tilda | Текущий сайт оценён Марией как «чиповые работы» — нет смысла копировать |
| Лицензия FuturaPT | Jost (OFL) покрывает задачу бесплатно и геометрически близок |
| Demetriss как веб-шрифт | Используется только в SVG-логотипе, лицензия не нужна |
| Онлайн-калькулятор цены | Ломает премиум-позиционирование, упрощает сложное |
| Чат-виджет / попапы по таймеру | Anti-features для B2B-премиума |
| Stock-фото команды и мероприятий | Убивает доверие сегмента C |
| Рейтинги «★★★★★» | Несерьёзный паттерн для B2B |
| Мобильное приложение, CRM, личный кабинет | Не нужно бизнес-модели |
| Английская версия сайта | 100% клиентов русскоязычные |
| Google Analytics 4 | 70%+ трафика в РФ B2B-ивент идёт из Яндекса, GA4 — шум |
| Прямые CTA и цены в Instagram | 38-ФЗ, штраф 4–20 тыс ₽/пост для ИП с 01.09.2025 |
| Маркировка рекламы через ОРД в Telegram | Мораторий ФАС до конца 2026; Стратегия-1 «информирование» не требует erid |

## Traceability

Заполнено роудмаппером 2026-04-23. Каждое v1-требование → ровно одна фаза.

| Requirement | Phase | Status |
|-------------|-------|--------|
| INFRA-01 | Phase 1 | Pending |
| INFRA-02 | Phase 1 | Pending |
| INFRA-03 | Phase 7 | Pending |
| INFRA-04 | Phase 7 | Pending |
| INFRA-05 | Phase 1 | Pending |
| MIGR-01 | Phase 1 | Pending |
| MIGR-02 | Phase 1 | Pending |
| MIGR-03 | Phase 7 | Pending |
| MIGR-04 | Phase 7 | Pending |
| DS-01 | Phase 2 | Pending |
| DS-02 | Phase 2 | Pending |
| DS-03 | Phase 2 | Pending |
| DS-04 | Phase 2 | Pending |
| DS-05 | Phase 2 | Pending |
| CONT-01 | Phase 2 | Pending |
| CONT-02 | Phase 2 | Pending |
| CONT-03 | Phase 2 | Pending |
| CONT-04 | Phase 2 | Pending |
| CONT-05 | Phase 2 | Pending |
| SEO-01 | Phase 3 | Pending |
| SEO-02 | Phase 3 | Pending |
| SEO-03 | Phase 4 | Pending |
| SEO-04 | Phase 3 | Pending |
| SEO-05 | Phase 7 | Pending |
| SEO-06 | Phase 7 | Pending |
| PAGE-01 | Phase 3 | Pending |
| PAGE-02 | Phase 4 | Pending |
| PAGE-03 | Phase 4 | Pending |
| PAGE-04 | Phase 4 | Pending |
| PAGE-05 | Phase 4 | Pending |
| PAGE-06 | Phase 4 | Pending |
| PAGE-07 | Phase 4 | Pending |
| PAGE-08 | Phase 4 | Pending |
| PAGE-09 | Phase 4 | Pending |
| PAGE-10 | Phase 6 | Pending |
| PAGE-11 | Phase 6 | Pending |
| PAGE-12 | Phase 6 | Pending |
| PAGE-13 | Phase 5 | Pending |
| PAGE-14 | Phase 5 | Pending |
| PAGE-15 | Phase 6 | Pending |
| PAGE-16 | Phase 6 | Pending |
| FORM-01 | Phase 3 | Pending |
| FORM-02 | Phase 3 | Pending |
| FORM-03 | Phase 3 | Pending |
| FORM-04 | Phase 3 | Pending |
| FORM-05 | Phase 3 | Pending |
| ANL-01 | Phase 3 | Pending |
| ANL-02 | Phase 3 | Pending |
| ANL-03 | Phase 3 | Pending |
| SEMA-01 | Phase 4 | Pending |
| SEMA-02 | Phase 4 | Pending |
| SEMA-03 | Phase 5 | Pending |
| LAUNCH-01 | Phase 7 | Pending |
| LAUNCH-02 | Phase 7 | Pending |
| LAUNCH-03 | Phase 7 | Pending |
| LAUNCH-04 | Phase 7 | Pending |
| LAUNCH-05 | Phase 7 | Pending |
| PLANB-01 | Phase 8 | Pending |
| PLANB-02 | Phase 8 | Pending |
| PLANB-03 | Phase 8 | Pending |
| PLANB-04 | Phase 8 | Pending |
| SMM-01 | Phase 8 | Pending |
| SMM-02 | Phase 8 | Pending |
| SMM-03 | Phase 8 | Pending |
| SMM-04 | Phase 8 | Pending |

**Coverage:**
- v1 requirements: 65 (полный инвентарь REQ-ID; заголовок «56 total» в исходнике был неточным)
- Mapped to phases: 65 ✓
- Unmapped: 0

**Phase distribution:**
- Phase 0 (Подготовка): 0 REQ (планирование)
- Phase 1 (Инфраструктура): 5
- Phase 2 (Дизайн-система): 10
- Phase 3 (Главная vertical slice): 12
- Phase 4 (Услуги + семантика): 11
- Phase 5 (Кейсы): 3
- Phase 6 (О нас/команда/контакты): 5
- Phase 7 (Релиз + SEO-запуск): 11
- Phase 8 (План B + SMM, параллельно с 7): 8

---

*Requirements defined: 2026-04-23*
*Last updated: 2026-04-23 — traceability заполнен роудмаппером*
