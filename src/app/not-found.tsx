import Link from "next/link";
import { Button } from "@/components/ui/Button";

export default function NotFound() {
  return (
    <div className="mx-auto flex max-w-3xl flex-col items-center justify-center px-6 py-32 text-center">
      <p
        className="font-serif mb-2 text-8xl font-bold"
        style={{
          color: "var(--accent)",
          letterSpacing: "-0.04em",
          opacity: 0.3,
        }}
        aria-hidden="true"
      >
        404
      </p>
      <h1
        className="font-serif mb-3 text-3xl font-bold tracking-tight"
        style={{ color: "var(--fg)", letterSpacing: "-0.02em" }}
      >
        Page Not Found
      </h1>
      <p className="mb-8 max-w-xs text-base" style={{ color: "var(--muted)" }}>
        Looks like this page doesn&apos;t exist. It might have been moved or
        deleted.
      </p>
      <div className="flex gap-3">
        <Button href="/" variant="primary" icon="bi-house">
          Go Home
        </Button>
        <Button href="/project" variant="outline" icon="bi-grid">
          Projects
        </Button>
      </div>
    </div>
  );
}
