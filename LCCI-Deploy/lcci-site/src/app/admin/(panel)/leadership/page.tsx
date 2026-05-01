import { prisma } from "@/lib/db";
import { deleteLeaderForm, upsertLeader } from "@/app/admin/actions/cms";

export default async function AdminLeadershipPage() {
  const list = await prisma.leadership.findMany({ orderBy: { sortOrder: "asc" } });

  return (
    <div>
      <h1 className="text-2xl font-bold text-[#0A2A43]">Leadership</h1>
      <p className="mt-1 text-sm text-slate-600">Profiles shown on the About page.</p>

      <div className="mt-8 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <h2 className="text-lg font-semibold text-[#0A2A43]">Add member</h2>
        <form action={upsertLeader} className="mt-4 space-y-3">
          <input type="hidden" name="id" value="" />
          <div className="grid gap-3 sm:grid-cols-2">
            <div>
              <label className="text-sm font-medium">Name</label>
              <input name="name" required className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2 text-sm" />
            </div>
            <div>
              <label className="text-sm font-medium">Role</label>
              <input name="role" required className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2 text-sm" />
            </div>
          </div>
          <div>
            <label className="text-sm font-medium">Bio</label>
            <textarea name="bio" required rows={4} className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2 text-sm" />
          </div>
          <div>
            <label className="text-sm font-medium">Sort order</label>
            <input name="sortOrder" type="number" defaultValue={0} className="mt-1 w-full max-w-xs rounded-xl border border-slate-200 px-3 py-2 text-sm" />
          </div>
          <div>
            <label className="text-sm font-medium">Photo</label>
            <input name="photo" type="file" accept="image/jpeg,image/png,image/webp" className="mt-1 block w-full text-sm" />
          </div>
          <button type="submit" className="btn-primary">
            Add
          </button>
        </form>
      </div>

      <div className="mt-10 overflow-x-auto rounded-2xl border border-slate-200 bg-white shadow-sm">
        <table className="min-w-full text-left text-sm">
          <thead className="border-b border-slate-200 bg-slate-50 text-xs uppercase text-slate-600">
            <tr>
              <th className="px-4 py-3">Name</th>
              <th className="px-4 py-3">Role</th>
              <th className="px-4 py-3" />
            </tr>
          </thead>
          <tbody>
            {list.map((l) => (
              <tr key={l.id} className="border-b border-slate-100">
                <td className="px-4 py-3 font-medium">{l.name}</td>
                <td className="px-4 py-3">{l.role}</td>
                <td className="px-4 py-3 text-right">
                  <form action={deleteLeaderForm}>
                    <input type="hidden" name="id" value={l.id} />
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
