import type { Model } from "mongoose";
import { z } from "zod";
import { connectDB } from "@/lib/db";
import { ok, fail, serialize, requireAdmin, parseJson } from "@/lib/api-helpers";
import { parsePagination, paginatedResponse, escapeRegExp, slugify } from "@/lib/utils";
import { zodErrorMessage } from "@/lib/validation";

type CrudOptions = {
  model: Model<Record<string, unknown>>;
  schema: z.AnyZodObject;
  slugField?: string;
  slugFrom?: string;
  searchFields?: string[];
  sort?: Record<string, 1 | -1>;
  softDelete?: boolean;
  listFilter?: (url: URLSearchParams) => Record<string, unknown>;
};

/** Shared list/create + get/update/delete handlers for admin resources. */
export function makeAdminHandlers(opts: CrudOptions) {
  const { model, schema, slugField, slugFrom, searchFields, sort, softDelete, listFilter } = opts;

  async function list(req: Request) {
    const gate = await requireAdmin();
    if ("error" in gate) return gate.error;
    const db = await connectDB();
    if (!db) return fail("Database is not configured.", 503);
    const url = new URL(req.url);
    const { page, limit, skip } = parsePagination(url.searchParams);
    const q: Record<string, unknown> = { ...(softDelete ? { deletedAt: null } : {}) };
    const search = url.searchParams.get("q");
    if (search && searchFields?.length) {
      q.$or = searchFields.map((f) => ({ [f]: { $regex: escapeRegExp(search), $options: "i" } }));
    }
    if (listFilter) Object.assign(q, listFilter(url.searchParams));
    const [items, total] = await Promise.all([
      model.find(q).sort(sort ?? { updatedAt: -1 }).skip(skip).limit(limit).lean(),
      model.countDocuments(q),
    ]);
    return ok(paginatedResponse(items.map((d) => serialize(d)), total, page, limit));
  }

  async function create(req: Request) {
    const gate = await requireAdmin();
    if ("error" in gate) return gate.error;
    const db = await connectDB();
    if (!db) return fail("Database is not configured.", 503);
    const body = await parseJson<Record<string, unknown>>(req);
    if (!body) return fail("Invalid JSON body.", 400);
    const data = { ...body };
    if (slugField && slugFrom && typeof data[slugFrom] === "string" && !data[slugField]) {
      data[slugField] = slugify(data[slugFrom] as string);
    }
    const parsed = schema.safeParse(data);
    if (!parsed.success) return fail("Validation failed.", 422, parsed.error.issues);
    try {
      const doc = await model.create(parsed.data);
      return ok(serialize(doc.toObject()), 201);
    } catch (err) {
      const e = err as { code?: number; message?: string };
      if (e.code === 11000) return fail("A record with this slug already exists.", 409);
      console.error("[admin create]", err);
      return fail("Could not create the record.", 500);
    }
  }

  async function getOne(_req: Request, id: string) {
    const gate = await requireAdmin();
    if ("error" in gate) return gate.error;
    const db = await connectDB();
    if (!db) return fail("Database is not configured.", 503);
    const doc = await model.findById(id).lean();
    if (!doc) return fail("Not found.", 404);
    return ok(serialize(doc));
  }

  async function update(req: Request, id: string) {
    const gate = await requireAdmin();
    if ("error" in gate) return gate.error;
    const db = await connectDB();
    if (!db) return fail("Database is not configured.", 503);
    const body = await parseJson<Record<string, unknown>>(req);
    if (!body) return fail("Invalid JSON body.", 400);
    const parsed = schema.partial().safeParse(body);
    if (!parsed.success) return fail("Validation failed.", 422, parsed.error.issues);
    try {
      const doc = await model.findByIdAndUpdate(id, parsed.data, { new: true, runValidators: true });
      if (!doc) return fail("Not found.", 404);
      return ok(serialize(doc.toObject()));
    } catch (err) {
      const e = err as { code?: number };
      if (e.code === 11000) return fail("A record with this slug already exists.", 409);
      console.error("[admin update]", err);
      return fail("Could not update the record.", 500);
    }
  }

  async function remove(_req: Request, id: string) {
    const gate = await requireAdmin(["super_admin", "admin"]);
    if ("error" in gate) return gate.error;
    const db = await connectDB();
    if (!db) return fail("Database is not configured.", 503);
    const doc = softDelete
      ? await model.findByIdAndUpdate(id, { deletedAt: new Date() }, { new: true })
      : await model.findByIdAndDelete(id);
    if (!doc) return fail("Not found.", 404);
    return ok({ deleted: true });
  }

  return { list, create, getOne, update, remove, zodErrorMessage };
}
