---
phase: 4
phase_name: Услуги и семантика
wave: 1
depends_on: [3]
files_modified:
  - src/content/services/*.md
  - src/pages/services/[slug].astro
  - src/pages/services/index.astro
  - src/pages/pricing.astro
  - src/components/JsonLdService.astro
  - src/components/Breadcrumbs.astro
  - src/components/blocks/PricingTeaser.astro
requirements:
  - SEMA-01
  - SEMA-02
  - SEO-03
  - PAGE-02
  - PAGE-03
  - PAGE-04
  - PAGE-05
  - PAGE-06
  - PAGE-07
  - PAGE-08
  - PAGE-09
autonomous: true
status: ready
---

# Phase 4 — Plan: Услуги и семантика

> Большая контентная фаза. Идём итерациями: сначала **одна страница услуги как шаблон-эталон** (Корпоративы), Маша утверждает структуру/тон, потом пишем остальные 5 одним заходом.

## Цель

После фазы у Крыльев будет **8 новых SEO-страниц**: 6 услуг (≥800 слов каждая) + витрина `/services/` + `/pricing/` с разбором 10%-модели. Каждая подстраница ранжируется под свой коммерческий кластер запросов («организация конференции Калининград», «тимбилдинг Калининград» и т.д.).

## Must-haves

1. На preview-URL открываются 8 новых страниц: `/services/`, `/services/corporate-parties/`, `/services/business-events/`, `/services/client-events/`, `/services/teambuilding/`, `/services/coordination/`, `/services/private/`, `/pricing/`
2. Каждая подстраница услуги ≥ 800 слов; ≥ 30% контента основано на фактуре из `.business/products/` + `.business/audience/`
3. Каждая подстраница имеет: hero + список «что входит» + «для кого» + примеры из кейсов с цифрами + локальный контекст + ссылку на ≥1 реальный кейс из `src/content/cases/` + форму
4. На каждой подстранице — JSON-LD Service-schema + микроразметка BreadcrumbList в `<head>`
5. Витрина `/services/` показывает все 6 категорий
6. `/pricing/` с разбором 10%-модели и типичными диапазонами бюджетов
7. Маша утвердила хотя бы первую страницу-эталон (Корпоративы) — это сигнал, что шаблон годный

---

## Wave 1 — Семантическое ядро (🤖)

### Task 4.1 — Зафиксировать ядро в файле

<read_first>
- `.business/audience/avatar.md`, `segments.md`
- `.business/products/overview.md`
- 04-CONTEXT.md § D-07 (кластеры-гипотеза)
</read_first>

<action>
Создать `.planning/phases/04-services/04-SEMANTICS.md` со структурой:
- Бренд-кластер (низкочастотные)
- Общий коммерческий кластер (главная + /services/)
- 6 кластеров услуг (по одному на страницу)
- Каждый кластер: 5–10 ключей, отметка частотности (HIGH/MED/LOW — по моей интуиции отрасли)
- Раздел «Что проверить через Wordstat в Phase 7»
</action>

<acceptance_criteria>
- Файл `04-SEMANTICS.md` существует
- 8 кластеров (бренд + общий + 6 услуг)
- Минимум 5 ключей в каждом услужном кластере
- TODO-блок «проверить в Wordstat в Phase 7»
</acceptance_criteria>

---

## Wave 2 — Шаблонная страница «Корпоративные праздники» (🤖 + 👤 ревью)

### Task 4.2 — Драфт `/services/corporate-parties/`

<read_first>
- `.business/products/overview.md` (что реально приносит деньги — корпоративы и есть один из главных)
- `.business/audience/avatar.md`
- `.business/audience/objections.md`
- `src/content/cases/bystrinskoe-den-metallurga.md` — релевантный кейс для ссылки
- 04-SEMANTICS.md § кластер #1 (corporate-parties)
- 04-CONTEXT.md § D-03 (8-блочный шаблон)
</read_first>

<action>
1. Создать `src/pages/services/[slug].astro` — динамический шаблон:
   - getStaticPaths из `getCollection("services")`
   - Layout BaseLayout с Seo, JsonLdService, Breadcrumbs
   - Рендерит секции по структуре D-03 из CONTEXT
   - В конце — ContactForm

2. Создать компонент `src/components/JsonLdService.astro` — генерирует Service JSON-LD из props (slug, name, description) + provider reference на Organization

3. Создать компонент `src/components/Breadcrumbs.astro` — рендерит «Главная → Услуги → Услуга» с микроразметкой schema.org/BreadcrumbList через itemscope/itemprop

4. Создать компонент `src/components/blocks/PricingTeaser.astro` — короткий блок (1 абзац + ссылка на /pricing/)

5. Перезаписать `src/content/services/corporate-parties.md`:
   - Frontmatter (как было)
   - Тело — полный MDX контент по структуре D-03, ≥800 слов, с фактурой:
     - Реальный hero: «Организация корпоративных праздников в Калининграде»
     - 7 пунктов «что входит»
     - 3 типа клиентов: дев-компании / промышленные / иногородние HR
     - 4 типичные задачи: НГ-корпоратив, юбилей компании, поощрение, отраслевой день
     - Примеры: «Быстринское» (300 гостей, день металлурга 2023) с ссылкой на кейс
     - Калининградский контекст: 2 абзаца про сезонность, площадки (исторические особняки, замки, лофты, побережье), типичную команду подрядчиков
     - PricingTeaser
6. Запустить локальный билд, проверить что страница рендерится
</action>

<acceptance_criteria>
- Открывается `/services/corporate-parties/` на preview-URL
- В исходнике страницы видно ≥800 слов осмысленного текста
- Есть JSON-LD Service-schema (`<script type="application/ld+json">` с `"@type": "Service"`)
- Есть BreadcrumbList (через itemscope/itemprop)
- Есть форма заявки в конце
- Заголовок страницы (title) содержит «Калининград»
- Есть ссылка на кейс Быстринское
</acceptance_criteria>

### Task 4.3 — Маша вычитывает шаблон

<action>
Я пишу промежуточный пост в чат:
1. Прошу открыть `https://krylya-life.netlify.app/services/corporate-parties/` после деплоя
2. Прошу прочитать с позиции «что бы я подумала, прочитав это про себя»
3. Маша отмечает: тон ОК / нужно поменять? Структура удобная? Чего не хватает? Что лишнее?
4. Я применяю фидбек к шаблону → дальше остальные 5 пишутся уже с учётом

Если Маша одобряет — двигаемся к Wave 3.
Если требуются изменения — переделываем corporate-parties до утверждения, и только тогда Wave 3.
</action>

---

## Wave 3 — Остальные 5 страниц услуг (🤖)

### Task 4.4 — Драфты 5 оставшихся страниц

<read_first>
- Утверждённый `src/content/services/corporate-parties.md` как образец
- `.business/products/`, `.business/audience/`, `.business/marketing/content.md`
- 04-SEMANTICS.md (соответствующий кластер на каждую услугу)
- Релевантные кейсы из `src/content/cases/`:
  - business-events: ВКЛЮЧИ партнёрский вечер
  - client-events: ВКЛЮЧИ партнёрский (или общий ВКЛЮЧИ)
  - teambuilding: пока кейсов нет — TODO
  - coordination: пока кейсов нет — TODO
  - private: «Нити дочерей ночи» можно использовать как пример частного формата
</read_first>

<action>
По единому шаблону (как corporate-parties) создать/обновить:
1. `src/content/services/business-events.md` — Деловые мероприятия (конференции, презентации, открытия)
2. `src/content/services/client-events.md` — Клиентские события (партнёрские вечера, мероприятия для дольщиков)
3. `src/content/services/teambuilding.md` — Тимбилдинги
4. `src/content/services/coordination.md` — Координация дня (новая запись, ещё не было)
5. `src/content/services/private.md` — Частные мероприятия (новая запись)

В каждой:
- Frontmatter с title, slug, description, order, featured (только corporate-parties и business-events помечаем featured: true для главной)
- Тело ≥ 800 слов по той же 8-блочной структуре
- Уникальная фактура каждой страницы — ≥30% (т.е. при 800 словах ≥240 слов уникального контента про конкретную услугу, остальное может пересекаться по структуре)
- Каждая ссылается на ≥1 кейс (или, если нет точного — самый смысло-близкий)
- В конце ContactForm

Где нет точного кейса (teambuilding, coordination) — поставить TODO «добавить кейс в Phase 5» и временно ссылаться на самый близкий из имеющихся.
</action>

<acceptance_criteria>
- Все 6 файлов в `src/content/services/` имеют MDX-тело ≥ 800 слов (можно проверить `wc -w`)
- Каждая страница рендерится без ошибок Zod
- На каждой `/services/<slug>/` есть JSON-LD Service-schema, BreadcrumbList, форма
- Каждая страница имеет минимум 1 внутреннюю ссылку на кейс (или TODO-маркер)
- Маша вычитывает все 5 — отмечает что менять
</acceptance_criteria>

### Task 4.5 — Применить фидбек Маши

<action>
По мере получения замечаний от Маши — править соответствующий файл, коммитить с пометкой `style(04): редактура <название услуги>`. Не менять структуру — только текст.
</action>

---

## Wave 4 — Витрина `/services/` (🤖)

### Task 4.6 — `src/pages/services/index.astro`

<read_first>
- `src/components/blocks/ServicesPreview.astro` — переиспользуем логику
- 04-CONTEXT.md § D-12, D-13
</read_first>

<action>
Создать `src/pages/services/index.astro`:
- BaseLayout с Seo (title «Услуги — организация мероприятий в Калининграде», description под общий коммерческий кластер)
- Hero: H1 «Чем мы занимаемся», подзаголовок про полный цикл и 10%-модель
- Сетка из 6 карточек (по одной на услугу) — компонент-карточка с title, description, ссылкой на подстраницу
- Внизу — `PricingTeaser` со ссылкой на /pricing/
- ContactForm в конце
- BreadcrumbList «Главная → Услуги»
</action>

<acceptance_criteria>
- Открывается `/services/`
- На странице видны все 6 услуг как карточки
- Каждая карточка ведёт на свою подстраницу
- Есть микроразметка BreadcrumbList и JSON-LD Service WebPage
</acceptance_criteria>

---

## Wave 5 — `/pricing/` (🤖)

### Task 4.7 — `src/pages/pricing.astro`

<read_first>
- `.business/products/pricing.md` (источник по 10%-модели)
- `.business/economics/unit-economics.md` (если есть — про средний чек)
- 04-CONTEXT.md § D-08, D-09
</read_first>

<action>
Создать `src/pages/pricing.astro`:
- BaseLayout с Seo (title «Сколько стоит организовать мероприятие в Калининграде»)
- 5 блоков по структуре D-09:
  1. Из чего складывается смета (площадка, кейтеринг, декор, техника, артисты, координация — реальные расходы на подрядчиков)
  2. Что такое 10% агентских (наша зона ответственности)
  3. Типичные диапазоны бюджетов (500 тыс — 1.5 млн / до 7 млн)
  4. Почему нет пакетов «базовый/стандарт/премиум»
  5. Какие случаи к нам подходят
- ContactForm в конце
- BreadcrumbList «Главная → Цены»
- НЕ ставим онлайн-калькулятор (anti-feature)
</action>

<acceptance_criteria>
- Открывается `/pricing/`
- Содержит ≥600 слов структурированного текста про 10%-модель
- НЕТ калькулятора, НЕТ слов «от X рублей» в hero
- Есть BreadcrumbList
- Есть форма
</acceptance_criteria>

---

## Verification — как поймём что фаза закрыта

1. ✅ Все 8 страниц открываются на preview-URL
2. ✅ Каждая страница услуги имеет ≥800 слов (`wc -w` через MDX-тело)
3. ✅ Каждая страница услуги имеет JSON-LD Service + BreadcrumbList
4. ✅ Витрина `/services/` показывает 6 карточек
5. ✅ `/pricing/` с разбором 10%-модели существует
6. ✅ Маша вычитала все 6 страниц услуг + /pricing/ + витрину; основной контент утверждён
7. ✅ Финальную полировку (мелкие правки) Маша добавляет в `feedback.md` для Phase 6.5

## Что в этой фазе НЕ делаем

- НЕ полируем тексты до идеала (это Phase 6.5)
- НЕ добавляем фото на страницы услуг (это Phase 5 + полировка)
- НЕ верифицируем семядро через Wordstat (это Phase 7)
- НЕ настраиваем внутренние ссылки между всеми страницами (только из услуг → кейсы; обратные ссылки в Phase 5)
- НЕ создаём sitemap.xml (это Phase 7)

---

## Текущий статус — на 2026-04-26

**Реализовано полностью:**

- **Wave 1 — Task 4.1.** Семантическое ядро зафиксировано в `04-SEMANTICS.md` (8 кластеров: бренд + общий + 6 услуг + цена). Проверка через Wordstat вынесена в Phase 7
- **Wave 2 — Task 4.2.** Шаблон `[slug].astro` готов; компоненты `JsonLdService.astro`, `Breadcrumbs.astro`, `PricingTeaser.astro` собраны; страница `/services/corporate-parties/` написана и переписана по фидбеку Маши (тон → изящный, без просторечий, без упоминаний «семь лет»; убраны блоки «Кому подходит» и «Пример из практики»; ссылка на «Быстринское» убрана). Объём — 805 слов
- **Wave 2 — Task 4.3.** Маша вычитала Корпоративы — два цикла правок: сначала по тону, затем по конкретным формулировкам. Шаблон утверждён как образец для остальных 5 страниц
- **Wave 3 — Task 4.4.** 5 страниц услуг написаны в едином стиле и собраны: business-events (803), client-events (824), teambuilding (816), coordination (811), private (810) слов в теле каждой
- **Wave 4 — Task 4.6.** Витрина `/services/index.astro` собрана: сетка из 6 карточек, breadcrumbs, JsonLdGraph, PricingTeaser, ContactBlock
- **Wave 5 — Task 4.7.** `/pricing.astro` собран: 6 разделов (из чего складывается смета, что такое 10% агентских, типичные диапазоны, почему нет пакетов, кому подходит, почему нет онлайн-калькулятора), без слов «от X рублей» в hero, без калькулятора

**Дополнительно сделано в ходе фазы:**

- Очистка кейса «Быстринское»: `featured: true → false`, удалена связка с отзывом, удалён `src/content/testimonials/bystrinskoe.json`, обновлён черновик главной (`content/pages/home.md`) — убрано из списка кейсов и логотипов «ключевых клиентов». Решение Маши: проект Кристины (до Крыльев), оставляем только в будущей странице портфолио

**Осталось до закрытия фазы:**

- **Wave 3 — Task 4.5 (вычитка Маши).** Маша вычитывает 5 новых страниц услуг + витрину + /pricing/ и присылает список правок. Применяю правки коммитами `style(04): редактура <название>` без изменения структуры
- Обновление пункта 6 верификации фазы (Маша утвердила контент)

**Решения по архитектуре, зафиксированные в фазе:**

- На страницах услуг временно НЕ ставим ссылки на конкретные кейсы. Кейсы Маша добавит позже, после сбора фото-архива и согласований с клиентами. Acceptance criterion плана «ссылка на ≥1 кейс» переносится в Phase 5
- Тон контента: изящно, экспертно, с лёгкой иронией. Без просторечий, без жанра «давайте честно» в каждом абзаце, без упоминаний «семи лет опыта», без «без скрытых накруток»
