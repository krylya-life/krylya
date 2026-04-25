# Phase 2: Дизайн-система и контент-модели — Context

**Gathered:** 2026-04-25
**Status:** Ready for planning

<domain>
## Phase Boundary

Поставить «фундамент» вёрстки: типографика, цвета, базовые «кубики» (контейнер, секция, кнопка, заголовки), общий каркас страницы (BaseLayout с шапкой, подвалом, SEO-блоком), SVG-логотип, и описать «формы» данных — какие поля есть у услуги, кейса, отзыва, члена команды, какие связи между ними.

**В скоупе:**
- Tailwind v4 через `@tailwindcss/vite` (DS-02)
- Jost (3–4 начертания .woff2 self-hosted, через `@font-face`) (DS-01)
- `@theme` Tailwind: монохром + жёлтый `#FFF200` (DS-02)
- UI-примитивы: `Container`, `Section`, `Button`, `Heading` (DS-03)
- `BaseLayout`: html → `<head>` со слотом для Seo → Header → main slot → Footer + слот для Метрики (DS-04)
- Микроразметка Organization + LocalBusiness в `<footer>` через `itemscope`/`itemprop` (DS-04, для Яндекса)
- SVG-логотип: компонент, без внешнего шрифта (Demetriss-надпись внутри SVG как paths) (DS-05)
- 4 Content Collections: `services`, `cases`, `testimonials`, `team` со Zod-схемами (CONT-01..04)
- References между коллекциями: case → service, case → testimonial (CONT-05)
- По одной тестовой записи в каждой коллекции — для проверки, что Zod-валидация проходит
- Тестовая страница `/test-design/` (с `noindex`) для визуальной проверки всех примитивов

**Вне скоупа:**
- Главная страница, форма заявки, Метрика-цели — Phase 3
- Реальные тексты услуг ≥800 слов — Phase 4
- Реальные кейсы — Phase 5
- Production-домен — Phase 7
- JSON-LD `@graph` (LocalBusiness/Organization/Service) — Phase 3 (сейчас только микроразметка в футере)

</domain>

<decisions>
## Implementation Decisions

### Цветовая палитра (из брендбука `.business/assets/brand-guidelines.md`)

- **D-01:** `--color-yellow: #FFF200` — единственный акцент, очень дозированно (CTA, hover, отдельные числа). НЕ заливать им большие площади.
- **D-02:** `--color-black: #000000` — основные заголовки, лого
- **D-03:** `--color-gray-dark: #414042` — основной body-текст (мягче чистого чёрного, легче читать)
- **D-04:** `--color-gray-light: #BCBEC0` — подписи, секундарный текст, разделители
- **D-05:** `--color-white: #FFFFFF` — фон по умолчанию

Всё это кладём в `@theme` Tailwind v4 как `--color-yellow`, `--color-black` и т.д. — будут доступны как `bg-yellow`, `text-gray-dark` и т.п.

### Типографика

- **D-06:** Шрифт **Jost** (OFL, бесплатный) — основной и единственный для всего сайта
- **D-07:** Начертания: `400 Regular`, `500 Medium`, `600 SemiBold`, `700 Bold` (4 веса = ~150–200 КБ суммарно в .woff2)
- **D-08:** Источник файлов: `https://fonts.google.com/specimen/Jost` → скачиваем .ttf, конвертируем в .woff2 через `pyftsubset` или используем готовые .woff2 с `fonts.bunny.net` (CDN-зеркало Google Fonts, не отслеживает пользователей). **Решение: качаем готовые .woff2 с bunny.net** — простой, без лишних шагов.
- **D-09:** Кладём в `public/fonts/jost-{400,500,600,700}.woff2`. Подключаем через `@font-face` в `src/styles/global.css` с `font-display: swap` и `unicode-range` для cyrillic + latin.

### UI-примитивы (DS-03)

- **D-10:** **`Container`** — максимальная ширина `1200px`, центрированный, горизонтальные паддинги responsive (`px-4 sm:px-6 lg:px-8`). Это «обёртка» вокруг контента, чтобы он не растягивался на всю ширину экрана на десктопах.
- **D-11:** **`Section`** — вертикальные паддинги между блоками (`py-16 md:py-24`). Позволяет красиво разделять смысловые блоки.
- **D-12:** **`Heading`** — компонент с пропсом `level={1|2|3|4}`, рендерит `<h1>...<h4>` с заранее подобранными размерами/весами (h1 — 700, h2-h3 — 600, h4 — 500).
- **D-13:** **`Button`** — два варианта (`variant="primary" | "secondary"`):
  - `primary`: чёрный фон (`bg-black`), белый текст, на hover — жёлтая обводка снизу (или жёлтый фон + чёрный текст)
  - `secondary`: прозрачный фон, чёрная обводка `1px`, чёрный текст. Для второстепенных CTA («Позвонить» рядом с «Оставить заявку»)
  - Углы: **слегка скруглённые** (`rounded-md`, ~6px) — не острые, не пилюля. Геометричный, но не агрессивный.

