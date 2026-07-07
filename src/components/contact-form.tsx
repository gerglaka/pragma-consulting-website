"use client";

import { useTranslations } from "next-intl";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const SERVICE_OPTIONS = ["website", "system", "process", "other"] as const;

type Status = "idle" | "sending" | "success" | "error";
type FieldErrors = Partial<Record<"name" | "email" | "message", string>>;

export function ContactForm() {
  const t = useTranslations("contactPage.form");
  const [status, setStatus] = useState<Status>("idle");
  const [errors, setErrors] = useState<FieldErrors>({});
  const [service, setService] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const data = new FormData(form);
    const name = String(data.get("name") ?? "").trim();
    const email = String(data.get("email") ?? "").trim();
    const company = String(data.get("company") ?? "").trim();
    const message = String(data.get("message") ?? "").trim();
    const website = String(data.get("website") ?? ""); // honeypot

    const nextErrors: FieldErrors = {};
    if (!name) nextErrors.name = t("validationRequired");
    if (!email) nextErrors.email = t("validationRequired");
    else if (!EMAIL_RE.test(email)) nextErrors.email = t("validationEmail");
    if (!message) nextErrors.message = t("validationRequired");
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length > 0) return;

    setStatus("sending");
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, company, service, message, website }),
      });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      setStatus("success");
      form.reset();
      setService(null);
    } catch {
      setStatus("error");
    }
  }

  return (
    <form onSubmit={handleSubmit} noValidate className="space-y-6">
      <div className="space-y-2">
        <Label htmlFor="contact-name">{t("name")}</Label>
        <Input
          id="contact-name"
          name="name"
          autoComplete="name"
          aria-invalid={errors.name ? true : undefined}
          aria-describedby={errors.name ? "contact-name-error" : undefined}
        />
        {errors.name && (
          <p id="contact-name-error" className="text-sm text-destructive">
            {errors.name}
          </p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="contact-email">{t("email")}</Label>
        <Input
          id="contact-email"
          name="email"
          type="email"
          autoComplete="email"
          aria-invalid={errors.email ? true : undefined}
          aria-describedby={errors.email ? "contact-email-error" : undefined}
        />
        {errors.email && (
          <p id="contact-email-error" className="text-sm text-destructive">
            {errors.email}
          </p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="contact-company">{t("company")}</Label>
        <Input
          id="contact-company"
          name="company"
          autoComplete="organization"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="contact-service">{t("service")}</Label>
        <Select value={service} onValueChange={(v) => setService(v as string | null)}>
          <SelectTrigger id="contact-service" className="w-full">
            <SelectValue placeholder={t("servicePlaceholder")} />
          </SelectTrigger>
          <SelectContent>
            {SERVICE_OPTIONS.map((option) => (
              <SelectItem key={option} value={option}>
                {t(`serviceOptions.${option}`)}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <Label htmlFor="contact-message">{t("message")}</Label>
        <Textarea
          id="contact-message"
          name="message"
          rows={6}
          aria-invalid={errors.message ? true : undefined}
          aria-describedby={
            errors.message ? "contact-message-error" : undefined
          }
        />
        {errors.message && (
          <p id="contact-message-error" className="text-sm text-destructive">
            {errors.message}
          </p>
        )}
      </div>

      {/* Honeypot — invisible to humans, tempting for bots */}
      <div aria-hidden="true" className="absolute -left-[9999px] top-auto">
        <label htmlFor="contact-website">Website</label>
        <input
          id="contact-website"
          type="text"
          name="website"
          tabIndex={-1}
          autoComplete="off"
        />
      </div>

      <Button
        type="submit"
        disabled={status === "sending"}
        className="h-11 w-full px-6 text-base sm:w-auto"
      >
        {status === "sending" ? t("sending") : t("submit")}
      </Button>

      <p aria-live="polite" role="status" className="min-h-6">
        {status === "success" && (
          <span className="font-medium text-primary">{t("success")}</span>
        )}
        {status === "error" && (
          <span className="font-medium text-destructive">{t("error")}</span>
        )}
      </p>
    </form>
  );
}
