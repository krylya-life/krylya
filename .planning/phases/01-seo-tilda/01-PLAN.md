---
phase: 1
phase_name: Инфраструктура и SEO-аудит Tilda
wave: 1
depends_on: []
files_modified:
  - .gitignore
  - .env.example
  - README.md
  - package.json
  - astro.config.mjs
  - src/pages/index.astro
  - .planning/phases/01-seo-tilda/01-URL-MAP.md
requirements: [INFRA-01, INFRA-02, INFRA-05, MIGR-01, MIGR-02]
autonomous: false
status: ready
---

# Phase 1 — Plan: Инфраструктура и SEO-аудит Tilda

> **Этот план — пошаговый ход работы.** Часть шагов делает Мария руками (нельзя автоматизировать создание аккаунтов и личных токенов), часть делает Claude автоматически. Каждый шаг помечен: 👤 — Мария, 🤖 — Claude.

## Цель фазы

Завести бесплатную инфраструктуру для разработки сайта (GitHub, Netlify, Telegram-бот) и зафиксировать все публичные URL текущей Tilda для будущих 301-редиректов. После этой фазы push любого изменения в `main` будет автоматически собирать сайт и показывать на временном Netlify preview-URL.

## Must-haves (что должно быть TRUE по итогу)

1. Push в `main` GitHub-репозитория автоматически собирает Astro 6 scaffold и публикует на Netlify preview-URL — Мария видит «Hello, Astro» (или подобное) по этому URL
2. В Netlify Environment Variables лежат две переменные: `TELEGRAM_BOT_TOKEN` (значение получено от @BotFather) и `TELEGRAM_CHAT_ID=129375931`. В git-репозитории токенов НЕТ
3. Файл `.planning/phases/01-seo-tilda/01-URL-MAP.md` содержит таблицу всех публичных URL Tilda-сайта со ссылками-аналогами в новой структуре (по `sitemap.md`)
4. У Марии работает синхронизация: она видит изменения локально → push → preview обновляется

---

## Wave 1 — Аккаунты и доступы (👤 Мария)

> Эти 4 шага должна сделать Мария — нужны её email и руки. Я веду пошагово в чате, отвечаю на вопросы. Шаги делаются последовательно, можно с паузами.

### Task 1.1 — GitHub-аккаунт
**Кто делает:** 👤 Мария (с моим сопровождением в чате)
**Зачем:** GitHub — место, где будет жить код сайта. Бесплатно, навсегда.

**Что нужно сделать:**
1. Открыть https://github.com/signup
2. Зарегистрироваться на её основной email
3. Username — простое, например `mariiavostrikova` или `krylya-life`. Запомнить
4. Прислать мне в чат username

**Готово, когда:** Я могу открыть `https://github.com/<username>` и увидеть пустой профиль.

### Task 1.2 — Netlify-аккаунт
**Кто делает:** 👤 Мария (с моим сопровождением)
**Зачем:** Netlify — бесплатный хостинг сайта.

**Что нужно сделать:**
1. Открыть https://app.netlify.com/signup
2. Нажать «Sign up with GitHub» (НЕ email — иначе придётся настраивать связь между GitHub и Netlify отдельно)
3. Подтвердить разрешения GitHub → Netlify

**Готово, когда:** Мария залогинена в Netlify и видит пустой dashboard.

### Task 1.3 — Telegram-бот
**Кто делает:** 👤 Мария (с моим сопровождением)
**Зачем:** Этот бот будет присылать тебе заявки с формы.

**Что нужно сделать:**
1. В Telegram открыть бота `@BotFather`, нажать Start
2. Команда `/newbot`
3. Имя (читаемое): `Крылья — заявки с сайта`
4. Username (техническое, должно заканчиваться на `bot`): например `krylya_zayavki_bot` (если занято — попробовать другое)
5. BotFather присылает токен вида `1234567890:AAA-bbb-CCC...` — этот токен **никому не показывать, нигде не публиковать**. Прислать мне в этот чат — это безопасно (приватная сессия Claude)

**Готово, когда:** У меня есть токен в чате (или ты сохранила его в надёжное место).

### Task 1.4 — Положить токены в Netlify
**Кто делает:** 👤 Мария (с моим сопровождением)
**Зачем:** Чтобы будущая форма знала, какому боту слать сообщения и кому.

**Когда выполнять:** ПОСЛЕ задачи 2.2 (когда сайт уже привязан к Netlify).

