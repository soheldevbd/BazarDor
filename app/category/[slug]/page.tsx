"use client";
import { useMemo, useState } from "react";
import { useParams } from "next/navigation";
import EmptyState from "@/components/EmptyState";
import ProductGrid from "@/components/ProductGrid";
import SortSelect, { type SortKey } from "@/components/SortSelect";
import { GridSkeleton } from "@/components/Skeletons";
import { getProducts } from "@/lib/api";
import { CATEGORIES } from "@/lib/constants";
import { toBn } from "@/lib/format";
import { useAsync } from "@/lib/hooks";

export default function CategoryPage() {
  const { slug } = useParams<{ slug: string }>();
  const category = CATEGORIES.find((c) => c.slug === slug);
  const { data, loading, error } = useAsync(getProducts, []);
  const [sort, setSort] = useState<SortKey>("default");

  const items = useMemo(() => {
    const list = (data ?? []).filter((p) => p.category === slug);
    // sort by the numeric value (never by the Bengali display string)
    if (sort === "asc") return [...list].sort((a, b) => a.today - b.today);
    if (sort === "desc") return [...list].sort((a, b) => b.today - a.today);
    return list;
  }, [data, slug, sort]);

  if (!category) {
    return <EmptyState title="এই ধরনের কোনো পণ্য নেই" message="ঠিকানাটি ভুল হতে পারে। হোম পেজ থেকে আবার চেষ্টা করুন।" />;
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-10">
      <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-6">
        <div className="flex items-center gap-3">
          <span className="grid place-items-center size-14 rounded-2xl bg-base-100 border border-base-300 text-3xl" aria-hidden>
            {category.icon}
          </span>
          <div>
            <h1 className="font-display text-3xl font-bold">{category.nameBn}</h1>
            {!loading && !error && <p className="text-sm text-base-content/60">{toBn(items.length)}টি পণ্য</p>}
          </div>
        </div>
        <SortSelect value={sort} onChange={setSort} />
      </div>

      {loading ? (
        <GridSkeleton count={8} />
      ) : error ? (
        <p className="alert alert-error">তথ্য আনা যায়নি। পেজটি রিফ্রেশ করে আবার চেষ্টা করুন।</p>
      ) : items.length === 0 ? (
        <EmptyState title="এই ধরনের কোনো পণ্য নেই" message="এখনও এই বিভাগে কোনো পণ্য যোগ হয়নি।" />
      ) : (
        <ProductGrid products={items} />
      )}
    </div>
  );
}
