import { connectDB } from "@/lib/db";
import { Inquiry, InquiryNote, InquiryActivity } from "@/models/Crm";
import { ok, fail, serialize, requireAdmin, parseJson } from "@/lib/api-helpers";
import { inquiryStatusSchema, inquiryNoteSchema } from "@/lib/validation";

type Ctx = { params: Promise<{ id: string }> };

export async function GET(_req: Request, ctx: Ctx) {
  const { id } = await ctx.params;
  const gate = await requireAdmin();
  if ("error" in gate) return gate.error;
  const db = await connectDB();
  if (!db) return fail("Database is not configured.", 503);
  const inquiry = await Inquiry.findById(id).populate("assignedTo", "name email").lean();
  if (!inquiry) return fail("Not found.", 404);
  const [notes, activity] = await Promise.all([
    InquiryNote.find({ inquiry: id }).populate("author", "name").sort({ createdAt: -1 }).lean(),
    InquiryActivity.find({ inquiry: id }).populate("actor", "name").sort({ createdAt: -1 }).limit(50).lean(),
  ]);
  return ok({ ...serialize(inquiry), notes: notes.map((n) => serialize(n)), activity: activity.map((a) => serialize(a)) });
}

export async function PATCH(req: Request, ctx: Ctx) {
  const { id } = await ctx.params;
  const gate = await requireAdmin();
  if ("error" in gate) return gate.error;
  const db = await connectDB();
  if (!db) return fail("Database is not configured.", 503);
  const body = await parseJson<Record<string, unknown>>(req);
  if (!body) return fail("Invalid JSON body.", 400);
  const updates: Record<string, unknown> = {};
  if (body.status !== undefined) {
    const s = inquiryStatusSchema.safeParse(body.status);
    if (!s.success) return fail("Invalid status.", 422);
    updates.status = s.data;
  }
  if (body.assignedTo !== undefined) updates.assignedTo = body.assignedTo || null;
  if (body.archived !== undefined) updates.archived = Boolean(body.archived);
  const doc = await Inquiry.findByIdAndUpdate(id, updates, { new: true });
  if (!doc) return fail("Not found.", 404);
  await InquiryActivity.create({ inquiry: id, actor: gate.user.id, action: "Updated inquiry", detail: Object.keys(updates).join(", ") });
  return ok(serialize(doc.toObject()));
}

export async function DELETE(_req: Request, ctx: Ctx) {
  const { id } = await ctx.params;
  const gate = await requireAdmin(["super_admin", "admin"]);
  if ("error" in gate) return gate.error;
  const db = await connectDB();
  if (!db) return fail("Database is not configured.", 503);
  const doc = await Inquiry.findByIdAndUpdate(id, { archived: true }, { new: true });
  if (!doc) return fail("Not found.", 404);
  return ok({ archived: true });
}
