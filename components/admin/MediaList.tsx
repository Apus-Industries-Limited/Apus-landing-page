"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { Copy, Check } from "lucide-react";
import { useToast, DeleteButton, EmptyState } from "@/components/admin/ui";
import { formatDate } from "@/lib/utils";

type MediaItem = { _id: string; filename: string; url: string; contentType: string; size: number; folder: string; createdAt: string };

export default function MediaList({ items }: { items: MediaItem[] }) {
  const router = useRouter();
  const toast = useToast();
  const [copied, setCopied] = useState<string | null>(null);

  async function copyUrl(url: string) {
    try {
      await navigator.clipboard.writeText(url);
      setCopied(url);
      toast("success", "URL copied.");
      setTimeout(() => setCopied(null), 2000);
    } catch {
      toast("error", "Could not copy the URL.");
    }
  }

  async function handleDelete(id: string) {
    const res = await fetch(`/api/admin/media/${id}`, { method: "DELETE" });
    const json = await res.json();
    if (!res.ok || !json.ok) { toast("error", json.error ?? "Delete failed."); return; }
    toast("success", "Deleted.");
    router.refresh();
  }

  if (items.length === 0) return <EmptyState title="No media yet" text="Upload your first file above. Images and documents are stored in Cloudflare R2 and can be reused across services, projects, team and testimonials." />;

  return (
    <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
      {items.map((m) => (
        <article key={m._id} className="overflow-hidden rounded-2xl border border-line bg-white">
          <div className="relative flex h-40 items-center justify-center bg-mist">
            {m.contentType.startsWith("image/") ? (
              <Image src={m.url} alt={m.filename} fill className="object-contain" sizes="(max-width: 768px) 100vw, 33vw" />
            ) : (
              <span className="rounded-full bg-ink px-4 py-2 text-xs font-bold uppercase tracking-wider text-white">{m.contentType.split("/")[1] ?? "file"}</span>
            )}
          </div>
          <div className="p-4">
            <p className="truncate text-sm font-semibold" title={m.filename}>{m.filename}</p>
            <p className="mt-1 text-xs text-neutral-500">{m.folder} · {(m.size / 1024).toFixed(1)} KB · {formatDate(m.createdAt)}</p>
            <div className="mt-3 flex items-center gap-2">
              <button onClick={() => void copyUrl(m.url)} className="inline-flex items-center gap-1.5 rounded-lg border border-line px-3 py-1.5 text-xs font-semibold">
                {copied === m.url ? <Check className="h-3.5 w-3.5 text-emerald-600" /> : <Copy className="h-3.5 w-3.5" />}
                Copy URL
              </button>
              <a href={m.url} target="_blank" rel="noreferrer" className="rounded-lg border border-line px-3 py-1.5 text-xs font-semibold">Preview</a>
              <span className="ml-auto"><DeleteButton label="Delete" onDelete={() => handleDelete(m._id)} /></span>
            </div>
          </div>
        </article>
      ))}
    </div>
  );
}
