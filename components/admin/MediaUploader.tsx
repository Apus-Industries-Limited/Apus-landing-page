"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Loader2, Upload } from "lucide-react";
import { useToast } from "@/components/admin/ui";

export default function MediaUploader() {
  const router = useRouter();
  const toast = useToast();
  const [busy, setBusy] = useState(false);
  const [folder, setFolder] = useState("general");

  async function onFile(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setBusy(true);
    try {
      // Step 1: presigned upload URL
      const presign = await fetch("/api/admin/media", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ filename: file.name, contentType: file.type, folder, size: file.size }),
      });
      const presignJson = await presign.json();
      if (!presign.ok || !presignJson.ok) {
        toast("error", presignJson.error ?? "Upload failed.");
        return;
      }
      // Step 2: upload straight to R2
      const put = await fetch(presignJson.data.uploadUrl as string, { method: "PUT", headers: { "Content-Type": file.type }, body: file });
      if (!put.ok) { toast("error", "Upload to storage failed."); return; }
      // Step 3: record in MongoDB
      const confirm = await fetch("/api/admin/media", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ key: presignJson.data.key, filename: file.name, contentType: file.type, size: file.size, folder }),
      });
      const confirmJson = await confirm.json();
      if (!confirm.ok || !confirmJson.ok) { toast("error", confirmJson.error ?? "Could not record the upload."); return; }
      toast("success", "Uploaded.");
      router.refresh();
    } catch {
      toast("error", "Upload failed. Check your connection.");
    } finally {
      setBusy(false);
      e.target.value = "";
    }
  }

  return (
    <div className="flex flex-wrap items-center gap-3 rounded-2xl border border-line bg-white p-5">
      <label className="flex items-center gap-2 text-sm font-semibold">
        Folder
        <select value={folder} onChange={(e) => setFolder(e.target.value)} className="rounded-xl border border-line px-3 py-2 text-sm">
          {["general", "projects", "services", "team", "testimonials", "partners", "logos"].map((f) => (
            <option key={f} value={f}>{f}</option>
          ))}
        </select>
      </label>
      <label className="inline-flex cursor-pointer items-center gap-2 rounded-full bg-ink px-5 py-2.5 text-sm font-semibold text-white">
        {busy ? <Loader2 className="h-4 w-4 animate-spin" /> : <Upload className="h-4 w-4" />}
        {busy ? "Uploading…" : "Upload file"}
        <input type="file" accept="image/*,.pdf,.doc,.docx" onChange={onFile} disabled={busy} className="hidden" />
      </label>
      <p className="text-xs text-neutral-500">Images (JPEG, PNG, WebP, AVIF, SVG) and documents (PDF, Word). Max 10 MB. Files go to Cloudflare R2; only the key and metadata are stored in MongoDB.</p>
    </div>
  );
}
