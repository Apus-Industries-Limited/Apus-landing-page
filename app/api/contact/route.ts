import { connectDB } from "@/lib/db";
import { Inquiry } from "@/models/Crm";
import { inquirySchema } from "@/lib/validation";
import { generateReferenceNumber } from "@/lib/utils";
import { ok, fail, parseJson } from "@/lib/api-helpers";
import { rateLimit, clientIp } from "@/lib/rate-limit";

export async function POST(req: Request) {
  // Defence in depth: middleware also rate-limits this route.
  if (!rateLimit(`contact:${clientIp(req)}`, 5, 10 * 60 * 1000)) {
    return fail("Too many requests. Please try again later.", 429);
  }
  const body = await parseJson<unknown>(req);
  if (!body) return fail("Invalid JSON body.", 400);
  const parsed = inquirySchema.safeParse(body);
  if (!parsed.success) {
    return fail("Please check the form and try again.", 422, parsed.error.issues);
  }
  const db = await connectDB();
  if (!db) {
    return fail("The enquiry service is temporarily unavailable. Please email us directly.", 503);
  }
  try {
    const count = await Inquiry.countDocuments();
    const reference = generateReferenceNumber(count + 1);
    const inquiry = await Inquiry.create({ ...parsed.data, reference });
    // Email notification is optional: if SMTP is configured, it can be wired here.
    // Without SMTP env, the enquiry is stored and visible in the CRM — nothing is lost.
    return ok({ reference, id: String(inquiry._id) }, 201);
  } catch (err) {
    console.error("[api/contact]", err);
    return fail("Could not save your enquiry. Please try again.", 500);
  }
}
