import { NextResponse } from "next/server";
import { Resend } from "resend";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const MAX_SHORT = 200;
const MAX_MESSAGE = 5000;
const SERVICE_KEYS = ["website", "system", "process", "other"];

export async function POST(request: Request) {
  let body: Record<string, unknown>;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const name = typeof body.name === "string" ? body.name.trim() : "";
  const email = typeof body.email === "string" ? body.email.trim() : "";
  const company = typeof body.company === "string" ? body.company.trim() : "";
  const message = typeof body.message === "string" ? body.message.trim() : "";
  const service =
    typeof body.service === "string" && SERVICE_KEYS.includes(body.service)
      ? body.service
      : "";
  const honeypot = typeof body.website === "string" ? body.website : "";

  // Honeypot filled → bot. Pretend success, send nothing.
  if (honeypot) {
    return NextResponse.json({ ok: true });
  }

  if (
    !name ||
    name.length > MAX_SHORT ||
    !email ||
    email.length > MAX_SHORT ||
    !EMAIL_RE.test(email) ||
    !message ||
    message.length > MAX_MESSAGE ||
    company.length > MAX_SHORT
  ) {
    return NextResponse.json({ error: "Validation failed" }, { status: 400 });
  }

  const text = [
    `Name: ${name}`,
    `Email: ${email}`,
    company && `Company: ${company}`,
    service && `Service interest: ${service}`,
    "",
    message,
  ]
    .filter(Boolean)
    .join("\n");

  // Graceful fallback: without an API key, log instead of failing (dev/build safe)
  if (!process.env.RESEND_API_KEY) {
    console.log("[contact] RESEND_API_KEY not set — message logged only:\n", text);
    return NextResponse.json({ ok: true });
  }

  try {
    const resend = new Resend(process.env.RESEND_API_KEY);
    const { error } = await resend.emails.send({
      from: process.env.CONTACT_FROM_EMAIL ?? "Pragma <onboarding@resend.dev>",
      to: process.env.CONTACT_TO_EMAIL ?? "delivered@resend.dev",
      replyTo: email,
      subject: `Pragma website message — ${name}`,
      text,
    });
    if (error) {
      console.error("[contact] Resend error:", error);
      return NextResponse.json({ error: "Send failed" }, { status: 502 });
    }
    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("[contact] Unexpected error:", err);
    return NextResponse.json({ error: "Send failed" }, { status: 500 });
  }
}
