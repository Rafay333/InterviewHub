"use client";

import { useState, type FormEvent } from "react";

export function BlogCommentForm() {
  const [submitted, setSubmitted] = useState(false);

  const onSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSubmitted(true);
  };

  return (
    <section className="mt-14 border-t border-border pt-10">
      <h2 className="text-xl font-bold uppercase tracking-wide text-primary">
        Leave a comment
      </h2>
      <p className="mt-2 text-sm text-muted">
        Your email address will not be published. Required fields are marked *
      </p>

      {submitted ? (
        <p className="mt-6 rounded-xl border border-easy/30 bg-easy/10 px-4 py-3 text-sm text-navy">
          Thanks — comment UI is ready. Saving comments to the server comes in a later phase.
        </p>
      ) : (
        <form className="mt-6 space-y-4" onSubmit={onSubmit}>
          <label htmlFor="comment-body" className="sr-only">
            Comment
          </label>
          <textarea
            id="comment-body"
            name="comment"
            required
            rows={6}
            placeholder="Type here.."
            className="w-full resize-y rounded-xl border border-border bg-surface-soft/50 px-4 py-3 text-sm text-ink outline-none placeholder:text-muted focus:border-primary focus:ring-2 focus:ring-primary/20"
          />

          <div className="grid gap-3 sm:grid-cols-3">
            <input
              type="text"
              name="name"
              required
              placeholder="Name*"
              className="h-11 rounded-xl border border-border bg-surface-soft/50 px-3 text-sm outline-none placeholder:text-muted focus:border-primary focus:ring-2 focus:ring-primary/20"
            />
            <input
              type="email"
              name="email"
              required
              placeholder="Email*"
              className="h-11 rounded-xl border border-border bg-surface-soft/50 px-3 text-sm outline-none placeholder:text-muted focus:border-primary focus:ring-2 focus:ring-primary/20"
            />
            <input
              type="url"
              name="website"
              placeholder="Website"
              className="h-11 rounded-xl border border-border bg-surface-soft/50 px-3 text-sm outline-none placeholder:text-muted focus:border-primary focus:ring-2 focus:ring-primary/20"
            />
          </div>

          <label className="flex items-start gap-2 text-sm text-muted">
            <input type="checkbox" name="save" className="mt-1 accent-primary" />
            <span>
              Save my name, email, and website in this browser for the next time I
              comment.
            </span>
          </label>

          <button
            type="submit"
            className="inline-flex h-11 items-center rounded-xl bg-primary px-5 text-sm font-semibold text-white transition hover:bg-primary-dark"
          >
            Post Comment »
          </button>
        </form>
      )}
    </section>
  );
}
