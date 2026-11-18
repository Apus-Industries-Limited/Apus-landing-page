import { redirect } from "next/navigation";
import ResourceListPage from "@/components/admin/ResourceListPage";
import { adminList } from "@/lib/admin-data";
import { User } from "@/models/User";
import { auth } from "@/lib/auth";
import type { FieldDef } from "@/components/admin/ResourceForm";

const FIELDS: FieldDef[] = [
  { name: "name", label: "Full name", type: "text" },
  { name: "email", label: "Email", type: "email" },
  { name: "password", label: "Password", type: "text", help: "Required when creating a user (min 8 characters). Leave blank when editing to keep the current password." },
  { name: "role", label: "Role", type: "select", options: [
    { value: "super_admin", label: "Super Admin — full access" },
    { value: "admin", label: "Administrator — content + inquiries + settings" },
    { value: "content_manager", label: "Content Manager — website content only" },
  ] },
  { name: "active", label: "Active (can sign in)", type: "checkbox" },
];

export default async function AdminUsersPage() {
  const session = await auth();
  const role = (session?.user as { role?: string } | undefined)?.role;
  if (role !== "super_admin") redirect("/admin");
  const items = await adminList(() => User.find({}).select("-passwordHash").sort({ createdAt: -1 }).lean());
  return (
    <ResourceListPage
      title="Users" description="Admin accounts. Super Admin only. Passwords are hashed with bcrypt and are never shown."
      apiPath="/api/admin/users" fields={FIELDS}
      columns={[{ key: "email", label: "Email" }, { key: "role", label: "Role" }]}
      items={items as unknown as Record<string, unknown>[]}
    />
  );
}
