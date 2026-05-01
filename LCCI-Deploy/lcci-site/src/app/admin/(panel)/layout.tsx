import Link from "next/link";
import { requireAdmin } from "@/lib/require-admin";
import { AdminLogoutButton } from "@/components/admin/logout-button";

const nav = [
  { href: "/admin/dashboard", label: "Dashboard" },
  { href: "/admin/hero", label: "Hero" },
  { href: "/admin/activities", label: "Activities" },
  { href: "/admin/events", label: "Events" },
  { href: "/admin/services", label: "Services" },
  { href: "/admin/leadership", label: "Leadership" },
  { href: "/admin/memberships", label: "Memberships" },
  { href: "/admin/partners", label: "Partners" },
  { href: "/admin/about", label: "About CMS" },
  { href: "/admin/settings", label: "Settings & SEO" },
  { href: "/admin/logs", label: "Activity logs" },
];

export default async function AdminPanelLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  await requireAdmin();

  return (
    <div className="flex min-h-screen">
      <aside className="hidden w-56 shrink-0 flex-col border-r border-slate-200 bg-[#0A2A43] text-slate-100 lg:flex">
        <div className="border-b border-white/10 px-4 py-4 text-sm font-bold text-[#FFD166]">
          LCCI Admin
        </div>
        <nav className="flex flex-1 flex-col gap-0.5 overflow-y-auto p-2">
          {nav.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="rounded-lg px-3 py-2 text-sm hover:bg-white/10"
            >
              {item.label}
            </Link>
          ))}
        </nav>
        <div className="border-t border-white/10 p-3">
          <AdminLogoutButton />
        </div>
      </aside>
      <div className="min-h-screen flex-1 overflow-x-auto">
        <div className="border-b border-slate-200 bg-white px-4 py-3 lg:hidden">
          <p className="text-sm font-semibold text-[#0A2A43]">LCCI Admin</p>
          <div className="mt-2 flex gap-2 overflow-x-auto pb-1">
            {nav.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="whitespace-nowrap rounded-full bg-slate-100 px-3 py-1.5 text-xs font-medium text-slate-700"
              >
                {item.label}
              </Link>
            ))}
          </div>
          <AdminLogoutButton />
        </div>
        <div className="p-4 sm:p-6">{children}</div>
      </div>
    </div>
  );
}