### BaseLayout

- **D-14:** Структура:
  ```
  <html lang="ru">
    <head>
      <meta charset>, <viewport>, <title>, <meta description>
      <slot name="seo" /> ← сюда страницы кладут JSON-LD, canonical, og:tags
      <link rel="preload" font.woff2>
      <link rel="stylesheet" global.css>
    </head>
    <body>
      <Header />
      <main>{slot}</main>
      <Footer />
      <slot name="analytics" /> ← сюда Phase 3 положит Метрику
    </body>
  </html>
  ```
- **D-15:** **Header** — простой, минималистичный:
  - Лого слева (горизонтальная версия)
  - Меню справа: Услуги · Кейсы · О нас · Контакты
  - На мобильном — гамбургер
  - **Не sticky** в этой фазе (можно добавить позже, если решим).
  - Высота ~80px
- **D-16:** **Footer** — три колонки:
  - Колонка 1: лого + адрес («Калининград и область») + телефон + email
  - Колонка 2: Навигация сайта (повтор пунктов меню)
  - Колонка 3: Юрреквизиты «ИП Вострикова Мария Валерьевна · ИНН 550209075500 · ОГРНИП 324390000038348» + ссылка «Политика конфиденциальности»
  - Микроразметка `itemscope itemtype="https://schema.org/Organization"` обёрткой; `itemprop="name"`, `addressLocality`, `telephone`, `email` на конкретных элементах
  - На мобильном — стек одна-под-другой

### SVG-логотип (DS-05)

- **D-17:** Логотип-исходник имеется в брендбуке только в PNG/AI/PDF. SVG нужно либо запросить у дизайнера, либо сконвертировать. **Pragmatic decision:** в Phase 2 используем горизонтальную PNG-версию (`WINGS_logo_hor_black_RGB.png`) как `<img>` через компонент `<Logo />`. Параллельно запрашиваем у Марии SVG (или делаем трассировку в Phase 3). Это **временный компромисс** — DS-05 формально требует SVG. Помечаем как followup.
- **D-18:** PNG лого копируется в `public/brand/wings-logo-horizontal.png` (в репозитории, не в git LFS — файл небольшой). Также `WINGS_sign_black_RGB.png` в `public/brand/wings-sign.png` для favicon (16/32/180 px размеры сгенерируем через автоматику).
- **D-19:** Компонент `<Logo variant="horizontal" | "sign" />` — рендерит соответствующую картинку с правильным `alt="Крылья — ивент-агентство в Калининграде"` и фиксированными CSS-размерами.

### Content Collections (Zod-схемы)

- **D-20:** **`services`** — `title`, `slug`, `description` (≤200 chars meta), `order` (для сортировки на витрине), `featured` (boolean — выводить ли на главной), `image` (опц.), `body` (MDX, рендерится Astro). Пример: «Корпоративные праздники».
- **D-21:** **`cases`** — `title`, `slug`, `client` (имя или отрасль), `date` (Date), `service` (reference на `services`), `segment` ("dev" | "biz" | "private"), `challenge`, `solution`, `results` (string[] — список цифр), `photos` (string[]), `testimonial` (опц. reference на `testimonials`), `featured` (boolean). Пример: «Быстринское — день металлурга».
- **D-22:** **`testimonials`** — `author` (name), `role`, `company`, `photo` (опц.), `quote`, `case` (опц. reference обратно на `cases`).
- **D-23:** **`team`** — `name`, `role`, `photo`, `bio` (короткое, 2–3 предложения), `order`. Пример: 3 записи (Мария, Кристина, Сергей) с био из Phase 0.
- **D-24:** **References** реализуются через `reference()` из `astro:content`. Cases ссылаются на services и testimonials. Testimonials опционально ссылаются обратно на case.
- **D-25:** Все коллекции живут в `src/content/<name>/`. Astro Content Collections включаются в `src/content/config.ts` через `defineCollection({ schema: z.object({...}) })`.

