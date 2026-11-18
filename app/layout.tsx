import type { Metadata } from "next";
import { Inter, Archivo } from "next/font/google";
import "./globals.css";
import { SiteHeader } from "@/components/site/SiteHeader";
import { SiteFooter } from "@/components/site/SiteFooter";
import { getSettings, DEFAULT_SETTINGS } from "@/lib/settings";
import { siteUrl } from "@/lib/utils";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter", display: "swap" });
const archivo = Archivo({ subsets: ["latin"], variable: "--font-display", weight: ["600", "700", "800", "900"], display: "swap" });

export async function generateMetadata(): Promise<Metadata> {
  const settings = await getSettings();
  const url = siteUrl();
  return {
    metadataBase: new URL(url),
    title: { default: settings.seoTitle || DEFAULT_SETTINGS.seoTitle, template: `%s | ${settings.companyName}` },
    description: settings.seoDescription,
    openGraph: {
      type: "website",
      url,
      title: settings.seoTitle,
      description: settings.seoDescription,
      siteName: settings.companyName,
      ...(settings.ogImage ? { images: [{ url: settings.ogImage }] } : {}),
    },
    twitter: { card: "summary_large_image", title: settings.seoTitle, description: settings.seoDescription },
    alternates: { canonical: url },
  };
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${inter.variable} ${archivo.variable}`}>
      <body className="flex min-h-screen flex-col">
        <SiteHeader />
        <main className="flex-1">{children}</main>
        <SiteFooter />
      </body>
    </html>
  );
}
