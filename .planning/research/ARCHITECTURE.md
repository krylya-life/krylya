# Architecture Research — Milestone v2.0 «Рост»

**Domain:** Content site with organic growth layer — blog/content hub, social funnel tracking, outreach pipeline
**Researched:** 2026-06-26
**Confidence:** HIGH (существующий стек задокументирован, новые блоки верифицированы против официальных Astro/Cloudflare/Яндекс.Метрика docs)

---

## Что добавляется к v1-архитектуре

Существующая архитектура (Astro 6 + Tailwind v4 + Content Collections, Cloudflare Pages, Cloudflare Pages Function `/api/contact` → Telegram-бот) остаётся нетронутой. v2.0 добавляет три новых блока:

1. **Контент-хаб `/идеи/`** — новая Content Collection + шаблоны страниц, RSS, JSON-LD Article
2. **Аналитика источников** — UTM-метки на всех внешних ссылках, дополнительная цель в Метрике, передача UTM через форму
3. **Аутрич-пайплайн** — процессный слой вне кода сайта (Google Таблицы)

---

## 1. Контент-хаб: подпапка `/идеи/` vs поддомен

### Решение: `/идеи/` как подпапка основного сайта

**Почему не поддомен `идеи.крылья.life`:**

- Поддомен = отдельный домен с точки зрения ссылочной массы. Авторитет, накопленный крылья.life (обратные ссылки от Я.Вебмастера, упоминания в директориях, гостевые упоминания из Плана B), на поддомен не переходит. Поддомен стартует с нуля.
- Яндекс и Google требуют отдельной верификации в поисковых системах для каждого поддомена.
- Cloudflare Pages Free поддерживает один кастомный домен; поддомен потребует отдельного Pages-проекта и дополнительной DNS-настройки.
- При кириллическом IDN-домене (крылья.life) поддомен `идеи.крылья.life` создаёт двойной IDN — технически работает, но добавляет слой Punycode-сложности.

**Почему не внешний SaaS (case.so, WIZR, Notion-как-блог и т.п.):**

- Внешний SaaS, даже подключённый через reverse proxy на `/идеи/`, означает, что HTML генерируется на серверах третьей стороны. SEO-сигналы (внутренние ссылки, скорость, Core Web Vitals) выходят из-под контроля.
- Reverse proxy для Cloudflare Pages Free недоступен без Workers (платно). Без прокси контент живёт на домене SaaS — SEO теряется.
- Зависимость от сторонней платформы при бюджете ≈ 0 ₽ и ресурсе только у Марии — риск без страховки.
- Нативный Astro Content Collection даёт идентичный результат: MDX-файл в репо, коммит, автодеплой за 60 секунд.

**Вывод: `/идеи/` как новая Content Collection в существующем репо. Нулевые дополнительные расходы, полный контроль SEO, строгое единообразие с дизайном.**

Альтернативное имя раздела — `/blog/` (уже указан в sitemap.md). Оба варианта одинаково работают. Предпочтительно `/идеи/` как кириллический путь — усиливает IDN-домен и даёт читаемый русский URL в сниппете Яндекса. Технически: кириллика в path нормально работает в Astro, в sitemap и canonical она percent-кодируется автоматически Node-билдером.

---

## 2. Структура новых файлов (добавления к v1)

