"use client";
import { Suspense, useEffect, useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import toast from "react-hot-toast";
import AuthShell from "@/components/AuthShell";
import SocialButtons from "@/components/SocialButtons";
import { authClient } from "@/lib/auth-client";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function SignInForm() {
  const router = useRouter();
  const params = useSearchParams();
  const redirect = params.get("redirect");
  const target = redirect && redirect.startsWith("/") ? redirect : "/";
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    if (params.get("protected")) toast.error("এই পেজ দেখতে আগে সাইন ইন করুন", { id: "auth-required" });
  }, [params]);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    if (!EMAIL_RE.test(email)) return fail("সঠিক ইমেইল ঠিকানা দিন");
    if (!password) return fail("পাসওয়ার্ড দিন");
    setBusy(true);
    const { error: err } = await authClient.signIn.email({ email, password });
    setBusy(false);
    if (err) return fail(err.message || "ইমেইল বা পাসওয়ার্ড ভুল হয়েছে");
    toast.success("সফলভাবে সাইন ইন হয়েছে");
    router.push(target);
    router.refresh();
  }
  function fail(msg: string) {
    setError(msg);
    toast.error(msg);
  }

  return (
    <AuthShell title="সাইন ইন" subtitle="আপনার অ্যাকাউন্টে প্রবেশ করুন">
      <form onSubmit={onSubmit} className="grid gap-4" noValidate>
        <label className="form-control grid gap-1">
          <span className="text-sm font-medium">ইমেইল</span>
          <input type="email" className="input input-bordered w-full" value={email} onChange={(e) => setEmail(e.target.value)} autoComplete="email" placeholder="you@example.com" />
        </label>
        <label className="form-control grid gap-1">
          <span className="text-sm font-medium">পাসওয়ার্ড</span>
          <input type="password" className="input input-bordered w-full" value={password} onChange={(e) => setPassword(e.target.value)} autoComplete="current-password" placeholder="••••••••" />
        </label>
        {error && <p role="alert" className="text-sm text-error">{error}</p>}
        <button className="btn btn-primary w-full" disabled={busy}>
          {busy && <span className="loading loading-spinner loading-sm" />} সাইন ইন
        </button>
      </form>
      <div className="divider text-xs">অথবা</div>
      <SocialButtons callbackURL={target} />
      <p className="text-sm text-center mt-6">
        অ্যাকাউন্ট নেই?{" "}
        <Link href="/signup" className="link link-primary font-semibold">
          সাইন আপ করুন
        </Link>
      </p>
    </AuthShell>
  );
}

export default function SignInPage() {
  return (
    <Suspense fallback={<div className="max-w-md mx-auto px-4 py-12"><div className="skeleton h-96 w-full" /></div>}>
      <SignInForm />
    </Suspense>
  );
}
