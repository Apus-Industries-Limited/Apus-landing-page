import { Partner } from "@/models/Content";
import { partnerSchema } from "@/lib/validation";
import { makeAdminHandlers } from "@/lib/admin-crud";

const h = makeAdminHandlers({ model: Partner as never, schema: partnerSchema, searchFields: ["name"], sort: { order: 1, updatedAt: -1 }, softDelete: true });
export const GET = h.list;
export const POST = h.create;
