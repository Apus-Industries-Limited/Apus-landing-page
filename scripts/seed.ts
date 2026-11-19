import "dotenv/config";
import bcrypt from "bcryptjs";
import { connectDB } from "../lib/db";
import { User } from "../models/User";
import { Service } from "../models/Service";
import { WebsiteSettings } from "../models/Crm";
import { DEFAULT_SETTINGS } from "../lib/settings";
import { SEEDED_SERVICES } from "../lib/data";
import { slugify } from "../lib/utils";

async function main() {
  const db = await connectDB();
  if (!db) {
    console.error("MONGODB_URI is not set. Copy .env.example to .env.local and fill in your MongoDB Atlas connection string, then run `npm run seed` again.");
    process.exit(1);
  }

  // 1. Website settings (singleton) — real contact details from the company.
  await WebsiteSettings.findOneAndUpdate(
    { singleton: "main" },
    { ...DEFAULT_SETTINGS, singleton: "main" },
    { upsert: true, new: true, setDefaultsOnInsert: true }
  );
  console.log("✓ Website settings upserted (apusindustries1@gmail.com, +2349029566770, 9am to 5pm, Monday to Friday, @apusindustries).");

  // 2. The five service categories from the brief (the only seeded content).
  for (const s of SEEDED_SERVICES) {
    await Service.findOneAndUpdate(
      { slug: slugify(s.slug) },
      {
        name: s.name,
        slug: slugify(s.slug),
        shortDescription: s.shortDescription,
        description: s.description,
        icon: s.icon,
        benefits: s.benefits,
        features: s.features,
        featured: s.featured,
        order: s.order,
        active: true,
      },
      { upsert: true, new: true, setDefaultsOnInsert: true }
    );
  }
  console.log(`✓ ${SEEDED_SERVICES.length} services upserted.`);

  // 3. Super-admin user — ONLY if env vars are set. Never a hardcoded password.
  const email = process.env.ADMIN_SEED_EMAIL?.toLowerCase().trim();
  const password = process.env.ADMIN_SEED_PASSWORD;
  const name = process.env.ADMIN_SEED_NAME || "Apus Admin";
  if (!email || !password) {
    console.warn("⚠ ADMIN_SEED_EMAIL / ADMIN_SEED_PASSWORD are not set. No admin user was created.");
    console.warn("  Set them in .env.local and re-run `npm run seed`, or create the first admin in MongoDB directly.");
  } else {
    if (password.length < 8) {
      console.error("ADMIN_SEED_PASSWORD must be at least 8 characters.");
      process.exit(1);
    }
    const passwordHash = await bcrypt.hash(password, 12);
    await User.findOneAndUpdate(
      { email },
      { name, email, passwordHash, role: "super_admin", active: true },
      { upsert: true, new: true, setDefaultsOnInsert: true }
    );
    console.log(`✓ Super-admin user upserted: ${email}`);
  }

  console.log("Seed complete.");
  process.exit(0);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
