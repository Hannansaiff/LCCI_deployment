import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getActivityBySlug } from "@/lib/api-client";

type Props = { params: { slug: string } };

export async function generateMetadata({ params }: Props) {
  const a = await getActivityBySlug(params.slug);
  return { title: a?.title ?? "Activity" };
}

export default async function ActivityDetailPage({ params }: Props) {
  const a = await getActivityBySlug(params.slug);
  if (!a) notFound();

  return (
    <article className="mx-auto max-w-3xl px-4 py-16 sm:px-6 lg:px-8">
      <Link href="/" className="text-sm font-medium text-[#0B6E4F] hover:underline">
        ← Home
      </Link>

      <div className="relative mt-6 aspect-video w-full overflow-hidden rounded-2xl bg-slate-100">
        {a.imageUrl ? (
          a.imageUrl.startsWith("http") ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={a.imageUrl} alt="" className="h-full w-full object-cover" />
          ) : (
            <Image src={a.imageUrl} alt="" fill className="object-cover" priority sizes="100vw" />
          )
        ) : null}
      </div>

      <header className="mt-8">
        <p className="text-sm font-semibold text-[#0B6E4F]">
          {new Date(a.date).toLocaleDateString("en-GB", {
            day: "2-digit",
            month: "long",
            year: "numeric",
          })}
        </p>
        <h1 className="mt-2 text-4xl font-bold text-[#0A2A43]">{a.title}</h1>
      </header>

      <div className="prose prose-slate mt-8 max-w-none whitespace-pre-wrap">
        {a.description}
      </div>
    </article>
  );
}
