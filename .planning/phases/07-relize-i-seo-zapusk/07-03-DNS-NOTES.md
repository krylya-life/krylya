# Phase 7 — DNS Switch Notes

## Cloudflare nameservers (для смены на nic.ru)

- `bethany.ns.cloudflare.com`
- `cleo.ns.cloudflare.com`

## Зона в Cloudflare

- **Имя:** крылья.life (Punycode `xn--j1aco8bgs.life`)
- **План:** Free
- **Добавлена в Cloudflare:** 2026-05-28
- **Статус:** Pending Nameserver Update (до смены NS на nic.ru)

## Текущие DNS-записи в Cloudflare-зоне (импортированы сканом)

- A `www.крылья.life` → 176.57.64.107 (Tilda) — Proxied
- A `крылья.life` → 176.57.64.107 (Tilda) — Proxied

Эти Tilda-записи останутся, пока Pages не свяжет домен с проектом `krylya`.
После активации зоны (когда NS уйдут под Cloudflare) — вернёмся в Pages →
Custom domains → подключим оба домена (`крылья.life` и `xn--j1aco8bgs.life`),
Pages автоматически перепишет A-записи на правильные CNAME/anycast.

## TODO (после смены NS на nic.ru)

1. Дождаться, пока зона `крылья.life` в Cloudflare получит статус «Active»
2. Cloudflare Pages → krylya → Custom domains:
   - Add `крылья.life` (заменит Tilda A на правильные)
   - Add `xn--j1aco8bgs.life` (SAN-сертификат на обе формы)
3. Дождаться выпуска Universal SSL для обеих форм (~5–15 мин)
4. Curl-проверки `https://крылья.life` и `https://xn--j1aco8bgs.life`
5. Снять `noindex` с 10 публичных страниц
