import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { CheckCircle2, ArrowRight } from "lucide-react";
import { getServices, getServiceBySlug, getProjects } from "@/lib/data";
import { ServiceIcon } from "@/components/site/Cards";
import { ProjectCard } from "@/components/site/Cards";
import { CtaBand } from "@/components/site/Sections";

export const revalidate = 60;

export async function generateStaticParams() {
  const services = await getServices();
  return services.map((s) => ({ slug: s.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const service = await getServiceBySlug(slug);
  if (!service) return { title: "Service not found" };
  return {
    title: service.seoTitle || service.name,
    description: service.seoDescription || service.shortDescription,
  };
}

export default async function ServiceDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const service = await getServiceBySlug(slug);
  if (!service) notFound();
  const related = (await getProjects({ status: "published" })).filter((p) => p.services.includes(service.name)).slice(0, 3);
  return (
    <>
      <section className="bg-mist py-16 sm:py-20">
        <div className="mx-auto max-w-shell px-4 sm:px-6 lg:px-8">
          <p className="eyebrow">Service</p>
          <div className="mt-6 flex items-start gap-4">
            <span className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-apus text-ink">
              <ServiceIcon name={service.icon} className="h-7 w-7" />
            </span>
            <h1 className="max-w-3xl font-display text-4xl font-black leading-[1.02] tracking-tight sm:text-5xl">{service.name}</h1>
          </div>
          <p className="mt-6 max-w-2xl text-lg leading-relaxed text-neutral-600">{service.description}</p>
          <Link href={`/contact?service=${encodeURIComponent(service.name)}`} className="mt-8 inline-flex items-center gap-2 rounded-full bg-ink px-6 py-3 text-sm font-semibold text-white">
            Request this service <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </section>

      <section className="bg-white py-16 sm:py-20">
        <div className="mx-auto grid max-w-shell gap-10 px-4 sm:px-6 lg:grid-cols-2 lg:px-8">
          <div>
            <h2 className="font-display text-2xl font-bold">Benefits</h2>
            <ul className="mt-5 space-y-3">
              {service.benefits.length > 0 ? service.benefits.map((b) => (
                <li key={b} className="flex items-start gap-3 text-neutral-700"><CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-apus-deep" /><span>{b}</span></li>
              )) : <li className="text-sm text-neutral-500">Benefits are managed in the admin dashboard.</li>}
            </ul>
          </div>
          <div>
            <h2 className="font-display text-2xl font-bold">What is included</h2>
            <ul className="mt-5 space-y-3">
              {service.features.length > 0 ? service.features.map((f) => (
                <li key={f} className="flex items-start gap-3 text-neutral-700"><CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-apus-deep" /><span>{f}</span></li>
              )) : <li className="text-sm text-neutral-500">Features are managed in the admin dashboard.</li>}
            </ul>
          </div>
        </div>
      </section>

      {related.length > 0 && (
        <section className="bg-smoke py-16">
          <div className="mx-auto max-w-shell px-4 sm:px-6 lg:px-8">
            <h2 className="font-display text-2xl font-bold">Related projects</h2>
            <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {related.map((p) => <ProjectCard key={p.slug} project={p} />)}
            </div>
          </div>
        </section>
      )}
      <CtaBand title={`Ready to start with ${service.name}?`} text="Tell us what you need and we will come back with a clear plan and an honest quote." />
    </>
  );
}
