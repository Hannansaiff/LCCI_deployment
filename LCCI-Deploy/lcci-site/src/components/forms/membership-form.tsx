"use client";

import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import Script from "next/script";
import { submitMembershipApplication } from "@/app/actions/membership";

declare global {
  interface Window {
    grecaptcha?: {
      getResponse: () => string;
      reset: () => void;
    };
  }
}

export function MembershipForm() {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);
  const siteKey = process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY;

  function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    const form = e.currentTarget;
    const fd = new FormData(form);

    if (siteKey) {
      const token = window.grecaptcha?.getResponse?.() ?? "";
      fd.set("g-recaptcha-response", token);
      if (!token) {
        setError("Please complete the reCAPTCHA.");
        return;
      }
    }

    startTransition(async () => {
      const res = await submitMembershipApplication(fd);
      if (res.ok) {
        window.grecaptcha?.reset?.();
        router.push("/thank-you");
      } else {
        setError(res.error ?? "Submission failed.");
        window.grecaptcha?.reset?.();
      }
    });
  }

  return (
    <>
      {siteKey ? (
        <Script src="https://www.google.com/recaptcha/api.js" async defer />
      ) : null}
      <form onSubmit={onSubmit} className="space-y-4">
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="sm:col-span-2">
            <label className="text-sm font-medium text-slate-700">Business name</label>
            <input
              name="businessName"
              required
              className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-[#0B6E4F]"
            />
          </div>
          <div>
            <label className="text-sm font-medium text-slate-700">Owner name</label>
            <input
              name="ownerName"
              required
              className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-[#0B6E4F]"
            />
          </div>
          <div>
            <label className="text-sm font-medium text-slate-700">Business type</label>
            <input
              name="businessType"
              required
              className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-[#0B6E4F]"
            />
          </div>
          <div className="sm:col-span-2">
            <label className="text-sm font-medium text-slate-700">Address</label>
            <textarea
              name="address"
              required
              rows={3}
              className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-[#0B6E4F]"
            />
          </div>
          <div>
            <label className="text-sm font-medium text-slate-700">Registration no.</label>
            <input
              name="registrationNo"
              required
              className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-[#0B6E4F]"
            />
          </div>
          <div>
            <label className="text-sm font-medium text-slate-700">Contact no.</label>
            <input
              name="contactNo"
              required
              className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-[#0B6E4F]"
            />
          </div>
          <div className="sm:col-span-2">
            <label className="text-sm font-medium text-slate-700">Email</label>
            <input
              name="email"
              type="email"
              required
              className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-[#0B6E4F]"
            />
          </div>
          <div>
            <label className="text-sm font-medium text-slate-700">CNIC (upload)</label>
            <input
              name="cnic"
              type="file"
              accept="image/jpeg,image/png,image/webp,application/pdf"
              className="mt-1 block w-full text-sm"
            />
          </div>
          <div>
            <label className="text-sm font-medium text-slate-700">Business documents</label>
            <input
              name="businessDocs"
              type="file"
              accept="image/jpeg,image/png,image/webp,application/pdf"
              className="mt-1 block w-full text-sm"
            />
          </div>
        </div>

        {siteKey ? (
          <div className="g-recaptcha" data-sitekey={siteKey} />
        ) : (
          <p className="text-xs text-amber-800">
            reCAPTCHA keys not configured (development). Set NEXT_PUBLIC_RECAPTCHA_SITE_KEY and
            RECAPTCHA_SECRET_KEY in production.
          </p>
        )}

        {error ? <p className="text-sm text-red-600">{error}</p> : null}

        <button type="submit" disabled={pending} className="btn-primary">
          {pending ? "Submitting…" : "Submit application"}
        </button>
      </form>
    </>
  );
}
