import Link from "next/link";

export default function EmptyState({
  title = "পেজটি খুঁজে পাওয়া যায়নি",
  message = "আপনি যে ঠিকানাটি খুঁজছেন সেটি নেই বা সরিয়ে নেওয়া হয়েছে।",
  code = "৪০৪",
}: {
  title?: string;
  message?: string;
  code?: string;
}) {
  return (
    <div className="max-w-xl mx-auto px-4 py-20 text-center">
      <div className="text-7xl mb-4" aria-hidden>
        🧺
      </div>
      <p className="font-display text-5xl font-extrabold text-primary">{code}</p>
      <h1 className="font-display text-2xl font-bold mt-2">{title}</h1>
      <p className="text-base-content/70 mt-2">{message}</p>
      <Link href="/" className="btn btn-primary mt-6">
        হোম পেজে ফিরে যান
      </Link>
    </div>
  );
}
