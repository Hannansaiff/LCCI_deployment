import { prisma } from "@/lib/db";
import { deleteServiceForm, upsertService } from "@/app/admin/actions/cms";

export default async function AdminServicesPage() {
  const list = await prisma.service.findMany({ orderBy: { homeOrder: "asc" } });

  return (
    <div>
      <h1 className="text-2xl font-bold text-[#0A2A43]">Services</h1>
      <p className="mt-1 text-sm text-slate-600">Manage service catalogue and homepage cards.</p>

      <div className="mt-8 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <h2 className="text-lg font-semibold text-[#0A2A43]">Add service</h2>
        <form action={upsertService} className="mt-4 space-y-3">
          <input type="hidden" name="id" value="" />
          <div>
            <label className="text-sm font-medium">Title</label>
            <input name="title" required className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2 text-sm" />
          </div>
          <div>
            <label className="text-sm font-medium">Description</label>
            <textarea name="description" required rows={4} className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2 text-sm" />
          </div>
          <div className="grid gap-3 sm:grid-cols-2">
            <div>
              <label className="text-sm font-medium">Icon key</label>
              <select name="icon" className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2 text-sm">
                <option value="briefcase">briefcase</option>
                <option value="building">building</option>
                <option value="file-check">file-check</option>
                <option value="stamp">stamp</option>
                <option value="users">users</option>
                <option value="heart">heart</option>
              </select>
            </div>
            <div>
              <label className="text-sm font-medium">Home order</label>
              <input name="homeOrder" type="number" defaultValue={0} className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2 text-sm" />
            </div>
          </div>
          <div className="flex flex-wrap gap-4">
            <label className="inline-flex items-center gap-2 text-sm">
              <input type="checkbox" name="active" defaultChecked />
              Active
            </label>
            <label className="inline-flex items-center gap-2 text-sm">
              <input type="checkbox" name="showOnHome" />
              Show on homepage
            </label>
          </div>
          <button type="submit" className="btn-primary">
            Create service
          </button>
        </form>
      </div>

      <div className="mt-10 overflow-x-auto rounded-2xl border border-slate-200 bg-white shadow-sm">
        <table className="min-w-full text-left text-sm">
          <thead className="border-b border-slate-200 bg-slate-50 text-xs uppercase text-slate-600">
            <tr>
              <th className="px-4 py-3">Title</th>
              <th className="px-4 py-3">Slug</th>
              <th className="px-4 py-3">Home</th>
              <th className="px-4 py-3" />
            </tr>
          </thead>
          <tbody>
            {list.map((s) => (
              <tr key={s.id} className="border-b border-slate-100">
                <td className="px-4 py-3 font-medium">{s.title}</td>
                <td className="px-4 py-3 text-slate-500">{s.slug}</td>
                <td className="px-4 py-3">{s.showOnHome ? "Yes" : "No"}</td>
                <td className="px-4 py-3 text-right">
                  <form action={deleteServiceForm}>
                    <input type="hidden" name="id" value={s.id} />
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
