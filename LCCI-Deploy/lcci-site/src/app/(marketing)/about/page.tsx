import { LeadershipGrid } from "@/components/about/leadership-grid";
import { getAboutContent, getLeadership } from "@/lib/api-client";

export const metadata = {
  title: "About",
};

export default async function AboutPage() {
  const [about, leaders] = await Promise.all([
    getAboutContent(),
    getLeadership(),
  ]);

  const a = about || {};

  return (
    <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
      <header className="max-w-3xl">
        <h1 className="text-4xl font-bold text-[#0A2A43]">About LCCI</h1>
        <p className="mt-3 text-lg text-slate-600">
          Who we are, our mission, vision, and the team serving Layyah&apos;s business community.
        </p>
      </header>

      <section className="mt-14 grid gap-10 lg:grid-cols-3">
        <article className="card-surface lg:col-span-3">
          <h2 className="text-xl font-semibold text-[#0A2A43]">Who we are</h2>
          <p className="mt-3 text-slate-700 leading-relaxed">
            Layyah Chamber of Commerce &amp; Industry is the official voice of local businesses—connecting
            entrepreneurs, advocating for policy, and delivering practical services that help enterprises grow
            responsibly.
          </p>
        </article>
        <article className="card-surface">
          <h2 className="text-lg font-semibold text-[#0B6E4F]">Mission</h2>
          <p className="mt-3 text-sm text-slate-700 leading-relaxed whitespace-pre-wrap">{a.mission}</p>
        </article>
        <article className="card-surface">
          <h2 className="text-lg font-semibold text-[#0B6E4F]">Vision</h2>
          <p className="mt-3 text-sm text-slate-700 leading-relaxed whitespace-pre-wrap">{a.vision}</p>
        </article>
        <article className="card-surface">
          <h2 className="text-lg font-semibold text-[#0B6E4F]">History</h2>
          <p className="mt-3 text-sm text-slate-700 leading-relaxed whitespace-pre-wrap">{a.history}</p>
        </article>
      </section>

      <section className="mt-20">
        <h2 className="text-2xl font-bold text-[#0A2A43]">Our leadership</h2>
        <p className="mt-2 text-slate-600">Tap a card to read the full profile.</p>
        <div className="mt-8">
          <LeadershipGrid
            leaders={leaders.map((l) => ({
              id: l.id,
              name: l.name,
              role: l.role,
              photoUrl: l.photoUrl,
              bio: l.bio,
            }))}
          />
        </div>
      </section>
    </div>
  );
}