```
src/
├── content/
│   ├── config.ts                      # ИЗМЕНИТЬ: добавить collection 'ideas'
│   ├── ideas/                         # НОВОЕ: статьи для органики
│   │   ├── 10-ploschadok-kaliningrad.mdx
│   │   ├── korporativ-vyezdnoj.mdx
│   │   └── ... (20-30 статей по плану)
│   ├── services/                      # без изменений
│   ├── cases/                         # без изменений
│   ├── testimonials/                  # без изменений
│   └── team/                          # без изменений
├── layouts/
│   ├── BaseLayout.astro               # без изменений
│   ├── ServiceLayout.astro            # без изменений
│   ├── CaseLayout.astro               # без изменений
│   └── IdeaLayout.astro              # НОВОЕ: шаблон страницы статьи
├── pages/
│   ├── index.astro                    # без изменений
│   ├── services/                      # без изменений
│   ├── cases/                         # без изменений
│   ├── идеи/                          # НОВОЕ: кириллический путь
│   │   ├── index.astro                # витрина /идеи/ — список статей
│   │   └── [slug].astro              # /идеи/<slug>/ — страница статьи
│   ├── rss.xml.ts                     # НОВОЕ: RSS-лента
│   └── api/contact.ts                 # без изменений (Cloudflare Pages Function)
├── components/
│   ├── seo/
│   │   ├── Seo.astro                  # без изменений
│   │   ├── JsonLdGraph.astro          # ИЗМЕНИТЬ: добавить ArticleSchema builder
│   │   └── ArticleSchema.ts           # НОВОЕ: builder для JSON-LD Article/BlogPosting
│   ├── blocks/
│   │   ├── IdeaCard.astro             # НОВОЕ: карточка статьи на витрине
│   │   ├── IdeasGrid.astro            # НОВОЕ: сетка карточек (витрина + боковые блоки)
│   │   ├── RelatedIdeas.astro         # НОВОЕ: похожие статьи в конце страницы
│   │   └── ...остальные без изменений
│   └── forms/
│       └── ContactForm.astro          # ИЗМЕНИТЬ: добавить hidden-поле utm_source/medium/campaign
public/
└── robots.txt                         # ИЗМЕНИТЬ: добавить /rss.xml в Allow, /идеи/ уже открыта
```

---

## 3. Схема Content Collection для статей

```typescript
// src/content/config.ts — добавить к существующим коллекциям

const ideas = defineCollection({
  loader: glob({ pattern: '**/*.mdx', base: './src/content/ideas' }),
  schema: ({ image }) => z.object({
    title: z.string(),
    seoTitle: z.string().max(60),
    description: z.string().max(160),
    slug: z.string().regex(/^[a-z0-9-]+$/),   // Latin slug, кириллика в path страницы
    publishDate: z.date(),
    updatedDate: z.date().optional(),
    category: z.enum([
      'korporativy',       // корпоративы
      'tendencii',         // тренды и тенденции
      'ploshadki',         // площадки Калининграда
      'planirovanie',      // как организовать
      'formaty',           // форматы мероприятий
    ]),
    tags: z.array(z.string()).optional(),
    coverImage: image(),
    coverImageAlt: z.string(),
    relatedServices: z.array(reference('services')).optional(),
    relatedCases: z.array(reference('cases')).optional(),
    draft: z.boolean().default(false),
    noindex: z.boolean().default(false),
  }),
});

export const collections = { services, cases, testimonials, team, ideas };
```

**Почему Latin slug при кириллическом path:**
Путь страницы — `/идеи/korporativ-na-more/` (кириллика в папке `идеи`, Latin в slug). Это даёт читаемый раздел в URL и при этом избегает двойной кириллики в slug, которая создаёт проблемы при копировании ссылок в мессенджерах (двойное percent-кодирование).

---

## 4. Шаблон страницы статьи и витрина

### IdeaLayout.astro — новый layout, не модифицирует существующие

```astro
---
// src/layouts/IdeaLayout.astro
import BaseLayout from '~/layouts/BaseLayout.astro';
import ArticleSchema from '~/components/seo/ArticleSchema.ts';
import RelatedIdeas from '~/components/blocks/RelatedIdeas.astro';
import CTASection from '~/components/blocks/CTASection.astro';  // существующий

interface Props {
  idea: CollectionEntry<'ideas'>;
  related: CollectionEntry<'ideas'>[];
}
const { idea, related } = Astro.props;
const jsonLd = [ArticleSchema(idea)];
const breadcrumbs = [
  { name: 'Главная', url: 'https://крылья.life/' },
  { name: 'Идеи', url: 'https://крылья.life/идеи/' },
  { name: idea.data.title, url: `https://крылья.life/идеи/${idea.data.slug}/` },
];
---
<BaseLayout seo={{ title: idea.data.seoTitle, ... }} jsonLd={jsonLd} breadcrumbs={breadcrumbs}>
  <article>
    <header>...</header>
    <slot />  {/* MDX body */}
    <RelatedIdeas items={related} />
    <CTASection />  {/* существующий компонент */}
  </article>
