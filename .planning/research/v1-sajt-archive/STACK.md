# Stack Research — крылья.life

**Domain:** Content-heavy SEO marketing site (ивент-агентство, Калининград, РФ)
**Researched:** 2026-04-22
**Overall confidence:** HIGH
**Target:** 20+ SEO-страниц на кириллическом домене, Git-управление, Claude-автоматизация, минимальный бюджет.

---

## TL;DR (прескриптивные решения)

1. **Фреймворк:** Astro **6.x** (не 5.x — Astro 6 уже стабильный с февраля-марта 2026). Node 22+.
2. **Стили:** Tailwind CSS **v4** через `@tailwindcss/vite` (НЕ через `@astrojs/tailwind` — он deprecated для v4).
3. **Контент:** Content Layer API + `glob()` loader + Zod-схемы + MDX для кейсов/услуг.
4. **Картинки:** встроенный `astro:assets` + `sharp` (дефолт). Никаких сторонних image-интеграций.
5. **SEO-инфра:** `@astrojs/sitemap` + `astro-robots-txt` + `astro-seo-schema`.
6. **Формы:** Web3Forms (основной канал на email) + Telegram Bot API через serverless-функцию хостинга (дублирование). Compare-таблица ниже.
7. **Аналитика:** Яндекс.Метрика (обязательна для РФ-сегмента и Яндекс.Вебмастера); Google Analytics не нужен в v1.
8. **Хостинг:** **Netlify Free** или **Cloudflare Workers Free** — НЕ Vercel Hobby. **Vercel Hobby запрещает коммерческое использование и advertising the sale of a product or service** — это напрямую дисквалифицирует сайт ивент-агентства. См. раздел «Критическое уточнение по Vercel».

---

## Критическое уточнение по Vercel (READ FIRST)

В Key Decisions проекта стоит «Astro + Vercel». Это надо пересмотреть.

**Факт (HIGH confidence, источник — официальная страница Vercel Fair Use):**

> **Hobby teams are restricted to non-commercial personal use only.** All commercial usage of the platform requires either a Pro or Enterprise plan.
>
> Commercial usage is defined as any Deployment that is used for the purpose of financial gain of anyone involved in any part of the production of the project. Examples:
> - Any method of requesting or processing payment from visitors of the site
> - **Advertising the sale of a product or service**
> - Receiving payment to create, update, or host the site
> - Affiliate linking is the primary purpose of the site
> - The inclusion of advertisements

Сайт крылья.life — это реклама услуг ивент-агентства с формой заявки. Это прямо попадает в **«Advertising the sale of a product or service»**. Vercel имеет право приостановить проект. Для постоянной работы в коммерческом режиме на Vercel нужен Pro ($20/user/month = ~1 800 ₽/мес × 12 = ~22 000 ₽/год).

**Рекомендация:** заменить Vercel на один из двух бесплатных хостов, которые явно разрешают коммерческое использование:

| Хост | Commercial на Free | Лимиты (2026) | Для нашего кейса |
|------|--------------------|---------------|--------------------|
| **Netlify Free** ⭐ | Да (явно разрешено) | 300 кредитов/мес (~30 GB bandwidth + ~20 сборок), формы бесплатно и без лимитов, serverless functions до 125K invocations | **Оптимально.** Native Astro adapter, Netlify Forms закрывают половину нашей задачи с формой из коробки, есть встроенные redirects (нужны для 301 со старых Tilda-URL) |
| **Cloudflare Workers Free** | Да (явно разрешено) | Unlimited bandwidth, 100K requests/день, 500 сборок/мес | Хорошо, но Cloudflare Pages в 2026 уже considered legacy: Astro adapter перешёл на Workers-only режим. Больше сложности в конфиге. |

**Решение:** первая рекомендация — **Netlify Free**. Если упираемся в лимиты (маловероятно для SEO-сайта без SPA и тяжёлого трафика) — переезжаем на Cloudflare Workers. Vercel Hobby — НЕ использовать; Vercel Pro — только если будет бюджет и сильная причина.

