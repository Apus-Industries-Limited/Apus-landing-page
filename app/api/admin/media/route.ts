import { connectDB } from "@/lib/db";
import { Media } from "@/models/Crm";
import { ok, fail, serialize, requireAdmin, parseJson } from "@/lib/api-helpers";
import { getPresignedUploadUrl, publicUrlForKey, isR2Configured, ALLOWED_IMAGE_TYPES, ALLOWED_DOC_TYPES, MAX_UPLOAD_BYTES } from "@/lib/r2";
import { mediaUploadSchema } from "@/lib/validation";
import { parsePagination, paginatedResponse, escapeRegExp } from "@/lib/utils";
import { randomUUID } from "crypto";

export async function GET(req: Request) {
  const gate = await requireAdmin();
  if ("error" in gate) return gate.error;
  const db = await connectDB();
  if (!db) return fail("Database is not configured.", 503);
  const url = new URL(req.url);
  const { page, limit, skip } = parsePagination(url.searchParams);
  const q: Record<string, unknown> = {};
  const folder = url.searchParams.get("folder");
  if (folder) q.folder = folder;
  const search = url.searchParams.get("q");
  if (search) q.filename = { $regex: escapeRegExp(search), $options: "i" };
  const [items, total] = await Promise.all([
    Media.find(q).sort({ createdAt: -1 }).skip(skip).limit(limit).lean(),
    Media.countDocuments(q),
  ]);
  return ok(paginatedResponse(items.map((d) => serialize(d)), total, page, limit));
}

/** Step 1 — request a presigned upload URL. Body: { filename, contentType, folder } */
export async function POST(req: Request) {
  const gate = await requireAdmin();
  if ("error" in gate) return gate.error;
  if (!isR2Configured()) return fail("Cloudflare R2 is not configured. Set R2_* variables in .env.local.", 503);
  const body = await parseJson<{ filename?: string; contentType?: string; folder?: string; size?: number }>(req);
  if (!body?.filename || !body?.contentType) return fail("filename and contentType are required.", 400);
  const allowed = [...ALLOWED_IMAGE_TYPES, ...ALLOWED_DOC_TYPES];
  if (!allowed.includes(body.contentType)) return fail("File type is not allowed.", 415);
  if (body.size && body.size > MAX_UPLOAD_BYTES) return fail("File is too large (max 10 MB).", 413);
  const folder = (body.folder || "general").replace(/[^a-z0-9-]/gi, "").toLowerCase() || "general";
  const ext = body.filename.includes(".") ? body.filename.split(".").pop() : "bin";
  const key = `${folder}/${Date.now()}-${randomUUID().slice(0, 8)}.${ext}`;
  const uploadUrl = await getPresignedUploadUrl(key, body.contentType);
  if (!uploadUrl) return fail("Could not create an upload URL.", 500);
  return ok({ key, uploadUrl, publicUrl: publicUrlForKey(key) }, 201);
}

/** Step 2 — confirm the upload so the file is recorded in MongoDB. Body: mediaUploadSchema */
export async function PUT(req: Request) {
  const gate = await requireAdmin();
  if ("error" in gate) return gate.error;
  const db = await connectDB();
  if (!db) return fail("Database is not configured.", 503);
  const body = await parseJson<unknown>(req);
  const parsed = mediaUploadSchema.safeParse(body);
  if (!parsed.success) return fail("Validation failed.", 422, parsed.error.issues);
  const doc = await Media.create({
    ...parsed.data,
    url: publicUrlForKey(parsed.data.key),
    uploadedBy: gate.user.id,
  });
  return ok(serialize(doc.toObject()), 201);
}
