import { siteConfig } from "@/config/site-config";

export const activeSocial = siteConfig.social.filter(
  (s) => s.href && s.href !== "#" && s.href.length > 0,
);

interface SocialLink {
  label: string;
  href: string;
  icon: string;
  username?: string;
}

interface SocialLinksProps {
  links: readonly SocialLink[];
  /**
   * Variants:
   * - "icon"       (default) — icon-only button, used on homepage & footer
   * - "icon-label"           — icon + username
   * - "card"                 — full card with label, username, and arrow, used on contact page
   */
  variant?: "icon" | "icon-label" | "card";
  className?: string;
}

export function SocialLinks({
  links,
  variant = "icon",
  className = "",
}: SocialLinksProps) {
  if (variant === "card") {
    return (
      <nav aria-label="Social media links">
        <ul className={`flex flex-col gap-2.5 ${className}`}>
          {links.map((link) => (
            <li key={link.label}>
              <a
                href={link.href}
                target={link.href.startsWith("mailto:") ? undefined : "_blank"}
                rel={
                  link.href.startsWith("mailto:")
                    ? undefined
                    : "noopener noreferrer"
                }
                aria-label={
                  link.username
                    ? `${link.label} - ${link.username}`
                    : link.label
                }
                className="group flex items-center gap-3 rounded-[12px] border p-3 transition-all duration-200 hover:-translate-y-0.5"
                style={{
                  background: "var(--card)",
                  border: "1px solid var(--border)",
                  boxShadow: "0 1px 3px var(--shadow)",
                }}
              >
                <div
                  className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-[8px]"
                  style={{
                    background: "var(--bg)",
                    border: "1px solid var(--border)",
                  }}
                >
                  <i
                    className={`bi ${link.icon} text-sm`}
                    style={{ color: "var(--accent)" }}
                    aria-hidden="true"
                  />
                </div>

                <div className="min-w-0 flex-1">
                  <p
                    className="truncate text-xs font-medium"
                    style={{ color: "var(--fg)" }}
                  >
                    {link.label}
                  </p>
                  {link.username && (
                    <p
                      className="truncate text-xs"
                      style={{ color: "var(--faint)" }}
                    >
                      {link.username}
                    </p>
                  )}
                </div>

                <i
                  className="bi bi-arrow-right flex-shrink-0 text-xs transition-transform duration-200 group-hover:translate-x-0.5"
                  style={{ color: "var(--faint)" }}
                  aria-hidden="true"
                />
              </a>
            </li>
          ))}
        </ul>
      </nav>
    );
  }

  const withLabel = variant === "icon-label";
  return (
    <nav aria-label="Social media links">
      <ul
        className={`flex flex-wrap items-center justify-center gap-3 ${className}`}
      >
        {links.map((link) => (
          <li key={link.label}>
            <a
              href={link.href}
              aria-label={
                link.username ? `${link.label} - ${link.username}` : link.label
              }
              target={link.href.startsWith("mailto:") ? undefined : "_blank"}
              rel={
                link.href.startsWith("mailto:")
                  ? undefined
                  : "noopener noreferrer"
              }
              className={[
                "social-hover border transition-colors duration-200",
                withLabel
                  ? "flex items-center gap-2 rounded-[10px] px-3 py-2"
                  : "flex h-10 w-10 items-center justify-center rounded-[10px]",
              ].join(" ")}
              style={{
                background: "var(--card)",
                border: "1px solid var(--border)",
              }}
            >
              <i
                className={`bi ${link.icon} social-icon text-base`}
                aria-hidden="true"
              />
              {withLabel && link.username && (
                <span
                  className="relative z-10 text-sm font-medium transition-colors duration-300"
                  style={{ color: "var(--muted)" }}
                >
                  {link.username}
                </span>
              )}
            </a>
          </li>
        ))}
      </ul>
    </nav>
  );
}