Это меняет несколько инженерных деталей (adapter, форма, redirects), но не меняет Astro + Tailwind + MDX.

---

## Recommended Stack

### Core Technologies

| Technology | Version | Purpose | Why Recommended |
|------------|---------|---------|-----------------|
| **Node.js** | **22 LTS** | Runtime для сборки | Astro 6 **требует** Node 22+ (18 и 20 сняты с поддержки). macOS Марии: ставить через `nvm` или `fnm`, не системно. |
| **Astro** | **6.x** (current stable) | Статический SSG-фреймворк | Content Layer API (5x быстрее Markdown, 2x MDX), Zod-валидация фронтматтера, File-based routing, Island architecture — ровно под 20+ SEO-страниц + кейсы/услуги в MDX. В 2026 Astro — де-факто стандарт для content-сайтов. |
| **Tailwind CSS** | **v4.x** | Utility-CSS | v4 — это «CSS-first»: конфиг пишется в `@theme`-блоке прямо в CSS, PostCSS не нужен, старт 5x, rebuild 100x быстрее v3. Идеально под брендбук «монохром + `#FFF200`». |
| **@tailwindcss/vite** | 4.x (peer с Tailwind) | Интеграция Tailwind в сборку Astro | Официально рекомендуемый способ с Astro 5.2+. Ставится через `npx astro add tailwind`. **НЕ путать с `@astrojs/tailwind` — он deprecated для v4.** |
| **MDX** (`@astrojs/mdx`) | latest | Контент кейсов + блога | MDX в Content Collections даёт возможность встраивать Astro-компоненты (галерея, цитата, таблица фактов кейса) прямо в markdown-текст. Для шаблона кейса — идеально. |
| **TypeScript** | 5.x | Типизация Zod-схем коллекций | Astro подхватывает автоматически. Минимальная польза: типы контент-коллекций, автокомплит `Astro.glob`, защита от опечаток в frontmatter. |

### Supporting Libraries (SEO-инфра)

| Library | Version | Purpose | When to Use |
|---------|---------|---------|-------------|
| **@astrojs/sitemap** | 3.x | Генерация `sitemap-index.xml` + `sitemap-0.xml` на сборке | Ставим с первого дня. Используем `filter`, чтобы выкинуть служебные страницы (404, черновики). |
| **astro-robots-txt** | latest | Генерация `robots.txt` с директивой `Sitemap:` и `Host:` (для Яндекса) | Ставим с первого дня. Host-директива помогает Яндексу правильно определить главное зеркало. |
| **astro-seo-schema** | latest | Type-safe JSON-LD в `<head>` через `<Schema>` компонент | Для `LocalBusiness` / `Organization` на главной и `Event` на кейсах. Powered by `schema-dts` — полная типизация. |
| **@astrojs/sitemap** c `serialize` | — | Кастомизация записей sitemap (lastmod, priority) | Через `serialize` можно выставить приоритеты: главная + услуги = 1.0, кейсы = 0.8, блог = 0.6. |
| **sharp** | 0.33+ | Image optimization (авто через `astro:assets`) | Ставится один раз как dep, дальше Astro сам использует для Image/Picture компонентов. |

### Форма заявки (НЕТ бэкенда — сравнение вариантов)

Требование: заявка приходит на wings.agency@yandex.ru **и** в Telegram (см. PROJECT.md). Сравнение сервисов для статического сайта на Netlify:

