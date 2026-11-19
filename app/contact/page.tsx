import type { Metadata } from "next";
import { Suspense } from "react";
import Image from "next/image";
import { Mail, Phone, Clock, MapPin, Linkedin, Instagram, Twitter } from "lucide-react";
import { getSettings } from "@/lib/settings";
import { getServices } from "@/lib/data";
import ContactForm from "@/components/site/ContactForm";

export const metadata: Metadata = { title: "Contact Us" };
export const revalidate = 60;

export default async function ContactPage() {
  const settings = await getSettings();
  const services = await getServices();
  return (
    <>
      <section className="bg-mist py-16 sm:py-20">
        <div className="mx-auto max-w-shell px-4 sm:px-6 lg:px-8">
          <p className="eyebrow">Contact Us</p>
          <h1 className="mt-4 max-w-3xl font-display text-4xl font-black leading-[1.02] tracking-tight sm:text-6xl">
            Let&apos;s talk about <span className="hl">your project.</span>
          </h1>
          <p className="mt-6 max-w-2xl text-lg leading-relaxed text-neutral-600">
            Tell us what you need — software, electrical work, solar, or a full technology setup — and we will come back with a clear plan.
          </p>
        </div>
      </section>
      <section className="bg-white py-16 sm:py-20">
        <div className="mx-auto grid max-w-shell gap-10 px-4 sm:px-6 lg:grid-cols-5 lg:px-8">
          <div className="lg:col-span-3">
            <Suspense fallback={<div className="rounded-2xl border border-line p-8">Loading form…</div>}>
              <ContactForm services={services} />
            </Suspense>
          </div>
          <aside className="space-y-4 lg:col-span-2">
            <div className="relative overflow-hidden rounded-2xl bg-ink">
              <Image src="/images/contact.jpg" alt="Meeting the Apus Industries team" width={1280} height={960} className="aspect-[4/3] w-full object-cover" />
            </div>
            <div className="rounded-2xl border border-line p-6">
              <h2 className="font-display text-lg font-bold">Contact details</h2>
              <ul className="mt-4 space-y-4 text-sm">
                <li className="flex items-start gap-3"><Mail className="mt-0.5 h-5 w-5 shrink-0 text-apus-deep" /><span><span className="block text-xs uppercase tracking-wider text-neutral-500">Email</span><a href={`mailto:${settings.email}`} className="font-semibold hover:text-apus-deep">{settings.email}</a></span></li>
                <li className="flex items-start gap-3"><Phone className="mt-0.5 h-5 w-5 shrink-0 text-apus-deep" /><span><span className="block text-xs uppercase tracking-wider text-neutral-500">Phone</span><a href={`tel:${settings.phone.replace(/\s/g, "")}`} className="font-semibold hover:text-apus-deep">{settings.phone}</a></span></li>
                <li className="flex items-start gap-3"><Clock className="mt-0.5 h-5 w-5 shrink-0 text-apus-deep" /><span><span className="block text-xs uppercase tracking-wider text-neutral-500">Business hours</span><span className="font-semibold">{settings.businessHours}</span></span></li>
                <li className="flex items-start gap-3"><MapPin className="mt-0.5 h-5 w-5 shrink-0 text-apus-deep" /><span><span className="block text-xs uppercase tracking-wider text-neutral-500">Office</span><span className="font-semibold">{settings.address || "Office address — update in Admin → Settings."}</span></span></li>
              </ul>
            </div>
            <div className="rounded-2xl bg-ink p-6 text-white">
              <h2 className="font-display text-lg font-bold">Follow us</h2>
              <div className="mt-4 flex gap-3">
                {settings.socials.x && <a href={settings.socials.x} target="_blank" rel="noreferrer" aria-label="X" className="rounded-full border border-white/20 p-2.5 hover:border-apus hover:text-apus"><Twitter className="h-4 w-4" /></a>}
                {settings.socials.instagram && <a href={settings.socials.instagram} target="_blank" rel="noreferrer" aria-label="Instagram" className="rounded-full border border-white/20 p-2.5 hover:border-apus hover:text-apus"><Instagram className="h-4 w-4" /></a>}
                {settings.socials.linkedin && <a href={settings.socials.linkedin} target="_blank" rel="noreferrer" aria-label="LinkedIn" className="rounded-full border border-white/20 p-2.5 hover:border-apus hover:text-apus"><Linkedin className="h-4 w-4" /></a>}
              </div>
              <p className="mt-4 text-sm text-neutral-400">@apusindustries on X, Instagram and LinkedIn.</p>
            </div>
            <div className="rounded-2xl border border-dashed border-line bg-smoke p-6">
              <h2 className="font-display text-lg font-bold">Visit us</h2>
              <p className="mt-2 text-sm leading-relaxed text-neutral-600">
                A map is shown here once the office address is added in Admin → Settings.
              </p>
            </div>
          </aside>
        </div>
      </section>
    </>
  );
}
