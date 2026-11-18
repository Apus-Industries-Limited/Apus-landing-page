import { connectDB } from "@/lib/db";
import { Project } from "@/models/Project";
import { ok, serialize } from "@/lib/api-helpers";
import { parsePagination, paginatedResponse, escapeRegExp } from "@/lib/utils";

export async function GET(req: Request) {
  const db = await connectDB();
  if (!db) return ok(paginatedResponse([], 0, 1, 12));
  const url = new URL(req.url);
  const { page, limit, skip } = parsePagination(url.searchParams);
  const q: Record<string, unknown> = { status: "published", deletedAt: null };
  const category = url.searchParams.get("category");
  const search = url.searchParams.get("q");
  if (category) q.category = category;
  if (search) q.name = { $regex: escapeRegExp(search), $options: "i" };
  if (url.searchParams.get("featured") === "true") q.featured = true;
  const [items, total] = await Promise.all([
    Project.find(q).sort({ order: 1, projectDate: -1 }).skip(skip).limit(limit).lean(),
    Project.countDocuments(q),
  ]);
  return ok(paginatedResponse(items.map((d) => serialize(d)), total, page, limit));
}
