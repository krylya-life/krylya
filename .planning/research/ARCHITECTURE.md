# Architecture Research — крылья.life (Astro content site)

**Domain:** Content-heavy SEO landing site (18-23+ pages) for regional service business
**Researched:** 2026-04-22
**Confidence:** HIGH (verified stack patterns against current Astro 5 docs and ecosystem)

---

## 1. System Overview

```
┌─────────────────────────────────────────────────────────────────────┐
│                         BUILD TIME (Astro)                           │
├─────────────────────────────────────────────────────────────────────┤
│  ┌─────────────────┐   ┌──────────────────┐   ┌──────────────────┐  │
│  │  Content Layer  │   │  Page Templates  │   │   Components     │  │
│  │  (Collections)  │──▶│   (src/pages)    │──▶│  (src/components)│  │
│  │  Markdown/MDX   │   │   Layouts + SEO  │   │  Hero, Case,...  │  │
│  └─────────────────┘   └──────────────────┘   └──────────────────┘  │
│          │                      │                       │            │
│          ▼                      ▼                       ▼            │
│  ┌─────────────────────────────────────────────────────────────┐    │
│  │              Static HTML + CSS + optimized images            │    │
│  └─────────────────────────────────────────────────────────────┘    │
├─────────────────────────────────────────────────────────────────────┤
│                       DEPLOY (Vercel Free)                           │
├─────────────────────────────────────────────────────────────────────┤
│  ┌────────────────────────┐      ┌──────────────────────────────┐   │
│  │  Static pages via CDN  │      │  Serverless function         │   │
│  │  (HTML/CSS/JS/images)  │      │  /api/lead — form intake     │   │
│  │  крылья.life           │      │  → Telegram Bot + email      │   │
│  └────────────────────────┘      └──────────────────────────────┘   │
├─────────────────────────────────────────────────────────────────────┤
│                       RUNTIME (visitor browser)                      │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────────────────┐   │
│  │  HTML render │  │  Form submit │  │  Yandex.Metrika          │   │
│  │  (zero JS)   │  │  (fetch POST)│  │  (deferred, after idle)  │   │
│  └──────────────┘  └──────────────┘  └──────────────────────────┘   │
└─────────────────────────────────────────────────────────────────────┘
```

### Component Responsibilities

| Component | Responsibility | Implementation |
|-----------|----------------|----------------|
| Content Collections | Typed source of truth for cases, services, testimonials, team | Markdown/MDX in `src/content/`, Zod schemas in `src/content/config.ts` |
| Page templates | Route → layout composition, fetch collection entries | `.astro` files under `src/pages/` (static file-based routing) |
| Layouts | Shared page chrome: `<head>`, SEO, header, footer | `src/layouts/BaseLayout.astro`, `ServiceLayout.astro`, `CaseLayout.astro` |
| SEO component | Title, meta, canonical, OG, JSON-LD graph | Single `src/components/seo/Seo.astro` — one prop per page |
| UI primitives | Reusable building blocks (Hero, Card, CTA, etc.) | `.astro` components, Tailwind classes, zero runtime JS |
| Interactive islands | Form submit, mobile menu toggle | Minimal vanilla JS `<script>` or `client:idle` islands |
| Form handler | Accept lead, forward to Telegram + email | Vercel serverless function in `src/pages/api/lead.ts` |
| Analytics | Deferred Yandex.Metrika loader | Inlined script in BaseLayout, fires on `requestIdleCallback` |

---

## 2. Recommended Project Structure

```
krylya/
├── astro.config.mjs              # site URL, integrations, image config
├── tsconfig.json
├── package.json
├── public/                       # static passthrough (robots.txt, favicons)
│   ├── favicon.svg
│   ├── robots.txt
│   └── humans.txt
├── src/
│   ├── content/                  # Content Collections (source of truth)
│   │   ├── config.ts             # Zod schemas for all collections
│   │   ├── services/             # 6 service subpages as MDX
│   │   │   ├── corporate-parties.mdx
│   │   │   ├── business-events.mdx
│   │   │   ├── client-events.mdx
│   │   │   ├── teambuilding.mdx
│   │   │   ├── coordination.mdx
│   │   │   └── private.mdx
│   │   ├── cases/                # Portfolio cases as MDX
│   │   │   ├── bystrinskoe-2023.mdx
│   │   │   ├── vklyuchi-partners.mdx
│   │   │   └── ... (5-10 files)
│   │   ├── testimonials/         # Customer quotes
│   │   │   └── *.md (one per quote, frontmatter-only)
│   │   └── team/                 # Team member bios
│   │       └── *.md
│   ├── layouts/
│   │   ├── BaseLayout.astro      # <html>, <head>, Seo, Header, Footer, Metrika
│   │   ├── ServiceLayout.astro   # wraps BaseLayout, adds service-page chrome
│   │   └── CaseLayout.astro      # wraps BaseLayout, adds case-page chrome
│   ├── pages/                    # FILE-BASED ROUTING (URLs live here)
│   │   ├── index.astro           # /
│   │   ├── about/
│   │   │   ├── index.astro       # /about/
│   │   │   ├── team.astro        # /about/team/
│   │   │   └── values.astro      # /about/values/
│   │   ├── services/
│   │   │   ├── index.astro       # /services/ (hub, lists collection)
│   │   │   └── [slug].astro      # /services/<slug>/ (dynamic from collection)
│   │   ├── cases/
│   │   │   ├── index.astro       # /cases/
│   │   │   └── [slug].astro      # /cases/<slug>/
│   │   ├── contacts.astro        # /contacts/
│   │   ├── privacy.astro         # /privacy/ (legal stub)
│   │   └── api/
│   │       └── lead.ts           # POST /api/lead — form handler
│   ├── components/
│   │   ├── seo/
│   │   │   ├── Seo.astro               # meta tags + canonical + OG
│   │   │   ├── JsonLd.astro            # generic JSON-LD renderer
│   │   │   ├── LocalBusinessSchema.ts  # data builder (pure TS)
│   │   │   ├── OrganizationSchema.ts
│   │   │   └── BreadcrumbSchema.ts
│   │   ├── layout/
│   │   │   ├── Header.astro
│   │   │   ├── Footer.astro
│   │   │   ├── Breadcrumbs.astro
│   │   │   └── MobileMenu.astro
│   │   ├── blocks/                     # page-level composable blocks
│   │   │   ├── Hero.astro
│   │   │   ├── FeatureGrid.astro
│   │   │   ├── CaseCard.astro
│   │   │   ├── CasesPreviewGrid.astro
│   │   │   ├── TestimonialQuote.astro
│   │   │   ├── CTASection.astro
│   │   │   ├── ServicePillars.astro
│   │   │   ├── HowWeWorkSteps.astro
│   │   │   └── TrustMarkers.astro
│   │   ├── forms/
│   │   │   ├── ContactForm.astro       # static markup
│   │   │   └── contactFormClient.ts    # vanilla-JS submit handler
│   │   └── ui/                         # low-level primitives
│   │       ├── Button.astro
│   │       ├── Container.astro
│   │       ├── Section.astro
│   │       ├── Heading.astro
│   │       └── Icon.astro
│   ├── lib/                            # pure TS helpers (no JSX/Astro)
│   │   ├── slugify.ts                  # transliteration helper (ru → en)
│   │   ├── formatPhone.ts
│   │   └── schema-builders.ts
│   ├── config/                         # SITE-WIDE CONSTANTS (single source)
│   │   ├── site.ts                     # name, url, locale, defaultOg
│   │   ├── contacts.ts                 # phone, email, telegram, address
│   │   ├── nav.ts                      # main nav structure
│   │   └── business.ts                 # LocalBusiness data (geo, hours, legal)
│   ├── styles/
│   │   ├── global.css                  # Tailwind directives + base resets
│   │   └── tokens.css                  # brand CSS custom properties
│   └── assets/                         # images processed by Astro Image
│       ├── hero/
│       ├── cases/                      # per-case folders with originals
│       ├── team/
│       └── brand/                      # logos, icons
└── .planning/                          # (out of src/) planning artifacts
```

