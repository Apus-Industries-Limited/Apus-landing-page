import { connectDB } from "@/lib/db";
import { Media } from "@/models/Crm";
import { serialize } from "@/lib/api-helpers";
import MediaUploader from "@/components/admin/MediaUploader";
import MediaList from "@/components/admin/MediaList";
import { isR2Configured } from "@/lib/r2";

export default async function AdminMediaPage({ searchParams }: { searchParams: Promise<{ folder?: string; q?: string }> }) {
  const sp = await searchParams;
  const db = await connectDB();
  const q: Record<string, unknown> = {};
  if (sp.folder) q.folder = sp.folder;
  if (sp.q) q.filename = { $regex: sp.q, $options: "i" };
  const items = db ? serialize(await Media.find(q).sort({ createdAt: -1 }).limit(60).lean()) : [];
  return (
    <div>
      <h1 className="font-display text-2xl font-bold sm:text-3xl">Media Library</h1>
      <p className="mt-1 text-sm text-neutral-500">Files stored in Cloudflare R2. Copy a file&apos;s public URL and paste it into a service, project, team member or testimonial.</p>
      {!isR2Configured() && (
        <div className="mt-4 rounded-2xl border border-amber-300 bg-amber-50 p-4 text-sm">
          <strong>R2 is not configured.</strong> Set <code>R2_ACCOUNT_ID</code>, <code>R2_ACCESS_KEY_ID</code>, <code>R2_SECRET_ACCESS_KEY</code>, <code>R2_BUCKET</code> and <code>R2_PUBLIC_URL</code> in <code>.env.local</code> to enable uploads.
        </div>
      )}
      <div className="mt-6"><MediaUploader /></div>
      <form method="get" className="mt-6 flex flex-wrap gap-3">
        <select name="folder" defaultValue={sp.folder ?? ""} className="rounded-full border border-line bg-white px-4 py-2.5 text-sm font-medium">
          <option value="">All folders</option>
          {["general", "projects", "services", "team", "testimonials", "partners", "logos"].map((f) => <option key={f} value={f}>{f}</option>)}
        </select>
        <input name="q" defaultValue={sp.q ?? ""} placeholder="Search by filename…" className="min-w-[200px] flex-1 rounded-full border border-line bg-white px-4 py-2.5 text-sm" />
        <button type="submit" className="rounded-full bg-ink px-5 py-2.5 text-sm font-semibold text-white">Filter</button>
      </form>
      <div className="mt-6">
        <MediaList items={items as never} />
      </div>
    </div>
  );
}
