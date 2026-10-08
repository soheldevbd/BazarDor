"use client";
import Link from "next/link";
import { useParams } from "next/navigation";
import EmptyState from "@/components/EmptyState";
import ChangeBadge from "@/components/ChangeBadge";
import RequireAuth from "@/components/RequireAuth";
import { PageSkeleton } from "@/components/Skeletons";
import { getProductBySlug } from "@/lib/api";
import { fmtNum, fmtPrice, toBn, unitBn } from "@/lib/format";
import { useAsync } from "@/lib/hooks";
import type { Product } from "@/lib/types";

function Stat({ label, value, tone }: { label: string; value: string; tone?: string }) {
  return (
    <div className="rounded-2xl bg-base-100 border border-base-300 p-4">
      <p className="text-sm text-base-content/60">{label}</p>
      <p className={`font-display text-2xl font-bold mt-1 ${tone ?? ""}`}>{value}</p>
    </div>
  );
}

function Detail({ p }: { p: Product }) {
  const mins = p.markets.map((m) => m.min);
  const maxs = p.markets.map((m) => m.max);
  const hasMarkets = p.markets.length > 0;
  const min = hasMarkets ? Math.min(...mins) : p.today;
  const max = hasMarkets ? Math.max(...maxs) : p.today;
  const avg = hasMarkets
    ? p.markets.reduce((s, m) => s + (m.min + m.max) / 2, 0) / p.markets.length
    : p.today;

  const divisions = Array.from(new Set(p.markets.map((m) => m.division)));
  const history = [
    { label: "আজ", v: p.today },
    { label: "গতকাল", v: p.yesterday },
    { label: "এক সপ্তাহ আগে", v: p.lastWeek },
    { label: "এক মাস আগে", v: p.lastMonth },
  ].filter((h) => h.v > 0);
  const top = Math.max(...history.map((h) => h.v), 1);

  const summary =
    p.change.dir === "flat"
      ? `${p.nameBn}-এর দাম গতকালের মতোই আছে।`
      : `গতকালের তুলনায় ${p.nameBn}-এর দাম ${toBn(p.change.pct.toFixed(1))}% ${p.change.dir === "up" ? "বেড়েছে" : "কমেছে"}।`;

  return (
    <div className="max-w-6xl mx-auto px-4 py-10 space-y-8">
      <Link href={`/category/${p.category}`} className="link link-hover text-sm">
        ← {p.categoryNameBn} বিভাগে ফিরুন
      </Link>

      <section className="rounded-3xl bg-base-100 border border-base-300 p-6 sm:p-8 flex flex-col sm:flex-row gap-5 sm:items-center">
        <span className="grid place-items-center size-24 rounded-3xl bg-base-200 text-6xl shrink-0" aria-hidden>
          {p.image}
        </span>
        <div className="space-y-3">
          <div className="flex flex-wrap items-center gap-3">
            <h1 className="font-display text-3xl sm:text-4xl font-bold">{p.nameBn}</h1>
            <ChangeBadge change={p.change} size="lg" />
          </div>
          <p className="text-base-content/70">
            আজ {p.nameBn}-এর গড় দাম {fmtPrice(Math.round(avg))} ({unitBn(p.unit)})। {summary}
          </p>
          <div className="flex flex-wrap gap-2">
            <Link href={`/category/${p.category}`} className="badge badge-primary badge-soft">
              {p.categoryIcon} {p.categoryNameBn}
            </Link>
            <span className="badge badge-outline">{unitBn(p.unit)}</span>
          </div>
        </div>
      </section>

      <section aria-labelledby="price-summary">
        <h2 id="price-summary" className="font-display text-2xl font-bold mb-3">
          দামের সারসংক্ষেপ
        </h2>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <Stat label="সর্বনিম্ন দাম" value={fmtPrice(min)} tone="text-success" />
          <Stat label="সর্বোচ্চ দাম" value={fmtPrice(max)} tone="text-error" />
          <Stat label="গড় দাম" value={fmtPrice(Math.round(avg))} />
          <Stat label="আজকের দাম" value={fmtPrice(p.today)} tone="text-primary" />
        </div>
      </section>

      {history.length > 1 && (
        <section aria-labelledby="history">
          <h2 id="history" className="font-display text-2xl font-bold mb-3">
            আগের দামের সঙ্গে তুলনা
          </h2>
          <div className="rounded-2xl bg-base-100 border border-base-300 p-5 space-y-3">
            {history.map((h, i) => (
              <div key={h.label} className="grid grid-cols-[7.5rem_1fr_6rem] sm:grid-cols-[10rem_1fr_7rem] items-center gap-3 text-sm">
                <span className="text-base-content/70">{h.label}</span>
                <progress
                  className={`progress w-full ${i === 0 ? "progress-primary" : "progress-neutral opacity-50"}`}
                  value={h.v}
                  max={top}
                />
                <span className="text-right font-semibold">{fmtPrice(h.v)}</span>
              </div>
            ))}
          </div>
        </section>
      )}

      <section aria-labelledby="markets">
        <h2 id="markets" className="font-display text-2xl font-bold mb-3">
          বাজারভিত্তিক আজকের দাম
        </h2>
        {!hasMarkets ? (
          <p className="text-base-content/60">এই পণ্যের বাজারভিত্তিক তথ্য এখনও নেই।</p>
        ) : (
          <div className="grid gap-4 md:grid-cols-2">
            {divisions.map((d) => (
              <div key={d} className="rounded-2xl bg-base-100 border border-base-300 overflow-hidden">
                <h3 className="px-4 py-3 bg-primary text-primary-content font-semibold">{d} বিভাগ</h3>
                <div className="overflow-x-auto">
                  <table className="table">
                    <thead>
                      <tr>
                        <th>বাজার</th>
                        <th className="text-right">সর্বনিম্ন</th>
                        <th className="text-right">সর্বোচ্চ</th>
                      </tr>
                    </thead>
                    <tbody>
                      {p.markets
                        .filter((m) => m.division === d)
                        .map((m) => (
                          <tr key={m.market}>
                            <td>{m.market}</td>
                            <td className="text-right text-success font-medium">{fmtNum(m.min)} টাকা</td>
                            <td className="text-right text-error font-medium">{fmtNum(m.max)} টাকা</td>
                          </tr>
                        ))}
                    </tbody>
                  </table>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}

function Loader() {
  const { slug } = useParams<{ slug: string }>();
  const { data, loading, error } = useAsync(() => getProductBySlug(slug), [slug]);

  if (loading) return <PageSkeleton />;
  if (error) return <EmptyState code="⚠️" title="তথ্য আনা যায়নি" message="ইন্টারনেট সংযোগ দেখে আবার চেষ্টা করুন।" />;
  if (!data) return <EmptyState title="পণ্যটি খুঁজে পাওয়া যায়নি" message="এই নামে কোনো পণ্য নেই।" />;
  return <Detail p={data} />;
}

export default function ProductPage() {
  return (
    <RequireAuth>
      <Loader />
    </RequireAuth>
  );
}