| Решение | Плюсы | Минусы | Стоимость | Рекомендация |
|---------|-------|--------|-----------|--------------|
| **Netlify Forms** | Встроено в хост; zero-config (`netlify` атрибут на `<form>`); спам-фильтр; дашборд с заявками; уведомления на email. | Только email из коробки. В Telegram — через webhook на serverless-функцию. Бесплатный тариф — без лимита submissions в 2026. | Free | **Основной канал** (email). Работает без JS, без внешних зависимостей, без CORS. |
| **Web3Forms** | Zero-config, бесплатный, отправляет на email без backend; хорошая интеграция с Astro (есть официальный гайд). | Зависимость от внешнего сервиса РФ-нейтрального; no-JS-fallback нужен руками. Отсутствует прямой Telegram-канал — те же webhook’и. | Free до 250 заявок/мес | Альтернатива, если сайт не на Netlify. |
| **Formspree** | Зрелый сервис, AJAX и no-JS варианты, Zapier/Slack. | Free tier — 50 заявок/мес, это мало при росте трафика. | Free 50/мес; $10/мес за 1000 | Не рекомендуется в v1 (маленький лимит). |
| **Telegram Bot API напрямую** | Заявка в Telegram-чат Марии мгновенно. Бесплатно. API стабильный. | Нужен endpoint: из клиента `fetch` на api.telegram.org светит токен бота в исходниках (крайне плохо). Требуется serverless-функция хоста (Netlify Functions), которая принимает POST от формы и зовёт `sendMessage`. | Free | **Дублирующий канал**: serverless-функция на Netlify принимает данные → шлёт и в Telegram, и (резерв) на email. |

**Финальная архитектура формы (HIGH confidence):**

- Вариант **A (проще, рекомендуется для v1)**: Netlify Forms для email + Netlify-триггер (notification webhook) на собственную serverless-функцию `notify-telegram.ts`, которая после успешной отправки формы зовёт `sendMessage` в Telegram-бот Марии. Токен бота — в env переменных Netlify, не в репо.
- Вариант **B (если позже мигрируем с Netlify)**: Astro SSR-endpoint (`src/pages/api/submit.ts`) в режиме `output: 'server'` + Cloudflare Workers adapter, который параллельно шлёт в SMTP (через Resend/Yandex SMTP) и в Telegram.

**В v1 — Вариант A.** Меньше кода, меньше точек отказа.

### Аналитика

| Tool | Purpose | Notes |
|------|---------|-------|
| **Яндекс.Метрика** | Статистика + Webvisor + цели на отправку формы | Обязательна: (1) Яндекс.Вебмастер любит сайты с Метрикой, (2) это бесплатный session-replay, (3) PROJECT.md прямо требует. Установка — скрипт в `<BaseHead>`. Для GDPR/152-ФЗ добавить cookie-консент. |
| Google Analytics 4 | — | **Не ставить в v1.** Сегмент C ищет в Яндексе > Google в РФ (особенно B2B-корпоративный). GA4 = лишний скрипт, лишний cookie-консент, лишний риск. Если в v2 пойдёт Google-трафик — тогда. |
| **Cookie-консент** (`jop-software/astro-cookieconsent` или собственный) | Баннер согласия на cookie | Для Метрики Яндекс даёт готовый правовой шаблон уведомления. Реализуем свой компактный баннер (проще, без зависимостей) — 30 строк кода. |

### Development Tools

| Tool | Purpose | Notes |
|------|---------|-------|
| **pnpm** | Пакетный менеджер | Быстрее npm, строже с peer-deps. Но npm/yarn тоже ок. Если Мария впервые ставит — npm проще (встроен в Node). |
| **prettier** + `prettier-plugin-astro` | Форматирование | `.prettierrc` с `plugins: ["prettier-plugin-astro"]`. Для consistent-оформления MDX-кейсов. |
| **astro check** | Встроенный type-checker | Запускать в CI перед деплоем: `astro check && astro build`. |
| **@iconify/astro** или иконки из Lucide | Иконки | Не качать целые шрифт-файлы FontAwesome. Iconify = on-demand SVG для любых наборов. |

---

## Installation

