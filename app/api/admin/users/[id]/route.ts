import bcrypt from "bcryptjs";
import { connectDB } from "@/lib/db";
import { User } from "@/models/User";
import { ok, fail, serialize, requireAdmin, parseJson } from "@/lib/api-helpers";
import { userSchema } from "@/lib/validation";

type Ctx = { params: Promise<{ id: string }> };

export async function PATCH(req: Request, ctx: Ctx) {
  const { id } = await ctx.params;
  const gate = await requireAdmin(["super_admin"]);
  if ("error" in gate) return gate.error;
  const db = await connectDB();
  if (!db) return fail("Database is not configured.", 503);
  const body = await parseJson<Record<string, unknown>>(req);
  if (!body) return fail("Invalid JSON body.", 400);
  const parsed = userSchema.partial().safeParse(body);
  if (!parsed.success) return fail("Validation failed.", 422, parsed.error.issues);
  const updates: Record<string, unknown> = { ...parsed.data };
  delete updates.password;
  if (parsed.data.password) updates.passwordHash = await bcrypt.hash(parsed.data.password, 12);
  const user = await User.findByIdAndUpdate(id, updates, { new: true }).select("-passwordHash");
  if (!user) return fail("Not found.", 404);
  return ok(serialize(user.toObject()));
}

export async function DELETE(_req: Request, ctx: Ctx) {
  const { id } = await ctx.params;
  const gate = await requireAdmin(["super_admin"]);
  if ("error" in gate) return gate.error;
  const db = await connectDB();
  if (!db) return fail("Database is not configured.", 503);
  if (gate.user.id === id) return fail("You cannot delete your own account.", 400);
  const user = await User.findByIdAndDelete(id);
  if (!user) return fail("Not found.", 404);
  return ok({ deleted: true });
}
