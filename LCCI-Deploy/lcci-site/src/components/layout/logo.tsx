import Link from "next/link";

export function Logo({ className = "" }: { className?: string }) {
  return (
    <Link href="/" className={`flex items-center gap-3 ${className}`}>
      <span className="relative flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-[#0B6E4F] text-white shadow-sm ring-2 ring-[#FFD166]/40">
        <svg
          viewBox="0 0 48 48"
          className="h-7 w-7"
          aria-hidden
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <circle cx="24" cy="24" r="22" stroke="currentColor" strokeWidth="2" />
          <path
            d="M14 28c4-6 8-8 10-10 2 2 6 4 10 10"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
          />
          <path
            d="M18 32h12M24 18v6"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
          />
        </svg>
      </span>
      <span className="leading-tight">
        <span className="block text-sm font-bold tracking-wide text-[#0A2A43]">
          LCCI
        </span>
        <span className="block max-w-[14rem] text-[11px] font-medium text-slate-600">
          Layyah Chamber of Commerce &amp; Industry
        </span>
      </span>
    </Link>
  );
}
