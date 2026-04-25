# Phase 3: Главная как vertical slice — Context

**Gathered:** 2026-04-25
**Status:** Ready for planning

<domain>
## Phase Boundary

Сделать **рабочую главную** end-to-end: все блоки сверстаны и наполнены, форма реально шлёт уведомления (email + Telegram), Метрика считает события, SEO-теги и JSON-LD на месте. После этой фазы у Крыльев есть один полностью рабочий публичный экран — даже если остальные страницы ещё не готовы, по этому URL уже можно принимать обращения.

**В скоупе:**
- Главная `/` со всеми ключевыми блоками (Hero → Почему иногородним → услуги-превью → кейсы-превью → форма → блок доверия)
- Контактная форма: 4 поля + чекбокс согласия + honeypot (FORM-01, FORM-02)
- Netlify Forms для приёма + Netlify Function `notify-telegram.ts` для дубля в Telegram (FORM-03, FORM-04)
- `<Seo>` компонент: title/description/canonical/OG/Twitter (SEO-01)
- JSON-LD `@graph` с Organization + LocalBusiness + ContactPoint (SEO-02)
- Микроразметка PostalAddress в футере (SEO-04 — Organization уже сделана в Phase 2, добавим address)
- Яндекс.Метрика через `requestIdleCallback` + цель `form_submitted` + Webvisor (ANL-01..03)
- Lighthouse Performance (mobile) ≥ 80, LCP ≤ 2.5 сек

**Вне скоупа:**
- 6 подстраниц услуг — Phase 4
- Кейсы (детальные страницы) — Phase 5
- О нас, команда, контакты — Phase 6
- Политика обработки ПДн — Phase 6 (но ссылка в форме согласия будет «заглушкой» на `/privacy/`)
- Релиз на крылья.life — Phase 7
- TG-канал агентства, Я.Бизнес карточка — Phase 8

</domain>

<decisions>
## Implementation Decisions

### Содержимое главной — берём из существующих черновиков

- **D-01:** Hero, блоки 2-9 берём из `content/pages/home.md` (драфт от Phase 0). Тексты уже одобрены Машей. На главной показываем 7 из 9 блоков:
  1. Hero
  2. Для кого и с какими задачами (3 колонки)
  3. Почему «под ключ» — это реально под ключ (10% модель)
  4. Локальная экспертиза Калининграда
  5. Превью кейсов (3-4 карточки)
  6. Как мы работаем (6 шагов)
  7. (отзывы — пока заглушка с одним testimonial из коллекции)
  8. Форма заявки
  9. (футер уже из BaseLayout, отдельно не нужен)

### Форма — короткая, по требованию FORM-01

- **D-02:** **Поля формы — 4 + чекбокс**, не 7 как в драфте home.md:
  1. Имя (text, обязательное)
  2. Телефон (tel, обязательное)
  3. Email (email, опциональное — для backup-канала)
  4. Краткое описание задачи (textarea, обязательное, до 500 символов)
  5. Чекбокс согласия с обработкой ПДн (152-ФЗ, обязательный, ссылка на `/privacy/` — заглушка)
  6. Honeypot — скрытое поле `bot-field`, заполняется ботами, не людьми (Netlify это понимает)

  Поля «формат события», «дата», «бюджет» из драфта home.md убираем — выяснится в звонке. Чем меньше барьер, тем больше заявок.

- **D-03:** Кнопка отправки: «Оставить заявку» (primary, чёрная)
- **D-04:** Под кнопкой микрокопия: «Ответим в течение рабочего дня. Без спама и рассылок.»
- **D-05:** После успешной отправки — редирект на `/thanks/` (новая страница со словом «Спасибо!» + контакты + ссылка на главную). Это нужно, чтобы цель Метрики `form_submitted` точно срабатывала на просмотре `/thanks/`.

### Архитектура отправки заявок

- **D-06:** Форма использует **Netlify Forms** (атрибут `data-netlify="true"`). Netlify сам:
  - Принимает submission
  - Шлёт email Марии (на адрес, привязанный к Netlify-аккаунту)
  - Хранит заявку в админке Netlify Forms
  - Антиспам через honeypot + reCAPTCHA (опционально включим, если будет спам)

