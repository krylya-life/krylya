import { defineCollection, reference, z } from "astro:content";
import { glob, file } from "astro/loaders";

const services = defineCollection({
  loader: glob({ pattern: "**/*.md", base: "./src/content/services" }),
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
  loader: glob({ pattern: "**/*.md", base: "./src/content/cases" }),
  schema: z.object({
    title: z.string(),
    slug: z.string(),
    client: z.string(),
    eyebrow: z.string().optional(),
    date: z.coerce.date(),
    service: reference("services").optional(),
    segment: z.enum(["dev", "biz", "private"]),
    challenge: z.string(),
    solution: z.string(),
    results: z.array(z.string()).default([]),
    cover: z.string(),
    format: z.string(),
    guests: z.string().optional(),
    duration: z.string().optional(),
    venue: z.string(),
    heroFact: z.string(),
    photos: z.array(z.string()).default([]),
    testimonial: reference("testimonials").optional(),
    featured: z.boolean().default(false),
    wip: z.boolean().default(false),
  }),
});

const testimonials = defineCollection({
  loader: glob({ pattern: "**/*.json", base: "./src/content/testimonials" }),
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
  loader: glob({ pattern: "**/*.json", base: "./src/content/team" }),
  schema: z.object({
    name: z.string(),
    role: z.string(),
    photo: z.string(),
    bio: z.string(),
    order: z.number().default(99),
  }),
});

const ideas = defineCollection({
  loader: glob({ pattern: "**/*.md", base: "./src/content/ideas" }),
  schema: z.object({
    title: z.string(),
    slug: z.string().regex(/^[a-z0-9-]+$/), // латиница — совпадает с basename файла
    description: z.string().max(160), // meta description + og:description
    rubric: z.enum(["kak-organizovat", "formaty", "kaliningrad", "trendy"]),
    eyebrow: z.string().optional(), // короткая метка над карточкой; fallback — метка рубрики
    intentCluster: z.string(), // id кластера из семантической карты (14-RESEARCH)
    publishDate: z.coerce.date(),
    updatedDate: z.coerce.date().optional(),
    cover: z.string(), // имя файла в public/assets/ideas/<slug>/
    coverAlt: z.string(),
    relatedService: reference("services"), // обязательное — мостик D-08
    relatedCase: reference("cases").optional(),
    draft: z.boolean().default(false),
  }),
});

export const collections = { services, cases, testimonials, team, ideas };