### Structure Rationale

- **`src/content/` vs `src/pages/`:** Collections hold **data** (service descriptions, case stories) that gets rendered by a single dynamic template. Pages hold **routes** and one-off compositions. This split avoids duplicating layout for every case.
- **`src/components/blocks/` vs `src/components/ui/`:** Blocks are page-level sections (Hero, CaseCard). UI primitives are atoms used by blocks (Button, Container, Heading). Two-level hierarchy is simpler than full atomic design and matches Astro's zero-runtime philosophy.
- **`src/config/`:** Single source of truth for values used on 5+ pages (phone, email, business name, nav). Changing the phone number = one file edit. Critical because Мария also embeds contacts in JSON-LD, email subjects, OG tags, header, footer.
- **`src/layouts/` separate from `src/components/`:** Astro convention — layouts wrap `<slot />` for full-page chrome, components are slotted in.
- **`src/lib/`:** Pure TS with no Astro/JSX — easier to unit-test, portable.
- **`public/` minimal:** only truly static files (robots.txt, favicon source). Everything else passes through Astro's image/asset pipeline for hashing and optimization.

---

## 3. Content Collections — Schema Design

Critical pattern for Astro 5: use the new **Content Loader API** with Zod schemas. All schemas live in `src/content/config.ts` (or `src/content.config.ts` in Astro 5).

### Services collection

```typescript
// src/content/config.ts
import { defineCollection, z, reference } from 'astro:content';
import { glob } from 'astro/loaders';

const services = defineCollection({
  loader: glob({ pattern: '**/*.mdx', base: './src/content/services' }),
  schema: ({ image }) => z.object({
    title: z.string(),                          // H1 for page
    seoTitle: z.string().max(60),               // <title> override
    description: z.string().max(160),           // meta description
    slug: z.string().regex(/^[a-z0-9-]+$/),     // URL slug (Latin)
    order: z.number(),                          // sort on hub page
    heroTagline: z.string(),
    heroImage: image(),
    heroImageAlt: z.string(),
    shortDescription: z.string(),               // used on services hub card
    icon: z.string(),                           // icon key for hub card
    bulletPoints: z.array(z.string()),          // "что входит" list
    typicalBudget: z.string().optional(),       // "от 500 тыс ₽"
    faqs: z.array(z.object({
      q: z.string(),
      a: z.string(),
    })).optional(),
    relatedCases: z.array(reference('cases')).optional(),
    draft: z.boolean().default(false),
  }),
});
```

### Cases collection

```typescript
const cases = defineCollection({
  loader: glob({ pattern: '**/*.mdx', base: './src/content/cases' }),
  schema: ({ image }) => z.object({
    title: z.string(),
    seoTitle: z.string().max(60),
    description: z.string().max(160),
    slug: z.string().regex(/^[a-z0-9-]+$/),
    publishDate: z.date(),
    eventDate: z.date(),                        // when the actual event happened
    client: z.string(),                         // "ГРК Быстринское" or "крупный девелопер"
    clientAnonymized: z.boolean().default(false),
    segment: z.enum([                           // for filtering on /cases/
      'corporate',
      'business',
      'client-events',
      'teambuilding',
      'coordination',
      'private',
    ]),
    relatedService: reference('services'),      // link back to service
    guests: z.number().optional(),
    budgetRange: z.string().optional(),         // "1.5-3 млн ₽" or null if NDA
    location: z.string(),                       // "Калининград", "Куршская коса"
    coverImage: image(),
    coverImageAlt: z.string(),
    coverImagePortrait: image().optional(),     // vertical crop for mobile
    gallery: z.array(z.object({
      src: image(),
      alt: z.string(),
      orientation: z.enum(['landscape', 'portrait', 'square']),
    })).optional(),
    results: z.array(z.string()),               // bullet points of outcomes
    testimonial: reference('testimonials').optional(),
    featured: z.boolean().default(false),       // show on homepage
    draft: z.boolean().default(false),
  }),
});
```