- **D-07:** **Netlify Function** `netlify/functions/submission-created.ts` — триггерится автоматически при каждой новой заявке (Netlify event hook). Внутри:
  - Читает токен и chat_id из env
  - Шлёт сообщение в Telegram-бот @krylya_zayavki_bot методом `sendMessage`
  - Текст сообщения: имя + телефон + email + описание + дата заявки
  - Если Telegram упал — заявка всё равно сохранена в Netlify Forms и в email, ничего не теряется

- **D-08:** Лимит на размер описания — 500 символов на стороне фронта (textarea `maxlength="500"`) + ещё 1000 символов как hard limit на функции (защита от XL-payload).

### SEO

- **D-09:** **`<Seo>` компонент** — `src/components/Seo.astro`. Принимает `title`, `description`, `canonical`, `image` (для OG). Рендерит:
  - `<title>{title}</title>`
  - `<meta name="description">`
  - `<link rel="canonical">` — на каноническую кириллическую форму URL
  - `<meta property="og:*">` — type, title, description, image, url, locale=ru_RU
  - `<meta name="twitter:*">` — card=summary_large_image, title, description, image
  - В Phase 7 добавится `<link rel="alternate" hreflang="ru">` если будут варианты

- **D-10:** **JSON-LD `@graph`** — `src/components/JsonLdGraph.astro`. На каждой странице:
  - `Organization` — имя, юрреквизиты, лого, sameAs (TG канал когда будет)
  - `LocalBusiness` — это Organization + areaServed=Калининград, geo, openingHoursSpecification, priceRange="₽₽₽"
  - `ContactPoint` — телефон, email, contactType=customer service, availableLanguage=ru
  - В Phase 4 добавится `Service` schema, в Phase 5 — `Event`, везде кроме главной — `BreadcrumbList`

- **D-11:** Источник данных для JSON-LD и микроразметки — `src/config/business.ts`:
  ```ts
  export const business = {
    name: "Крылья",
    legalName: "ИП Вострикова Мария Валерьевна",
    taxId: "550209075500",
    ogrnip: "324390000038348",
    phone: "+79118627957",
    email: "wings.agency@yandex.ru",
    url: "https://крылья.life",
    region: "Калининградская область",
    locality: "Калининград",
    priceRange: "₽₽₽",
    foundingDate: "2024",
    languages: ["ru"],
  };
  ```

### Метрика (нужно решение Маши — см. секцию ниже)

- **D-12:** **Счётчик Метрики** подключается через inline-скрипт в `<body>` снизу через `requestIdleCallback`:
  ```js
  if ("requestIdleCallback" in window) {
    requestIdleCallback(loadMetrika);
  } else {
    setTimeout(loadMetrika, 1500);
  }
  ```
  Это гарантирует, что счётчик НЕ блокирует LCP (важно для целевого Lighthouse ≥ 80).

- **D-13:** **Цель `form_submitted`** — настраивается на стороне Метрики после получения номера счётчика. Триггер — просмотр URL `/thanks/`.

- **D-14:** **Webvisor + карта кликов** — включаются галочками в настройках счётчика. Я подскажу, как.

### Performance (LCP ≤ 2.5s, Lighthouse ≥ 80)

- **D-15:** Шрифт `Jost` — preload только 2 файла (cyrillic-400 и cyrillic-700), уже сделано в BaseLayout. Остальные веса ленивые.
- **D-16:** Логотип в hero — PNG как `<img>` с `loading="eager"` и `fetchpriority="high"`. Без других hero-изображений.
- **D-17:** Метрика — отложена через `requestIdleCallback` (см. D-12).
- **D-18:** Никаких сторонних скриптов кроме Метрики. Карты, виджеты, чаты — НЕТ (это в out-of-scope общего проекта).

### Что Мария делает руками, что — Claude

**Мария делает (нельзя автоматизировать):**

1. **Создать счётчик Яндекс.Метрики** — нужен `Counter ID` (число вида `12345678`).
   - Открыть https://metrika.yandex.ru
   - «Добавить счётчик»
   - Адрес сайта: `https://krylya-life.netlify.app` (на момент Phase 3 — этот URL; в Phase 7 поменяем на `крылья.life`)
   - Имя: «Крылья — сайт»
   - Часовой пояс: Калининград (UTC+2)
   - Включить: Вебвизор, карта скроллинга, аналитика форм
   - После создания — прислать мне Counter ID

2. После Phase 3 — настроить **цель `form_submitted`** в Метрике (я покажу куда нажимать)

3. После деплоя — **тестово отправить заявку** через форму. Проверить, что:
   - Пришёл email
   - Пришло уведомление в Telegram-бот @krylya_zayavki_bot

