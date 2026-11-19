import Link from "next/link";
import { connectDB } from "@/lib/db";
import { Inquiry, INQUIRY_STATUSES } from "@/models/Crm";
import { formatDate } from "@/lib/utils";
import { StatusBadge, EmptyState } from "@/components/admin/ui";

export default async function AdminInquiriesPage({ searchParams }: { searchParams: Promise<{ status?: string; q?: string }> }) {
  const sp = await searchParams;
  const status = sp.status || "";
  const q = sp.q || "";
  const db = await connectDB();
  const query: Record<string, unknown> = { archived: { $ne: true } };
  if (status) query.status = status;
  if (q) query.$or = ["name", "email", "company", "reference", "subject"].map((f) => ({ [f]: { $regex: q, $options: "i" } }));
  const items = db ? await Inquiry.find(query).sort({ createdAt: -1 }).limit(50).lean() : [];
  return (
    <div>
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h1 className="font-display text-2xl font-bold sm:text-3xl">Inquiries</h1>
          <p className="mt-1 text-sm text-neutral-500">Customer enquiries from the contact form. Internal notes and statuses are never shown on the public site.</p>
        </div>
        <a href="/api/admin/inquiries/export" className="rounded-full border border-line bg-white px-4 py-2 text-sm font-semibold">Export CSV</a>
      </div>
      <form method="get" className="mt-6 flex flex-wrap gap-3">
        <select name="status" defaultValue={status} className="rounded-full border border-line bg-white px-4 py-2.5 text-sm font-medium">
          <option value="">All statuses</option>
          {INQUIRY_STATUSES.map((s) => <option key={s} value={s}>{s.replace(/_/g, " ")}</option>)}
        </select>
        <input name="q" defaultValue={q} placeholder="Search name, email, reference…" className="min-w-[220px] flex-1 rounded-full border border-line bg-white px-4 py-2.5 text-sm" />
        <button type="submit" className="rounded-full bg-ink px-5 py-2.5 text-sm font-semibold text-white">Filter</button>
      </form>
      <div className="mt-6">
        {items.length === 0 ? (
          <EmptyState title="No inquiries yet" text="New contact form submissions will appear here with a reference number (APUS-YYYY-XXXX)." />
        ) : (
          <div className="overflow-x-auto rounded-2xl border border-line bg-white">
            <table className="w-full min-w-[640px] text-left text-sm">
              <thead className="border-b border-line text-xs uppercase tracking-wider text-neutral-500">
                <tr><th className="px-4 py-3">Reference</th><th className="px-4 py-3">Name</th><th className="px-4 py-3">Subject</th><th className="px-4 py-3">Status</th><th className="px-4 py-3">Date</th></tr>
              </thead>
              <tbody>
                {items.map((i) => (
                  <tr key={String(i._id)} className="border-b border-line last:border-0 hover:bg-smoke">
                    <td className="px-4 py-3 font-mono text-xs">{String(i.reference)}</td>
                    <td className="px-4 py-3"><Link href={`/admin/inquiries/${String(i._id)}`} className="font-semibold hover:text-apus-deep">{String(i.name)}</Link><span className="block text-xs text-neutral-500">{String(i.email)}</span></td>
                    <td className="px-4 py-3">{String(i.subject)}</td>
                    <td className="px-4 py-3"><StatusBadge value={String(i.status)} /></td>
                    <td className="px-4 py-3 text-neutral-500">{formatDate(i.createdAt as unknown as string)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
