import { MembershipForm } from "@/components/forms/membership-form";

export const metadata = { title: "Contact & Membership" };

export default async function ContactPage() {
  const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";
  const sRes = await fetch(`${apiUrl}/api/settings`).catch(() => null);
  const s = sRes?.ok ? await sRes.json() : {};

  return (
    <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
      <header className="max-w-3xl">
        <h1 className="text-4xl font-bold text-[#0A2A43]">Contact &amp; membership</h1>
        <p className="mt-3 text-lg text-slate-600">
          Reach the chamber office or submit a membership application online.
        </p>
      </header>

      <div className="mt-12 grid gap-10 lg:grid-cols-2">
        <section className="rounded-2xl border border-slate-200 bg-white p-8 shadow-sm">
          <h2 className="text-xl font-semibold text-[#0A2A43]">Office</h2>
          <p className="mt-3 text-slate-700 leading-relaxed">{s?.address}</p>
          <p className="mt-4 text-slate-800">
            <span className="font-medium">Phone:</span>{" "}
            <a className="text-[#0B6E4F]" href={`tel:${(s?.topBarPhone ?? "").replace(/\s/g, "")}`}>
              {s?.topBarPhone}
            </a>
          </p>
          <p className="mt-2 text-slate-800">
            <span className="font-medium">Email:</span>{" "}
            <a className="text-[#0B6E4F]" href={`mailto:${s?.topBarEmail}`}>
              {s?.topBarEmail}
            </a>
          </p>
          <div className="mt-6 overflow-hidden rounded-xl border border-slate-200 bg-slate-50">
            {s?.mapEmbedUrl ? (
              <iframe
                title="Map"
                src={s.mapEmbedUrl}
                className="h-64 w-full border-0"
                loading="lazy"
                allowFullScreen
              />
            ) : (
              <div className="flex h-64 items-center justify-center text-sm text-slate-500">
                Map URL can be configured in Admin → Settings.
              </div>
            )}
          </div>
        </section>

        <section className="rounded-2xl border border-slate-200 bg-white p-8 shadow-sm">
          <h2 className="text-xl font-semibold text-[#0A2A43]">Membership application</h2>
          <p className="mt-2 text-sm text-slate-600">
            Your application is stored securely. The secretariat will review and contact you.
          </p>
          <div className="mt-6">
            <MembershipForm />
          </div>
        </section>
      </div>
    </div>
  );
}
