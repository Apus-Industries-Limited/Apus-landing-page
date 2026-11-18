"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";
import { useToast } from "@/components/admin/ui";

export type FieldDef = {
  name: string;
  label: string;
  type: "text" | "textarea" | "select" | "checkbox" | "number" | "tags" | "url" | "email";
  options?: { value: string; label: string }[];
  placeholder?: string;
  rows?: number;
  help?: string;
};

/** Generic create/edit form for an admin resource, driven by a field list.
 * `tags` fields are edited as comma-separated text and sent as string arrays. */
export default function ResourceForm({
  apiPath, initial, fields, submitLabel = "Save", onSaved,
}: {
  apiPath: string;
  initial: Record<string, unknown>;
  fields: FieldDef[];
  submitLabel?: string;
  onSaved?: () => void;
}) {
  const router = useRouter();
  const toast = useToast();
  const [values, setValues] = useState<Record<string, unknown>>(() => {
    const v: Record<string, unknown> = {};
    for (const f of fields) {
      const raw = initial[f.name];
      v[f.name] = f.type === "tags" ? (Array.isArray(raw) ? raw.join(", ") : "") : (raw ?? (f.type === "checkbox" ? false : ""));
    }
    return v;
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [busy, setBusy] = useState(false);

  function set(name: string, value: unknown) {
    setValues((prev) => ({ ...prev, [name]: value }));
  }

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    setErrors({});
    const payload: Record<string, unknown> = {};
    for (const f of fields) {
      const v = values[f.name];
      // Omit an empty password on edit — it means "keep the current password".
      if (f.name === "password" && (v === "" || v == null)) continue;
      if (f.type === "tags") payload[f.name] = String(v ?? "").split(",").map((s) => s.trim()).filter(Boolean);
      else if (f.type === "number") payload[f.name] = Number(v ?? 0);
      else payload[f.name] = v;
    }
    // Include the id/slug fields the server needs even if not editable in the form.
    if (initial._id) payload._id = initial._id;
    const isEdit = Boolean(initial._id);
    const res = await fetch(isEdit ? `${apiPath}/${initial._id}` : apiPath, {
      method: isEdit ? "PATCH" : "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    const json = await res.json();
    setBusy(false);
    if (!res.ok || !json.ok) {
      if (json.details) {
        const errs: Record<string, string> = {};
        for (const d of json.details as { path?: string[]; message: string }[]) {
          if (d.path?.[0]) errs[d.path[0]] = d.message;
        }
        setErrors(errs);
      }
      toast("error", json.error ?? "Save failed.");
      return;
    }
    toast("success", "Saved.");
    if (onSaved) onSaved();
    router.refresh();
  }

  const inputCls = "w-full rounded-xl border border-line bg-white px-3.5 py-2.5 text-sm";

  return (
    <form onSubmit={onSubmit} className="space-y-5">
      {fields.map((f) => (
        <div key={f.name}>
          <label htmlFor={`f-${f.name}`} className="mb-1.5 block text-sm font-semibold">
            {f.label}
          </label>
          {f.type === "textarea" ? (
            <textarea id={`f-${f.name}`} rows={f.rows ?? 4} value={String(values[f.name] ?? "")} onChange={(e) => set(f.name, e.target.value)} placeholder={f.placeholder} className={inputCls} />
          ) : f.type === "select" ? (
            <select id={`f-${f.name}`} value={String(values[f.name] ?? "")} onChange={(e) => set(f.name, e.target.value)} className={inputCls}>
              {(f.options ?? []).map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
            </select>
          ) : f.type === "checkbox" ? (
            <label className="flex items-center gap-2 text-sm">
              <input type="checkbox" checked={Boolean(values[f.name])} onChange={(e) => set(f.name, e.target.checked)} className="h-4 w-4 accent-[#49CEE1]" />
              {f.help ?? f.label}
            </label>
          ) : (
            <input id={`f-${f.name}`} type={f.type === "number" ? "number" : f.type === "email" ? "email" : f.type === "url" ? "url" : "text"} value={String(values[f.name] ?? "")} onChange={(e) => set(f.name, e.target.value)} placeholder={f.placeholder} className={inputCls} />
          )}
          {f.help && f.type !== "checkbox" && <p className="mt-1 text-xs text-neutral-500">{f.help}</p>}
          {errors[f.name] && <p className="mt-1 text-xs text-red-600">{errors[f.name]}</p>}
        </div>
      ))}
      <button type="submit" disabled={busy} className="inline-flex items-center gap-2 rounded-full bg-ink px-6 py-2.5 text-sm font-semibold text-white disabled:opacity-60">
        {busy && <Loader2 className="h-4 w-4 animate-spin" />}
        {submitLabel}
      </button>
    </form>
  );
}
