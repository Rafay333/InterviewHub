import Link from "next/link";
import { trendingTopics } from "@/lib/home-data";
import { heroWashClass } from "@/lib/theme";

export function HomeHero() {
  return (
    <section className="relative overflow-hidden border-b border-border">
      <div className={`pointer-events-none absolute inset-0 ${heroWashClass}`} aria-hidden />
      <div
        className="pointer-events-none absolute -right-24 top-10 h-64 w-64 rounded-full bg-accent/20 blur-3xl"
        aria-hidden
      />
      <div
        className="pointer-events-none absolute -left-16 bottom-0 h-48 w-48 rounded-full bg-primary/15 blur-3xl"
        aria-hidden
      />

      <div className="relative mx-auto max-w-6xl px-4 pb-16 pt-14 sm:px-6 sm:pb-20 sm:pt-20 lg:px-8">
        <p className="animate-fade-up text-xs font-semibold uppercase tracking-[0.2em] text-primary">
          InterviewHub
        </p>
        <h1 className="animate-fade-up-delay mt-4 max-w-3xl text-4xl font-bold tracking-tight text-navy sm:text-5xl sm:leading-[1.1]">
          Master the art of the{" "}
          <span className="text-primary">technical interview</span>
        </h1>
        <p className="animate-fade-up-delay-2 mt-5 max-w-2xl text-base leading-relaxed text-muted sm:text-lg">
          Search real questions by language, topic, or company — with clear
          answers built for focused practice.
        </p>

        <form
          action="/languages"
          method="get"
          className="animate-fade-up-delay-2 mt-8 flex w-full max-w-2xl flex-col gap-3 sm:flex-row sm:items-stretch"
          role="search"
        >
          <label htmlFor="home-search" className="sr-only">
            Search technologies, topics, or questions
          </label>
          <div className="flex flex-1 items-center gap-3 rounded-xl border border-primary/20 bg-white px-4 shadow-md shadow-primary/10 transition focus-within:border-primary focus-within:ring-2 focus-within:ring-primary/20">
            <svg
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              className="shrink-0 text-primary"
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
              id="home-search"
              name="q"
              type="search"
              placeholder="Search for technologies, topics, or questions..."
              className="h-12 w-full bg-transparent text-sm text-ink outline-none placeholder:text-muted/80"
            />
          </div>
          <button
            type="submit"
            className="h-12 shrink-0 rounded-xl bg-primary px-6 text-sm font-semibold text-white shadow-md shadow-primary/25 transition hover:bg-primary-dark"
          >
            Get Started
          </button>
        </form>

        <div className="mt-5 flex flex-wrap items-center gap-2">
          <span className="text-xs font-medium text-muted">Trending:</span>
          {trendingTopics.map((topic, index) => (
            <Link
              key={topic.href}
              href={topic.href}
              className={`rounded-full border px-3 py-1 text-xs font-semibold transition hover:scale-105 ${
                index % 2 === 0
                  ? "border-primary/30 bg-primary/10 text-primary"
                  : "border-accent/30 bg-accent/10 text-accent"
              }`}
            >
              {topic.label}
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
