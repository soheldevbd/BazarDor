import type { Change } from '@/lib/types';
import { fmtChange } from '@/lib/format';

export default function ChangeBadge({
  change,
  size = 'md',
}: {
  change: Change;
  size?: 'sm' | 'md' | 'lg';
}) {
  const tone =
    change.dir === 'up'
      ? 'badge-success'
      : change.dir === 'down'
        ? 'badge-error'
        : 'badge-neutral';
  const sz = size === 'lg' ? 'badge-lg' : size === 'sm' ? 'badge-sm' : '';
  return (
    <span className={`badge badge-soft font-semibold ${tone} ${sz}`}>
      {fmtChange(change)}
    </span>
  );
}
