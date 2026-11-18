import crypto from "crypto";
import { connectDB } from "@/lib/db";
import { User } from "@/models/User";
import { ok, fail, parseJson } from "@/lib/api-helpers";
import { z } from "zod";
import { rateLimit, clientIp } from "@/lib/rate-limit";

const requestSchema = z.object({ email: z.string().email() });
const resetSchema = z.object({ token: z.string().min(10), password: z.string().min(8).max(128) });

/** Request a reset. The token is stored hashed with a 1-hour expiry.
 *  Without SMTP configured, the token is logged server-side (see README) —
 *  it is NEVER returned in the response. */
export async function POST(req: Request) {
  if (!rateLimit(`reset:${clientIp(req)}`, 5, 60 * 60 * 1000)) {
    return fail("Too many requests. Please try again later.", 429);
  }
  const body = await parseJson<unknown>(req);
  const parsed = requestSchema.safeParse(body);
  if (!parsed.success) return fail("Enter a valid email address.", 422);
  const db = await connectDB();
  if (!db) return fail("Database is not configured.", 503);
  const user = await User.findOne({ email: parsed.data.email.toLowerCase(), active: true });
  // Always return success so the endpoint does not reveal whether an account exists.
  if (user) {
    const token = crypto.randomBytes(32).toString("hex");
    const tokenHash = crypto.createHash("sha256").update(token).digest("hex");
    await User.updateOne({ _id: user._id }, { resetTokenHash: tokenHash, resetTokenExpires: new Date(Date.now() + 60 * 60 * 1000) });
    console.warn(`[password-reset] user=${user.email} token=${token} (valid 1h; wire SMTP to email this link: /admin/reset-password?token=${token})`);
  }
  return ok({ message: "If an account exists for that email, a reset link has been generated." });
}

/** Complete a reset with the token. */
export async function PUT(req: Request) {
  const body = await parseJson<unknown>(req);
  const parsed = resetSchema.safeParse(body);
  if (!parsed.success) return fail("Invalid reset request.", 422);
  const db = await connectDB();
  if (!db) return fail("Database is not configured.", 503);
  const bcrypt = (await import("bcryptjs")).default;
  const tokenHash = crypto.createHash("sha256").update(parsed.data.token).digest("hex");
  const user = await User.findOne({ resetTokenHash: tokenHash, resetTokenExpires: { $gt: new Date() } }).select("+resetTokenHash");
  if (!user) return fail("This reset link is invalid or has expired.", 400);
  const passwordHash = await bcrypt.hash(parsed.data.password, 12);
  await User.updateOne({ _id: user._id }, { passwordHash, resetTokenHash: null, resetTokenExpires: null });
  return ok({ message: "Password updated. You can now sign in." });
}
