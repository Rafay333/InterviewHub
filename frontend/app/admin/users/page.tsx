"use client";

import { FormEvent, useEffect, useState } from "react";
import {
  adminInputClass,
  AdminCard,
  AdminPageHeader,
  AdminPrimaryButton,
  AdminTable,
  AdminTableHead,
  AdminTd,
  AdminTh,
  AdminTr,
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
      <AdminPageHeader
        title="Users"
        description="Manage admin accounts stored in SQL Server."
      />
      {error ? (
        <p className="mb-3 rounded-xl border border-hard/20 bg-hard/10 px-3 py-2 text-sm text-hard">
          {error}
        </p>
      ) : null}
      <AdminCard className="mb-6 max-w-xl border-accent/20 bg-gradient-to-br from-accent/5 via-white to-primary/5">
        <h2 className="mb-3 font-bold text-navy">Invite admin</h2>
        <form onSubmit={onInvite} className="grid gap-3 sm:grid-cols-2">
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Name"
            required
            className={adminInputClass}
          />
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Email"
            required
            className={adminInputClass}
          />
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Password"
            className={`${adminInputClass} sm:col-span-2`}
          />
          <div className="sm:col-span-2">
            <AdminPrimaryButton type="submit">Add admin</AdminPrimaryButton>
          </div>
        </form>
      </AdminCard>
      <AdminTable>
        <table className="min-w-full text-left text-sm">
          <AdminTableHead>
            <tr>
              <AdminTh>Name</AdminTh>
              <AdminTh>Email</AdminTh>
              <AdminTh>Last login</AdminTh>
              <AdminTh>Status</AdminTh>
              <AdminTh>Actions</AdminTh>
            </tr>
          </AdminTableHead>
          <tbody>
            {users.map((user) => (
              <AdminTr key={user.id}>
                <AdminTd className="font-medium text-navy">{user.name}</AdminTd>
                <AdminTd className="text-muted">{user.email}</AdminTd>
                <AdminTd className="text-muted">{user.lastLogin}</AdminTd>
                <AdminTd>
                  <span
                    className={`rounded-full px-2.5 py-0.5 text-xs font-semibold ${
                      user.active
                        ? "bg-easy/15 text-easy ring-1 ring-easy/20"
                        : "bg-hard/10 text-hard ring-1 ring-hard/20"
                    }`}
                  >
                    {user.active ? "Active" : "Disabled"}
                  </span>
                </AdminTd>
                <AdminTd>
                  <button
                    type="button"
                    className="font-semibold text-hard hover:text-red-700"
                    onClick={() => setToggleId(user.id)}
                  >
                    {user.active ? "Disable" : "Enable"}
                  </button>
                </AdminTd>
              </AdminTr>
            ))}
          </tbody>
        </table>
      </AdminTable>
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