### Testimonials collection

```typescript
const testimonials = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/testimonials' }),
  schema: ({ image }) => z.object({
    quote: z.string(),
    authorName: z.string(),
    authorRole: z.string(),                     // "Директор по маркетингу"
    authorCompany: z.string(),
    authorPhoto: image().optional(),
    relatedCase: reference('cases').optional(),
    consentGiven: z.boolean(),                  // don't publish without
    date: z.date(),
  }),
});
```

### Team collection

```typescript
const team = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/team' }),
  schema: ({ image }) => z.object({
    name: z.string(),
    role: z.string(),
    order: z.number(),
    photo: image(),
    photoAlt: z.string(),
    bio: z.string(),                            // 2-3 sentences
    experience: z.string().optional(),          // "7+ лет в ивентах"
    specialties: z.array(z.string()).optional(),
  }),
});

export const collections = { services, cases, testimonials, team };
```

**Why Zod + references:**
- Type-safe page templates — compile error if you typo `case.cient` instead of `case.client`.
- `reference('cases')` lets a service page pull related cases without string-matching slugs.
- `draft: true` entries excluded from build on production.
- `image()` helper triggers Astro's image optimization pipeline automatically.

---

## 4. Layout Composition Patterns

Three-tier layout system keeps duplication low without over-abstracting.

### Tier 1: BaseLayout — universal chrome

```astro
---
// src/layouts/BaseLayout.astro
import Seo from '~/components/seo/Seo.astro';
import Header from '~/components/layout/Header.astro';
import Footer from '~/components/layout/Footer.astro';
import YandexMetrika from '~/components/analytics/YandexMetrika.astro';
import '~/styles/global.css';

interface Props {
  seo: {
    title: string;
    description: string;
    canonical: string;
    ogImage?: string;
    noindex?: boolean;
  };
  jsonLd?: object[];
  breadcrumbs?: { name: string; url: string }[];
}
const { seo, jsonLd = [], breadcrumbs } = Astro.props;
---
<!DOCTYPE html>
<html lang="ru">
  <head>
    <Seo {...seo} jsonLd={jsonLd} />
  </head>
  <body>
    <Header />
    {breadcrumbs && <Breadcrumbs items={breadcrumbs} />}
    <main><slot /></main>
    <Footer />
    <YandexMetrika counterId={import.meta.env.PUBLIC_METRIKA_ID} />
  </body>
</html>
```

### Tier 2: Specialized layouts wrap BaseLayout

- `ServiceLayout.astro` — wraps BaseLayout, accepts a service entry, auto-builds breadcrumbs `Главная / Услуги / <title>`, auto-renders related cases block at bottom, auto-renders contact form.
- `CaseLayout.astro` — wraps BaseLayout, accepts a case entry, auto-renders gallery, testimonial pullquote, "back to portfolio" link, auto-renders related service CTA.

### Tier 3: Homepage uses BaseLayout directly

Homepage is a one-off composition of blocks — no need for a dedicated layout. Just `src/pages/index.astro` imports BaseLayout + composes 8 blocks inline per the draft in `content/pages/home.md`.

**Composition example (service page):**

```astro
---
// src/pages/services/[slug].astro
import { getCollection, getEntry } from 'astro:content';
import ServiceLayout from '~/layouts/ServiceLayout.astro';
import Hero from '~/components/blocks/Hero.astro';
import FeatureGrid from '~/components/blocks/FeatureGrid.astro';
import ContactForm from '~/components/forms/ContactForm.astro';

export async function getStaticPaths() {
  const services = await getCollection('services', ({ data }) => !data.draft);
  return services.map(s => ({ params: { slug: s.data.slug }, props: { service: s } }));
}
const { service } = Astro.props;
const { Content } = await service.render();
---
<ServiceLayout service={service}>
  <Hero title={service.data.title} tagline={service.data.heroTagline} image={service.data.heroImage} />
  <Content />
  <FeatureGrid items={service.data.bulletPoints} />
  <ContactForm context={service.data.slug} />
</ServiceLayout>
```

---

## 5. Reusable Building Blocks — Inventory

| Component | Location | Used on | Props contract |
|-----------|----------|---------|----------------|
| `Hero` | blocks/ | homepage, services, about | title, tagline, image, primaryCta, secondaryCta, trustMarkers |
| `FeatureGrid` | blocks/ | services (6 items), home ("под ключ" 3-col) | items[], columns (2/3/4), variant (iconed/plain) |
| `CaseCard` | blocks/ | cases hub, homepage featured, service related | case (entry reference), variant (compact/full) |
| `CasesPreviewGrid` | blocks/ | homepage, service subpages | limit, featured?, filterBySegment? |
| `TestimonialQuote` | blocks/ | homepage, case pages, services | testimonial (entry), variant (pullquote/card) |
| `CTASection` | blocks/ | before footer on every page | heading, copy, primaryCta, secondaryCta |
| `ContactForm` | forms/ | homepage, services, contacts | context (slug for lead tagging), compact? |
| `Breadcrumbs` | layout/ | every page except homepage | items[] (auto-rendered from BaseLayout) |
| `ServicePillars` | blocks/ | services hub | services[] from collection |
| `HowWeWorkSteps` | blocks/ | homepage, services | steps[] (frontmatter-driven) |
| `TrustMarkers` | blocks/ | homepage hero | markers[] ("7+ лет", "15+ проектов в год") |
| `TeamGrid` | blocks/ | about/team | members[] from collection |

**Anti-pattern guard:** Do NOT create per-page components like `HomepageHero.astro`, `ServicePageHero.astro`. One `Hero.astro` with variants via props. If variants explode beyond 3, split then — not preemptively.

---

## 6. Shared SEO Component

