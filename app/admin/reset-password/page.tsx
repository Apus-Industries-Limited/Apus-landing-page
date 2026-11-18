"use client";

import { useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { Loader2 } from "lucide-react";

function ResetForm() {
  const searchParams = useSearchParams();
  const token = searchParams.get("token") ?? "";
  const [password, setPassword] = useState("");
  const [done, setDone] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    setError(null);
    const res = await fetch("/api/admin/password-reset", { method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ token, password }) });
    const json = await res.json();
    setBusy(false);
    if (!res.ok) { setError(json.error ?? "Reset failed."); return; }
    setDone(true);
  }

  if (!token) return <p className="text-sm text-red-700">This reset link is missing its token. Request a new one from the forgot-password page.</p>;
  if (done) return <p className="text-sm">Password updated. <Link href="/admin/login" className="font-semibold text-apus-deep">Sign in →</Link></p>;

  return (
    <form onSubmit={onSubmit} className="space-y-5">
      <div>
        <label htmlFor="password" className="mb-1.5 block text-sm font-semibold">New password</label>
        <input id="password" type="password" required minLength={8} value={password} onChange={(e) => setPassword(e.target.value)} placeholder="At least 8 characters" className="w-full rounded-xl border border-line px-4 py-3 text-sm" />
      </div>
      {error && <p role="alert" className="rounded-xl bg-red-50 px-4 py-3 text-sm text-red-700">{error}</p>}
      <button type="submit" disabled={busy} className="inline-flex w-full items-center justify-center gap-2 rounded-full bg-ink px-6 py-3 text-sm font-semibold text-white disabled:opacity-60">
        {busy && <Loader2 className="h-4 w-4 animate-spin" />} Set new password
      </button>
    </form>
  );
}

export default function ResetPasswordPage() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-mist px-4">
      <div className="w-full max-w-md rounded-2xl border border-line bg-white p-8 shadow-sm">
        <h1 className="font-display text-2xl font-bold">Set a new password</h1>
        <div className="mt-6">
          <Suspense fallback={<p className="text-sm text-neutral-500">Loading…</p>}>
            <ResetForm />
          </Suspense>
        </div>
      </div>
    </main>
  );
}