</BaseLayout>
```

### JSON-LD для статей

```typescript
// src/components/seo/ArticleSchema.ts — НОВЫЙ файл
export function ArticleSchema(idea: CollectionEntry<'ideas'>) {
  return {
    "@type": "BlogPosting",
    "@id": `https://крылья.life/идеи/${idea.data.slug}/#article`,
    "headline": idea.data.title,
    "description": idea.data.description,
    "datePublished": idea.data.publishDate.toISOString(),
    "dateModified": (idea.data.updatedDate ?? idea.data.publishDate).toISOString(),
    "author": {
      "@type": "Person",
      "name": "Мария Вострикова",
      "url": "https://крылья.life/about/"
    },
    "publisher": {
      "@id": "https://крылья.life/#business"
    },
    "image": idea.data.coverImage.src,
    "mainEntityOfPage": {
      "@type": "WebPage",
      "@id": `https://крылья.life/идеи/${idea.data.slug}/`
    },
  };
}
```

**Примечание по Яндексу:** JSON-LD Article не используется Яндексом в сниппетах (Яндекс предпочитает микроразметку). Поэтому на страницах статей дополнительно добавляем `itemscope itemtype="https://schema.org/Article"` в `<article>` тег с `itemprop` для заголовка, даты, автора — по аналогии с существующей микроразметкой Organization в футере.

### RSS-лента

```typescript
// src/pages/rss.xml.ts — НОВЫЙ файл (static route, prerender=true)
import rss from '@astrojs/rss';
import { getCollection } from 'astro:content';

export async function GET(context) {
  const ideas = await getCollection('ideas', ({ data }) => !data.draft && !data.noindex);
  return rss({
    title: 'Идеи для мероприятий — Крылья',
    description: 'Советы по организации корпоративов и ивентов от агентства «Крылья» в Калининграде',
    site: context.site,
    items: ideas.map((post) => ({
      title: post.data.title,
      pubDate: post.data.publishDate,
      description: post.data.description,
      link: `/идеи/${post.data.slug}/`,
    })),
  });
}
```

RSS работает как статический файл на Cloudflare Pages без изменений конфигурации — `@astrojs/rss` выдаёт XML на этапе билда.

### Sitemap — без дополнительной конфигурации

`@astrojs/sitemap` автоматически подхватывает все страницы, включая `/идеи/<slug>/`. Текущий `astro.config.mjs` с `site: 'https://крылья.life'` уже настроен правильно.

---

## 5. Перелинковка: как статьи связываются с услугами и кейсами

Два уровня перелинковки:

**Уровень 1 — автоматический через schema (build-time):**
В frontmatter статьи поля `relatedServices` и `relatedCases` ссылаются на записи коллекций через `reference()`. `IdeaLayout` автоматически рендерит блок «Наши услуги по теме» (существующий `ServiceCard` компонент) и «Примеры из практики» (существующий `CaseCard`).

**Уровень 2 — ручной через MDX-контент:**
Автор (Мария через Claude) вставляет в текст статьи контекстные ссылки: `[корпоратив под ключ](/services/corporate-parties/)`. Это основной способ передачи link equity от информационных страниц к коммерческим.

**Витрина `/идеи/`:**
Добавляет ссылку `→ Посмотреть все кейсы` и `→ Наши услуги` в сайдбар или конец страницы-витрины. Соединяет информационный трафик с коммерческими разделами.

---

## 6. Воронка «соцсети → сайт → заявка»: UTM-архитектура

### Схема потока данных

```
Instagram bio / Telegram пост
    │
    ▼ (ссылка с UTM)
крылья.life/услуги/?utm_source=instagram&utm_medium=social&utm_campaign=bio
    │
    ▼ (Яндекс.Метрика фиксирует сессию с UTM при первом pageview)
Пользователь читает страницу услуги / статью
    │
    ▼ (заполняет форму)
ContactForm — hidden-поля utm_source, utm_medium, utm_campaign
(значения вставляются JS из sessionStorage)
    │
    ▼ (POST /api/contact)
Cloudflare Pages Function — читает UTM из FormData
    │
    ▼
