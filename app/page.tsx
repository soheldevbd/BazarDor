"use client";
import { useMemo } from "react";
import Hero from "@/components/Hero";
import ProductGrid from "@/components/ProductGrid";
import { GridSkeleton } from "@/components/Skeletons";
import { getProducts } from "@/lib/api";
import { useAsync } from "@/lib/hooks";

function Section({
  id,
  title,
  subtitle,
  children,
}: {
  id?: string;
  title: string;
  subtitle?: string;
  children: React.ReactNode;
}) {
  return (
    <section id={id} className="scroll-anchor max-w-6xl mx-auto px-4 mt-12">
      <div className="mb-5">
        <h2 className="font-display text-2xl sm:text-3xl font-bold">{title}</h2>
        {subtitle && <p className="text-base-content/70 mt-1">{subtitle}</p>}
      </div>
      {children}
    </section>
  );
}

export default function HomePage() {
  const { data, loading, error } = useAsync(getProducts, []);

  const { risers, fallers } = useMemo(() => {
    const all = data ?? [];
    return {
      risers: all
        .filter((p) => p.change.dir === "up")
        .sort((a, b) => b.change.pct - a.change.pct)
        .slice(0, 6),
      fallers: all
        .filter((p) => p.change.dir === "down")
        .sort((a, b) => b.change.pct - a.change.pct)
        .slice(0, 6),
    };
  }, [data]);

  const body = (items: typeof risers, count: number, empty: string) =>
    loading ? (
      <GridSkeleton count={count} />
    ) : error ? (
      <p className="alert alert-error">তথ্য আনা যায়নি। পেজটি রিফ্রেশ করে আবার চেষ্টা করুন।</p>
    ) : items.length ? (
      <ProductGrid products={items} />
    ) : (
      <p className="text-base-content/60">{empty}</p>
    );

  return (
    <>
      <Hero />
      <Section title="আজ দাম বেড়েছে ▲" subtitle="গতকালের তুলনায় সবচেয়ে বেশি বেড়েছে এমন ৬টি পণ্য">
        {body(risers, 6, "আজ কোনো পণ্যের দাম বাড়েনি।")}
      </Section>
      <Section title="আজ দাম কমেছে ▼" subtitle="গতকালের তুলনায় সবচেয়ে বেশি কমেছে এমন ৬টি পণ্য">
        {body(fallers, 6, "আজ কোনো পণ্যের দাম কমেনি।")}
      </Section>
      <Section id="সব-পণ্য" title="সব পণ্য" subtitle="সব ধরনের নিত্যপ্রয়োজনীয় পণ্যের আজকের দাম। বিস্তারিত দেখতে কার্ডে ক্লিক করুন।">
        {body(data ?? [], 8, "কোনো পণ্য পাওয়া যায়নি।")}
      </Section>
    </>
  );
}
