const TILES = [
  { e: "🍚", c: "left-[6%] top-[10%] -rotate-6" },
  { e: "🧅", c: "right-[8%] top-[6%] rotate-6" },
  { e: "🐟", c: "left-[2%] bottom-[22%] rotate-3" },
  { e: "🥚", c: "right-[4%] top-[42%] -rotate-3" },
  { e: "🌶️", c: "left-[30%] bottom-[4%] rotate-6" },
  { e: "🥔", c: "right-[22%] bottom-[8%] -rotate-6" },
];

export default function Hero() {
  return (
    <section className="max-w-6xl mx-auto px-4 pt-8 sm:pt-12">
      <div className="grid md:grid-cols-2 gap-8 items-center rounded-3xl bg-base-100 border border-base-300 p-6 sm:p-10 overflow-hidden">
        <div>
          <p className="text-sm font-semibold text-secondary-content bg-secondary/30 inline-block rounded-full px-3 py-1">
            প্রতিদিনের বাজার দর
          </p>
          <h1 className="font-display text-3xl sm:text-5xl font-extrabold leading-tight mt-4 text-primary">
            বাজারে যাওয়ার আগেই জেনে নিন আজকের দাম
          </h1>
          <p className="mt-4 text-base sm:text-lg text-base-content/70 max-w-prose">
            চাল, ডাল, তেল, সবজি, মাছ ও মাংসের দাম কোথায় বাড়ল আর কোথায় কমল—দেশের প্রধান বাজারগুলোর তুলনাসহ এক জায়গায়।
          </p>
          <a href="#সব-পণ্য" className="btn btn-primary btn-lg mt-6">
            সব পণ্যের দাম দেখুন
          </a>
        </div>

        <div className="relative h-64 sm:h-80 rounded-2xl bg-primary/10" aria-hidden>
          <div className="absolute inset-0 grid place-items-center text-[7rem] sm:text-[9rem] leading-none">🧺</div>
          {TILES.map((t) => (
            <span
              key={t.e}
              className={`absolute ${t.c} grid place-items-center size-14 sm:size-16 rounded-2xl bg-base-100 border border-base-300 shadow text-3xl sm:text-4xl`}
            >
              {t.e}
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}
