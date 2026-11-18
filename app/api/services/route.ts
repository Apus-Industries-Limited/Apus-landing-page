import { connectDB } from "@/lib/db";
import { Service } from "@/models/Service";
import { ok, fail, serialize } from "@/lib/api-helpers";
import { parsePagination, paginatedResponse } from "@/lib/utils";

export async function GET(req: Request) {
  const db = await connectDB();
  if (!db) return ok(paginatedResponse([], 0, 1, 12));
  const url = new URL(req.url);
  const { page, limit, skip } = parsePagination(url.searchParams);
  const featured = url.searchParams.get("featured");
  const q: Record<string, unknown> = { active: true };
  if (featured === "true") q.featured = true;
  const [items, total] = await Promise.all([
    Service.find(q).sort({ order: 1, name: 1 }).skip(skip).limit(limit).lean(),
    Service.countDocuments(q),
  ]);
  const data = items.map((d) => {
    const { ...rest } = serialize(d as unknown as Record<string, unknown>);
    return rest;
  });
  return ok(paginatedResponse(data, total, page, limit));
}
