import Link from "next/link";
import Image from "next/image";
import { Suspense } from "react";
import { getEvents } from "@/lib/api-client";
import { EventsFilter } from "@/components/events/events-filter";

export const metadata = { title: "Events & Activities" };

type SearchParams = { filter?: string; category?: string };

export default async function EventsPage({
  searchParams,
}: {
  searchParams: SearchParams;
}) {
  const filter = searchParams.filter ?? "upcoming";
  const category = searchParams.category ?? "";

  const now = new Date();
  const allEvents = await getEvents().catch(() => []);

  const events = allEvents.filter((e) => {
    const eventDate = new Date(e.date);
    const matchesFilter =
      filter === "past"
        ? eventDate < now
        : filter === "upcoming"
          ? eventDate >= now
          : true;
    const matchesCategory = category ? e.category === category : true;
    return !e.hidden && matchesFilter && matchesCategory;
  });

  const categories = [...new Set(allEvents.map((e) => e.category))];

  return (
    <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
      <header className="max-w-3xl">
        <h1 className="text-4xl font-bold text-[#0A2A43]">Events &amp; activities</h1>
        <p className="mt-3 text-lg text-slate-600">
          Chamber programmes, trade fairs, seminars, and community initiatives.
        </p>
      </header>

      <Suspense fallback={<div className="mt-8 h-10 animate-pulse rounded bg-slate-100" />}>
        <EventsFilter
          categories={categories}
          currentFilter={filter}
          currentCategory={category}
        />
      </Suspense>

      <div className="mt-10 grid gap-8 md:grid-cols-2">
        {events.map((ev) => (
          <Link
            key={ev.id}
            href={`/events/${ev.slug}`}
            className="card-surface group overflow-hidden p-0 hover:border-[#0B6E4F]/30"
          >
            <div className="relative h-48 w-full bg-slate-100">
              {ev.imageUrl ? (
                ev.imageUrl.startsWith("http") ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={ev.imageUrl} alt="" className="h-full w-full object-cover" />
                ) : (
                  <Image src={ev.imageUrl} alt="" fill className="object-cover" sizes="(max-width:768px) 100vw, 50vw" />
                )
              ) : (
                <div className="flex h-full items-center justify-center text-slate-400">Event</div>
              )}
            </div>
            <div className="p-6">
              <p className="text-xs font-semibold uppercase tracking-wide text-[#0B6E4F]">
                {ev.category} ·{" "}
                {new Date(ev.date).toLocaleDateString("en-GB", {
                  day: "2-digit",
                  month: "short",
                  year: "numeric",
                })}
              </p>
              <h2 className="mt-2 text-xl font-semibold text-[#0A2A43] group-hover:text-[#0B6E4F]">
                {ev.title}
              </h2>
              <p className="mt-2 line-clamp-3 text-sm text-slate-600">{ev.excerpt}</p>
            </div>
          </Link>
        ))}
      </div>

      {events.length === 0 ? (
        <p className="mt-8 text-center text-slate-500">No events match your filters yet.</p>
      ) : null}
    </div>
  );
}
