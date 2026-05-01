import Link from "next/link";
import { getEvents, getServices, getActivities } from "@/lib/api-client";

export const metadata = { title: "Search" };

export default async function SearchPage({
  searchParams,
}: {
  searchParams: { q?: string };
}) {
  const query = (searchParams.q ?? "").trim().toLowerCase();

  if (!query) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-16">
        <p className="text-slate-600">Enter a search query from the header search icon.</p>
      </div>
    );
  }

  const [allEvents, allServices, allActivities] = await Promise.all([
    getEvents().catch(() => []),
    getServices({ active: true }).catch(() => []),
    getActivities().catch(() => []),
  ]);

  const events = allEvents.filter(
    (e) =>
      !e.hidden &&
      (e.title?.toLowerCase().includes(query) ||
        e.excerpt?.toLowerCase().includes(query) ||
        e.description?.toLowerCase().includes(query))
  );
  const services = allServices.filter(
    (s) =>
      s.title?.toLowerCase().includes(query) ||
      s.description?.toLowerCase().includes(query)
  );
  const activities = allActivities.filter(
    (a) =>
      a.title?.toLowerCase().includes(query) ||
      a.description?.toLowerCase().includes(query)
  );

  const total = events.length + services.length + activities.length;

  return (
    <div className="mx-auto max-w-4xl px-4 py-16 sm:px-6">
      <h1 className="text-2xl font-bold text-[#0A2A43]">
        Search results for &ldquo;{searchParams.q}&rdquo;
      </h1>
      <p className="mt-2 text-sm text-slate-600">{total} result(s)</p>

      <section className="mt-8 space-y-6">
        {services.map((s) => (
          <Link
            key={s.id}
            href={`/services/${s.slug}`}
            className="block rounded-xl border border-slate-200 bg-white p-4 hover:border-[#0B6E4F]/40"
          >
            <span className="text-xs font-semibold uppercase text-[#0B6E4F]">Service</span>
            <h2 className="mt-1 text-lg font-semibold text-[#0A2A43]">{s.title}</h2>
            <p className="mt-1 line-clamp-2 text-sm text-slate-600">{s.description}</p>
          </Link>
        ))}
        {events.map((e) => (
          <Link
            key={e.id}
            href={`/events/${e.slug}`}
            className="block rounded-xl border border-slate-200 bg-white p-4 hover:border-[#0B6E4F]/40"
          >
            <span className="text-xs font-semibold uppercase text-[#0B6E4F]">Event</span>
            <h2 className="mt-1 text-lg font-semibold text-[#0A2A43]">{e.title}</h2>
            <p className="mt-1 line-clamp-2 text-sm text-slate-600">{e.excerpt}</p>
          </Link>
        ))}
        {activities.map((a) => (
          <Link
            key={a.id}
            href={`/activities/${a.slug}`}
            className="block rounded-xl border border-slate-200 bg-white p-4 hover:border-[#0B6E4F]/40"
          >
            <span className="text-xs font-semibold uppercase text-[#0B6E4F]">Activity</span>
            <h2 className="mt-1 text-lg font-semibold text-[#0A2A43]">{a.title}</h2>
            <p className="mt-1 line-clamp-2 text-sm text-slate-600">{a.description}</p>
          </Link>
        ))}
      </section>

      {total === 0 ? <p className="mt-8 text-slate-600">No matches found.</p> : null}
    </div>
  );
}
