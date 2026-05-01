import { prisma } from "@/lib/db";
import { deleteEventForm, upsertEvent } from "@/app/admin/actions/cms";

export default async function AdminEventsPage() {
  const list = await prisma.event.findMany({ orderBy: { date: "desc" } });

  return (
    <div>
      <h1 className="text-2xl font-bold text-[#0A2A43]">Events</h1>
      <p className="mt-1 text-sm text-slate-600">Public events list and detail pages.</p>

      <div className="mt-8 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <h2 className="text-lg font-semibold text-[#0A2A43]">Add event</h2>
        <form action={upsertEvent} className="mt-4 space-y-3">
          <input type="hidden" name="id" value="" />
          <div>
            <label className="text-sm font-medium">Title</label>
            <input name="title" required className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2 text-sm" />
          </div>
          <div>
            <label className="text-sm font-medium">Excerpt</label>
            <textarea name="excerpt" required rows={2} className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2 text-sm" />
          </div>
          <div>
            <label className="text-sm font-medium">Description (HTML allowed)</label>
            <textarea name="description" required rows={6} className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2 text-sm font-mono text-xs" />
          </div>
          <div className="grid gap-3 sm:grid-cols-2">
            <div>
              <label className="text-sm font-medium">Category</label>
              <input name="category" defaultValue="General" className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2 text-sm" />
            </div>
            <div>
              <label className="text-sm font-medium">Date &amp; time</label>
              <input name="date" type="datetime-local" required className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2 text-sm" />
            </div>
          </div>
          <div className="flex flex-wrap gap-4">
            <label className="inline-flex items-center gap-2 text-sm">
              <input type="checkbox" name="highlighted" />
              Highlighted
            </label>
            <label className="inline-flex items-center gap-2 text-sm">
              <input type="checkbox" name="hidden" />
              Hidden
            </label>
          </div>
          <div>
            <label className="text-sm font-medium">Banner image</label>
            <input name="banner" type="file" accept="image/jpeg,image/png,image/webp" className="mt-1 block w-full text-sm" />
          </div>
          <div>
            <label className="text-sm font-medium">PDF (optional)</label>
            <input name="pdf" type="file" accept="application/pdf" className="mt-1 block w-full text-sm" />
          </div>
          <button type="submit" className="btn-primary">
            Create event
          </button>
        </form>
      </div>

      <div className="mt-10 overflow-x-auto rounded-2xl border border-slate-200 bg-white shadow-sm">
        <table className="min-w-full text-left text-sm">
          <thead className="border-b border-slate-200 bg-slate-50 text-xs uppercase text-slate-600">
            <tr>
              <th className="px-4 py-3">Title</th>
              <th className="px-4 py-3">Date</th>
              <th className="px-4 py-3">Slug</th>
              <th className="px-4 py-3" />
            </tr>
          </thead>
          <tbody>
            {list.map((e) => (
              <tr key={e.id} className="border-b border-slate-100">
                <td className="px-4 py-3 font-medium">{e.title}</td>
                <td className="px-4 py-3 text-slate-600">{new Date(e.date).toLocaleString()}</td>
                <td className="px-4 py-3 text-slate-500">{e.slug}</td>
                <td className="px-4 py-3 text-right">
                  <form action={deleteEventForm}>
                    <input type="hidden" name="id" value={e.id} />
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
