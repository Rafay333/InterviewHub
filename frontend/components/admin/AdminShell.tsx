"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { isAdminAuthenticated, setAdminAuthenticated } from "@/lib/admin/auth";
import { adminNav } from "@/lib/admin/nav";
import { heroWashClass } from "@/lib/theme";

export function AdminShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const [ready, setReady] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const isLogin = pathname === "/admin/login";

  useEffect(() => {
    if (isLogin) {
      setReady(true);
      return;
    }
    if (!isAdminAuthenticated()) {
      router.replace("/admin/login");
      return;
    }
    setReady(true);
  }, [isLogin, pathname, router]);

  if (isLogin) {
    return <>{children}</>;
  }

  if (!ready) {
    return (
      <div
        className={`flex min-h-screen items-center justify-center text-sm text-muted ${heroWashClass}`}
      >
        Loading admin…
      </div>
    );
  }

  const isActive = (href: string, exact?: boolean) =>
    exact ? pathname === href : pathname === href || pathname.startsWith(`${href}/`);

  const logout = () => {
    setAdminAuthenticated(false);
    router.replace("/admin/login");
  };

  return (
    <div className={`flex min-h-screen text-ink ${heroWashClass}`}>
      {sidebarOpen ? (
        <button
          type="button"
          aria-label="Close sidebar"
          className="fixed inset-0 z-40 bg-navy/40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      ) : null}

      <aside
        className={`fixed inset-y-0 left-0 z-50 flex w-64 flex-col border-r border-primary/10 bg-white/95 shadow-lg shadow-primary/5 backdrop-blur-md transition-transform lg:static lg:translate-x-0 ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="border-b border-primary/10 bg-gradient-to-r from-surface-tint via-white to-[#fff7ed] px-4 py-4">
          <Link href="/admin" className="inline-flex items-center gap-2">
            <Image
              src="/brand/interviewhub-logo.png"
              alt="InterviewHub"
              width={160}
              height={44}
              className="h-9 w-auto"
            />
          </Link>
          <p className="mt-1 text-xs font-semibold uppercase tracking-wide text-accent">
            Admin CMS
          </p>
        </div>

        <nav className="flex-1 space-y-1 overflow-y-auto p-3">
          {adminNav.map((item) => {
            const active = isActive(item.href, "exact" in item ? item.exact : false);
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setSidebarOpen(false)}
                className={`block rounded-lg px-3 py-2 text-sm font-semibold transition ${
                  active
                    ? "bg-primary text-white shadow-sm shadow-primary/30"
                    : "text-ink/80 hover:bg-surface-tint hover:text-primary"
                }`}
              >
                {item.label}
              </Link>
            );
          })}
        </nav>

        <div className="border-t border-primary/10 p-3">
          <Link
            href="/"
            className="mb-1 block rounded-lg px-3 py-2 text-sm font-medium text-primary hover:bg-surface-tint"
          >
            View public site
          </Link>
          <button
            type="button"
            onClick={logout}
            className="w-full rounded-lg px-3 py-2 text-left text-sm font-medium text-hard hover:bg-red-50"
          >
            Logout
          </button>
        </div>
      </aside>

      <div className="flex min-w-0 flex-1 flex-col">
        <header className="sticky top-0 z-30 flex h-14 items-center gap-3 border-b border-primary/10 bg-white/90 px-4 shadow-sm shadow-primary/5 backdrop-blur-md">
          <button
            type="button"
            className="rounded-lg border border-primary/20 bg-white px-2.5 py-1 text-sm font-medium text-navy lg:hidden"
            onClick={() => setSidebarOpen(true)}
          >
            Menu
          </button>
          <div className="flex-1">
            <input
              type="search"
              placeholder="Search languages, questions, blogs…"
              className="w-full max-w-md rounded-lg border border-primary/15 bg-surface-tint/60 px-3 py-1.5 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/15"
            />
          </div>
          <div className="flex items-center gap-2 text-sm">
            <span className="hidden sm:inline text-muted">admin@interviewhub.com</span>
            <span className="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-br from-primary to-accent text-xs font-bold text-white shadow-sm">
              A
            </span>
          </div>
        </header>
        <main className="flex-1 p-4 sm:p-6">{children}</main>
      </div>
    </div>
  );
}
