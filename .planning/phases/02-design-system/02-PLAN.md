---
phase: 2
phase_name: Дизайн-система и контент-модели
wave: 1
depends_on: [1]
files_modified:
  - package.json
  - astro.config.mjs
  - src/styles/global.css
  - src/components/Container.astro
  - src/components/Section.astro
  - src/components/Button.astro
  - src/components/Heading.astro
  - src/components/Logo.astro
  - src/components/Header.astro
  - src/components/Footer.astro
  - src/layouts/BaseLayout.astro
  - src/content/config.ts
  - src/content/services/*.mdx
  - src/content/cases/*.mdx
  - src/content/testimonials/*.md
  - src/content/team/*.md
  - src/pages/test-design.astro
  - public/fonts/jost-*.woff2
  - public/brand/*.png
requirements: [DS-01, DS-02, DS-03, DS-04, DS-05, CONT-01, CONT-02, CONT-03, CONT-04, CONT-05]
autonomous: true
status: ready
---

# Phase 2 — Plan: Дизайн-система и контент-модели

> Эту фазу почти всю делает Claude. Маше нужно: (1) ответить на пару вопросов по дизайну (см. секцию ниже), (2) после деплоя — посмотреть тестовую страницу и сказать, нравится ли визуал.

## Цель фазы

После этой фазы у нас будет «конструктор» — типографика, цвета, кнопки, заголовки, BaseLayout, SVG/PNG-логотип и схемы для всех типов контента (услуги, кейсы, отзывы, команда). На этом конструкторе в Phase 3 быстро соберётся главная.

## Must-haves

1. Тестовая страница `/test-design/` на preview-URL рендерит:
   - 4 заголовка h1-h4 в Jost разных весов
   - Палитру 5 цветов (white/black/gray-dark/gray-light/yellow)
   - Две кнопки (primary + secondary)
   - Container + Section в действии
   - Список из 1 services + 1 cases + 1 testimonials + 3 team — все из Content Collections
2. `BaseLayout` оборачивает любую страницу: шапка с лого + меню, подвал с Org+LocalBusiness микроразметкой, слот для SEO в `<head>`, слот для Метрики в `<body>`
3. Логотип отображается без внешних шрифтов (PNG в Phase 2, SVG если Маша пришлёт)
4. `npm run build` проходит без ошибок, типы Zod проверяются

## Open question Маше — нужен один ответ

**Есть ли у тебя SVG-файл логотипа** от дизайнера (или в облаке/Figma)? Любая из версий: full / horizontal / sign.

- **Если есть** → пришли (или скажи где). Положу как настоящий SVG-компонент, всё чисто.
- **Если нет** → используем PNG горизонтальной версии из `~/Documents/Крылья. Общее./Айдентика/logo/horizontal/`. Это норм на ближайшее время. SVG-конверсию (онлайн-инструментом или ручной трассировкой) сделаем в Phase 3 — не блокер.

Можно ответить **«нет, бери PNG»** — и сразу двигаюсь.

---

## Wave 1 — Tailwind v4 + Jost + цветовая палитра (🤖)

### Task 2.1 — Установить Tailwind v4 и подключить через Vite

<read_first>
- `package.json` (текущий)
- `astro.config.mjs`
- `.planning/research/STACK.md` § Tailwind v4
</read_first>

<action>
1. `npm install tailwindcss@^4 @tailwindcss/vite` — две зависимости
2. В `astro.config.mjs` добавить `vite.plugins`:
   ```js
   import { defineConfig } from 'astro/config';
   import tailwindcss from '@tailwindcss/vite';
   export default defineConfig({
     vite: { plugins: [tailwindcss()] },
   });
   ```
3. Создать `src/styles/global.css` с `@import "tailwindcss";` и `@theme {}` блоком (см. Task 2.2)
4. В `src/pages/index.astro` (placeholder из Phase 1) добавить `<link>` или `<style>` import `global.css`
</action>

<acceptance_criteria>
- `package.json` содержит `tailwindcss` и `@tailwindcss/vite`
- `astro.config.mjs` импортирует `@tailwindcss/vite` и регистрирует плагин в `vite.plugins`
- Файл `src/styles/global.css` существует, содержит `@import "tailwindcss";`
- `npm run build` проходит без ошибок
</acceptance_criteria>

### Task 2.2 — Брендовые токены в `@theme`

<read_first>
- `.business/assets/brand-guidelines.md` — точная палитра
- `.planning/research/STACK.md` § Tailwind v4 @theme
</read_first>

<action>
В `src/styles/global.css` добавить:

```css
@import "tailwindcss";

@theme {
  --color-yellow: #FFF200;
  --color-black: #000000;
  --color-gray-dark: #414042;
  --color-gray-light: #BCBEC0;
  --color-white: #FFFFFF;

  --font-sans: "Jost", system-ui, -apple-system, sans-serif;

  /* Контейнер сайта */
  --container-max: 1200px;
}
```

Проверить, что классы `bg-yellow`, `text-gray-dark` и т.п. работают в `.astro`-шаблонах.
</action>

<acceptance_criteria>
- `src/styles/global.css` содержит блок `@theme` с 5 цветами и `--font-sans`
- В тестовой странице (Task 2.13) элементы `<div class="bg-yellow">` рендерятся с цветом `#FFF200`
</acceptance_criteria>

