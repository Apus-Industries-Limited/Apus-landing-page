import type { ReactNode } from "react";
import { cn } from "@/lib/cn";

export function SectionHeading({ eyebrow, title, description, dark = false, align = "left" }: {
  eyebrow: string; title: ReactNode; description?: string; dark?: boolean; align?: "left" | "center";
}) {
  return (
    <div className={cn("max-w-2xl", align === "center" && "mx-auto text-center")}>
      <p className={cn("eyebrow", dark && "text-neutral-400")}>{eyebrow}</p>
      <h2 className={cn("mt-3 font-display text-3xl font-bold leading-tight tracking-tight sm:text-4xl", dark ? "text-white" : "text-ink")}>
        {title}
      </h2>
      {description && <p className={cn("mt-3 text-base leading-relaxed", dark ? "text-neutral-400" : "text-neutral-600")}>{description}</p>}
    </div>
  );
}

export function CtaBand({ title, text }: { title: string; text: string }) {
  return (
    <section className="bg-ink py-20 text-white">
      <div className="mx-auto max-w-shell px-4 text-center sm:px-6 lg:px-8">
        <p className="eyebrow !text-neutral-400">Start a project</p>
        <h2 className="mx-auto mt-4 max-w-2xl font-display text-4xl font-bold tracking-tight sm:text-5xl">{title}</h2>
        <p className="mx-auto mt-4 max-w-xl text-neutral-400">{text}</p>
        <div className="mt-8 flex flex-wrap justify-center gap-3">
          <a href="/contact" className="rounded-full bg-apus px-6 py-3 text-sm font-semibold text-ink transition hover:bg-white">Talk to Our Team</a>
          <a href="/services" className="rounded-full border border-white/30 px-6 py-3 text-sm font-semibold text-white transition hover:border-white">Explore Our Services</a>
        </div>
      </div>
    </section>
  );
}