**Что нужно сделать:**
1. В Netlify dashboard открыть проект сайта
2. Site settings → Environment variables → Add a variable
3. Добавить две переменные:
   - Key: `TELEGRAM_BOT_TOKEN` — Value: токен из шага 1.3
   - Key: `TELEGRAM_CHAT_ID` — Value: `129375931`
4. Save

**Готово, когда:** Обе переменные видны в списке (значение скрыто звёздочками — это нормально).

---

## Wave 2 — Технический скаффолд (🤖 Claude)

> Я делаю эти шаги автоматически после того, как Мария завершит задачу 1.1 (GitHub username) и 1.2 (Netlify-аккаунт).

### Task 2.1 — Astro 6 scaffold локально
**Кто делает:** 🤖 Claude
**Зачем:** Минимальный «hello world» проект, чтобы Netlify было что собирать.

<read_first>
- `.planning/PROJECT.md` — стек: Astro 6, Tailwind v4 (Tailwind пока НЕ ставим, это Phase 2)
- `.planning/research/STACK.md` — детали Astro-конфигурации
</read_first>

<action>
Внутри `~/claude/krylya/`:

```bash
npm create astro@latest . -- --template minimal --typescript strict --install --no-git
```

После завершения:
1. Создать `.gitignore` со стандартным набором: `node_modules/`, `dist/`, `.env`, `.env.local`, `.netlify/`, `.DS_Store`
2. Создать `.env.example` с двумя ключами без значений: `TELEGRAM_BOT_TOKEN=`, `TELEGRAM_CHAT_ID=`
3. Создать минимальный `README.md` (название проекта, как локально запустить, как деплоится)
4. Проверить, что `npm run build` работает локально (выходит `dist/`)
5. Проверить, что `npm run dev` поднимает сервер на localhost:4321
</action>

<acceptance_criteria>
- Файл `package.json` существует, в `scripts` есть `dev` и `build`
- Файл `astro.config.mjs` существует
- Файл `.gitignore` содержит строки `node_modules` и `.env`
- Файл `.env.example` содержит `TELEGRAM_BOT_TOKEN=` и `TELEGRAM_CHAT_ID=`
- Команда `npm run build` завершается с кодом 0 и создаёт папку `dist/`
- Папки `.business/` и `.planning/` НЕ перетёрты Astro-скаффолдом (Astro не должен трогать ничего за пределами своего)
</acceptance_criteria>

### Task 2.2 — Связка GitHub + Netlify, первый деплой
**Кто делает:** 🤖 Claude (но Мария проверяет в Netlify)
**Зачем:** Push в `main` → автоматический деплой preview-URL.

<read_first>
- Локальный `package.json` (после Task 2.1) — Netlify должен подхватить build command автоматически
</read_first>

<action>
1. Я создаю репозиторий на GitHub через `gh repo create krylya --public --source=. --remote=origin --description="Сайт ивент-агентства Крылья"` (после того как Мария установит gh CLI или авторизует через web)
   - Альтернатива: Мария руками создаёт пустой репо на github.com/new, я делаю `git remote add origin ...`
2. Делаю initial-коммит со всем текущим содержимым (planning/, business/ через .gitignore-исключения, контент-драфты, скаффолд) и `git push -u origin main`
3. Мария в Netlify нажимает «Add new site → Import from Git → GitHub → выбирает свой репо `krylya`»
4. Netlify предлагает Build command (`npm run build`) и Publish directory (`dist`) — она нажимает «Deploy»
5. Через ~1-2 минуты Netlify показывает зелёный статус и preview-URL вида `https://random-name-12345.netlify.app`

**Важно:** `.business/` и `.planning/` коммитятся в репозиторий (нам нужна вся история планирования). Если хочется их скрыть — можно положить в отдельный private репо позже, но в v1 проще оставить публично, ничего критичного там нет.
</action>

<acceptance_criteria>
- Репозиторий `<username>/krylya` существует и публично доступен на GitHub
- Локальный git remote `origin` указывает на этот репозиторий
- В Netlify создан сайт, статус последнего деплоя — `Published`
- Preview-URL открывается и показывает страницу Astro-скаффолда (заголовок «Astro» или подобное)
- Push в `main` (тестовое изменение в README.md, например) триггерит новый деплой автоматически — это видно в Netlify dashboard
</acceptance_criteria>

---

## Wave 3 — SEO-аудит Tilda (🤖 Claude)

