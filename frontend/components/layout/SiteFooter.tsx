import Image from "next/image";
import Link from "next/link";
import { interviewCompanies, popularLanguages } from "@/lib/home-data";
import { siteContact } from "@/lib/site-pages";

const exploreLinks = [
  { href: "/", label: "Home" },
  { href: "/languages", label: "Languages" },
  { href: "/categories", label: "Categories" },
  { href: "/blog", label: "Blog" },
  { href: "/about", label: "About" },
  { href: "/contact", label: "Contact" },
] as const;

export function SiteFooter() {
  const year = new Date().getFullYear();

  return (
    <footer className="mt-auto bg-navy text-white">
      <div className="h-1 bg-gradient-to-r from-primary via-teal to-accent" />

      <div className="mx-auto max-w-6xl px-4 pt-10 pb-6 sm:px-6 lg:px-8">
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4 lg:gap-6">
          <div>
            <Link href="/" className="inline-flex rounded-xl bg-white px-3 py-2 shadow-sm">
              <Image
                src="/brand/interviewhub-logo.png"
                alt="Interview Hub"
                width={280}
                height={78}
                className="h-12 w-auto sm:h-14"
              />
            </Link>
            <p className="mt-3 text-sm leading-relaxed text-blue-100/90">
              Practice real interview questions by language and category. Connect. Practice.
              Succeed.
            </p>
            <p className="mt-3 text-xs font-semibold uppercase tracking-[0.14em] text-accent">
              {siteContact.location}
            </p>
          </div>

          <div>
            <h2 className="text-xs font-bold uppercase tracking-[0.16em] text-accent">Explore</h2>
            <ul className="mt-3 grid grid-cols-2 gap-x-3 gap-y-2">
              {exploreLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-blue-100 transition-colors hover:text-white"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h2 className="text-xs font-bold uppercase tracking-[0.16em] text-accent">
              Popular languages
            </h2>
            <ul className="mt-3 grid grid-cols-2 gap-x-3 gap-y-2">
              {popularLanguages.map((lang) => (
                <li key={lang.href}>
                  <Link
                    href={lang.href}
                    className="text-sm text-blue-100 transition-colors hover:text-white"
                  >
                    {lang.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h2 className="text-xs font-bold uppercase tracking-[0.16em] text-accent">
              Get in touch
            </h2>
            <p className="mt-3 text-sm font-semibold text-white">{siteContact.founderName}</p>
            <a
              href={`mailto:${siteContact.email}`}
              className="mt-1 block text-sm text-blue-100 transition-colors hover:text-white"
            >
              {siteContact.email}
            </a>
            <a
              href={siteContact.githubUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-2 inline-flex text-sm text-blue-100 transition-colors hover:text-white"
            >
              GitHub @{siteContact.githubHandle}
            </a>
            <Link
              href="/contact"
              className="mt-4 inline-flex rounded-full bg-white/10 px-3 py-1.5 text-xs font-bold text-white ring-1 ring-white/15 transition hover:bg-accent"
            >
              Send a message
            </Link>
          </div>
        </div>

        <div className="mt-8 rounded-2xl border border-white/10 bg-white/5 px-4 py-4">
          <p className="text-[11px] font-bold uppercase tracking-[0.16em] text-accent">
            Prep for teams at
          </p>
          <div className="mt-3 flex flex-wrap gap-2">
            {interviewCompanies.map((company) => (
              <span
                key={company}
                className="rounded-full border border-white/15 bg-white/5 px-3 py-1 text-xs font-semibold text-blue-100"
              >
                {company}
              </span>
            ))}
          </div>
        </div>
      </div>

      <div className="border-t border-white/10 bg-black/20">
        <div className="mx-auto flex max-w-6xl flex-col gap-2 px-4 py-4 text-sm text-blue-100 sm:flex-row sm:items-center sm:justify-between sm:px-6 lg:px-8">
          <p>
            © {year} InterviewHub · Built by{" "}
            <span className="font-semibold text-white">{siteContact.founderName}</span>
          </p>
          <div className="flex flex-wrap items-center gap-x-4 gap-y-1">
            <a href={`mailto:${siteContact.email}`} className="font-medium hover:text-white">
              {siteContact.email}
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
