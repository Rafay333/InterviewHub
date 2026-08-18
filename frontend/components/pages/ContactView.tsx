"use client";

import { FormEvent, useState } from "react";
import Link from "next/link";
import { siteContact } from "@/lib/site-pages";
import { heroWashClass } from "@/lib/theme";

const topics = ["Feedback", "Question or correction", "Content request", "Partnership", "Other"] as const;

type FormState = {
  name: string;
  email: string;
  topic: (typeof topics)[number];
  message: string;
};

const emptyForm: FormState = {
  name: "",
  email: "",
  topic: "Feedback",
  message: "",
};

export function ContactView() {
  const [form, setForm] = useState<FormState>(emptyForm);
  const [error, setError] = useState("");
  const [sent, setSent] = useState(false);

  function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const name = form.name.trim();
    const email = form.email.trim();
    const message = form.message.trim();

    if (!name || !email || !message) {
      setError("Please fill in your name, email, and message.");
      return;
    }

    const subject = encodeURIComponent(`[InterviewHub] ${form.topic} from ${name}`);
    const body = encodeURIComponent(
      `${message}\n\n—\n${name}\n${email}\nTopic: ${form.topic}`,
    );
    window.location.href = `mailto:${siteContact.email}?subject=${subject}&body=${body}`;
    setError("");
    setSent(true);
  }

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
        <header className="max-w-2xl">
          <p className="inline-flex items-center gap-1.5 rounded-full border border-primary/20 bg-white/80 px-3 py-1 text-xs font-semibold uppercase tracking-[0.16em] text-primary shadow-sm">
            <span aria-hidden>✦</span> Contact
          </p>
          <h1 className="mt-4 text-3xl font-bold tracking-tight text-navy sm:text-4xl lg:text-5xl">
            Send a question, correction, or feedback
          </h1>
          <p className="mt-4 text-sm leading-relaxed text-muted sm:text-base">
            Tell us what to add, what to fix, or how InterviewHub helped you prepare.{" "}
            {siteContact.responseNote}
          </p>
        </header>

        <div className="mt-10 grid gap-8 lg:grid-cols-[minmax(0,1fr)_320px]">
          <form
            onSubmit={onSubmit}
            className="rounded-3xl border border-primary/10 bg-white p-6 shadow-sm sm:p-8"
            noValidate
          >
            {sent ? (
              <div className="rounded-2xl border border-easy/20 bg-easy/10 px-4 py-3 text-sm text-navy">
                Your email app should open with the message ready. If it does not, write us
                directly at{" "}
                <a href={`mailto:${siteContact.email}`} className="font-semibold text-primary">
                  {siteContact.email}
                </a>
                .
              </div>
            ) : null}
            {error ? (
              <p className="mb-4 rounded-2xl border border-hard/20 bg-hard/10 px-4 py-3 text-sm text-hard">
                {error}
              </p>
            ) : null}

            <div className="grid gap-4 sm:grid-cols-2">
              <label className="block text-sm">
                <span className="mb-1.5 block font-medium text-ink">Name</span>
                <input
                  type="text"
                  name="name"
                  autoComplete="name"
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  className="w-full rounded-xl border border-border px-3 py-2.5 outline-none transition focus:border-primary"
                  placeholder="Your name"
                />
              </label>
              <label className="block text-sm">
                <span className="mb-1.5 block font-medium text-ink">Email</span>
                <input
                  type="email"
                  name="email"
                  autoComplete="email"
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  className="w-full rounded-xl border border-border px-3 py-2.5 outline-none transition focus:border-primary"
                  placeholder="you@email.com"
                />
              </label>
            </div>

            <label className="mt-4 block text-sm">
              <span className="mb-1.5 block font-medium text-ink">Topic</span>
              <select
                name="topic"
                value={form.topic}
                onChange={(e) =>
                  setForm({ ...form, topic: e.target.value as FormState["topic"] })
                }
                className="w-full rounded-xl border border-border bg-white px-3 py-2.5 outline-none transition focus:border-primary"
              >
                {topics.map((topic) => (
                  <option key={topic} value={topic}>
                    {topic}
                  </option>
                ))}
              </select>
            </label>

            <label className="mt-4 block text-sm">
              <span className="mb-1.5 block font-medium text-ink">Message</span>
              <textarea
                name="message"
                rows={7}
                value={form.message}
                onChange={(e) => setForm({ ...form, message: e.target.value })}
                className="w-full resize-y rounded-xl border border-border px-3 py-2.5 outline-none transition focus:border-primary"
                placeholder="What should we know?"
              />
            </label>

            <button
              type="submit"
              className="mt-6 inline-flex h-11 w-full items-center justify-center rounded-xl bg-primary px-5 text-sm font-semibold text-white shadow-sm shadow-primary/25 transition hover:bg-primary-dark sm:w-auto"
            >
              Send message
            </button>
          </form>

          <aside className="space-y-4">
            <div className="rounded-2xl border border-primary/10 bg-white p-5 shadow-sm">
              <h2 className="text-sm font-semibold uppercase tracking-wider text-accent">
                Reach {siteContact.founderName}
              </h2>
              <a
                href={`mailto:${siteContact.email}`}
                className="mt-2 block text-sm font-semibold text-primary hover:text-primary-dark"
              >
                {siteContact.email}
              </a>
              <p className="mt-3 text-sm text-muted">{siteContact.location}</p>
              <a
                href={siteContact.githubUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-3 inline-block text-sm font-semibold text-navy hover:text-primary"
              >
                GitHub @{siteContact.githubHandle}
              </a>
            </div>

            <div className="rounded-2xl border border-primary/10 bg-white p-5 shadow-sm">
              <h2 className="text-sm font-semibold uppercase tracking-wider text-accent">
                Useful links
              </h2>
              <ul className="mt-3 space-y-2 text-sm">
                <li>
                  <Link href="/about" className="font-medium text-navy hover:text-primary">
                    About InterviewHub
                  </Link>
                </li>
                <li>
                  <Link href="/languages" className="font-medium text-navy hover:text-primary">
                    Language hubs
                  </Link>
                </li>
                <li>
                  <Link href="/blog" className="font-medium text-navy hover:text-primary">
                    Blog
                  </Link>
                </li>
              </ul>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}
