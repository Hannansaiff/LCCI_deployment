import Link from "next/link";
import { notFound } from "next/navigation";
import { getServiceBySlug } from "@/lib/api-client";
import { ServiceIcon } from "@/lib/service-icons";
import { ServiceRequestForm } from "@/components/forms/service-request-form";

type Props = { params: { slug: string } };

export async function generateMetadata({ params }: Props) {
  try {
    const s = await getServiceBySlug(params.slug);
    return { title: s?.title ?? "Service" };
  } catch {
    return { title: "Service" };
  }
}

export default async function ServiceDetailPage({ params }: Props) {
  const { slug } = params;
  try {
    const service = await getServiceBySlug(slug);
    if (!service) notFound();

    return (
      <div className="mx-auto max-w-4xl px-4 py-16 sm:px-6 lg:px-8">
        <Link href="/services" className="text-sm font-medium text-[#0B6E4F] hover:underline">
          ← All services
        </Link>
        <header className="mt-6 flex gap-4">
          <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-[#0B6E4F]/10 text-[#0B6E4F]">
            <ServiceIcon name={service.icon} className="h-8 w-8" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-[#0A2A43]">{service.title}</h1>
            <p className="mt-2 text-slate-600 whitespace-pre-wrap">{service.description}</p>
          </div>
        </header>

        <section className="mt-12 rounded-2xl border border-slate-200 bg-white p-8 shadow-sm">
          <h2 className="text-lg font-semibold text-[#0A2A43]">Service request</h2>
          <p className="mt-1 text-sm text-slate-600">
            Submit your details. The chamber office will contact you after review.
          </p>
          <div className="mt-6">
            <ServiceRequestForm serviceId={service.id} serviceTitle={service.title} />
          </div>
        </section>
      </div>
    );
  } catch {
    notFound();
  }
}
