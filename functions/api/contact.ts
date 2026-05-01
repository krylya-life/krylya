/**
 * Cloudflare Pages Function — endpoint /api/contact
 *
 * Принимает POST с FormData (или JSON) от ContactForm, валидирует
 * обязательные поля, проверяет honeypot, форматирует сообщение и
 * отправляет в Telegram-бот через Bot API.
 *
 * Env-переменные (настраиваются в Cloudflare Pages → Settings → Variables):
 *   TELEGRAM_BOT_TOKEN  — токен бота @krylya_zayavki_bot
 *   TELEGRAM_CHAT_ID    — chat_id Марии (129375931)
 */

interface Env {
  TELEGRAM_BOT_TOKEN: string;
  TELEGRAM_CHAT_ID: string;
}

const MAX_FIELD_LEN = 1500;

const truncate = (s: string | undefined): string => {
  if (!s) return "";
  return s.length > MAX_FIELD_LEN ? s.slice(0, MAX_FIELD_LEN) + "…" : s;
};

const escapeMarkdown = (s: string): string => {
  return s.replace(/[_*[\]()~`>#+=|{}.!\\-]/g, "\\$&");
};

export const onRequestPost: PagesFunction<Env> = async ({ request, env }) => {
  const TOKEN = env.TELEGRAM_BOT_TOKEN;
  const CHAT_ID = env.TELEGRAM_CHAT_ID;

  if (!TOKEN || !CHAT_ID) {
    console.error("/api/contact: TELEGRAM_BOT_TOKEN or TELEGRAM_CHAT_ID missing in env");
    return new Response(JSON.stringify({ ok: false, error: "env" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }

  let data: Record<string, string> = {};
  const contentType = request.headers.get("content-type") ?? "";

  try {
    if (contentType.includes("application/json")) {
      data = (await request.json()) as Record<string, string>;
    } else {
      const form = await request.formData();
      for (const [k, v] of form.entries()) {
        if (typeof v === "string") data[k] = v;
      }
    }
  } catch (err) {
    console.error("/api/contact: invalid body", err);
    return new Response(JSON.stringify({ ok: false, error: "body" }), {
      status: 400,
      headers: { "Content-Type": "application/json" },
    });
  }

  // Honeypot — если бот заполнил скрытое поле, тихо отвечаем «ок» и ничего не делаем
  if (data["bot-field"]) {
    return new Response(JSON.stringify({ ok: true }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  }

  const name = truncate(data.name);
  const phone = truncate(data.phone);
  const email = truncate(data.email);
  const message = truncate(data.message);
  const formName = truncate(data["form-name"]) || "contact";

  if (!name || !phone || !message) {
    return new Response(JSON.stringify({ ok: false, error: "fields" }), {
      status: 400,
      headers: { "Content-Type": "application/json" },
    });
  }

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

  lines.push("", "💬 *Сообщение:*", escapeMarkdown(message));
  lines.push("", `🕐 ${escapeMarkdown(new Date().toISOString())}`);

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
      console.error("/api/contact: telegram api error", tgRes.status, errText);
    }
  } catch (err) {
    console.error("/api/contact: telegram fetch threw", err);
  }

  return new Response(JSON.stringify({ ok: true }), {
    status: 200,
    headers: { "Content-Type": "application/json" },
  });
};
