import Link from "next/link";
import { connectDB } from "@/lib/db";
import { Project } from "@/models/Project";
import { Service } from "@/models/Service";
import { Testimonial, Partner, TeamMember } from "@/models/Content";
import { Inquiry } from "@/models/Crm";
import { formatDate } from "@/lib/utils";
import { StatusBadge } from "@/components/admin/ui";

async function counts() {
  const db = await connectDB();
  if (!db) return null;
  const [totalProjects, publishedProjects, draftProjects, testimonials, partners, team, newInquiries, pendingInquiries, recentInquiries, recentProjects] = await Promise.all([
    Project.countDocuments({ deletedAt: null }),
    Project.countDocuments({ status: "published", deletedAt: null }),
    Project.countDocuments({ status: "draft", deletedAt: null }),
    Testimonial.countDocuments({ deletedAt: null }),
    Partner.countDocuments({ deletedAt: null }),
    TeamMember.countDocuments({ deletedAt: null }),
    Inquiry.countDocuments({ status: "new", archived: { $ne: true } }),
    Inquiry.countDocuments({ status: { $in: ["contacted", "in_discussion", "proposal_sent"] }, archived: { $ne: true } }),
    Inquiry.find({ archived: { $ne: true } }).sort({ createdAt: -1 }).limit(5).lean(),
    Project.find({ deletedAt: null }).sort({ updatedAt: -1 }).limit(5).lean(),
  ]);
  return { totalProjects, publishedProjects, draftProjects, testimonials, partners, team, newInquiries, pendingInquiries, recentInquiries, recentProjects };
}

export default async function AdminDashboard() {
  const data = await counts();
  if (!data) {
    return (
      <div>
        <h1 className="font-display text-2xl font-bold sm:text-3xl">Dashboard</h1>
        <div className="mt-6 rounded-2xl border border-amber-300 bg-amber-50 p-6">
          <p className="font-semibold">Database not connected</p>
          <p className="mt-2 text-sm leading-relaxed text-neutral-600">
            Set <code>MONGODB_URI</code> in <code>.env.local</code> (copy from <code>.env.example</code>) and run <code>npm run seed</code> to create the settings, services and admin user. The public site still renders with fallbacks built in.
          </p>
        </div>
      </div>
    );
  }
  const cards = [
    { label: "Total projects", value: data.totalProjects, href: "/admin/projects" },
    { label: "Published projects", value: data.publishedProjects, href: "/admin/projects" },
    { label: "Draft projects", value: data.draftProjects, href: "/admin/projects" },
    { label: "Testimonials", value: data.testimonials, href: "/admin/testimonials" },
    { label: "Partners", value: data.partners, href: "/admin/partners" },
    { label: "Team members", value: data.team, href: "/admin/team" },
    { label: "New inquiries", value: data.newInquiries, href: "/admin/inquiries" },
    { label: "Inquiries in progress", value: data.pendingInquiries, href: "/admin/inquiries" },
  ];
  return (
    <div>
      <h1 className="font-display text-2xl font-bold sm:text-3xl">Dashboard</h1>
      <p className="mt-1 text-sm text-neutral-500">Business and website overview for Apus Industries Ltd.</p>
      <div className="mt-6 grid grid-cols-2 gap-3 lg:grid-cols-4">
        {cards.map((c) => (
          <Link key={c.label} href={c.href} className="rounded-2xl border border-line bg-white p-5 transition hover:border-apus">
            <p className="text-sm text-neutral-500">{c.label}</p>
            <p className="mt-1 font-display text-3xl font-black">{c.value}</p>
          </Link>
        ))}
      </div>
      <div className="mt-8 grid gap-6 lg:grid-cols-2">
        <section className="rounded-2xl border border-line bg-white p-5">
          <h2 className="font-display text-lg font-bold">Recent inquiries</h2>
          {data.recentInquiries.length === 0 ? (
            <p className="mt-3 text-sm text-neutral-500">No inquiries yet. New contact form submissions will appear here.</p>
          ) : (
            <ul className="mt-4 divide-y divide-line">
              {data.recentInquiries.map((i) => (
                <li key={String(i._id)} className="flex items-center justify-between gap-3 py-3">
                  <Link href={`/admin/inquiries/${String(i._id)}`} className="min-w-0">
                    <span className="block truncate font-semibold">{String(i.name)}: {String(i.subject)}</span>
                    <span className="text-xs text-neutral-500">{String(i.reference)} · {formatDate(i.createdAt as unknown as string)}</span>
                  </Link>
                  <StatusBadge value={String(i.status)} />
                </li>
              ))}
            </ul>
          )}
          <Link href="/admin/inquiries" className="mt-4 inline-block text-sm font-semibold text-apus-deep">View all inquiries →</Link>
        </section>
        <section className="rounded-2xl border border-line bg-white p-5">
          <h2 className="font-display text-lg font-bold">Recently updated projects</h2>
          {data.recentProjects.length === 0 ? (
            <p className="mt-3 text-sm text-neutral-500">No projects yet. Add your first project from the Projects page.</p>
          ) : (
            <ul className="mt-4 divide-y divide-line">
              {data.recentProjects.map((p) => (
                <li key={String(p._id)} className="flex items-center justify-between gap-3 py-3">
                  <Link href="/admin/projects" className="min-w-0">
                    <span className="block truncate font-semibold">{String(p.name)}</span>
                    <span className="text-xs text-neutral-500">{String(p.category)} · {formatDate(p.updatedAt as unknown as string)}</span>
                  </Link>
                  <StatusBadge value={String(p.status)} />
                </li>
              ))}
            </ul>
          )}
          <Link href="/admin/projects" className="mt-4 inline-block text-sm font-semibold text-apus-deep">Manage projects →</Link>
        </section>
      </div>
      <p className="mt-8 text-xs text-neutral-400">
        Services are seeded from the brief (5 categories). Team, projects, testimonials and partners start empty. Add them here. Nothing is invented on the public site.
      </p>
    </div>
  );
}
