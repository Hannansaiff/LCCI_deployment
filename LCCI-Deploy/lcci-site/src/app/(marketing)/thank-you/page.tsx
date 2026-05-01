import Link from "next/link";

export const metadata = { title: "Thank you" };

export default function ThankYouPage() {
  return (
    <div className="mx-auto max-w-xl px-4 py-24 text-center sm:px-6">
      <div className="rounded-2xl border border-slate-200 bg-white p-10 shadow-sm">
        <h1 className="text-2xl font-bold text-[#0A2A43]">Your application is submitted</h1>
        <p className="mt-3 text-slate-600">
          Thank you. Our team will review your submission and contact you via email or phone.
        </p>
        <Link href="/" className="btn-primary mt-8 inline-flex">
          Back to home
        </Link>
      </div>
    </div>
  );
}
