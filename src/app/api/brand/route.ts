import 'server-only';
import type { NextRequest } from 'next/server';
import { getCSSTokens } from '@/lib/theme';
import { siteConfig } from '@/config/site';

export const dynamic = 'force-dynamic';

const SERIF = "Georgia, 'Times New Roman', serif";

function escapeXml(value: string): string {
  return value.replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}

function buildIcon(t: Record<string, string>): string {
  const size = 512;
  const initial = (siteConfig.meta.title ?? 'R').charAt(0).toUpperCase();
  const bg     = escapeXml(t['--bg']     ?? '#fafaf9');
  const fg     = escapeXml(t['--fg']     ?? '#171717');
  const accent = escapeXml(t['--accent'] ?? '#3b82f6');
  const border = escapeXml(t['--border'] ?? '#e7e5e4');

  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${size} ${size}" width="${size}" height="${size}" role="img">
  <rect width="${size}" height="${size}" rx="96" fill="${bg}" />
  <rect x="1" y="1" width="${size - 2}" height="${size - 2}" rx="95" fill="none" stroke="${border}" stroke-width="2" />
  <circle cx="50%" cy="82%" r="38%" fill="${accent}" opacity="0.07" />
  <text x="50%" y="50%" font-family="${SERIF}" font-size="300" font-weight="700" fill="${fg}" text-anchor="middle" dominant-baseline="middle" letter-spacing="-2">${initial}<tspan fill="${accent}">.</tspan></text>
</svg>`;
}

function buildOg(t: Record<string, string>): string {
  const W = 1200, H = 630;
  const bg     = escapeXml(t['--bg']     ?? '#0c0a09');
  const fg     = escapeXml(t['--fg']     ?? '#fafaf9');
  const muted  = escapeXml(t['--muted']  ?? '#a8a29e');
  const faint  = escapeXml(t['--faint']  ?? '#78716c');
  const accent = escapeXml(t['--accent'] ?? '#60a5fa');
  const border = escapeXml(t['--border'] ?? '#292524');
  const name     = escapeXml(siteConfig.meta.title ?? 'Brand');
  const username = escapeXml(siteConfig.profile.username ?? '');
  const hostname = escapeXml(new URL(siteConfig.meta.url).hostname);

  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${W} ${H}" width="${W}" height="${H}" role="img">
  <defs><radialGradient id="glow" cx="50%" cy="50%" r="60%"><stop offset="0%" stop-color="${accent}" stop-opacity="0.12"/><stop offset="100%" stop-color="${accent}" stop-opacity="0"/></radialGradient></defs>
  <rect width="${W}" height="${H}" fill="${bg}" />
  <rect width="${W}" height="${H}" fill="url(#glow)" />
  <text x="50%" y="50%" font-family="${SERIF}" font-size="148" font-weight="700" fill="${fg}" text-anchor="middle" dominant-baseline="middle" letter-spacing="-3">${name}<tspan fill="${accent}">.</tspan></text>
  <text x="50%" y="${H / 2 + 110}" font-family="system-ui, sans-serif" font-size="36" font-weight="500" fill="${muted}" text-anchor="middle">${username}</text>
  <text x="50%" y="${H / 2 + 160}" font-family="ui-monospace, monospace" font-size="28" fill="${faint}" text-anchor="middle">${hostname}</text>
  <rect x="1" y="1" width="${W - 2}" height="${H - 2}" fill="none" stroke="${border}" stroke-width="2" />
  <rect x="0" y="${H - 4}" width="${W}" height="4" fill="${accent}" opacity="0.6" />
</svg>`;
}

export function GET(req: NextRequest) {
  const type         = req.nextUrl.searchParams.get('type') ?? 'icon';
  const defaultTheme = type === 'og' ? 'dark' : 'light';
  const theme        = (req.nextUrl.searchParams.get('theme') ?? defaultTheme) as 'light' | 'dark';

  const svg = type === 'og' ? buildOg(getCSSTokens(theme)) : buildIcon(getCSSTokens(theme));

  return new Response(svg, {
    headers: {
      'Content-Type':  'image/svg+xml',
      'Cache-Control': 'public, max-age=86400, stale-while-revalidate=604800',
      Vary:            'Accept, Accept-Encoding',
    },
  });
}
