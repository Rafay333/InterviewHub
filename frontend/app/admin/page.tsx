"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import {
  AdminCard,
  AdminPageHeader,
  AdminPrimaryButton,
  AdminSecondaryButton,
  AdminSectionTitle,
  AdminStatCard,
} from "@/components/admin/AdminUi";
import { adminApi } from "@/lib/admin/api";
import type { DashboardData } from "@/lib/admin/types";

type RangeKey = "24h" | "7d" | "30d" | "12m";

const rangeLabels: Record<RangeKey, string> = {
  "24h": "Last 24 hours",
  "7d": "Last 7 days",
  "30d": "Last 30 days",
  "12m": "Last 12 months",
};

function MiniBars({ values }: { values: number[] }) {
  const max = Math.max(...values, 1);
  return (
    <div className="flex h-28 items-end gap-1.5">
      {values.map((v, i) => (
        <div
          key={i}
          className="flex-1 rounded-t bg-gradient-to-t from-primary via-[#3b82f6] to-accent/70"
          style={{ height: `${Math.max(8, (v / max) * 100)}%` }}
          title={String(v)}
        />
      ))}
    </div>
  );
}

export default function AdminDashboardPage() {
  const [data, setData] = useState<DashboardData | null>(null);
  const [range, setRange] = useState<RangeKey>("7d");
  const [error, setError] = useState("");

  useEffect(() => {
    adminApi
      .dashboard()
      .then(setData)
      .catch((err) => setError(err.message));
  }, []);

  if (error) {
    return (
      <div>
        <AdminPageHeader title="Dashboard Insights" />
        <p className="rounded-xl border border-hard/20 bg-hard/10 px-4 py-3 text-sm text-hard">
          {error}
        </p>
        <p className="mt-2 text-sm text-muted">
          The live API did not respond. On Vercel, set NEXT_PUBLIC_API_URL to your Railway
          backend URL, then redeploy.
        </p>
      </div>
    );
  }

  if (!data) {
    return <p className="text-sm text-muted">Loading dashboard…</p>;
  }

  const { traffic, adsense, content, topPages, recentActivity } = data;
  const trafficValue =
    range === "24h"
      ? traffic.last24h
      : range === "7d"
        ? traffic.last7d
        : range === "30d"
          ? traffic.last30d
          : traffic.last12m;

  return (
    <div>
      <AdminPageHeader
        title="Dashboard Insights"
        description="Unique visitors from the live public site. Each person who opens a page is counted once per time range; top pages count every view."
        actions={
          <>
            <AdminPrimaryButton href="/admin/questions/new">Add Question</AdminPrimaryButton>
            <AdminSecondaryButton href="/admin/questions/import">Import PDF</AdminSecondaryButton>
            <AdminSecondaryButton href="/admin/languages/new">Add Language</AdminSecondaryButton>
          </>
        }
      />

      <section className="mb-8">
        <AdminSectionTitle>Traffic</AdminSectionTitle>
        <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
          <AdminStatCard
            label="Last 24 hours"
            value={traffic.last24h.toLocaleString()}
            hint={`${(traffic.views24h ?? traffic.last24h).toLocaleString()} page views`}
            tone={0}
          />
          <AdminStatCard
            label="Last 7 days"
            value={traffic.last7d.toLocaleString()}
            hint={`${(traffic.views7d ?? traffic.last7d).toLocaleString()} page views`}
            tone={1}
          />
          <AdminStatCard
            label="Last 30 days"
            value={traffic.last30d.toLocaleString()}
            hint={`${(traffic.views30d ?? traffic.last30d).toLocaleString()} page views`}
            tone={2}
          />
          <AdminStatCard
            label="Last 12 months"
            value={traffic.last12m.toLocaleString()}
            hint={`${(traffic.views12m ?? traffic.last12m).toLocaleString()} page views`}
            tone={3}
          />
        </div>
        <AdminCard className="mt-4 border-primary/15 bg-gradient-to-br from-white to-surface-tint/40">
          <div className="mb-4 flex flex-wrap items-center justify-between gap-2">
            <div>
              <h3 className="font-bold text-navy">Unique visitors over time</h3>
              <p className="text-sm text-muted">
                {rangeLabels[range]} · {trafficValue.toLocaleString()} unique visitors
              </p>
            </div>
            <div className="flex gap-1 rounded-xl border border-primary/15 bg-white p-1 shadow-sm">
              {(Object.keys(rangeLabels) as RangeKey[]).map((key) => (
                <button
                  key={key}
                  type="button"
                  onClick={() => setRange(key)}
                  className={`rounded-lg px-2.5 py-1 text-xs font-semibold ${
                    range === key
                      ? "bg-primary text-white shadow-sm"
                      : "text-muted hover:bg-surface-tint"
                  }`}
                >
                  {key}
                </button>
              ))}
            </div>
          </div>
          <MiniBars values={data.trafficSeries[range] || [trafficValue]} />
        </AdminCard>
        <AdminCard className="mt-4">
          <h3 className="mb-3 font-bold text-navy">Top pages</h3>
          {topPages.length === 0 ? (
            <p className="text-sm text-muted">No page_views yet.</p>
          ) : (
            <ul className="divide-y divide-primary/10">
              {topPages.map((p) => (
                <li key={p.path} className="flex items-center justify-between py-2.5 text-sm">
                  <span className="font-mono text-ink">{p.path}</span>
                  <span className="rounded-full bg-primary/10 px-2.5 py-0.5 font-semibold text-primary">
                    {p.views.toLocaleString()} views
                  </span>
                </li>
              ))}
            </ul>
          )}
        </AdminCard>
      </section>

      <section className="mb-8">
        <AdminSectionTitle>AdSense / Earnings</AdminSectionTitle>
        <div
          className={`mb-4 rounded-2xl border px-4 py-3 text-sm ${
            adsense.connected
              ? "border-easy/30 bg-easy/10 text-easy"
              : "border-accent/40 bg-[#fff7ed] text-accent"
          }`}
        >
          <span className="font-bold">
            {adsense.connected ? "AdSense connected" : "AdSense not connected"}
          </span>
          {" — "}
          <span className="text-muted">Values from adsense_stats / Settings.</span>
        </div>
        <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
          <AdminStatCard label="Today" value={`$${adsense.today.toFixed(2)}`} tone={1} />
          <AdminStatCard label="Last 7 days" value={`$${adsense.last7d.toFixed(2)}`} tone={0} />
          <AdminStatCard label="Last 30 days" value={`$${adsense.last30d.toFixed(2)}`} tone={2} />
          <AdminStatCard label="YTD" value={`$${adsense.ytd.toFixed(2)}`} tone={3} />
        </div>
      </section>

      <section>
        <AdminSectionTitle>Content ops</AdminSectionTitle>
        <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
          <AdminStatCard
            label="Languages"
            value={content.languages}
            href="/admin/languages"
            tone={0}
          />
          <AdminStatCard
            label="Categories"
            value={content.categories}
            href="/admin/categories"
            tone={1}
          />
          <AdminStatCard
            label="Questions"
            value={content.questions}
            href="/admin/questions"
            tone={2}
          />
          <AdminStatCard label="Blogs" value={content.blogs} href="/admin/blogs" tone={3} />
        </div>
        <div className="mt-4 grid gap-4 lg:grid-cols-2">
          <AdminCard className="bg-gradient-to-br from-white to-easy/5">
            <h3 className="mb-3 font-bold text-navy">Publish status</h3>
            <p className="text-sm text-muted">
              Published:{" "}
              <strong className="text-easy">{content.publishedQuestions}</strong>
            </p>
            <p className="mt-1 text-sm text-muted">
              Drafts: <strong className="text-medium">{content.draftQuestions}</strong>
            </p>
            <div className="mt-4 space-y-2">
              {(
                [
                  ["Beginner", content.byDifficulty.beginner, "bg-easy"],
                  ["Intermediate", content.byDifficulty.intermediate, "bg-medium"],
                  ["Expert", content.byDifficulty.expert, "bg-hard"],
                ] as const
              ).map(([label, count, color]) => (
                <div key={label} className="flex items-center gap-3 text-sm">
                  <span className="w-28 font-medium text-muted">{label}</span>
                  <div className="h-2.5 flex-1 rounded-full bg-surface-soft">
                    <div
                      className={`h-2.5 rounded-full ${color}`}
                      style={{
                        width: `${Math.max(8, (count / Math.max(content.questions, 1)) * 100)}%`,
                      }}
                    />
                  </div>
                  <span className="w-6 font-bold text-navy">{count}</span>
                </div>
              ))}
            </div>
          </AdminCard>
          <AdminCard className="bg-gradient-to-br from-white to-accent/5">
            <h3 className="mb-3 font-bold text-navy">Recent activity</h3>
            <ul className="space-y-3">
              {recentActivity.length === 0 ? (
                <li className="text-sm text-muted">No recent questions yet.</li>
              ) : (
                recentActivity.map((item) => (
                  <li
                    key={item.id}
                    className="rounded-xl border border-primary/10 bg-surface-tint/40 px-3 py-2.5"
                  >
                    <p className="text-sm font-medium text-ink">
                      {item.action}: <span className="text-primary">{item.target}</span>
                    </p>
                    <p className="text-xs text-muted">{item.at}</p>
                  </li>
                ))
              )}
            </ul>
          </AdminCard>
        </div>
        <div className="mt-4 flex flex-wrap gap-2">
          <Link
            href="/admin/questions/import"
            className="rounded-xl bg-accent px-4 py-2 text-sm font-semibold text-white shadow-sm shadow-accent/25 hover:bg-orange-600"
          >
            PDF Import
          </Link>
          <AdminSecondaryButton href="/admin/blogs/new">New Blog</AdminSecondaryButton>
          <AdminSecondaryButton href="/admin/media">Media library</AdminSecondaryButton>
        </div>
      </section>
    </div>
  );
}
