"use client";

import Link from "next/link";
import { FormEvent, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { AuthShell, authInputClass, authLabelClass } from "@/components/auth/AuthShell";
import { PasswordField } from "@/components/auth/PasswordField";
import { isAdminAuthenticated, setAdminSession } from "@/lib/admin/auth";
import { userApi } from "@/lib/user-api";
import { getStoredUser, setUserSession } from "@/lib/user-auth";

export function LoginForm() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isAdminAuthenticated()) {
      router.replace("/admin");
      return;
    }
    if (getStoredUser()) router.replace("/");
  }, [router]);

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const result = await userApi.login(email.trim(), password);
      if (result.role === "admin") {
        setAdminSession(result.token);
        router.replace("/admin");
        return;
      }
      setUserSession(result.token, result.user);
      router.replace("/");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not sign in.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthShell
      title="Welcome back"
      subtitle="Sign in to your InterviewHub account. Admins go to the CMS; everyone else stays on the site."
      switchHref="/signup"
      switchLabel="Create one"
      switchPrompt="New here?"
    >
      <form onSubmit={onSubmit} className="space-y-4">
        <label className="block text-sm">
          <span className={authLabelClass}>Email</span>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@email.com"
            autoComplete="email"
            required
            className={authInputClass}
          />
        </label>
        <PasswordField
          id="signin-password"
          label="Password"
          value={password}
          onChange={setPassword}
          autoComplete="current-password"
        />
        {error ? (
          <p className="rounded-xl border border-hard/20 bg-hard/10 px-3 py-2 text-sm text-hard">
            {error}
          </p>
        ) : null}
        <button
          type="submit"
          disabled={loading}
          className="w-full rounded-xl bg-gradient-to-r from-primary to-primary-dark py-2.5 text-sm font-semibold text-white shadow-md shadow-primary/30 transition hover:opacity-95 disabled:opacity-60"
        >
          {loading ? "Signing in…" : "Sign in"}
        </button>
        <p className="text-center text-xs text-muted">
          CMS only?{" "}
          <Link href="/admin/login" className="font-semibold text-primary hover:underline">
            Admin sign in
          </Link>
        </p>
      </form>
    </AuthShell>
  );
}
