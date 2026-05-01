"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { Logo } from "@/components/layout/logo";
import { SearchModal } from "@/components/search-modal";
import { Menu, Search, X } from "lucide-react";
import { useLocale } from "@/components/providers/app-providers";

const nav = (t: (e: string, u?: string) => string) => [
  { href: "/", label: t("Home", "ہوم") },
  { href: "/about", label: t("About", "تعارف") },
  { href: "/services", label: t("Services", "خدمات") },
  { href: "/events", label: t("Events", "تقریبات") },
  { href: "/contact", label: t("Membership / Contact", "رکنیت / رابطہ") },
];

export function SiteHeader() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const { t } = useLocale();

  return (
    <>
      <header className="sticky top-0 z-40 border-b border-slate-200/80 bg-white/95 backdrop-blur">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-3 sm:px-6 lg:px-8">
          <Logo />
          <nav className="hidden items-center gap-1 lg:flex">
            {nav(t).map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={`rounded-lg px-3 py-2 text-sm font-medium transition ${
                  pathname === item.href
                    ? "bg-[#0B6E4F]/10 text-[#0B6E4F]"
                    : "text-slate-700 hover:bg-slate-100"
                }`}
              >
                {item.label}
              </Link>
            ))}
            <button
              type="button"
              onClick={() => setSearchOpen(true)}
              className="ml-1 inline-flex items-center gap-1 rounded-lg px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-100"
              aria-label={t("Search", "تلاش")}
            >
              <Search className="h-4 w-4" />
            </button>
            <Link
              href="/admin/login"
              className="ml-2 rounded-lg px-2 py-1.5 text-[11px] font-medium text-slate-400 hover:text-slate-600"
            >
              {t("Login", "لاگ ان")}
            </Link>
          </nav>
          <div className="flex items-center gap-2 lg:hidden">
            <button
              type="button"
              onClick={() => setSearchOpen(true)}
              className="rounded-lg p-2 text-slate-700 hover:bg-slate-100"
              aria-label={t("Search", "تلاش")}
            >
              <Search className="h-5 w-5" />
            </button>
            <button
              type="button"
              onClick={() => setOpen((v) => !v)}
              className="rounded-lg p-2 text-slate-700 hover:bg-slate-100"
              aria-expanded={open}
              aria-label="Menu"
            >
              {open ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>
        {open ? (
          <div className="border-t border-slate-200 bg-white px-4 py-4 lg:hidden">
            <div className="flex flex-col gap-1">
              {nav(t).map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setOpen(false)}
                  className={`rounded-lg px-3 py-2.5 text-sm font-medium ${
                    pathname === item.href ? "bg-[#0B6E4F]/10 text-[#0B6E4F]" : "text-slate-800"
                  }`}
                >
                  {item.label}
                </Link>
              ))}
              <Link
                href="/admin/login"
                onClick={() => setOpen(false)}
                className="rounded-lg px-3 py-2.5 text-sm text-slate-500"
              >
                {t("Admin login", "ایڈمن لاگ ان")}
              </Link>
            </div>
          </div>
        ) : null}
      </header>
      <SearchModal open={searchOpen} onClose={() => setSearchOpen(false)} />
    </>
  );
}
