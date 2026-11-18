import { connectDB } from "@/lib/db";
import { TeamMember } from "@/models/Content";
import { ok, serialize } from "@/lib/api-helpers";
import { parsePagination, paginatedResponse } from "@/lib/utils";

export async function GET(req: Request) {
  const db = await connectDB();
  if (!db) return ok(paginatedResponse([], 0, 1, 12));
  const url = new URL(req.url);
  const { page, limit, skip } = parsePagination(url.searchParams);
  const q = { active: true, deletedAt: null };
  const [items, total] = await Promise.all([
    TeamMember.find(q).sort({ order: 1 }).skip(skip).limit(limit).lean(),
    TeamMember.countDocuments(q),
  ]);
  return ok(paginatedResponse(items.map((d) => serialize(d)), total, page, limit));
}
