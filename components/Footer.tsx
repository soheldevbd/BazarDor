export default function Footer() {
  return (
    <footer className="bg-neutral text-neutral-content mt-16">
      <div className="max-w-6xl mx-auto px-4 py-8 flex flex-col md:flex-row gap-3 md:items-center md:justify-between text-sm">
        <p>
          <span className="font-display font-bold text-base">বাজার দর</span> — প্রয়োজনীয় পণ্যের দাম এক নজরে।
        </p>
        <p className="text-neutral-content/70">সকল দাম সম্ভাব্য; বাজার অবস্থার ওপর নির্ভর করে পরিবর্তিত হয়।</p>
      </div>
    </footer>
  );
}