```bash
# 1. Scaffold (интерактивно, но параметры ниже)
npm create astro@latest krylya -- --template minimal --typescript strict --no-install --no-git

cd krylya
nvm use 22          # или fnm use 22
npm install

# 2. Core integrations через official CLI (прописывает всё сам)
npx astro add tailwind     # ставит tailwindcss@4 + @tailwindcss/vite, прописывает в astro.config
npx astro add mdx
npx astro add sitemap
npx astro add netlify      # adapter — когда решим по хостингу

# 3. SEO/контент-пакеты
npm install astro-robots-txt astro-seo-schema
npm install -D schema-dts  # типы для JSON-LD

# 4. Sharp (если не поставится автоматически)
npm install sharp

# 5. Если будет форма через Telegram напрямую (dev-deps не нужны — fetch встроен)
# серверная функция в netlify/functions/notify-telegram.ts
```

### Минимальный `astro.config.mjs`

```javascript
// astro.config.mjs
import { defineConfig } from 'astro/config';
import tailwindcss from '@tailwindcss/vite';
import mdx from '@astrojs/mdx';
import sitemap from '@astrojs/sitemap';
import robotsTxt from 'astro-robots-txt';
import netlify from '@astrojs/netlify';

export default defineConfig({
  // КРИТИЧНО для кириллического домена: site = Punycode URL.
  // Все canonical / sitemap-ссылки будут построены от него.
  site: 'https://xn--j1aco8bgs.life',

  // Astro 6 default — 'static'. Переключаем на 'server' только если
  // понадобится API route для формы (Вариант B выше).
  output: 'static',
  adapter: netlify(),

  integrations: [
    mdx(),
    sitemap({
      // Отфильтровать служебные страницы
      filter: (page) => !page.includes('/404') && !page.includes('/drafts'),
      serialize(item) {
        // Кастомные приоритеты для главной/услуг
        if (item.url === 'https://xn--j1aco8bgs.life/') {
          item.priority = 1.0;
          item.changefreq = 'weekly';
        } else if (item.url.includes('/services/')) {
          item.priority = 0.9;
        } else if (item.url.includes('/cases/')) {
          item.priority = 0.8;
        }
        return item;
      },
    }),
    robotsTxt({
      // Host-директива — критично для Яндекса на IDN-домене
      host: 'xn--j1aco8bgs.life',
      sitemap: true,
    }),
  ],

  vite: {
    plugins: [tailwindcss()],
  },

  // build.format: 'directory' — даёт URL вида /services/corporate-parties/
  // вместо /services/corporate-parties.html. Лучше для SEO и совпадает с sitemap.md.
  build: {
    format: 'directory',
  },
});
```

### Минимальный `src/styles/global.css` (Tailwind v4)

```css
@import "tailwindcss";

/* Брендбук: монохром + жёлтый акцент */
@theme {
  --color-brand-yellow: #FFF200;
  --color-brand-black: #0A0A0A;
  --color-brand-white: #FFFFFF;
  --color-brand-gray-50: #F7F7F7;
  --color-brand-gray-900: #171717;

  --font-display: 'FuturaPT', system-ui, sans-serif;
  --font-accent: 'Demetriss', Georgia, serif;
  --font-body: 'FuturaPT', system-ui, sans-serif;

  /* Типографика для SEO-читаемости */
  --text-hero: 3.5rem;
  --text-h1: 2.5rem;
  --text-h2: 2rem;
}
```

Затем в главном layout: `import '../styles/global.css';` — один раз.

---

## Кириллический домен крылья.life — что ломается и как чинить (HIGH confidence)

Это самая специфичная для проекта часть. Собрано по документации Vercel/Cloudflare/Yandex.

### 1. Домен хранится в Punycode — везде, где железо

