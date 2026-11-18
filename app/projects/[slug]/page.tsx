import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { ArrowUpRight, CalendarDays } from "lucide-react";
import { getProjects, getProjectBySlug } from "@/lib/data";
import { ProjectCard } from "@/components/site/Cards";
import { CtaBand } from "@/components/site/Sections";
import { formatDate } from "@/lib/utils";

export const revalidate = 60;

export async function generateStaticParams() {
  const projects = await getProjects({ status: "published" });
  return projects.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const project = await getProjectBySlug(slug);
  if (!project) return { title: "Project not found" };
  return { title: project.name, description: project.summary };
}

export default async function ProjectDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const project = await getProjectBySlug(slug);
  if (!project) notFound();
  const related = (await getProjects({ status: "published", category: project.category })).filter((p) => p.slug !== project.slug).slice(0, 3);
  return (
    <>
      <section className="bg-mist py-16 sm:py-20">
        <div className="mx-auto max-w-shell px-4 sm:px-6 lg:px-8">
          <p className="eyebrow">{project.category} · {project.industry}</p>
          <h1 className="mt-4 max-w-3xl font-display text-4xl font-black leading-[1.02] tracking-tight sm:text-6xl">{project.name}</h1>
          <p className="mt-6 max-w-2xl text-lg leading-relaxed text-neutral-600">{project.summary}</p>
          <dl className="mt-8 flex flex-wrap gap-x-10 gap-y-4 text-sm">
            {project.client && <div><dt className="text-xs uppercase tracking-wider text-neutral-500">Client</dt><dd className="mt-1 font-semibold">{project.client}</dd></div>}
            <div><dt className="text-xs uppercase tracking-wider text-neutral-500">Industry</dt><dd className="mt-1 font-semibold">{project.industry}</dd></div>
            {project.projectDate && <div><dt className="text-xs uppercase tracking-wider text-neutral-500">Date</dt><dd className="mt-1 flex items-center gap-1.5 font-semibold"><CalendarDays className="h-4 w-4" />{formatDate(project.projectDate)}</dd></div>}
            {project.projectUrl && <div><dt className="text-xs uppercase tracking-wider text-neutral-500">Link</dt><dd className="mt-1"><a href={project.projectUrl} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1 font-semibold text-apus-deep">Visit project <ArrowUpRight className="h-4 w-4" /></a></dd></div>}
          </dl>
        </div>
      </section>

      {project.coverImage && (
        <section className="bg-white">
          <div className="mx-auto max-w-shell px-4 sm:px-6 lg:px-8">
            <div className="relative aspect-[16/9] overflow-hidden rounded-2xl">
              <Image src={project.coverImage} alt={project.name} fill className="object-cover" priority />
            </div>
          </div>
        </section>
      )}

      <section className="bg-white py-16">
        <div className="mx-auto grid max-w-shell gap-10 px-4 sm:px-6 lg:grid-cols-3 lg:px-8">
          <div className="lg:col-span-2">
            <h2 className="font-display text-2xl font-bold">About this project</h2>
            <p className="mt-4 whitespace-pre-line leading-relaxed text-neutral-600">{project.description}</p>
            {project.gallery.length > 0 && (
              <div className="mt-10 grid grid-cols-2 gap-3">
                {project.gallery.map((src) => (
                  <div key={src} className="relative aspect-[4/3] overflow-hidden rounded-xl">
                    <Image src={src} alt={`${project.name} — gallery image`} fill className="object-cover" />
                  </div>
                ))}
              </div>
            )}
          </div>
          <aside className="space-y-6">
            {project.services.length > 0 && (
              <div className="rounded-2xl border border-line p-5">
                <h3 className="text-sm font-semibold uppercase tracking-wider text-neutral-500">Services involved</h3>
                <ul className="mt-3 space-y-1.5 text-sm">{project.services.map((s) => <li key={s}>• {s}</li>)}</ul>
              </div>
            )}
            {project.technologies.length > 0 && (
              <div className="rounded-2xl border border-line p-5">
                <h3 className="text-sm font-semibold uppercase tracking-wider text-neutral-500">Technologies</h3>
                <div className="mt-3 flex flex-wrap gap-2">
                  {project.technologies.map((t) => <span key={t} className="rounded-full bg-smoke px-3 py-1 text-xs font-semibold">{t}</span>)}
                </div>
              </div>
            )}
            <Link href="/contact" className="block rounded-2xl bg-ink p-5 text-white">
              <p className="font-display text-lg font-bold">Want something like this?</p>
              <p className="mt-1 text-sm text-neutral-400">Tell us about your project.</p>
              <span className="mt-3 inline-block rounded-full bg-apus px-4 py-2 text-sm font-semibold text-ink">Talk to Our Team</span>
            </Link>
          </aside>
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
      <CtaBand title="Have a project like this in mind?" text="Tell us what you need and we will come back with a clear plan." />
    </>
  );
}
