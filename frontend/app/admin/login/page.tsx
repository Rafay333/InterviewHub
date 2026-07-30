"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { FormEvent, useEffect, useState } from "react";
import { isAdminAuthenticated, setAdminAuthenticated } from "@/lib/admin/auth";
import { heroWashClass } from "@/lib/theme";

export default function AdminLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("admin@interviewhub.com");
  const [password, setPassword] = useState("admin123");
  const [error, setError] = useState("");

  useEffect(() => {
    if (isAdminAuthenticated()) router.replace("/admin");
  }, [router]);

  const onSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      setError("Email and password are required.");
      return;
    }
    setAdminAuthenticated(true);
    router.replace("/admin");
  };

  return (
    <div className={`flex min-h-screen items-center justify-center px-4 ${heroWashClass}`}>
      <div className="w-full max-w-md rounded-2xl border border-primary/15 bg-white/95 p-8 shadow-lg shadow-primary/10 backdrop-blur">
        <div className="mb-6 text-center">
          <Image
            src="/brand/interviewhub-logo.png"
            alt="InterviewHub"
            width={200}
            height={56}
            className="mx-auto h-12 w-auto"
          />
          <p className="mt-2 text-xs font-semibold uppercase tracking-wide text-accent">Admin CMS</p>
          <h1 className="mt-2 text-xl font-bold text-navy">Admin sign in</h1>
          <p className="mt-1 text-sm text-muted">Manage languages, questions, blogs, and insights.</p>
        </div>

        <form onSubmit={onSubmit} className="space-y-4">
          <label className="block text-sm">
            <span className="mb-1 block font-medium text-ink">Email</span>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full rounded-lg border border-primary/15 px-3 py-2 outline-none focus:border-primary focus:ring-2 focus:ring-primary/15"
            />
          </label>
          <label className="block text-sm">
            <span className="mb-1 block font-medium text-ink">Password</span>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full rounded-lg border border-primary/15 px-3 py-2 outline-none focus:border-primary focus:ring-2 focus:ring-primary/15"
            />
          </label>
          {error ? <p className="text-sm text-hard">{error}</p> : null}
          <button
            type="submit"
            className="w-full rounded-lg bg-primary py-2.5 text-sm font-semibold text-white shadow-sm shadow-primary/25 hover:bg-primary-dark"
          >
            Sign in
          </button>
        </form>
        <p className="mt-4 text-center text-xs text-muted">
          Demo: any email/password works until backend auth ships.
        </p>
      </div>
    </div>
  );
}
