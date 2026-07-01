# HOSTING — VPS Beget (общий с tishina.shop)

**Дата аудита:** 2026-05-07 09:32 EET
**Кто снимал:** Claude по SSH (read-only)
**Подключение:** `ssh root@tishina.shop` (по IP-адресу 217.12.37.59 порт 22 закрыт)

## Сводка одной фразой

VPS на CentOS Stream 9 с **BitrixVM-окружением** (nginx 1.26 спереди, Apache 2.4 + mod_php 8.1 сзади, MySQL Percona). На сервере крутится магазин `tishina.shop` со всеми поддоменами через единый Bitrix CMS. **Большая часть конфигов сетевого стека управляется скриптами Bitrix Environment — править руками опасно, перезатрут при обновлении.**

## Железо и ОС

| Параметр | Значение |
|---|---|
| Hostname | `dhnqtsxuyv.local` (внутренний, домены резолвятся через DNS) |
| ОС | CentOS Stream 9 (kernel 5.14.0-605.el9.x86_64) |
| CPU | 4 ядра |
| RAM | 3.6 ГБ (использовано 2.1 ГБ, свободно 1.5 ГБ с buff/cache) |
| Swap | **0** — настораживает, но трогать не будем |
| Диск | `/dev/vda1` 79 ГБ, использовано **52 ГБ (66%)**, свободно 28 ГБ |
| Uptime | 15 часов на момент аудита (был ребут вчера) |

**Замечание:** диск занят на 2/3. Для нашего сайта (~50 МБ статики) места достаточно, но мониторить надо.

## Веб-серверы и порты

| Порт | Сервис | Доступ | Назначение |
|---|---|---|---|
| 22 | sshd | публичный | SSH; password-auth включён (но `PermitRootLogin yes`, `PasswordAuthentication no` в main-конфиге — значит включено через override в `/etc/ssh/sshd_config.d/`) |
| 80 | nginx | публичный | HTTP — все сайты Bitrix |
| 443 | nginx | публичный | HTTPS — все сайты Bitrix |
| 8070 | nginx (ssl) | публичный | BitrixVM-меню? |
| 8893 | nginx | публичный | BitrixVM admin |
| 8894 | nginx (ssl) | публичный | BitrixVM admin |
| 8895 | nginx | localhost | BitrixVM internal |
| 8888 | Apache | localhost | бэкенд для PHP, проксируется из nginx |
| 3306, 33060 | MySQL (Percona) | публичный | Bitrix DB |
| 111 | rpcbind | публичный | системный |

**Все nginx-vhosts настроены с `server_name _`** (catch-all). Это паттерн BitrixVM. Когда мы добавим vhost с explicit `server_name крылья.life`, nginx даст приоритет ему — соседи не пострадают.

## Firewall

`firewalld`, активен.

- **Зона `public`:** разрешены `dhcpv6-client http https ssh`, плюс порты `80, 443, 8890, 8891, 8893, 8894`
- **Зона `bx_trusted`:** только IP сервера сам на себя (внутренний трафик BitrixVM)
- **fail2ban активен** — блокирует SSH-перебор через iptables (видно правило `f2b-sshd` в `INPUT`)

**Для нашего сайта firewall трогать не нужно** — порты 80/443 уже открыты.

## Apache (бэкенд)

- Конфиги в `/etc/httpd/conf.d/` и `/etc/httpd/bx/conf/` (BitrixVM-специфичные)
- Слушает только `127.0.0.1:8888` — публично недоступен напрямую
- Единственный VirtualHost: `localhost` с DocumentRoot `/home/bitrix/www`
- Запускается под пользователем `bitrix` (uid 600, не `apache`/`www-data` — Bitrix-специфика)

**Не трогаем.** Наш сайт пойдёт в обход Apache — статика напрямую через nginx.

## Nginx (фронт)

- Конфиги в `/etc/nginx/conf.d/` (там только `default.conf` и `example_ssl.conf` — пустые шаблоны)
- Активные конфиги BitrixVM: где-то в `/etc/nginx/bx/` (нужно посмотреть в Фазе 2 при настройке)
- Все vhosts catch-all (`server_name _`)

