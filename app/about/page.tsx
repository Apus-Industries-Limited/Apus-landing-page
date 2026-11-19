import Link from "next/link";
import Image from "next/image";
import { ArrowUpRight } from "lucide-react";
import { getSettings } from "@/lib/settings";
import { getTeam } from "@/lib/data";
import { SectionHeading, CtaBand } from "@/components/site/Sections";

export const revalidate = 60;

export default async function AboutPage() {
  const settings = await getSettings();
  const team = await getTeam();
  return (
    <>
      <section className="bg-mist py-16 sm:py-20">
        <div className="mx-auto grid max-w-shell items-center gap-10 px-4 sm:px-6 lg:grid-cols-2 lg:px-8">
          <div>
            <p className="eyebrow">About Us</p>
            <h1 className="mt-4 max-w-3xl font-display text-4xl font-black leading-[1.02] tracking-tight sm:text-6xl">
              About <span className="hl">Apus Industries</span>
            </h1>
            <p className="mt-6 max-w-2xl text-lg leading-relaxed text-neutral-600">{settings.description}</p>
          </div>
          <div className="relative overflow-hidden rounded-2xl bg-ink">
            <Image src="/images/about.jpg" alt="The Apus Industries team at work" width={1280} height={854} className="h-[280px] w-full object-cover sm:h-[360px]" priority />
          </div>
        </div>
      </section>

      <section className="bg-white py-16 sm:py-20">
        <div className="mx-auto grid max-w-shell gap-10 px-4 sm:px-6 lg:grid-cols-2 lg:px-8">
          <div>
            <SectionHeading eyebrow="Our mission" title="What we are here to do." />
            <p className="mt-4 leading-relaxed text-neutral-600">{settings.mission}</p>
          </div>
          <div>
            <SectionHeading eyebrow="Our vision" title="Where we are heading." />
            <p className="mt-4 leading-relaxed text-neutral-600">{settings.vision}</p>
          </div>
        </div>
      </section>

      <section className="bg-ink py-16 text-white sm:py-20">
        <div className="mx-auto max-w-shell px-4 sm:px-6 lg:px-8">
          <SectionHeading dark eyebrow="Core values" title={<>How we <span className="hl">work.</span></>} />
          <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {settings.values.map((v) => (
              <div key={v.title} className="rounded-2xl border border-white/10 bg-coal p-6">
                <h3 className="font-display text-lg font-bold">{v.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-neutral-400">{v.text}</p>
              </div>
            ))}
          </div>
          <p className="mt-8 text-xs text-neutral-500">
            Mission, vision and values are managed in Admin → Settings. No company history is published here until the team adds it.
          </p>
        </div>
      </section>

      <section className="bg-white py-16 sm:py-20">
        <div className="mx-auto max-w-shell px-4 sm:px-6 lg:px-8">
          <SectionHeading eyebrow="Our team" title={<>The people behind <span className="hl">Apus.</span></>} description="Team members are added and managed through the admin dashboard." />
          {team.length > 0 ? (
            <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {team.map((m) => (
                <article key={m._id} className="overflow-hidden rounded-2xl border border-line bg-white">
                  <div className="relative aspect-[4/3] bg-mist">
                    {m.photo ? <Image src={m.photo} alt={m.name} fill className="object-cover" /> : (
                      <div className="flex h-full items-center justify-center bg-ink font-display text-4xl font-black text-apus">
                        {m.name.split(" ").map((w) => w[0]).slice(0, 2).join("")}
                      </div>
                    )}
                  </div>
                  <div className="p-5">
                    <h3 className="font-display text-lg font-bold">{m.name}</h3>
                    <p className="text-sm font-medium text-apus-deep">{m.title}</p>
                    <p className="mt-2 line-clamp-3 text-sm leading-relaxed text-neutral-600">{m.bio}</p>
                    {m.linkedin && (
                      <a href={m.linkedin} target="_blank" rel="noreferrer" className="mt-3 inline-flex items-center gap-1 text-sm font-semibold hover:text-apus-deep">
                        LinkedIn <ArrowUpRight className="h-4 w-4" />
                      </a>
                    )}
                  </div>
                </article>
              ))}
            </div>
          ) : (
            <div className="mt-10 rounded-2xl border border-dashed border-line bg-smoke p-10 text-center">
              <p className="font-display text-lg font-bold">Meet the team — coming soon</p>
              <p className="mx-auto mt-2 max-w-md text-sm text-neutral-600">
                Team profiles are added by the company through the admin dashboard. Nothing is published here until the team adds it.
              </p>
            </div>
          )}
          <div className="mt-10">
            <Link href="/contact" className="inline-flex items-center gap-2 rounded-full bg-ink px-6 py-3 text-sm font-semibold text-white">
              Work with us <ArrowUpRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </section>

      <CtaBand title="Want to work with Apus?" text="Tell us about your project and we will come back with a clear plan." />
    </>
  );
}
