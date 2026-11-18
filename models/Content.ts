import mongoose, { Schema, type InferSchemaType } from "mongoose";

const TestimonialSchema = new Schema(
  {
    clientName: { type: String, required: true, trim: true, maxlength: 120 },
    position: { type: String, default: "", maxlength: 120 },
    company: { type: String, default: "", maxlength: 160 },
    photo: { type: String, default: "" },
    quote: { type: String, required: true, maxlength: 2000 },
    project: { type: String, default: "", maxlength: 160 },
    status: { type: String, enum: ["pending", "approved", "rejected"], default: "pending", index: true },
    published: { type: Boolean, default: false, index: true },
    order: { type: Number, default: 0, index: true },
    deletedAt: { type: Date, default: null },
  },
  { timestamps: true }
);
export type TestimonialDoc = InferSchemaType<typeof TestimonialSchema> & { _id: mongoose.Types.ObjectId };
export const Testimonial = mongoose.models.Testimonial ?? mongoose.model("Testimonial", TestimonialSchema);

const PartnerSchema = new Schema(
  {
    name: { type: String, required: true, trim: true, maxlength: 160 },
    logo: { type: String, default: "" },
    website: { type: String, default: "" },
    description: { type: String, default: "", maxlength: 500 },
    order: { type: Number, default: 0, index: true },
    active: { type: Boolean, default: true, index: true },
    deletedAt: { type: Date, default: null },
  },
  { timestamps: true }
);
export type PartnerDoc = InferSchemaType<typeof PartnerSchema> & { _id: mongoose.Types.ObjectId };
export const Partner = mongoose.models.Partner ?? mongoose.model("Partner", PartnerSchema);

const TeamMemberSchema = new Schema(
  {
    name: { type: String, required: true, trim: true, maxlength: 120 },
    photo: { type: String, default: "" },
    title: { type: String, required: true, maxlength: 160 },
    bio: { type: String, required: true, maxlength: 3000 },
    expertise: { type: [String], default: [] },
    linkedin: { type: String, default: "" },
    socials: { type: Map, of: String, default: {} },
    order: { type: Number, default: 0, index: true },
    featured: { type: Boolean, default: false },
    active: { type: Boolean, default: true, index: true },
    deletedAt: { type: Date, default: null },
  },
  { timestamps: true }
);
export type TeamMemberDoc = InferSchemaType<typeof TeamMemberSchema> & { _id: mongoose.Types.ObjectId };
export const TeamMember = mongoose.models.TeamMember ?? mongoose.model("TeamMember", TeamMemberSchema);