Single `Seo.astro` renders all meta + JSON-LD from one props object. Page templates build the JSON-LD graph and pass it in.

```astro
---
// src/components/seo/Seo.astro
import { SITE } from '~/config/site';
interface Props {
  title: string;
  description: string;
  canonical: string;
  ogImage?: string;
  noindex?: boolean;
  jsonLd?: object[];
}
const { title, description, canonical, ogImage = SITE.defaultOgImage, noindex, jsonLd = [] } = Astro.props;
const fullTitle = title === SITE.name ? title : `${title} — ${SITE.name}`;
---
<title>{fullTitle}</title>
<meta name="description" content={description} />
<link rel="canonical" href={canonical} />
{noindex && <meta name="robots" content="noindex,nofollow" />}

<!-- Open Graph -->
<meta property="og:type" content="website" />
<meta property="og:site_name" content={SITE.name} />
<meta property="og:locale" content="ru_RU" />
<meta property="og:title" content={fullTitle} />
<meta property="og:description" content={description} />
<meta property="og:url" content={canonical} />
<meta property="og:image" content={ogImage} />

<!-- Twitter (still useful for Telegram preview) -->
<meta name="twitter:card" content="summary_large_image" />
<meta name="twitter:title" content={fullTitle} />
<meta name="twitter:description" content={description} />
<meta name="twitter:image" content={ogImage} />

<!-- JSON-LD graph -->
{jsonLd.length > 0 && (
  <script type="application/ld+json" set:html={JSON.stringify({
    "@context": "https://schema.org",
    "@graph": jsonLd,
  })} />
)}
```

### JSON-LD graph — which schemas on which pages

| Page | Entities in @graph |
|------|--------------------|
| Homepage | `LocalBusiness` (full), `Organization`, `WebSite` with `potentialAction: SearchAction` |
| Services hub | `LocalBusiness` (ref), `BreadcrumbList`, `CollectionPage` |
| Service subpage | `LocalBusiness` (ref), `Service`, `BreadcrumbList`, optional `FAQPage` if `faqs` present |
| Cases hub | `LocalBusiness` (ref), `BreadcrumbList`, `CollectionPage` |
| Case page | `LocalBusiness` (ref), `Event` (past event), `BreadcrumbList`, optional `Review` |
| About | `LocalBusiness`, `Organization`, `BreadcrumbList` |
| Team | `Organization` with `employee: [...Person]`, `BreadcrumbList` |
| Contacts | `LocalBusiness` (full with contactPoint), `BreadcrumbList` |

**Pattern:** LocalBusiness entity declared once with `@id: "https://крылья.life/#business"`. Other pages reference it via `{"@id": "..."}` rather than duplicating — this is the canonical pattern for 2026 and helps Google merge signals.

```typescript
// src/config/business.ts
export const LOCAL_BUSINESS = {
  "@type": "LocalBusiness",
  "@id": "https://крылья.life/#business",
  name: "Крылья",
  alternateName: "Ивент-агентство Крылья",
  url: "https://крылья.life/",
  telephone: "+79118627957",
  email: "wings.agency@yandex.ru",
  address: {
    "@type": "PostalAddress",
    addressLocality: "Калининград",
    addressRegion: "Калининградская область",
    addressCountry: "RU",
  },
  areaServed: ["Калининград", "Калининградская область"],
  priceRange: "₽₽₽",
  founder: { "@type": "Person", name: "Мария Вострикова" },
  sameAs: [/* telegram, instagram URLs when confirmed */],
};
```

---

## 7. Image Pipeline

**Rule:** All content-related imagery goes through `src/assets/` and uses Astro's `<Image />` / `<Picture />` component. `public/` is reserved for truly static files (favicon source, robots.txt).

### Why local assets, not CDN

- Astro at build time generates hashed, multi-size, multi-format (AVIF + WebP + JPEG fallback) derivatives. Vercel serves them from its edge CDN for free — double CDN adds latency and cost with no benefit for this scale.
- Local imports give TypeScript-checked paths and let Zod `image()` validate on schema load (catches broken image paths at build, not in production).
- The few photos that DO live outside the repo (client-provided high-res case photos, 20-50MB originals) stay in `~/Documents/Крылья. Общее./` and get downscaled into `src/assets/cases/<case-slug>/` before commit — keeps repo under 200MB.

### Responsive strategy

```astro
---
import { Picture } from 'astro:assets';
import heroImg from '~/assets/hero/corporate-parties.jpg';
---
<Picture
  src={heroImg}
  alt="Новогодний корпоратив в Калининграде"
  formats={['avif', 'webp', 'jpg']}
  widths={[480, 768, 1200, 1920]}
  sizes="(max-width: 768px) 100vw, 1200px"
  loading="eager"  <!-- only for above-the-fold; lazy otherwise -->
  fetchpriority="high"  <!-- hero only -->
/>
```

- Hero: `loading="eager"` + `fetchpriority="high"` (LCP image)
- Below-fold case cards: `loading="lazy"` (default)
- Always specify explicit `width` / `height` on `<img>` to prevent CLS
- AVIF first, WebP fallback, JPEG last — Astro handles this automatically

---

## 8. Routing — Latin vs Cyrillic URLs (DECISION)

**Recommendation: Latin slugs in URL paths, Cyrillic in content/titles.**

URL structure: `https://крылья.life/services/corporate-parties/`
Not: `https://крылья.life/услуги/корпоративы/`

### Trade-offs table