- Регистратор nic.ru: домен зарегистрирован как `крылья.life`, но DNS и SSL-сертификаты оперируют ТОЛЬКО Punycode-формой `xn--j1aco8bgs.life`.
- **В Netlify/Cloudflare при добавлении custom domain** нужно вводить `xn--j1aco8bgs.life` — кириллица будет отклонена формой. Это подтверждённое поведение.
- **SSL через Let's Encrypt** работает на Punycode. Если в CAA-записях домена уже стоят другие сертификат-провайдеры, добавить `0 issue "letsencrypt.org"`.

### 2. `site` в `astro.config` — ВАЖНО: Punycode

- Ставим `site: 'https://xn--j1aco8bgs.life'`.
- Из этого Astro строит canonical URL и все ссылки в `sitemap-0.xml`.
- **Почему Punycode, а не кириллица:** `robots.txt` и HTTP-заголовки по спецификации (и по требованию Яндекс.Вебмастера) **не допускают кириллицу**. Всё что попадает в машину — только Punycode.
- В `robots.txt` директива `Host:` должна быть `Host: xn--j1aco8bgs.life` (явное требование Яндекса).

### 3. В `sitemap.xml` — Punycode URL

- Яндекс и Google нормально понимают оба варианта, но **стандарт sitemap 0.9 требует URL-encoded форму**. Punycode + URL-encoded путь = 100% совместимость.
- `@astrojs/sitemap` сгенерирует Punycode автоматически, если `site` задан в Punycode. Проверять в `/dist/sitemap-0.xml` после первого билда.

### 4. В контенте сайта — кириллица

- В `<title>`, `<meta description>`, в body, в письмах, на визитках — пишем и показываем **«крылья.life»**. Это часть бренда, так решила Мария.
- В hreflang, в og:url, в canonical `<link>` — **Punycode** (машинное чтение).
- Браузеры сами покажут кириллицу в адресной строке, если IDN-домен — «безопасный» (кириллица — безопасна для `.life`).

### 5. Редиректы со старого Tilda

- Tilda-домен — тот же `крылья.life`. Значит редиректы нужны со старых Tilda-URL на новые.
- На Netlify: `_redirects` файл в `public/` или `netlify.toml`. 301-редиректы с сохранением query.
- Важно: проверить через Яндекс.Вебмастер, какие URL Tilda вообще проиндексированы (проект PROJECT.md пишет, что не проиндексирован ни в одном поисковике — значит ущерб от редиректов минимальный).

### 6. Яндекс.Вебмастер + Google Search Console

- Верификацию делаем через **meta-тег в `<head>`** (самый простой способ для статического Astro).
- В Вебмастере регистрируем именно `xn--j1aco8bgs.life` (Яндекс сам покажет кириллическое имя в интерфейсе).
- Sitemap сабмитим как `https://xn--j1aco8bgs.life/sitemap-index.xml`.

### 7. Потенциальные гетчи

- **Open Graph og:image** — путь к картинке должен быть абсолютный и на Punycode-домене, иначе некоторые парсеры (особенно Telegram и ВК) не подтянут превью.
- **Почта (wings.agency@yandex.ru)** — не связана с доменом, это отдельный почтовый сервис. Нет риска.
- **Email-алиасы на домене** (@крылья.life) — не планируются, и хорошо: IDN-email работает криво в половине почтовиков. Если когда-то понадобится — делать алиас на xn--j1aco8bgs.life.

---

## Alternatives Considered

