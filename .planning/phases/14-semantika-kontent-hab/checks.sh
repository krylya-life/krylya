#!/usr/bin/env bash
#
# checks.sh — регресс-проверки раздела /идеи/ (Phase 14, HUB-03).
#
# Запускать ПОСЛЕ `npm run build` из корня репозитория krylya/:
#   npm run build && bash .planning/phases/14-semantika-kontent-hab/checks.sh
#
# Проверяет IDN/Punycode-корректность (canonical, sitemap, RSS),
# наличие JSON-LD BlogPosting + BreadcrumbList, синхронность sitemap
# с числом опубликованных статей. Ненулевой exit при любом провале.

set -uo pipefail

DIST="dist"
FAIL=0

pass() { echo "  ✓ $1"; }
fail() { echo "  ✗ $1"; FAIL=1; }

echo "== Проверки раздела /идеи/ =="

# 0. dist существует
if [ ! -d "$DIST" ]; then
  echo "dist/ не найден — сначала запустите: npm run build"
  exit 1
fi

# 1. RSS: не больше 1 совпадения xn-- (только канальный <link>, известное ограничение)
if [ -f "$DIST/rss.xml" ]; then
  RSS_XN=$(grep -c "xn--" "$DIST/rss.xml" || true)
  if [ "$RSS_XN" -le 1 ]; then
    pass "rss.xml: xn-- = $RSS_XN (≤1, только канальный link)"
  else
    fail "rss.xml: xn-- = $RSS_XN (ожидалось ≤1 — обход item.link не сработал)"
  fi
  # ссылка статьи в кириллице
  if grep -q "идеи/korporativ-iz-drugogo-goroda" "$DIST/rss.xml"; then
    pass "rss.xml: ссылка статьи в кириллице"
  else
    fail "rss.xml: кириллическая ссылка статьи не найдена"
  fi
else
  fail "rss.xml не найден"
fi

# 2. Canonical статей: 0 совпадений xn--
CANON_XN=0
for f in "$DIST"/идеи/*/index.html; do
  [ -f "$f" ] || continue
  N=$(grep -o 'rel="canonical" href="[^"]*"' "$f" | grep -c "xn--" || true)
  CANON_XN=$((CANON_XN + N))
done
if [ "$CANON_XN" -eq 0 ]; then
  pass "canonical статей: xn-- = 0 (кириллица)"
else
  fail "canonical статей: xn-- = $CANON_XN (ожидался 0)"
fi

# 3. Sitemap: 0 совпадений xn--
if [ -f "$DIST/sitemap.xml" ]; then
  SM_XN=$(grep -c "xn--" "$DIST/sitemap.xml" || true)
  if [ "$SM_XN" -eq 0 ]; then
    pass "sitemap.xml: xn-- = 0"
  else
    fail "sitemap.xml: xn-- = $SM_XN (ожидался 0)"
  fi
else
  fail "sitemap.xml не найден"
fi

# 4. Число статей /идеи/<slug>/ в sitemap == число не-draft статей на диске
#    (в dist статьи лежат как dist/идеи/<slug>/index.html, кроме index.html витрины)
ART_ON_DISK=0
for d in "$DIST"/идеи/*/; do
  [ -d "$d" ] || continue
  ART_ON_DISK=$((ART_ON_DISK + 1))
done
SM_ARTICLES=$(grep -o '/идеи/[^/<]*/</loc>' "$DIST/sitemap.xml" | grep -vc '/идеи/</loc>' || true)
if [ "$SM_ARTICLES" -eq "$ART_ON_DISK" ]; then
  pass "sitemap: статей /идеи/<slug>/ = $SM_ARTICLES == на диске $ART_ON_DISK"
else
  fail "sitemap: статей в sitemap $SM_ARTICLES != на диске $ART_ON_DISK"
fi

# 5. Каждая статья содержит JSON-LD BlogPosting и BreadcrumbList
for f in "$DIST"/идеи/*/index.html; do
  [ -f "$f" ] || continue
  if grep -q '"@type":"BlogPosting"' "$f" && grep -q "BreadcrumbList" "$f"; then
    pass "$(basename "$(dirname "$f")"): BlogPosting + BreadcrumbList"
  else
    fail "$(basename "$(dirname "$f")"): нет BlogPosting или BreadcrumbList"
  fi
done

echo "=========================="
if [ "$FAIL" -eq 0 ]; then
  echo "ВСЕ ПРОВЕРКИ ПРОЙДЕНЫ ✓"
  exit 0
else
  echo "ЕСТЬ ПРОВАЛЫ ✗"
  exit 1
fi
