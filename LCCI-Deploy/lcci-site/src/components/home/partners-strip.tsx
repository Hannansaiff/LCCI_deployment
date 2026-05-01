"use client";

import Image from "next/image";
import useEmblaCarousel from "embla-carousel-react";
import { useCallback, useEffect } from "react";

export type PartnerItem = {
  id: string;
  name: string;
  logoUrl: string;
  websiteUrl: string;
};

export function PartnersStrip({ partners }: { partners: PartnerItem[] }) {
  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: true, align: "start" });

  const scrollNext = useCallback(() => emblaApi?.scrollNext(), [emblaApi]);

  useEffect(() => {
    if (!emblaApi) return;
    const id = window.setInterval(() => scrollNext(), 4000);
    return () => window.clearInterval(id);
  }, [emblaApi, scrollNext]);

  if (!partners.length) {
    return (
      <section className="border-y border-slate-200 bg-white py-10">
        <div className="mx-auto max-w-7xl px-4 text-center text-sm text-slate-500 sm:px-6 lg:px-8">
          Partner logos can be added from the admin panel.
        </div>
      </section>
    );
  }

  return (
    <section className="border-y border-slate-200 bg-white py-10">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <h2 className="text-center text-sm font-semibold uppercase tracking-wide text-[#0A2A43]">
          Partners &amp; sponsors
        </h2>
        <div className="mt-6 overflow-hidden" ref={emblaRef}>
          <div className="flex gap-8">
            {partners.map((p) => (
              <div
                key={p.id}
                className="flex min-w-[140px] flex-[0_0_auto] items-center justify-center"
              >
                <a
                  href={p.websiteUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="grayscale transition hover:grayscale-0"
                >
                  {p.logoUrl.startsWith("http") ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={p.logoUrl} alt={p.name} className="h-12 w-auto object-contain" />
                  ) : (
                    <Image
                      src={p.logoUrl}
                      alt={p.name}
                      width={160}
                      height={48}
                      className="h-12 w-auto object-contain"
                    />
                  )}
                </a>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