| Recommended | Alternative | When to Use Alternative |
|-------------|-------------|-------------------------|
| **Astro 6** | Next.js 15 (App Router) | Если бы сайт был SPA или требовал тяжёлого клиентского интерактива. Для 20 SEO-страниц + форма — overkill, и Vercel-bound по экосистеме. |
| **Astro 6** | WordPress (managed host) | Если заказчик сам хочет править тексты в админке. Мария явно отказалась — нужна автоматизация через Claude. |
| **Astro 6** | SvelteKit | Отличная альтернатива, но экосистема content-коллекций и MDX у Astro сильнее и документация богаче. |
| **Tailwind v4** | Vanilla CSS + CSS Modules | Для маленького однотонного сайта ок, но при 20+ страницах и необходимости быстрой итерации дизайна Tailwind кратно экономит время. |
| **Netlify Free** | Vercel Pro ($20/мес) | Если бюджет появляется. DX Vercel на уровне; но для marketing-сайта бенефит не окупает ~22 тыс ₽/год. |
| **Netlify Free** | Cloudflare Workers Free | Если упрёмся в лимиты Netlify или понадобится edge-runtime. Сложнее конфиг, но unlimited bandwidth. |
| **Netlify Forms** | Собственная serverless-функция с SMTP | Больше контроля, можно хранить заявки в БД. Но сложнее, и БД — ещё одна подписка. |
| **Web3Forms/Formspree** | Google Forms | Google Forms не даёт кастомную вёрстку и форму нельзя красиво встроить — отказывается. |
| **Яндекс.Метрика** | Plausible, Simple Analytics | Cookie-less, красивые дашборды, GDPR из коробки. Но Яндекс.Вебмастер приоритизирует сайты с Метрикой; для РФ-SEO это почти must-have. |
| **build.format: 'directory'** | `'file'` | 'file' даёт `/services/corporate-parties.html`, менее чисто для SEO. 'directory' — стандарт. |

---

## What NOT to Use

| Avoid | Why | Use Instead |
|-------|-----|-------------|
| **`@astrojs/tailwind`** | Deprecated для Tailwind v4. Многие туториалы 2024-начала-2025 года до сих пор его показывают — игнорировать. | `@tailwindcss/vite` через `npx astro add tailwind` |
| **Vercel Hobby Plan** | Terms of Service запрещают «Advertising the sale of a product or service» — это ровно кейс коммерческого marketing-сайта. Vercel может заблокировать проект. | Netlify Free или Cloudflare Workers Free (оба явно разрешают коммерческое использование). |
| **`@astrojs/image` (старый)** | Интегрирован в core как `astro:assets` ещё в Astro 3. Отдельная интеграция больше не нужна. | Встроенные `<Image />` и `<Picture />` из `astro:assets` + `sharp`. |
| **Кириллица в `site`, `robots.txt`, sitemap** | Яндекс явно запрещает кириллицу в robots.txt и HTTP headers. Sitemap-стандарт требует encoded URL. | Punycode (`xn--j1aco8bgs.life`) везде, где машина. Кириллица — только в UI-тексте. |
| **Google Analytics 4 в v1** | В РФ-аудитории для B2B событий 70%+ трафика будет из Яндекса. GA4 = лишний cookie-баннер, лишний JS, никакой пользы. | Только Яндекс.Метрика. GA4 подключим в v2, если появится Google-трафик. |
| **Netlify Identity / Vercel Auth / любой SSR-auth** | В проекте нет логина, нет личного кабинета (OOS в PROJECT.md). Лишний рантайм. | Чистый static + сабмит формы через serverless-функцию. |
| **jQuery / any legacy JS** | Astro + Tailwind + минимальный vanilla JS решают всё. | Vanilla JS в `<script>` блоках Astro, или Astro Islands с мини-React/Vue только где критично. |
| **CMS в v1 (Sanity/Contentful/Strapi)** | Добавляет внешнюю зависимость, сложность, стоимость. Claude пишет MDX напрямую в репо — этого достаточно для 20 страниц. | Content Collections + MDX + git. |
| **i18n-интеграции** | Английская версия — OOS. Astro i18n усложняет sitemap и роутинг. | Чистый одноязычный сайт. |
| **Astro 5.x на старте нового проекта в 2026** | Astro 6 уже стабилен (стабильный релиз — февраль 2026). На старте брать 5.x = иметь миграцию через год. | Astro 6.x с Node 22. |
| **Node 18 / Node 20** | Astro 6 требует Node 22+. | Node 22 LTS. |

---

## Stack Patterns by Variant