| Criterion | Latin paths (`/services/corporate-parties/`) | Cyrillic paths (`/услуги/корпоративы/`) |
|-----------|---------------------------------------------|----------------------------------------|
| Google indexing | Works everywhere, no encoding edge cases | Works when percent-encoded correctly; still occasional CDN/header issues |
| Yandex indexing | Works perfectly | Works perfectly, slight preference historically |
| Click-through rate in SERP | Neutral for Russian audience | Slightly higher CTR for Russian searches (readable URL) |
| Sharing in Telegram/WhatsApp | Clean copy-paste | Gets percent-encoded on copy → ugly `%D1%83%D1%81...` |
| Sharing in email | Clean | Encoded in plain-text, breaks some clients |
| Backlinks | Consistent across sources | Half of sources strip encoding, half keep it — canonical fragmentation |
| Analytics reports | Readable in Яндекс.Метрика | Decoded in reports, but raw log view is painful |
| CMS / editing | Trivial slug field | Requires transliteration logic or manual entry of Cyrillic |
| Redirect rules on Vercel | Standard regex | Requires percent-encoding in config strings |
| Future blog growth | Easy (`/blog/event-ideas/`) | Same encoding headaches multiplied |

**Why Latin wins here:**
1. Domain is already Cyrillic (`крылья.life`) — the domain carries the branding/locality signal in SERP. Adding Cyrillic paths is redundant and pays the encoding tax twice.
2. Backlink ecosystem (directories, press, social) will handle Latin URLs consistently. Case URLs will survive sharing.
3. Engineering tax: Vercel rewrites, sitemap encoding, canonical tag encoding all "just work" with Latin.
4. Yandex does not penalize Latin paths for Russian content in 2026 — content language is detected from body, not URL.

**Exception:** Keep the Cyrillic **domain** (крылья.life). That's pure branding and doesn't create the sharing/encoding tax (DNS handles IDN-to-Punycode transparently).

**Slug convention:** kebab-case, Latin-only, stable over time.
- `/services/corporate-parties/`
- `/services/business-events/`
- `/cases/bystrinskoe-metallurg-2023/`
- `/cases/vklyuchi-partners-evening/`

Slugs live in the collection frontmatter (`slug: corporate-parties`) — not derived from filename. This decouples file organization from URL, letting us rename files without breaking SEO.

---

## 9. Sitemap — `@astrojs/sitemap` with IDN Handling

```javascript
// astro.config.mjs
import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';

export default defineConfig({
  // CRITICAL: use Punycode form here, not Cyrillic
  // Otherwise Astro's URL constructor chokes on some Node versions
  site: 'https://xn--j1aco8bgs.life',
  integrations: [
    sitemap({
      i18n: false,
      filter: (page) => !page.includes('/api/') && !page.includes('/privacy'),
      serialize(item) {
        // Sitemap.xml MUST use Punycode URLs per sitemaps.org spec
        // but Yandex accepts both; keep Punycode for maximum compat
        return {
          ...item,
          changefreq: item.url.endsWith('/') && item.url.split('/').length === 4
            ? 'monthly'    // homepage, hub pages
            : 'yearly',    // deep content pages
          priority: item.url === `https://xn--j1aco8bgs.life/` ? 1.0
                  : item.url.includes('/services/') ? 0.8
                  : item.url.includes('/cases/') ? 0.7
                  : 0.5,
        };
      },
    }),
  ],
});
```

**Key points:**
- `site` MUST be Punycode (`xn--j1aco8bgs.life`) in config — ensures the URL constructor in Node/Astro builds clean URLs. The DNS/browser decodes to Cyrillic for users automatically.
- `canonical` tags: use the same form everywhere. Pick Punycode OR Cyrillic globally and stick with it. **Recommendation: Punycode in sitemap + canonical, Cyrillic only in visible UI and branding.** This sidesteps the "did we encode consistently?" bugs.
- `robots.txt` (in `public/`) points to `https://xn--j1aco8bgs.life/sitemap-index.xml`.
- After deploy: register BOTH forms in Яндекс.Вебмастер and Google Search Console — they index as "same site" via IDN but show separate reports.

---

## 10. Form Submission — DECISION: Vercel serverless + Telegram Bot

**Chosen:** Serverless function at `/api/lead` on Vercel → Telegram Bot (primary) + email forwarding via Яндекс.SMTP (secondary).

### Why this over alternatives

| Option | Pros | Cons | Verdict |
|--------|------|------|---------|
| **Vercel serverless + Telegram Bot** | Free (within Vercel hobby limit), instant push to Maria's phone, full control, no third-party privacy concerns (152-ФЗ ok), tags each lead with page context | ~50 LOC to maintain, needs bot token | **CHOSEN** |
| Formspree | Zero backend code | Free tier = 50 submissions/month then paid; data passes through US servers (152-ФЗ gray zone for Russian leads); slower feedback loop | Rejected |
| Netlify Forms | Would work, but we're on Vercel, not Netlify | Requires platform switch | N/A |
| Google Forms / Tilda Forms | Zero setup | Ugly embed, no branding control, analytics attribution broken | Rejected |
| Direct Telegram Bot from browser | Simplest | Exposes bot token to client — immediate abuse risk | Rejected (security) |
| `mailto:` link only | Trivial | 90%+ drop-off vs. in-page form; can't track conversion | Rejected |

### Implementation sketch

