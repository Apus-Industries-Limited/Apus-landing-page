import { connectDB } from "@/lib/db";
import { WebsiteSettings } from "@/models/Crm";

export type SettingsShape = {
  companyName: string;
  tagline: string;
  description: string;
  email: string;
  phone: string;
  address: string;
  businessHours: string;
  socials: { x: string; instagram: string; linkedin: string; facebook: string };
  seoTitle: string;
  seoDescription: string;
  ogImage: string;
  heroHeadline: string;
  heroDescription: string;
  heroImage: string;
  heroPrimaryCta: string;
  heroSecondaryCta: string;
  footerDescription: string;
  copyrightText: string;
  whyChooseUs: { title: string; text: string }[];
  mission: string;
  vision: string;
  values: { title: string; text: string }[];
};

export const DEFAULT_SETTINGS: SettingsShape = {
  companyName: "Apus Industries Ltd",
  tagline: "Technology & engineering that moves business forward.",
  description:
    "Apus Industries Ltd delivers software development, web and mobile applications, electrical and electronics solutions, solar and energy systems, and digital infrastructure for businesses that need reliable technology.",
  email: "apusindustries1@gmail.com",
  phone: "+2349029566770",
  address: "",
  businessHours: "9am to 5pm, Monday to Friday",
  socials: {
    x: "https://x.com/apusindustries",
    instagram: "https://instagram.com/apusindustries",
    linkedin: "https://linkedin.com/company/apusindustries",
    facebook: "",
  },
  seoTitle: "Apus Industries Ltd: Software, Electrical and Solar Solutions",
  seoDescription:
    "Apus Industries Ltd builds software, web and mobile apps, electrical and electronics systems, and solar and energy solutions for businesses.",
  ogImage: "",
  heroHeadline: "ENGINEERING TECHNOLOGY THAT MOVES BUSINESS FORWARD",
  heroDescription:
    "Apus Industries designs, builds and supports the software, electrical and energy systems your business runs on. Delivered properly, documented, and supported long after handover.",
  heroImage: "",
  heroPrimaryCta: "Explore Our Services",
  heroSecondaryCta: "Talk to Our Team",
  footerDescription:
    "Apus Industries Ltd is a technology and engineering company delivering software, electrical, electronics and energy solutions for businesses.",
  copyrightText: "© {year} Apus Industries Ltd. All rights reserved.",
  whyChooseUs: [
    { title: "Engineering Excellence", text: "Systems designed and built to a proper engineering standard. Tested, documented and built to last." },
    { title: "Practical Innovation", text: "New technology only where it solves a real business problem. No novelty for its own sake." },
    { title: "Reliable Delivery", text: "Clear scope, clear timelines, and work delivered as agreed, then handed over properly." },
    { title: "Business Focused Solutions", text: "Every project starts from what the business needs to achieve, not from the technology." },
    { title: "Long Term Technical Support", text: "We stay available after delivery, so the systems we build keep working for your business." },
  ],
  mission:
    "Update in Admin → Settings. (Placeholder) To deliver reliable technology and engineering solutions that help businesses work better, grow, and operate with confidence.",
  vision:
    "Update in Admin → Settings. (Placeholder) To be a trusted technology and engineering partner for businesses building their future on dependable systems.",
  values: [
    { title: "Reliability", text: "We do what we say we will do, and our systems keep working." },
    { title: "Quality", text: "Work done properly the first time, tested before it is handed over." },
    { title: "Honesty", text: "Clear pricing, clear timelines, and straight answers." },
    { title: "Service", text: "Support that continues after delivery, not just during the sale." },
  ],
};

/** Cached site settings; falls back to DEFAULT_SETTINGS when the DB is unavailable. */
let cache: { at: number; data: SettingsShape } | null = null;

export async function getSettings(): Promise<SettingsShape> {
  if (cache && Date.now() - cache.at < 60_000) return cache.data;
  const db = await connectDB();
  if (!db) return DEFAULT_SETTINGS;
  try {
    const doc = (await WebsiteSettings.findOne({ singleton: "main" }).lean()) as unknown as Record<string, unknown> | null;
    if (!doc) return DEFAULT_SETTINGS;
    const parsed = JSON.parse(JSON.stringify(doc)) as Record<string, unknown>;
    const data: SettingsShape = {
      ...DEFAULT_SETTINGS,
      ...parsed,
      socials: { ...DEFAULT_SETTINGS.socials, ...((parsed.socials as Record<string, string>) ?? {}) },
    };
    cache = { at: Date.now(), data };
    return data;
  } catch {
    return DEFAULT_SETTINGS;
  }
}

export function invalidateSettingsCache() {
  cache = null;
}
