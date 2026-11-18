"use client";

import { useState } from "react";
import { useSearchParams } from "next/navigation";
import { CheckCircle2, Loader2 } from "lucide-react";

type ServiceOption = { slug: string; name: string };

export default function ContactForm({ services }: { services: ServiceOption[] }) {
  const searchParams = useSearchParams();
  const preselected = searchParams.get("service") ?? "";
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [reference, setReference] = useState<string | null>(null);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setSubmitting(true);
    setError(null);
    setFieldErrors({});
    const form = new FormData(e.currentTarget);
    const payload = {
      name: String(form.get("name") ?? ""),
      email: String(form.get("email") ?? ""),
      phone: String(form.get("phone") ?? ""),
      company: String(form.get("company") ?? ""),
      service: String(form.get("service") ?? ""),
      subject: String(form.get("subject") ?? ""),
      message: String(form.get("message") ?? ""),
    };
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const json = await res.json();
      if (!res.ok || !json.ok) {
        if (json.details) {
          const errs: Record<string, string> = {};
          for (const d of json.details as { path?: string[]; message: string }[]) {
            if (d.path?.[0]) errs[d.path[0]] = d.message;
          }
          setFieldErrors(errs);
        }
        setError(json.error ?? "Something went wrong. Please try again.");
        return;
      }
      setReference(json.data.reference as string);
    } catch {
      setError("Network error. Please check your connection and try again.");
    } finally {
      setSubmitting(false);
    }
  }

  if (reference) {
    return (
      <div className="rounded-2xl border border-apus bg-apus-pale p-8 text-center">
        <CheckCircle2 className="mx-auto h-10 w-10 text-apus-deep" />
        <h2 className="mt-4 font-display text-2xl font-bold">Thank you — your message was received.</h2>
        <p className="mt-2 text-neutral-600">
          Your reference number is <strong className="text-ink">{reference}</strong>. Please keep it for your records.
          Our team will get back to you during business hours.
        </p>
        <button onClick={() => setReference(null)} className="mt-6 rounded-full bg-ink px-5 py-2.5 text-sm font-semibold text-white">
          Send another message
        </button>
      </div>
    );
  }

  const inputCls = "w-full rounded-xl border border-line bg-white px-4 py-3 text-sm";
  const err = (name: string) => fieldErrors[name] ? <p className="mt-1 text-xs text-red-600">{fieldErrors[name]}</p> : null;

  return (
    <form onSubmit={onSubmit} noValidate className="rounded-2xl border border-line bg-white p-6 sm:p-8">
      <div className="grid gap-5 sm:grid-cols-2">
        <div>
          <label htmlFor="name" className="mb-1.5 block text-sm font-semibold">Full name *</label>
          <input id="name" name="name" required autoComplete="name" placeholder="Your full name" className={inputCls} />
          {err("name")}
        </div>
        <div>
          <label htmlFor="email" className="mb-1.5 block text-sm font-semibold">Email *</label>
          <input id="email" name="email" type="email" required autoComplete="email" placeholder="you@company.com" className={inputCls} />
          {err("email")}
        </div>
        <div>
          <label htmlFor="phone" className="mb-1.5 block text-sm font-semibold">Phone number</label>
          <input id="phone" name="phone" type="tel" autoComplete="tel" placeholder="+234 ..." className={inputCls} />
          {err("phone")}
        </div>
        <div>
          <label htmlFor="company" className="mb-1.5 block text-sm font-semibold">Company</label>
          <input id="company" name="company" autoComplete="organization" placeholder="Company name (optional)" className={inputCls} />
          {err("company")}
        </div>
        <div className="sm:col-span-2">
          <label htmlFor="service" className="mb-1.5 block text-sm font-semibold">Service of interest</label>
          <select id="service" name="service" defaultValue={preselected} className={inputCls}>
            <option value="">General enquiry</option>
            {services.map((s) => <option key={s.slug} value={s.name}>{s.name}</option>)}
          </select>
          {err("service")}
        </div>
        <div className="sm:col-span-2">
          <label htmlFor="subject" className="mb-1.5 block text-sm font-semibold">Subject *</label>
          <input id="subject" name="subject" required placeholder="What is this about?" className={inputCls} />
          {err("subject")}
        </div>
        <div className="sm:col-span-2">
          <label htmlFor="message" className="mb-1.5 block text-sm font-semibold">Message *</label>
          <textarea id="message" name="message" required rows={6} placeholder="Tell us about your project or question…" className={inputCls} />
          {err("message")}
        </div>
      </div>
      {error && <p role="alert" className="mt-4 rounded-xl bg-red-50 px-4 py-3 text-sm text-red-700">{error}</p>}
      <button type="submit" disabled={submitting} className="mt-6 inline-flex items-center gap-2 rounded-full bg-ink px-6 py-3 text-sm font-semibold text-white transition disabled:opacity-60">
        {submitting && <Loader2 className="h-4 w-4 animate-spin" />}
        {submitting ? "Sending…" : "Send message"}
      </button>
      <p className="mt-3 text-xs text-neutral-500">We reply during business hours. Your details are only used to respond to your enquiry.</p>
    </form>
  );
}
