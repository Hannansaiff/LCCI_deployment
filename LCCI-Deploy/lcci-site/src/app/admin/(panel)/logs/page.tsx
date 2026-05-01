import { prisma } from "@/lib/db";

export default async function AdminLogsPage() {
  const logs = await prisma.activityLog.findMany({
    orderBy: { createdAt: "desc" },
    take: 200,
  });

  return (
    <div>
      <h1 className="text-2xl font-bold text-[#0A2A43]">Activity log</h1>
      <p className="mt-1 text-sm text-slate-600">Recent admin actions (last 200 entries).</p>

      <div className="mt-8 overflow-x-auto rounded-2xl border border-slate-200 bg-white shadow-sm">
        <table className="min-w-full text-left text-sm">
          <thead className="border-b border-slate-200 bg-slate-50 text-xs uppercase text-slate-600">
            <tr>
              <th className="px-4 py-3">Time</th>
              <th className="px-4 py-3">Action</th>
              <th className="px-4 py-3">Entity</th>
              <th className="px-4 py-3">Details</th>
            </tr>
          </thead>
          <tbody>
            {logs.map((l) => (
              <tr key={l.id} className="border-b border-slate-100">
                <td className="px-4 py-3 whitespace-nowrap text-slate-600">
                  {new Date(l.createdAt).toLocaleString()}
                </td>
                <td className="px-4 py-3">{l.action}</td>
                <td className="px-4 py-3">{l.entity}</td>
                <td className="px-4 py-3 text-slate-600">{l.details}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