Telegram-бот @krylya_zayavki_bot — сообщение содержит строку:
"Источник: instagram / social / bio"
```

### Что добавить в ContactForm.astro

```astro
<!-- hidden-поля для отслеживания источника — добавить в существующую форму -->
<input type="hidden" name="utm_source" id="utm_source" />
<input type="hidden" name="utm_medium" id="utm_medium" />
<input type="hidden" name="utm_campaign" id="utm_campaign" />

<script>
  // При загрузке страницы читаем UTM из URL и сохраняем в sessionStorage
  // При повторных pageview — берём из sessionStorage (Метрика делает то же самое)
  const params = new URLSearchParams(window.location.search);
  ['utm_source', 'utm_medium', 'utm_campaign'].forEach(key => {
    const val = params.get(key) || sessionStorage.getItem(key) || '';
    if (params.get(key)) sessionStorage.setItem(key, params.get(key));
    const el = document.getElementById(key);
    if (el) el.value = val;
  });
</script>
```

### Добавить в Cloudflare Pages Function `/api/contact`

```typescript
// В существующий functions/api/contact.ts — добавить к сборке сообщения:
const utmSource = truncate(String(data.get('utm_source') ?? ''));
const utmMedium = truncate(String(data.get('utm_medium') ?? ''));
const utmCampaign = truncate(String(data.get('utm_campaign') ?? ''));
const sourceStr = [utmSource, utmMedium, utmCampaign].filter(Boolean).join(' / ');

// В текст Telegram-сообщения добавить строку:
`📍 Источник: ${sourceStr || 'прямой переход'}`,
```

### Стандарт UTM-меток для «Крыльев»

| Канал | utm_source | utm_medium | utm_campaign |
|-------|------------|------------|--------------|
| Instagram bio | `instagram` | `social` | `bio` |
| Instagram пост | `instagram` | `social` | `post_YYYY-MM` |
| Instagram reels | `instagram` | `social` | `reels_YYYY-MM` |
| Telegram канал | `telegram` | `social` | `post_YYYY-MM` |
| Telegram ссылка в статье | `telegram` | `referral` | `article_slug` |
| Партнёрское письмо | `outreach` | `email` | `имя_компании` |

**Правило именования:** только lowercase, без пробелов (Яндекс.Метрика регистрочувствительна), слова через дефис.

### Цель в Яндекс.Метрике

Существующая цель `form_submitted` (JavaScript-событие при успешной отправке) уже отслеживает конверсии. Дополнительно:

- В отчёте «Источники → UTM-метки» можно сразу фильтровать по цели `form_submitted` — это даёт attribution по каналу без дополнительной настройки.
- Опционально: создать составную цель «Посетил /идеи/ → отправил форму» для измерения конверсии контент-трафика.

---

## 7. Аутрич-пайплайн без CRM

### Архитектура: Google Таблица + файлы в репо

Пайплайн аутрича — не часть кода сайта. Это операционный процесс, который питается из исследовательских фаз (B, C, D, E) и выдаёт касания с партнёрами.

**Структура Google Таблицы «Аутрич Крылья 2026»:**

| Колонка | Что хранит |
|---------|------------|
| Компания | Название |
| Тип | федеральное агентство / застройщик / локальный |
| Приоритет | A (топ) / B (средний) / C (отложить) |
| Контакт | Имя, должность |
| Канал | email / Telegram / LinkedIn |
| Дата 1-го касания | |
| Статус | новый / отправлен / ответил / переговоры / отказ / пауза |
| Дата следующего касания | |
| Оффер | какой шаблон отправлен |
| Комментарий | |
| UTM для письма | `outreach / email / имя_компании` (для ссылок в письме) |

**Файлы в репо (`.planning/outreach/`):**
- `company-list.md` — список компаний со скорингом (выход Фазы H)
- `templates/` — шаблоны оутрич-писем под каждый сегмент
- `offers/` — мини-офферы (1 страница PDF или Markdown) под застройщиков / федеральные агентства

**Почему не CRM:** при объёме 50-100 контактов Google Таблица покрывает все потребности. CRM нужна при объёме 500+, автоматических цепочках, нескольких менеджерах. Бюджет и ресурс «Крыльев» на этом горизонте — одна Мария.

---

## 8. Поток данных между исследовательскими и продуктовыми фазами

```
Фаза A (SEO-аудит)
    │ → базлайн: позиции, проиндексированные страницы, дыры в семантике
    │ → список технических проблем для исправления
    ▼
