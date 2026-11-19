import mongoose from "mongoose";

const MONGODB_URI = process.env.MONGODB_URI;

// Cached connection across hot reloads / serverless invocations.
type Cached = { conn: typeof mongoose | null; promise: Promise<typeof mongoose> | null };
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const globalWithMongoose = globalThis as any;
if (!globalWithMongoose.__mongooseCache) {
  globalWithMongoose.__mongooseCache = { conn: null, promise: null } as Cached;
}
const cached: Cached = globalWithMongoose.__mongooseCache;

/** Connect to MongoDB. Returns null (instead of throwing) when no URI is configured,
 * so `next build` and the public site still render with graceful fallbacks. */
export async function connectDB(): Promise<typeof mongoose | null> {
  if (cached.conn) return cached.conn;
  if (!MONGODB_URI) {
    if (process.env.NODE_ENV !== "production") {
      console.warn("[db] MONGODB_URI is not set. Running without a database (fallbacks active).");
    }
    return null;
  }
  if (!cached.promise) {
    cached.promise = mongoose.connect(MONGODB_URI, { bufferCommands: false });
  }
  try {
    cached.conn = await cached.promise;
  } catch (err) {
    cached.promise = null;
    console.error("[db] MongoDB connection failed:", err);
    return null;
  }
  return cached.conn;
}

export function isDbConfigured(): boolean {
  return Boolean(MONGODB_URI);
}
