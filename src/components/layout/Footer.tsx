import Link from "next/link";
import { siteConfig } from "@/config/site-config";
import { SocialLinks, activeSocial } from "@/components/ui/SocialLinks";

export function Footer() {
  const year = new Date().getFullYear();
  const githubLink = activeSocial.find((s) => s.icon === "bi-github");

  return (
    <footer
      className="mt-20 border-t py-10 text-center"
      style={{ borderColor: "var(--border)" }}
    >
      <div className="mx-auto max-w-3xl px-6">
        {activeSocial.length > 0 && (
          <div className="mb-6">
            <SocialLinks links={activeSocial} />
          </div>
        )}

        <nav aria-label="Footer navigation">
          <ul className="mb-6 flex flex-wrap items-center justify-center gap-x-5 gap-y-1">
            {siteConfig.nav.map((item) => (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className="text-sm transition-colors duration-200 hover:text-[var(--accent)]"
                  style={{ color: "var(--faint)" }}
                >
                  {item.label}
                </Link>
              </li>
            ))}
            <li>
              <a
                href="/feed.xml"
                className="text-sm transition-colors duration-200 hover:text-[var(--accent)]"
                style={{ color: "var(--faint)" }}
              >
                RSS
              </a>
            </li>
            <li>
              <a
                href="/sitemap.xml"
                className="text-sm transition-colors duration-200 hover:text-[var(--accent)]"
                style={{ color: "var(--faint)" }}
              >
                Sitemap
              </a>
            </li>
          </ul>
        </nav>

        <p className="text-sm" style={{ color: "var(--faint)" }}>
          Built with{" "}
          <span className="heart" aria-hidden="true">
            ♡
          </span>{" "}
          by{" "}
          <a
            href={githubLink?.href ?? "#"}
            target="_blank"
            rel="noopener noreferrer"
            className="font-medium transition-colors hover:text-[var(--accent)]"
            style={{ color: "var(--muted)" }}
          >
            {siteConfig.profile.username}
          </a>
        </p>
        <p className="mt-1 text-xs" style={{ color: "var(--faint)" }}>
          © {siteConfig.profile.startYear} – {year} {siteConfig.profile.name}
        </p>
      </div>
    </footer>
  );
}
