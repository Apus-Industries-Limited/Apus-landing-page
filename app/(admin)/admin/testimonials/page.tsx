import ResourceListPage from "@/components/admin/ResourceListPage";
import { adminList } from "@/lib/admin-data";
import { Testimonial } from "@/models/Content";
import type { FieldDef } from "@/components/admin/ResourceForm";

const FIELDS: FieldDef[] = [
  { name: "clientName", label: "Client name", type: "text" },
  { name: "position", label: "Position", type: "text" },
  { name: "company", label: "Company", type: "text" },
  { name: "photo", label: "Photo URL (optional)", type: "url", help: "Paste a Media Library URL." },
  { name: "quote", label: "Testimonial", type: "textarea", rows: 4 },
  { name: "project", label: "Related project (optional)", type: "text" },
  { name: "status", label: "Status", type: "select", options: [
    { value: "pending", label: "Pending review" }, { value: "approved", label: "Approved" }, { value: "rejected", label: "Rejected" },
  ], help: "Only approved + published testimonials appear on the site." },
  { name: "published", label: "Published", type: "checkbox" },
  { name: "order", label: "Display order", type: "number" },
];

export default async function AdminTestimonialsPage() {
  const items = await adminList(() => Testimonial.find({ deletedAt: null }).sort({ order: 1, updatedAt: -1 }).lean());
  return (
    <ResourceListPage
      title="Testimonials" description="Client testimonials. Approve and publish only genuine testimonials supplied by real clients. Never invent them."
      apiPath="/api/admin/testimonials" fields={FIELDS}
      columns={[{ key: "company", label: "Company" }, { key: "position", label: "Position" }, { key: "quote", label: "Testimonial" }]}
      items={items as unknown as Record<string, unknown>[]}
    />
  );
}
