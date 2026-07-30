"use client";

import { FormEvent, useState } from "react";
import {
  AdminCard,
  AdminPageHeader,
  AdminPrimaryButton,
} from "@/components/admin/AdminUi";
import { ConfirmModal } from "@/components/admin/ConfirmModal";
import { adminUsers, type AdminUser } from "@/lib/admin/data";

export default function AdminUsersPage() {
  const [users, setUsers] = useState<AdminUser[]>(adminUsers);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [disableId, setDisableId] = useState<string | null>(null);

  const onInvite = (e: FormEvent) => {
    e.preventDefault();
    if (!name || !email) return;
    setUsers((prev) => [
      {
        id: `u-${Date.now()}`,
        name,
        email,
        role: "Admin",
        lastLogin: "Never",
        active: true,
      },
      ...prev,
    ]);
    setName("");
    setEmail("");
  };

  return (
    <div>
      <AdminPageHeader
        title="Users"
        description="Admin accounts only (MVP). Student profiles come later."
      />

      <AdminCard className="mb-6 max-w-xl">
        <h2 className="mb-3 font-semibold text-navy">Invite admin</h2>
        <form onSubmit={onInvite} className="grid gap-3 sm:grid-cols-2">
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Name"
            className="rounded-lg border border-border px-3 py-2 text-sm outline-none focus:border-primary"
          />
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Email"
            className="rounded-lg border border-border px-3 py-2 text-sm outline-none focus:border-primary"
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
              <th className="px-4 py-3">Role</th>
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
                <td className="px-4 py-3">{user.role}</td>
                <td className="px-4 py-3 text-muted">{user.lastLogin}</td>
                <td className="px-4 py-3">
                  <span
                    className={`inline-flex rounded-full px-2.5 py-0.5 text-xs font-semibold ${
                      user.active
                        ? "bg-green-100 text-green-800"
                        : "bg-slate-200 text-slate-700"
                    }`}
                  >
                    {user.active ? "Active" : "Disabled"}
                  </span>
                </td>
                <td className="px-4 py-3">
                  <button
                    type="button"
                    className="text-hard hover:underline"
                    onClick={() => setDisableId(user.id)}
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
        open={Boolean(disableId)}
        title="Change user status?"
        message="Toggle active status for this admin account (mock)."
        confirmLabel="Confirm"
        onCancel={() => setDisableId(null)}
        onConfirm={() => {
          setUsers((prev) =>
            prev.map((u) => (u.id === disableId ? { ...u, active: !u.active } : u)),
          );
          setDisableId(null);
        }}
      />
    </div>
  );
}
