import Link from "next/link";
import Image from "next/image";
import { HeroSection } from "@/components/home/hero-section";
import { PartnersStrip } from "@/components/home/partners-strip";
import { getServices, getActivities, getPartners } from "@/lib/api-client";
import { ServiceIcon } from "@/lib/service-icons";

export default async function HomePage() {
  const [homeServices, activities, partners] = await Promise.all([
    getServices({ showOnHome: true, active: true }).catch(() => []),
    getActivities({ showOnHome: true }).catch(() => []),
    getPartners().catch(() => []),
  ]);

  return (
    <>
      <HeroSection />

      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h2 className="text-2xl font-bold text-[#0A2A43]">Services overview</h2>
            <p className="mt-1 text-slate-600">
              Core offerings for members and the wider business community.
            </p>
          </div>
          <Link href="/services" className="btn-secondary text-sm">
            View all services
          </Link>
        </div>
        <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {homeServices.map((s) => (
            <article key={s.id} className="card-surface group">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#0B6E4F]/10 text-[#0B6E4F]">
                <ServiceIcon name={s.icon} className="h-6 w-6" />
              </div>
              <h3 className="mt-4 text-lg font-semibold text-[#0A2A43]">{s.title}</h3>
              <p className="mt-2 line-clamp-2 text-sm text-slate-600">{s.description}</p>
              <Link
                href={`/services/${s.slug}`}
                className="mt-4 inline-block text-sm font-semibold text-[#0B6E4F] group-hover:underline"
              >
                Read more
              </Link>
            </article>
          ))}
        </div>
      </section>

      <section className="bg-white py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <h2 className="text-2xl font-bold text-[#0A2A43]">Latest activities</h2>
              <p className="mt-1 text-slate-600">Recent updates from chamber programmes.</p>
            </div>
            <Link href="/events" className="btn-secondary text-sm">
              All events &amp; activities
            </Link>
          </div>
          <div className="mt-10 grid gap-6 md:grid-cols-2">
            {activities.map((a) => (
              <Link
                key={a.id}
                href={`/activities/${a.slug}`}
                className="card-surface flex flex-col gap-0 overflow-hidden p-0 hover:border-[#0B6E4F]/30 sm:flex-row sm:gap-4"
              >
                <div className="relative h-44 w-full shrink-0 bg-slate-100 sm:h-36 sm:w-40">
                  {a.imageUrl ? (
                    a.imageUrl.startsWith("http") ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img src={a.imageUrl} alt="" className="h-full w-full object-cover" />
                    ) : (
                      <Image
                        src={a.imageUrl}
                        alt=""
                        fill
                        className="object-cover"
                        sizes="160px"
                      />
                    )
                  ) : (
                    <div className="flex h-full items-center justify-center text-xs text-slate-400">
                      No image
                    </div>
                  )}
                </div>
                <div className="flex flex-1 flex-col p-4 sm:py-4 sm:pr-4 sm:pl-0">
                  <p className="text-xs font-medium uppercase tracking-wide text-[#0B6E4F]">
                    {new Date(a.date).toLocaleDateString("en-GB", {
                      day: "2-digit",
                      month: "short",
                      year: "numeric",
                    })}
                  </p>
                  <h3 className="mt-1 text-lg font-semibold text-[#0A2A43]">{a.title}</h3>
                  <p className="mt-2 line-clamp-2 text-sm text-slate-600">{a.description}</p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <PartnersStrip
        partners={partners.map((p) => ({
          id: p.id,
          name: p.name,
          logoUrl: p.logoUrl,
          websiteUrl: p.websiteUrl,
        }))}
      />
    </>
  );
}