### Тестовая страница

- **D-26:** `src/pages/test-design.astro` — не индексируется (`<meta name="robots" content="noindex">`), показывает все примитивы рядом: цвета, типографику h1-h4, кнопки primary/secondary, рендер Container+Section, рендер списка из всех 4 коллекций (по одной тестовой записи). Эту страницу удалим перед релизом в Phase 7 (или оставим под `/test-design/` с noindex).

### Что Мария делает руками, что — Claude

**Мария делает (нельзя автоматизировать):**
1. Если есть **SVG-версия логотипа** от дизайнера — пришли мне (или сообщи что нет, тогда работаем с PNG в Phase 2 и SVG-конверсия едет в Phase 3)
2. Финальная визуальная проверка тестовой страницы после деплоя — оценить, что цвета/шрифты/кнопки выглядят как ожидается. Сказать, что хочется иначе.

**Claude (я) делает:**
1. Все технические шаги: установка Tailwind v4, скачивание шрифтов, написание компонентов, схем, тестовых записей, тестовой страницы
2. Коммиты + автодеплой через push
3. Проверка билда (`npm run build`) и dev-сервера

</decisions>

<canonical_refs>
## Canonical References

- `.business/assets/brand-guidelines.md` — палитра, шрифты, логотипы (источник правды)
- `/Users/mariiavostrikova/Documents/Крылья. Общее./Айдентика/` — исходники бренда (PNG, AI, PDF, шрифты)
- `.planning/PROJECT.md` — Key Decisions (Astro 6, Tailwind v4, Jost, монохром + #FFF200, двойная разметка)
- `.planning/REQUIREMENTS.md` — DS-01..05, CONT-01..05
- `.planning/ROADMAP.md` — Phase 2 success criteria
- `.planning/research/STACK.md` — детали Astro/Tailwind v4 конфигурации
- `.planning/research/ARCHITECTURE.md` — паттерны BaseLayout, Content Collections, references
- `.planning/research/PITFALLS.md` — лицензия шрифтов (Jost OFL — ок, FuturaPT не используем), микроразметка Яндекса
- `.planning/phases/01-seo-tilda/01-CONTEXT.md` — что есть в репозитории после Phase 1
- `content/pages/{home,about,services,contacts}.md` — драфты текстов (нужны для Phase 3+, но можем подсматривать тон)
</canonical_refs>

<code_context>
## Existing Code Insights

### После Phase 1
- `package.json` с `astro@^6` — добавим `@tailwindcss/vite`, `tailwindcss@^4`
- `astro.config.mjs` — добавим Vite plugin `@tailwindcss/vite`
- `src/pages/index.astro` — простая HTML-страница, заменим на использующую BaseLayout (или оставим заглушку и сделаем `test-design.astro` отдельно)
- `tsconfig.json` — extends `astro/tsconfigs/strict`, ОК
- `assets/team/`, `assets/cases/<slug>/` — фото-структура (Phase 0). Astro в Phase 2 не берёт оттуда, но в Phase 5 будем брать пути

### Чего нет — появится в Phase 2
- `src/content/config.ts` — Zod-схемы коллекций
- `src/content/{services,cases,testimonials,team}/<slug>.md(x)` — записи
- `src/components/{Container,Section,Button,Heading,Logo,Header,Footer}.astro`
- `src/layouts/BaseLayout.astro`
- `src/styles/global.css` — Tailwind import + `@theme` + `@font-face`
- `public/fonts/jost-*.woff2` — шрифты
- `public/brand/wings-logo-horizontal.png`, `public/brand/wings-sign.png` — лого
- `src/pages/test-design.astro` — превью всех примитивов

</code_context>

<deferred>
## Deferred Ideas

- **SVG-конверсия логотипа** — если у Марии нет от дизайнера, делаем в Phase 3 (через онлайн-конвертер или ручную трассировку). Pragmatic-исключение к DS-05 на Phase 2.
- **Sticky header** — после визуальной проверки в Phase 3 (нужен ли)
- **Dark mode** — не планируем в v1 (брендбук только light)
- **JSON-LD @graph** — Phase 3 (когда будут реальные данные на главной)
- **Микроразметка BreadcrumbList** — Phase 4 (когда появятся подстраницы услуг)
- **Tailwind container queries** — пока не используем, рано

</deferred>

---

*Phase: 02-design-system*
*Context gathered: 2026-04-25*
