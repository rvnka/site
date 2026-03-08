"use client";

import { useState } from "react";
import { contactFormSchema, type ContactFormData } from "@/types";
import { siteConfig } from "@/config/site-config";
import { Button } from "@/components/ui/Button";

interface ContactFormProps {
  recipientEmail: string;
}

type FormState = "idle" | "submitting" | "success" | "error";
type FieldErrors = Partial<Record<keyof ContactFormData, string>>;

const EMPTY_FORM: ContactFormData = {
  name: "",
  email: "",
  subject: "",
  message: "",
};

export function ContactForm({ recipientEmail }: ContactFormProps) {
  const [formData, setFormData] = useState<ContactFormData>(EMPTY_FORM);
  const [errors, setErrors] = useState<FieldErrors>({});
  const [state, setState] = useState<FormState>("idle");

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.currentTarget;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name as keyof ContactFormData]) {
      setErrors((prev) => ({ ...prev, [name]: undefined }));
    }
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (state === "submitting") return;

    const result = contactFormSchema.safeParse(formData);
    if (!result.success) {
      const fieldErrors: FieldErrors = {};
      result.error.issues.forEach((err) => {
        const field = err.path[0] as keyof ContactFormData;
        if (!fieldErrors[field]) fieldErrors[field] = err.message;
      });
      setErrors(fieldErrors);
      const firstError = Object.keys(fieldErrors)[0];
      if (firstError) document.getElementById(firstError)?.focus();
      return;
    }

    setState("submitting");
    const { name, email, subject, message } = result.data;

    const body = [
      `Hi ${siteConfig.profile.name},`,
      ``,
      `My name is ${name} (${email}).`,
      ``,
      message,
    ].join("\n");

    const mailtoUrl = `mailto:${recipientEmail}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;

    try {
      window.location.href = mailtoUrl;
      setState("success");
    } catch {
      setState("error");
    }
  };

  const handleReset = () => {
    setFormData(EMPTY_FORM);
    setErrors({});
    setState("idle");
  };

  if (state === "success") {
    return (
      <div className="py-8 text-center">
        <i
          className="bi bi-check-circle mb-4 block text-4xl"
          style={{ color: "#22c55e" }}
          aria-hidden="true"
        />
        <h3
          className="font-serif text-lg font-semibold"
          style={{ color: "var(--fg)" }}
        >
          Your email client should open!
        </h3>
        <p className="mt-2 text-sm" style={{ color: "var(--muted)" }}>
          If it didn&apos;t, email me directly at{" "}
          <a
            href={`mailto:${recipientEmail}`}
            className="underline transition-colors hover:text-[var(--accent)]"
            style={{ color: "var(--accent)" }}
          >
            {recipientEmail}
          </a>
        </p>
        <button
          onClick={handleReset}
          className="mt-4 text-sm underline transition-colors hover:text-[var(--accent)]"
          style={{ color: "var(--muted)" }}
        >
          Send another message
        </button>
      </div>
    );
  }

  if (state === "error") {
    return (
      <div className="py-8 text-center">
        <i
          className="bi bi-exclamation-circle mb-4 block text-4xl"
          style={{ color: "#f43f5e" }}
          aria-hidden="true"
        />
        <h3
          className="font-serif text-lg font-semibold"
          style={{ color: "var(--fg)" }}
        >
          Could not open email client
        </h3>
        <p className="mt-2 text-sm" style={{ color: "var(--muted)" }}>
          Please email me directly at{" "}
          <a
            href={`mailto:${recipientEmail}`}
            className="underline"
            style={{ color: "var(--accent)" }}
          >
            {recipientEmail}
          </a>
        </p>
        <button
          onClick={handleReset}
          className="mt-4 text-sm underline"
          style={{ color: "var(--muted)" }}
        >
          Try again
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} noValidate aria-label="Contact form">
      <div className="flex flex-col gap-4">
        <Field
          id="name"
          label="Name"
          type="text"
          autoComplete="name"
          value={formData.name}
          error={errors.name}
          onChange={handleChange}
          placeholder="Your name"
        />
        <Field
          id="email"
          label="Email"
          type="email"
          autoComplete="email"
          value={formData.email}
          error={errors.email}
          onChange={handleChange}
          placeholder="your@email.com"
        />
        <Field
          id="subject"
          label="Subject"
          type="text"
          value={formData.subject}
          error={errors.subject}
          onChange={handleChange}
          placeholder="What's this about?"
        />

        <div>
          <label
            htmlFor="message"
            className="mb-1.5 block text-sm font-medium"
            style={{ color: "var(--fg)" }}
          >
            Message
          </label>
          <textarea
            id="message"
            name="message"
            required
            rows={5}
            value={formData.message}
            onChange={handleChange}
            placeholder="Tell me about your project or idea…"
            aria-describedby={errors.message ? "message-error" : undefined}
            aria-invalid={errors.message ? true : undefined}
            className="w-full resize-none rounded-[10px] border px-4 py-2.5 text-sm outline-none transition-colors duration-200"
            style={{
              background: "var(--bg)",
              border: `1px solid ${errors.message ? "#f43f5e" : "var(--border)"}`,
              color: "var(--fg)",
            }}
            onFocus={(e) => {
              if (!errors.message)
                e.currentTarget.style.borderColor = "var(--accent)";
            }}
            onBlur={(e) => {
              if (!errors.message)
                e.currentTarget.style.borderColor = "var(--border)";
            }}
          />
          <div className="mt-1 flex items-center justify-between">
            {errors.message ? (
              <p
                id="message-error"
                role="alert"
                className="text-xs"
                style={{ color: "#f43f5e" }}
              >
                {errors.message}
              </p>
            ) : (
              <span />
            )}
            <span
              className="text-xs tabular-nums"
              style={{
                color:
                  formData.message.length > 4500 ? "#f43f5e" : "var(--faint)",
              }}
            >
              {formData.message.length}/5000
            </span>
          </div>
        </div>

        <Button
          type="submit"
          variant="primary"
          size="lg"
          icon={state === "submitting" ? "bi-hourglass-split" : "bi-send"}
          disabled={state === "submitting"}
          className="w-full justify-center"
        >
          {state === "submitting" ? "Opening email client…" : "Send Message"}
        </Button>

        <p className="text-center text-xs" style={{ color: "var(--faint)" }}>
          This will open your default email client.
        </p>
      </div>
    </form>
  );
}

interface FieldProps {
  id: keyof ContactFormData;
  label: string;
  type: string;
  value: string;
  error?: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  placeholder?: string;
  autoComplete?: string;
}

function Field({
  id,
  label,
  type,
  value,
  error,
  onChange,
  placeholder,
  autoComplete,
}: FieldProps) {
  return (
    <div>
      <label
        htmlFor={id}
        className="mb-1.5 block text-sm font-medium"
        style={{ color: "var(--fg)" }}
      >
        {label}
      </label>
      <input
        id={id}
        name={id}
        type={type}
        autoComplete={autoComplete}
        required
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        aria-describedby={error ? `${id}-error` : undefined}
        aria-invalid={error ? true : undefined}
        className="w-full rounded-[10px] border px-4 py-2.5 text-sm outline-none transition-colors duration-200"
        style={{
          background: "var(--bg)",
          border: `1px solid ${error ? "#f43f5e" : "var(--border)"}`,
          color: "var(--fg)",
        }}
        onFocus={(e) => {
          if (!error) e.currentTarget.style.borderColor = "var(--accent)";
        }}
        onBlur={(e) => {
          if (!error) e.currentTarget.style.borderColor = "var(--border)";
        }}
      />
      {error && (
        <p
          id={`${id}-error`}
          role="alert"
          className="mt-1 text-xs"
          style={{ color: "#f43f5e" }}
        >
          {error}
        </p>
      )}
    </div>
  );
}
