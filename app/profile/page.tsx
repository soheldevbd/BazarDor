"use client";
import Link from "next/link";
import RequireAuth from "@/components/RequireAuth";
import { authClient } from "@/lib/auth-client";

function Profile() {
  const { data } = authClient.useSession();
  const user = data?.user;
  if (!user) return null;
  return (
    <div className="max-w-xl mx-auto px-4 py-12">
      <div className="rounded-3xl bg-base-100 border border-base-300 p-6 sm:p-8 text-center">
        <div className="avatar avatar-placeholder mb-4">
          <div className="bg-primary text-primary-content w-24 rounded-full text-4xl overflow-hidden">
            {user.image ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={user.image} alt="" referrerPolicy="no-referrer" />
            ) : (
              <span>{user.name?.charAt(0).toUpperCase()}</span>
            )}
          </div>
        </div>
        <h1 className="font-display text-3xl font-bold">{user.name}</h1>
        <p className="text-base-content/70 mt-1 break-all">{user.email}</p>
        <Link href="/profile/update" className="btn btn-primary mt-6">
          তথ্য আপডেট করুন
        </Link>
      </div>
    </div>
  );
}

export default function ProfilePage() {
  return (
    <RequireAuth>
      <Profile />
    </RequireAuth>
  );
}