**Claude (я) делает:**

- Все блоки главной (Hero, Почему иногородним, превью услуг, превью кейсов, форма, блок доверия)
- Form-компонент с honeypot и Netlify-attributes
- Netlify Function `submission-created.ts` для Telegram
- `<Seo>` компонент + JSON-LD `@graph` + микроразметка
- Счётчик Метрики с отложенной загрузкой
- Страница `/thanks/`
- Конфиг `src/config/business.ts`

</decisions>

<canonical_refs>
## Canonical References

### Контент
- `content/pages/home.md` — драфт текстов Hero, всех блоков (источник — Phase 0)
- `.business/audience/avatar.md` — что говорить иногороднему сегменту C
- `.business/products/overview.md` — флагман и 6 направлений
- `.business/marketing/content.md` — тон голоса, что НЕ писать

### Технические решения
- `.planning/PROJECT.md` — Key Decisions (Метрика без GA4, форма Netlify→TG, отложенная Метрика)
- `.planning/REQUIREMENTS.md` — SEO-01, 02, 04; PAGE-01; FORM-01..05; ANL-01..03
- `.planning/research/STACK.md` § Netlify Forms + Functions
- `.planning/research/ARCHITECTURE.md` § JSON-LD @graph + микроразметка
- `.planning/research/PITFALLS.md` § GA4 не ставим, маркировка реклам
- `.planning/phases/02-design-system/02-CONTEXT.md` — какие компоненты уже есть

### Юр.слой
- `.business/company/legal.md` — реквизиты ИП для футера и блока доверия
- `content/pages/contacts.md` — телефон, email, формат работы (для ContactPoint)
</canonical_refs>

<code_context>
## Existing Code Insights

### Доступно после Phase 2
- `BaseLayout.astro` — оборачивает страницу, имеет слоты `seo` и `analytics`. Используем для главной и для `/thanks/`.
- `Container`, `Section`, `Heading` (с прокачкой `accent`), `Button`, `Logo` — все примитивы готовы
- `Header`, `Footer` — рабочие. В `Footer` уже микроразметка Organization. В Phase 3 добавим `PostalAddress`.
- 4 Content Collections с тестовыми записями. На главной читаем `services` (3 первых по `featured` или `order`), `cases` (3 первых), `testimonials` (1 для блока отзыва).

### Чего нет — появится в Phase 3
- `src/config/business.ts` — единый источник реквизитов
- `src/components/Seo.astro` — meta-теги
- `src/components/JsonLdGraph.astro` — структурированные данные
- `src/components/ContactForm.astro` — форма с Netlify-атрибутами
- `src/components/HeroBlock.astro`, `WhyOutOfTownBlock.astro`, `ServicesPreviewBlock.astro`, `CasesPreviewBlock.astro`, `HowWeWorkBlock.astro`, `TrustBlock.astro` — блоки главной
- `src/components/MetrikaCounter.astro` — отложенный счётчик
- `netlify/functions/submission-created.ts` — функция для дубля в Telegram
- `src/pages/thanks.astro` — страница «спасибо»

### Integration Points
- Главная использует BaseLayout с `noindex={false}` (наконец-то индексируется!) И полным набором SEO-данных через слот `seo`
- Метрика подключается через слот `analytics` в BaseLayout

</code_context>

<deferred>
## Deferred Ideas

- **reCAPTCHA / Cloudflare Turnstile на форме** — пока honeypot хватит. Включим если пойдёт спам.
- **Видеофон / hero-картинка** — anti-feature по research/FEATURES.md
- **Чат-виджет** — anti-feature
- **A/B-тестирование hero-копий** — Phase 8 если будет нужно
- **Подписка на новости** — нет рассылки, не делаем

</deferred>

---

*Phase: 03-vertical-slice*
*Context gathered: 2026-04-25*

---

## Update 2026-04-25 — Метрика

Выбран счётчик **99532899** (имя «Крылья», сайт крылья.life, owner wings.agency, целей нет — добавим `form_submitted` после Phase 3).

Не используем:
- `98626964` (Яндекс.Бизнес авто-счётчик карточки агентства — оставляем как есть)
- `101448401` (Яндекс.Бизнес авто-счётчик «проспект Мира, 41…» — оставляем)
- `99533247` (дубль с одной целью «Звонок» — после Phase 3 удалим из Метрики, чтобы не путаться)
