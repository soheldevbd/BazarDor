import Link from "next/link";
import type { Product } from "@/lib/types";
import { fmtPrice, unitBn } from "@/lib/format";
import ChangeBadge from "./ChangeBadge";

export default function ProductCard({ product: p }: { product: Product }) {
  return (
    <Link
      href={`/product/${p.slug}`}
      className="card bg-base-100 border border-base-300 hover:border-primary hover:shadow-md transition-shadow focus-visible:outline-2 focus-visible:outline-primary"
    >
      <div className="card-body p-4 gap-3">
        <div className="flex items-center gap-3">
          <span className="grid place-items-center size-14 rounded-2xl bg-base-200 text-3xl" aria-hidden>
            {p.image}
          </span>
          <div className="min-w-0">
            <h3 className="font-semibold text-lg leading-snug truncate">{p.nameBn}</h3>
            <p className="text-sm text-base-content/60">{unitBn(p.unit)}</p>
          </div>
        </div>
        <div className="flex items-end justify-between gap-2 border-t border-dashed border-base-300 pt-3">
          <div>
            <p className="text-xs text-base-content/60">আজকের দাম</p>
            <p className="font-display text-xl font-bold text-primary">{fmtPrice(p.today)}</p>
          </div>
          <ChangeBadge change={p.change} />
        </div>
      </div>
    </Link>
  );
}
