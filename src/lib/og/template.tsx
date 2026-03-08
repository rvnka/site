/**
 * src/lib/og/template.tsx
 *
 * Fully theme-safe Open Graph layout.
 * Reads live tokens from globals.css via getCSSTokens().
 */

import { getCSSTokens } from '@/lib/css-tokens';
import { siteConfig } from '@/config/site-config';

export const OG_SIZE = { width: 1200, height: 630 };

// ─────────────────────────────────────────
// Types
// ─────────────────────────────────────────

export type OGTheme = 'light' | 'dark';

export interface OGImageProps {
  title: string;
  description?: string;
  category?: string;
  chips?: string[];
  metaLabel?: string;
  theme?: OGTheme;
}

// ─────────────────────────────────────────
// Component
// ─────────────────────────────────────────

export function OGImage({
  title,
  description,
  category,
  chips,
  metaLabel,
  theme = 'dark',
}: OGImageProps) {
  const t = getCSSTokens(theme);

  /**
   * CENTRALIZED PALETTE RESOLUTION
   * Ensures every color always exists.
   */

  const palette = {
    bg:
      t['--bg'] ??
      (theme === 'dark' ? '#0c0a09' : '#fafaf9'),

    card:
      t['--card'] ??
      (theme === 'dark' ? '#1c1917' : '#ffffff'),

    fg:
      t['--fg'] ??
      (theme === 'dark' ? '#fafaf9' : '#171717'),

    muted:
      t['--muted'] ??
      (theme === 'dark' ? '#a8a29e' : '#737373'),

    faint:
      t['--faint'] ??
      (theme === 'dark' ? '#78716c' : '#a3a3a3'),

    accent:
      t['--accent'] ??
      (theme === 'dark' ? '#60a5fa' : '#3b82f6'),

    border:
      t['--border'] ??
      (theme === 'dark' ? '#292524' : '#e7e5e4'),
  };

  // Safe rgba generation (works only if hex)
  const accentRgb = safeHexToRgb(palette.accent);

  const pillBg = accentRgb
    ? `rgba(${accentRgb}, 0.15)`
    : palette.card;

  const pillBorder = accentRgb
    ? `rgba(${accentRgb}, 0.35)`
    : palette.border;

  const truncDesc =
    description && description.length > 120
      ? description.slice(0, 120) + '…'
      : description;

  return (
    <div
      style={{
        width: '100%',
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        padding: '64px',
        background: palette.bg,
        fontFamily: 'system-ui, sans-serif',
      }}
    >
      {/* ───────── TOP ROW ───────── */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
        {category && (
          <span
            style={{
              background: pillBg,
              color: palette.accent,
              border: `1px solid ${pillBorder}`,
              borderRadius: 999,
              padding: '4px 14px',
              fontSize: 18,
              fontWeight: 600,
            }}
          >
            {category}
          </span>
        )}

        {metaLabel && (
          <span style={{ color: palette.faint, fontSize: 18 }}>
            {metaLabel}
          </span>
        )}
      </div>

      {/* ───────── MAIN CONTENT ───────── */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
        <h1
          style={{
            fontSize: title.length > 50 ? 52 : 64,
            fontWeight: 700,
            color: palette.fg,
            lineHeight: 1.15,
            letterSpacing: '-0.02em',
            margin: 0,
            maxWidth: 900,
          }}
        >
          {title}
        </h1>

        {truncDesc && (
          <p
            style={{
              fontSize: 22,
              color: palette.muted,
              margin: 0,
              maxWidth: 800,
              lineHeight: 1.5,
            }}
          >
            {truncDesc}
          </p>
        )}

        {chips && chips.length > 0 && (
          <div style={{ display: 'flex', gap: 8, marginTop: 8 }}>
            {chips.map((chip) => (
              <span
                key={chip}
                style={{
                  background: palette.card,
                  color: palette.muted,
                  border: `1px solid ${palette.border}`,
                  borderRadius: 6,
                  padding: '4px 12px',
                  fontSize: 16,
                }}
              >
                {chip}
              </span>
            ))}
          </div>
        )}
      </div>

      {/* ───────── FOOTER ───────── */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <img
            src={siteConfig.profile.avatar}
            alt={siteConfig.profile.name}
            width={44}
            height={44}
            style={{
              borderRadius: '50%',
              border: `2px solid ${palette.border}`,
            }}
          />

          <span
            style={{
              color: palette.muted,
              fontSize: 20,
              fontWeight: 500,
            }}
          >
            {siteConfig.profile.name} ·{' '}
            {siteConfig.meta.url.replace('https://', '')}
          </span>
        </div>

        <span
          style={{
            color: palette.accent,
            fontSize: 20,
            fontWeight: 700,
            letterSpacing: '-0.01em',
          }}
        >
          {siteConfig.meta.title}.
        </span>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────
// Utility
// ─────────────────────────────────────────

function safeHexToRgb(hex: string): string | null {
  if (!hex || !hex.startsWith('#')) return null;

  let h = hex.replace('#', '');

  if (h.length === 3)
    h = h.split('').map((c) => c + c).join('');

  if (h.length !== 6) return null;

  const n = parseInt(h, 16);

  return `${(n >> 16) & 255}, ${(n >> 8) & 255}, ${n & 255}`;
}