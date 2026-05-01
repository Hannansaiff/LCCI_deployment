import Link from "next/link";
import { getServices } from "@/lib/api-client";
import { ServiceIcon } from "@/lib/service-icons";

export const metadata = { title: "Services" };

export default async function ServicesPage() {
  const services = await getServices({ active: true });

  return (
    <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
      <header className="max-w-3xl">
        <h1 className="text-4xl font-bold text-[#0A2A43]">Services</h1>
        <p className="mt-3 text-lg text-slate-600">
          Registration support, documentation, trade facilitation, training, and welfare programmes tailored
          for members and businesses in Layyah.
        </p>
      </header>

      <div className="mt-12 grid gap-8 md:grid-cols-2">
        {services.map((s) => (
          <article key={s.id} className="card-surface flex flex-col">
            <div className="flex items-start gap-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[#0B6E4F]/10 text-[#0B6E4F]">
                <ServiceIcon name={s.icon} className="h-7 w-7" />
              </div>
              <div>
                <h2 className="text-xl font-semibold text-[#0A2A43]">{s.title}</h2>
                <p className="mt-2 text-sm text-slate-600 leading-relaxed whitespace-pre-wrap">
                  {s.description}
                </p>
              </div>
            </div>
            <div className="mt-6 flex justify-end">
              <Link href={`/services/${s.slug}`} className="btn-primary text-sm">
                Apply for service
              </Link>
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}
