import Image from "next/image";
import Link from "next/link";
import { trendingTopics } from "@/lib/home-data";
import { heroWashClass } from "@/lib/theme";

export function HomeHero() {
  return (
    <section className="relative overflow-hidden border-b border-border">
      <div className={`pointer-events-none absolute inset-0 ${heroWashClass}`} aria-hidden />
      <div
        className="pointer-events-none absolute -right-16 top-0 h-80 w-80 rounded-full bg-accent/20 blur-3xl"
        aria-hidden
      />
      <div
        className="pointer-events-none absolute -left-20 bottom-0 h-56 w-56 rounded-full bg-primary/15 blur-3xl"
        aria-hidden
      />

      <div className="relative mx-auto grid max-w-6xl items-center gap-8 px-4 pb-12 pt-12 sm:px-6 sm:pb-16 sm:pt-16 lg:grid-cols-2 lg:gap-6 lg:px-8 lg:pb-20 lg:pt-16">
        <div className="order-2 lg:order-1">
          <p className="animate-fade-up inline-flex items-center rounded-full border border-primary/20 bg-white/80 px-3 py-1 text-xs font-semibold text-primary shadow-sm">
            Ace Your Technical Interview
          </p>
          <h1 className="animate-fade-up-delay mt-5 max-w-xl text-4xl font-bold tracking-tight text-navy sm:text-5xl sm:leading-[1.08]">
            Master Technical Interviews{" "}
            <span className="text-primary">with Confidence</span>
          </h1>
          <p className="animate-fade-up-delay-2 mt-4 max-w-lg text-base leading-relaxed text-muted sm:text-lg">
            Practice real interview questions by language and category — with clear
            answers built for focused prep.
          </p>

          <form
            action="/languages"
            method="get"
            className="animate-fade-up-delay-2 mt-8 w-full max-w-xl"
            role="search"
          >
            <label htmlFor="home-search" className="sr-only">
              Search technologies, topics, or questions
            </label>
            <div className="flex flex-col gap-2 rounded-2xl border border-primary/15 bg-white p-2 shadow-lg shadow-primary/10 sm:flex-row sm:items-center">
              <div className="flex min-w-0 flex-1 items-center gap-3 px-3">
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
                  placeholder="Search React, Node.js, SQL, HR Questions..."
                  className="h-11 w-full bg-transparent text-sm text-ink outline-none placeholder:text-muted/80"
                />
              </div>
              <button
                type="submit"
                className="h-11 shrink-0 rounded-xl bg-primary px-5 text-sm font-semibold text-white shadow-sm shadow-primary/25 transition hover:bg-primary-dark"
              >
                Start Learning
              </button>
            </div>
          </form>

          <div className="mt-5 flex flex-wrap gap-2">
            {trendingTopics.map((topic, index) => (
              <Link
                key={topic.label}
                href={topic.href}
                className={`rounded-full border px-3 py-1.5 text-xs font-semibold transition hover:scale-105 ${
                  index % 2 === 0
                    ? "border-primary/25 bg-primary/10 text-primary"
                    : "border-accent/25 bg-accent/10 text-accent"
                }`}
              >
                {topic.label}
              </Link>
            ))}
          </div>
        </div>

        <div className="order-1 animate-fade-up relative mx-auto w-full max-w-lg lg:order-2 lg:max-w-none lg:justify-self-end">
          <div
            className="pointer-events-none absolute left-1/2 top-1/2 -z-10 h-[85%] w-[85%] -translate-x-1/2 -translate-y-1/2 rounded-full bg-gradient-to-br from-primary/10 via-white/40 to-accent/20 blur-2xl"
            aria-hidden
          />
          <Image
            src="/hero-interview.png"
            alt="Developer preparing for technical interviews with AI help and popular tech stacks"
            width={960}
            height={960}
            priority
            className="h-auto w-full scale-105 object-contain object-center drop-shadow-md lg:scale-110 lg:translate-x-2"
          />
        </div>
      </div>
    </section>
  );
}
