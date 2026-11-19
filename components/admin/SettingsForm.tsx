"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";
import { useToast } from "@/components/admin/ui";
import type { SettingsShape } from "@/lib/settings";

const TEXT_FIELDS: { name: keyof SettingsShape; label: string; type?: "text" | "textarea" | "email" | "url"; rows?: number; help?: string }[] = [
  { name: "companyName", label: "Company name" },
  { name: "tagline", label: "Tagline" },
  { name: "description", label: "Company description (homepage intro + About)", type: "textarea", rows: 4 },
  { name: "email", label: "Contact email", type: "email" },
  { name: "phone", label: "Phone number" },
  { name: "address", label: "Office address", type: "textarea", rows: 2, help: "Leave blank until the office address is confirmed. The contact page will say so." },
  { name: "businessHours", label: "Business hours" },
  { name: "seoTitle", label: "Default SEO title" },
  { name: "seoDescription", label: "Default SEO description", type: "textarea", rows: 2 },
  { name: "ogImage", label: "Open Graph image URL", type: "url" },
  { name: "heroHeadline", label: "Homepage hero headline", help: "The last two words are highlighted in cyan." },
  { name: "heroDescription", label: "Hero description", type: "textarea", rows: 3 },
  { name: "heroImage", label: "Hero image URL", type: "url", help: "Paste a Media Library URL, or leave blank for the default logo panel." },
  { name: "heroPrimaryCta", label: "Hero primary button text" },
  { name: "heroSecondaryCta", label: "Hero secondary button text" },
  { name: "footerDescription", label: "Footer description", type: "textarea", rows: 3 },
  { name: "copyrightText", label: "Copyright text", help: "Use {year} for the current year." },
  { name: "mission", label: "Mission", type: "textarea", rows: 3 },
  { name: "vision", label: "Vision", type: "textarea", rows: 3 },
];

export default function SettingsForm({ initial }: { initial: SettingsShape }) {
  const router = useRouter();
  const toast = useToast();
  const [values, setValues] = useState<Record<string, string>>(() => {
    const v: Record<string, string> = {};
    for (const f of TEXT_FIELDS) v[f.name] = String(initial[f.name] ?? "");
    v["socials.x"] = initial.socials.x ?? "";
    v["socials.instagram"] = initial.socials.instagram ?? "";
    v["socials.linkedin"] = initial.socials.linkedin ?? "";
    v["socials.facebook"] = initial.socials.facebook ?? "";
    return v;
  });
  const [whyChooseUs, setWhyChooseUs] = useState(JSON.stringify(initial.whyChooseUs, null, 2));
  const [valuesList, setValuesList] = useState(JSON.stringify(initial.values, null, 2));
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    setError(null);
    let parsedWhy: unknown;
    let parsedValues: unknown;
    try {
      parsedWhy = JSON.parse(whyChooseUs);
      parsedValues = JSON.parse(valuesList);
    } catch {
      setError("“Why choose us” and “Core values” must be valid JSON arrays of { title, text }.");
      setBusy(false);
      return;
    }
    const payload: Record<string, unknown> = { ...values, whyChooseUs: parsedWhy, values: parsedValues };
    // Re-nest socials
    payload.socials = { x: values["socials.x"], instagram: values["socials.instagram"], linkedin: values["socials.linkedin"], facebook: values["socials.facebook"] };
    for (const k of ["socials.x", "socials.instagram", "socials.linkedin", "socials.facebook"]) delete payload[k];
    const res = await fetch("/api/admin/settings", { method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify(payload) });
    const json = await res.json();
    setBusy(false);
    if (!res.ok || !json.ok) { setError(json.error ?? "Save failed."); return; }
    toast("success", "Settings saved.");
    router.refresh();
  }

  const inputCls = "w-full rounded-xl border border-line bg-white px-3.5 py-2.5 text-sm";
  return (
    <form onSubmit={onSubmit} className="space-y-5">
      {TEXT_FIELDS.map((f) => (
        <div key={f.name}>
          <label htmlFor={`s-${f.name}`} className="mb-1.5 block text-sm font-semibold">{f.label}</label>
          {f.type === "textarea" ? (
            <textarea id={`s-${f.name}`} rows={f.rows ?? 3} value={values[f.name] ?? ""} onChange={(e) => setValues((p) => ({ ...p, [f.name]: e.target.value }))} className={inputCls} />
          ) : (
            <input id={`s-${f.name}`} type={f.type ?? "text"} value={values[f.name] ?? ""} onChange={(e) => setValues((p) => ({ ...p, [f.name]: e.target.value }))} className={inputCls} />
          )}
          {f.help && <p className="mt-1 text-xs text-neutral-500">{f.help}</p>}
        </div>
      ))}
      <div className="grid gap-5 sm:grid-cols-2">
        {(["x", "instagram", "linkedin", "facebook"] as const).map((key) => (
          <div key={key}>
            <label htmlFor={`social-${key}`} className="mb-1.5 block text-sm font-semibold">Social: {key}</label>
            <input id={`social-${key}`} type="url" value={values[`socials.${key}`] ?? ""} onChange={(e) => setValues((p) => ({ ...p, [`socials.${key}`]: e.target.value }))} placeholder={`https://${key}.com/apusindustries`} className={inputCls} />
          </div>
        ))}
      </div>
      <div>
        <label htmlFor="why" className="mb-1.5 block text-sm font-semibold">Why choose us (JSON)</label>
        <textarea id="why" rows={8} value={whyChooseUs} onChange={(e) => setWhyChooseUs(e.target.value)} className="w-full rounded-xl border border-line bg-white px-3.5 py-2.5 font-mono text-xs" />
        <p className="mt-1 text-xs text-neutral-500">JSON array of objects with title and text, e.g. [{`{ "title": "Reliable Delivery", "text": "…" }`}].</p>
      </div>
      <div>
        <label htmlFor="vals" className="mb-1.5 block text-sm font-semibold">Core values (JSON)</label>
        <textarea id="vals" rows={6} value={valuesList} onChange={(e) => setValuesList(e.target.value)} className="w-full rounded-xl border border-line bg-white px-3.5 py-2.5 font-mono text-xs" />
      </div>
      {error && <p role="alert" className="rounded-xl bg-red-50 px-4 py-3 text-sm text-red-700">{error}</p>}
      <button type="submit" disabled={busy} className="inline-flex items-center gap-2 rounded-full bg-ink px-6 py-2.5 text-sm font-semibold text-white disabled:opacity-60">
        {busy && <Loader2 className="h-4 w-4 animate-spin" />} Save settings
      </button>
    </form>
  );
}
