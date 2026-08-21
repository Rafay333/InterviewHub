"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { isAdminAuthenticated, setAdminSession } from "@/lib/admin/auth";
import { adminNav } from "@/lib/admin/nav";
import { heroWashClass } from "@/lib/theme";

const navIcons: Record<string, string> = {
  "/admin": "◈",
  "/admin/languages": "⟨/⟩",
  "/admin/categories": "▣",
  "/admin/questions": "?",
  "/admin/blogs": "✎",
  "/admin/media": "▦",
  "/admin/users": "◎",
  "/admin/settings": "⚙",
};

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
      router.replace("/login");
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
        Loading…
      </div>
    );
  }

  const isActive = (href: string, exact?: boolean) =>
    exact ? pathname === href : pathname === href || pathname.startsWith(`${href}/`);

  const logout = () => {
    setAdminSession(null);
    router.replace("/login");
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
        className={`fixed inset-y-0 left-0 z-50 flex w-64 flex-col border-r border-primary/15 bg-white/95 shadow-xl shadow-primary/10 backdrop-blur-md transition-transform lg:static lg:translate-x-0 ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="relative overflow-hidden border-b border-primary/10 px-4 py-5">
          <div
            className="pointer-events-none absolute inset-0 bg-gradient-to-br from-primary/15 via-white to-accent/15"
            aria-hidden
          />
          <div className="relative">
            <Link href="/admin" className="inline-flex items-center gap-2">
              <Image
                src="/brand/interviewhub-logo.png"
                alt="InterviewHub"
                width={240}
                height={66}
                className="h-12 w-auto"
              />
            </Link>
            <p className="mt-2 inline-flex rounded-full bg-accent/15 px-2.5 py-0.5 text-[11px] font-bold uppercase tracking-wide text-accent">
              Admin CMS
            </p>
          </div>
        </div>

        <nav className="flex-1 space-y-1 overflow-y-auto p-3">
          {adminNav.map((item) => {
            const active = isActive(item.href, "exact" in item ? item.exact : false);
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setSidebarOpen(false)}
                className={`flex items-center gap-2.5 rounded-xl px-3 py-2.5 text-sm font-semibold transition ${
                  active
                    ? "bg-gradient-to-r from-primary to-primary-dark text-white shadow-md shadow-primary/30"
                    : "text-ink/80 hover:bg-gradient-to-r hover:from-surface-tint hover:to-[#fff7ed] hover:text-primary"
                }`}
              >
                <span
                  className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-lg text-[11px] font-bold ${
                    active ? "bg-white/20 text-white" : "bg-primary/10 text-primary"
                  }`}
                  aria-hidden
                >
                  {navIcons[item.href] || "•"}
                </span>
                {item.label}
              </Link>
            );
          })}
        </nav>

        <div className="space-y-1 border-t border-primary/10 bg-gradient-to-t from-surface-tint/50 to-transparent p-3">
          <Link
            href="/"
            className="block rounded-xl px-3 py-2 text-sm font-semibold text-primary transition hover:bg-primary/10"
          >
            View public site →
          </Link>
          <button
            type="button"
            onClick={logout}
            className="w-full rounded-xl px-3 py-2 text-left text-sm font-semibold text-hard transition hover:bg-hard/10"
          >
            Logout
          </button>
        </div>
      </aside>

      <div className="flex min-w-0 flex-1 flex-col">
        <header className="sticky top-0 z-30 flex h-14 items-center gap-3 border-b border-primary/12 bg-white/90 px-4 shadow-sm shadow-primary/5 backdrop-blur-md">
          <button
            type="button"
            className="rounded-xl border border-primary/20 bg-gradient-to-r from-surface-tint to-white px-2.5 py-1.5 text-sm font-semibold text-navy lg:hidden"
            onClick={() => setSidebarOpen(true)}
          >
            Menu
          </button>
          <div className="flex-1">
            <input
              type="search"
              placeholder="Search languages, questions, blogs…"
              className="w-full max-w-md rounded-xl border border-primary/15 bg-gradient-to-r from-surface-tint/80 to-white px-3 py-2 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/15"
            />
          </div>
          <div className="flex items-center gap-2 text-sm">
            <span className="hidden rounded-full border border-primary/15 bg-surface-tint/80 px-3 py-1 font-medium text-navy sm:inline">
              admin@interviewhub.com
            </span>
            <span className="flex h-9 w-9 items-center justify-center rounded-full bg-gradient-to-br from-primary to-accent text-xs font-bold text-white shadow-md shadow-primary/30">
              A
            </span>
          </div>
        </header>
        <main className="flex-1 p-4 sm:p-6">{children}</main>
      </div>
    </div>
  );
}
