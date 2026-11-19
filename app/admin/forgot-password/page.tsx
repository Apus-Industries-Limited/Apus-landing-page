"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Loader2 } from "lucide-react";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [done, setDone] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    setError(null);
    try {
      const res = await fetch("/api/admin/password-reset", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ email }) });
      const json = await res.json();
      if (!res.ok) { setError(json.error ?? "Something went wrong."); return; }
      setDone(true);
    } catch {
      setError("Network error. Please try again.");
    } finally { setBusy(false); }
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-mist px-4">
      <div className="w-full max-w-md rounded-2xl border border-line bg-white p-8 shadow-sm">
        <Image src="/logos/apus-logo-light.png" alt="Apus Industries Ltd" width={140} height={93} className="h-12 w-auto" />
        <h1 className="mt-5 font-display text-2xl font-bold">Reset your password</h1>
        {done ? (
          <div className="mt-6 space-y-4 text-sm leading-relaxed text-neutral-600">
            <p>If an account exists for that email, a reset link has been generated. It is valid for 1 hour.</p>
            <p className="rounded-xl bg-smoke p-4">
              Email sending is not configured in this deployment (no SMTP env). A Super Admin can reset any password from Admin → Users, or the reset token is logged on the server. See README, Password reset.
            </p>
            <Link href="/admin/login" className="inline-block font-semibold text-apus-deep">Back to sign in →</Link>
          </div>
        ) : (
          <form onSubmit={onSubmit} className="mt-6 space-y-5">
            <div>
              <label htmlFor="email" className="mb-1.5 block text-sm font-semibold">Account email</label>
              <input id="email" type="email" required value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@apusindustries.com" className="w-full rounded-xl border border-line px-4 py-3 text-sm" />
            </div>
            {error && <p role="alert" className="rounded-xl bg-red-50 px-4 py-3 text-sm text-red-700">{error}</p>}
            <button type="submit" disabled={busy} className="inline-flex w-full items-center justify-center gap-2 rounded-full bg-ink px-6 py-3 text-sm font-semibold text-white disabled:opacity-60">
              {busy && <Loader2 className="h-4 w-4 animate-spin" />} Send reset link
            </button>
            <p className="text-center text-sm"><Link href="/admin/login" className="font-semibold text-apus-deep">Back to sign in</Link></p>
          </form>
        )}
      </div>
    </main>
  );
}
