"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { FormEvent, useEffect, useState } from "react";
import { isAdminAuthenticated, setAdminSession } from "@/lib/admin/auth";
import { adminApi } from "@/lib/admin/api";
import { adminInputClass, adminLabelClass } from "@/components/admin/AdminUi";
import { heroWashClass } from "@/lib/theme";

export default function AdminLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("admin@interviewhub.com");
  const [password, setPassword] = useState("admin123");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isAdminAuthenticated()) router.replace("/admin");
  }, [router]);

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const result = await adminApi.login(email, password);
      setAdminSession(result.token);
      router.replace("/admin");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={`flex min-h-screen items-center justify-center px-4 ${heroWashClass}`}>
      <div className="w-full max-w-md overflow-hidden rounded-2xl border border-primary/15 bg-white/95 shadow-xl shadow-primary/15 backdrop-blur">
        <div className="h-1.5 bg-gradient-to-r from-primary via-teal to-accent" />
        <div className="p-8">
          <div className="mb-6 text-center">
            <Image
              src="/brand/interviewhub-logo.png"
              alt="InterviewHub"
              width={200}
              height={56}
              className="mx-auto h-12 w-auto"
            />
            <p className="mt-3 inline-flex rounded-full bg-accent/15 px-2.5 py-0.5 text-xs font-bold uppercase tracking-wide text-accent">
              Admin CMS
            </p>
            <h1 className="mt-2 text-xl font-bold text-navy">Admin sign in</h1>
          </div>
          <form onSubmit={onSubmit} className="space-y-4">
            <label className="block text-sm">
              <span className={adminLabelClass}>Email</span>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className={adminInputClass}
              />
            </label>
            <label className="block text-sm">
              <span className={adminLabelClass}>Password</span>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className={adminInputClass}
              />
            </label>
            {error ? (
              <p className="rounded-xl border border-hard/20 bg-hard/10 px-3 py-2 text-sm text-hard">
                {error}
              </p>
            ) : null}
            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-xl bg-gradient-to-r from-primary to-primary-dark py-2.5 text-sm font-semibold text-white shadow-md shadow-primary/30 hover:opacity-95 disabled:opacity-60"
            >
              {loading ? "Signing in…" : "Sign in"}
            </button>
          </form>
          <p className="mt-4 text-center text-xs text-muted">
            Default seed: admin@interviewhub.com / admin123
          </p>
        </div>
      </div>
    </div>
  );
}
