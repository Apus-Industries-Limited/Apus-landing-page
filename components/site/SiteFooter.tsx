import Image from "next/image";
import Link from "next/link";
import { Mail, Phone, Clock, Linkedin, Instagram, Twitter } from "lucide-react";
import { getSettings } from "@/lib/settings";
import { getServices } from "@/lib/data";

export async function SiteFooter() {
  const settings = await getSettings();
  const services = await getServices();
  const year = new Date().getFullYear();
  const copyright = settings.copyrightText.replace("{year}", String(year));
  return (
    <footer className="bg-ink text-white">
      <div className="mx-auto grid max-w-shell gap-10 px-4 py-14 sm:grid-cols-2 sm:px-6 lg:grid-cols-4 lg:px-8">
        <div>
          <Image src="/logos/apus-logo-dark.png" alt="Apus Industries Ltd" width={220} height={145} className="h-16 w-auto" />
          <p className="mt-4 text-sm leading-relaxed text-neutral-400">{settings.footerDescription}</p>
          <div className="mt-5 flex gap-3">
            {settings.socials.x && (
              <a href={settings.socials.x} target="_blank" rel="noreferrer" aria-label="Apus Industries on X" className="rounded-full border border-white/20 p-2 text-neutral-300 transition hover:border-apus hover:text-apus">
                <Twitter className="h-4 w-4" />
              </a>
            )}
            {settings.socials.instagram && (
              <a href={settings.socials.instagram} target="_blank" rel="noreferrer" aria-label="Apus Industries on Instagram" className="rounded-full border border-white/20 p-2 text-neutral-300 transition hover:border-apus hover:text-apus">
                <Instagram className="h-4 w-4" />
              </a>
            )}
            {settings.socials.linkedin && (
              <a href={settings.socials.linkedin} target="_blank" rel="noreferrer" aria-label="Apus Industries on LinkedIn" className="rounded-full border border-white/20 p-2 text-neutral-300 transition hover:border-apus hover:text-apus">
                <Linkedin className="h-4 w-4" />
              </a>
            )}
          </div>
        </div>
        <div>
          <h3 className="text-sm font-semibold uppercase tracking-widest text-neutral-400">Company</h3>
          <ul className="mt-4 space-y-2.5 text-sm">
            <li><Link href="/" className="hover:text-apus">Home</Link></li>
            <li><Link href="/about" className="hover:text-apus">About Us</Link></li>
            <li><Link href="/services" className="hover:text-apus">Services</Link></li>
            <li><Link href="/projects" className="hover:text-apus">Projects</Link></li>
            <li><Link href="/contact" className="hover:text-apus">Contact Us</Link></li>
          </ul>
        </div>
        <div>
          <h3 className="text-sm font-semibold uppercase tracking-widest text-neutral-400">Services</h3>
          <ul className="mt-4 space-y-2.5 text-sm">
            {services.slice(0, 5).map((s) => (
              <li key={s.slug}>
                <Link href={`/services/${s.slug}`} className="hover:text-apus">{s.name}</Link>
              </li>
            ))}
          </ul>
        </div>
        <div>
          <h3 className="text-sm font-semibold uppercase tracking-widest text-neutral-400">Contact</h3>
          <ul className="mt-4 space-y-3 text-sm text-neutral-300">
            <li className="flex items-start gap-2"><Mail className="mt-0.5 h-4 w-4 shrink-0 text-apus" /><a href={`mailto:${settings.email}`} className="break-all hover:text-apus">{settings.email}</a></li>
            <li className="flex items-start gap-2"><Phone className="mt-0.5 h-4 w-4 shrink-0 text-apus" /><a href={`tel:${settings.phone.replace(/\s/g, "")}`} className="hover:text-apus">{settings.phone}</a></li>
            <li className="flex items-start gap-2"><Clock className="mt-0.5 h-4 w-4 shrink-0 text-apus" /><span>{settings.businessHours}</span></li>
          </ul>
        </div>
      </div>
      <div className="border-t border-white/10">
        <div className="mx-auto flex max-w-shell flex-col items-center justify-between gap-3 px-4 py-5 text-xs text-neutral-400 sm:flex-row sm:px-6 lg:px-8">
          <p>{copyright}</p>
          <div className="flex gap-5">
            <Link href="/privacy-policy" className="hover:text-apus">Privacy Policy</Link>
            <Link href="/terms-and-conditions" className="hover:text-apus">Terms &amp; Conditions</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
