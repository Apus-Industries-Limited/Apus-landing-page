import { connectDB } from "@/lib/db";
import { Inquiry } from "@/models/Crm";
import { ok, fail, serialize, requireAdmin } from "@/lib/api-helpers";
import { parsePagination, paginatedResponse, escapeRegExp } from "@/lib/utils";

export async function GET(req: Request) {
  const gate = await requireAdmin();
  if ("error" in gate) return gate.error;
  const db = await connectDB();
  if (!db) return fail("Database is not configured.", 503);
  const url = new URL(req.url);
  const { page, limit, skip } = parsePagination(url.searchParams);
  const q: Record<string, unknown> = {};
  const status = url.searchParams.get("status");
  if (status) q.status = status;
  const search = url.searchParams.get("q");
  if (search) {
    q.$or = ["name", "email", "company", "reference", "subject"].map((f) => ({ [f]: { $regex: escapeRegExp(search), $options: "i" } }));
  }
  if (url.searchParams.get("archived") === "true") q.archived = true;
  else q.archived = { $ne: true };
  const [items, total] = await Promise.all([
    Inquiry.find(q).populate("assignedTo", "name email").sort({ createdAt: -1 }).skip(skip).limit(limit).lean(),
    Inquiry.countDocuments(q),
  ]);
  return ok(paginatedResponse(items.map((d) => serialize(d)), total, page, limit));
}

export async function POST() {
  return fail("Inquiries are created through the public contact form (POST /api/contact).", 405);
}
