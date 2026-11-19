"use client";

import { useRouter } from "next/navigation";
import ResourceForm, { type FieldDef } from "@/components/admin/ResourceForm";
import { EmptyState, StatusBadge, DeleteButton, useToast } from "@/components/admin/ui";

export type ColumnDef = { key: string; label: string };

function cellValue(item: Record<string, unknown>, key: string): string {
  const v = item[key];
  if (v == null) return "Not set";
  if (typeof v === "boolean") return v ? "Yes" : "No";
  if (Array.isArray(v)) return v.join(", ") || "Not set";
  if (typeof v === "object") return "Not set";
  const s = String(v);
  return s.length > 80 ? `${s.slice(0, 80)}…` : s;
}

/** Generic admin list + add/edit UI for a CMS resource. */
export default function ResourceListPage({
  title, description, apiPath, fields, columns, items, addLabel = "Add new",
}: {
  title: string;
  description: string;
  apiPath: string;
  fields: FieldDef[];
  columns: ColumnDef[];
  items: Record<string, unknown>[];
  addLabel?: string;
}) {
  const router = useRouter();
  const toast = useToast();

  async function handleDelete(id: string) {
    const res = await fetch(`${apiPath}/${id}`, { method: "DELETE" });
    const json = await res.json();
    if (!res.ok || !json.ok) { toast("error", json.error ?? "Delete failed."); return; }
    toast("success", "Deleted.");
    router.refresh();
  }

  const titleField = fields[0]?.name ?? "name";

  return (
    <div>
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h1 className="font-display text-2xl font-bold sm:text-3xl">{title}</h1>
          <p className="mt-1 text-sm text-neutral-500">{description}</p>
        </div>
      </div>

      <details className="mt-6 rounded-2xl border border-line bg-white p-5">
        <summary className="cursor-pointer font-semibold">{addLabel}</summary>
        <div className="mt-5">
          <ResourceForm apiPath={apiPath} initial={{}} fields={fields} submitLabel="Create" onSaved={() => router.refresh()} />
        </div>
      </details>

      <div className="mt-6">
        {items.length === 0 ? (
          <EmptyState title="Nothing here yet" text="Use the form above to add your first item. It will appear on the public website once published / approved." />
        ) : (
          <div className="space-y-3">
            {items.map((item) => {
              const id = String(item._id ?? item.id ?? "");
              return (
                <details key={id} className="rounded-2xl border border-line bg-white">
                  <summary className="flex cursor-pointer flex-wrap items-center gap-3 px-5 py-4">
                    <span className="font-semibold">{String(item[titleField] ?? id)}</span>
                    {typeof item.status === "string" && <StatusBadge value={item.status} />}
                    {typeof item.published === "boolean" && <StatusBadge value={item.published ? "published" : "draft"} />}
                    {typeof item.active === "boolean" && <span className="text-xs text-neutral-500">{item.active ? "Active" : "Inactive"}</span>}
                    {typeof item.featured === "boolean" && item.featured && <span className="rounded-full bg-apus-pale px-2.5 py-1 text-xs font-semibold text-apus-deep">Featured</span>}
                    <span className="ml-auto text-xs text-neutral-400">Click to edit</span>
                  </summary>
                  <div className="border-t border-line px-5 py-5">
                    <dl className="mb-5 grid gap-2 text-sm sm:grid-cols-2">
                      {columns.map((c) => (
                        <div key={c.key} className="flex gap-2">
                          <dt className="shrink-0 font-semibold text-neutral-500">{c.label}:</dt>
                          <dd className="min-w-0 break-words">{cellValue(item, c.key)}</dd>
                        </div>
                      ))}
                    </dl>
                    <ResourceForm apiPath={apiPath} initial={item} fields={fields} submitLabel="Save changes" onSaved={() => router.refresh()} />
                    <div className="mt-4">
                      <DeleteButton onDelete={() => handleDelete(id)} />
                    </div>
                  </div>
                </details>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
