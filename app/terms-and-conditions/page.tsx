import type { Metadata } from "next";
import { getSettings } from "@/lib/settings";

export const metadata: Metadata = { title: "Terms & Conditions" };
export const revalidate = 60;

export default async function TermsPage() {
  const s = await getSettings();
  return (
    <article className="mx-auto max-w-3xl px-4 py-16 sm:px-6">
      <p className="eyebrow">Legal</p>
      <h1 className="mt-4 font-display text-4xl font-black tracking-tight">Terms &amp; Conditions</h1>
      <p className="mt-2 text-sm text-neutral-500">Last updated: November 2026 · Managed in Admin → Settings (content below is the default text).</p>
      <div className="mt-8 space-y-6 leading-relaxed text-neutral-700">
        <p>These terms govern your use of the website of {s.companyName} (“we”, “us”, “our”). By using this website, you agree to these terms.</p>
        <h2 className="font-display text-xl font-bold text-ink">About the website</h2>
        <p>This website describes our services and allows you to send us an enquiry. The content is provided for general information. Service descriptions, availability and pricing may change, and a formal quotation is the binding statement of scope and price for any project.</p>
        <h2 className="font-display text-xl font-bold text-ink">Enquiries</h2>
        <p>Sending an enquiry through the contact form does not create a contract. A contract is formed only when we confirm acceptance of a project in writing and any agreed terms are met.</p>
        <h2 className="font-display text-xl font-bold text-ink">Acceptable use</h2>
        <p>You must not use this website to send unlawful, harmful or misleading content, to attempt to access systems without authorisation, or to interfere with the operation of the website.</p>
        <h2 className="font-display text-xl font-bold text-ink">Intellectual property</h2>
        <p>The content of this website, including text, images and logos, belongs to {s.companyName} or its licensors and may not be reproduced without permission.</p>
        <h2 className="font-display text-xl font-bold text-ink">Liability</h2>
        <p>We provide this website on an “as is” basis. To the extent permitted by law, we are not liable for loss arising from your use of the website. Nothing in these terms limits liability that cannot be limited by law.</p>
        <h2 className="font-display text-xl font-bold text-ink">Contact</h2>
        <p>Questions about these terms: <a className="font-semibold text-apus-deep" href={`mailto:${s.email}`}>{s.email}</a> · {s.phone}.</p>
      </div>
    </article>
  );
}
