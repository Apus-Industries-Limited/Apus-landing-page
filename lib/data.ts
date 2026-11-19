import { connectDB } from "@/lib/db";
import { Service } from "@/models/Service";
import { Project } from "@/models/Project";
import { Testimonial } from "@/models/Content";
import { Partner, TeamMember } from "@/models/Content";
import { slugify } from "@/lib/utils";

export type ServiceItem = {
  _id: string; name: string; slug: string; shortDescription: string; description: string;
  icon: string; coverImage: string; benefits: string[]; features: string[]; featured: boolean; order: number;
  seoTitle: string; seoDescription: string;
};

/** The five service categories stated in the brief — the ONLY seeded content.
 * Used as the fallback when the DB has no services yet; the CMS owns them after seeding. */
export const SEEDED_SERVICES: ServiceItem[] = [
  {
    _id: "seed-software", name: "Software Development and Digital Solutions",
    slug: "software-development-and-digital-solutions",
    shortDescription: "Custom software built around how your business actually works — from internal tools to customer-facing platforms.",
    description: "We design and build custom software for businesses that need more than off-the-shelf tools. From internal systems that remove manual work to customer-facing platforms, every solution is scoped around a real business outcome, built to a proper standard, and supported after delivery.",
    icon: "Code2", coverImage: "", benefits: ["Built around your processes, not forced into a template", "Clear scope and pricing before work starts", "Documented and supported after handover"],
    features: ["Custom business software", "System integrations", "Automation of manual processes", "Ongoing maintenance and support"],
    featured: true, order: 1, seoTitle: "", seoDescription: "",
  },
  {
    _id: "seed-web-mobile", name: "Web and Mobile Application Development",
    slug: "web-and-mobile-application-development",
    shortDescription: "Fast, reliable websites and mobile apps your customers can depend on — built, tested and launched properly.",
    description: "We build websites and mobile applications that are fast, secure and easy to maintain. Whether it is a company website, a customer portal or a mobile app, we handle design, development, testing and launch — and we stay available afterwards.",
    icon: "Smartphone", coverImage: "", benefits: ["Responsive on phone, tablet and desktop", "Fast loading and search-friendly", "Easy for your team to update"],
    features: ["Corporate websites", "Web applications and portals", "iOS and Android apps", "E-commerce and booking systems"],
    featured: true, order: 2, seoTitle: "", seoDescription: "",
  },
  {
    _id: "seed-electrical", name: "Electrical and Electronics Solutions",
    slug: "electrical-and-electronics-solutions",
    shortDescription: "Electrical and electronics work carried out to a proper standard — safe, documented and built to last.",
    description: "Our electrical and electronics work covers design, installation and maintenance for commercial and residential needs. Every job is planned, carried out safely, tested, and documented so you know exactly what was done.",
    icon: "Zap", coverImage: "", benefits: ["Work carried out to recognised safety standards", "Clear quotes before work begins", "Testing and documentation on completion"],
    features: ["Electrical installations and upgrades", "Electronics repair and maintenance", "Wiring and distribution systems", "Safety testing and inspection"],
    featured: false, order: 3, seoTitle: "", seoDescription: "",
  },
  {
    _id: "seed-solar", name: "Solar and Energy Solutions",
    slug: "solar-and-energy-solutions",
    shortDescription: "Solar and energy systems that cut costs and keep your business running — designed for your actual usage.",
    description: "We design and install solar and energy systems sized to your real consumption, not a generic package. From solar panels and inverters to battery storage, we size, install, test and support the system so it delivers the savings it was designed for.",
    icon: "Sun", coverImage: "", benefits: ["Lower electricity costs from day one", "Backup power when the grid fails", "Systems sized to your actual usage"],
    features: ["Solar panel installation", "Inverters and battery storage", "Energy audits and system design", "Maintenance and monitoring"],
    featured: true, order: 4, seoTitle: "", seoDescription: "",
  },
  {
    _id: "seed-infrastructure", name: "Digital Infrastructure and Business Technology",
    slug: "digital-infrastructure-and-business-technology",
    shortDescription: "The networks, systems and support that keep a business running — set up properly and looked after.",
    description: "We set up and look after the digital infrastructure a business depends on: networks, devices, cloud systems and security. The aim is simple — technology that works, every day, with someone to call when it does not.",
    icon: "Server", coverImage: "", benefits: ["One team responsible for your technology", "Proactive monitoring, not just break-fix", "Advice in plain language"],
    features: ["Network design and installation", "Cloud setup and migration", "Cybersecurity basics done properly", "IT support and maintenance"],
    featured: false, order: 5, seoTitle: "", seoDescription: "",
  },
];

