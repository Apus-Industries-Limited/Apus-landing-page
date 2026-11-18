import ResourceListPage from "@/components/admin/ResourceListPage";
import { adminList } from "@/lib/admin-data";
import { Partner } from "@/models/Content";
import type { FieldDef } from "@/components/admin/ResourceForm";

const FIELDS: FieldDef[] = [
  { name: "name", label: "Partner name", type: "text" },
  { name: "logo", label: "Logo URL", type: "url", help: "Upload the logo in Media Library and paste its URL here." },
  { name: "website", label: "Website URL", type: "url" },
  { name: "description", label: "Short description", type: "textarea", rows: 2 },
  { name: "order", label: "Display order", type: "number" },
  { name: "active", label: "Active (visible on the site)", type: "checkbox" },
];

export default async function AdminPartnersPage() {
  const items = await adminList(() => Partner.find({ deletedAt: null }).sort({ order: 1 }).lean());
  return (
    <ResourceListPage
      title="Partners" description="Trusted partners shown on the homepage. Only real, approved partners — add a logo and website for each."
      apiPath="/api/admin/partners" fields={FIELDS}
      columns={[{ key: "website", label: "Website" }, { key: "description", label: "Description" }]}
      items={items as unknown as Record<string, unknown>[]}
    />
  );
}
