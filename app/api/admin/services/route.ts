import { Service } from "@/models/Service";
import { serviceSchema } from "@/lib/validation";
import { makeAdminHandlers } from "@/lib/admin-crud";

const h = makeAdminHandlers({ model: Service as never, schema: serviceSchema, slugField: "slug", slugFrom: "name", searchFields: ["name"], sort: { order: 1, updatedAt: -1 } });
export const GET = h.list;
export const POST = h.create;
