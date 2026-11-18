import { connectDB } from "@/lib/db";
import { Inquiry } from "@/models/Crm";
import { ok, fail, requireAdmin } from "@/lib/api-helpers";

function csvCell(value: unknown): string {
  const s = value == null ? "" : String(value).replace(/"/g, '""');
  return `"${s}"`;
}

export async function GET(req: Request) {
  const gate = await requireAdmin();
  if ("error" in gate) return gate.error;
  const db = await connectDB();
  if (!db) return fail("Database is not configured.", 503);
  const url = new URL(req.url);
  const q: Record<string, unknown> = {};
  const status = url.searchParams.get("status");
  if (status) q.status = status;
  const items = await Inquiry.find(q).sort({ createdAt: -1 }).limit(5000).lean();
  const header = ["Reference", "Date", "Name", "Email", "Phone", "Company", "Service", "Subject", "Status", "Message"];
  const rows = items.map((i) => [
    i.reference, new Date(i.createdAt as unknown as string).toISOString(), i.name, i.email,
    i.phone, i.company, i.service, i.subject, i.status, i.message,
  ].map(csvCell).join(","));
  const csv = [header.map(csvCell).join(","), ...rows].join("\n");
  return new Response(csv, {
    headers: {
      "Content-Type": "text/csv; charset=utf-8",
      "Content-Disposition": `attachment; filename="apus-inquiries-${new Date().toISOString().slice(0, 10)}.csv"`,
    },
  });
}
