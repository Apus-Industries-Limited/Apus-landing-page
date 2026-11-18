import type { Metadata } from "next";
import { getSettings } from "@/lib/settings";

export const metadata: Metadata = { title: "Privacy Policy" };
export const revalidate = 60;

export default async function PrivacyPage() {
  const s = await getSettings();
  return (
    <article className="mx-auto max-w-3xl px-4 py-16 sm:px-6">
      <p className="eyebrow">Legal</p>
      <h1 className="mt-4 font-display text-4xl font-black tracking-tight">Privacy Policy</h1>
      <p className="mt-2 text-sm text-neutral-500">Last updated: November 2026 · Managed in Admin → Settings (content below is the default text).</p>
      <div className="mt-8 space-y-6 leading-relaxed text-neutral-700">
        <p>{s.companyName} (“we”, “us”, “our”) operates this website. This policy explains what information we collect when you use the contact form or browse the site, and how we use it.</p>
        <h2 className="font-display text-xl font-bold text-ink">Information we collect</h2>
        <p>When you send an enquiry through the contact form, we collect the details you provide: your name, email address, phone number (if given), company (if given), the service you are interested in, and your message. We also collect basic technical information such as pages visited, for the purpose of operating and improving the website.</p>
        <h2 className="font-display text-xl font-bold text-ink">How we use it</h2>
        <p>We use your enquiry details only to respond to your enquiry and to manage the resulting business relationship. We do not sell your personal information. We do not share it with third parties except where necessary to provide a service you have requested, or where required by law.</p>
        <h2 className="font-display text-xl font-bold text-ink">Storage and security</h2>
        <p>Enquiries are stored securely in our database and are accessible only to authorised members of our team through the admin dashboard. We keep enquiries only for as long as needed for the purpose above.</p>
        <h2 className="font-display text-xl font-bold text-ink">Your rights</h2>
        <p>You may ask us for a copy of the personal information we hold about you, ask us to correct it, or ask us to delete it. To do so, contact us at <a className="font-semibold text-apus-deep" href={`mailto:${s.email}`}>{s.email}</a>.</p>
        <h2 className="font-display text-xl font-bold text-ink">Contact</h2>
        <p>If you have questions about this policy, contact {s.companyName} at <a className="font-semibold text-apus-deep" href={`mailto:${s.email}`}>{s.email}</a> or by phone on {s.phone}.</p>
      </div>
    </article>
  );
}
