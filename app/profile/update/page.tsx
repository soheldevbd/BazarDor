"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import AuthShell from "@/components/AuthShell";
import RequireAuth from "@/components/RequireAuth";
import { authClient } from "@/lib/auth-client";

function UpdateForm() {
  const router = useRouter();
  const { data } = authClient.useSession();
  const [name, setName] = useState("");
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    if (data?.user?.name) setName((n) => n || data.user.name);
  }, [data]);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (name.trim().length < 2) return void toast.error("নাম কমপক্ষে ২ অক্ষরের হতে হবে");
    setBusy(true);
    // https://better-auth.com/docs/concepts/users-accounts#update-user
    const { error } = await authClient.updateUser({ name: name.trim() });
    setBusy(false);
    if (error) return void toast.error(error.message || "তথ্য আপডেট করা যায়নি");
    toast.success("তথ্য সফলভাবে আপডেট হয়েছে");
    router.push("/profile");
  }

  return (
    <AuthShell title="তথ্য আপডেট" subtitle="আপনার নাম বদলে নিন">
      <form onSubmit={onSubmit} className="grid gap-4" noValidate>
        <label className="grid gap-1">
          <span className="text-sm font-medium">নাম</span>
          <input className="input input-bordered w-full" value={name} onChange={(e) => setName(e.target.value)} autoComplete="name" />
        </label>
        <button className="btn btn-primary w-full" disabled={busy}>
          {busy && <span className="loading loading-spinner loading-sm" />} তথ্য আপডেট করুন
        </button>
        <Link href="/profile" className="btn btn-ghost w-full">
          বাতিল
        </Link>
      </form>
    </AuthShell>
  );
}

export default function UpdatePage() {
  return (
    <RequireAuth>
      <UpdateForm />
    </RequireAuth>
  );
}
