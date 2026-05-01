"use client";

import { useRouter, useSearchParams } from "next/navigation";

export function EventsFilter({
  categories,
  currentFilter,
  currentCategory,
}: {
  categories: string[];
  currentFilter: string;
  currentCategory: string;
}) {
  const router = useRouter();
  const sp = useSearchParams();

  function apply(next: { filter?: string; category?: string }) {
    const p = new URLSearchParams(sp.toString());
    if (next.filter !== undefined) p.set("filter", next.filter);
    if (next.category !== undefined) {
      if (next.category === "") p.delete("category");
      else p.set("category", next.category);
    }
    router.push(`/events?${p.toString()}`);
  }

  return (
    <div className="mt-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
      <div className="flex flex-wrap gap-2">
        {[
          { id: "upcoming", label: "Upcoming" },
          { id: "past", label: "Past" },
          { id: "all", label: "All" },
        ].map((f) => (
          <button
            key={f.id}
            type="button"
            onClick={() => apply({ filter: f.id })}
            className={`rounded-full px-4 py-1.5 text-sm font-semibold ${
              currentFilter === f.id
                ? "bg-[#0B6E4F] text-white"
                : "bg-white text-slate-700 ring-1 ring-slate-200 hover:bg-slate-50"
            }`}
          >
            {f.label}
          </button>
        ))}
      </div>
      <div className="flex items-center gap-2">
        <label htmlFor="cat" className="text-sm text-slate-600">
          Category
        </label>
        <select
          id="cat"
          value={currentCategory}
          onChange={(e) => apply({ category: e.target.value })}
          className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm"
        >
          <option value="">All categories</option>
          {categories.map((c) => (
            <option key={c} value={c}>
              {c}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
}