### Task 2.3 — Скачать Jost .woff2 и подключить через @font-face

<read_first>
- `.planning/PROJECT.md` § Шрифты (Jost OFL)
</read_first>

<action>
1. Скачать 4 веса Jost (400, 500, 600, 700) в .woff2 формате с `fonts.bunny.net` (зеркало Google Fonts без отслеживания):
   ```
   https://fonts.bunny.net/jost/files/jost-cyrillic-wght-normal.woff2 (variable font, все веса в одном)
   ```
   ИЛИ — статические файлы по весам, чтобы экономить трафик в Phase 3 (LCP-цель ≤ 2.5s).

   **Решение:** берём variable font (один файл ~80КБ покрывает все веса). Path: `public/fonts/jost-cyrillic.woff2`.

2. В `src/styles/global.css` после `@import` добавить:
   ```css
   @font-face {
     font-family: "Jost";
     src: url("/fonts/jost-cyrillic.woff2") format("woff2-variations");
     font-weight: 100 900;
     font-style: normal;
     font-display: swap;
     unicode-range: U+0000-007F, U+0400-04FF; /* latin + cyrillic */
   }
   ```

3. На `<body>` в BaseLayout (Task 2.10) добавить `class="font-sans"` (Tailwind подхватит `--font-sans`).
</action>

<acceptance_criteria>
- Файл `public/fonts/jost-cyrillic.woff2` существует, размер 50–150 КБ
- `src/styles/global.css` содержит `@font-face` для Jost
- На тестовой странице текст рендерится в Jost (визуально проверить кириллицу — не Times и не Arial)
- В Network-вкладке браузера загружается ровно один .woff2 файл
</acceptance_criteria>

---

## Wave 2 — UI-примитивы и логотип (🤖)

### Task 2.4 — Container

<action>
Создать `src/components/Container.astro`:

```astro
---
interface Props {
  class?: string;
}
const { class: className = "" } = Astro.props;
---

<div class={`mx-auto w-full max-w-[var(--container-max)] px-4 sm:px-6 lg:px-8 ${className}`}>
  <slot />
</div>
```
</action>

<acceptance_criteria>
- Файл `src/components/Container.astro` существует
- Принимает опциональный `class` prop
- На широком экране контент центрируется и не превышает 1200px
</acceptance_criteria>

### Task 2.5 — Section

<action>
Создать `src/components/Section.astro`:

```astro
---
interface Props {
  class?: string;
  id?: string;
}
const { class: className = "", id } = Astro.props;
---

<section id={id} class={`py-16 md:py-24 ${className}`}>
  <slot />
</section>
```
</action>

