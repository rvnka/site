"use client";
import { useCallback } from "react";
import { searchQuerySchema } from "@/types";

interface SearchInputProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}

// Extends CSSProperties to allow CSS custom property strings inline in React.
type StyleWithVars = React.CSSProperties & {
  [key: `--${string}`]: string;
};

export function SearchInput({
  value,
  onChange,
  placeholder = "Search…",
}: SearchInputProps) {
  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const raw = e.target.value;
      const result = searchQuerySchema.safeParse({ q: raw });
      if (result.success) {
        onChange(result.data.q);
      }
    },
    [onChange],
  );

  const inputStyle: StyleWithVars = {
    background: "var(--card)",
    border: "1px solid var(--border)",
    color: "var(--fg)",
  };

  return (
    <div className="relative">
      <i
        className="bi bi-search absolute left-3.5 top-1/2 -translate-y-1/2 text-sm"
        style={{ color: "var(--faint)" }}
        aria-hidden="true"
      />
      <input
        type="search"
        value={value}
        onChange={handleChange}
        placeholder={placeholder}
        aria-label="Search"
        autoComplete="off"
        spellCheck={false}
        className="w-full rounded-[10px] border py-2.5 pl-9 pr-4 text-sm outline-none transition-colors duration-200"
        style={inputStyle}
        onFocus={(e) => {
          e.currentTarget.style.borderColor = "var(--accent)";
          e.currentTarget.style.boxShadow =
            "0 0 0 3px color-mix(in srgb, var(--accent) 20%, transparent)";
        }}
        onBlur={(e) => {
          e.currentTarget.style.borderColor = "var(--border)";
          e.currentTarget.style.boxShadow = "none";
        }}
      />
    </div>
  );
}
