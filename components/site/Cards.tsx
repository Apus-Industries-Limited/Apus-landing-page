import Link from "next/link";
import Image from "next/image";
import { ArrowUpRight, Code2, Smartphone, Zap, Sun, Server, Cpu } from "lucide-react";
import type { ServiceItem, ProjectItem, TestimonialItem } from "@/lib/data";
import { serviceCoverImage } from "@/lib/data";

const ICONS: Record<string, typeof Cpu> = { Code2, Smartphone, Zap, Sun, Server, Cpu };

export function ServiceIcon({ name, className = "h-6 w-6" }: { name: string; className?: string }) {
  const Icon = ICONS[name] ?? Cpu;
  return <Icon className={className} />;
}

export function ServiceCard({ service }: { service: ServiceItem }) {
  const cover = serviceCoverImage(service);
  return (
    <Link href={`/services/${service.slug}`} className="group flex flex-col overflow-hidden rounded-2xl border border-line bg-white transition hover:-translate-y-1 hover:border-apus hover:shadow-lg">
      {cover ? (
        <div className="relative aspect-[16/10] bg-mist">
          <Image src={cover} alt={service.name} fill className="object-cover" sizes="(max-width: 768px) 100vw, 33vw" />
        </div>
      ) : null}
      <div className="flex flex-1 flex-col p-6">
        <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-apus-pale text-apus-deep">
          <ServiceIcon name={service.icon} />
        </span>
        <h3 className="mt-5 font-display text-lg font-bold leading-snug">{service.name}</h3>
        <p className="mt-2 flex-1 text-sm leading-relaxed text-neutral-600">{service.shortDescription}</p>
        <span className="mt-5 inline-flex items-center gap-1 text-sm font-semibold text-ink group-hover:text-apus-deep">
          Learn more <ArrowUpRight className="h-4 w-4 transition group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
        </span>
      </div>
    </Link>
  );
}

export function ProjectCard({ project }: { project: ProjectItem }) {
  return (
    <Link href={`/projects/${project.slug}`} className="group overflow-hidden rounded-2xl border border-line bg-white transition hover:-translate-y-1 hover:shadow-lg">
      <div className="relative aspect-[16/10] bg-mist">
        {project.coverImage ? (
          <Image src={project.coverImage} alt={project.name} fill className="object-cover" sizes="(max-width: 768px) 100vw, 33vw" />
        ) : (
          <div className="flex h-full items-center justify-center bg-ink p-6 text-center">
            <span className="font-display text-xl font-bold leading-snug text-white">
              {project.name}
            </span>
          </div>
        )}
        <span className="absolute left-3 top-3 rounded-full bg-white/90 px-3 py-1 text-xs font-semibold">{project.category}</span>
      </div>
      <div className="p-5">
        <h3 className="font-display text-lg font-bold leading-snug group-hover:text-apus-deep">{project.name}</h3>
        <p className="mt-1.5 line-clamp-2 text-sm leading-relaxed text-neutral-600">{project.summary}</p>
        <p className="mt-3 text-xs font-medium uppercase tracking-wider text-neutral-500">{project.industry}</p>
      </div>
    </Link>
  );
}

export function TestimonialCard({ testimonial }: { testimonial: TestimonialItem }) {
  return (
    <figure className="rounded-2xl border border-line bg-white p-6">
      <blockquote className="text-[15px] leading-relaxed text-neutral-700">“{testimonial.quote}”</blockquote>
      <figcaption className="mt-5 flex items-center gap-3">
        {testimonial.photo ? (
          <Image src={testimonial.photo} alt={testimonial.clientName} width={44} height={44} className="h-11 w-11 rounded-full object-cover" />
        ) : (
          <span className="flex h-11 w-11 items-center justify-center rounded-full bg-apus-pale font-display text-sm font-bold text-apus-deep">
            {testimonial.clientName.split(" ").map((w) => w[0]).slice(0, 2).join("")}
          </span>
        )}
        <span>
          <span className="block text-sm font-semibold">{testimonial.clientName}</span>
          <span className="block text-xs text-neutral-500">
            {[testimonial.position, testimonial.company].filter(Boolean).join(", ")}
          </span>
        </span>
      </figcaption>
    </figure>
  );
}
