export default function AuthShell({ title, subtitle, children }: { title: string; subtitle: string; children: React.ReactNode }) {
  return (
    <div className="max-w-md mx-auto px-4 py-12">
      <div className="rounded-3xl bg-base-100 border border-base-300 p-6 sm:p-8">
        <h1 className="font-display text-3xl font-bold text-primary">{title}</h1>
        <p className="text-base-content/70 mt-1 mb-6">{subtitle}</p>
        {children}
      </div>
    </div>
  );
}
