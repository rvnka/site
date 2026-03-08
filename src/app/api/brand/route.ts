/**
 * src/app/api/brand/route.ts
 *
 * Generates brand SVG assets on-demand.
 *
 * Endpoints:
 *   GET /api/brand?type=icon
 *   GET /api/brand?type=icon&theme=dark
 *   GET /api/brand?type=og
 *   GET /api/brand?type=og&theme=light
 */

import 'server-only';
import type { NextRequest } from 'next/server';
import { getCSSTokens, type ThemeTokens } from '@/lib/css-tokens';
import { siteConfig } from '@/config/site-config';

export const dynamic = 'force-dynamic';

const SERIF = "Georgia, 'Times New Roman', serif";

// ─────────────────────────────────────────
// ICON (512x512)
// ─────────────────────────────────────────

function buildIcon(t: ThemeTokens): string {
  const size = 512;
  const radius = 96;
  const initial = (siteConfig.meta.title ?? 'R')
    .charAt(0)
    .toUpperCase();

  const palette = {
    bg: t['--bg'] ?? '#fafaf9',
    fg: t['--fg'] ?? '#171717',
    accent: t['--accent'] ?? '#3b82f6',
    border: t['--border'] ?? '#e7e5e4',
  };

  return `
<svg xmlns="http://www.w3.org/2000/svg"
  viewBox="0 0 ${size} ${size}"
  width="${size}" height="${size}"
  role="img">

  <rect width="${size}" height="${size}"
    rx="${radius}"
    fill="${palette.bg}" />

  <rect x="1" y="1"
    width="${size - 2}" height="${size - 2}"
    rx="${radius - 1}"
    fill="none"
    stroke="${palette.border}"
    stroke-width="2" />

  <circle cx="50%" cy="82%" r="38%"
    fill="${palette.accent}"
    opacity="0.07" />

  <text
    x="50%" y="50%"
    font-family="${SERIF}"
    font-size="300"
    font-weight="700"
    fill="${palette.fg}"
    text-anchor="middle"
    dominant-baseline="middle"
    letter-spacing="-2"
  >
    ${initial}<tspan fill="${palette.accent}">.</tspan>
  </text>

</svg>`;
}

// ─────────────────────────────────────────
// OG IMAGE (1200x630)
// ─────────────────────────────────────────

function buildOg(t: ThemeTokens): string {
  const W = 1200;
  const H = 630;

  const palette = {
    bg: t['--bg'] ?? '#0c0a09',
    fg: t['--fg'] ?? '#fafaf9',
    muted: t['--muted'] ?? '#a8a29e',
    faint: t['--faint'] ?? '#78716c',
    accent: t['--accent'] ?? '#60a5fa',
    border: t['--border'] ?? '#292524',
  };

  const name = siteConfig.meta.title ?? 'Brand';
  const username = siteConfig.profile.username ?? '';
  const hostname = new URL(siteConfig.meta.url).hostname;

  return `
<svg xmlns="http://www.w3.org/2000/svg"
  viewBox="0 0 ${W} ${H}"
  width="${W}" height="${H}"
  role="img">

  <defs>
    <radialGradient id="glow" cx="50%" cy="50%" r="60%">
      <stop offset="0%" stop-color="${palette.accent}" stop-opacity="0.12"/>
      <stop offset="100%" stop-color="${palette.accent}" stop-opacity="0"/>
    </radialGradient>
  </defs>

  <rect width="${W}" height="${H}" fill="${palette.bg}" />
  <rect width="${W}" height="${H}" fill="url(#glow)" />

  <text
    x="50%" y="50%"
    font-family="${SERIF}"
    font-size="148"
    font-weight="700"
    fill="${palette.fg}"
    text-anchor="middle"
    dominant-baseline="middle"
    letter-spacing="-3"
  >
    ${name}<tspan fill="${palette.accent}">.</tspan>
  </text>

  <text
    x="50%" y="${H / 2 + 110}"
    font-family="system-ui, -apple-system, sans-serif"
    font-size="36"
    font-weight="500"
    fill="${palette.muted}"
    text-anchor="middle"
  >
    ${username}
  </text>

  <text
    x="50%" y="${H / 2 + 160}"
    font-family="ui-monospace, SFMono-Regular, monospace"
    font-size="28"
    font-weight="400"
    fill="${palette.faint}"
    text-anchor="middle"
  >
    ${hostname}
  </text>

  <rect x="1" y="1"
    width="${W - 2}" height="${H - 2}"
    fill="none"
    stroke="${palette.border}"
    stroke-width="2" />

  <rect x="0" y="${H - 4}"
    width="${W}" height="4"
    fill="${palette.accent}"
    opacity="0.6" />

</svg>`;
}

// ─────────────────────────────────────────
// ROUTE HANDLER
// ─────────────────────────────────────────

export function GET(req: NextRequest) {
  const params = req.nextUrl.searchParams;

  const type = params.get('type') ?? 'icon';
  const defaultTheme = type === 'og' ? 'dark' : 'light';
  const theme = (params.get('theme') ?? defaultTheme) as 'light' | 'dark';

  const tokens = getCSSTokens(theme);
  const svg = type === 'og'
    ? buildOg(tokens)
    : buildIcon(tokens);

  return new Response(svg, {
    headers: {
      'Content-Type': 'image/svg+xml',
      'Cache-Control': 'public, max-age=86400, stale-while-revalidate=604800',
      'Vary': 'Accept, Accept-Encoding',
    },
  });
}