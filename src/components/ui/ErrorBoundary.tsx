/**
 * React error boundaries must be class components — there is no hook equivalent.
 * Wraps risky renders (e.g. MDXRemote) so a broken component shows a graceful
 * fallback UI instead of crashing the full page.
 */
"use client";

import { Component, type ReactNode } from "react";

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  message: string;
}

export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false, message: "" };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, message: error?.message ?? "Unknown error" };
  }

  componentDidCatch(error: Error, info: React.ErrorInfo) {
    if (process.env.NODE_ENV === "development") {
      console.error("[ErrorBoundary] caught:", error, info);
    }
  }

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) return this.props.fallback;
      return (
        <div
          className="my-8 rounded-[14px] border p-6 text-center"
          style={{
            background: "var(--card)",
            border: "1px solid var(--border)",
          }}
          role="alert"
        >
          <i
            className="bi bi-exclamation-triangle mb-3 block text-3xl"
            style={{ color: "#f59e0b" }}
            aria-hidden="true"
          />
          <p className="text-sm font-medium" style={{ color: "var(--fg)" }}>
            Something went wrong rendering this content.
          </p>
          <p className="mt-1 text-xs" style={{ color: "var(--faint)" }}>
            Try refreshing the page, or{" "}
            <a
              href="/"
              className="underline hover:text-[var(--accent)]"
              style={{ color: "var(--muted)" }}
            >
              go home
            </a>
            .
          </p>
        </div>
      );
    }
    return this.props.children;
  }
}

export function MDXErrorBoundary({ children }: { children: ReactNode }) {
  return <ErrorBoundary>{children}</ErrorBoundary>;
}
