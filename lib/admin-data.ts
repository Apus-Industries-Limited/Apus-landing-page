import { connectDB } from "@/lib/db";
import { serialize } from "@/lib/api-helpers";

/** Server-side list fetchers for admin pages (direct DB access, no HTTP round-trip). */
export async function adminList<T>(fetcher: () => Promise<T[]>): Promise<T[]> {
  const db = await connectDB();
  if (!db) return [];
  try {
    return serialize(await fetcher());
  } catch {
    return [];
  }
}
