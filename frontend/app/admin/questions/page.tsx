"use client";

import { useEffect, useState } from "react";
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
import { QuestionAdminActions } from "@/components/admin/QuestionAdminActions";
import { adminApi } from "@/lib/admin/api";
import type { AdminLanguage, AdminQuestion, Difficulty } from "@/lib/admin/types";

const PAGE_SIZE = 40;

export default function AdminQuestionsPage() {
  const [items, setItems] = useState<AdminQuestion[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [languages, setLanguages] = useState<AdminLanguage[]>([]);
  const [q, setQ] = useState("");
  const [search, setSearch] = useState("");
  const [difficulty, setDifficulty] = useState<Difficulty | "all">("all");
  const [languageId, setLanguageId] = useState("all");
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const t = setTimeout(() => {
      setSearch(q.trim());
      setPage(1);
    }, 250);
    return () => clearTimeout(t);
  }, [q]);

  useEffect(() => {
    adminApi.listLanguages().then(setLanguages).catch((err) => setError(err.message));
  }, []);

  const load = () => {
    setLoading(true);
    const params: Record<string, string> = {
      page: String(page),
      pageSize: String(PAGE_SIZE),
    };
    if (search) params.q = search;
    if (difficulty !== "all") params.difficulty = difficulty;
    if (languageId !== "all") params.languageId = languageId;

    adminApi
      .listQuestions(params)
      .then((result) => {
        setItems(result.items);
        setTotal(result.total);
      })
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  };

  useEffect(load, [page, search, difficulty, languageId]);

  const pageCount = Math.max(1, Math.ceil(total / PAGE_SIZE));

  return (
    <div>
      <AdminPageHeader
        title="Questions"
        description={`${total} questions. Search and filters run on the server so this page stays fast.`}
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
          onChange={(e) => {
            setLanguageId(e.target.value);
            setPage(1);
          }}
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
          onChange={(e) => {
            setDifficulty(e.target.value as Difficulty | "all");
            setPage(1);
          }}
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
      {loading && items.length === 0 ? (
        <p className="text-sm text-muted">Loading…</p>
      ) : items.length === 0 ? (
        <EmptyState
          title="No questions yet"
          description="Add a question after creating a language."
          action={<AdminPrimaryButton href="/admin/questions/new">Add Question</AdminPrimaryButton>}
        />
      ) : (
        <>
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
                {items.map((item) => (
                  <AdminTr key={item.id}>
                    <AdminTd className="font-medium text-navy">
                      <AdminLink href={`/admin/questions/${item.id}`}>{item.title}</AdminLink>
                    </AdminTd>
                    <AdminTd className="text-muted">{item.languageName || "—"}</AdminTd>
                    <AdminTd>
                      <DifficultyBadge difficulty={item.difficulty} />
                    </AdminTd>
                    <AdminTd>
                      <StatusBadge status={item.status} />
                    </AdminTd>
                    <AdminTd>
                      <QuestionAdminActions id={item.id} onDelete={() => setDeleteId(item.id)} />
                    </AdminTd>
                  </AdminTr>
                ))}
              </tbody>
            </table>
          </AdminTable>
          <div className="mt-4 flex flex-wrap items-center justify-between gap-3 text-sm text-muted">
            <p>
              Page {page} of {pageCount}
            </p>
            <div className="flex gap-2">
              <AdminSecondaryButton
                disabled={page <= 1}
                onClick={() => setPage((p) => Math.max(1, p - 1))}
              >
                Previous
              </AdminSecondaryButton>
              <AdminSecondaryButton
                disabled={page >= pageCount}
                onClick={() => setPage((p) => p + 1)}
              >
                Next
              </AdminSecondaryButton>
            </div>
          </div>
        </>
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
