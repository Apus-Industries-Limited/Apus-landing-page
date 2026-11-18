import { connectDB } from "@/lib/db";
import { Media } from "@/models/Crm";
import { Project } from "@/models/Project";
import { Service } from "@/models/Service";
import { Testimonial, Partner, TeamMember } from "@/models/Content";
import { ok, fail, requireAdmin } from "@/lib/api-helpers";
import { deleteFromR2 } from "@/lib/r2";

type Ctx = { params: Promise<{ id: string }> };

export async function DELETE(_req: Request, ctx: Ctx) {
  const { id } = await ctx.params;
  const gate = await requireAdmin(["super_admin", "admin"]);
  if ("error" in gate) return gate.error;
  const db = await connectDB();
  if (!db) return fail("Database is not configured.", 503);
  const media = await Media.findById(id);
  if (!media) return fail("Not found.", 404);
  // Reference check: refuse to delete assets still used by published content.
  const url = media.url as string;
  const usedIn = await Promise.all([
    Project.countDocuments({ $or: [{ coverImage: url }, { gallery: url }] }),
    Service.countDocuments({ coverImage: url }),
    Testimonial.countDocuments({ photo: url }),
    Partner.countDocuments({ logo: url }),
    TeamMember.countDocuments({ photo: url }),
  ]);
  if (usedIn.some((n) => n > 0)) {
    return fail("This file is still referenced by website content. Remove it from that content first.", 409);
  }
  await deleteFromR2(media.key as string);
  await media.deleteOne();
  return ok({ deleted: true });
}
