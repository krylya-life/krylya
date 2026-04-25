/**
 * Единый источник правды о бизнес-данных Крыльев.
 * Используется в JSON-LD, микроразметке, футере, формах.
 */

export const business = {
  name: "Крылья",
  legalName: "ИП Вострикова Мария Валерьевна",
  taxId: "550209075500",
  ogrnip: "324390000038348",
  founder: "Мария Вострикова",

  phone: "+79118627957",
  phoneDisplay: "+7 911 862 7957",
  email: "wings.agency@yandex.ru",
  telegramPersonal: "@mashavostrik",

  /** В Phase 7 → 'https://крылья.life'. До этого — Netlify preview. */
  url: "https://krylya-life.netlify.app",
  urlPunycode: "https://xn--j1aco8bgs.life",
  urlCyrillic: "https://крылья.life",

  region: "Калининградская область",
  locality: "Калининград",
  countryCode: "RU",

  /**
   * Ценовой диапазон по конвенции Schema.org для LocalBusiness:
   * '$', '$$', '$$$', '$$$$' — для $/€/₽/etc.
   * У нас средний чек агентства 50-150 тыс ₽ → ₽₽₽
   */
  priceRange: "₽₽₽",

  foundingDate: "2024",
  languages: ["ru"],

  /** Часы приёма заявок (обработка вручную). */
  hours: {
    days: ["Mo", "Tu", "We", "Th", "Fr"],
    opens: "10:00",
    closes: "19:00",
  },

  /** Метрика — счётчик с крылья.life (см. .planning/phases/03-vertical-slice/03-CONTEXT.md). */
  metrikaCounterId: 99532899,
} as const;