<acceptance_criteria>
- Файл `src/components/Section.astro` существует
- Рендерит `<section>` с вертикальными паддингами
- Принимает опциональные `class` и `id`
</acceptance_criteria>

### Task 2.6 — Heading

<action>
Создать `src/components/Heading.astro`:

```astro
---
interface Props {
  level: 1 | 2 | 3 | 4;
  class?: string;
}
const { level, class: className = "" } = Astro.props;
const Tag = `h${level}` as "h1" | "h2" | "h3" | "h4";

const classes = {
  1: "text-4xl md:text-5xl font-bold tracking-tight text-black",
  2: "text-3xl md:text-4xl font-semibold tracking-tight text-black",
  3: "text-2xl md:text-3xl font-semibold text-black",
  4: "text-xl md:text-2xl font-medium text-gray-dark",
}[level];
---

<Tag class={`${classes} ${className}`}>
  <slot />
</Tag>
```
</action>

<acceptance_criteria>
- Файл `src/components/Heading.astro` существует
- Принимает `level` (1-4) и опциональный `class`
- Рендерит соответствующий `<h1>...<h4>` с правильным размером шрифта
</acceptance_criteria>

### Task 2.7 — Button

<action>
Создать `src/components/Button.astro`:

```astro
---
interface Props {
  href?: string;
  variant?: "primary" | "secondary";
  type?: "button" | "submit";
  class?: string;
}
const {
  href,
  variant = "primary",
  type = "button",
  class: className = "",
} = Astro.props;

const base = "inline-flex items-center justify-center px-6 py-3 rounded-md font-medium transition-colors focus-visible:outline-2 focus-visible:outline-yellow focus-visible:outline-offset-2";
const variants = {
  primary: "bg-black text-white hover:bg-yellow hover:text-black",
  secondary: "bg-transparent border border-black text-black hover:bg-black hover:text-white",
};
const classes = `${base} ${variants[variant]} ${className}`;
---

{href ? (
  <a href={href} class={classes}><slot /></a>
) : (
  <button type={type} class={classes}><slot /></button>
)}
```
</action>

<acceptance_criteria>
- Файл `src/components/Button.astro` существует
- Без `href` рендерит `<button>`, с `href` — `<a>`
- variant=primary — чёрный фон, белый текст, на hover — жёлтый фон + чёрный текст
- variant=secondary — прозрачный фон, чёрная обводка
</acceptance_criteria>

### Task 2.8 — Логотип

> Зависит от ответа Маши: SVG или PNG.

<action>
**Если Маша пришлёт SVG:**
1. Положить файл в `public/brand/wings-logo-horizontal.svg`
2. Создать `src/components/Logo.astro` — импортировать SVG напрямую (Astro поддерживает inline SVG через import)

**Если Маши SVG нет — используем PNG (текущий план):**
1. Скопировать `~/Documents/Крылья. Общее./Айдентика/logo/horizontal/WINGS_logo_hor_black_RGB.png` → `public/brand/wings-logo-horizontal.png`
2. Скопировать `WINGS_sign_black_RGB.png` → `public/brand/wings-sign.png`
3. Создать `src/components/Logo.astro`:

```astro
---
interface Props {
  variant?: "horizontal" | "sign";
  class?: string;
}
const { variant = "horizontal", class: className = "" } = Astro.props;
const sources = {
  horizontal: { src: "/brand/wings-logo-horizontal.png", w: 180, h: 48 },
  sign: { src: "/brand/wings-sign.png", w: 48, h: 48 },
};
const { src, w, h } = sources[variant];
---

<a href="/" class={`inline-block ${className}`} aria-label="На главную — Крылья">
  <img src={src} alt="Крылья — ивент-агентство в Калининграде" width={w} height={h} class="h-12 w-auto" />
</a>
```
</action>

<acceptance_criteria>
- Файл `src/components/Logo.astro` существует
- Принимает `variant=horizontal | sign`
- Логотип отображается без зависимостей от внешних шрифтов
- Файлы лого лежат в `public/brand/`
</acceptance_criteria>

