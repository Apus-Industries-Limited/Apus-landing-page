import ResourceListPage from "@/components/admin/ResourceListPage";
import { adminList } from "@/lib/admin-data";
import { Project, PROJECT_CATEGORIES } from "@/models/Project";
import type { FieldDef } from "@/components/admin/ResourceForm";

const FIELDS: FieldDef[] = [
  { name: "name", label: "Project name", type: "text" },
  { name: "slug", label: "Slug", type: "text", help: "Leave blank to generate from the name." },
  { name: "summary", label: "Summary", type: "textarea", rows: 2 },
  { name: "description", label: "Detailed description", type: "textarea", rows: 6 },
  { name: "client", label: "Client (optional)", type: "text" },
  { name: "industry", label: "Industry", type: "text", placeholder: "e.g. Hospitality" },
  { name: "category", label: "Category", type: "select", options: PROJECT_CATEGORIES.map((c) => ({ value: c, label: c })) },
  { name: "services", label: "Services involved (comma-separated)", type: "tags" },
  { name: "technologies", label: "Technologies used (comma-separated)", type: "tags" },
  { name: "coverImage", label: "Cover image URL", type: "url", help: "Paste a Media Library URL." },
  { name: "gallery", label: "Gallery image URLs (comma-separated)", type: "tags" },
  { name: "projectUrl", label: "Project URL (optional)", type: "url" },
  { name: "status", label: "Status", type: "select", options: [{ value: "draft", label: "Draft" }, { value: "published", label: "Published" }], help: "Only published projects appear on the public site." },
  { name: "featured", label: "Featured on the homepage", type: "checkbox" },
  { name: "order", label: "Display order", type: "number" },
];

export default async function AdminProjectsPage() {
  const items = await adminList(() => Project.find({ deletedAt: null }).sort({ order: 1, updatedAt: -1 }).lean());
  return (
    <ResourceListPage
      title="Projects" description="Portfolio projects. Save as draft to keep a project off the public site; publish when it is ready. Preview a published project at /projects/[slug]."
      apiPath="/api/admin/projects" fields={FIELDS}
      columns={[{ key: "slug", label: "Slug" }, { key: "category", label: "Category" }, { key: "industry", label: "Industry" }, { key: "client", label: "Client" }]}
      items={items as unknown as Record<string, unknown>[]}
    />
  );
}
