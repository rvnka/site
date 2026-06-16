'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useTheme } from 'next-themes';
import { useEffect, useMemo, useRef, useState, type CSSProperties } from 'react';
import { siteConfig } from '@/config/site';
import { useHamburgerMenuAnimation } from '@/hooks/use-anime';

const headerBase: CSSProperties = {
  background: 'transparent',
  borderBottom: '1px solid transparent',
  backdropFilter: 'none',
  WebkitBackdropFilter: 'none',
  transition: 'background 280ms cubic-bezier(0.4,0,0.2,1), border-color 280ms cubic-bezier(0.4,0,0.2,1), backdrop-filter 280ms cubic-bezier(0.4,0,0.2,1)',
};

export function Header() {
  const pathname = usePathname();
  const { resolvedTheme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    setMounted(true);

    const onScroll = () => setScrolled(window.scrollY > 14);
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();

    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const headerStyle = useMemo<CSSProperties>(() => ({
    ...headerBase,
    background: scrolled ? 'color-mix(in srgb, var(--card) 92%, transparent)' : 'transparent',
    borderBottom: scrolled ? '1px solid color-mix(in srgb, var(--border) 65%, transparent)' : '1px solid transparent',
    backdropFilter: scrolled ? 'blur(14px)' : 'none',
    WebkitBackdropFilter: scrolled ? 'blur(14px)' : 'none',
    boxShadow: scrolled ? '0 10px 30px color-mix(in srgb, var(--shadow) 60%, transparent)' : 'none',
  }), [scrolled]);

  return (
    <header style={headerStyle} className='sticky top-0 z-50'>
      <div className='mx-auto flex max-w-3xl items-center justify-between px-6 py-4'>
        <Link href='/' className='font-serif text-xl font-bold tracking-tight transition-opacity hover:opacity-80' style={{ color: 'var(--fg)' }}>
          {siteConfig.profile.name}
          <span style={{ color: 'var(--accent)' }}>.</span>
        </Link>

        <nav className='hidden items-center gap-1 sm:flex' aria-label='Main navigation'>
          {siteConfig.nav.map((item) => {
            const active = item.href === '/' ? pathname === '/' : pathname.startsWith(item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                aria-current={active ? 'page' : undefined}
                className='rounded-full px-3.5 py-1.5 text-sm font-medium transition-all duration-200 hover:-translate-y-0.5'
                style={{
                  color: active ? 'var(--fg)' : 'var(--muted)',
                  background: active ? 'color-mix(in srgb, var(--accent) 10%, transparent)' : 'transparent',
                }}
              >
                {item.label}
              </Link>
            );
          })}
        </nav>

        <div className='flex items-center gap-4'>
          {mounted && (
            <button
              type='button'
              onClick={() => setTheme(resolvedTheme === 'dark' ? 'light' : 'dark')}
              aria-label={`Switch to ${resolvedTheme === 'dark' ? 'light' : 'dark'} mode`}
              className='group relative inline-flex h-10 w-10 items-center justify-center rounded-full border transition-all duration-200 hover:-translate-y-0.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent)] focus-visible:ring-offset-2'
              style={{
                border: '1px solid var(--border)',
                color: 'var(--fg)',
                background: 'var(--card)',
                boxShadow: '0 1px 3px var(--shadow)',
              }}
            >
              <i
                className='bi bi-sun-fill absolute text-base transition-all duration-300'
                style={{
                  opacity: resolvedTheme === 'dark' ? 1 : 0,
                  visibility: resolvedTheme === 'dark' ? 'visible' : 'hidden',
                  transform: resolvedTheme === 'dark' ? 'scale(1) rotate(0)' : 'scale(0.75) rotate(-90deg)',
                }}
                aria-hidden='true'
              />
              <i
                className='bi bi-moon-fill absolute text-base transition-all duration-300'
                style={{
                  opacity: resolvedTheme === 'dark' ? 0 : 1,
                  visibility: resolvedTheme === 'dark' ? 'hidden' : 'visible',
                  transform: resolvedTheme === 'dark' ? 'scale(0.75) rotate(90deg)' : 'scale(1) rotate(0)',
                }}
                aria-hidden='true'
              />
            </button>
          )}
          <MobileNav pathname={pathname} />
        </div>
      </div>
    </header>
  );
}

function MobileNav({ pathname }: { pathname: string }) {
  const [open, setOpen] = useState(false);
  const [visible, setVisible] = useState(false);
  const wrapperRef = useRef<HTMLDivElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);
  const closeTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const hamburgerRef = useHamburgerMenuAnimation(open);

  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  useEffect(() => {
    if (open) {
      setVisible(true);
      if (closeTimerRef.current) {
        clearTimeout(closeTimerRef.current);
        closeTimerRef.current = null;
      }
      return;
    }

    closeTimerRef.current = setTimeout(() => {
      setVisible(false);
      closeTimerRef.current = null;
    }, 180);

    return () => {
      if (closeTimerRef.current) {
        clearTimeout(closeTimerRef.current);
        closeTimerRef.current = null;
      }
    };
  }, [open]);

  useEffect(() => {
    if (!open) return;

    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpen(false);
    };

    const onPointerDown = (event: MouseEvent | TouchEvent) => {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target as Node)) {
        setOpen(false);
      }
    };

    window.addEventListener('keydown', onKey);
    document.addEventListener('mousedown', onPointerDown);
    document.addEventListener('touchstart', onPointerDown, { passive: true });

    return () => {
      window.removeEventListener('keydown', onKey);
      document.removeEventListener('mousedown', onPointerDown);
      document.removeEventListener('touchstart', onPointerDown);
    };
  }, [open]);

  return (
    <div ref={wrapperRef} className='relative sm:hidden'>
      <button
        type='button'
        onClick={() => setOpen((prev) => !prev)}
        aria-label={open ? 'Close menu' : 'Open menu'}
        aria-expanded={open}
        aria-controls='mobile-menu'
        className='flex h-10 w-10 items-center justify-center rounded-full border transition-all duration-200 hover:-translate-y-0.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent)] focus-visible:ring-offset-2'
        style={{
          border: open ? '1px solid color-mix(in srgb, var(--accent) 50%, var(--border))' : '1px solid var(--border)',
          color: open ? 'var(--accent)' : 'var(--fg)',
          background: open ? 'color-mix(in srgb, var(--accent) 10%, transparent)' : 'var(--card)',
          boxShadow: '0 1px 3px var(--shadow)',
        }}
      >
        <svg
          ref={hamburgerRef}
          className='h-5 w-5'
          viewBox='0 0 32 32'
          fill='none'
          stroke='currentColor'
          strokeWidth='2'
          strokeLinecap='round'
        >
          <line x1='7' y1='9' x2='25' y2='9' />
          <line x1='7' y1='16' x2='25' y2='16' />
          <line x1='7' y1='23' x2='25' y2='23' />
        </svg>
      </button>

      {visible && (
        <div
          ref={menuRef}
          id='mobile-menu'
          role='menu'
          aria-hidden={!open}
          className='absolute right-0 top-full mt-2 w-52 overflow-hidden rounded-2xl border p-2 shadow-xl'
          style={{
            background: 'color-mix(in srgb, var(--card) 96%, transparent)',
            borderColor: 'color-mix(in srgb, var(--border) 80%, transparent)',
            backdropFilter: 'blur(16px)',
            WebkitBackdropFilter: 'blur(16px)',
            transform: open ? 'translateY(0) scale(1)' : 'translateY(-6px) scale(0.98)',
            opacity: open ? 1 : 0,
            transition: 'opacity 180ms ease, transform 180ms ease',
          }}
        >
          {siteConfig.nav.map((item, index) => {
            const active = item.href === '/' ? pathname === '/' : pathname.startsWith(item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                role='menuitem'
                aria-current={active ? 'page' : undefined}
                onClick={() => setOpen(false)}
                className='block rounded-xl px-3.5 py-2.5 text-sm font-medium transition-colors duration-200 hover:bg-[color-mix(in_srgb,var(--accent)_8%,transparent)]'
                style={{
                  color: active ? 'var(--fg)' : 'var(--muted)',
                  animationDelay: `${index * 50}ms`,
                }}
              >
                {item.label}
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}
