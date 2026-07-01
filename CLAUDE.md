# Крылья — навигация по проекту

Этот документ — карта проекта. Читай его в начале каждой сессии, чтобы понимать, где что лежит и как с этим работать.

## Что это за проект

**Крылья** (крылья.life) — сайт ивент-агентства «Крылья» в Калининграде для привлечения корпоративных клиентов (девелоперы, крупный бизнес, иногородние заказчики) из поиска, а не только из сарафана.

Сайт решает задачу «отвязать бизнес от личных связей Марии»: сделать SEO-оптимизированные страницы услуг и кейсов, чтобы клиенты, ищущие «организация корпоратива Калининград» и аналогичные запросы, попадали на сайт и оставляли заявки. Инструмент — конструктор Tilda: тексты, структура и SEO собираются здесь, в репозитории, и переносятся в редактор Tilda руками.

Подробности — в [../.business/INDEX.md](../.business/INDEX.md).

## Структура репозитория

```
claude/  (рабочее пространство в ~/claude/)
├── CLAUDE.md             ← короткий ридер для workspace
├── .business/            ← скрытая папка, бизнес-контекст (не в git)
│   ├── INDEX.md          ← оглавление, входная точка
│   ├── company/          ← about, team, values, legal
│   ├── products/         ← overview, pricing, product-1
│   ├── audience/         ← avatar, segments, objections, journey
│   ├── goals/            ← annual, quarterly, monthly, kpi
│   ├── economics/        ← unit-economics, revenue, costs, forecast
│   ├── marketing/        ← channels, funnel, competitors, content
│   └── assets/           ← brand-guidelines, testimonials
├── plans/                ← технические планы (один план = одна функция)
└── krylya/               ← ЭТОТ проект (сайт): CLAUDE.md, brief, sitemap, тексты, SEO, кейсы
    └── .planning/        ← GSD-контур (PROJECT, REQUIREMENTS, ROADMAP, STATE, research, config)
```

### Где что искать

| Что нужно | Куда смотреть |
|---|---|
| Зачем делаем проект, бизнес-логика | [../.business/INDEX.md](../.business/INDEX.md) |
| Пользователь, боли, возражения, путь | [../.business/audience/](../.business/audience/) |
| Услуги, цены, флагманский продукт | [../.business/products/](../.business/products/) |
| Цели и KPI | [../.business/goals/](../.business/goals/) |
| Экономика (юнит, выручка, прогноз) | [../.business/economics/](../.business/economics/) |
| Каналы, воронка, конкуренты, контент | [../.business/marketing/](../.business/marketing/) |
| Брендинг: лого, цвета, шрифты, отзывы | [../.business/assets/](../.business/assets/) |
| Технические планы | [../plans/](../plans/) |

### Под задачу конкретной страницы — точечно

| Задача | Какие файлы читать |
|---|---|
| Главная | [values.md](../.business/company/values.md) + [avatar.md](../.business/audience/avatar.md) + [content.md](../.business/marketing/content.md) |
| О нас | [about.md](../.business/company/about.md) + [team.md](../.business/company/team.md) + [values.md](../.business/company/values.md) |
| Услуги (витрина и подстраницы) | [overview.md](../.business/products/overview.md) + [product-1.md](../.business/products/product-1.md) |
| Цены / «сколько стоит» | [pricing.md](../.business/products/pricing.md) + [unit-economics.md](../.business/economics/unit-economics.md) |
| Портфолио / кейсы | [overview.md](../.business/products/overview.md) + [segments.md](../.business/audience/segments.md) + [testimonials.md](../.business/assets/testimonials.md) |
| Отработка возражений в текстах | [objections.md](../.business/audience/objections.md) |
| Контакты | [about.md](../.business/company/about.md) |
| Цели / что делать в Q2 | [quarterly.md](../.business/goals/quarterly.md) + [monthly.md](../.business/goals/monthly.md) |
| Конкуренты | [competitors.md](../.business/marketing/competitors.md) |

## Ключевые принципы проекта

1. **Бизнес-контекст — источник правды.** Любой текст, факт, цифра — из `.business/`. Если чего-то нет — спрашиваем Марию, не придумываем. Читаем точечно по таблицам выше, не грузим всё сразу.
2. **Главный месседж — «надёжный партнёр под ключ в Калининграде».** Не «самые креативные» и не «самые дешёвые». Креатив и цена — вторичны после надёжности, локальной экспертизы и прозрачной 10%-модели.
3. **Приоритет — сегмент C (иногородние и федеральные клиенты).** Сайт в первую очередь ловит тех, кто ищет ивент-агентство в Калининграде через Яндекс/Google. Для сарафанных клиентов сайт — «визитка для проверки», для иногородних — главный путь к контакту.

## Стек

**Целевой стек (строим):** Astro 6 + Tailwind v4 + MDX + Content Collections, деплой Netlify Free из GitHub-репозитория. Все правки — в Markdown/MDX в этой папке → `git push` → автодеплой. Кабинет Tilda больше не трогаем.

