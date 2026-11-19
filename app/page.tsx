import Link from "next/link";
import Image from "next/image";
import { ArrowRight, ArrowUpRight, CheckCircle2, Instagram, Linkedin, Twitter } from "lucide-react";
import { getSettings } from "@/lib/settings";
import { getServices, getProjects, getTestimonials, getPartners } from "@/lib/data";
import { ServiceCard, ProjectCard, TestimonialCard } from "@/components/site/Cards";
import { SectionHeading, CtaBand } from "@/components/site/Sections";
import { siteUrl } from "@/lib/utils";

export const revalidate = 60;

function splitHeadline(headline: string): { first: string; rest: string } {
  // Highlight the last two words with the cyan chip, Ynora style.
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

      {/* Hero: full screen, VIREX style. Giant APUS watermark, copy left, cutout character right, nothing covering the text. */}
      <section className="relative flex min-h-[100svh] flex-col overflow-hidden bg-white">
        {/* Giant watermark, brand only */}
        <p aria-hidden="true" className="hero-mark pointer-events-none absolute -bottom-[0.08em] left-0 right-0 select-none whitespace-nowrap text-center font-display text-[24vw] font-black leading-none tracking-tight text-neutral-100 lg:text-[260px]">
          APUS
        </p>
        <div className="relative z-10 mx-auto grid w-full max-w-shell flex-1 lg:grid-cols-12">
          {/* Left copy */}
          <div className="flex flex-col justify-center px-6 pb-12 pt-16 sm:px-10 lg:col-span-7 lg:px-12 lg:pb-16 lg:pt-20">
            <p className="eyebrow hero-rise hero-d1">Software · Electrical · Solar · Infrastructure</p>
            <h1 className="hero-rise hero-d2 mt-5 font-display text-4xl font-black capitalize leading-[1.05] tracking-tight sm:text-5xl lg:text-[56px]">
              {first} <span className="hl">{rest}</span>
            </h1>
            <p className="hero-rise hero-d3 mt-5 max-w-md text-base leading-relaxed text-neutral-600 sm:text-lg">{settings.heroDescription}</p>
            <div className="hero-rise hero-d4 mt-7 flex flex-wrap gap-3">
              <Link href="/services" className="inline-flex items-center gap-2 rounded-full bg-apus px-7 py-3.5 text-sm font-semibold text-ink shadow-[0_10px_24px_-8px_rgba(73,206,225,0.8)] transition hover:bg-ink hover:text-white">
                {settings.heroPrimaryCta} <ArrowRight className="h-4 w-4" />
              </Link>
              <Link href="/contact" className="inline-flex items-center gap-2 rounded-full bg-ink px-7 py-3.5 text-sm font-semibold text-white transition hover:bg-apus-deep">
                {settings.heroSecondaryCta}
              </Link>
            </div>
            {/* Bottom-left mini strip: real link to the Solar service */}
            <Link href="/services/solar-and-energy-solutions" className="group hero-rise hero-d5 mt-12 flex max-w-md items-center gap-4">
              <span className="relative h-16 w-28 shrink-0 overflow-hidden rounded-lg">
                <Image src="/images/solar.jpg" alt="Solar installation by Apus Industries" fill className="object-cover transition group-hover:scale-105" />
              </span>
              <span className="text-xs leading-relaxed text-neutral-500">
                Apus blends software, electrical and solar, delivered as one system. <span className="font-semibold text-ink group-hover:text-apus-deep">See Solar &amp; Energy →</span>
              </span>
            </Link>
          </div>
          {/* Right figure: cutout character, transparent background, standing full height */}
          <div className="relative h-[62vh] lg:col-span-5 lg:h-auto lg:min-h-[100svh]">
            {/* Soft cyan glow behind the character */}
            <div aria-hidden="true" className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
              <div className="hero-glow h-[420px] w-[420px] rounded-full bg-apus/25 blur-3xl" />
            </div>
            <div className="hero-float absolute inset-0">
              <Image src={settings.heroImage || "/images/hero-person.png"} alt="Apus engineer wearing cyan AR smart glasses" fill className="object-contain object-bottom" priority />
            </div>
            {/* Social rail */}
            <div className="absolute right-4 top-1/2 hidden -translate-y-1/2 lg:block">
              <div className="hero-rise hero-d6 flex flex-col items-center gap-1 rounded-full bg-white/90 p-1.5 shadow-lg backdrop-blur">
              {[
                { href: settings.socials.x, label: "Apus Industries on X", Icon: Twitter },
                { href: settings.socials.instagram, label: "Apus Industries on Instagram", Icon: Instagram },
                { href: settings.socials.linkedin, label: "Apus Industries on LinkedIn", Icon: Linkedin },
              ].filter((s) => s.href).map(({ href, label, Icon }, i) => (
                <a key={label} href={href} target="_blank" rel="noreferrer" aria-label={label} className={`flex h-9 w-9 items-center justify-center rounded-full transition hover:bg-apus ${i === 0 ? "bg-apus text-ink" : "text-ink"}`}>
                  <Icon className="h-4 w-4" />
                </a>
              ))}
              </div>
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

      {/* Featured projects: only published projects. Empty state is honest, not invented. */}
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

      {/* Why choose Apus: dark section */}
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

      <CtaBand title="Have a project in mind?" text="Tell us what you need: software, electrical work, solar, or a full technology setup. We will come back with a clear plan and an honest quote." />
    </>
  );
}
