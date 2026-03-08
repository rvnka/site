import type { Metadata } from "next";
import { siteConfig } from "@/config/site-config";
import { ContactForm } from "./ContactForm";
import { SocialLinks, activeSocial } from "@/components/ui/SocialLinks";

export const metadata: Metadata = {
  title: "Contact",
  description: `Get in touch with ${siteConfig.profile.name}, let's work on something great together.`,
};

export default function ContactPage() {
  return (
    <div className="mx-auto max-w-3xl px-6 py-12">
      <div className="mb-10">
        <p
          className="mb-2 text-xs font-semibold uppercase tracking-widest"
          style={{ color: "var(--accent)" }}
        >
          Contact
        </p>
        <h1
          className="font-serif mb-3 text-4xl font-bold tracking-tight"
          style={{ color: "var(--fg)", letterSpacing: "-0.02em" }}
        >
          Say Hello 👋
        </h1>
        <p className="max-w-md text-base" style={{ color: "var(--muted)" }}>
          Have a project, question, or just want to chat? I&apos;d love to hear
          from you. Reach out via the form or find me on social media.
        </p>
      </div>

      <div className="grid gap-8 sm:grid-cols-5">
        <aside className="sm:col-span-2" aria-label="Social media links">
          <h2
            className="font-serif mb-4 text-lg font-semibold"
            style={{ color: "var(--fg)" }}
          >
            Find Me Online
          </h2>
          {activeSocial.length > 0 ? (
            <SocialLinks links={activeSocial} variant="card" />
          ) : (
            <p className="text-sm" style={{ color: "var(--faint)" }}>
              Social links coming soon.
            </p>
          )}
        </aside>

        <div className="sm:col-span-3">
          <div
            className="rounded-[14px] border p-6"
            style={{
              background: "var(--card)",
              border: "1px solid var(--border)",
              boxShadow: "0 1px 3px var(--shadow)",
            }}
          >
            <h2
              className="font-serif mb-5 text-lg font-semibold"
              style={{ color: "var(--fg)" }}
            >
              Send a Message
            </h2>
            <ContactForm recipientEmail={siteConfig.profile.email} />
          </div>
        </div>
      </div>
    </div>
  );
}
