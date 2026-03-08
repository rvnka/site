interface BadgeProps {
  children: React.ReactNode;
  variant?: "default" | "accent" | "outline";
  className?: string;
}

export function Badge({
  children,
  variant = "default",
  className = "",
}: BadgeProps) {
  const styles: Record<string, React.CSSProperties> = {
    default: {
      background: "var(--card)",
      color: "var(--muted)",
      border: "1px solid var(--border)",
    },
    accent: {
      background: "color-mix(in srgb, var(--accent) 12%, transparent)",
      color: "var(--accent)",
      border: "1px solid color-mix(in srgb, var(--accent) 30%, transparent)",
    },
    outline: {
      background: "transparent",
      color: "var(--muted)",
      border: "1px solid var(--border)",
    },
  };

  return (
    <span
      className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${className}`}
      style={styles[variant]}
    >
      {children}
    </span>
  );
}