/** Default cover photos for the five service categories (public/images/).
 * A CMS-set coverImage always wins; this is only the fallback when it is empty. */
export const SERVICE_COVER_IMAGES: Record<string, string> = {
  "software-development-and-digital-solutions": "/images/software.jpg",
  "web-and-mobile-application-development": "/images/mobile.jpg",
  "electrical-and-electronics-solutions": "/images/electrical.jpg",
  "solar-and-energy-solutions": "/images/solar.jpg",
  "digital-infrastructure-and-business-technology": "/images/infrastructure.jpg",
};

export function serviceCoverImage(service: Pick<ServiceItem, "slug" | "coverImage">): string {
  return service.coverImage || SERVICE_COVER_IMAGES[service.slug] || "";
}

function toServiceItem(doc: Record<string, unknown>): ServiceItem {
  return {
    _id: String(doc._id), name: String(doc.name), slug: String(doc.slug),
    shortDescription: String(doc.shortDescription ?? ""), description: String(doc.description ?? ""),
    icon: String(doc.icon ?? "Cpu"), coverImage: String(doc.coverImage ?? ""),
    benefits: (doc.benefits as string[]) ?? [], features: (doc.features as string[]) ?? [],
    featured: Boolean(doc.featured), order: Number(doc.order ?? 0),
    seoTitle: String(doc.seoTitle ?? ""), seoDescription: String(doc.seoDescription ?? ""),
  };
}

export async function getServices(activeOnly = true): Promise<ServiceItem[]> {
  const db = await connectDB();
  if (!db) return SEEDED_SERVICES;
  try {
    const q: Record<string, unknown> = {};
    if (activeOnly) q.active = true;
    const docs = await Service.find(q).sort({ order: 1, name: 1 }).lean();
    if (docs.length === 0) return SEEDED_SERVICES;
    return docs.map((d) => toServiceItem(d as unknown as Record<string, unknown>));
  } catch {
    return SEEDED_SERVICES;
  }
}

export async function getServiceBySlug(slug: string): Promise<ServiceItem | null> {
  const services = await getServices();
  return services.find((s) => s.slug === slugify(slug)) ?? null;
}

export type ProjectItem = {
  _id: string; name: string; slug: string; summary: string; description: string; client: string;
  industry: string; category: string; services: string[]; technologies: string[];
  coverImage: string; gallery: string[]; projectDate: string | null; projectUrl: string;
  featured: boolean; status: string;
};

