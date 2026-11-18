import { connectDB } from "@/lib/db";
import { Inquiry, InquiryNote, InquiryActivity } from "@/models/Crm";
import { ok, fail, serialize, requireAdmin, parseJson } from "@/lib/api-helpers";
import { inquiryNoteSchema } from "@/lib/validation";

type Ctx = { params: Promise<{ id: string }> };

export async function POST(req: Request, ctx: Ctx) {
  const { id } = await ctx.params;
  const gate = await requireAdmin();
  if ("error" in gate) return gate.error;
  const db = await connectDB();
  if (!db) return fail("Database is not configured.", 503);
  const inquiry = await Inquiry.findById(id);
  if (!inquiry) return fail("Not found.", 404);
  const body = await parseJson<unknown>(req);
  const parsed = inquiryNoteSchema.safeParse(body);
  if (!parsed.success) return fail("Validation failed.", 422, parsed.error.issues);
  const note = await InquiryNote.create({ inquiry: id, author: gate.user.id, body: parsed.data.body });
  await InquiryActivity.create({ inquiry: id, actor: gate.user.id, action: "Added a note" });
  return ok(serialize(note.toObject()), 201);
}
