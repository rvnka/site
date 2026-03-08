import Link from "next/link";

interface ButtonProps {
  children: React.ReactNode;
  href?: string;
  variant?: "primary" | "ghost" | "outline";
  size?: "sm" | "md" | "lg";
  external?: boolean;
  icon?: string;
  className?: string;
  onClick?: () => void;
  type?: "button" | "submit" | "reset";
  disabled?: boolean;
}

const SIZE_CLASSES = {
  sm: "px-3 py-1.5 text-sm",
  md: "px-4 py-2 text-sm",
  lg: "px-6 py-3 text-base",
} as const;

const VARIANT_STYLES: Record<string, React.CSSProperties> = {
  primary: {
    background: "var(--accent)",
    color: "#fff",
    border: "1px solid var(--accent)",
  },
  ghost: {
    background: "transparent",
    color: "var(--muted)",
    border: "1px solid transparent",
  },
  outline: {
    background: "var(--card)",
    color: "var(--fg)",
    border: "1px solid var(--border)",
  },
} as const;

const BASE_CLASS =
  "inline-flex items-center gap-2 rounded-[10px] font-medium transition-all duration-300 hover:-translate-y-0.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent)] focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50";

export function Button({
  children,
  href,
  variant = "outline",
  size = "md",
  external,
  icon,
  className = "",
  onClick,
  type = "button",
  disabled,
}: ButtonProps) {
  const cls = `${BASE_CLASS} ${SIZE_CLASSES[size]} ${className}`;
  const style = VARIANT_STYLES[variant];

  if (href) {
    return (
      <Link
        href={href}
        className={cls}
        style={style}
        target={external ? "_blank" : undefined}
        rel={external ? "noopener noreferrer" : undefined}
      >
        {icon && <i className={`bi ${icon} text-sm`} aria-hidden="true" />}
        {children}
      </Link>
    );
  }

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={cls}
      style={style}
    >
      {icon && <i className={`bi ${icon} text-sm`} aria-hidden="true" />}
      {children}
    </button>
  );
}
