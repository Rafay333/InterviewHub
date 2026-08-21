"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { FormEvent, useEffect, useState } from "react";
import { navLinks, popularLanguages } from "@/lib/home-data";
import { clearUserSession, getStoredUser, type PublicUser } from "@/lib/user-auth";

export function SiteHeader() {
  const pathname = usePathname();
  const router = useRouter();
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const [langsOpen, setLangsOpen] = useState(false);
  const [query, setQuery] = useState("");
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

  useEffect(() => {
    setOpen(false);
    setLangsOpen(false);
  }, [pathname]);

  const isActive = (href: string) => pathname === href || pathname.startsWith(`${href}/`);

  const firstName = user?.name?.split(" ")[0] || "there";
  const initial = (user?.name || "U").charAt(0).toUpperCase();

  const signOut = () => {
    clearUserSession();
    setUser(null);
    setOpen(false);
  };

  const onSearch = (e: FormEvent) => {
    e.preventDefault();
    const term = query.trim();
    router.push(term ? `/languages?q=${encodeURIComponent(term)}` : "/languages");
    setOpen(false);
  };

  return (
    <header
      className={`sticky top-0 z-50 border-b transition-shadow duration-300 ${
        scrolled
          ? "border-primary/20 bg-white/95 shadow-lg shadow-primary/10 backdrop-blur-md"
          : "border-primary/10 bg-white/90 backdrop-blur-sm"
      }`}
    >
      <div className="h-0.5 bg-gradient-to-r from-primary via-teal to-accent" />
      <div className="mx-auto flex h-16 max-w-6xl items-center gap-3 px-4 sm:h-[4.25rem] sm:px-6 lg:gap-5 lg:px-8">
        <Link href="/" className="flex shrink-0 items-center" aria-label="InterviewHub home">
          <Image
            src="/brand/interviewhub-logo.png"
            alt="Interview Hub — Connect. Practice. Succeed."
            width={220}
            height={60}
            className="h-10 w-auto sm:h-11"
            priority
          />
        </Link>

        <nav
          className="hidden min-w-0 flex-1 items-center justify-center md:flex"
          aria-label="Primary"
        >
          <div className="inline-flex items-center gap-0.5 rounded-full border border-primary/15 bg-surface-tint/80 p-1 shadow-inner">
            {navLinks.map((link) => {
              const active = isActive(link.href);
              const isLanguages = link.href === "/languages";
              if (isLanguages) {
                return (
                  <div
                    key={link.href}
                    className="relative"
                    onMouseEnter={() => setLangsOpen(true)}
                    onMouseLeave={() => setLangsOpen(false)}
                  >
                    <Link
                      href={link.href}
                      className={`inline-flex items-center gap-1 rounded-full px-3.5 py-1.5 text-sm font-semibold transition ${
                        active || langsOpen
                          ? "bg-white text-primary shadow-sm"
                          : "text-ink/75 hover:text-primary"
                      }`}
                      aria-expanded={langsOpen}
                      aria-haspopup="true"
                    >
                      {link.label}
                      <svg width="12" height="12" viewBox="0 0 12 12" fill="none" aria-hidden>
                        <path
                          d="M3 4.5L6 7.5L9 4.5"
                          stroke="currentColor"
                          strokeWidth="1.6"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                    </Link>
                    {langsOpen ? (
                      <div className="absolute left-1/2 top-full z-50 w-[22rem] -translate-x-1/2 pt-2">
                        <div className="rounded-2xl border border-primary/15 bg-white p-3 shadow-xl shadow-primary/15">
                          <p className="px-1 pb-2 text-[11px] font-bold uppercase tracking-[0.14em] text-muted">
                            Popular languages
                          </p>
                          <div className="grid grid-cols-3 gap-1">
                            {popularLanguages.map((lang) => (
                              <Link
                                key={lang.href}
                                href={lang.href}
                                className="rounded-lg px-2 py-1.5 text-sm font-medium text-ink/80 transition hover:bg-surface-tint hover:text-primary"
                              >
                                {lang.label}
                              </Link>
                            ))}
                          </div>
                          <Link
                            href="/languages"
                            className="mt-2 block rounded-lg bg-primary/10 px-3 py-2 text-center text-xs font-bold text-primary hover:bg-primary hover:text-white"
                          >
                            View all languages →
                          </Link>
                        </div>
                      </div>
                    ) : null}
                  </div>
                );
              }
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  aria-current={active ? "page" : undefined}
                  className={`rounded-full px-3.5 py-1.5 text-sm font-semibold transition ${
                    active ? "bg-white text-primary shadow-sm" : "text-ink/75 hover:text-primary"
                  }`}
                >
                  {link.label}
                </Link>
              );
            })}
          </div>
        </nav>

        <form
          onSubmit={onSearch}
          className="relative hidden min-w-[11rem] max-w-[16rem] flex-1 lg:block"
          role="search"
        >
          <svg
            className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-muted"
            width="15"
            height="15"
            viewBox="0 0 24 24"
            fill="none"
            aria-hidden
          >
            <circle cx="11" cy="11" r="7" stroke="currentColor" strokeWidth="2" />
            <path d="M20 20l-3.5-3.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
          </svg>
          <input
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search languages…"
            className="h-9 w-full rounded-full border border-primary/15 bg-surface-tint/70 py-0 pr-3 pl-9 text-sm text-ink outline-none transition placeholder:text-muted focus:border-primary focus:bg-white focus:ring-2 focus:ring-primary/20"
          />
        </form>

        <div className="ml-auto flex shrink-0 items-center gap-2 md:ml-0">
          <div className="hidden items-center gap-2 md:flex">
            {user ? (
              <>
                <span className="inline-flex items-center gap-2 rounded-full border border-primary/15 bg-surface-tint/80 py-0.5 pl-0.5 pr-3">
                  <span className="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-br from-primary to-primary-dark text-sm font-bold text-white">
                    {initial}
                  </span>
                  <span className="max-w-[8rem] truncate text-sm font-semibold text-navy">
                    Hi, {firstName}
                  </span>
                </span>
                <button
                  type="button"
                  onClick={signOut}
                  className="rounded-full px-3 py-1.5 text-sm font-semibold text-ink/70 transition hover:bg-surface-tint hover:text-primary"
                >
                  Sign out
                </button>
              </>
            ) : (
              <>
                <Link
                  href="/login"
                  className="rounded-full px-3.5 py-1.5 text-sm font-semibold text-ink/80 transition hover:bg-surface-tint hover:text-primary"
                >
                  Sign in
                </Link>
                <Link
                  href="/signup"
                  className="rounded-full bg-gradient-to-r from-primary to-primary-dark px-4 py-1.5 text-sm font-semibold text-white shadow-md shadow-primary/25 transition hover:opacity-95"
                >
                  Sign up
                </Link>
              </>
            )}
          </div>

          <button
            type="button"
            className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-primary/20 bg-white text-ink shadow-sm md:hidden"
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
          className="border-t border-primary/10 bg-white px-4 pb-4 pt-3 shadow-lg md:hidden"
          aria-label="Mobile"
        >
          <form onSubmit={onSearch} className="relative mb-3" role="search">
            <svg
              className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-muted"
              width="15"
              height="15"
              viewBox="0 0 24 24"
              fill="none"
              aria-hidden
            >
              <circle cx="11" cy="11" r="7" stroke="currentColor" strokeWidth="2" />
              <path
                d="M20 20l-3.5-3.5"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
              />
            </svg>
            <input
              type="search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search languages…"
              className="h-10 w-full rounded-xl border border-primary/15 bg-surface-tint py-0 pr-3 pl-9 text-sm outline-none focus:border-primary focus:bg-white"
            />
          </form>
          <ul className="flex flex-col gap-0.5">
            <li>
              <Link
                href="/"
                className={`block rounded-xl px-3 py-2.5 text-sm font-semibold ${
                  pathname === "/" ? "bg-surface-tint text-primary" : "text-ink hover:bg-surface-soft"
                }`}
                onClick={() => setOpen(false)}
              >
                Home
              </Link>
            </li>
            {navLinks.map((link) => {
              const active = isActive(link.href);
              return (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className={`block rounded-xl px-3 py-2.5 text-sm font-semibold ${
                      active ? "bg-surface-tint text-primary" : "text-ink hover:bg-surface-soft"
                    }`}
                    onClick={() => setOpen(false)}
                  >
                    {link.label}
                  </Link>
                </li>
              );
            })}
          </ul>
          <p className="mt-3 px-1 text-[11px] font-bold uppercase tracking-[0.14em] text-muted">
            Popular languages
          </p>
          <div className="mt-2 flex flex-wrap gap-1.5">
            {popularLanguages.slice(0, 8).map((lang) => (
              <Link
                key={lang.href}
                href={lang.href}
                onClick={() => setOpen(false)}
                className="rounded-full border border-primary/15 bg-surface-tint px-2.5 py-1 text-xs font-semibold text-navy hover:border-primary hover:text-primary"
              >
                {lang.label}
              </Link>
            ))}
          </div>
          {user ? (
            <div className="mt-3 border-t border-border pt-3">
              <p className="px-1 text-sm font-semibold text-navy">Signed in as {user.name}</p>
              <button
                type="button"
                onClick={signOut}
                className="mt-2 w-full rounded-xl px-3 py-2.5 text-left text-sm font-semibold text-ink hover:bg-surface-soft"
              >
                Sign out
              </button>
            </div>
          ) : (
            <div className="mt-3 grid grid-cols-2 gap-2 border-t border-border pt-3">
              <Link
                href="/login"
                className="rounded-xl border border-primary/20 px-3 py-2.5 text-center text-sm font-semibold text-navy"
                onClick={() => setOpen(false)}
              >
                Sign in
              </Link>
              <Link
                href="/signup"
                className="rounded-xl bg-primary px-3 py-2.5 text-center text-sm font-semibold text-white"
                onClick={() => setOpen(false)}
              >
                Sign up
              </Link>
            </div>
          )}
        </nav>
      ) : null}
    </header>
  );
}
