import ResourceListPage from "@/components/admin/ResourceListPage";
import { adminList } from "@/lib/admin-data";
import { Service } from "@/models/Service";
import type { FieldDef } from "@/components/admin/ResourceForm";

const FIELDS: FieldDef[] = [
  { name: "name", label: "Name", type: "text", placeholder: "Software Development and Digital Solutions" },
  { name: "slug", label: "Slug", type: "text", help: "Leave blank to generate from the name. Changing a slug changes the public URL." },
  { name: "shortDescription", label: "Short description", type: "textarea", rows: 2 },
  { name: "description", label: "Full description", type: "textarea", rows: 6 },
  { name: "icon", label: "Icon", type: "select", options: [
    { value: "Code2", label: "Code (software)" }, { value: "Smartphone", label: "Smartphone (web & mobile)" },
    { value: "Zap", label: "Zap (electrical)" }, { value: "Sun", label: "Sun (solar)" },
    { value: "Server", label: "Server (infrastructure)" }, { value: "Cpu", label: "CPU (general)" },
  ] },
  { name: "coverImage", label: "Cover image URL", type: "url", help: "Paste a Media Library URL, or leave blank." },
  { name: "benefits", label: "Benefits (separated by commas)", type: "tags" },
  { name: "features", label: "Features / capabilities (separated by commas)", type: "tags" },
  { name: "order", label: "Display order", type: "number" },
  { name: "featured", label: "Featured on the homepage", type: "checkbox" },
  { name: "active", label: "Active (visible on the site)", type: "checkbox" },
];

export default async function AdminServicesPage() {
  const items = await adminList(() => Service.find({}).sort({ order: 1 }).lean());
  return (
    <ResourceListPage
      title="Services" description="Services shown on the homepage and Services pages. The five categories from the brief are seeded. Edit them here. Never hardcode them in code."
      apiPath="/api/admin/services" fields={FIELDS}
      columns={[{ key: "slug", label: "Slug" }, { key: "shortDescription", label: "Short description" }, { key: "order", label: "Order" }]}
      items={items as unknown as Record<string, unknown>[]}
    />
  );
}
