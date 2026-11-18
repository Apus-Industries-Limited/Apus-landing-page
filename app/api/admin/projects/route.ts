import { Project } from "@/models/Project";
import { projectSchema } from "@/lib/validation";
import { makeAdminHandlers } from "@/lib/admin-crud";

const h = makeAdminHandlers({
  model: Project as never, schema: projectSchema, slugField: "slug", slugFrom: "name",
  searchFields: ["name", "industry"], sort: { order: 1, updatedAt: -1 }, softDelete: true,
  listFilter: (sp) => { const f: Record<string, unknown> = {}; const s = sp.get("status"); if (s) f.status = s; const c = sp.get("category"); if (c) f.category = c; return f; },
});
export const GET = h.list;
export const POST = h.create;
