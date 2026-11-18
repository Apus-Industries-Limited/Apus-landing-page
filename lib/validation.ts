import { z } from "zod";

export const slugSchema = z.string().min(1).max(120).regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/);

export const serviceSchema = z.object({
  name: z.string().min(2).max(120),
  slug: slugSchema.optional(),
  shortDescription: z.string().min(2).max(300),
  description: z.string().min(2).max(8000),
  icon: z.string().max(60).optional().default("Cpu"),
  coverImage: z.string().url().optional().or(z.literal("")),
  benefits: z.array(z.string().min(1).max(200)).default([]),
  features: z.array(z.string().min(1).max(200)).default([]),
  featured: z.boolean().default(false),
  order: z.number().int().default(0),
  active: z.boolean().default(true),
  seoTitle: z.string().max(160).optional().default(""),
  seoDescription: z.string().max(320).optional().default(""),
});

export const projectCategorySchema = z.enum([
  "Software",
  "Web & Mobile",
  "Electrical & Electronics",
  "Solar & Energy",
  "Digital Infrastructure",
  "Other",
]);

export const projectSchema = z.object({
  name: z.string().min(2).max(160),
  slug: slugSchema.optional(),
  summary: z.string().min(2).max(500),
  description: z.string().min(2).max(12000),
  client: z.string().max(160).optional().default(""),
  industry: z.string().min(2).max(120),
  category: projectCategorySchema,
  services: z.array(z.string().min(1).max(120)).default([]),
  technologies: z.array(z.string().min(1).max(80)).default([]),
  coverImage: z.string().url().optional().or(z.literal("")),
  gallery: z.array(z.string().url()).default([]),
  projectDate: z.string().optional().default(""),
  projectUrl: z.string().url().optional().or(z.literal("")),
  featured: z.boolean().default(false),
  status: z.enum(["draft", "published"]).default("draft"),
  order: z.number().int().default(0),
});

export const testimonialSchema = z.object({
  clientName: z.string().min(2).max(120),
  position: z.string().max(120).optional().default(""),
  company: z.string().max(160).optional().default(""),
  photo: z.string().url().optional().or(z.literal("")),
  quote: z.string().min(10).max(2000),
  project: z.string().max(160).optional().default(""),
  status: z.enum(["pending", "approved", "rejected"]).default("pending"),
  published: z.boolean().default(false),
  order: z.number().int().default(0),
});

export const partnerSchema = z.object({
  name: z.string().min(2).max(160),
  logo: z.string().url().optional().or(z.literal("")),
  website: z.string().url().optional().or(z.literal("")),
  description: z.string().max(500).optional().default(""),
  order: z.number().int().default(0),
  active: z.boolean().default(true),
});

export const teamMemberSchema = z.object({
  name: z.string().min(2).max(120),
  photo: z.string().url().optional().or(z.literal("")),
  title: z.string().min(2).max(160),
  bio: z.string().min(2).max(3000),
  expertise: z.array(z.string().min(1).max(100)).default([]),
  linkedin: z.string().url().optional().or(z.literal("")),
  socials: z.record(z.string(), z.string().url()).optional().default({}),
  order: z.number().int().default(0),
  featured: z.boolean().default(false),
  active: z.boolean().default(true),
});

export const inquirySchema = z.object({
  name: z.string().min(2).max(120),
  email: z.string().email().max(160),
  phone: z.string().max(40).optional().default(""),
  company: z.string().max(160).optional().default(""),
  service: z.string().max(160).optional().default(""),
  subject: z.string().min(2).max(200),
  message: z.string().min(10).max(5000),
});

export const inquiryStatusSchema = z.enum([
  "new",
  "contacted",
  "in_discussion",
  "proposal_sent",
  "converted",
  "closed",
  "rejected",
]);

export const inquiryNoteSchema = z.object({
  body: z.string().min(1).max(3000),
});

export const settingsSchema = z.object({
  companyName: z.string().min(2).max(120),
  tagline: z.string().max(300).optional().default(""),
  description: z.string().max(2000).optional().default(""),
  email: z.string().email().max(160),
  phone: z.string().max(40),
  address: z.string().max(500).optional().default(""),
  businessHours: z.string().max(200).optional().default(""),
  socials: z
    .object({
      x: z.string().max(200).optional().default(""),
      instagram: z.string().max(200).optional().default(""),
      linkedin: z.string().max(200).optional().default(""),
      facebook: z.string().max(200).optional().default(""),
    })
    .default({}),
  seoTitle: z.string().max(160).optional().default(""),
  seoDescription: z.string().max(320).optional().default(""),
  ogImage: z.string().url().optional().or(z.literal("")),
  heroHeadline: z.string().max(300).optional().default(""),
  heroDescription: z.string().max(1000).optional().default(""),
  heroImage: z.string().url().optional().or(z.literal("")),
  heroPrimaryCta: z.string().max(80).optional().default(""),
  heroSecondaryCta: z.string().max(80).optional().default(""),
  footerDescription: z.string().max(1000).optional().default(""),
  copyrightText: z.string().max(300).optional().default(""),
  whyChooseUs: z
    .array(z.object({ title: z.string().min(1).max(120), text: z.string().min(1).max(500) }))
    .default([]),
  mission: z.string().max(3000).optional().default(""),
  vision: z.string().max(3000).optional().default(""),
  values: z.array(z.object({ title: z.string().min(1).max(120), text: z.string().min(1).max(500) })).default([]),
});

export const mediaUploadSchema = z.object({
  key: z.string().min(1).max(500),
  filename: z.string().min(1).max(255),
  contentType: z.string().min(1).max(120),
  size: z.number().int().positive().max(50 * 1024 * 1024),
  folder: z.string().max(120).optional().default("general"),
});

export const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1),
});

export const userSchema = z.object({
  name: z.string().min(2).max(120),
  email: z.string().email().max(160),
  password: z.string().min(8).max(128).optional(),
  role: z.enum(["super_admin", "admin", "content_manager"]),
  active: z.boolean().default(true),
});

export function zodErrorMessage(error: z.ZodError): string {
  return error.issues.map((i) => `${i.path.join(".")}: ${i.message}`).join("; ");
}