**Наша стратегия:** создаём отдельный файл `/etc/nginx/conf.d/krylya-life.conf` с explicit `server_name крылья.life xn--j1aco8bgs.life www.крылья.life www.xn--j1aco8bgs.life`. nginx предпочтёт explicit совпадение catch-all'у. Соседи Bitrix продолжат работать как сейчас.

## Runtimes

| Что | Версия | Путь | Для нас |
|---|---|---|---|
| Node.js | **v16.20.2** (EOL!) | /usr/bin/node | Не используем — устарел |
| PHP | 8.1.33 | /usr/bin/php | **Используем для бэкенда формы заявок** — ничего ставить не нужно |
| Python | 3.9.23 | /usr/bin/python3 | Не нужен |

**Решение по форме:** переписываем Netlify Function с TypeScript на маленький PHP-скрипт. Никаких новых зависимостей, никаких systemd-сервисов, проще в поддержке. PHP уже шевелится в системе.

## SSL — dehydrated

Установлен в `/home/bitrix/dehydrated/`:
- Скрипт `dehydrated` (94 КБ)
- Конфиг `config`, hook-скрипт `hook.sh` (для перезагрузки nginx после получения сертификата)
- Список доменов в `domains.txt` — на момент аудита там одна строка: `tishina.shop`
- Сертификаты в `certs/`
- Запускается под пользователем `bitrix`

**Наша стратегия:** добавить наши 4 имени (`крылья.life xn--j1aco8bgs.life www.крылья.life www.xn--j1aco8bgs.life`) в `domains.txt` отдельной строкой → запустить `dehydrated -c` под `bitrix` → получить сертификат → подключить в нашем nginx-vhost. Никаких параллельных certbot.

## Пользователи

Кроме системных — только `root` и `bitrix` (uid 600, shell `/bin/bash`).

**Что планируем:** создать `deploy-krylya` (uid в 1000-х, shell `/bin/bash` или `/usr/sbin/nologin` если деплой через rsync) с home `/home/deploy-krylya/`. Дать ему write только в директорию нашего сайта. SSH-ключ для GitHub Actions положить в `~/.ssh/authorized_keys` этого пользователя.

## Cron

- В `/etc/cron.d/`: `0hourly`, `bx_network_updater` (системные)
- В crontab root: 6 PHP-задач Bitrix (trust-rating, метрика, отзывы, email/direct stats, бонусные рассылки)
- **Dehydrated cron не виден через `crontab -l | grep dehydrated`** — возможно, лежит как `/etc/cron.d/dehydrated` или в крон-задачах пользователя `bitrix`. Проверить в Фазе 2

## Ключевые риски и правила

### Что трогать НЕЛЬЗЯ

1. `/etc/nginx/bx/` — управляется BitrixVM-обновлениями
2. `/etc/httpd/bx/` — то же
3. Любые файлы в `/home/bitrix/www/` — это код магазина
4. Конфиг fail2ban
5. Глобальные настройки firewalld — порты 80/443 уже открыты, нам этого хватит
6. Конфиг MySQL/Percona
7. Скрипты в `/home/bitrix/dehydrated/` — можем только дописать строку в `domains.txt`

### Где наша территория

1. `/etc/nginx/conf.d/krylya-life.conf` — наш единственный nginx-конфиг
2. `/home/bitrix/dehydrated/domains.txt` — добавим наши 4 имени отдельной строкой
3. `/home/krylya-life/` или `/var/www/krylya-life/` — корень нашего сайта (выберем в Фазе 2)
4. `/home/deploy-krylya/` — пользователь для GitHub Actions
5. PHP-скрипт формы — в директории нашего сайта
6. Возможно отдельный `/etc/cron.d/krylya-*` если потребуется

## Где живут пароли и доступы

`~/claude/.business/.env` (gitignored через `~/claude/.gitignore`).

**ВАЖНО:** все стартовые пароли будут ротированы в Фазе 9.5 после стабилизации сайта.

## Что делать в случае проблем

(заполнится после Фазы 9 — пока сайт не запущен)

---

*Документ создан после аудита 2026-05-07. Обновлять при изменениях инфраструктуры.*
