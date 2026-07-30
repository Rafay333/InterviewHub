"use client";

import Link from "next/link";
import { useState } from "react";
import {
  AdminCard,
  AdminPageHeader,
  AdminPrimaryButton,
  AdminSecondaryButton,
} from "@/components/admin/AdminUi";
import { insightStats, recentActivity } from "@/lib/admin/data";

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
          className="flex-1 rounded-t bg-gradient-to-t from-primary to-[#93c5fd]"
          style={{ height: `${Math.max(8, (v / max) * 100)}%` }}
          title={String(v)}
        />
      ))}
    </div>
  );
}

export default function AdminDashboardPage() {
  const [range, setRange] = useState<RangeKey>("7d");
  const { traffic, adsense, content, topPages } = insightStats;

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
        description="Traffic, AdSense overview, and content operations."
        actions={
          <>
            <AdminPrimaryButton href="/admin/questions/new">Add Question</AdminPrimaryButton>
            <AdminSecondaryButton href="/admin/languages/new">Add Language</AdminSecondaryButton>
            <AdminSecondaryButton href="/admin/blogs/new">New Blog</AdminSecondaryButton>
            <AdminSecondaryButton href="/admin/questions/import">Import PDF</AdminSecondaryButton>
          </>
        }
      />

      <section className="mb-6">
        <h2 className="mb-3 text-sm font-semibold uppercase tracking-wide text-muted">
          Traffic
        </h2>
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {[
            { label: "Last 24 hours", value: traffic.last24h },
            { label: "Last 7 days", value: traffic.last7d },
            { label: "Last 30 days", value: traffic.last30d },
            { label: "Last 12 months", value: traffic.last12m },
          ].map((card) => (
            <AdminCard key={card.label}>
              <p className="text-xs font-medium uppercase tracking-wide text-muted">{card.label}</p>
              <p className="mt-2 text-2xl font-bold text-navy">{card.value.toLocaleString()}</p>
              <p className="mt-1 text-xs text-muted">Visitors (mock GA4)</p>
            </AdminCard>
          ))}
        </div>

        <AdminCard className="mt-4">
          <div className="mb-4 flex flex-wrap items-center justify-between gap-2">
            <div>
              <h3 className="font-semibold text-navy">Visitors over time</h3>
              <p className="text-sm text-muted">
                {rangeLabels[range]} · {trafficValue.toLocaleString()} visitors
              </p>
            </div>
            <div className="flex gap-1 rounded-lg border border-border p-1">
              {(Object.keys(rangeLabels) as RangeKey[]).map((key) => (
                <button
                  key={key}
                  type="button"
                  onClick={() => setRange(key)}
                  className={`rounded-md px-2.5 py-1 text-xs font-semibold ${
                    range === key ? "bg-primary text-white" : "text-muted hover:bg-surface-soft"
                  }`}
                >
                  {key}
                </button>
              ))}
            </div>
          </div>
          <MiniBars values={insightStats.trafficSeries[range]} />
          <p className="mt-3 text-xs text-muted">
            Connect Google Analytics 4 in Settings to replace mock numbers.
          </p>
        </AdminCard>

        <AdminCard className="mt-4">
          <h3 className="mb-3 font-semibold text-navy">Top pages</h3>
          <ul className="divide-y divide-border">
            {topPages.map((p) => (
              <li key={p.path} className="flex items-center justify-between py-2 text-sm">
                <span className="font-mono text-ink">{p.path}</span>
                <span className="font-semibold text-navy">{p.views.toLocaleString()} views</span>
              </li>
            ))}
          </ul>
        </AdminCard>
      </section>

      <section className="mb-6">
        <h2 className="mb-3 text-sm font-semibold uppercase tracking-wide text-muted">
          AdSense / Earnings
        </h2>
        <div className="mb-4 rounded-xl border border-dashed border-accent/40 bg-[#fff7ed] px-4 py-3 text-sm text-ink">
          <span className="font-semibold text-accent">
            {adsense.connected ? "AdSense connected" : "AdSense not connected"}
          </span>
          {" — "}
          Live earnings need Google AdSense API. Figures below are UI placeholders for the money view.
        </div>
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {[
            { label: "Today", value: `$${adsense.today.toFixed(2)}` },
            { label: "Last 7 days", value: `$${adsense.last7d.toFixed(2)}` },
            { label: "Last 30 days", value: `$${adsense.last30d.toFixed(2)}` },
            { label: "YTD", value: `$${adsense.ytd.toFixed(2)}` },
          ].map((card) => (
            <AdminCard key={card.label}>
              <p className="text-xs font-medium uppercase tracking-wide text-muted">{card.label}</p>
              <p className="mt-2 text-2xl font-bold text-navy">{card.value}</p>
            </AdminCard>
          ))}
        </div>
        <div className="mt-4 grid gap-4 lg:grid-cols-2">
          <AdminCard>
            <h3 className="mb-3 font-semibold text-navy">Performance</h3>
            <dl className="grid grid-cols-2 gap-3 text-sm">
              <div>
                <dt className="text-muted">Page RPM</dt>
                <dd className="text-lg font-bold text-navy">${adsense.rpm.toFixed(2)}</dd>
              </div>
              <div>
                <dt className="text-muted">CTR</dt>
                <dd className="text-lg font-bold text-navy">{adsense.ctr}%</dd>
              </div>
            </dl>
          </AdminCard>
          <AdminCard>
            <h3 className="mb-3 font-semibold text-navy">Top earning pages</h3>
            <ul className="space-y-2 text-sm">
              {adsense.topEarning.map((row) => (
                <li key={row.path} className="flex justify-between">
                  <span className="font-mono">{row.path}</span>
                  <span className="font-semibold">${row.earnings.toFixed(2)}</span>
                </li>
              ))}
            </ul>
          </AdminCard>
        </div>
      </section>

      <section>
        <h2 className="mb-3 text-sm font-semibold uppercase tracking-wide text-muted">
          Content ops
        </h2>
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {[
            { label: "Languages", value: content.languages, href: "/admin/languages" },
            { label: "Categories", value: content.categories, href: "/admin/categories" },
            { label: "Questions", value: content.questions, href: "/admin/questions" },
            { label: "Blogs", value: content.blogs, href: "/admin/blogs" },
          ].map((card) => (
            <Link key={card.label} href={card.href}>
              <AdminCard className="transition hover:border-primary/40">
                <p className="text-xs font-medium uppercase tracking-wide text-muted">{card.label}</p>
                <p className="mt-2 text-2xl font-bold text-navy">{card.value}</p>
              </AdminCard>
            </Link>
          ))}
        </div>

        <div className="mt-4 grid gap-4 lg:grid-cols-2">
          <AdminCard>
            <h3 className="mb-3 font-semibold text-navy">Publish status</h3>
            <p className="text-sm text-muted">
              Published questions: <strong className="text-ink">{content.publishedQuestions}</strong>
            </p>
            <p className="mt-1 text-sm text-muted">
              Drafts: <strong className="text-ink">{content.draftQuestions}</strong>
            </p>
            <div className="mt-4 space-y-2">
              {(
                [
                  ["Beginner", content.byDifficulty.beginner, "bg-green-500"],
                  ["Intermediate", content.byDifficulty.intermediate, "bg-amber-500"],
                  ["Expert", content.byDifficulty.expert, "bg-red-500"],
                ] as const
              ).map(([label, count, color]) => (
                <div key={label} className="flex items-center gap-3 text-sm">
                  <span className="w-28 text-muted">{label}</span>
                  <div className="h-2 flex-1 rounded-full bg-surface-soft">
                    <div
                      className={`h-2 rounded-full ${color}`}
                      style={{ width: `${Math.max(8, (count / Math.max(content.questions, 1)) * 100)}%` }}
                    />
                  </div>
                  <span className="w-6 font-semibold">{count}</span>
                </div>
              ))}
            </div>
          </AdminCard>

          <AdminCard>
            <h3 className="mb-3 font-semibold text-navy">Recent activity</h3>
            <ul className="space-y-3">
              {recentActivity.map((item) => (
                <li key={item.id} className="border-b border-border pb-3 last:border-0 last:pb-0">
                  <p className="text-sm font-medium text-ink">
                    {item.action}: <span className="text-navy">{item.target}</span>
                  </p>
                  <p className="text-xs text-muted">
                    {item.actor} · {item.at}
                  </p>
                </li>
              ))}
            </ul>
          </AdminCard>
        </div>
      </section>
    </div>
  );
}
