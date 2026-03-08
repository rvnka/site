"use client";
import { useState } from "react";

interface ShareButtonsProps {
  title: string;
  url: string;
}

type CopyState = "idle" | "copied" | "error";

export function ShareButtons({ title, url }: ShareButtonsProps) {
  const [copyState, setCopyState] = useState<CopyState>("idle");

  const copyLink = async () => {
    if (navigator.clipboard) {
      try {
        await navigator.clipboard.writeText(url);
        setCopyState("copied");
        setTimeout(() => setCopyState("idle"), 2000);
        return;
      } catch {
        // Clipboard API failed (permissions denied) — fall through to legacy
      }
    }

    // execCommand fallback for older browsers
    try {
      const ta = document.createElement("textarea");
      ta.value = url;
      ta.style.position = "fixed";
      ta.style.opacity = "0";
      document.body.appendChild(ta);
      ta.focus();
      ta.select();
      const ok = document.execCommand("copy");
      document.body.removeChild(ta);

      if (ok) {
        setCopyState("copied");
        setTimeout(() => setCopyState("idle"), 2000);
      } else {
        setCopyState("error");
        setTimeout(() => setCopyState("idle"), 3000);
      }
    } catch {
      setCopyState("error");
      setTimeout(() => setCopyState("idle"), 3000);
    }
  };

  const shareLinks = [
    {
      label: "Share on Twitter / X",
      icon: "bi-twitter-x",
      href: `https://twitter.com/intent/tweet?text=${encodeURIComponent(title)}&url=${encodeURIComponent(url)}`,
    },
    {
      label: "Share on LinkedIn",
      icon: "bi-linkedin",
      href: `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`,
    },
  ];

  const copyLabel =
    copyState === "copied"
      ? "Copied!"
      : copyState === "error"
        ? "Failed. try manually"
        : "Copy Link";

  const copyIcon =
    copyState === "copied"
      ? "bi-check2"
      : copyState === "error"
        ? "bi-exclamation-circle"
        : "bi-link-45deg";

  const copyBg =
    copyState === "copied"
      ? "color-mix(in srgb, #22c55e 12%, transparent)"
      : copyState === "error"
        ? "color-mix(in srgb, #f43f5e 12%, transparent)"
        : "var(--bg)";

  const copyBorder =
    copyState === "copied"
      ? "color-mix(in srgb, #22c55e 30%, transparent)"
      : copyState === "error"
        ? "color-mix(in srgb, #f43f5e 30%, transparent)"
        : "var(--border)";

  const copyColor =
    copyState === "copied"
      ? "#22c55e"
      : copyState === "error"
        ? "#f43f5e"
        : "var(--muted)";

  return (
    <div className="flex flex-wrap items-center gap-2">
      {shareLinks.map((s) => (
        <a
          key={s.label}
          href={s.href}
          aria-label={s.label}
          target="_blank"
          rel="noopener noreferrer"
          className="social-hover flex h-9 w-9 items-center justify-center rounded-[10px] border"
          style={{
            background: "var(--bg)",
            border: "1px solid var(--border)",
          }}
        >
          <i
            className={`bi ${s.icon} social-icon relative z-10 text-sm`}
            aria-hidden="true"
          />
        </a>
      ))}

      <button
        onClick={copyLink}
        aria-label={copyLabel}
        className="flex h-9 items-center gap-2 rounded-[10px] border px-3 text-sm font-medium transition-all duration-200"
        style={{
          background: copyBg,
          border: `1px solid ${copyBorder}`,
          color: copyColor,
        }}
      >
        <i className={`bi ${copyIcon} text-sm`} aria-hidden="true" />
        {copyLabel}
      </button>
    </div>
  );
}
