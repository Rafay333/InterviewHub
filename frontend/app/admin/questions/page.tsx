"use client";

import { useEffect, useMemo, useState } from "react";
import {
  adminInputClass,
  AdminLink,
  AdminPageHeader,
  AdminPrimaryButton,
  adminSelectClass,
  AdminSecondaryButton,
  AdminTable,
  AdminTableHead,
  AdminTd,
  AdminTh,
  AdminTr,
  AdminFilters,
  DifficultyBadge,
  EmptyState,
  StatusBadge,
} from "@/components/admin/AdminUi";
import { ConfirmModal } from "@/components/admin/ConfirmModal";
import { adminApi } from "@/lib/admin/api";
import type { AdminLanguage, AdminQuestion, Difficulty } from "@/lib/admin/types";

export default function AdminQuestionsPage() {
  const [items, setItems] = useState<AdminQuestion[]>([]);
  const [languages, setLanguages] = useState<AdminLanguage[]>([]);
  const [q, setQ] = useState("");
  const [difficulty, setDifficulty] = useState<Difficulty | "all">("all");
  const [languageId, setLanguageId] = useState("all");
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  const load = () => {
    setLoading(true);
    Promise.all([adminApi.listQuestions(), adminApi.listLanguages()])
      .then(([questions, langs]) => {
        setItems(questions);
        setLanguages(langs);
      })
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  };

  useEffect(load, []);

  const filtered = useMemo(() => {
    return items.filter((item) => {
      if (difficulty !== "all" && item.difficulty !== difficulty) return false;
      if (languageId !== "all" && item.languageId !== languageId) return false;
      const term = q.trim().toLowerCase();
      if (term && !item.title.toLowerCase().includes(term)) return false;
      return true;
    });
  }, [items, q, difficulty, languageId]);

  return (
    <div>
      <AdminPageHeader
        title="Questions"
        description="Create, edit, and bulk-import interview Q&A."
        actions={
          <>
            <AdminPrimaryButton href="/admin/questions/new">Add Question</AdminPrimaryButton>
            <AdminSecondaryButton href="/admin/questions/import">Import PDF</AdminSecondaryButton>
          </>
        }
      />
      <AdminFilters>
        <input
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="Search…"
          className={adminInputClass}
        />
        <select
          value={languageId}
          onChange={(e) => setLanguageId(e.target.value)}
          className={adminSelectClass}
        >
          <option value="all">All languages</option>
          {languages.map((l) => (
            <option key={l.id} value={l.id}>
              {l.name}
            </option>
          ))}
        </select>
        <select
          value={difficulty}
          onChange={(e) => setDifficulty(e.target.value as Difficulty | "all")}
          className={adminSelectClass}
        >
          <option value="all">All levels</option>
          <option value="beginner">Beginner</option>
          <option value="intermediate">Intermediate</option>
          <option value="expert">Expert</option>
        </select>
      </AdminFilters>
      {error ? (
        <p className="mb-3 rounded-xl border border-hard/20 bg-hard/10 px-3 py-2 text-sm text-hard">
          {error}
        </p>
      ) : null}
      {loading ? (
        <p className="text-sm text-muted">Loading…</p>
      ) : filtered.length === 0 ? (
        <EmptyState
          title="No questions yet"
          description="Add a question after creating a language."
          action={<AdminPrimaryButton href="/admin/questions/new">Add Question</AdminPrimaryButton>}
        />
      ) : (
        <AdminTable>
          <table className="min-w-full text-left text-sm">
            <AdminTableHead>
              <tr>
                <AdminTh>Question</AdminTh>
                <AdminTh>Language</AdminTh>
                <AdminTh>Level</AdminTh>
                <AdminTh>Status</AdminTh>
                <AdminTh>Actions</AdminTh>
              </tr>
            </AdminTableHead>
            <tbody>
              {filtered.map((item) => (
                <AdminTr key={item.id}>
                  <AdminTd className="font-medium text-navy">{item.title}</AdminTd>
                  <AdminTd className="text-muted">{item.languageName || "—"}</AdminTd>
                  <AdminTd>
                    <DifficultyBadge difficulty={item.difficulty} />
                  </AdminTd>
                  <AdminTd>
                    <StatusBadge status={item.status} />
                  </AdminTd>
                  <AdminTd>
                    <div className="flex gap-3">
                      <AdminLink href={`/admin/questions/${item.id}/edit`}>Edit</AdminLink>
                      <button
                        type="button"
                        className="font-semibold text-hard hover:text-red-700"
                        onClick={() => setDeleteId(item.id)}
                      >
                        Delete
                      </button>
                    </div>
                  </AdminTd>
                </AdminTr>
              ))}
            </tbody>
          </table>
        </AdminTable>
      )}
      <ConfirmModal
        open={Boolean(deleteId)}
        title="Delete question?"
        message="This permanently removes the question."
        onCancel={() => setDeleteId(null)}
        onConfirm={async () => {
          if (!deleteId) return;
          try {
            await adminApi.deleteQuestion(deleteId);
            setDeleteId(null);
            load();
          } catch (err) {
            setError(err instanceof Error ? err.message : "Delete failed");
            setDeleteId(null);
          }
        }}
      />
    </div>
  );
}
