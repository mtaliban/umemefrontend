/**
 * Convert absolute backend media URLs to relative paths so they go
 * through the Next.js rewrite proxy (/media/:path* → backend).
 * This fixes mixed-content errors when the site is served over HTTPS
 * but the backend is HTTP.
 */
export function mediaUrl(url: string | undefined): string | undefined {
  if (!url) return undefined;
  try {
    const u = new URL(url);
    if (u.pathname.startsWith('/media/') || u.pathname.startsWith('/api/')) {
      return u.pathname + u.search;
    }
  } catch {
    // already a relative path — fine as-is
  }
  return url;
}
