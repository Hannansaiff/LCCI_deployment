import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getEventBySlug } from "@/lib/api-client";

type Props = { params: { slug: string } };

export async function generateMetadata({ params }: Props) {
  const e = await getEventBySlug(params.slug);
  return { title: e?.title ?? "Event" };
}

export default async function EventDetailPage({ params }: Props) {
  const ev = await getEventBySlug(params.slug);
  if (!ev) notFound();

  return (
    <article className="mx-auto max-w-4xl px-4 py-16 sm:px-6 lg:px-8">
      <Link href="/events" className="text-sm font-medium text-[#0B6E4F] hover:underline">
        ← All events
      </Link>

      <div className="relative mt-6 h-56 w-full overflow-hidden rounded-2xl bg-slate-100 sm:h-72">
        {ev.imageUrl ? (
          ev.imageUrl.startsWith("http") ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={ev.imageUrl} alt="" className="h-full w-full object-cover" />
          ) : (
            <Image src={ev.imageUrl} alt="" fill className="object-cover" priority sizes="100vw" />
          )
        ) : null}
      </div>

      <header className="mt-8">
        <p className="text-sm font-semibold text-[#0B6E4F]">
          {ev.category} ·{" "}
          {new Date(ev.date).toLocaleString("en-GB", {
            dateStyle: "long",
            timeStyle: "short",
          })}
        </p>
        <h1 className="mt-2 text-4xl font-bold text-[#0A2A43]">{ev.title}</h1>
      </header>

      <div
        className="prose prose-slate mt-8 max-w-none"
        dangerouslySetInnerHTML={{ __html: ev.description }}
      />

      {ev.gallery && ev.gallery.length > 0 ? (
        <section className="mt-10">
          <h2 className="text-lg font-semibold text-[#0A2A43]">Gallery</h2>
          <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-3">
            {ev.gallery.map((g) => (
              <div key={g.id} className="relative aspect-video overflow-hidden rounded-xl bg-slate-100">
                {g.imageUrl.startsWith("http") ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={g.imageUrl} alt="" className="h-full w-full object-cover" />
                ) : (
                  <Image src={g.imageUrl} alt="" fill className="object-cover" sizes="200px" />
                )}
              </div>
            ))}
          </div>
        </section>
      ) : null}

      {ev.pdfUrl ? (
        <p className="mt-8">
          <a
            href={ev.pdfUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="btn-secondary inline-flex"
          >
            Download PDF
          </a>
        </p>
      ) : null}
    </article>
  );
}
