import Image from "next/image";
import Link from "next/link";
import { heroWashClass } from "@/lib/theme";

const benefits = [
  {
    title: "Your progress stays saved",
    body: "Create an account once and come back to interview prep on any device.",
  },
  {
    title: "Real interview questions",
    body: "Practice by language and category with clear, focused answers.",
  },
  {
    title: "Built to get you hired",
    body: "No clutter — just the questions that show up in technical interviews.",
  },
];

export function AuthShell({
  title,
  subtitle,
  switchHref,
  switchLabel,
  switchPrompt,
  children,
}: {
  title: string;
  subtitle: string;
  switchHref: string;
  switchLabel: string;
  switchPrompt: string;
  children: React.ReactNode;
}) {
  return (
    <div className="relative min-h-[calc(100vh-4.5rem)] overflow-hidden sm:min-h-[calc(100vh-5rem)]">
      <div className={`pointer-events-none absolute inset-0 ${heroWashClass}`} aria-hidden />
      <div
        className="pointer-events-none absolute -right-16 top-10 h-72 w-72 rounded-full bg-accent/20 blur-3xl"
        aria-hidden
      />
      <div
        className="pointer-events-none absolute -left-20 bottom-0 h-64 w-64 rounded-full bg-primary/20 blur-3xl"
        aria-hidden
      />

      <div className="relative mx-auto grid max-w-6xl lg:min-h-[calc(100vh-5rem)] lg:grid-cols-2">
        <aside className="hidden flex-col justify-center px-10 py-16 lg:flex xl:px-16">
          <p className="inline-flex w-fit items-center rounded-full border border-primary/20 bg-white/80 px-3 py-1 text-xs font-semibold text-primary shadow-sm">
            InterviewHub account
          </p>
          <h2 className="mt-5 max-w-md text-4xl font-bold tracking-tight text-navy">
            Practice with confidence.{" "}
            <span className="text-primary">Pick up where you left off.</span>
          </h2>
          <p className="mt-4 max-w-md text-base leading-relaxed text-muted">
            Sign in to keep your InterviewHub profile in the database so your account is waiting
            the next time you return.
          </p>
          <ul className="mt-8 space-y-4">
            {benefits.map((item) => (
              <li
                key={item.title}
                className="flex gap-3 rounded-2xl border border-white/70 bg-white/70 p-4 shadow-sm shadow-primary/5 backdrop-blur"
              >
                <span className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary text-sm font-bold text-white">
                  ✓
                </span>
                <div>
                  <p className="font-semibold text-navy">{item.title}</p>
                  <p className="mt-0.5 text-sm text-muted">{item.body}</p>
                </div>
              </li>
            ))}
          </ul>
        </aside>

        <div className="flex items-center justify-center px-4 py-10 sm:px-6 sm:py-16">
          <div className="w-full max-w-md overflow-hidden rounded-3xl border border-primary/15 bg-white/95 shadow-2xl shadow-primary/15 backdrop-blur">
            <div className="h-1.5 bg-gradient-to-r from-primary via-teal to-accent" />
            <div className="px-6 py-8 sm:px-8">
              <div className="mb-6 text-center lg:text-left">
                <Image
                  src="/brand/interviewhub-logo.png"
                  alt="InterviewHub"
                  width={280}
                  height={78}
                  className="mx-auto h-14 w-auto lg:mx-0"
                />
                <h1 className="mt-4 text-2xl font-bold tracking-tight text-navy">{title}</h1>
                <p className="mt-1.5 text-sm leading-relaxed text-muted">{subtitle}</p>
              </div>
              {children}
              <p className="mt-6 text-center text-sm text-muted">
                {switchPrompt}{" "}
                <Link href={switchHref} className="font-semibold text-primary hover:underline">
                  {switchLabel}
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export const authInputClass =
  "w-full rounded-xl border border-primary/15 bg-white px-3.5 py-2.5 text-sm text-ink shadow-sm outline-none transition placeholder:text-muted/60 focus:border-primary focus:ring-2 focus:ring-primary/15";

export const authLabelClass = "mb-1.5 block text-sm font-semibold text-navy";
