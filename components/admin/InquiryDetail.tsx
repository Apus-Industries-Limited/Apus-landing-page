"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useToast } from "@/components/admin/ui";
import { StatusBadge } from "@/components/admin/ui";
import { formatDate } from "@/lib/utils";
import { INQUIRY_STATUSES } from "@/models/Crm";

type Note = { _id: string; body: string; createdAt: string; author?: { name?: string } };
type Activity = { _id: string; action: string; detail?: string; createdAt: string; actor?: { name?: string } };
type UserOpt = { _id: string; name: string; email: string };

export default function InquiryDetail({
  inquiry, notes, activity, users,
}: {
  inquiry: { _id: string; reference: string; name: string; email: string; phone?: string; company?: string; service?: string; subject: string; message: string; status: string; createdAt: string; assignedTo?: { _id: string; name: string } | null };
  notes: Note[];
  activity: Activity[];
  users: UserOpt[];
}) {
  const router = useRouter();
  const toast = useToast();
  const [status, setStatus] = useState(inquiry.status);
  const [assignee, setAssignee] = useState(inquiry.assignedTo?._id ?? "");
  const [noteBody, setNoteBody] = useState("");
  const [busy, setBusy] = useState(false);

  async function patch(body: Record<string, unknown>) {
    setBusy(true);
    const res = await fetch(`/api/admin/inquiries/${inquiry._id}`, { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify(body) });
    const json = await res.json();
    setBusy(false);
    if (!res.ok || !json.ok) { toast("error", json.error ?? "Update failed."); return; }
    toast("success", "Updated.");
    router.refresh();
  }

  async function addNote(e: React.FormEvent) {
    e.preventDefault();
    if (!noteBody.trim()) return;
    setBusy(true);
    const res = await fetch(`/api/admin/inquiries/${inquiry._id}/notes`, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ body: noteBody }) });
    const json = await res.json();
    setBusy(false);
    if (!res.ok || !json.ok) { toast("error", json.error ?? "Could not add note."); return; }
    setNoteBody("");
    toast("success", "Note added.");
    router.refresh();
  }

  return (
    <div>
      <p className="text-sm text-neutral-500">{inquiry.reference} · {formatDate(inquiry.createdAt)}</p>
      <div className="mt-2 flex flex-wrap items-center gap-3">
        <h1 className="font-display text-2xl font-bold sm:text-3xl">{inquiry.subject}</h1>
        <StatusBadge value={inquiry.status} />
      </div>
      <div className="mt-6 grid gap-6 lg:grid-cols-3">
        <div className="space-y-6 lg:col-span-2">
          <section className="rounded-2xl border border-line bg-white p-5">
            <h2 className="font-display text-lg font-bold">Message</h2>
            <dl className="mt-4 grid gap-2 text-sm sm:grid-cols-2">
              <div><dt className="text-xs uppercase tracking-wider text-neutral-500">Name</dt><dd className="font-semibold">{inquiry.name}</dd></div>
              <div><dt className="text-xs uppercase tracking-wider text-neutral-500">Email</dt><dd><a href={`mailto:${inquiry.email}`} className="font-semibold text-apus-deep">{inquiry.email}</a></dd></div>
              {inquiry.phone && <div><dt className="text-xs uppercase tracking-wider text-neutral-500">Phone</dt><dd className="font-semibold">{inquiry.phone}</dd></div>}
              {inquiry.company && <div><dt className="text-xs uppercase tracking-wider text-neutral-500">Company</dt><dd className="font-semibold">{inquiry.company}</dd></div>}
              {inquiry.service && <div><dt className="text-xs uppercase tracking-wider text-neutral-500">Service of interest</dt><dd className="font-semibold">{inquiry.service}</dd></div>}
            </dl>
            <p className="mt-4 whitespace-pre-line text-sm leading-relaxed text-neutral-700">{inquiry.message}</p>
          </section>

          <section className="rounded-2xl border border-line bg-white p-5">
            <h2 className="font-display text-lg font-bold">Internal notes</h2>
            <p className="text-xs text-neutral-500">Private. Never shown on the public site.</p>
            {notes.length === 0 ? <p className="mt-3 text-sm text-neutral-500">No notes yet.</p> : (
              <ul className="mt-4 space-y-3">
                {notes.map((n) => (
                  <li key={n._id} className="rounded-xl bg-smoke p-4 text-sm">
                    <p>{n.body}</p>
                    <p className="mt-2 text-xs text-neutral-500">{n.author?.name ?? "Admin"} · {formatDate(n.createdAt)}</p>
                  </li>
                ))}
              </ul>
            )}
            <form onSubmit={addNote} className="mt-4 flex gap-2">
              <input value={noteBody} onChange={(e) => setNoteBody(e.target.value)} placeholder="Add an internal note…" className="flex-1 rounded-xl border border-line px-3.5 py-2.5 text-sm" />
              <button type="submit" disabled={busy} className="rounded-full bg-ink px-4 py-2.5 text-sm font-semibold text-white disabled:opacity-60">Add note</button>
            </form>
          </section>

          <section className="rounded-2xl border border-line bg-white p-5">
            <h2 className="font-display text-lg font-bold">Activity</h2>
            {activity.length === 0 ? <p className="mt-3 text-sm text-neutral-500">No activity recorded yet.</p> : (
              <ul className="mt-4 space-y-2 text-sm">
                {activity.map((a) => (
                  <li key={a._id} className="flex justify-between gap-3 border-b border-line pb-2 last:border-0">
                    <span>{a.action}{a.detail ? `: ${a.detail}` : ""} <span className="text-neutral-500">({a.actor?.name ?? "System"})</span></span>
                    <span className="shrink-0 text-xs text-neutral-500">{formatDate(a.createdAt)}</span>
                  </li>
                ))}
              </ul>
            )}
          </section>
        </div>

        <aside className="space-y-6">
          <section className="rounded-2xl border border-line bg-white p-5">
            <h2 className="font-display text-lg font-bold">Manage</h2>
            <label htmlFor="status" className="mb-1.5 mt-4 block text-sm font-semibold">Status</label>
            <select id="status" value={status} onChange={(e) => { setStatus(e.target.value); void patch({ status: e.target.value }); }} className="w-full rounded-xl border border-line px-3.5 py-2.5 text-sm">
              {INQUIRY_STATUSES.map((s) => <option key={s} value={s}>{s.replace(/_/g, " ")}</option>)}
            </select>
            <label htmlFor="assignee" className="mb-1.5 mt-4 block text-sm font-semibold">Assigned to</label>
            <select id="assignee" value={assignee} onChange={(e) => { setAssignee(e.target.value); void patch({ assignedTo: e.target.value || null }); }} className="w-full rounded-xl border border-line px-3.5 py-2.5 text-sm">
              <option value="">Unassigned</option>
              {users.map((u) => <option key={u._id} value={u._id}>{u.name} ({u.email})</option>)}
            </select>
            <button
              disabled={busy}
              onClick={() => void patch({ archived: true })}
              className="mt-5 w-full rounded-full border border-red-200 px-4 py-2.5 text-sm font-semibold text-red-600 hover:bg-red-50 disabled:opacity-60"
            >
              Archive inquiry
            </button>
          </section>
          <a href={`mailto:${inquiry.email}?subject=Re: ${encodeURIComponent(inquiry.subject)} (${inquiry.reference})`} className="block rounded-2xl bg-ink p-5 text-white">
            <p className="font-display text-lg font-bold">Reply by email</p>
            <p className="mt-1 text-sm text-neutral-400">Opens your email client addressed to {inquiry.email}.</p>
          </a>
        </aside>
      </div>
    </div>
  );
}
