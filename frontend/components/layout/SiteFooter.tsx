import Image from "next/image";
import Link from "next/link";
import { siteContact } from "@/lib/site-pages";

const platformLinks = [
  { href: "/languages", label: "Languages" },
  { href: "/categories", label: "Categories" },
  { href: "/blog", label: "Blog" },
] as const;

const resourceLinks = [
  { href: "/about", label: "About" },
  { href: "/contact", label: "Contact" },
  { href: "/privacy", label: "Privacy" },
] as const;

export function SiteFooter() {
  const year = new Date().getFullYear();

  return (
    <footer className="bg-gradient-to-br from-primary via-primary-dark to-navy text-white">
      <div className="mx-auto grid max-w-6xl gap-10 px-4 py-14 sm:px-6 md:grid-cols-3 lg:px-8">
        <div className="space-y-4">
          <div className="inline-flex rounded-xl bg-white px-3 py-2 shadow-sm">
            <Image
              src="/brand/interviewhub-logo.png"
              alt="Interview Hub"
              width={220}
              height={62}
              className="h-12 w-auto sm:h-14"
            />
          </div>
          <p className="max-w-xs text-sm leading-relaxed text-blue-100">
            Practice real interview questions across languages and categories.
            Connect. Practice. Succeed.
          </p>
          <p className="text-sm text-blue-100">{siteContact.location}</p>
          <div className="flex flex-wrap gap-4">
            <a
              href={`mailto:${siteContact.email}`}
              className="text-sm text-blue-100 transition-colors hover:text-white"
            >
              {siteContact.email}
            </a>
            <a
              href={siteContact.githubUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm text-blue-100 transition-colors hover:text-white"
            >
              GitHub
            </a>
          </div>
        </div>

        <div>
          <h2 className="text-xs font-semibold uppercase tracking-wider text-accent">
            Platform
          </h2>
          <ul className="mt-4 space-y-2.5">
            {platformLinks.map((link) => (
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
          <h2 className="text-xs font-semibold uppercase tracking-wider text-accent">
            Resources
          </h2>
          <ul className="mt-4 space-y-2.5">
            {resourceLinks.map((link) => (
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
      </div>

      <div className="border-t border-white/15">
        <div className="mx-auto flex max-w-6xl flex-col gap-3 px-4 py-5 text-sm text-blue-100 sm:flex-row sm:items-center sm:justify-between sm:px-6 lg:px-8">
          <p>© {year} InterviewHub. All rights reserved.</p>
          <div className="flex flex-wrap gap-4">
            <Link href="/privacy" className="hover:text-white">
              Privacy Policy
            </Link>
            <Link href="/cookies" className="hover:text-white">
              Cookie Policy
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
