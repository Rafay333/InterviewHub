"use client";

import { FormEvent, useEffect, useState } from "react";
import {
  AdminCard,
  AdminPageHeader,
  AdminPrimaryButton,
} from "@/components/admin/AdminUi";
import { ConfirmModal } from "@/components/admin/ConfirmModal";
import { adminApi } from "@/lib/admin/api";
import type { AdminUser } from "@/lib/admin/types";

export default function AdminUsersPage() {
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("ChangeMe123!");
  const [toggleId, setToggleId] = useState<string | null>(null);
  const [error, setError] = useState("");

  const load = () => {
    adminApi
      .listUsers()
      .then(setUsers)
      .catch((err) => setError(err.message));
  };

  useEffect(load, []);

  const onInvite = async (e: FormEvent) => {
    e.preventDefault();
    try {
      await adminApi.createUser({ name, email, password });
      setName("");
      setEmail("");
      load();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed");
    }
  };

  return (
    <div>
      <AdminPageHeader title="Users" description="Admin accounts in SQL Server." />
      {error ? <p className="mb-3 text-sm text-hard">{error}</p> : null}
      <AdminCard className="mb-6 max-w-xl">
        <h2 className="mb-3 font-semibold text-navy">Invite admin</h2>
        <form onSubmit={onInvite} className="grid gap-3 sm:grid-cols-2">
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Name"
            required
            className="rounded-lg border border-border px-3 py-2 text-sm"
          />
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Email"
            required
            className="rounded-lg border border-border px-3 py-2 text-sm"
          />
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Password"
            className="rounded-lg border border-border px-3 py-2 text-sm sm:col-span-2"
          />
          <div className="sm:col-span-2">
            <AdminPrimaryButton type="submit">Add admin</AdminPrimaryButton>
          </div>
        </form>
      </AdminCard>
      <div className="overflow-x-auto rounded-xl border border-border bg-white shadow-sm">
        <table className="min-w-full text-left text-sm">
          <thead className="border-b border-border bg-surface-soft text-xs uppercase text-muted">
            <tr>
              <th className="px-4 py-3">Name</th>
              <th className="px-4 py-3">Email</th>
              <th className="px-4 py-3">Last login</th>
              <th className="px-4 py-3">Status</th>
              <th className="px-4 py-3">Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr key={user.id} className="border-b border-border last:border-0">
                <td className="px-4 py-3 font-medium">{user.name}</td>
                <td className="px-4 py-3 text-muted">{user.email}</td>
                <td className="px-4 py-3 text-muted">{user.lastLogin}</td>
                <td className="px-4 py-3">{user.active ? "Active" : "Disabled"}</td>
                <td className="px-4 py-3">
                  <button
                    type="button"
                    className="text-hard hover:underline"
                    onClick={() => setToggleId(user.id)}
                  >
                    {user.active ? "Disable" : "Enable"}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <ConfirmModal
        open={Boolean(toggleId)}
        title="Change user status?"
        message="Toggle active status in SQL Server."
        confirmLabel="Confirm"
        onCancel={() => setToggleId(null)}
        onConfirm={async () => {
          const user = users.find((u) => u.id === toggleId);
          if (!user || !toggleId) return;
          await adminApi.setUserActive(toggleId, !user.active);
          setToggleId(null);
          load();
        }}
      />
    </div>
  );
}
