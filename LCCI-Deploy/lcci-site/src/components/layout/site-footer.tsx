import Link from "next/link";

type Props = {
  address?: string;
  phone?: string;
  email?: string;
  mapEmbedUrl?: string;
  footerText?: string;
};

export function SiteFooter({ address = "", phone = "", email = "", mapEmbedUrl = "", footerText = "© Layyah Chamber of Commerce & Industry" }: Props) {
  return (
    <footer className="mt-auto border-t border-slate-200 bg-[#0A2A43] text-slate-100">
      <div className="mx-auto grid max-w-7xl gap-10 px-4 py-14 sm:px-6 lg:grid-cols-3 lg:px-8">
        <div>
          <h3 className="text-sm font-semibold uppercase tracking-wide text-[#FFD166]">
            Quick links
          </h3>
          <ul className="mt-4 space-y-2 text-sm">
            <li>
              <Link href="/" className="hover:text-white">
                Home
              </Link>
            </li>
            <li>
              <Link href="/about" className="hover:text-white">
                About
              </Link>
            </li>
            <li>
              <Link href="/services" className="hover:text-white">
                Services
              </Link>
            </li>
            <li>
              <Link href="/events" className="hover:text-white">
                Events
              </Link>
            </li>
            <li>
              <Link href="/contact" className="hover:text-white">
                Contact / Membership
              </Link>
            </li>
          </ul>
        </div>
        <div>
          <h3 className="text-sm font-semibold uppercase tracking-wide text-[#FFD166]">
            Contact
          </h3>
          <p className="mt-4 text-sm leading-relaxed text-slate-200">{address}</p>
          <p className="mt-3 text-sm">
            <a href={`tel:${phone?.replace(/\s/g, "") ?? ""}`} className="hover:text-white">
              {phone}
            </a>
          </p>
          <p className="mt-1 text-sm">
            <a href={`mailto:${email}`} className="hover:text-white">
              {email}
            </a>
          </p>
        </div>
        <div className="min-h-[200px] overflow-hidden rounded-xl border border-white/10 bg-slate-900/50">
          {mapEmbedUrl ? (
            <iframe
              title="Location"
              src={mapEmbedUrl}
              className="h-full min-h-[200px] w-full border-0"
              loading="lazy"
              allowFullScreen
            />
          ) : (
            <div className="flex h-full min-h-[200px] items-center justify-center p-4 text-center text-sm text-slate-400">
              Map embed URL can be set in Admin → Settings.
            </div>
          )}
        </div>
      </div>
      <div className="border-t border-white/10 py-6 text-center text-xs text-slate-400">
        {footerText}
      </div>
    </footer>
  );
}
