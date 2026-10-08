'use client';
import { getProducts } from '@/lib/api';
import { useAsync } from '@/lib/hooks';
import { fmtNum, unitShort } from '@/lib/format';
import ChangeBadge from './ChangeBadge';

export default function Ticker() {
  const { data, loading, error } = useAsync(getProducts, []);

  if (error) return null;
  if (loading || !data)
    return <div className="skeleton h-10 w-full rounded-none" aria-hidden />;

  const items = data.map(p => (
    <span
      key={p.id}
      className="inline-flex items-center gap-2 px-5 text-sm whitespace-nowrap"
    >
      <span aria-hidden>{p.image}</span>
      <span className="font-medium">{p.nameBn}</span>
      <span className="text-neutral-content/80">
        {fmtNum(p.today)} টাকা/{unitShort(p.unit)}
      </span>
      <ChangeBadge change={p.change} size="sm" />
    </span>
  ));

  return (
    <div
      className="marquee bg-neutral text-neutral-content overflow-hidden py-2"
      aria-label="আজকের দামের তালিকা"
      role="marquee"
    >
      <div className="marquee-track">
        <div className="flex">{items}</div>
        <div className="flex" aria-hidden>
          {items}
        </div>
      </div>
    </div>
  );
}