**Если упрёмся в лимиты Netlify Free:**
- Мигрировать на Cloudflare Workers (`@astrojs/cloudflare` adapter).
- Форма и Telegram-интеграция переезжают в Cloudflare Workers function.
- Причина: Cloudflare даёт unlimited bandwidth бесплатно и разрешает коммерческое использование.

**Если появится бюджет на Vercel Pro ($20/мес):**
- Остаёмся на Astro, меняем adapter на `@astrojs/vercel`. Всё остальное — без изменений.
- Бенефит: чуть быстрее edge, лучше DX, Vercel Analytics.
- Целесообразно только если найдём конкретные проблемы с Netlify/Cloudflare — по умолчанию не берём.

**Если в v2 появится блог с > 50 постами:**
- Добавить search (Pagefind — бесплатный статический поиск, интегрируется в Astro через билд-хук).
- Для RSS: `@astrojs/rss`.
- Для блога остаёмся на MDX + Content Collections — не нужен CMS.

**Если в v2 появится английская версия:**
- Astro native i18n (config `i18n: { locales: ['ru', 'en'], defaultLocale: 'ru' }`).
- `@astrojs/sitemap` умеет i18n через `serialize` и `i18n` опцию.
- hreflang в `<head>`.

---

## Version Compatibility

| Package A | Compatible With | Notes |
|-----------|-----------------|-------|
| `astro@^6.0` | `node@>=22` | Astro 6 **не работает** на Node 18/20. |
| `astro@^6.0` | `vite@^7.0` | Vite 7 идёт в комплекте, руками не ставить. |
| `@tailwindcss/vite@^4.0` | `tailwindcss@^4.0` | Обе должны быть v4. Смесь v3 и v4 — ломается. |
| `@astrojs/mdx@latest` | `astro@^6.0` | `astro add mdx` поставит совместимую. |
| `@astrojs/sitemap@^3.7+` | `astro@^6.0` | `serialize` hook появился в 3.7. |
| `@astrojs/netlify@latest` | `astro@^6.0` | Работает и для static, и для server output. |
| `sharp@^0.33` | `node@>=18` | Нужен для `astro:assets`. На macOS ставится без проблем; на Windows — иногда требует prebuilt binaries. |
| `schema-dts@latest` | `typescript@^5` | Типы JSON-LD. |

---

## Confidence Levels по каждому ключевому решению

| Решение | Confidence | Обоснование |
|---------|------------|-------------|
| Astro 6 (не 5) | **HIGH** | Официальный блог Astro, InfoQ-анонс, Netlify changelog — подтверждают стабильный релиз Astro 6 в феврале-марте 2026. |
| Tailwind v4 через `@tailwindcss/vite` | **HIGH** | Официальная документация Tailwind + Astro 5.2+ release notes. `@astrojs/tailwind` явно deprecated для v4. |
| Content Layer + MDX | **HIGH** | Astro 5+ core feature, документация ясная. |
| **НЕ Vercel Hobby** | **HIGH** | Прямая цитата из Vercel Fair Use Guidelines: «Advertising the sale of a product or service» = коммерческое использование. |
| Netlify Free как основной хост | **HIGH** | Netlify Free явно разрешает commercial use; формы в 2026 free & unlimited. |
| Яндекс.Метрика обязательна, GA4 — нет | **HIGH** | Аудитория B2B-корпоратив РФ, Яндекс.Вебмастер — обязательный инструмент SEO. |
| Punycode в `site`, robots.txt, sitemap | **HIGH** | Официальная документация Яндекс.Вебмастер: «The use of the Cyrillic alphabet is not allowed in the robots.txt file and server HTTP headers. For domain names, use Punycode.» |
| Netlify Forms + Telegram через Netlify Function | **MEDIUM** | Архитектурно логично и есть гайды; но конкретная интеграция «notification webhook → Telegram sendMessage» собирается из двух источников. Требует подтверждения на этапе плана. |
| Отказ от CMS в v1 | **HIGH** | 20 страниц + Claude-автоматизация → CMS избыточен. |
| `build.format: 'directory'` | **MEDIUM** | Стандартный выбор для SEO-сайтов; sitemap.md проекта использует URL с trailing slash, что совпадает. |

