import { Testimonial } from "@/models/Content";
import { testimonialSchema } from "@/lib/validation";
import { makeAdminHandlers } from "@/lib/admin-crud";

const h = makeAdminHandlers({ model: Testimonial as never, schema: testimonialSchema, softDelete: true });
export const GET = (_req: Request, ctx: { params: Promise<{ id: string }> }) => ctx.params.then((p) => h.getOne(_req, p.id));
export const PATCH = (req: Request, ctx: { params: Promise<{ id: string }> }) => ctx.params.then((p) => h.update(req, p.id));
export const DELETE = (req: Request, ctx: { params: Promise<{ id: string }> }) => ctx.params.then((p) => h.remove(req, p.id));
