import { prisma } from "@/lib/db";

export default async function AdminDashboardPage() {
  const [members, pending, events, activities] = await Promise.all([
    prisma.membershipApplication.count({ where: { status: "approved" } }),
    prisma.membershipApplication.count({ where: { status: "pending" } }),
    prisma.event.count(),
    prisma.activity.count(),
  ]);

  const cards = [
    { label: "Approved members", value: members, color: "bg-[#0B6E4F]/10 text-[#0B6E4F]" },
    { label: "Pending memberships", value: pending, color: "bg-amber-100 text-amber-900" },
    { label: "Total events", value: events, color: "bg-blue-100 text-blue-900" },
    { label: "Total activities", value: activities, color: "bg-violet-100 text-violet-900" },
  ];

  return (
    <div>
      <h1 className="text-2xl font-bold text-[#0A2A43]">Dashboard</h1>
      <p className="mt-1 text-sm text-slate-600">Overview of chamber content and applications.</p>
      <div className="mt-8 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {cards.map((c) => (
          <div
            key={c.label}
            className={`rounded-2xl border border-slate-200 bg-white p-6 shadow-sm ${c.color}`}
          >
            <p className="text-sm font-medium opacity-90">{c.label}</p>
            <p className="mt-2 text-3xl font-bold tabular-nums">{c.value}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
