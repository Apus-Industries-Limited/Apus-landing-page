import { TeamMember } from "@/models/Content";
import { teamMemberSchema } from "@/lib/validation";
import { makeAdminHandlers } from "@/lib/admin-crud";

const h = makeAdminHandlers({ model: TeamMember as never, schema: teamMemberSchema, searchFields: ["name", "title"], sort: { order: 1, updatedAt: -1 }, softDelete: true });
export const GET = h.list;
export const POST = h.create;
