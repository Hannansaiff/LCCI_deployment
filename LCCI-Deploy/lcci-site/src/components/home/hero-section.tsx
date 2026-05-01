import Image from "next/image";
import Link from "next/link";
import { getHeroSection } from "@/lib/api-client";

export async function HeroSection() {
  const hero = await getHeroSection();
  if (!hero) return null;
  const isExternal = hero.imageUrl?.startsWith("http");

  return (
    <section className="relative overflow-hidden">
      <div className="absolute inset-0">
        {isExternal ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={hero.imageUrl} alt="" className="h-full w-full object-cover" />
        ) : (
          <Image
            src={hero.imageUrl || "/images/hero-placeholder.svg"}
            alt=""
            fill
            priority
            className="object-cover"
            sizes="100vw"
          />
        )}
        <div className="absolute inset-0 bg-gradient-to-r from-[#0A2A43]/90 via-[#0A2A43]/65 to-[#0B6E4F]/40" />
      </div>
      <div className="relative mx-auto flex max-w-7xl flex-col gap-8 px-4 py-24 sm:px-6 lg:flex-row lg:items-center lg:justify-between lg:px-8 lg:py-32">
        <div className="max-w-xl animate-fade-up text-white">
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-[#FFD166]">
            Layyah Chamber
          </p>
          <h1 className="mt-3 text-4xl font-bold leading-tight sm:text-5xl">
            <span className="block">{hero.title}</span>
          </h1>
          <p className="mt-4 text-lg text-slate-100/95">{hero.subtitle}</p>
          <div className="mt-8 flex flex-wrap gap-3">
            {hero.btn1Enabled ? (
              <Link href={hero.learnMoreHref} className="btn-accent">
                {hero.btn1Text}
              </Link>
            ) : null}
            {hero.btn2Enabled ? (
              <Link href={hero.memberHref} className="btn-primary bg-white text-[#0A2A43] hover:bg-slate-100">
                {hero.btn2Text}
              </Link>
            ) : null}
          </div>
        </div>
      </div>
    </section>
  );
}
