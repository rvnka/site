import type { Metadata } from "next";
import Image from "next/image";
import { siteConfig } from "@/config/site-config";
import { Button } from "@/components/ui/Button";

export const metadata: Metadata = {
  title: "About",
  description: `Learn more about ${siteConfig.profile.name} - student and developer.`,
};

function hasEmail(email: string): boolean {
  return email.length > 0 && email !== "undefined" && email.includes("@");
}

export default function AboutPage() {
  return (
    <div className="mx-auto max-w-3xl px-6 py-12">
      <div className="mb-12">
        <p
          className="mb-2 text-xs font-semibold uppercase tracking-widest"
          style={{ color: "var(--accent)" }}
        >
          About
        </p>
        <h1
          className="font-serif mb-4 text-4xl font-bold tracking-tight"
          style={{ color: "var(--fg)", letterSpacing: "-0.02em" }}
        >
          Hey, I&apos;m {siteConfig.profile.name} 👋
        </h1>
        <p
          className="max-w-xl text-base leading-7"
          style={{ color: "var(--muted)" }}
        >
          {siteConfig.profile.bio}
        </p>
      </div>

      <div
        className="mb-16 flex flex-col items-center gap-6 rounded-[14px] border p-6 sm:flex-row sm:items-start"
        style={{
          background: "var(--card)",
          border: "1px solid var(--border)",
          boxShadow: "0 1px 3px var(--shadow)",
        }}
      >
        <Image
          src={siteConfig.profile.avatar}
          alt={siteConfig.profile.name}
          width={96}
          height={96}
          className="h-24 w-24 flex-shrink-0 rounded-full border object-cover"
          style={{ borderColor: "var(--border)" }}
        />
        <div>
          <h2
            className="font-serif text-xl font-bold"
            style={{ color: "var(--fg)" }}
          >
            {siteConfig.profile.name}
          </h2>
          <p className="text-sm" style={{ color: "var(--muted)" }}>
            {siteConfig.profile.username}
          </p>
          <div className="mt-3 flex flex-wrap gap-2">
            <InfoChip icon="bi-geo-alt" label={siteConfig.profile.location} />
            <InfoChip
              icon="bi-calendar3"
              label={`Coding since ${siteConfig.profile.startYear}`}
            />
            {hasEmail(siteConfig.profile.email) && (
              <InfoChip icon="bi-envelope" label={siteConfig.profile.email} />
            )}
            {siteConfig.profile.available && (
              <InfoChip
                icon="bi-circle-fill"
                label="Available for work"
                accent
              />
            )}
          </div>
        </div>
      </div>

      <TimelineSection title="Timeline" icon="bi-briefcase">
        {siteConfig.timeline.map((item, i) => (
          <TimelineItem
            key={i}
            year={item.year}
            title={item.title}
            description={item.description}
          />
        ))}
      </TimelineSection>

      <TimelineSection title="Education" icon="bi-mortarboard">
        {siteConfig.edu_timeline.map((item, i) => (
          <TimelineItem
            key={i}
            year={item.year}
            title={item.institution}
            description={item.description}
          />
        ))}
      </TimelineSection>

      <section className="mb-12">
        <h2
          className="font-serif mb-6 text-2xl font-bold tracking-tight"
          style={{ color: "var(--fg)", letterSpacing: "-0.02em" }}
        >
          Tech Stack
        </h2>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
          {siteConfig.skills.map((skill) => (
            <div
              key={skill.name}
              className="flex items-center gap-3 rounded-[14px] border p-3.5 transition-all duration-200 hover:-translate-y-0.5"
              style={{
                background: "var(--card)",
                border: "1px solid var(--border)",
                boxShadow: "0 1px 3px var(--shadow)",
              }}
            >
              <i
                className={`bi ${skill.icon} text-xl`}
                style={{ color: skill.color }}
              />
              <span
                className="text-sm font-medium"
                style={{ color: "var(--fg)" }}
              >
                {skill.name}
              </span>
            </div>
          ))}
        </div>
      </section>

      <div
        className="flex flex-wrap items-center gap-3 border-t pt-12"
        style={{ borderColor: "var(--border)" }}
      >
        <Button href="/project" variant="primary" icon="bi-grid">
          View Projects
        </Button>
        <Button href="/contact" variant="outline" icon="bi-envelope">
          Contact Me
        </Button>
      </div>
    </div>
  );
}

function TimelineSection({
  title,
  icon,
  children,
}: {
  title: string;
  icon: string;
  children: React.ReactNode;
}) {
  return (
    <section className="mb-16">
      <div className="mb-6 flex items-center gap-2">
        <i
          className={`bi ${icon} text-xl`}
          style={{ color: "var(--accent)" }}
        />
        <h2
          className="font-serif text-2xl font-bold tracking-tight"
          style={{ color: "var(--fg)", letterSpacing: "-0.02em" }}
        >
          {title}
        </h2>
      </div>
      <div className="flex flex-col gap-4">{children}</div>
    </section>
  );
}

function TimelineItem({
  year,
  title,
  description,
}: {
  year: string;
  title: string;
  description: string;
}) {
  return (
    <div
      className="rounded-[14px] border p-5 transition-all duration-200 hover:-translate-y-1"
      style={{
        background: "var(--card)",
        border: "1px solid var(--border)",
        boxShadow: "0 1px 3px var(--shadow)",
      }}
    >
      <p
        className="mb-1 text-xs font-bold uppercase tracking-widest"
        style={{ color: "var(--accent)" }}
      >
        {year}
      </p>
      <h3
        className="font-serif mb-2 text-lg font-semibold"
        style={{ color: "var(--fg)" }}
      >
        {title}
      </h3>
      <p className="text-sm leading-relaxed" style={{ color: "var(--muted)" }}>
        {description}
      </p>
    </div>
  );
}

function InfoChip({
  icon,
  label,
  accent,
}: {
  icon: string;
  label: string;
  accent?: boolean;
}) {
  return (
    <span
      className="inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-medium"
      style={{
        background: accent
          ? "color-mix(in srgb, #22c55e 12%, transparent)"
          : "var(--bg)",
        color: accent ? "#22c55e" : "var(--muted)",
        border: `1px solid ${
          accent
            ? "color-mix(in srgb, #22c55e 30%, transparent)"
            : "var(--border)"
        }`,
      }}
    >
      <i className={`bi ${icon} text-xs`} />
      {label}
    </span>
  );
}
