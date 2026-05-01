import { prisma } from "@/lib/db";
import { deleteActivityForm, upsertActivity } from "@/app/admin/actions/cms";

export default async function AdminActivitiesPage() {
  const list = await prisma.activity.findMany({ orderBy: { date: "desc" } });

  return (
    <div>
      <h1 className="text-2xl font-bold text-[#0A2A43]">Daily activities</h1>
      <p className="mt-1 text-sm text-slate-600">Shown on the homepage (latest four) and detail pages.</p>

      <div className="mt-8 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <h2 className="text-lg font-semibold text-[#0A2A43]">Add activity</h2>
        <form action={upsertActivity} className="mt-4 grid gap-3 sm:grid-cols-2">
          <input type="hidden" name="id" value="" />
          <div className="sm:col-span-2">
            <label className="text-sm font-medium">Title</label>
            <input name="title" required className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2 text-sm" />
          </div>
          <div className="sm:col-span-2">
            <label className="text-sm font-medium">Description</label>
            <textarea name="description" required rows={4} className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2 text-sm" />
          </div>
          <div>
            <label className="text-sm font-medium">Date</label>
            <input name="date" type="datetime-local" required className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2 text-sm" />
          </div>
          <div className="flex items-end">
            <label className="inline-flex items-center gap-2 text-sm">
              <input type="checkbox" name="showOnHome" defaultChecked />
              Show on homepage
            </label>
          </div>
          <div className="sm:col-span-2">
            <label className="text-sm font-medium">Thumbnail</label>
            <input name="image" type="file" accept="image/jpeg,image/png,image/webp" className="mt-1 block w-full text-sm" />
          </div>
          <div className="sm:col-span-2">
            <button type="submit" className="btn-primary">
              Create
            </button>
          </div>
        </form>
      </div>

      <div className="mt-10 overflow-x-auto rounded-2xl border border-slate-200 bg-white shadow-sm">
        <table className="min-w-full text-left text-sm">
          <thead className="border-b border-slate-200 bg-slate-50 text-xs uppercase text-slate-600">
            <tr>
              <th className="px-4 py-3">Title</th>
              <th className="px-4 py-3">Date</th>
              <th className="px-4 py-3">Home</th>
              <th className="px-4 py-3" />
            </tr>
          </thead>
          <tbody>
            {list.map((a) => (
              <tr key={a.id} className="border-b border-slate-100">
                <td className="px-4 py-3 font-medium">{a.title}</td>
                <td className="px-4 py-3 text-slate-600">{new Date(a.date).toLocaleString()}</td>
                <td className="px-4 py-3">{a.showOnHome ? "Yes" : "No"}</td>
                <td className="px-4 py-3 text-right">
                  <form action={deleteActivityForm} className="inline">
                    <input type="hidden" name="id" value={a.id} />
                    <button type="submit" className="text-red-600 hover:underline">
                      Delete
                    </button>
                  </form>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
