import mongoose, { Schema, type InferSchemaType } from "mongoose";

export const PROJECT_CATEGORIES = [
  "Software",
  "Web & Mobile",
  "Electrical & Electronics",
  "Solar & Energy",
  "Digital Infrastructure",
  "Other",
] as const;

const ProjectSchema = new Schema(
  {
    name: { type: String, required: true, trim: true, maxlength: 160 },
    slug: { type: String, required: true, unique: true, lowercase: true, trim: true, index: true },
    summary: { type: String, required: true, maxlength: 500 },
    description: { type: String, required: true, maxlength: 12000 },
    client: { type: String, default: "", maxlength: 160 },
    industry: { type: String, required: true, maxlength: 120 },
    category: { type: String, enum: PROJECT_CATEGORIES, required: true, index: true },
    services: { type: [String], default: [] },
    technologies: { type: [String], default: [] },
    coverImage: { type: String, default: "" },
    gallery: { type: [String], default: [] },
    projectDate: { type: Date },
    projectUrl: { type: String, default: "" },
    featured: { type: Boolean, default: false, index: true },
    status: { type: String, enum: ["draft", "published"], default: "draft", index: true },
    order: { type: Number, default: 0, index: true },
    deletedAt: { type: Date, default: null },
  },
  { timestamps: true }
);
ProjectSchema.index({ name: "text", summary: "text", description: "text" });

export type ProjectDoc = InferSchemaType<typeof ProjectSchema> & { _id: mongoose.Types.ObjectId };
export const Project = mongoose.models.Project ?? mongoose.model("Project", ProjectSchema);
