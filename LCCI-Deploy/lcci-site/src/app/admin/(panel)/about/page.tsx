import { prisma } from "@/lib/db";
import { updateAboutContent } from "@/app/admin/actions/cms";

export default async function AdminAboutPage() {
  const about = await prisma.aboutContent.findUnique({ where: { id: "singleton" } });

  return (
    <div className="mx-auto max-w-3xl">
      <h1 className="text-2xl font-bold text-[#0A2A43]">About page content</h1>
      <p className="mt-1 text-sm text-slate-600">Mission, vision, and history sections.</p>

      <form action={updateAboutContent} className="mt-8 space-y-4 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <div>
          <label className="text-sm font-medium text-slate-700">Mission</label>
          <textarea
            name="mission"
            defaultValue={about?.mission}
            required
            rows={4}
            className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2 text-sm"
          />
        </div>
        <div>
          <label className="text-sm font-medium text-slate-700">Vision</label>
          <textarea
            name="vision"
            defaultValue={about?.vision}
            required
            rows={4}
            className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2 text-sm"
          />
        </div>
        <div>
          <label className="text-sm font-medium text-slate-700">History</label>
          <textarea
            name="history"
            defaultValue={about?.history}
            required
            rows={8}
            className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2 text-sm"
          />
        </div>
        <button type="submit" className="btn-primary">
          Save
        </button>
      </form>
    </div>
  );
}
