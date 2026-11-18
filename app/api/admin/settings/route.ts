import { connectDB } from "@/lib/db";
import { WebsiteSettings } from "@/models/Crm";
import { ok, fail, serialize, requireAdmin, parseJson } from "@/lib/api-helpers";
import { settingsSchema } from "@/lib/validation";
import { getSettings, invalidateSettingsCache } from "@/lib/settings";

export async function GET() {
  const gate = await requireAdmin();
  if ("error" in gate) return gate.error;
  const settings = await getSettings();
  return ok(serialize(settings));
}

export async function PUT(req: Request) {
  const gate = await requireAdmin(["super_admin", "admin"]);
  if ("error" in gate) return gate.error;
  const db = await connectDB();
  if (!db) return fail("Database is not configured.", 503);
  const body = await parseJson<unknown>(req);
  const parsed = settingsSchema.safeParse(body);
  if (!parsed.success) return fail("Validation failed.", 422, parsed.error.issues);
  const doc = await WebsiteSettings.findOneAndUpdate(
    { singleton: "main" },
    { ...parsed.data, singleton: "main" },
    { new: true, upsert: true, runValidators: true }
  );
  invalidateSettingsCache();
  return ok(serialize(doc.toObject()));
}
