import 'server-only';
import fs from 'fs';
import path from 'path';

export type Theme = 'light' | 'dark';

type ThemeTokens = Record<string, string>;

let cachedLight: ThemeTokens | null = null;
let cachedDark: ThemeTokens | null = null;
let lastMtime = 0;

function extractTokens(block: string): ThemeTokens {
  const tokens: ThemeTokens = {};
  const re = /(--[\w-]+)\s*:\s*([^;]+);/g;
  let m: RegExpExecArray | null;
  while ((m = re.exec(block)) !== null) tokens[m[1].trim()] = m[2].trim();
  return tokens;
}

function extractBlock(css: string, selector: string): string | null {
  const m = css.match(new RegExp(`${selector}\\s*\\{([\\s\\S]*?)\\}`, 'm'));
  return m ? m[1] : null;
}

function parseCSS() {
  const cssPath = path.join(process.cwd(), 'src', 'app', 'globals.css');
  try {
    const stat = fs.statSync(cssPath);
    if (stat.mtimeMs === lastMtime && cachedLight && cachedDark) return;
    const css = fs.readFileSync(cssPath, 'utf-8');
    const rootTokens = extractTokens(extractBlock(css, ':root') ?? '');
    const darkTokens = extractTokens(extractBlock(css, '\\.dark') ?? '');
    cachedLight = rootTokens;
    cachedDark = { ...rootTokens, ...darkTokens };
    lastMtime = stat.mtimeMs;
  } catch {
    cachedLight = cachedLight ?? {};
    cachedDark = cachedDark ?? {};
  }
}

export function getCSSTokens(theme: Theme): ThemeTokens {
  parseCSS();
  return theme === 'dark' ? cachedDark ?? {} : cachedLight ?? {};
}

export function getCSSToken(theme: Theme, key: string, fallback = ''): string {
  return getCSSTokens(theme)[key] ?? fallback;
}

// Runs before hydration to prevent the wrong theme from flashing on first paint.
export function getThemeInitScript(): string {
  return `(() => {
    try {
      const storageKey = 'theme';
      const saved = localStorage.getItem(storageKey);
      const systemDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      const theme = saved === 'light' || saved === 'dark' ? saved : (systemDark ? 'dark' : 'light');
      const root = document.documentElement;
      root.classList.toggle('dark', theme === 'dark');
      root.style.colorScheme = theme;
    } catch (error) {
      document.documentElement.classList.add('dark');
      document.documentElement.style.colorScheme = 'dark';
    }
  })();`;
}