```typescript
// src/pages/api/lead.ts
import type { APIRoute } from 'astro';
import { CONTACTS } from '~/config/contacts';

export const prerender = false;  // required for Vercel functions

export const POST: APIRoute = async ({ request }) => {
  const data = await request.formData();
  // 1. Honeypot check
  if (data.get('website')) return new Response('ok', { status: 200 });
  // 2. Basic validation (name + phone required)
  const name = String(data.get('name') ?? '').trim();
  const phone = String(data.get('phone') ?? '').trim();
  if (!name || !phone) return new Response('Missing fields', { status: 400 });
  // 3. Build message
  const text = [
    '*Новая заявка с сайта*',
    `Имя: ${name}`,
    `Телефон: ${phone}`,
    `Email: ${data.get('email') ?? '—'}`,
    `Формат: ${data.get('format') ?? '—'}`,
    `Дата: ${data.get('date') ?? '—'}`,
    `Бюджет: ${data.get('budget') ?? '—'}`,
    `Контекст: ${data.get('context') ?? 'unknown'}`,
    `Комментарий: ${data.get('comment') ?? '—'}`,
  ].join('\n');
  // 4. Push to Telegram
  await fetch(`https://api.telegram.org/bot${process.env.TG_BOT_TOKEN}/sendMessage`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ chat_id: process.env.TG_CHAT_ID, text, parse_mode: 'Markdown' }),
  });
  // 5. (Optional) Also send email via Resend or Яндекс.SMTP as backup
  return new Response(JSON.stringify({ ok: true }), { status: 200 });
};
```

**Anti-spam layers (defense in depth):**
1. Honeypot field (`<input name="website" hidden>`) — catches 95% of bots.
2. Rate limit by IP in the serverless function (Upstash free tier or Vercel KV).
3. Time-to-submit check — if form filled <2s from page load, drop it.
4. No reCAPTCHA in MVP (UX/legal cost > spam cost at this traffic level).

---

## 11. Analytics — Yandex.Metrika without Performance Penalty

**Pattern:** Inline defer + `requestIdleCallback` loader.

```astro
---
// src/components/analytics/YandexMetrika.astro
interface Props { counterId: string; }
const { counterId } = Astro.props;
---
{import.meta.env.PROD && (
  <script is:inline define:vars={{ counterId }}>
    // Defer Metrika load until after page is idle (not competing with LCP)
    const loadMetrika = () => {
      (function(m,e,t,r,i,k,a){
        m[i]=m[i]||function(){(m[i].a=m[i].a||[]).push(arguments)};
        m[i].l=1*new Date();
        k=e.createElement(t),a=e.getElementsByTagName(t)[0],
        k.async=1,k.src=r,a.parentNode.insertBefore(k,a)
      })(window,document,"script","https://mc.yandex.ru/metrika/tag.js","ym");
      ym(counterId, "init", {
        clickmap: true,
        trackLinks: true,
        accurateTrackBounce: true,
        webvisor: true,
      });
    };
    if ('requestIdleCallback' in window) {
      requestIdleCallback(loadMetrika, { timeout: 3000 });
    } else {
      setTimeout(loadMetrika, 2000);
    }
  </script>
  <noscript><div><img src={`https://mc.yandex.ru/watch/${counterId}`} style="position:absolute;left:-9999px" alt="" /></div></noscript>
)}
```

**Why this over `astro-yandex-metrika` package:**
- 15 lines of code vs. third-party dependency. No abandonment risk.
- Full control over load timing — fires after LCP paints, not during.
- `is:inline` with `define:vars` = no hydration, no runtime framework cost.
- Guard with `import.meta.env.PROD` so dev builds don't pollute analytics.

**Goals to set up in Метрика panel (not code):**
- Цель "Отправка формы" — URL/param match on `/api/lead?success=1` or custom JS event.
- Цель "Клик по телефону" — auto-tracked via `tel:` link + `trackLinks`.
- Цель "Клик на email" — auto-tracked via `mailto:` link.

---

## 12. Data Flow

### Build-time flow (99% of pages)

```
src/content/cases/*.mdx           src/content/config.ts
         │                                  │
         ▼                                  ▼
     Astro Content Layer ◀───── Zod schema validation ──── (error if invalid)
         │
         ▼
   getCollection('cases')   ──────▶  [slug].astro template
         │                                  │
         │                                  ▼
         │                          <CaseLayout>
         │                          <Hero />
         │                          <Content />  ← MDX body renders
         │                          <CaseCard /> for related
         │                          <ContactForm />
         │                                  │
         ▼                                  ▼
  collection entry typed        Static HTML written to dist/cases/<slug>/index.html
                                (all images pre-optimized to AVIF/WebP/JPG)
```

### Runtime flow (form submission, only dynamic path)

```
User fills form on any page
        │
        ▼ (fetch POST as multipart/form-data)
/api/lead  (Vercel serverless function)
        │
        ├─────▶ Telegram Bot API ───▶ Maria's Telegram
        └─────▶ (optional) Email SMTP ─▶ wings.agency@yandex.ru
        │
        ▼
   200 OK ──▶ Client JS swaps form for "Спасибо!" message
            + fires Метрика goal `form_submitted`
```

---

## 13. Build Order — DECISION: Design system first, homepage as vertical slice, then outward

This is the orchestrator's explicit debate prompt. Two options:

### Option A: Design system first, then layouts, then pages (bottom-up)
**Pros:** Consistent tokens/primitives from day 1, zero rework.
**Cons:** Weeks of invisible work before anything lives. Morale risk. Risk of over-engineering primitives before you know what pages need.

### Option B: Homepage first, extract patterns outward (top-down vertical slice)
**Pros:** Ship something visible fast. Each subsequent page reuses what homepage needed. Primitives emerge from real use.
**Cons:** First pass of each component is rough; second page reveals refactoring needs.

### Recommendation: **Hybrid — thin design system foundation + homepage as first vertical slice**

Concretely, in this order:

1. **Phase 1 — Foundations (design tokens only, 2-3 days)**
   - Tailwind config with brand colors (`#FFF200`, monochrome palette)
   - Font loading (FuturaPT + Demetriss or chosen fallbacks)
   - `Container`, `Section`, `Heading`, `Button` primitives only — nothing domain-specific
   - BaseLayout shell with empty `<Seo>` + Header/Footer stubs
   - Metrika and form endpoint plumbed but without content
2. **Phase 2 — Homepage as vertical slice (1 week)**
   - Build Hero, FeatureGrid, CasesPreviewGrid, TestimonialQuote, CTASection, ContactForm in-place
   - Wire real collections (even with placeholder case entries)
   - Get the full render pipeline working end-to-end — including form submit to Telegram, Метрика goal firing, JSON-LD validation in Google's Rich Results Test
   - This is the integration test for the whole architecture
3. **Phase 3 — Services template + 6 subpages (4-5 days)**
   - ServiceLayout wraps BaseLayout
   - `[slug].astro` renders collection entries
   - Copy text from `content/pages/*` drafts into collection MDX
   - Reuse Hero, FeatureGrid, TestimonialQuote, CTASection from Phase 2
4. **Phase 4 — Cases template + portfolio hub (4-5 days)**
   - CaseLayout, `[slug].astro` for cases
   - Gallery component (new — not reusable from homepage)
   - Cases hub with segment filter
5. **Phase 5 — About cluster + contacts + privacy (2-3 days)**
   - Mostly composed from existing blocks
6. **Phase 6 — SEO polish, sitemap, Rich Results validation, 301 redirects from Tilda URLs, DNS cutover (3-4 days)**

**Why this ordering:**
- **Dependency reasoning:** Services pages depend on the Hero, FeatureGrid, CTASection, ContactForm that the homepage forces into existence. Building homepage first means service pages are 40% assembly, not construction.
- **Risk front-loading:** Form submission, analytics, JSON-LD, IDN handling — the "will this even work?" questions — are resolved in Phase 2 on a single page. Cheaper to fix there than across 20.
- **Visible progress:** Мария sees something real by end of week 2. Important for non-technical stakeholder morale and for early feedback on brand execution.
- **Deadline pressure:** Mid-May release target (per PROJECT.md) means ~3 weeks. Bottom-up design system can't fit. Top-down without any foundation creates tech debt. Hybrid is the only path that fits.

---

## 14. File Naming Conventions

| Artifact | Convention | Example |
|----------|-----------|---------|
| Collection entries (filename) | kebab-case matching slug | `bystrinskoe-metallurg-2023.mdx` |
| Collection slugs (in frontmatter) | kebab-case, Latin ASCII only | `slug: bystrinskoe-metallurg-2023` |
| Page routes | kebab-case directories, `index.astro` inside | `src/pages/about/team.astro` |
| `.astro` components | PascalCase | `CaseCard.astro`, `ContactForm.astro` |
| TypeScript utilities | camelCase | `slugify.ts`, `formatPhone.ts` |
| Config files | camelCase exports, kebab-case filenames | `src/config/contacts.ts` exporting `CONTACTS` |
| CSS custom properties | kebab-case with `--kr-` prefix | `--kr-color-accent: #FFF200` |
| Constants | SCREAMING_SNAKE_CASE exports | `export const LOCAL_BUSINESS = {...}` |
| Image files | kebab-case, context-prefixed | `cases/bystrinskoe-2023/hero.jpg`, `team/maria-vostrikova.jpg` |
| Env vars | SCREAMING_SNAKE_CASE, `PUBLIC_` prefix for client-exposed | `PUBLIC_METRIKA_ID`, `TG_BOT_TOKEN` |

---

## 15. Shared Constants — Location

Single source: `src/config/`. Import everywhere. Never hardcode.

```typescript
// src/config/contacts.ts
export const CONTACTS = {
  phone: {
    display: '+7 911 862-79-57',
    tel: '+79118627957',
    href: 'tel:+79118627957',
  },
  email: {
    display: 'wings.agency@yandex.ru',
    href: 'mailto:wings.agency@yandex.ru',
  },
  telegram: {
    handle: '@wingsagency',  // TBD — confirm with Мария
    href: 'https://t.me/wingsagency',
  },
  address: {
    city: 'Калининград',
    region: 'Калининградская область',
    country: 'Россия',
  },
  legalEntity: 'ИП Вострикова Мария Владимировна',
  workingHours: 'Пн-Пт 10:00-19:00 (МСК+0)',
} as const;
```

```typescript
// src/config/site.ts
export const SITE = {
  name: 'Крылья',
  fullName: 'Ивент-агентство Крылья',
  url: 'https://xn--j1aco8bgs.life',
  displayUrl: 'крылья.life',
  locale: 'ru_RU',
  lang: 'ru',
  defaultOgImage: '/og/default.jpg',
  defaultDescription: 'Ивент-агентство в Калининграде. Корпоративы, деловые мероприятия, тимбилдинги под ключ.',
} as const;
```

Used in: Header, Footer, Seo, JSON-LD builders, ContactForm fallback, api/lead confirmation, privacy page — 8+ places. Changing phone or email = one edit.

---

## 16. Anti-Patterns to Avoid

### AP1: Page-specific components without reuse rationale
**Mistake:** Creating `HomepageHero.astro`, `ServiceHero.astro`, `CaseHero.astro` because each "feels different."
**Why wrong:** Three copies of 80% identical code; divergence compounds; bugfix requires 3 edits.
**Instead:** One `Hero.astro` with `variant: 'home' | 'service' | 'case'` prop OR compose via slots for the 20% that varies.

### AP2: Inline `<script>` for interactivity, scattered across pages
**Mistake:** Putting jQuery-style inline JS in each page's `<script>` block for menu toggle, form submit, gallery.
**Why wrong:** Duplicated code, hard to test, runs even when not needed.
**Instead:** Separate modules in `src/components/*/[component]Client.ts`, imported with `<script>` only where the component renders. Or use tiny Alpine.js islands with `client:visible`.

### AP3: Mixing content and presentation in `.astro` pages
**Mistake:** Writing long prose directly inside `<p>` tags in `src/pages/services/corporate-parties.astro`.
**Why wrong:** Can't reorder without editing JSX; impossible for Мария to edit without touching code; loses MDX benefits.
**Instead:** Prose goes in MDX under `src/content/services/*.mdx`, rendered via `<Content />`. Page template only composes blocks around content.

### AP4: Building JSON-LD ad-hoc per page
**Mistake:** Typing `{"@type": "LocalBusiness", "name": "..."}` inline on each page.
**Why wrong:** Duplicates business data, easy drift between pages, one typo breaks Google validation.
**Instead:** Builders in `src/lib/schema-builders.ts` that take an entry and return the graph array. Seo component renders.

### AP5: Using `public/` as the image folder
**Mistake:** Dumping photos in `public/images/cases/` and referencing `/images/cases/foo.jpg`.
**Why wrong:** Bypasses Astro image optimization — ships 5MB JPGs to phones. No AVIF, no responsive sizes, no hash busting.
**Instead:** `src/assets/cases/<slug>/foo.jpg` imported in the component, rendered via `<Image>` / `<Picture>`.

### AP6: Cyrillic slugs because "it's a Russian site"
See section 8 — Latin slugs, Cyrillic content/titles.

### AP7: Fetching Метрика in `<head>` blocking mode
**Mistake:** Dropping the Yandex snippet in `<head>` as-is per their copy-paste docs.
**Why wrong:** Delays LCP by 300-800ms on 3G; hurts Core Web Vitals and user experience.
**Instead:** Defer until `requestIdleCallback` (section 11).

### AP8: One giant `Layout.astro` with conditionals for every page type
**Mistake:** `{pageType === 'service' && <ServiceStuff />} {pageType === 'case' && <CaseStuff />}`
**Why wrong:** Grows into a god component.
**Instead:** Three separate layouts that each wrap BaseLayout via slots.

---

## 17. Scaling Considerations

| Scale | Adjustments |
|-------|-------------|
| 0-1k visitors/mo (MVP, first 3 months) | Current architecture is correct. Vercel free tier covers it. No DB needed. |
| 1k-10k visitors/mo (Q3-Q4 2026 if SEO works) | Same architecture. Maybe add Plausible as secondary analytics for cleaner reports. Monitor Vercel function invocations for form spam. |
| 10k+ visitors/mo (2027 optimistic) | Still same. 20 static pages on a CDN scale infinitely. Only form endpoint matters — add Upstash rate limiting. |
| Adding blog with 50+ posts | Add `blog` collection with same pattern. Consider adding tag/category taxonomy collection. No architectural change. |
| Multi-language | Not planned (see PROJECT.md Out of Scope). If ever added: `src/content/en/`, `src/pages/en/`, `@astrojs/i18n` integration, separate sitemaps. |

**First bottleneck:** Not traffic — **Мария's time to add cases**. Architecture should optimize for 15-minute case publishing, not hypothetical 100k users. → MDX frontmatter-driven, image helpers, draft flag, previewable locally.

---

## 18. Integration Points

### External Services

| Service | Integration | Gotchas |
|---------|-------------|---------|
| Telegram Bot API | `fetch()` from serverless function with bot token in env | Bot must be added to chat first; use numeric `chat_id`, not `@username` |
| Яндекс.Метрика | Deferred inline script (section 11) | Blocked in some EU networks — don't rely on it for 100% coverage |
| Яндекс.Вебмастер | Verify via meta tag in Seo component (env-driven) | Cyrillic and Punycode domain forms need separate verification |
| Google Search Console | Verify via meta tag | Same dual-verification |
| Vercel | GitHub push → auto-deploy, env vars in dashboard | Hobby tier has 100GB bandwidth/month and 100K function invocations — enough for MVP |
| nic.ru DNS | CNAME to Vercel `cname.vercel-dns.com`, SSL auto | IDN domain management in nic.ru panel works fine |
| Яндекс.SMTP (optional email backup) | Serverless `nodemailer` → smtp.yandex.ru:465 | App password required (not main password) |

### Internal Boundaries

| Boundary | Communication | Notes |
|----------|---------------|-------|
| Page template ↔ Collection | `getCollection()`, `getEntry()` at build | Type-checked via Zod schemas |
| Page template ↔ Components | Props only, via `.astro` import | No global state needed |
| Component ↔ Config | Direct ES import from `src/config/*` | Build-time inlined, zero runtime cost |
| Browser ↔ `/api/lead` | `fetch` POST with FormData | CORS: same-origin, no preflight |
| Build ↔ External (images) | None — all images local | Prevents build-time network failures |

---

## Sources

- [Astro Content Loader API | Docs](https://docs.astro.build/en/reference/content-loader-reference/) — HIGH confidence, official reference
- [Astro Content Collections Guide](https://docs.astro.build/en/guides/content-collections/) — HIGH confidence
- [Content Layer: A Deep Dive | Astro Blog](https://astro.build/blog/content-layer-deep-dive/) — HIGH confidence, performance numbers
- [astrojs/sitemap Integration Docs](https://docs.astro.build/en/guides/integrations-guide/sitemap/) — HIGH confidence
- [Astro SEO: the definitive guide — Joost.blog](https://joost.blog/astro-seo-complete-guide/) — MEDIUM confidence, independent source
- [Schema.org for SEO: Ready-to-Use JSON-LD Examples 2026 — Incremys](https://www.incremys.com/en/resources/blog/schema-seo) — MEDIUM confidence
- [JSON-LD: The Complete Guide to Structured Data 2026 — SchemaPilot](https://www.schemapilot.app/blog/json-ld-guide/) — MEDIUM confidence
- [Non-Latin Characters in URLs: 2026 SEO Impact Guide](https://copyprogramming.com/howto/seo-impact-of-using-non-latin-characters-in-url) — MEDIUM confidence
- [Hosting: Vercel Serverless Functions | grammY docs](https://grammy.dev/hosting/vercel) — HIGH confidence, applied to Telegram bot pattern
- [Отложенная загрузка кода Яндекс.Метрики — kobzarev.com](https://www.kobzarev.com/technical-seo/yandex-metrika-lazy-load/) — MEDIUM confidence, Russian SEO practice
- [astro-yandex-metrika — GitHub (ufocoder)](https://github.com/ufocoder/astro-yandex-metrika) — reviewed, chose inline approach instead
- [Yandex metrica-tag — official GitHub](https://github.com/yandex/metrica-tag) — HIGH confidence for snippet form

---
*Architecture research for: крылья.life — content-heavy SEO-focused Astro site, 18-23+ pages, Russian content, Cyrillic domain, Vercel deployment*
*Researched: 2026-04-22*