---

## Sources

### Official documentation (HIGH-trust)
- [Astro 6.0 release blog](https://astro.build/blog/astro-6/) — Astro 6 features, Vite 7, Cloudflare-first
- [Astro Upgrade to v6 guide](https://docs.astro.build/en/guides/upgrade-to/v6/) — breaking changes, Node 22 requirement
- [Astro Content Collections docs](https://docs.astro.build/en/guides/content-collections/) — Content Layer API, Zod schemas
- [Astro Images docs](https://docs.astro.build/en/guides/images/) — `astro:assets`, sharp
- [Astro Cloudflare adapter docs](https://docs.astro.build/en/guides/integrations-guide/cloudflare/) — Workers-only starting Astro 6
- [Astro Netlify adapter docs](https://docs.astro.build/en/guides/integrations-guide/netlify/) — forms, functions
- [@astrojs/sitemap docs](https://docs.astro.build/en/guides/integrations-guide/sitemap/) — filter, serialize, i18n
- [Tailwind v4 Astro install guide](https://tailwindcss.com/docs/installation/framework-guides/astro) — `@tailwindcss/vite` plugin
- [Vercel Fair Use Guidelines](https://vercel.com/docs/limits/fair-use-guidelines) — commercial use prohibition (quoted above)
- [Vercel special characters in domain](https://vercel.com/guides/how-can-i-use-special-characters-in-my-custom-domain) — Punycode required
- [Yandex Webmaster — robots.txt rules](https://yandex.com/support/webmaster/en/controlling-robot/robots-txt.html) — Punycode required
- [Yandex Metrika GDPR compliance](https://yandex.com/support/metrica/en/general/gdpr.html) — cookie consent patterns
- [Telegram Bot API](https://core.telegram.org/bots/api) — sendMessage, webhooks

### Trusted guides (MEDIUM-trust, verified against official)
- [Astro 6 Beta announcement — InfoQ](https://www.infoq.com/news/2026/02/astro-v6-beta-cloudflare/)
- [Astro 6 just works on Netlify](https://www.netlify.com/changelog/2026-03-10-astro-6/) — confirms Netlify adapter readiness
- [Hosting Free Tier Comparison 2026 — agentdeals.dev](https://agentdeals.dev/hosting-free-tier-comparison-2026) — Vercel vs Netlify vs Cloudflare commercial-use analysis
- [Vercel Alternatives for Astro 2026 — ExpressTech](https://expresstech.io/5-vercel-alternatives-for-astro-sites-in-2026/)
- [Web3Forms Astro integration docs](https://docs.web3forms.com/how-to-guides/static-site-generators/astro)
- [Formspree Astro guide](https://formspree.io/guides/astro/)
- [astro-seo-schema on npm](https://www.npmjs.com/package/astro-seo-schema) — LocalBusiness JSON-LD
- [astro-robots-txt on npm](https://www.npmjs.com/package/astro-robots-txt) — Host directive support
- [Astro SEO complete guide — Joost.blog](https://joost.blog/astro-seo-complete-guide/) — robots.txt, canonical patterns
- [GTM + Cookie Consent Astro 2026](https://rafalszymanski.pl/en/blog/cookie-gtm-astro-guide/) — cookie consent patterns applicable to Yandex.Metrika

---

*Stack research for: SEO-оптимизированный маркетинговый сайт ивент-агентства на кириллическом домене*
*Researched: 2026-04-22*
*Next: этот файл читает роудмап при составлении фаз. Критическое решение — заменить Vercel на Netlify в Key Decisions проекта.*
