"use client";

import { createContext, useContext, useState, type ReactNode, useCallback } from "react";
import { CheckCircle2, AlertTriangle, X } from "lucide-react";

type Toast = { id: number; kind: "success" | "error"; message: string };
const ToastCtx = createContext<(kind: "success" | "error", message: string) => void>(() => {});

export function useToast() {
  return useContext(ToastCtx);
}

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);
  const push = useCallback((kind: "success" | "error", message: string) => {
    const id = Date.now() + Math.random();
    setToasts((t) => [...t, { id, kind, message }]);
    setTimeout(() => setToasts((t) => t.filter((x) => x.id !== id)), 4500);
  }, []);
  return (
    <ToastCtx.Provider value={push}>
      {children}
      <div className="fixed bottom-4 right-4 z-50 space-y-2">
        {toasts.map((t) => (
          <div key={t.id} className="flex items-center gap-2 rounded-xl bg-ink px-4 py-3 text-sm text-white shadow-lg">
            {t.kind === "success" ? <CheckCircle2 className="h-4 w-4 text-apus" /> : <AlertTriangle className="h-4 w-4 text-red-400" />}
            <span>{t.message}</span>
            <button onClick={() => setToasts((x) => x.filter((y) => y.id !== t.id))} aria-label="Dismiss"><X className="h-4 w-4" /></button>
          </div>
        ))}
      </div>
    </ToastCtx.Provider>
  );
}

export function EmptyState({ title, text, action }: { title: string; text: string; action?: ReactNode }) {
  return (
    <div className="rounded-2xl border border-dashed border-line bg-white p-10 text-center">
      <p className="font-display text-lg font-bold">{title}</p>
      <p className="mx-auto mt-2 max-w-md text-sm text-neutral-600">{text}</p>
      {action && <div className="mt-5">{action}</div>}
    </div>
  );
}

export function StatusBadge({ value }: { value: string }) {
  const map: Record<string, string> = {
    published: "bg-emerald-100 text-emerald-800",
    draft: "bg-amber-100 text-amber-800",
    approved: "bg-emerald-100 text-emerald-800",
    pending: "bg-amber-100 text-amber-800",
    rejected: "bg-red-100 text-red-800",
    new: "bg-apus-pale text-apus-deep",
    contacted: "bg-blue-100 text-blue-800",
    in_discussion: "bg-violet-100 text-violet-800",
    proposal_sent: "bg-amber-100 text-amber-800",
    converted: "bg-emerald-100 text-emerald-800",
    closed: "bg-neutral-200 text-neutral-700",
  };
  return (
    <span className={`inline-block rounded-full px-2.5 py-1 text-xs font-semibold ${map[value] ?? "bg-neutral-100 text-neutral-700"}`}>
      {value.replace(/_/g, " ")}
    </span>
  );
}

/** Delete button with an inline confirm step (no window.alert / window.confirm). */
export function DeleteButton({ label = "Delete", onDelete }: { label?: string; onDelete: () => Promise<void> }) {
  const [confirming, setConfirming] = useState(false);
  const [busy, setBusy] = useState(false);
  const toast = useToast();
  if (!confirming) {
    return <button onClick={() => setConfirming(true)} className="rounded-lg border border-red-200 px-3 py-1.5 text-xs font-semibold text-red-600 hover:bg-red-50">{label}</button>;
  }
  return (
    <span className="inline-flex items-center gap-2">
      <span className="text-xs text-neutral-500">Are you sure?</span>
      <button
        disabled={busy}
        onClick={async () => { setBusy(true); try { await onDelete(); } catch { toast("error", "Delete failed."); } finally { setBusy(false); setConfirming(false); } }}
        className="rounded-lg bg-red-600 px-3 py-1.5 text-xs font-semibold text-white disabled:opacity-60"
      >
        Yes, delete
      </button>
      <button onClick={() => setConfirming(false)} className="rounded-lg border border-line px-3 py-1.5 text-xs font-semibold">Cancel</button>
    </span>
  );
}
