"use client";
import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import AuthShell from "@/components/AuthShell";
import SocialButtons from "@/components/SocialButtons";
import { authClient } from "@/lib/auth-client";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export default function SignUpPage() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  function fail(msg: string) {
    setError(msg);
    toast.error(msg);
  }

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    if (name.trim().length < 2) return fail("নাম কমপক্ষে ২ অক্ষরের হতে হবে");
    if (!EMAIL_RE.test(email)) return fail("সঠিক ইমেইল ঠিকানা দিন");
    if (password.length < 8) return fail("পাসওয়ার্ড কমপক্ষে ৮ অক্ষরের হতে হবে");
    setBusy(true);
    const { error: err } = await authClient.signUp.email({ name: name.trim(), email, password });
    setBusy(false);
    if (err) return fail(err.message || "রেজিস্ট্রেশন করা যায়নি");
    toast.success("অ্যাকাউন্ট তৈরি হয়েছে। এখন সাইন ইন করুন");
    router.push("/signin");
  }

  return (
    <AuthShell title="সাইন আপ" subtitle="নতুন অ্যাকাউন্ট খুলুন">
      <form onSubmit={onSubmit} className="grid gap-4" noValidate>
        <label className="grid gap-1">
          <span className="text-sm font-medium">নাম</span>
          <input className="input input-bordered w-full" value={name} onChange={(e) => setName(e.target.value)} autoComplete="name" placeholder="আপনার নাম" />
        </label>
        <label className="grid gap-1">
          <span className="text-sm font-medium">ইমেইল</span>
          <input type="email" className="input input-bordered w-full" value={email} onChange={(e) => setEmail(e.target.value)} autoComplete="email" placeholder="you@example.com" />
        </label>
        <label className="grid gap-1">
          <span className="text-sm font-medium">পাসওয়ার্ড</span>
          <input type="password" className="input input-bordered w-full" value={password} onChange={(e) => setPassword(e.target.value)} autoComplete="new-password" placeholder="কমপক্ষে ৮ অক্ষর" />
        </label>
        {error && <p role="alert" className="text-sm text-error">{error}</p>}
        <button className="btn btn-primary w-full" disabled={busy}>
          {busy && <span className="loading loading-spinner loading-sm" />} সাইন আপ
        </button>
      </form>
      <div className="divider text-xs">অথবা</div>
      <SocialButtons callbackURL="/" />
      <p className="text-sm text-center mt-6">
        আগে থেকেই অ্যাকাউন্ট আছে?{" "}
        <Link href="/signin" className="link link-primary font-semibold">
          সাইন ইন করুন
        </Link>
      </p>
    </AuthShell>
  );
}
