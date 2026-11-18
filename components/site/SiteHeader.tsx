import Image from "next/image";
import Link from "next/link";
import { getSettings } from "@/lib/settings";

const NAV = [
  { href: "/", label: "Home" },
  { href: "/about", label: "About Us" },
  { href: "/services", label: "Services" },
  { href: "/projects", label: "Projects" },
  { href: "/contact", label: "Contact Us" },
];

export async function SiteHeader() {
  const settings = await getSettings();
  return (
    <header className="sticky top-0 z-40 border-b border-line bg-white/90 backdrop-blur">
      <div className="mx-auto flex h-16 max-w-shell items-center justify-between px-4 sm:px-6 lg:px-8">
        <Link href="/" className="flex items-center gap-3" aria-label="Apus Industries Ltd — home">
          <Image src="/logos/apus-logo-light.png" alt="Apus Industries Ltd" width={96} height={64} className="h-9 w-auto" priority />
          <span className="hidden text-[15px] font-bold tracking-tight sm:block">
            Apus Industries <span className="font-medium text-neutral-500">Ltd</span>
          </span>
        </Link>
        <nav className="hidden items-center gap-7 md:flex" aria-label="Primary">
          {NAV.map((item) => (
            <Link key={item.href} href={item.href} className="text-sm font-medium text-neutral-700 transition hover:text-ink">
              {item.label}
            </Link>
          ))}
        </nav>
        <div className="flex items-center gap-3">
          <a href={`mailto:${settings.email}`} className="hidden text-sm font-medium text-neutral-600 lg:block">
            {settings.email}
          </a>
          <Link
            href="/contact"
            className="rounded-full bg-ink px-4 py-2 text-sm font-semibold text-white transition hover:bg-coal"
          >
            Get in Touch
          </Link>
          <MobileNav />
        </div>
      </div>
      <div id="mobile-nav" />
    </header>
  );
}

function MobileNav() {
  return (
    <details className="group relative md:hidden">
      <summary className="flex cursor-pointer list-none items-center rounded-md border border-line px-3 py-2 text-sm font-semibold">
        Menu
      </summary>
      <nav className="absolute right-0 top-12 w-56 rounded-xl border border-line bg-white p-2 shadow-lg" aria-label="Mobile">
        {NAV.map((item) => (
          <Link key={item.href} href={item.href} className="block rounded-lg px-3 py-2.5 text-sm font-medium hover:bg-smoke">
            {item.label}
          </Link>
        ))}
      </nav>
    </details>
  );
}
