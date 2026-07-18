/**
 * Cloudflare Pages Function — middleware для всех запросов.
 *
 * Две SEO-задачи (аудит 18.07.2026, seo/AUDIT-2026-07-18.md):
 * 1. www.* → 301 на основное зеркало без www (иначе www-копия
 *    индексируется как дубль сайта).
 * 2. Тех-домен *.pages.dev получает заголовок X-Robots-Tag: noindex —
 *    копия сайта на pages.dev не должна попадать в поисковики.
 */

export const onRequest: PagesFunction = async (context) => {
  const url = new URL(context.request.url);

  if (url.hostname.startsWith("www.")) {
    url.hostname = url.hostname.slice(4);
    return Response.redirect(url.toString(), 301);
  }

  const response = await context.next();

  if (url.hostname.endsWith(".pages.dev")) {
    const patched = new Response(response.body, response);
    patched.headers.set("X-Robots-Tag", "noindex, nofollow");
    return patched;
  }

  return response;
};