Фаза B (конкуренты мира) + Фаза C (конкуренты РФ/Калининград)
    │ → матрица позиционирования: где «Крылья» сильнее / слабее
    │ → лучшие SEO-практики конкурентов (какие кластеры они берут, каких не берут)
    │ → форматы контента, которые работают у сильных игроков
    ▼
Фаза D (тренды)
    │ → топ-форматы мероприятий 2026 + визуальный язык
    │ → SMM-форматы с охватами (что снимать для reels, что писать)
    ▼
Фаза E (форматы мероприятий) — питается из B+C+D
    │ → 10+ упакованных форматов с описаниями под сегменты
    │ → каждый формат = потенциальная страница услуги или статья в /идеи/
    ▼
Фаза F (семантика + контент-хаб) — питается из A+B+C+E
    │ → расширенное семантическое ядро: коммерческие + информационные кластеры
    │ → 20-30 тем для статей в /идеи/ под информационные запросы
    │ → план публикаций с приоритетами
    ▼
Фаза G (SMM) — питается из D+E+F
    │ → единый контент-стрим: блог-пост → тезис в Telegram → visual для Instagram
    │ → контент-календарь с привязкой к UTM-кампаниям
    ▼
Фаза H (аутрич) — питается из B+C+E
    │ → целевой список компаний (федеральные агентства + застройщики)
    │ → офферы под каждый сегмент с конкретными форматами из Фазы E
    │ → шаблоны писем с UTM-ссылками на сайт
```

**Ключевое правило потока:** каждая исследовательская фаза должна заканчиваться не только выводами, но и конкретными артефактами — файлами, которые следующие фазы читают как вход. Фаза B производит `competitor-world.md` → Фаза E читает его при разработке форматов. Это предотвращает «потерю знаний» между фазами.

---

## 9. Порядок сборки фаз: зависимости и параллелизм

### Граф зависимостей

```
A (SEO-аудит) ─────────────────────────────────────────────────┐
                                                                  │
B (конкуренты мира) ─────┐                                       │
                          ├──▶ E (форматы) ──▶ F (семантика+хаб) ├──▶ G (SMM)
C (конкуренты РФ/Калинград)                                      │       │
                          └──▶ H (аутрич) ◀───────────────────────┘       │
D (тренды) ──────────────┘                                                │
                                                                           ▼
                                                               крылья.life/идеи/ запущен
                                                               + аутрич в рынок
