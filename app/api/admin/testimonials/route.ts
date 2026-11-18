import { Testimonial } from "@/models/Content";
import { testimonialSchema } from "@/lib/validation";
import { makeAdminHandlers } from "@/lib/admin-crud";

const h = makeAdminHandlers({
  model: Testimonial as never, schema: testimonialSchema, searchFields: ["clientName", "company"],
  sort: { order: 1, updatedAt: -1 }, softDelete: true,
  listFilter: (sp) => { const f: Record<string, unknown> = {}; const s = sp.get("status"); if (s) f.status = s; return f; },
});
export const GET = h.list;
export const POST = h.create;
