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
    date: z.coerce.date(),
    service: reference("services").optional(),
    segment: z.enum(["dev", "biz", "private"]),
    challenge: z.string(),
    solution: z.string(),
    results: z.array(z.string()).default([]),
    cover: z.string(),
    format: z.string(),
    guests: z.string(),
    duration: z.string().optional(),
    venue: z.string(),
    heroFact: z.string(),
    photos: z.array(z.string()).default([]),
    testimonial: reference("testimonials").optional(),
    featured: z.boolean().default(false),
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

export const collections = { services, cases, testimonials, team };
