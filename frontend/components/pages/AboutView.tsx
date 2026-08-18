import Image from "next/image";
import Link from "next/link";
import { aboutHighlights, learnerFeedback, siteContact } from "@/lib/site-pages";
import { heroWashClass } from "@/lib/theme";

export function AboutView() {
  return (
    <div className="relative overflow-hidden">
      <div className={`pointer-events-none absolute inset-0 ${heroWashClass}`} aria-hidden />
      <div
        className="pointer-events-none absolute -right-16 top-0 h-80 w-80 rounded-full bg-accent/15 blur-3xl"
        aria-hidden
      />
      <div
        className="pointer-events-none absolute -left-20 bottom-1/3 h-56 w-56 rounded-full bg-primary/10 blur-3xl"
        aria-hidden
      />

      <div className="relative mx-auto max-w-6xl px-4 py-12 sm:px-6 sm:py-14 lg:px-8 lg:py-16">
        <header className="grid items-center gap-8 lg:grid-cols-2 lg:gap-10">
          <div className="order-2 lg:order-1">
            <p className="inline-flex items-center gap-1.5 rounded-full border border-primary/20 bg-white/80 px-3 py-1 text-xs font-semibold uppercase tracking-[0.16em] text-primary shadow-sm">
              <span aria-hidden>✦</span> About InterviewHub
            </p>
            <h1 className="mt-4 text-3xl font-bold tracking-tight text-navy sm:text-4xl lg:text-5xl">
              Built to help you walk into the interview prepared
            </h1>
            <p className="mt-4 max-w-lg text-sm leading-relaxed text-muted sm:text-base">
              InterviewHub is a practice site for technical interviews — real questions by
              language and category, with answers you can actually say out loud. Built in{" "}
              {siteContact.location} by {siteContact.founderName}. Connect. Practice. Succeed.
            </p>
            <div className="mt-7 flex flex-wrap gap-3">
              <Link
                href="/languages"
                className="inline-flex h-11 items-center rounded-xl bg-primary px-5 text-sm font-semibold text-white shadow-sm shadow-primary/25 transition hover:bg-primary-dark"
              >
                Browse languages
              </Link>
              <Link
                href="/contact"
                className="inline-flex h-11 items-center rounded-xl border border-primary/20 bg-white px-5 text-sm font-semibold text-navy transition hover:border-primary hover:text-primary"
              >
                Contact us
              </Link>
            </div>
          </div>

          <div className="order-1 relative mx-auto w-full max-w-md lg:order-2 lg:max-w-none lg:justify-self-end">
            <div
              className="pointer-events-none absolute left-1/2 top-1/2 -z-10 h-[80%] w-[80%] -translate-x-1/2 -translate-y-1/2 rounded-full bg-gradient-to-br from-primary/15 via-white/50 to-accent/20 blur-2xl"
              aria-hidden
            />
            <Image
              src="/hero-interview.png"
              alt="Developer preparing for a technical interview"
              width={960}
              height={960}
              priority
              className="h-auto w-full object-contain object-center drop-shadow-md lg:scale-105"
            />
          </div>
        </header>

        <section className="mt-16">
          <h2 className="text-2xl font-bold text-navy">Why this exists</h2>
          <p className="mt-3 max-w-3xl text-sm leading-relaxed text-muted sm:text-base">
            Interview prep gets noisy fast: inflated stats, endless problem dumps, and answers
            that only work if the interviewer never follows up. We keep the pages quiet and
            useful — one hub per language or topic, three difficulty levels, and explanations
            that hold up when someone asks “why?”
          </p>

          <div className="mt-8 grid gap-4 sm:grid-cols-2">
            {aboutHighlights.map((item) => (
              <article
                key={item.title}
                className="rounded-2xl border border-primary/10 bg-white p-5 shadow-sm"
              >
                <h3 className="font-bold text-navy">{item.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-muted">{item.text}</p>
              </article>
            ))}
          </div>
        </section>

        <section className="mt-16 rounded-3xl border border-primary/10 bg-white p-6 shadow-sm sm:p-8">
          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-primary">
            Founder
          </p>
          <h2 className="mt-2 text-2xl font-bold text-navy">{siteContact.founderName}</h2>
          <p className="mt-3 max-w-3xl text-sm leading-relaxed text-muted sm:text-base">
            {siteContact.founderName} builds InterviewHub from {siteContact.location}, working
            with React, Flutter, and Next.js. The goal is a quieter library of interview
            questions — answers you can defend, not another noisy dump of problems.
          </p>
          <div className="mt-5 flex flex-wrap gap-3">
            <a
              href={`mailto:${siteContact.email}`}
              className="inline-flex h-10 items-center rounded-xl border border-primary/20 bg-surface-tint px-4 text-sm font-semibold text-primary transition hover:border-primary"
            >
              {siteContact.email}
            </a>
            <a
              href={siteContact.githubUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex h-10 items-center rounded-xl border border-primary/20 bg-white px-4 text-sm font-semibold text-navy transition hover:border-primary hover:text-primary"
            >
              GitHub @{siteContact.githubHandle}
            </a>
          </div>
        </section>

        <section className="mt-16">
          <h2 className="text-2xl font-bold text-navy">How to use it</h2>
          <ol className="mt-6 grid gap-4 sm:grid-cols-3">
            {[
              {
                step: "1",
                title: "Pick a hub",
                text: "Start from a language you will be asked, or a category like SQL or system design.",
              },
              {
                step: "2",
                title: "Work a level",
                text: "Beginner first if the topic is rusty; Intermediate and Expert when you can already explain the basics.",
              },
              {
                step: "3",
                title: "Say it out loud",
                text: "Read the short answer, then the explanation. If you cannot teach it, you are not done.",
              },
            ].map((item) => (
              <li
                key={item.step}
                className="rounded-2xl border border-primary/10 bg-white p-5 shadow-sm"
              >
                <span className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-primary text-sm font-bold text-white">
                  {item.step}
                </span>
                <h3 className="mt-3 font-bold text-navy">{item.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-muted">{item.text}</p>
              </li>
            ))}
          </ol>
        </section>

        <section className="mt-16">
          <div className="flex flex-wrap items-end justify-between gap-3">
            <div>
              <h2 className="text-2xl font-bold text-navy">Learner feedback</h2>
              <p className="mt-2 text-sm text-muted">
                What people tell us after using the hubs to prepare.
              </p>
            </div>
            <Link
              href="/contact"
              className="text-sm font-semibold text-primary hover:text-primary-dark"
            >
              Share yours →
            </Link>
          </div>

          <ul className="mt-8 grid gap-4 sm:grid-cols-2">
            {learnerFeedback.map((item) => (
              <li
                key={item.name}
                className="flex flex-col rounded-2xl border border-primary/10 bg-white p-6 shadow-sm"
              >
                <p className="text-sm leading-relaxed text-ink">“{item.quote}”</p>
                <p className="mt-4 text-sm font-semibold text-navy">{item.name}</p>
                <p className="text-xs text-muted">{item.role}</p>
              </li>
            ))}
          </ul>
        </section>

        <section className="mt-16 rounded-3xl border border-primary/15 bg-gradient-to-br from-primary to-primary-dark px-6 py-10 text-white sm:px-10">
          <h2 className="text-2xl font-bold">Something missing?</h2>
          <p className="mt-2 max-w-xl text-sm leading-relaxed text-blue-100">
            Suggest a language, a question, or a correction. Feedback is how the library stays
            honest.
          </p>
          <Link
            href="/contact"
            className="mt-6 inline-flex h-11 items-center rounded-xl bg-white px-5 text-sm font-semibold text-primary transition hover:bg-blue-50"
          >
            Send a message
          </Link>
        </section>
      </div>
    </div>
  );
}
