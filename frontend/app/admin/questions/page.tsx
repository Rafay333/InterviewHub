"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import {
  AdminPageHeader,
  AdminPrimaryButton,
  AdminSecondaryButton,
  DifficultyBadge,
  EmptyState,
  StatusBadge,
} from "@/components/admin/AdminUi";
import { ConfirmModal } from "@/components/admin/ConfirmModal";
import {
  adminLanguages,
  adminQuestions,
  languageName,
  type AdminQuestion,
  type Difficulty,
} from "@/lib/admin/data";

export default function AdminQuestionsPage() {
  const [items, setItems] = useState<AdminQuestion[]>(adminQuestions);
  const [q, setQ] = useState("");
  const [difficulty, setDifficulty] = useState<Difficulty | "all">("all");
  const [languageId, setLanguageId] = useState("all");
  const [deleteId, setDeleteId] = useState<string | null>(null);

  const filtered = useMemo(() => {
    return items.filter((item) => {
      if (difficulty !== "all" && item.difficulty !== difficulty) return false;
      if (languageId !== "all" && !item.languageIds.includes(languageId)) return false;
      const term = q.trim().toLowerCase();
      if (term && !item.title.toLowerCase().includes(term)) return false;
      return true;
    });
  }, [items, q, difficulty, languageId]);

  return (
    <div>
      <AdminPageHeader
        title="Questions"
        description="Add questions by language and level. Pictures are optional."
        actions={
          <>
            <AdminPrimaryButton href="/admin/questions/new">Add Question</AdminPrimaryButton>
            <AdminSecondaryButton href="/admin/questions/import">Import</AdminSecondaryButton>
          </>
        }
      />

      <div className="mb-4 grid gap-2 sm:grid-cols-3">
        <input
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="Search…"
          className="rounded-lg border border-border bg-white px-3 py-2 text-sm outline-none focus:border-primary"
        />
        <select
          value={languageId}
          onChange={(e) => setLanguageId(e.target.value)}
          className="rounded-lg border border-border bg-white px-3 py-2 text-sm"
        >
          <option value="all">All languages</option>
          {adminLanguages.map((l) => (
            <option key={l.id} value={l.id}>
              {l.name}
            </option>
          ))}
        </select>
        <select
          value={difficulty}
          onChange={(e) => setDifficulty(e.target.value as Difficulty | "all")}
          className="rounded-lg border border-border bg-white px-3 py-2 text-sm"
        >
          <option value="all">All levels</option>
          <option value="beginner">Beginner</option>
          <option value="intermediate">Intermediate</option>
          <option value="expert">Expert</option>
        </select>
      </div>

      {filtered.length === 0 ? (
        <EmptyState
          title="No questions yet"
          description="Select a language and level, then add Question, Answer, and Description."
          action={<AdminPrimaryButton href="/admin/questions/new">Add Question</AdminPrimaryButton>}
        />
      ) : (
        <div className="overflow-x-auto rounded-xl border border-border bg-white shadow-sm">
          <table className="min-w-full text-left text-sm">
            <thead className="border-b border-border bg-surface-soft text-xs uppercase text-muted">
              <tr>
                <th className="px-4 py-3">Question</th>
                <th className="px-4 py-3">Language</th>
                <th className="px-4 py-3">Level</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((item) => (
                <tr key={item.id} className="border-b border-border last:border-0">
                  <td className="px-4 py-3 font-medium text-navy">{item.title}</td>
                  <td className="px-4 py-3 text-muted">
                    {item.languageIds.map(languageName).join(", ") || "—"}
                  </td>
                  <td className="px-4 py-3">
                    <DifficultyBadge difficulty={item.difficulty} />
                  </td>
                  <td className="px-4 py-3">
                    <StatusBadge status={item.status} />
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex gap-2">
                      <Link href={`/admin/questions/${item.id}/edit`} className="text-primary hover:underline">
                        Edit
                      </Link>
                      <button
                        type="button"
                        className="text-hard hover:underline"
                        onClick={() => setDeleteId(item.id)}
                      >
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <ConfirmModal
        open={Boolean(deleteId)}
        title="Delete question?"
        message="This removes the question from the admin list (mock UI until API)."
        onCancel={() => setDeleteId(null)}
        onConfirm={() => {
          setItems((prev) => prev.filter((i) => i.id !== deleteId));
          setDeleteId(null);
        }}
      />
    </div>
  );
}