**Текущее состояние (до релиза ≤ 15 мая 2026):** сайт крылья.life пока живёт на Tilda Personal, **не проиндексирован**, SEO не было. Tilda отключается на шаге Phase 7 роадмапа (DNS-переезд через nic.ru).

**Домен:** крылья.life (Punycode `xn--j1aco8bgs.life` — только в техническом слое: TLS CN, robots.txt Host/Sitemap, SMTP). Canonical, sitemap и внутренние ссылки — в кириллице (Яндекс так корректно отображает URL в сниппетах).

**Брендинг:** монохром + жёлтый акцент `#FFF200`. Шрифты — **Jost** (OFL, бесплатный, геометрически близок к FuturaPT) + **Demetriss** только в SVG-логотипе как путь кривых (веб-шрифт не подключаем). Исходники айдентики — в `~/Documents/Крылья. Общее./Айдентика/`, описание — в [../.business/assets/brand-guidelines.md](../.business/assets/brand-guidelines.md).

**Юрреквизиты для футера:** ИП Вострикова Мария Валерьевна, ИНН 550209075500, ОГРНИП 324390000038348. Telegram заявок — @mashavostrik. Подробно — в [../.business/company/legal.md](../.business/company/legal.md).

## Папка `.business/`

Скрытая папка с бизнес-контекстом. Здесь живёт информация **зачем** мы делаем проект.

## Папка `plans/`

Технические планы реализации. Здесь живёт информация **как** мы делаем проект. Один план = одна функция.

## Папка `собственные-проекты/`

Проработка и сбор идей **собственных мероприятий** агентства (не для клиентов, а свои — для узнаваемости, лояльности города и брендов, привлечения клиентов). Входная точка — [собственные-проекты/README.md](собственные-проекты/README.md). Внутри: `АНАЛИЗ.md` (рынок/город/конкуренты/тренды), `ИДЕИ.md` (портфель форматов), `ПЛАН-СТАРТА.md` (первые 90 дней).

## Папка `.planning/` — GSD workflow

С 23 апреля 2026 проект живёт на GSD-workflow. Входная точка для Claude в любой сессии:

- [.planning/PROJECT.md](.planning/PROJECT.md) — контекст проекта, Core Value, Key Decisions, ограничения
- [.planning/REQUIREMENTS.md](.planning/REQUIREMENTS.md) — 65 v1-требований с REQ-ID и traceability по фазам
- [.planning/ROADMAP.md](.planning/ROADMAP.md) — 9 фаз, дедлайны, success criteria
- [.planning/STATE.md](.planning/STATE.md) — текущее состояние проекта (какая фаза активна)
- [.planning/research/](.planning/research/) — STACK, FEATURES, ARCHITECTURE, PITFALLS, SUMMARY (зафиксированная фактура)
- [.planning/config.json](.planning/config.json) — настройки workflow (YOLO, standard, parallel)

**Как работать:**
1. Перед задачей — прочитать `STATE.md` (какая фаза активна), `PROJECT.md` (контекст), `ROADMAP.md` (цели фазы)
2. Работа идёт через GSD-команды: `/gsd-discuss-phase <N>`, `/gsd-plan-phase <N>`, `/gsd-execute-phase <N>`, `/gsd-progress`, `/gsd-next`
3. По окончании фазы — `/gsd-transition`, который обновляет PROJECT.md и STATE.md
4. Требования из `REQUIREMENTS.md` не меняем без явного согласования — это контракт скоупа

## Как работать с проектом

- Перед любой задачей — прочитай этот файл, затем нужные документы из `.business/` и `plans/`.
- Если меняется бизнес-логика — обнови `.business/INDEX.md` и нужные файлы.
- Если меняется технический план — обнови соответствующий план в `plans/`.
- Если появляется новая важная папка или документ — обнови этот `CLAUDE.md`.

## ВАЖНО: план для каждой новой функции

Любая функция, которую мы создаём в любом чате, всегда оформляется планом в папке `plans/`.

Правила:

1. Один план = одна функция. Если план уже есть — работаем с ним.
2. Имя файла: `YYYY-MM-DD-название-функции.md`.
3. План делится на фазы. У каждой фазы статус `[ ]` или `[x]`.
4. В конце плана — итоговый блок: реализован целиком или нет, что осталось.
5. Любой агент обязан актуализировать план после каждой сессии.

## ВАЖНО: завершение каждого чата

В конце каждой сессии записывай рефлексию в файл `.business/история/YYYY-MM-DD-краткое-название.md` (создавай папку при необходимости).

Формат:

1. Какая задача была поставлена.
2. Как я её решал.
3. Решил ли — да / нет / частично.
4. Эффективно ли решение, что можно было лучше.
5. Как было и как стало.

## Язык

Всегда отвечай мне на русском.