### Task 2.9 — Header

<action>
Создать `src/components/Header.astro`:

```astro
---
import Container from "./Container.astro";
import Logo from "./Logo.astro";

const navItems = [
  { href: "/services/", label: "Услуги" },
  { href: "/cases/", label: "Кейсы" },
  { href: "/about/", label: "О нас" },
  { href: "/contacts/", label: "Контакты" },
];
---

<header class="border-b border-gray-light bg-white">
  <Container class="flex items-center justify-between py-5">
    <Logo variant="horizontal" />
    <nav class="hidden md:flex gap-8">
      {navItems.map((item) => (
        <a
          href={item.href}
          class="text-base font-medium text-gray-dark hover:text-black transition-colors"
        >
          {item.label}
        </a>
      ))}
    </nav>
    <button class="md:hidden p-2" aria-label="Открыть меню">
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
        <line x1="3" y1="6" x2="21" y2="6" />
        <line x1="3" y1="12" x2="21" y2="12" />
        <line x1="3" y1="18" x2="21" y2="18" />
      </svg>
    </button>
  </Container>
</header>
```

Мобильное меню (выпадающее) реализуем минимально — через `<details>` или вообще пропустим в Phase 2, сделаем в Phase 3. На Phase 2 — гамбургер только декоративный.
</action>

<acceptance_criteria>
- Файл `src/components/Header.astro` существует
- На десктопе видны: лого слева, 4 пункта меню справа
- На мобильном (≤768px) меню скрыто, виден только лого + гамбургер
- Активные ссылки имеют hover-эффект (текст становится чёрным)
</acceptance_criteria>

### Task 2.10 — Footer с микроразметкой

<read_first>
- `content/pages/contacts.md` — контактные данные (телефон, email, реквизиты)
- `.planning/PROJECT.md` § Юрреквизиты
- `.planning/research/PITFALLS.md` § Микроразметка для Яндекса (itemscope/itemprop)
</read_first>

<action>
Создать `src/components/Footer.astro`:

```astro
---
import Container from "./Container.astro";
import Logo from "./Logo.astro";

const phone = "+79118627957";
const phoneDisplay = "+7 911 862 7957";
const email = "wings.agency@yandex.ru";
---

<footer
  itemscope
  itemtype="https://schema.org/Organization"
  class="bg-black text-white py-12"
>
  <meta itemprop="name" content="Крылья" />
  <meta itemprop="legalName" content="ИП Вострикова Мария Валерьевна" />
  <meta itemprop="taxID" content="550209075500" />
  <meta itemprop="vatID" content="324390000038348" />
  <meta itemprop="url" content="https://крылья.life/" />

  <Container>
    <div class="grid gap-12 md:grid-cols-3">
      <!-- Колонка 1: контакты -->
      <div
        itemscope
        itemtype="https://schema.org/LocalBusiness"
        itemprop="address"
      >
        <Logo variant="horizontal" class="brightness-0 invert mb-4" />
        <p class="text-sm text-gray-light mb-2" itemprop="addressLocality">
          Калининград и область
        </p>
        <p class="text-sm">
          <a href={`tel:${phone}`} itemprop="telephone" class="hover:text-yellow">
            {phoneDisplay}
          </a>
        </p>
        <p class="text-sm">
          <a href={`mailto:${email}`} itemprop="email" class="hover:text-yellow">
            {email}
          </a>
        </p>
      </div>

      <!-- Колонка 2: навигация -->
      <nav>
        <h4 class="text-sm font-semibold uppercase tracking-wider text-gray-light mb-4">
          Навигация
        </h4>
        <ul class="space-y-2 text-sm">
          <li><a href="/services/" class="hover:text-yellow">Услуги</a></li>
          <li><a href="/cases/" class="hover:text-yellow">Кейсы</a></li>
          <li><a href="/about/" class="hover:text-yellow">О нас</a></li>
          <li><a href="/contacts/" class="hover:text-yellow">Контакты</a></li>
        </ul>
      </nav>

      <!-- Колонка 3: реквизиты -->
      <div>
        <h4 class="text-sm font-semibold uppercase tracking-wider text-gray-light mb-4">
          Реквизиты
        </h4>
        <p class="text-sm text-gray-light leading-relaxed">
          ИП Вострикова Мария Валерьевна<br />
          ИНН 550209075500<br />
          ОГРНИП 324390000038348
        </p>
        <p class="mt-4 text-sm">
          <a href="/privacy/" class="text-gray-light hover:text-yellow">
            Политика обработки ПДн
          </a>
        </p>
      </div>
    </div>

    <div class="mt-12 pt-8 border-t border-gray-dark text-xs text-gray-light">
      © {new Date().getFullYear()} Крылья. Все права защищены.
    </div>
  </Container>
</footer>
```
</action>