export async function getProjects(opts: { status?: string; category?: string; q?: string; featuredOnly?: boolean } = {}): Promise<ProjectItem[]> {
  const db = await connectDB();
  if (!db) return [];
  try {
    const q: Record<string, unknown> = { deletedAt: null };
    if (opts.status) q.status = opts.status;
    if (opts.category) q.category = opts.category;
    if (opts.featuredOnly) q.featured = true;
    if (opts.q) q.name = { $regex: opts.q, $options: "i" };
    const docs = await Project.find(q).sort({ order: 1, projectDate: -1, createdAt: -1 }).lean();
    return docs.map((d) => {
      const r = d as unknown as Record<string, unknown>;
      return {
        _id: String(r._id), name: String(r.name), slug: String(r.slug), summary: String(r.summary ?? ""),
        description: String(r.description ?? ""), client: String(r.client ?? ""), industry: String(r.industry ?? ""),
        category: String(r.category ?? "Other"), services: (r.services as string[]) ?? [],
        technologies: (r.technologies as string[]) ?? [], coverImage: String(r.coverImage ?? ""),
        gallery: (r.gallery as string[]) ?? [], projectDate: r.projectDate ? new Date(String(r.projectDate)).toISOString() : null,
        projectUrl: String(r.projectUrl ?? ""), featured: Boolean(r.featured), status: String(r.status ?? "draft"),
      };
    });
  } catch {
    return [];
  }
}

export async function getProjectBySlug(slug: string): Promise<ProjectItem | null> {
  const db = await connectDB();
  if (!db) return null;
  try {
    const d = await Project.findOne({ slug, status: "published", deletedAt: null }).lean();
    if (!d) return null;
    const r = d as unknown as Record<string, unknown>;
    return {
      _id: String(r._id), name: String(r.name), slug: String(r.slug), summary: String(r.summary ?? ""),
      description: String(r.description ?? ""), client: String(r.client ?? ""), industry: String(r.industry ?? ""),
      category: String(r.category ?? "Other"), services: (r.services as string[]) ?? [],
      technologies: (r.technologies as string[]) ?? [], coverImage: String(r.coverImage ?? ""),
      gallery: (r.gallery as string[]) ?? [], projectDate: r.projectDate ? new Date(String(r.projectDate)).toISOString() : null,
      projectUrl: String(r.projectUrl ?? ""), featured: Boolean(r.featured), status: String(r.status ?? "draft"),
    };
  } catch {
    return null;
  }
}

export type TestimonialItem = { _id: string; clientName: string; position: string; company: string; photo: string; quote: string; project: string };
export async function getTestimonials(): Promise<TestimonialItem[]> {
  const db = await connectDB();
  if (!db) return [];
  try {
    const docs = await Testimonial.find({ status: "approved", published: true, deletedAt: null }).sort({ order: 1, createdAt: -1 }).lean();
    return docs.map((d) => {
      const r = d as unknown as Record<string, unknown>;
      return { _id: String(r._id), clientName: String(r.clientName), position: String(r.position ?? ""), company: String(r.company ?? ""), photo: String(r.photo ?? ""), quote: String(r.quote ?? ""), project: String(r.project ?? "") };
    });
  } catch { return []; }
}

export type PartnerItem = { _id: string; name: string; logo: string; website: string; description: string };
export async function getPartners(): Promise<PartnerItem[]> {
  const db = await connectDB();
  if (!db) return [];
  try {
    const docs = await Partner.find({ active: true, deletedAt: null }).sort({ order: 1, name: 1 }).lean();
    return docs.map((d) => {
      const r = d as unknown as Record<string, unknown>;
      return { _id: String(r._id), name: String(r.name), logo: String(r.logo ?? ""), website: String(r.website ?? ""), description: String(r.description ?? "") };
    });
  } catch { return []; }
}

export type TeamItem = { _id: string; name: string; photo: string; title: string; bio: string; expertise: string[]; linkedin: string };
export async function getTeam(): Promise<TeamItem[]> {
  const db = await connectDB();
  if (!db) return [];
  try {
    const docs = await TeamMember.find({ active: true, deletedAt: null }).sort({ order: 1, name: 1 }).lean();
    return docs.map((d) => {
      const r = d as unknown as Record<string, unknown>;
      return { _id: String(r._id), name: String(r.name), photo: String(r.photo ?? ""), title: String(r.title ?? ""), bio: String(r.bio ?? ""), expertise: (r.expertise as string[]) ?? [], linkedin: String(r.linkedin ?? "") };
    });
  } catch { return []; }
}
