import ResourceListPage from "@/components/admin/ResourceListPage";
import { adminList } from "@/lib/admin-data";
import { TeamMember } from "@/models/Content";
import type { FieldDef } from "@/components/admin/ResourceForm";

const FIELDS: FieldDef[] = [
  { name: "name", label: "Full name", type: "text" },
  { name: "title", label: "Job title", type: "text" },
  { name: "photo", label: "Photo URL", type: "url", help: "Upload the photo in Media Library and paste its URL here." },
  { name: "bio", label: "Short biography", type: "textarea", rows: 4 },
  { name: "expertise", label: "Areas of expertise (separated by commas)", type: "tags" },
  { name: "linkedin", label: "LinkedIn URL", type: "url" },
  { name: "order", label: "Display order", type: "number" },
  { name: "featured", label: "Featured", type: "checkbox" },
  { name: "active", label: "Active (visible on the site)", type: "checkbox" },
];

export default async function AdminTeamPage() {
  const items = await adminList(() => TeamMember.find({ deletedAt: null }).sort({ order: 1 }).lean());
  return (
    <ResourceListPage
      title="Team" description="Team members shown on the About page. Add real team members only. Do not invent names, titles or qualifications."
      apiPath="/api/admin/team" fields={FIELDS}
      columns={[{ key: "title", label: "Title" }, { key: "bio", label: "Bio" }]}
      items={items as unknown as Record<string, unknown>[]}
    />
  );
}
