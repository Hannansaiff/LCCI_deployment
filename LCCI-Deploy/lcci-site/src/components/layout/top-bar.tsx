"use client";

import { Mail, Phone } from "lucide-react";
import { useLocale } from "@/components/providers/app-providers";

type Props = {
  phone?: string;
  email?: string;
  facebookUrl?: string;
  twitterUrl?: string;
  linkedinUrl?: string;
  youtubeUrl?: string;
};

export function TopBar({ phone = "", email = "", facebookUrl, twitterUrl, linkedinUrl, youtubeUrl }: Props) {
  const { lang, setLang, t } = useLocale();

  return (
    <div className="border-b border-slate-200/80 bg-white text-xs text-slate-700">
      <div className="mx-auto flex max-w-7xl flex-col gap-2 px-4 py-2 sm:px-6 md:flex-row md:items-center md:justify-between lg:px-8">
        <div className="flex flex-wrap items-center gap-3 md:gap-4">
          <a href={`tel:${phone?.replace(/\s/g, "") ?? ""}`} className="inline-flex min-w-0 items-center gap-1.5 hover:text-[#0B6E4F]">
            <Phone className="h-3.5 w-3.5" aria-hidden />
            <span className="truncate">{phone}</span>
          </a>
          <a href={`mailto:${email}`} className="inline-flex min-w-0 items-center gap-1.5 hover:text-[#0B6E4F]">
            <Mail className="h-3.5 w-3.5" aria-hidden />
            <span className="truncate">{email}</span>
          </a>
        </div>
        <div className="flex flex-wrap items-center gap-2 md:gap-3">
          <div className="flex items-center gap-1.5 md:gap-2">
            {facebookUrl ? (
              <a href={facebookUrl} target="_blank" rel="noopener noreferrer" className="rounded p-1 hover:bg-slate-100" aria-label="Facebook">
                <span className="sr-only">Facebook</span>
                <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24"><path d="M22 12a10 10 0 10-11.5 9.95v-7.05H8v-3h2.5V9.5A3.5 3.5 0 0114 6h3v3h-2.5c-.8 0-1 .4-1 1.2V12H17l-.5 3h-2.5v7.05A10 10 0 0022 12z"/></svg>
              </a>
            ) : null}
            {twitterUrl ? (
              <a href={twitterUrl} target="_blank" rel="noopener noreferrer" className="rounded p-1 hover:bg-slate-100" aria-label="X">
                <span className="sr-only">X</span>
                <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>
              </a>
            ) : null}
            {linkedinUrl ? (
              <a href={linkedinUrl} target="_blank" rel="noopener noreferrer" className="rounded p-1 hover:bg-slate-100" aria-label="LinkedIn">
                <span className="sr-only">LinkedIn</span>
                <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24"><path d="M4.98 3.5C4.98 4.88 3.86 6 2.5 6S0 4.88 0 3.5 1.12 1 2.5 1 4.98 2.12 4.98 3.5zM.5 8h4V23h-4V8zm7.5 0h3.8v2.1h.1c.5-1 1.8-2.1 3.7-2.1 4 0 4.7 2.6 4.7 6v9h-4v-8c0-1.9 0-4.3-2.6-4.3-2.6 0-3 2-3 4.1V23h-4V8z"/></svg>
              </a>
            ) : null}
            {youtubeUrl ? (
              <a href={youtubeUrl} target="_blank" rel="noopener noreferrer" className="rounded p-1 hover:bg-slate-100" aria-label="YouTube">
                <span className="sr-only">YouTube</span>
                <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24"><path d="M23.5 6.2a3 3 0 00-2.1-2.1C19.5 3.5 12 3.5 12 3.5s-7.5 0-9.4.6A3 3 0 00.5 6.2 31.7 12 31.7 12 0 000 12a31.7 31.7 0 00.5 5.8 3 3 0 002.1 2.1c1.9.6 9.4.6 9.4.6s7.5 0 9.4-.6a3 3 0 002.1-2.1 31.7 31.7 0 00.5-5.8 31.7 31.7 0 00-.5-5.8zM9.75 15.02v-6l6 3-6 3z"/></svg>
              </a>
            ) : null}
          </div>
          <div className="hidden h-4 w-px bg-slate-300 md:block" aria-hidden />
          <div className="flex rounded-md border border-slate-200 bg-slate-50 p-0.5">
            <button
              type="button"
              onClick={() => setLang("en")}
              className={`rounded px-2 py-0.5 text-[11px] font-semibold ${lang === "en" ? "bg-white text-[#0B6E4F] shadow-sm" : "text-slate-600"}`}
            >
              {t("English", "انگریزی")}
            </button>
            <button
              type="button"
              onClick={() => setLang("ur")}
              className={`rounded px-2 py-0.5 text-[11px] font-semibold ${lang === "ur" ? "bg-white text-[#0B6E4F] shadow-sm" : "text-slate-600"}`}
            >
              {t("Urdu", "اردو")}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
