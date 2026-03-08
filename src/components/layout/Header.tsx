"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useTheme } from "next-themes";
import { useEffect, useRef, useState } from "react";
import { siteConfig } from "@/config/site-config";
import { useHamburgerMenuAnimation } from '@/hooks/use-animations';

export function Header() {
  const pathname = usePathname();
  // resolvedTheme ensures "system" resolves to actual dark/light value
  const { resolvedTheme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    setMounted(true);
    const onScroll = () => setScrolled(window.scrollY > 12);
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const toggleTheme = () =>
    setTheme(resolvedTheme === "dark" ? "light" : "dark");

  const headerStyle: React.CSSProperties = {
    background: scrolled
      ? "color-mix(in srgb, var(--card) 95%, transparent)"
      : "transparent",
    borderBottom: scrolled
      ? "1px solid color-mix(in srgb, var(--border) 50%, transparent)"
      : "1px solid transparent",
    backdropFilter: scrolled ? "blur(12px)" : "none",
    WebkitBackdropFilter: scrolled ? "blur(12px)" : "none",
    transition: "all 0.3s cubic-bezier(0.4,0,0.2,1)",
  };

  return (
    <header style={headerStyle} className="sticky top-0 z-50">
      <div className="mx-auto flex max-w-3xl items-center justify-between px-6 py-4">
        <Link
          href="/"
          className="font-serif text-xl font-bold tracking-tight"
          style={{ color: "var(--fg)" }}
        >
          Rinn<span style={{ color: "var(--accent)" }}>.</span>
        </Link>

        <nav
          className="hidden items-center gap-1 sm:flex"
          aria-label="Main navigation"
        >
          {siteConfig.nav.map((item) => {
            const active =
              item.href === "/"
                ? pathname === "/"
                : pathname.startsWith(item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                aria-current={active ? "page" : undefined}
                className="rounded-lg px-3 py-1.5 text-sm font-medium transition-all duration-200"
                style={{
                  color: active ? "var(--accent)" : "var(--muted)",
                  background: active
                    ? "color-mix(in srgb, var(--accent) 10%, transparent)"
                    : "transparent",
                }}
              >
                {item.label}
              </Link>
            );
          })}
        </nav>

        <div className="flex items-center gap-4">
          {mounted && (
            <button
              onClick={toggleTheme}
              aria-label={`Switch to ${resolvedTheme === "dark" ? "light" : "dark"} mode`}
              className="relative inline-flex h-5 w-5 cursor-pointer items-center justify-center focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2"
              style={{
                color: "var(--fg)",
              }}
            >
              {/* Sun icon - appears in dark mode */}
              <i
                className="bi bi-sun-fill absolute text-base transition-opacity duration-300"
                style={{
                  opacity: resolvedTheme === "dark" ? 1 : 0,
                  visibility: resolvedTheme === "dark" ? "visible" : "hidden",
                }}
                aria-hidden="true"
              />
              {/* Moon icon - appears in light mode */}
              <i
                className="bi bi-moon-fill absolute text-base transition-opacity duration-300"
                style={{
                  opacity: resolvedTheme === "dark" ? 0 : 1,
                  visibility: resolvedTheme === "dark" ? "hidden" : "visible",
                }}
                aria-hidden="true"
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
  const wrapperRef = useRef<HTMLDivElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);
  const hamburgerRef = useHamburgerMenuAnimation(open);

  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const handler = (e: MouseEvent) => {
      if (
        wrapperRef.current &&
        !wrapperRef.current.contains(e.target as Node)
      ) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [open]);

  useEffect(() => {
    const menu = menuRef.current;
    if (!menu || typeof window === "undefined") return;

    void import("animejs").then(({ animate }) => {
      if (open) {
        animate(menu, {
          opacity: [0, 1],
          scale: [0.95, 1],
          translateY: [-10, 0],
          duration: 300,
          ease: "outQuart",
        });
      } else {
        animate(menu, {
          opacity: [1, 0],
          scale: [1, 0.95],
          translateY: [0, -10],
          duration: 200,
          ease: "inQuart",
        });
      }
    });
  }, [open]);

  return (
    <div ref={wrapperRef} className="relative sm:hidden">
      <button
        onClick={() => setOpen(!open)}
        aria-label={open ? "Close menu" : "Open menu"}
        aria-expanded={open}
        aria-controls="mobile-menu"
        className="flex h-9 w-9 items-center justify-center rounded-lg border transition-all duration-300 hover:-translate-y-0.5"
        style={{
          border: open
            ? "1px solid color-mix(in srgb, var(--accent) 50%, var(--border))"
            : "1px solid var(--border)",
          color: open ? "var(--accent)" : "var(--fg)",
          background: open
            ? "color-mix(in srgb, var(--accent) 10%, transparent)"
            : "transparent",
          backdropFilter: open ? "blur(10px)" : "none",
          WebkitBackdropFilter: open ? "blur(10px)" : "none",
        }}
      >
        <svg
          ref={hamburgerRef}
          className="h-5 w-5"
          viewBox="0 0 32 32"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
        >
          <line x1="7" y1="9" x2="25" y2="9" />
          <line x1="7" y1="16" x2="25" y2="16" />
          <line x1="7" y1="23" x2="25" y2="23" />
        </svg>
      </button>

      {open && (
        <div
          ref={menuRef}
          id="mobile-menu"
          role="menu"
          className="absolute right-0 top-full mt-2 w-48 overflow-hidden rounded-[14px] border py-1 shadow-lg"
          style={{
            background: "color-mix(in srgb, var(--card) 95%, transparent)",
            borderColor: "color-mix(in srgb, var(--border) 80%, transparent)",
            backdropFilter: "blur(12px)",
            WebkitBackdropFilter: "blur(12px)",
          }}
        >
          {siteConfig.nav.map((item, index) => {
            const active =
              item.href === "/"
                ? pathname === "/"
                : pathname.startsWith(item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                role="menuitem"
                aria-current={active ? "page" : undefined}
                onClick={() => setOpen(false)}
                className="block px-4 py-2.5 text-sm font-medium transition-all duration-200 hover:bg-[color-mix(in_srgb,var(--accent)_8%,transparent)]"
                style={{
                  color: active ? "var(--accent)" : "var(--muted)",
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
