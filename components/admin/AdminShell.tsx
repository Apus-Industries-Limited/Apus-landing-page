import Link from "next/link";
import Image from "next/image";
import { LayoutDashboard, Briefcase, FolderKanban, MessageSquareQuote, Handshake, Users, Inbox, Image as ImageIcon, Settings, UserCog, LogOut } from "lucide-react";
import { auth, signOut } from "@/lib/auth";
import { ToastProvider } from "@/components/admin/ui";

const NAV = [
  { href: "/admin", label: "Dashboard", icon: LayoutDashboard },
  { href: "/admin/services", label: "Services", icon: Briefcase },
  { href: "/admin/projects", label: "Projects", icon: FolderKanban },
  { href: "/admin/testimonials", label: "Testimonials", icon: MessageSquareQuote },
  { href: "/admin/partners", label: "Partners", icon: Handshake },
  { href: "/admin/team", label: "Team", icon: Users },
  { href: "/admin/inquiries", label: "Inquiries", icon: Inbox },
  { href: "/admin/media", label: "Media Library", icon: ImageIcon },
  { href: "/admin/settings", label: "Settings", icon: Settings },
  { href: "/admin/users", label: "Users", icon: UserCog },
];

export default async function AdminShell({ children }: { children: React.ReactNode }) {
  const session = await auth();
  const user = session?.user as { name?: string | null; email?: string | null; role?: string } | undefined;
  return (
    <ToastProvider>
      <div className="flex min-h-screen bg-smoke">
        <aside className="hidden w-64 shrink-0 flex-col bg-ink text-white md:flex">
          <Link href="/admin" className="flex items-center gap-3 px-5 py-5">
            <Image src="/logos/apus-logo-dark.png" alt="Apus Industries Ltd" width={120} height={79} className="h-9 w-auto" />
          </Link>
          <nav className="flex-1 space-y-1 px-3" aria-label="Admin">
            {NAV.map((item) => (
              <Link key={item.href} href={item.href} className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-neutral-300 transition hover:bg-white/10 hover:text-white">
                <item.icon className="h-4 w-4 text-apus" />
                {item.label}
              </Link>
            ))}
          </nav>
          <div className="border-t border-white/10 p-4 text-xs text-neutral-400">
            <p className="font-semibold text-white">{user?.name ?? "Admin"}</p>
            <p className="truncate">{user?.email}</p>
            <p className="mt-1 capitalize">{(user?.role ?? "").replace("_", " ")}</p>
          </div>
        </aside>
        <div className="flex min-w-0 flex-1 flex-col">
          <header className="flex items-center justify-between gap-3 border-b border-line bg-white px-4 py-3 sm:px-6">
            <Link href="/admin" className="flex items-center gap-2 md:hidden">
              <Image src="/logos/apus-logo-light.png" alt="Apus Industries Ltd" width={72} height={48} className="h-7 w-auto" />
              <span className="text-sm font-bold">Admin</span>
            </Link>
            <span className="hidden text-sm font-semibold text-neutral-600 md:block">Apus Industries — Admin CRM / CMS</span>
            <div className="flex items-center gap-3">
              <Link href="/" target="_blank" className="text-sm font-medium text-neutral-600 hover:text-ink">View site</Link>
              <form action={async () => { "use server"; await signOut({ redirectTo: "/admin/login" }); }}>
                <button type="submit" className="inline-flex items-center gap-1.5 rounded-full border border-line px-3.5 py-2 text-sm font-semibold hover:bg-smoke">
                  <LogOut className="h-4 w-4" /> Log out
                </button>
              </form>
            </div>
          </header>
          <nav className="flex gap-1 overflow-x-auto border-b border-line bg-white px-3 py-2 md:hidden" aria-label="Admin mobile">
            {NAV.map((item) => (
              <Link key={item.href} href={item.href} className="whitespace-nowrap rounded-full bg-smoke px-3 py-1.5 text-xs font-semibold">{item.label}</Link>
            ))}
          </nav>
          <main className="mx-auto w-full max-w-6xl flex-1 px-4 py-6 sm:px-6">{children}</main>
        </div>
      </div>
    </ToastProvider>
  );
}
