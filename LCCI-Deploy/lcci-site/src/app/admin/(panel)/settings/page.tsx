import { prisma } from "@/lib/db";
import { updateSiteSettings } from "@/app/admin/actions/cms";

export default async function AdminSettingsPage() {
  const s = await prisma.siteSettings.findUnique({ where: { id: "singleton" } });

  return (
    <div className="mx-auto max-w-3xl">
      <h1 className="text-2xl font-bold text-[#0A2A43]">Site settings &amp; SEO</h1>
      <p className="mt-1 text-sm text-slate-600">Branding, contact, footer, and meta tags.</p>

      <form action={updateSiteSettings} className="mt-8 space-y-4 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <h2 className="text-lg font-semibold text-[#0A2A43]">Colours</h2>
        <div className="grid gap-3 sm:grid-cols-3">
          <div>
            <label className="text-sm font-medium">Primary</label>
            <input name="primaryColor" type="text" defaultValue={s?.primaryColor} className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2 text-sm" />
          </div>
          <div>
            <label className="text-sm font-medium">Secondary</label>
            <input name="secondaryColor" type="text" defaultValue={s?.secondaryColor} className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2 text-sm" />
          </div>
          <div>
            <label className="text-sm font-medium">Accent</label>
            <input name="accentColor" type="text" defaultValue={s?.accentColor} className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2 text-sm" />
          </div>
        </div>

        <h2 className="pt-4 text-lg font-semibold text-[#0A2A43]">Contact &amp; footer</h2>
        <div>
          <label className="text-sm font-medium">Phone (top bar)</label>
          <input name="topBarPhone" defaultValue={s?.topBarPhone} className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2 text-sm" />
        </div>
        <div>
          <label className="text-sm font-medium">Email</label>
          <input name="topBarEmail" type="email" defaultValue={s?.topBarEmail} className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2 text-sm" />
        </div>
        <div>
          <label className="text-sm font-medium">Address</label>
          <textarea name="address" defaultValue={s?.address} rows={3} className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2 text-sm" />
        </div>
        <div>
          <label className="text-sm font-medium">Google Maps embed URL</label>
          <input name="mapEmbedUrl" defaultValue={s?.mapEmbedUrl} className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2 text-sm" />
        </div>
        <div>
          <label className="text-sm font-medium">Footer copyright text</label>
          <input name="footerText" defaultValue={s?.footerText} className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2 text-sm" />
        </div>

        <h2 className="pt-4 text-lg font-semibold text-[#0A2A43]">SEO</h2>
        <div>
          <label className="text-sm font-medium">Meta title</label>
          <input name="metaTitle" defaultValue={s?.metaTitle} className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2 text-sm" />
        </div>
        <div>
          <label className="text-sm font-medium">Meta description</label>
          <textarea name="metaDescription" defaultValue={s?.metaDescription} rows={3} className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2 text-sm" />
        </div>
        <div>
          <label className="text-sm font-medium">Meta keywords</label>
          <input name="metaKeywords" defaultValue={s?.metaKeywords} className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2 text-sm" />
        </div>
        <div>
          <label className="text-sm font-medium">Replace logo (optional)</label>
          <input name="logo" type="file" accept="image/jpeg,image/png,image/webp" className="mt-1 block w-full text-sm" />
          <p className="mt-1 text-xs text-slate-500">Current: {s?.logoUrl || "—"}</p>
        </div>

        <button type="submit" className="btn-primary">
          Save settings
        </button>
      </form>
    </div>
  );
}
