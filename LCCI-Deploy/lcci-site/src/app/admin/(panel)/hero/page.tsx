import { prisma } from "@/lib/db";
import { updateHero } from "@/app/admin/actions/cms";

export default async function AdminHeroPage() {
  const hero = await prisma.heroSection.findUnique({ where: { id: "singleton" } });

  return (
    <div className="mx-auto max-w-2xl">
      <h1 className="text-2xl font-bold text-[#0A2A43]">Hero section</h1>
      <p className="mt-1 text-sm text-slate-600">Homepage banner content and buttons.</p>
      <form action={updateHero} className="mt-8 space-y-4 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <div>
          <label className="text-sm font-medium text-slate-700">Title</label>
          <input
            name="title"
            defaultValue={hero?.title}
            required
            className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2 text-sm"
          />
        </div>
        <div>
          <label className="text-sm font-medium text-slate-700">Subtitle</label>
          <textarea
            name="subtitle"
            defaultValue={hero?.subtitle}
            required
            rows={3}
            className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2 text-sm"
          />
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label className="text-sm font-medium text-slate-700">Button 1 text</label>
            <input
              name="btn1Text"
              defaultValue={hero?.btn1Text}
              className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2 text-sm"
            />
          </div>
          <div>
            <label className="text-sm font-medium text-slate-700">Button 2 text</label>
            <input
              name="btn2Text"
              defaultValue={hero?.btn2Text}
              className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2 text-sm"
            />
          </div>
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label className="text-sm font-medium text-slate-700">Learn more link</label>
            <input
              name="learnMoreHref"
              defaultValue={hero?.learnMoreHref}
              className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2 text-sm"
            />
          </div>
          <div>
            <label className="text-sm font-medium text-slate-700">Membership link</label>
            <input
              name="memberHref"
              defaultValue={hero?.memberHref}
              className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2 text-sm"
            />
          </div>
        </div>
        <div className="flex flex-wrap gap-6">
          <label className="inline-flex items-center gap-2 text-sm">
            <input type="checkbox" name="btn1Enabled" defaultChecked={hero?.btn1Enabled} />
            Enable button 1
          </label>
          <label className="inline-flex items-center gap-2 text-sm">
            <input type="checkbox" name="btn2Enabled" defaultChecked={hero?.btn2Enabled} />
            Enable button 2
          </label>
        </div>
        <div>
          <label className="text-sm font-medium text-slate-700">
            Replace hero image (JPG/PNG/WebP, max 8MB)
          </label>
          <input name="image" type="file" accept="image/jpeg,image/png,image/webp" className="mt-1 block w-full text-sm" />
          <p className="mt-1 text-xs text-slate-500">Current: {hero?.imageUrl}</p>
        </div>
        <button type="submit" className="btn-primary">
          Save hero
        </button>
      </form>
    </div>
  );
}
