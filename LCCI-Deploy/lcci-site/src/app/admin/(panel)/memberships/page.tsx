import Link from "next/link";
import { prisma } from "@/lib/db";
import { setMembershipStatusForm } from "@/app/admin/actions/cms";

export default async function AdminMembershipsPage() {
  const list = await prisma.membershipApplication.findMany({ orderBy: { createdAt: "desc" } });

  return (
    <div>
      <h1 className="text-2xl font-bold text-[#0A2A43]">Membership applications</h1>
      <p className="mt-1 text-sm text-slate-600">Review submissions and update status.</p>

      <div className="mt-8 overflow-x-auto rounded-2xl border border-slate-200 bg-white shadow-sm">
        <table className="min-w-full text-left text-sm">
          <thead className="border-b border-slate-200 bg-slate-50 text-xs uppercase text-slate-600">
            <tr>
              <th className="px-4 py-3">Business</th>
              <th className="px-4 py-3">Owner</th>
              <th className="px-4 py-3">Email</th>
              <th className="px-4 py-3">Status</th>
              <th className="px-4 py-3">Files</th>
              <th className="px-4 py-3">Actions</th>
            </tr>
          </thead>
          <tbody>
            {list.map((m) => (
              <tr key={m.id} className="border-b border-slate-100 align-top">
                <td className="px-4 py-3 font-medium">{m.businessName}</td>
                <td className="px-4 py-3">{m.ownerName}</td>
                <td className="px-4 py-3">{m.email}</td>
                <td className="px-4 py-3 capitalize">{m.status}</td>
                <td className="px-4 py-3">
                  <div className="flex flex-col gap-1 text-xs">
                    {m.cnicPath ? (
                      <Link href={m.cnicPath} target="_blank" className="text-[#0B6E4F] hover:underline">
                        CNIC
                      </Link>
                    ) : null}
                    {m.businessDocsPath ? (
                      <Link href={m.businessDocsPath} target="_blank" className="text-[#0B6E4F] hover:underline">
                        Docs
                      </Link>
                    ) : null}
                  </div>
                </td>
                <td className="px-4 py-3">
                  <div className="flex flex-col gap-2">
                    <form action={setMembershipStatusForm}>
                      <input type="hidden" name="id" value={m.id} />
                      <input type="hidden" name="status" value="approved" />
                      <button type="submit" className="text-xs font-semibold text-green-700 hover:underline">
                        Approve
                      </button>
                    </form>
                    <form action={setMembershipStatusForm}>
                      <input type="hidden" name="id" value={m.id} />
                      <input type="hidden" name="status" value="rejected" />
                      <button type="submit" className="text-xs font-semibold text-red-600 hover:underline">
                        Reject
                      </button>
                    </form>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
