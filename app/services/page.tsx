import type { Metadata } from "next";
import { getServices } from "@/lib/data";
import { ServiceCard } from "@/components/site/Cards";
import { SectionHeading, CtaBand } from "@/components/site/Sections";

export const metadata: Metadata = { title: "Services" };
export const revalidate = 60;

export default async function ServicesPage() {
  const services = await getServices();
  return (
    <>
      <section className="bg-mist py-16 sm:py-20">
        <div className="mx-auto max-w-shell px-4 sm:px-6 lg:px-8">
          <p className="eyebrow">Services</p>
          <h1 className="mt-4 max-w-3xl font-display text-4xl font-black leading-[1.02] tracking-tight sm:text-6xl">
            What we <span className="hl">do.</span>
          </h1>
          <p className="mt-6 max-w-2xl text-lg leading-relaxed text-neutral-600">
            Five service areas, one standard: work done properly, delivered as agreed, and supported afterwards.
          </p>
        </div>
      </section>
      <section className="bg-white py-16 sm:py-20">
        <div className="mx-auto max-w-shell px-4 sm:px-6 lg:px-8">
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {services.map((s) => <ServiceCard key={s.slug} service={s} />)}
          </div>
        </div>
      </section>
      <CtaBand title="Not sure which service fits?" text="Describe your project and we will point you to the right service — or a combination of them." />
    </>
  );
}
