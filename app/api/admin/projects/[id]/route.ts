import { Project } from "@/models/Project";
import { projectSchema } from "@/lib/validation";
import { makeAdminHandlers } from "@/lib/admin-crud";

const h = makeAdminHandlers({ model: Project as never, schema: projectSchema, slugField: "slug", slugFrom: "name", softDelete: true });
export const GET = (_req: Request, ctx: { params: Promise<{ id: string }> }) => ctx.params.then((p) => h.getOne(_req, p.id));
export const PATCH = (req: Request, ctx: { params: Promise<{ id: string }> }) => ctx.params.then((p) => h.update(req, p.id));
export const DELETE = (req: Request, ctx: { params: Promise<{ id: string }> }) => ctx.params.then((p) => h.remove(req, p.id));
