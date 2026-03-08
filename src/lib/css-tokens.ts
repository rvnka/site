/**
 * src/lib/css-tokens.ts
 *
 * Smart CSS token parser with:
 * - File read caching
 * - Root + Dark merge strategy
 * - Safe parsing
 * - Zero duplication across server renders
 */

import 'server-only';
import fs from 'fs';
import path from 'path';

export type Theme = 'light' | 'dark';
export type ThemeTokens = Record<string, string>;

let cachedLight: ThemeTokens | null = null;
let cachedDark: ThemeTokens | null = null;
let lastMtime = 0;

/**
 * Extracts all `--var: value;` pairs from a CSS block string.
 */
function extractTokens(block: string): ThemeTokens {
  const tokens: ThemeTokens = {};

  const re = /(--[\w-]+)\s*:\s*([^;]+);/g;
  let match: RegExpExecArray | null;

  while ((match = re.exec(block)) !== null) {
    tokens[match[1].trim()] = match[2].trim();
  }

  return tokens;
}

/**
 * Extracts a CSS block like `:root { ... }`
 */
function extractBlock(css: string, selector: string): string | null {
  const re = new RegExp(`${selector}\\s*\\{([\\s\\S]*?)\\}`, 'm');
  const match = css.match(re);
  return match ? match[1] : null;
}

/**
 * Parses globals.css and builds theme maps.
 */
function parseCSS(): void {
  const cssPath = path.join(process.cwd(), 'src', 'app', 'globals.css');

  const stat = fs.statSync(cssPath);

  // If file unchanged → skip parsing
  if (stat.mtimeMs === lastMtime && cachedLight && cachedDark) {
    return;
  }

  const css = fs.readFileSync(cssPath, 'utf-8');

  const rootBlock = extractBlock(css, ':root') ?? '';
  const darkBlock = extractBlock(css, '\\.dark') ?? '';

  const rootTokens = extractTokens(rootBlock);
  const darkTokens = extractTokens(darkBlock);

  // Light = :root
  cachedLight = rootTokens;

  // Dark = :root + overrides
  cachedDark = {
    ...rootTokens,
    ...darkTokens,
  };

  lastMtime = stat.mtimeMs;
}

/**
 * Returns tokens for requested theme.
 */
export function getCSSTokens(theme: Theme): ThemeTokens {
  parseCSS();
  return theme === 'dark'
    ? cachedDark ?? {}
    : cachedLight ?? {};
}

/**
 * Returns a single token value safely.
 */
export function getCSSToken(
  theme: Theme,
  key: string,
  fallback = '',
): string {
  const tokens = getCSSTokens(theme);
  return tokens[key] ?? fallback;
}