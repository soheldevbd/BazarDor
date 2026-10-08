"use client";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { authClient } from "@/lib/auth-client";
import { CATEGORIES } from "@/lib/constants";

export default function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  const { data: session, isPending } = authClient.useSession();
  const [date, setDate] = useState("");

  useEffect(() => {
    setDate(
      new Intl.DateTimeFormat("bn-BD", {
        weekday: "long",
        day: "numeric",
        month: "long",
        year: "numeric",
      }).format(new Date()),
    );
  }, []);

  async function signOut() {
    await authClient.signOut({
      fetchOptions: {
        onSuccess: () => {
          toast.success("সফলভাবে সাইন আউট হয়েছে");
          router.push("/");
          router.refresh();
        },
        onError: () => {
          toast.error("সাইন আউট করা যায়নি, আবার চেষ্টা করুন");
        },
      },
    });
  }

  const user = session?.user;

  return (
    <header className="bg-base-100 border-b border-base-300 sticky top-0 z-40">
      <div className="max-w-6xl mx-auto px-4">
        <div className="flex items-center justify-between gap-3 py-3">
          <Link href="/" className="leading-tight" aria-label="বাজার দর — হোম">
            <span className="font-display text-2xl sm:text-3xl font-bold text-primary">🛒 বাজার দর</span>
            <span className="block text-xs sm:text-sm text-base-content/60 min-h-4">{date}</span>
          </Link>

          <div className="flex items-center gap-2">
            {isPending ? (
              <div className="skeleton h-9 w-28 rounded-full" />
            ) : user ? (
              <div className="dropdown dropdown-end">
                <button tabIndex={0} className="btn btn-ghost btn-sm sm:btn-md gap-2 px-2" aria-label="প্রোফাইল মেনু">
                  <span className="avatar avatar-placeholder">
                    <span className="bg-primary text-primary-content w-8 rounded-full overflow-hidden">
                      {user.image ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img src={user.image} alt="" referrerPolicy="no-referrer" />
                      ) : (
                        <span>{user.name?.charAt(0).toUpperCase()}</span>
                      )}
                    </span>
                  </span>
                  <span className="hidden sm:inline max-w-32 truncate">{user.name}</span>
                </button>
                <ul tabIndex={0} className="dropdown-content menu bg-base-100 rounded-box shadow-lg border border-base-300 w-48 p-2 mt-2 z-50">
                  <li>
                    <Link href="/profile">আমার প্রোফাইল</Link>
                  </li>
                  <li>
                    <button onClick={signOut}>সাইন আউট</button>
                  </li>
                </ul>
              </div>
            ) : (
              <>
                <Link href="/signin" className="btn btn-outline btn-primary btn-sm sm:btn-md">
                  সাইন ইন
                </Link>
                <Link href="/signup" className="btn btn-primary btn-sm sm:btn-md">
                  সাইন আপ
                </Link>
              </>
            )}
          </div>
        </div>

        <nav aria-label="পণ্যের ধরন" className="overflow-x-auto no-scrollbar -mx-4 px-4 pb-3">
          <ul className="flex sm:justify-center gap-2 w-max sm:w-full mx-auto">
            <li>
              <Link href="/" className={`btn btn-sm rounded-full ${pathname === "/" ? "btn-primary" : "btn-ghost"}`}>
                সব পণ্য
              </Link>
            </li>
            {CATEGORIES.map((c) => {
              const active = pathname === `/category/${c.slug}`;
              return (
                <li key={c.slug}>
                  <Link
                    href={`/category/${c.slug}`}
                    aria-current={active ? "page" : undefined}
                    className={`btn btn-sm rounded-full whitespace-nowrap ${active ? "btn-primary" : "btn-ghost"}`}
                  >
                    <span aria-hidden>{c.icon}</span> {c.nameBn}
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>
      </div>
    </header>
  );
}
