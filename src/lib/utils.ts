/**
 * Returns the image URL as-is so Next.js image optimizer can proxy it.
 * With unoptimized:false, the optimizer fetches HTTP backend images
 * server-side and serves them to the browser over HTTPS — no mixed-content errors.
 */
export function mediaUrl(url: string | undefined): string | undefined {
  return url || undefined;
}