<acceptance_criteria>
- Файл `src/components/Footer.astro` существует
- В HTML-выводе присутствуют атрибуты `itemscope itemtype="https://schema.org/Organization"` и `itemprop="legalName"`, `itemprop="taxID"`, `itemprop="addressLocality"`, `itemprop="telephone"`, `itemprop="email"`
- Текст «ИП Вострикова Мария Валерьевна» виден в подвале
- На жёлтый акцент срабатывает hover на телефон/email/ссылках
- На мобильном три колонки складываются в одну
</acceptance_criteria>

### Task 2.11 — BaseLayout

<action>
Создать `src/layouts/BaseLayout.astro`:

```astro
---
import "../styles/global.css";
import Header from "../components/Header.astro";
import Footer from "../components/Footer.astro";

interface Props {
  title: string;
  description?: string;
  noindex?: boolean;
}
const {
  title,
  description = "Ивент-агентство Крылья — организация мероприятий в Калининграде",
  noindex = false,
} = Astro.props;
---

<!doctype html>
<html lang="ru">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <meta name="description" content={description} />
    {noindex && <meta name="robots" content="noindex, nofollow" />}
    <title>{title}</title>
    <link
      rel="preload"
      href="/fonts/jost-cyrillic.woff2"
      as="font"
      type="font/woff2"
      crossorigin
    />
    <slot name="seo" />
  </head>
  <body class="bg-white text-gray-dark font-sans antialiased">
    <Header />
    <main>
      <slot />
    </main>
    <Footer />
    <slot name="analytics" />
  </body>
</html>
```
</action>

<acceptance_criteria>
- Файл `src/layouts/BaseLayout.astro` существует
- Принимает `title`, `description`, `noindex` props
- Рендерит `<html lang="ru">`, `<head>` с meta-тегами и preload шрифта, `<body>` с Header → main → Footer
- Слот `seo` доступен в `<head>`, слот `analytics` — после Footer
</acceptance_criteria>

---

## Wave 3 — Content Collections (🤖)

### Task 2.12 — Zod-схемы для 4 коллекций

<read_first>
- `.planning/research/ARCHITECTURE.md` § Content Collections
- Astro 6 docs (loaded via Context7 if needed)
</read_first>

<action>
Создать `src/content/config.ts`:

```ts
import { defineCollection, reference, z } from "astro:content";

const services = defineCollection({
  type: "content", // MDX
  schema: z.object({
    title: z.string(),
    slug: z.string(),
    description: z.string().max(200),
    order: z.number().default(99),
    featured: z.boolean().default(false),
    image: z.string().optional(),
  }),
});

const cases = defineCollection({
  type: "content",
  schema: z.object({
    title: z.string(),
    slug: z.string(),
    client: z.string(),
    date: z.coerce.date(),
    service: reference("services").optional(),
    segment: z.enum(["dev", "biz", "private"]),
    challenge: z.string(),
    solution: z.string(),
    results: z.array(z.string()),
    photos: z.array(z.string()).default([]),
    testimonial: reference("testimonials").optional(),
    featured: z.boolean().default(false),
  }),
});

const testimonials = defineCollection({
  type: "data", // .md/.json
  schema: z.object({
    author: z.string(),
    role: z.string(),
    company: z.string().optional(),
    photo: z.string().optional(),
    quote: z.string(),
    case: reference("cases").optional(),
  }),
});

const team = defineCollection({
  type: "data",
  schema: z.object({
    name: z.string(),
    role: z.string(),
    photo: z.string(),
    bio: z.string(),
    order: z.number().default(99),
  }),
});

export const collections = { services, cases, testimonials, team };
```
</action>

