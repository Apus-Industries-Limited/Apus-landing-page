import { NextResponse } from "next/server";
import { auth, type Role } from "@/lib/auth";

export function ok<T>(data: T, status = 200) {
  return NextResponse.json({ ok: true, data }, { status });
}

export function fail(error: string, status = 400, details?: unknown) {
  return NextResponse.json({ ok: false, error, ...(details ? { details } : {}) }, { status });
}

/** Serialize a Mongoose doc / lean object to plain JSON (ObjectId → string). */
export function serialize<T>(doc: T): T {
  return JSON.parse(JSON.stringify(doc)) as T;
}

export type SessionUser = { id: string; name?: string | null; email?: string | null; role: Role };

export async function requireAdmin(allowed: Role[] = ["super_admin", "admin", "content_manager"]): Promise<{ user: SessionUser } | { error: ReturnType<typeof fail> }> {
  const session = await auth();
  const user = session?.user as SessionUser | undefined;
  if (!user?.id) return { error: fail("Unauthorized", 401) };
  if (!allowed.includes(user.role)) return { error: fail("Forbidden — your role cannot perform this action.", 403) };
  return { user };
}

export async function parseJson<T>(req: Request): Promise<T | null> {
  try {
    return (await req.json()) as T;
  } catch {
    return null;
  }
}
