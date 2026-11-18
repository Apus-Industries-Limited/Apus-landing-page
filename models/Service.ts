import mongoose, { Schema, type InferSchemaType } from "mongoose";

const ServiceSchema = new Schema(
  {
    name: { type: String, required: true, trim: true, maxlength: 120 },
    slug: { type: String, required: true, unique: true, lowercase: true, trim: true, index: true },
    shortDescription: { type: String, required: true, maxlength: 300 },
    description: { type: String, required: true, maxlength: 8000 },
    icon: { type: String, default: "Cpu", maxlength: 60 },
    coverImage: { type: String, default: "" },
    benefits: { type: [String], default: [] },
    features: { type: [String], default: [] },
    featured: { type: Boolean, default: false, index: true },
    order: { type: Number, default: 0, index: true },
    active: { type: Boolean, default: true, index: true },
    seoTitle: { type: String, default: "" },
    seoDescription: { type: String, default: "" },
  },
  { timestamps: true }
);
ServiceSchema.index({ name: "text", shortDescription: "text" });

export type ServiceDoc = InferSchemaType<typeof ServiceSchema> & { _id: mongoose.Types.ObjectId };
export const Service = mongoose.models.Service ?? mongoose.model("Service", ServiceSchema);
