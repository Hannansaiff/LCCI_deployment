"use client";

import Image from "next/image";
import { useState } from "react";
import { X } from "lucide-react";

export type Leader = {
  id: string;
  name: string;
  role: string;
  photoUrl: string;
  bio: string;
};

export function LeadershipGrid({ leaders }: { leaders: Leader[] }) {
  const [open, setOpen] = useState<Leader | null>(null);

  return (
    <>
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {leaders.map((l) => (
          <button
            key={l.id}
            type="button"
            onClick={() => setOpen(l)}
            className="card-surface text-left transition hover:border-[#0B6E4F]/40"
          >
            <div className="relative mx-auto h-40 w-40 overflow-hidden rounded-full bg-slate-100">
              {l.photoUrl ? (
                l.photoUrl.startsWith("http") ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={l.photoUrl} alt="" className="h-full w-full object-cover" />
                ) : (
                  <Image src={l.photoUrl} alt="" fill className="object-cover" sizes="160px" />
                )
              ) : (
                <div className="flex h-full items-center justify-center text-slate-400">Photo</div>
              )}
            </div>
            <h3 className="mt-4 text-center text-lg font-semibold text-[#0A2A43]">{l.name}</h3>
            <p className="text-center text-sm font-medium text-[#0B6E4F]">{l.role}</p>
            <p className="mt-3 line-clamp-3 text-center text-sm text-slate-600">{l.bio}</p>
            <p className="mt-2 text-center text-xs font-semibold text-[#0A2A43]">View profile</p>
          </button>
        ))}
      </div>

      {open ? (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 p-4">
          <div
            role="dialog"
            aria-modal
            className="relative max-h-[90vh] w-full max-w-lg overflow-y-auto rounded-2xl bg-white p-6 shadow-xl"
          >
            <button
              type="button"
              onClick={() => setOpen(null)}
              className="absolute right-4 top-4 rounded-lg p-2 text-slate-500 hover:bg-slate-100"
              aria-label="Close"
            >
              <X className="h-5 w-5" />
            </button>
            <div className="relative mx-auto mt-2 h-44 w-44 overflow-hidden rounded-full bg-slate-100">
              {open.photoUrl ? (
                open.photoUrl.startsWith("http") ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={open.photoUrl} alt="" className="h-full w-full object-cover" />
                ) : (
                  <Image src={open.photoUrl} alt="" fill className="object-cover" sizes="176px" />
                )
              ) : null}
            </div>
            <h3 className="mt-4 text-center text-xl font-bold text-[#0A2A43]">{open.name}</h3>
            <p className="text-center text-sm font-medium text-[#0B6E4F]">{open.role}</p>
            <div className="prose prose-sm mt-4 max-w-none text-slate-700">
              <p className="whitespace-pre-wrap">{open.bio}</p>
            </div>
          </div>
        </div>
      ) : null}
    </>
  );
}
