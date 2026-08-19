"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { navLinks } from "@/lib/home-data";
import { clearUserSession, getStoredUser, type PublicUser } from "@/lib/user-auth";

export function SiteHeader() {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const [user, setUser] = useState<PublicUser | null>(null);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    const sync = () => setUser(getStoredUser());
    sync();
    window.addEventListener("interviewhub-auth", sync);
    window.addEventListener("storage", sync);
    return () => {
      window.removeEventListener("interviewhub-auth", sync);
      window.removeEventListener("storage", sync);
    };
  }, [pathname]);

  const isActive = (href: string) =>
    href === "/" ? pathname === "/" : pathname.startsWith(href);

  const firstName = user?.name?.split(" ")[0] || "there";
  const initial = (user?.name || "U").charAt(0).toUpperCase();

  const signOut = () => {
    clearUserSession();
    setUser(null);
    setOpen(false);
  };

  return (
    <header
      className={`sticky top-0 z-50 border-b transition-shadow duration-300 ${
        scrolled
          ? "border-primary/15 bg-white/95 shadow-md shadow-primary/5 backdrop-blur-md"
          : "border-primary/10 bg-gradient-to-r from-surface-tint/90 via-white/90 to-[#fff7ed]/90 backdrop-blur-sm"
      }`}
    >
      <div className="mx-auto flex h-[4.5rem] max-w-6xl items-center justify-between gap-4 px-4 sm:h-20 sm:px-6 lg:px-8">
        <Link href="/" className="flex shrink-0 items-center" aria-label="InterviewHub home">
          <Image
            src="/brand/interviewhub-logo.png"
            alt="Interview Hub — Connect. Practice. Succeed."
            width={260}
            height={72}
            className="h-12 w-auto sm:h-14"
            priority
          />
        </Link>

        <nav className="hidden items-center gap-7 md:flex" aria-label="Primary">
          {navLinks.map((link) => {
            const active = isActive(link.href);
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`text-sm font-medium transition-colors hover:text-primary ${
                  active ? "text-primary" : "text-ink/80"
                }`}
              >
                {link.label}
              </Link>
            );
          })}
        </nav>

        <div className="flex items-center gap-2 sm:gap-3">
          <div className="hidden items-center gap-2 md:flex">
            {user ? (
              <>
                <span className="inline-flex items-center gap-2 rounded-full border border-primary/15 bg-surface-tint/80 py-1 pl-1 pr-3">
                  <span className="flex h-8 w-8 items-center justify-center rounded-full bg-primary text-sm font-bold text-white">
                    {initial}
                  </span>
                  <span className="max-w-[9rem] truncate text-sm font-semibold text-navy">
                    Hi, {firstName}
                  </span>
                </span>
                <button
                  type="button"
                  onClick={signOut}
                  className="rounded-lg px-3 py-2 text-sm font-semibold text-ink/80 transition-colors hover:text-primary"
                >
                  Sign out
                </button>
              </>
            ) : (
              <>
                <Link
                  href="/login"
                  className="rounded-lg px-3 py-2 text-sm font-semibold text-ink/80 transition-colors hover:text-primary"
                >
                  Sign in
                </Link>
                <Link
                  href="/signup"
                  className="rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-primary-dark"
                >
                  Sign up
                </Link>
              </>
            )}
          </div>

          <button
            type="button"
            className="inline-flex h-10 w-10 items-center justify-center rounded-lg border border-border text-ink md:hidden"
            aria-expanded={open}
            aria-controls="mobile-nav"
            aria-label={open ? "Close menu" : "Open menu"}
            onClick={() => setOpen((value) => !value)}
          >
            <span className="sr-only">Menu</span>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden>
              {open ? (
                <path
                  d="M6 6l12 12M18 6L6 18"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                />
              ) : (
                <path
                  d="M4 7h16M4 12h16M4 17h16"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                />
              )}
            </svg>
          </button>
        </div>
      </div>

      {open ? (
        <nav
          id="mobile-nav"
          className="border-t border-border bg-surface px-4 py-3 md:hidden"
          aria-label="Mobile"
        >
          <ul className="flex flex-col gap-1">
            {navLinks.map((link) => {
              const active = isActive(link.href);
              return (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className={`block rounded-lg px-3 py-2.5 text-sm font-medium ${
                      active ? "bg-surface-tint text-primary" : "text-ink hover:bg-surface-soft"
                    }`}
                    onClick={() => setOpen(false)}
                  >
                    {link.label}
                  </Link>
                </li>
              );
            })}
            {user ? (
              <>
                <li className="mt-2 border-t border-border px-3 pt-3 text-sm font-semibold text-navy">
                  Signed in as {user.name}
                </li>
                <li>
                  <button
                    type="button"
                    onClick={signOut}
                    className="mt-1 block w-full rounded-lg px-3 py-2.5 text-left text-sm font-semibold text-ink hover:bg-surface-soft"
                  >
                    Sign out
                  </button>
                </li>
              </>
            ) : (
              <>
                <li className="mt-2 border-t border-border pt-2">
                  <Link
                    href="/login"
                    className="block rounded-lg px-3 py-2.5 text-sm font-semibold text-ink hover:bg-surface-soft"
                    onClick={() => setOpen(false)}
                  >
                    Sign in
                  </Link>
                </li>
                <li>
                  <Link
                    href="/signup"
                    className="mt-1 block rounded-lg bg-primary px-3 py-2.5 text-center text-sm font-semibold text-white"
                    onClick={() => setOpen(false)}
                  >
                    Sign up
                  </Link>
                </li>
              </>
            )}
          </ul>
        </nav>
      ) : null}
    </header>
  );
}
