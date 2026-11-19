import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { getProjects } from "@/lib/data";
import { ProjectCard } from "@/components/site/Cards";
import { PROJECT_CATEGORIES } from "@/models/Project";

export const metadata: Metadata = { title: "Projects" };
export const revalidate = 60;

export default async function ProjectsPage({ searchParams }: { searchParams: Promise<{ category?: string; q?: string }> }) {
  const sp = await searchParams;
  const category = sp.category || "";
  const q = sp.q || "";
  const projects = await getProjects({ status: "published", category: category || undefined, q: q || undefined });
  return (
    <>
      <section className="bg-mist py-16 sm:py-20">
        <div className="mx-auto max-w-shell px-4 sm:px-6 lg:px-8">
          <p className="eyebrow">Projects</p>
          <h1 className="mt-4 max-w-3xl font-display text-4xl font-black leading-[1.02] tracking-tight sm:text-6xl">
            Our <span className="hl">work.</span>
          </h1>
          <p className="mt-6 max-w-2xl text-lg leading-relaxed text-neutral-600">
            Completed projects published by the Apus team. Use the filters to find work by category.
          </p>
          <form method="get" className="mt-8 flex flex-wrap gap-3">
            <select name="category" defaultValue={category} className="rounded-full border border-line bg-white px-4 py-2.5 text-sm font-medium">
              <option value="">All categories</option>
              {PROJECT_CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
            </select>
            <input name="q" defaultValue={q} placeholder="Search projects…" className="min-w-[200px] flex-1 rounded-full border border-line bg-white px-4 py-2.5 text-sm" />
            <button type="submit" className="rounded-full bg-ink px-5 py-2.5 text-sm font-semibold text-white">Filter</button>
            {(category || q) && <Link href="/projects" className="rounded-full border border-line bg-white px-5 py-2.5 text-sm font-semibold">Clear</Link>}
          </form>
        </div>
      </section>
      <section className="bg-white py-16 sm:py-20">
        <div className="mx-auto max-w-shell px-4 sm:px-6 lg:px-8">
          {projects.length > 0 ? (
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {projects.map((p) => <ProjectCard key={p.slug} project={p} />)}
            </div>
          ) : (
            <>
              <div className="relative overflow-hidden rounded-2xl bg-ink">
                <Image src="/images/infrastructure.jpg" alt="Apus Industries infrastructure work" width={1280} height={640} className="h-[240px] w-full object-cover sm:h-[320px]" />
              </div>
              <div className="mt-4 rounded-2xl border border-dashed border-line bg-smoke p-10 text-center">
                <p className="font-display text-lg font-bold">No projects published yet</p>
                <p className="mx-auto mt-2 max-w-md text-sm text-neutral-600">
                  Projects are published here by the Apus team through the admin dashboard as work is completed.
                </p>
                <Link href="/contact" className="mt-5 inline-block rounded-full bg-ink px-5 py-2.5 text-sm font-semibold text-white">Ask about recent work</Link>
              </div>
            </>
          )}
        </div>
      </section>
    </>
  );
}
