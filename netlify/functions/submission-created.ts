/**
 * Netlify event Function — триггерится автоматически при каждой
 * новой submission в Netlify Forms.
 *
 * Имя `submission-created` — зарезервированное имя у Netlify, не менять.
 * https://docs.netlify.com/forms/notifications/#email-notifications
 *
 * Что делает:
 *  1. Читает данные заявки из event.payload.data
 *  2. Форматирует читаемое сообщение
 *  3. Шлёт его в Telegram-бот через Bot API → лично Марии
 *
 * Если упадёт — заявка ВСЁ РАВНО сохранена в Netlify Forms и в email
 * Марии. Telegram — дублирующий канал, не критичный.
 */

import type { Handler } from "@netlify/functions";

interface SubmissionPayload {
  payload?: {
    form_name?: string;
    data?: Record<string, string>;
    created_at?: string;
  };
}

// Защита от XL-payload: режем поля, если кто-то прислал слишком много
const MAX_FIELD_LEN = 1500;
const truncate = (s: string | undefined): string => {
  if (!s) return "";
  return s.length > MAX_FIELD_LEN ? s.slice(0, MAX_FIELD_LEN) + "…" : s;
};

const escapeMarkdown = (s: string): string => {
  // MarkdownV2 escape для Telegram
  return s.replace(/[_*[\]()~`>#+=|{}.!\\-]/g, "\\$&");
};

export const handler: Handler = async (event) => {
  const TOKEN = process.env.TELEGRAM_BOT_TOKEN;
  const CHAT_ID = process.env.TELEGRAM_CHAT_ID;

  if (!TOKEN || !CHAT_ID) {
    console.error("submission-created: TELEGRAM_BOT_TOKEN or TELEGRAM_CHAT_ID missing in env");
    return { statusCode: 500, body: "env not configured" };
  }

  let body: SubmissionPayload;
  try {
    body = JSON.parse(event.body ?? "{}") as SubmissionPayload;
  } catch (err) {
    console.error("submission-created: invalid JSON body", err);
    return { statusCode: 400, body: "invalid json" };
  }

  const data = body.payload?.data ?? {};
  const formName = body.payload?.form_name ?? "—";
  const createdAt = body.payload?.created_at ?? new Date().toISOString();

  const name = truncate(data.name);
  const phone = truncate(data.phone);
  const email = truncate(data.email);
  const message = truncate(data.message);

  const lines = [
    "🆕 *Новая заявка*",
    `📝 Форма: ${escapeMarkdown(formName)}`,
    "",
    `👤 *Имя:* ${escapeMarkdown(name)}`,
    `📞 *Телефон:* ${escapeMarkdown(phone)}`,
  ];

  if (email) {
    lines.push(`✉️ *Email:* ${escapeMarkdown(email)}`);
  }

  if (message) {
    lines.push("", "💬 *Сообщение:*", escapeMarkdown(message));
  }

  lines.push("", `🕐 ${escapeMarkdown(createdAt)}`);

  const text = lines.join("\n");

  try {
    const tgRes = await fetch(`https://api.telegram.org/bot${TOKEN}/sendMessage`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        chat_id: CHAT_ID,
        text,
        parse_mode: "MarkdownV2",
      }),
    });

    if (!tgRes.ok) {
      const errText = await tgRes.text();
      console.error("submission-created: telegram api error", tgRes.status, errText);
      // Не возвращаем 500 — заявка сохранена в Netlify, не хотим, чтобы Netlify retry'ила
      return { statusCode: 200, body: `telegram failed: ${tgRes.status}` };
    }

    return { statusCode: 200, body: "ok" };
  } catch (err) {
    console.error("submission-created: telegram fetch threw", err);
    return { statusCode: 200, body: "telegram threw" };
  }
};
