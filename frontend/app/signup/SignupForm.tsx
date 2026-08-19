"use client";

import { FormEvent, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { AuthShell, authInputClass, authLabelClass } from "@/components/auth/AuthShell";
import { PasswordField } from "@/components/auth/PasswordField";
import { userApi } from "@/lib/user-api";
import { getStoredUser, setUserSession } from "@/lib/user-auth";

export function SignupForm() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (getStoredUser()) router.replace("/");
  }, [router]);

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError("");
    if (password !== confirm) {
      setError("Passwords do not match.");
      return;
    }
    setLoading(true);
    try {
      const result = await userApi.register({
        name: name.trim(),
        email: email.trim(),
        password,
      });
      setUserSession(result.token, result.user);
      router.replace("/");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not create account.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthShell
      title="Create your account"
      subtitle="We’ll save your name and email in the database so you can sign in anytime."
      switchHref="/login"
      switchLabel="Sign in"
      switchPrompt="Already have an account?"
    >
      <form onSubmit={onSubmit} className="space-y-4">
        <label className="block text-sm">
          <span className={authLabelClass}>Full name</span>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Your name"
            autoComplete="name"
            required
            minLength={2}
            className={authInputClass}
          />
        </label>
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
          id="signup-password"
          label="Password"
          value={password}
          onChange={setPassword}
          autoComplete="new-password"
        />
        <PasswordField
          id="signup-confirm"
          label="Confirm password"
          value={confirm}
          onChange={setConfirm}
          autoComplete="new-password"
        />
        <p className="text-xs text-muted">Use at least 8 characters. We’ll never share your email.</p>
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
          {loading ? "Creating account…" : "Create account"}
        </button>
      </form>
    </AuthShell>
  );
}
