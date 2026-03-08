/**
 * Minimal no-op service worker.
 *
 * Browsers probe for /service-worker.js when a site has a Web App Manifest.
 * Without this file the server logs a 404 on every page load.
 * This stub installs cleanly and caches nothing.
 */
export const dynamic = "force-static";

export function GET() {
  return new Response(
    `self.addEventListener('install', () => self.skipWaiting());
self.addEventListener('activate', (e) => e.waitUntil(self.clients.claim()));`,
    {
      headers: {
        "Content-Type": "application/javascript; charset=utf-8",
        "Cache-Control": "public, max-age=3600, stale-while-revalidate=86400",
      },
    },
  );
}