> Можно делать параллельно с Wave 1 — не зависит от GitHub/Netlify.

### Task 3.1 — Собрать список публичных URL Tilda
**Кто делает:** 🤖 Claude
**Зачем:** Чтобы в Phase 7 настроить 301-редиректы со старых ссылок на новые.

<read_first>
- `sitemap.md` — целевая структура нового сайта (18–23 страницы)
- Живой сайт `https://крылья.life/` — текущий Tilda
</read_first>

<action>
1. WebFetch главной `https://крылья.life/` с инструкцией извлечь ВСЕ внутренние ссылки (`<a href>` на тот же домен)
2. Для каждой найденной ссылки — WebFetch и извлечение её H1, title, и опять внутренних ссылок (depth-2)
3. Для каждой Tilda-страницы зафиксировать: URL, H1, title, краткое описание (1 предложение что на странице)
4. Также проверить, есть ли у Tilda-сайта `https://крылья.life/sitemap.xml` или `/robots.txt` — оттуда тоже подсосать URL

Если Tilda-сайт окажется одностраничным (всё в якорях `#about`, `#services` на одном `/`) — это ОК. Тогда таблица 301-редиректов будет короткой.
</action>

<acceptance_criteria>
- В файле `.planning/phases/01-seo-tilda/01-URL-AUDIT.md` записан список всех найденных URL Tilda с метаданными (H1, title, описание)
- Указано, использован ли `sitemap.xml` или анализ ссылок (или оба)
- Зафиксировано общее количество страниц
</acceptance_criteria>

### Task 3.2 — Составить таблицу 301-редиректов
**Кто делает:** 🤖 Claude (с уточнениями у Марии в спорных случаях)

<read_first>
- `.planning/phases/01-seo-tilda/01-URL-AUDIT.md` (создан в Task 3.1)
- `sitemap.md` — целевая структура нового сайта
</read_first>

<action>
Для каждого Tilda-URL подобрать новый Astro-URL по принципу:
- Если есть прямой смысловой аналог — мапим (например, Tilda `/about` → Astro `/about/`)
- Если на Tilda был блок «услуги» одним списком, а в новом структуре 6 подстраниц — мапим на витрину `/services/`
- Если страница Tilda-уникальная и в sitemap.md аналога нет — мапим на тематически ближайшую (НЕ на главную)
- Каждой строке проставить приоритет: `high` (страницы из топ-10 Tilda по входящим ссылкам), `med` (обычные страницы), `low` (служебные/тестовые)

Записать в `.planning/phases/01-seo-tilda/01-URL-MAP.md` в формате:

```markdown
| Old Tilda URL | New Astro URL | Priority | Notes |
|---|---|---|---|
| https://крылья.life/ | / | high | главная |
| ... | ... | ... | ... |
```

Если в Tilda какой-то URL спорный (не ясно, куда мапить) — отметить TODO Мария и спросить в чате.
</action>

<acceptance_criteria>
- Файл `.planning/phases/01-seo-tilda/01-URL-MAP.md` существует
- Каждый URL из 01-URL-AUDIT.md имеет соответствующую строку в таблице
- Указан priority для каждой строки
- Спорные случаи помечены TODO для Марии
</acceptance_criteria>

---

## Verification (как поймём, что фаза закрыта)

1. ✅ Открыть Netlify preview-URL → видим Astro «hello world»
2. ✅ Сделать тестовое изменение в `README.md` → push → дождаться нового деплоя → URL обновился
3. ✅ В Netlify Site settings → Environment variables → видим `TELEGRAM_BOT_TOKEN` и `TELEGRAM_CHAT_ID`
4. ✅ В репозитории НЕТ файла `.env` или другого с токенами (`git ls-files | grep -i 'env\|token\|secret'` ничего не возвращает)
5. ✅ `.planning/phases/01-seo-tilda/01-URL-MAP.md` существует и содержит таблицу всех Tilda-URL → Astro-URL

---

## Что в этой фазе НЕ делаем (важно)

- НЕ ставим Tailwind CSS, MDX, Content Collections — это Phase 2
- НЕ подключаем домен крылья.life — это Phase 7
- НЕ создаём `_redirects` файл (только таблицу-источник) — это Phase 7
- НЕ делаем дизайн, типографику, страницы — это Phase 2-6
- НЕ настраиваем Netlify Forms / Functions — это Phase 3 (vertical slice главной)
