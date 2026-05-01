"use client";

import { useState, useTransition } from "react";
import { submitServiceRequest } from "@/app/actions/service-request";

export function ServiceRequestForm({
  serviceId,
  serviceTitle,
}: {
  serviceId: string;
  serviceTitle: string;
}) {
  const [pending, startTransition] = useTransition();
  const [msg, setMsg] = useState<string | null>(null);

  function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setMsg(null);
    const fd = new FormData(e.currentTarget);
    fd.set("serviceId", serviceId);
    startTransition(async () => {
      const res = await submitServiceRequest(fd);
      if (res.ok) {
        setMsg("Your request was submitted successfully.");
        e.currentTarget.reset();
      } else {
        setMsg(res.error ?? "Something went wrong.");
      }
    });
  }

  return (
    <form onSubmit={onSubmit} className="space-y-4">
      <input type="hidden" name="serviceId" value={serviceId} />
      <p className="text-sm text-slate-500">
        Requesting: <strong>{serviceTitle}</strong>
      </p>
      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label className="text-sm font-medium text-slate-700">Full name</label>
          <input
            name="name"
            required
            className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-[#0B6E4F]"
          />
        </div>
        <div>
          <label className="text-sm font-medium text-slate-700">Email</label>
          <input
            name="email"
            type="email"
            required
            className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-[#0B6E4F]"
          />
        </div>
        <div>
          <label className="text-sm font-medium text-slate-700">Phone</label>
          <input
            name="phone"
            required
            className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-[#0B6E4F]"
          />
        </div>
        <div className="sm:col-span-2">
          <label className="text-sm font-medium text-slate-700">Message</label>
          <textarea
            name="message"
            required
            rows={4}
            className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-[#0B6E4F]"
          />
        </div>
        <div className="sm:col-span-2">
          <label className="text-sm font-medium text-slate-700">
            Attachment (optional, PDF/JPG/PNG/WebP, max 4MB)
          </label>
          <input
            name="attachment"
            type="file"
            accept=".pdf,image/jpeg,image/png,image/webp"
            className="mt-1 block w-full text-sm"
          />
        </div>
      </div>
      {msg ? (
        <p className={`text-sm ${msg.includes("success") ? "text-green-700" : "text-red-600"}`}>{msg}</p>
      ) : null}
      <button type="submit" disabled={pending} className="btn-primary">
        {pending ? "Submitting…" : "Submit request"}
      </button>
    </form>
  );
}