<acceptance_criteria>
- Файл `src/content/config.ts` существует
- Экспортирует `collections` объект с 4 ключами: `services`, `cases`, `testimonials`, `team`
- `cases.service` и `cases.testimonial` — references на другие коллекции
- `npm run build` проходит без ошибок типов
</acceptance_criteria>

### Task 2.13 — Тестовые записи в каждую коллекцию

<read_first>
- `content/pages/about.md` блок 3 (био команды)
- `content/pages/services.md` (для тестовой услуги)
- `.planning/phases/00-podgotovka/00-TEXTS-GAP.md` (для кейса Быстринское)
</read_first>

<action>
Создать тестовые записи:

1. **`src/content/services/corporate-parties.mdx`** (frontmatter + minimal MDX):
   ```mdx
   ---
   title: Корпоративные праздники
   slug: corporate-parties
   description: Новогодние и летние корпоративы, юбилеи компании, отраслевые праздники в Калининграде.
   order: 1
   featured: true
   ---
   Текст услуги — наполним в Phase 4.
   ```

2. **`src/content/cases/bystrinskoe-den-metallurga.mdx`**:
   ```mdx
   ---
   title: День металлурга «ГРК Быстринское»
   slug: bystrinskoe-den-metallurga
   client: ГРК «Быстринское»
   date: 2023-07-15
   service: corporate-parties
   segment: biz
   challenge: Провести профессиональный праздник для 300+ сотрудников горнодобывающей компании.
   solution: Концепция, площадка, кейтеринг, программа.
   results:
     - 300+ гостей
     - 100% удовлетворённость по опросу
   photos: []
   featured: true
   ---
   Подробное описание — наполним в Phase 5.
   ```

3. **`src/content/testimonials/byst-test.json`** (или `.md`):
   ```json
   {
     "author": "Тестовый клиент",
     "role": "Директор по персоналу",
     "company": "Компания Х",
     "quote": "Тестовый отзыв для проверки схемы. Заменим в Phase 5.",
     "case": "bystrinskoe-den-metallurga"
   }
   ```

4. **`src/content/team/maria.json`**:
   ```json
   {
     "name": "Мария Вострикова",
     "role": "Основатель и руководитель",
     "photo": "/team/maria.jpg",
     "bio": "Двигатель команды: если Крылья летят вперёд — значит, Мария машет первая.",
     "order": 1
   }
   ```

5. **`src/content/team/kristina.json`**:
   ```json
   {
     "name": "Кристина Прус",
     "role": "Координатор проектов",
     "photo": "/team/kristina.jpg",
     "bio": "Холодный расчёт команды. Её сложно вывести из себя.",
     "order": 2
   }
   ```

6. **`src/content/team/sergey.json`**:
   ```json
   {
     "name": "Сергей Дубровский",
     "role": "Продакшн",
     "photo": "/team/sergey.jpg",
     "bio": "Человек-скорость. Вы ещё формулируете задачу, а он уже её сделал.",
     "order": 3
   }
   ```
</action>

<acceptance_criteria>
- В `src/content/services/` лежит ≥ 1 MDX
- В `src/content/cases/` лежит ≥ 1 MDX
- В `src/content/testimonials/` лежит ≥ 1 JSON/MD
- В `src/content/team/` лежит 3 JSON
- `npm run build` собирается БЕЗ ошибок Zod-валидации
- references работают: case `bystrinskoe-den-metallurga` ссылается на service `corporate-parties` и testimonial `byst-test`
</acceptance_criteria>

