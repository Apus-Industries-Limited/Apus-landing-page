import Link from "next/link";
import Image from "next/image";
import { ArrowRight, ArrowUpRight, CheckCircle2 } from "lucide-react";
import { getSettings } from "@/lib/settings";
import { getServices, getProjects, getTestimonials, getPartners } from "@/lib/data";
import { ServiceCard, ProjectCard, TestimonialCard } from "@/components/site/Cards";
import { SectionHeading, CtaBand } from "@/components/site/Sections";
import { siteUrl } from "@/lib/utils";

export const revalidate = 60;

function splitHeadline(headline: string): { first: string; rest: string } {
  // Highlight the last two words with the cyan chip, Ynora-style.
  const words = headline.trim().split(/\s+/);
  if (words.length <= 2) return { first: "", rest: headline };
  return { first: words.slice(0, -2).join(" "), rest: words.slice(-2).join(" ") };
}

export default async function HomePage() {
  const settings = await getSettings();
  const services = await getServices();
  const featuredProjects = (await getProjects({ status: "published" })).filter((p) => p.featured).slice(0, 3);
  const testimonials = await getTestimonials();
  const partners = await getPartners();
  const { first, rest } = splitHeadline(settings.heroHeadline);

  const orgJsonLd = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: settings.companyName,
    url: siteUrl(),
    email: settings.email,
    telephone: settings.phone,
    description: settings.description,
    sameAs: [settings.socials.x, settings.socials.instagram, settings.socials.linkedin].filter(Boolean),
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(orgJsonLd) }} />

      {/* Hero — Ynora-style giant editorial headline, Apus cyan accent */}
      <section className="relative overflow-hidden bg-mist">
        <div className="mx-auto max-w-shell px-4 pb-16 pt-16 sm:px-6 sm:pt-20 lg:px-8">
          <div className="flex flex-wrap items-start justify-between gap-4">
            <p className="eyebrow">Software · Electrical · Solar · Infrastructure</p>
            <p className="hidden max-w-[220px] text-right text-xs leading-relaxed text-neutral-500 sm:block">
              Technology &amp; engineering for businesses that need systems that work.
            </p>
          </div>
          <h1 className="mt-6 font-display text-[13vw] font-black leading-[0.95] tracking-tight sm:text-7xl lg:text-[88px]">
            {first} <span className="hl">{rest}</span>
          </h1>
          <div className="mt-8 flex flex-col gap-8 md:flex-row md:items-end md:justify-between">
            <p className="max-w-xl text-base leading-relaxed text-neutral-600 sm:text-lg">{settings.heroDescription}</p>
            <div className="flex flex-wrap gap-3">
              <Link href="/services" className="inline-flex items-center gap-2 rounded-full bg-apus px-6 py-3 text-sm font-semibold text-ink transition hover:bg-ink hover:text-white">
                {settings.heroPrimaryCta} <ArrowRight className="h-4 w-4" />
              </Link>
              <Link href="/contact" className="inline-flex items-center gap-2 rounded-full border border-ink px-6 py-3 text-sm font-semibold transition hover:bg-ink hover:text-white">
                {settings.heroSecondaryCta}
              </Link>
            </div>
          </div>
          <div className="relative mt-12 overflow-hidden rounded-2xl bg-ink">
            <Image src={settings.heroImage || "/images/hero.jpg"} alt="Apus Industries at work — engineers, solar design and software" width={1280} height={560} className="h-[320px] w-full object-cover sm:h-[420px]" priority />
            <div className="absolute bottom-4 left-4 flex flex-wrap gap-2">
              {["Software Development", "Electrical & Electronics", "Solar & Energy"].map((t) => (
                <span key={t} className="rounded-full bg-white/90 px-3 py-1.5 text-xs font-semibold">{t}</span>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Introduction */}
      <section className="bg-white py-16 sm:py-20">
        <div className="mx-auto grid max-w-shell gap-8 px-4 sm:px-6 lg:grid-cols-2 lg:px-8">
          <SectionHeading
            eyebrow="Who we are"
            title={<>A technology &amp; engineering company, <span className="hl">built for business.</span></>}
          />
          <div>
            <p className="text-base leading-relaxed text-neutral-600 sm:text-lg">{settings.description}</p>
            <Link href="/about" className="mt-5 inline-flex items-center gap-1 text-sm font-semibold text-ink hover:text-apus-deep">
              More about Apus Industries <ArrowUpRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* Services */}
      <section className="bg-smoke py-16 sm:py-20">
        <div className="mx-auto max-w-shell px-4 sm:px-6 lg:px-8">
          <div className="flex flex-wrap items-end justify-between gap-4">
            <SectionHeading eyebrow="What we do" title={<>Services that cover <span className="hl">the whole job.</span></>} />
            <Link href="/services" className="text-sm font-semibold hover:text-apus-deep">View all services →</Link>
          </div>
          <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {services.map((s) => <ServiceCard key={s.slug} service={s} />)}
          </div>
        </div>
      </section>

      {/* Featured projects — only published projects; empty state is honest, not invented */}
      <section className="bg-white py-16 sm:py-20">
        <div className="mx-auto max-w-shell px-4 sm:px-6 lg:px-8">
          <div className="flex flex-wrap items-end justify-between gap-4">
            <SectionHeading eyebrow="Our work" title={<>Featured <span className="hl">projects.</span></>} description="Selected work from Apus Industries. New projects are published here by the team as they are completed." />
            <Link href="/projects" className="text-sm font-semibold hover:text-apus-deep">View all projects →</Link>
          </div>
          {featuredProjects.length > 0 ? (
            <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {featuredProjects.map((p) => <ProjectCard key={p.slug} project={p} />)}
            </div>
          ) : (
            <div className="mt-10 rounded-2xl border border-dashed border-line bg-smoke p-10 text-center">
              <p className="font-display text-lg font-bold">Projects coming soon</p>
              <p className="mx-auto mt-2 max-w-md text-sm text-neutral-600">
                Our team publishes completed projects here through the admin dashboard. If you would like to see recent work, please contact us.
              </p>
              <Link href="/contact" className="mt-5 inline-block rounded-full bg-ink px-5 py-2.5 text-sm font-semibold text-white">Ask about recent work</Link>
            </div>
          )}
        </div>
      </section>

      {/* Why choose Apus — dark section */}
      <section className="bg-ink py-16 text-white sm:py-20">
        <div className="mx-auto max-w-shell px-4 sm:px-6 lg:px-8">
          <SectionHeading dark eyebrow="Why choose Apus" title={<>Why businesses <span className="hl">choose Apus.</span></>} />
          <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {settings.whyChooseUs.map((item) => (
              <div key={item.title} className="rounded-2xl border border-white/10 bg-coal p-6">
                <CheckCircle2 className="h-6 w-6 text-apus" />
                <h3 className="mt-4 font-display text-lg font-bold">{item.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-neutral-400">{item.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Partners */}
      {partners.length > 0 && (
        <section className="bg-white py-16">
          <div className="mx-auto max-w-shell px-4 sm:px-6 lg:px-8">
            <SectionHeading eyebrow="Trusted partners" title="Working with trusted partners." align="center" />
            <div className="mt-10 flex flex-wrap items-center justify-center gap-8">
              {partners.map((p) => (
                <a key={p._id} href={p.website || "#"} target="_blank" rel="noreferrer" className="flex items-center gap-3 text-neutral-600 hover:text-ink">
                  {p.logo ? <Image src={p.logo} alt={p.name} width={120} height={48} className="h-10 w-auto object-contain" /> : <span className="font-display text-lg font-bold">{p.name}</span>}
                </a>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Testimonials */}
      {testimonials.length > 0 && (
        <section className="bg-smoke py-16 sm:py-20">
          <div className="mx-auto max-w-shell px-4 sm:px-6 lg:px-8">
            <SectionHeading eyebrow="Client feedback" title={<>What our <span className="hl">clients say.</span></>} />
            <div className="mt-10 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {testimonials.map((t) => <TestimonialCard key={t._id} testimonial={t} />)}
            </div>
          </div>
        </section>
      )}

      <CtaBand title="Have a project in mind?" text="Tell us what you need — software, electrical work, solar, or a full technology setup — and we will come back with a clear plan and a honest quote." />
    </>
  );
}
