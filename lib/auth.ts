import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import { connectDB } from "@/lib/db";
import { User } from "@/models/User";
import { loginSchema } from "@/lib/validation";

export type Role = "super_admin" | "admin" | "content_manager";

export const authConfig = {
  providers: [
    Credentials({
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        const parsed = loginSchema.safeParse(credentials);
        if (!parsed.success) return null;
        const db = await connectDB();
        if (!db) return null;
        const user = (await User.findOne({ email: parsed.data.email.toLowerCase(), active: true })
          .select("+passwordHash")
          .lean()) as { _id: unknown; name: string; email: string; role: string; passwordHash: string } | null;
        if (!user) return null;
        const ok = await bcrypt.compare(parsed.data.password, user.passwordHash);
        if (!ok) return null;
        await User.updateOne({ _id: user._id }, { lastLoginAt: new Date() });
        return {
          id: String(user._id),
          name: user.name,
          email: user.email,
          role: user.role as Role,
        };
      },
    }),
  ],
  session: { strategy: "jwt" as const, maxAge: 8 * 60 * 60 },
  pages: { signIn: "/admin/login" },
  callbacks: {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    async jwt({ token, user }: any) {
      if (user) {
        token.role = (user as { role?: Role }).role ?? "content_manager";
        token.id = user.id;
      }
      return token;
    },
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    async session({ session, token }: any) {
      if (session.user) {
        (session.user as { id?: string; role?: Role }).id = token.id as string;
        (session.user as { id?: string; role?: Role }).role = token.role as Role;
      }
      return session;
    },
  },
  secret: process.env.NEXTAUTH_SECRET,
};

export const { handlers, auth, signIn, signOut } = NextAuth(authConfig);

export function canManageContent(role?: Role | string | null): boolean {
  return role === "super_admin" || role === "admin" || role === "content_manager";
}
export function canManageBusiness(role?: Role | string | null): boolean {
  return role === "super_admin" || role === "admin";
}
export function isSuperAdmin(role?: Role | string | null): boolean {
  return role === "super_admin";
}
