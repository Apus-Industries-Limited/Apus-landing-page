import mongoose, { Schema, type InferSchemaType } from "mongoose";

export const INQUIRY_STATUSES = [
  "new",
  "contacted",
  "in_discussion",
  "proposal_sent",
  "converted",
  "closed",
  "rejected",
] as const;

const InquirySchema = new Schema(
  {
    reference: { type: String, required: true, unique: true, index: true },
    name: { type: String, required: true, trim: true, maxlength: 120 },
    email: { type: String, required: true, lowercase: true, trim: true, index: true },
    phone: { type: String, default: "", maxlength: 40 },
    company: { type: String, default: "", maxlength: 160 },
    service: { type: String, default: "", maxlength: 160 },
    subject: { type: String, required: true, maxlength: 200 },
    message: { type: String, required: true, maxlength: 5000 },
    status: { type: String, enum: INQUIRY_STATUSES, default: "new", index: true },
    assignedTo: { type: Schema.Types.ObjectId, ref: "User", default: null },
    archived: { type: Boolean, default: false },
  },
  { timestamps: true }
);
InquirySchema.index({ createdAt: -1 });

export type InquiryDoc = InferSchemaType<typeof InquirySchema> & { _id: mongoose.Types.ObjectId };
export const Inquiry = mongoose.models.Inquiry ?? mongoose.model("Inquiry", InquirySchema);

const InquiryNoteSchema = new Schema(
  {
    inquiry: { type: Schema.Types.ObjectId, ref: "Inquiry", required: true, index: true },
    author: { type: Schema.Types.ObjectId, ref: "User", required: true },
    body: { type: String, required: true, maxlength: 3000 },
  },
  { timestamps: true }
);
export type InquiryNoteDoc = InferSchemaType<typeof InquiryNoteSchema> & { _id: mongoose.Types.ObjectId };
export const InquiryNote = mongoose.models.InquiryNote ?? mongoose.model("InquiryNote", InquiryNoteSchema);

const InquiryActivitySchema = new Schema(
  {
    inquiry: { type: Schema.Types.ObjectId, ref: "Inquiry", required: true, index: true },
    actor: { type: Schema.Types.ObjectId, ref: "User" },
    action: { type: String, required: true, maxlength: 200 },
    detail: { type: String, default: "", maxlength: 500 },
  },
  { timestamps: true }
);
export type InquiryActivityDoc = InferSchemaType<typeof InquiryActivitySchema> & { _id: mongoose.Types.ObjectId };
export const InquiryActivity =
  mongoose.models.InquiryActivity ?? mongoose.model("InquiryActivity", InquiryActivitySchema);

const MediaSchema = new Schema(
  {
    key: { type: String, required: true, unique: true, index: true },
    filename: { type: String, required: true, maxlength: 255 },
    url: { type: String, required: true },
    contentType: { type: String, required: true, maxlength: 120 },
    size: { type: Number, required: true },
    folder: { type: String, default: "general", index: true },
    uploadedBy: { type: Schema.Types.ObjectId, ref: "User" },
  },
  { timestamps: true }
);
export type MediaDoc = InferSchemaType<typeof MediaSchema> & { _id: mongoose.Types.ObjectId };
export const Media = mongoose.models.Media ?? mongoose.model("Media", MediaSchema);

const WhyChooseSchema = new Schema(
  { title: { type: String, required: true }, text: { type: String, required: true } },
  { _id: false }
);
const ValueSchema = new Schema(
  { title: { type: String, required: true }, text: { type: String, required: true } },
  { _id: false }
);

const WebsiteSettingsSchema = new Schema(
  {
    singleton: { type: String, default: "main", unique: true },
    companyName: { type: String, default: "Apus Industries Ltd" },
    tagline: { type: String, default: "Technology & engineering that moves business forward." },
    description: {
      type: String,
      default:
        "Apus Industries Ltd delivers software development, web and mobile applications, electrical and electronics solutions, solar and energy systems, and digital infrastructure for businesses that need reliable technology.",
    },
    email: { type: String, default: "apusindustries1@gmail.com" },
    phone: { type: String, default: "+2349029566770" },
    address: { type: String, default: "" },
    businessHours: { type: String, default: "9:00 – 17:00, Monday – Friday" },
    socials: {
      x: { type: String, default: "https://x.com/apusindustries" },
      instagram: { type: String, default: "https://instagram.com/apusindustries" },
      linkedin: { type: String, default: "https://linkedin.com/company/apusindustries" },
      facebook: { type: String, default: "" },
    },
    seoTitle: { type: String, default: "Apus Industries Ltd — Software, Electrical & Solar Solutions" },
    seoDescription: {
      type: String,
      default:
        "Apus Industries Ltd builds software, web and mobile apps, electrical and electronics systems, and solar and energy solutions for businesses.",
    },
    ogImage: { type: String, default: "" },
    heroHeadline: { type: String, default: "ENGINEERING TECHNOLOGY THAT MOVES BUSINESS FORWARD" },
    heroDescription: {
      type: String,
      default:
        "Apus Industries designs, builds and supports the software, electrical and energy systems your business runs on — delivered properly, documented, and supported long after handover.",
    },
    heroImage: { type: String, default: "" },
    heroPrimaryCta: { type: String, default: "Explore Our Services" },
    heroSecondaryCta: { type: String, default: "Talk to Our Team" },
    footerDescription: {
      type: String,
      default:
        "Apus Industries Ltd is a technology and engineering company delivering software, electrical, electronics and energy solutions for businesses.",
    },
    copyrightText: { type: String, default: "© {year} Apus Industries Ltd. All rights reserved." },
    whyChooseUs: {
      type: [WhyChooseSchema],
      default: [
        { title: "Engineering Excellence", text: "Systems designed and built to a proper engineering standard — tested, documented and built to last." },
        { title: "Practical Innovation", text: "New technology only where it solves a real business problem. No novelty for its own sake." },
        { title: "Reliable Delivery", text: "Clear scope, clear timelines, and work delivered as agreed — then handed over properly." },
        { title: "Business-focused Solutions", text: "Every project starts from what the business needs to achieve, not from the technology." },
        { title: "Long-term Technical Support", text: "We stay available after delivery, so the systems we build keep working for your business." },
      ],
    },
    mission: {
      type: String,
      default:
        "Update in Admin → Settings. (Placeholder) To deliver reliable technology and engineering solutions that help businesses work better, grow, and operate with confidence.",
    },
    vision: {
      type: String,
      default:
        "Update in Admin → Settings. (Placeholder) To be a trusted technology and engineering partner for businesses building their future on dependable systems.",
    },
    values: {
      type: [ValueSchema],
      default: [
        { title: "Reliability", text: "We do what we say we will do, and our systems keep working." },
        { title: "Quality", text: "Work done properly the first time, tested before it is handed over." },
        { title: "Honesty", text: "Clear pricing, clear timelines, and straight answers." },
        { title: "Service", text: "Support that continues after delivery, not just during the sale." },
      ],
    },
  },
  { timestamps: true }
);
export type WebsiteSettingsDoc = InferSchemaType<typeof WebsiteSettingsSchema> & { _id: mongoose.Types.ObjectId };
export const WebsiteSettings =
  mongoose.models.WebsiteSettings ?? mongoose.model("WebsiteSettings", WebsiteSettingsSchema);
