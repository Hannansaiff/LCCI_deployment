"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { X } from "lucide-react";
import { useLocale } from "@/components/providers/app-providers";

type Props = { open: boolean; onClose: () => void };

export function SearchModal({ open, onClose }: Props) {
  const [q, setQ] = useState("");
  const router = useRouter();
  const { t } = useLocale();

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  if (!open) return null;

  function submit(e: React.FormEvent) {
    e.preventDefault();
    const query = q.trim();
    if (!query) return;
    router.push(`/search?q=${encodeURIComponent(query)}`);
    setQ("");
    onClose();
  }

  return (
    <div className="fixed inset-0 z-[100] flex items-start justify-center bg-black/40 p-4 pt-[15vh]">
      <div
        role="dialog"
        aria-modal
        className="w-full max-w-xl rounded-2xl bg-white p-6 shadow-xl animate-fade-up"
      >
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-lg font-semibold text-[#0A2A43]">
            {t("Search the site", "سائٹ تلاش کریں")}
          </h2>
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg p-2 text-slate-500 hover:bg-slate-100"
            aria-label="Close"
          >
            <X className="h-5 w-5" />
          </button>
        </div>
        <form onSubmit={submit} className="flex gap-2">
          <input
            autoFocus
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder={t("Type keywords…", "کلیدی الفاظ…")}
            className="flex-1 rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none ring-[#0B6E4F] focus:ring-2"
          />
          <button type="submit" className="btn-primary shrink-0">
            {t("Search", "تلاش")}
          </button>
        </form>
      </div>
    </div>
  );
}
