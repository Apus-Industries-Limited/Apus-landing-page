import bcrypt from "bcryptjs";
import { connectDB } from "@/lib/db";
import { User } from "@/models/User";
import { ok, fail, serialize, requireAdmin, parseJson } from "@/lib/api-helpers";
import { userSchema } from "@/lib/validation";
import { parsePagination, paginatedResponse } from "@/lib/utils";

export async function GET(req: Request) {
  const gate = await requireAdmin(["super_admin"]);
  if ("error" in gate) return gate.error;
  const db = await connectDB();
  if (!db) return fail("Database is not configured.", 503);
  const url = new URL(req.url);
  const { page, limit, skip } = parsePagination(url.searchParams);
  const [items, total] = await Promise.all([
    User.find({}).select("-passwordHash").sort({ createdAt: -1 }).skip(skip).limit(limit).lean(),
    User.countDocuments({}),
  ]);
  return ok(paginatedResponse(items.map((d) => serialize(d)), total, page, limit));
}

export async function POST(req: Request) {
  const gate = await requireAdmin(["super_admin"]);
  if ("error" in gate) return gate.error;
  const db = await connectDB();
  if (!db) return fail("Database is not configured.", 503);
  const body = await parseJson<unknown>(req);
  const parsed = userSchema.safeParse(body);
  if (!parsed.success) return fail("Validation failed.", 422, parsed.error.issues);
  if (!parsed.data.password) return fail("Password is required.", 422);
  const existing = await User.findOne({ email: parsed.data.email.toLowerCase() });
  if (existing) return fail("A user with this email already exists.", 409);
  const passwordHash = await bcrypt.hash(parsed.data.password, 12);
  const user = await User.create({ name: parsed.data.name, email: parsed.data.email.toLowerCase(), passwordHash, role: parsed.data.role, active: parsed.data.active });
  const out = user.toObject() as Record<string, unknown>;
  delete out.passwordHash;
  return ok(serialize(out), 201);
}