```

### Обоснованный порядок выполнения

**Шаг 1 — Параллельно (недели 1-2): A + B + C + D**

Все четыре фазы — исследовательские, независимые друг от друга. Их можно вести параллельно.

- **A (SEO-аудит):** технический, требует данных из Яндекс.Вебмастера и GSC. Результат нужен до Фазы F (семантика 2.0).
- **B (конкуренты мира):** деск-ресёрч, независим.
- **C (конкуренты РФ/Калининград):** деск-ресёрч, независим. Питает H (аутрич) напрямую.
- **D (тренды):** деск-ресёрч, независим.

**Шаг 2 — Последовательно (недели 3-4): E (форматы)**

Зависит от B, C, D. Питает F и H.

- На входе: матрица конкурентов из B+C, топ-тренды из D.
- На выходе: 10+ упакованных форматов с описаниями по сегментам.

**Шаг 3 — Параллельно (недели 5-7): F + H**

После E оба становятся разблокированными.

- **F (семантика + контент-хаб):** на входе A (дыры семантики) + E (форматы = темы для статей) + B+C (кластеры конкурентов). На выходе — техническая задача для сайта (новая коллекция + шаблоны) + контент-план.
- **H (аутрич):** на входе C (список конкурентов/партнёров) + E (форматы = офферы). Независим от F.

**Шаг 4 — После F: реализация блога на сайте**

F производит контент-план. Только после финального плана имеет смысл начать писать статьи и реализовывать коллекцию `ideas` в коде.

**Шаг 5 — После F и D: G (SMM)**

SMM-стратегия зависит от:
- Контент-плана из F (статьи блога = основа для постов)
- Трендов из D (какие форматы снимать)
- Форматов из E (о чём рассказывать)

### Итоговая таблица порядка

| Фаза | Название | Начать после | Блокирует | Параллельна с |
|------|----------|-------------|-----------|---------------|
| A | SEO-аудит | — (старт) | F (частично) | B, C, D |
| B | Конкуренты мира | — (старт) | E, H (частично) | A, C, D |
| C | Конкуренты РФ/Калининград | — (старт) | E, H | A, B, D |
| D | Тренды | — (старт) | E, G | A, B, C |
| E | Форматы мероприятий | B, C, D | F, H | — |
| F | Семантика + контент-хаб | A, B, C, E | G, реализация сайта | H |
| H | Аутрич (партнёры) | C, E | — | F, G |
| G | SMM-стратегия | D, E, F | — | H |
| Реализация `/идеи/` на сайте | F | — | — | H, G |

---

## 10. Новые vs модифицируемые компоненты — сводка

### Новое (добавляется, не трогает существующее)

| Артефакт | Тип | Где |
|----------|-----|-----|
| `src/content/ideas/` | директория с MDX | Content Collection |
| `ideas` schema в `config.ts` | Zod-схема | добавить к существующим |
| `src/layouts/IdeaLayout.astro` | layout | рядом с существующими |
| `src/pages/идеи/index.astro` | витрина /идеи/ | новый route |
| `src/pages/идеи/[slug].astro` | страница статьи | новый dynamic route |
| `src/pages/rss.xml.ts` | RSS-лента | новый static route |
| `src/components/blocks/IdeaCard.astro` | карточка статьи | рядом с CaseCard |
| `src/components/blocks/IdeasGrid.astro` | сетка статей | рядом с CasesPreviewGrid |
| `src/components/blocks/RelatedIdeas.astro` | похожие статьи | новый блок |
| `src/components/seo/ArticleSchema.ts` | JSON-LD builder | рядом с существующими |
| `.planning/outreach/` | директория | планировочный артефакт |

### Модифицируется (минимальные изменения)

| Артефакт | Что меняется | Риск |
|----------|-------------|------|
| `src/content/config.ts` | добавить коллекцию `ideas` | низкий — добавление не ломает существующие |
| `src/components/forms/ContactForm.astro` | 3 hidden-поля + 10 строк JS | низкий |
| `functions/api/contact.ts` | читать UTM из FormData, добавить в Telegram-сообщение | низкий — additive |
| `src/components/layout/Header.astro` | добавить пункт «Идеи» в навигацию | минимальный |
| `public/robots.txt` | добавить Allow: /rss.xml | минимальный |

### Не трогается

- Все существующие страницы (`/`, `/services/`, `/cases/`, `/contacts/`, `/about/`)
- BaseLayout, ServiceLayout, CaseLayout
- Дизайн-система (токены, типографика, компоненты UI)
- Cloudflare Pages Function `/api/contact` — только аддитивное расширение
- Настройки Cloudflare Pages, GitHub Actions (если есть), DNS

---

## 11. Точки интеграции с Cloudflare Pages

| Что добавляется | Как работает на Cloudflare Pages |
|----------------|----------------------------------|
| `/идеи/[slug]/` — статические страницы | Генерируются при билде как HTML-файлы. Никаких изменений в CF настройках. |
| `/rss.xml` — RSS | Генерируется при билде. Статический файл. Cloudflare отдаёт его напрямую. |
| UTM в hidden-полях формы | Клиентский JS. Cloudflare Pages не участвует. |
| UTM в Telegram-сообщении | `functions/api/contact.ts` — уже работающая CF Pages Function. Только additive изменение. |
| `@astrojs/rss` зависимость | `npm install @astrojs/rss` — добавляется в `package.json`. Никаких изменений в CF конфиге. |

---

## 12. Анти-паттерны для v2.0

### AP1: Внешний SaaS для блога через iframe или embed

**Что делают:** Встраивают Notion, Tilda или case.so как iframe/embed в страницу `/идеи/`.
**Почему плохо:** Контент в iframe невидим для поисковых ботов. SEO-ценность нулевая.
**Вместо:** Native Astro MDX Collection.

### AP2: Поддомен `идеи.крылья.life`

**Что делают:** Запускают блог на поддомене, считая что «так проще».
**Почему плохо:** Ссылочная масса разделяется. Поддомен стартует с нуля в SEO. Отдельная верификация в Яндекс.Вебмастере. При кириллическом домене — двойной IDN.
**Вместо:** Подпапка `/идеи/` в том же репо и домене.

### AP3: UTM только на сайте, без передачи в форму

**Что делают:** Смотрят UTM в Метрике, но заявки в Telegram приходят без источника.
**Почему плохо:** Невозможно понять, какой канал принёс сделку, а не просто визит. Атрибуция обрывается на шаге «посетитель → заявка».
**Вместо:** Передавать UTM через hidden-поля формы в Telegram-сообщение.

### AP4: Начать писать статьи до семантики

**Что делают:** Начинают публиковать посты в `/идеи/` «чтобы не терять время», пока идёт исследование.
**Почему плохо:** Темы выбираются наугад, не под поисковый спрос. Статьи без семантической основы не приносят органический трафик.
**Вместо:** Сначала Фаза F (семантика), потом реализация коллекции и написание статей.

### AP5: Аутрич без единого шаблона UTM

**Что делают:** Отправляют аутрич-письма со ссылками на сайт без UTM или с разными конвенциями.
**Почему плохо:** Невозможно понять, какой аутрич привёл трафик. В Метрике отображается как «прямой переход» или смешивается с другими источниками.
**Вместо:** Стандарт UTM из раздела 6 + UTM-колонка в Google Таблице аутрича.

---

## 13. Scaling Considerations для v2.0

| Масштаб | Что важно |
|---------|-----------|
| 0-30 статей | Текущая архитектура. Build time < 60 сек. Cloudflare Pages Free. |
| 30-100 статей | Та же архитектура. Build time растёт до 2-3 мин. Приемлемо. Добавить тегирование и фильтр по категории на витрине. |
| 100+ статей | При >200 MDX-файлах Astro build может замедляться. Рассмотреть Incremental Static Regeneration через Cloudflare Workers (платно) или разбивку ядра. На горизонте 2026 неактуально. |
| Аутрич 50-100 контактов | Google Таблица. |
| Аутрич 200+ контактов | Рассмотреть Notion Database или бесплатный Pipedrive — переход незатратный, т.к. данные в Таблице структурированы. |

**Первое узкое место v2.0 — не техника, а контент.** При одном авторе (Мария) и помощи Claude: 1-2 статьи в неделю реалистичны. 20 статей = 2-3 месяца. Это должно быть в роадмапе как ограничение, не как риск.

---

## Sources

- [Subdomain vs Subdirectory for Blog: SEO Impact (2026)](https://designspartans.com/subdomains-subfolders-seo/) — MEDIUM confidence
- [Backlinko: Subdirectory vs Subdomain — 11.8M results analysis](https://backlinko.com/subdirectory-vs-subdomain) — HIGH confidence
- [Astro Docs: Add an RSS Feed](https://docs.astro.build/en/recipes/rss/) — HIGH confidence, official
- [Astro Docs: Content Collections Guide](https://docs.astro.build/en/guides/content-collections/) — HIGH confidence, official
- [Yandex Metrica: How tags work — official docs](https://yandex.com/support/metrica/en/general/source-tags.html) — HIGH confidence, official
- [Yandex Metrica: UTM tags report](https://yandex.com/support/metrica/en/reports/tags-utm) — HIGH confidence, official
- [Telegram UTM Tracking in 2026: Telega Blog](https://telega.to/blog/telegram-utm-tracking-2026-track-conversions-sales) — MEDIUM confidence
- [Astro SEO Checklist 2026 — Neciu Dan](https://neciudan.dev/astro-seo-checklist-2026) — MEDIUM confidence
- [JSON-LD Article Rich Results — logarithmicspirals.com](https://logarithmicspirals.com/blog/adding-rich-results-with-json-ld-google/) — MEDIUM confidence
- v1-архитектура: `.planning/research/v1-sajt-archive/ARCHITECTURE.md` — HIGH confidence, верифицирован в production

---
*Architecture research for: крылья.life — v2.0 «Рост: рынок, контент и партнёрства»*
*Researched: 2026-06-26*