---

## Wave 4 — Тестовая страница (🤖)

### Task 2.14 — `/test-design/` со всеми примитивами

<read_first>
- Все компоненты из Wave 2 и 3
- `src/content/config.ts`
</read_first>

<action>
Создать `src/pages/test-design.astro`:

```astro
---
import { getCollection } from "astro:content";
import BaseLayout from "../layouts/BaseLayout.astro";
import Container from "../components/Container.astro";
import Section from "../components/Section.astro";
import Heading from "../components/Heading.astro";
import Button from "../components/Button.astro";

const services = await getCollection("services");
const cases = await getCollection("cases");
const testimonials = await getCollection("testimonials");
const team = await getCollection("team");
---

<BaseLayout title="Test Design — Крылья" noindex>
  <Section>
    <Container>
      <Heading level={1}>Дизайн-система — превью</Heading>
      <p class="mt-4 text-gray-dark">Проверка всех примитивов, цветов, шрифтов и Content Collections.</p>
    </Container>
  </Section>

  <Section class="bg-gray-light/20">
    <Container>
      <Heading level={2}>Палитра</Heading>
      <div class="mt-8 grid gap-4 grid-cols-2 md:grid-cols-5">
        <div class="aspect-square bg-yellow flex items-end p-3 text-xs text-black">#FFF200</div>
        <div class="aspect-square bg-black flex items-end p-3 text-xs text-white">#000000</div>
        <div class="aspect-square bg-gray-dark flex items-end p-3 text-xs text-white">#414042</div>
        <div class="aspect-square bg-gray-light flex items-end p-3 text-xs text-black">#BCBEC0</div>
        <div class="aspect-square bg-white border border-gray-light flex items-end p-3 text-xs text-black">#FFFFFF</div>
      </div>
    </Container>
  </Section>

  <Section>
    <Container>
      <Heading level={2}>Типографика</Heading>
      <div class="mt-8 space-y-4">
        <Heading level={1}>Заголовок H1 — Jost Bold</Heading>
        <Heading level={2}>Заголовок H2 — Jost SemiBold</Heading>
        <Heading level={3}>Заголовок H3 — Jost SemiBold</Heading>
        <Heading level={4}>Заголовок H4 — Jost Medium</Heading>
        <p>Параграф — обычный текст в Jost Regular. Тут идёт длинная фраза, чтобы оценить читаемость, межстрочный интервал и общее ощущение от шрифта на абзаце среднего размера.</p>
      </div>
    </Container>
  </Section>

  <Section class="bg-gray-light/20">
    <Container>
      <Heading level={2}>Кнопки</Heading>
      <div class="mt-8 flex flex-wrap gap-4">
        <Button variant="primary">Оставить заявку</Button>
        <Button variant="secondary">Позвонить</Button>
        <Button href="/" variant="primary">Кнопка-ссылка</Button>
      </div>
    </Container>
  </Section>

  <Section>
    <Container>
      <Heading level={2}>Контент-коллекции</Heading>
      <div class="mt-8 grid gap-12 md:grid-cols-2">
        <div>
          <Heading level={3}>Услуги ({services.length})</Heading>
          <ul class="mt-4 space-y-2">
            {services.map((s) => <li>{s.data.title} — {s.data.description}</li>)}
          </ul>
        </div>
        <div>
          <Heading level={3}>Кейсы ({cases.length})</Heading>
          <ul class="mt-4 space-y-2">
            {cases.map((c) => <li>{c.data.title} ({c.data.client})</li>)}
          </ul>
        </div>
        <div>
          <Heading level={3}>Отзывы ({testimonials.length})</Heading>
          <ul class="mt-4 space-y-2">
            {testimonials.map((t) => <li>«{t.data.quote}» — {t.data.author}</li>)}
          </ul>
        </div>
        <div>
          <Heading level={3}>Команда ({team.length})</Heading>
          <ul class="mt-4 space-y-2">
            {team.sort((a, b) => a.data.order - b.data.order).map((m) => (
              <li><strong>{m.data.name}</strong> — {m.data.role}. {m.data.bio}</li>
            ))}
          </ul>
        </div>
      </div>
    </Container>
  </Section>
</BaseLayout>
```
</action>

