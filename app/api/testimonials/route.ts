import { connectDB } from "@/lib/db";
import { Testimonial, Partner, TeamMember } from "@/models/Content";
import { ok, serialize } from "@/lib/api-helpers";
import { parsePagination, paginatedResponse } from "@/lib/utils";

export async function GET(req: Request) {
  const db = await connectDB();
  if (!db) return ok(paginatedResponse([], 0, 1, 12));
  const url = new URL(req.url);
  const { page, limit, skip } = parsePagination(url.searchParams);
  const [items, total] = await Promise.all([
    Testimonial.find({ status: "approved", published: true, deletedAt: null }).sort({ order: 1 }).skip(skip).limit(limit).lean(),
    Testimonial.countDocuments({ status: "approved", published: true, deletedAt: null }),
  ]);
  return ok(paginatedResponse(items.map((d) => serialize(d)), total, page, limit));
}