<acceptance_criteria>
- Файл `src/pages/test-design.astro` существует
- Использует BaseLayout с `noindex={true}`
- На preview-URL `/test-design/` рендерит:
  - 5-цветную палитру
  - 4 заголовка h1-h4 в Jost разных весов
  - 2-3 кнопки primary/secondary
  - 4 списка из коллекций (услуги, кейсы, отзывы, команда)
- Команда отсортирована по `order` (Мария → Кристина → Сергей)
</acceptance_criteria>

### Task 2.15 — Обновить `index.astro` под BaseLayout

<action>
Заменить содержимое `src/pages/index.astro` (placeholder из Phase 1) на использующее BaseLayout:

```astro
---
import BaseLayout from "../layouts/BaseLayout.astro";
import Container from "../components/Container.astro";
import Section from "../components/Section.astro";
import Heading from "../components/Heading.astro";
import Button from "../components/Button.astro";
---

<BaseLayout
  title="Крылья — ивент-агентство в Калининграде"
  description="Организация мероприятий под ключ в Калининграде. Корпоративные праздники, деловые события, кейсы. Работаем с 2024 года."
  noindex
>
  <Section>
    <Container>
      <Heading level={1}>
        Сайт <span class="bg-yellow px-2">в разработке</span>
      </Heading>
      <p class="mt-6 text-lg text-gray-dark max-w-2xl">
        Идёт переезд агентства «Крылья» с Tilda на новый стек. Запуск ожидается к 15 мая 2026.
      </p>
      <div class="mt-8 flex gap-4">
        <Button href="tel:+79118627957" variant="primary">Позвонить</Button>
        <Button href="mailto:wings.agency@yandex.ru" variant="secondary">Написать</Button>
      </div>
    </Container>
  </Section>
</BaseLayout>
```

(оставляем `noindex` — главная как настоящая Phase 3 заработает в следующей фазе)
</action>

<acceptance_criteria>
- `src/pages/index.astro` использует `<BaseLayout>`
- На preview-URL главная показывает шапку, hero с заголовком и кнопками, подвал
- Шапка и подвал видны на ВСЕХ страницах (включая `/test-design/`)
</acceptance_criteria>

---

## Verification (как поймём, что фаза закрыта)

После того как я задеплою все изменения через push:

1. Маша открывает **https://krylya-life.netlify.app/test-design/** → видит:
   - Палитру в правильных цветах
   - 4 заголовка H1-H4 в Jost (геометричный шрифт, не Times и не Arial)
   - 3 кнопки (чёрная, обводка, ссылка)
   - 4 списка с реальными именами команды
   - Шапку с лого + меню сверху
   - Подвал с реквизитами «ИП Вострикова Мария Валерьевна · ИНН 550209075500» снизу
2. Маша открывает **главную** `https://krylya-life.netlify.app/` → видит обновлённый hero с шапкой и подвалом
3. Если что-то выглядит «не так» — скриншот, поправлю
4. Если всё ок — Phase 2 закрыта, переходим к Phase 3 (главная как vertical slice + форма + Метрика)

## Что в этой фазе НЕ делаем (важно)

- НЕ пишем настоящие тексты услуг ≥800 слов — Phase 4
- НЕ заполняем 5 кейсов — Phase 5
- НЕ подключаем Метрику и не делаем форму — Phase 3
- НЕ подключаем JSON-LD `@graph` (только микроразметка) — Phase 3
- НЕ подключаем mobile-меню функционально — Phase 3 (или позже)
- НЕ переключаем главную с `noindex` — Phase 7
- НЕ конвертируем логотип в SVG обязательно — followup, можно оставить PNG до Phase 3
