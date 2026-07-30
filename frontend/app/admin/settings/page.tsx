"use client";

import { FormEvent, useState } from "react";
import {
  AdminCard,
  AdminPageHeader,
  AdminPrimaryButton,
} from "@/components/admin/AdminUi";
import { defaultSettings } from "@/lib/admin/data";

export default function AdminSettingsPage() {
  const [siteName, setSiteName] = useState(defaultSettings.siteName);
  const [metaSuffix, setMetaSuffix] = useState(defaultSettings.metaSuffix);
  const [publisherId, setPublisherId] = useState(defaultSettings.adsensePublisherId);
  const [ga4, setGa4] = useState(defaultSettings.ga4Connected);
  const [adsense, setAdsense] = useState(defaultSettings.adsenseConnected);
  const [saved, setSaved] = useState(false);

  const onSubmit = (e: FormEvent) => {
    e.preventDefault();
    setSaved(true);
    setTimeout(() => setSaved(false), 1500);
  };

  return (
    <div>
      <AdminPageHeader
        title="Settings"
        description="Site defaults, analytics, and AdSense connection (UI ready for API wiring)."
      />

      <form onSubmit={onSubmit} className="grid max-w-3xl gap-4">
        <AdminCard className="space-y-4">
          <h2 className="font-semibold text-navy">Site</h2>
          <label className="block text-sm">
            <span className="mb-1 block font-medium">Site name</span>
            <input
              value={siteName}
              onChange={(e) => setSiteName(e.target.value)}
              className="w-full rounded-lg border border-border px-3 py-2 text-sm outline-none focus:border-primary"
            />
          </label>
          <label className="block text-sm">
            <span className="mb-1 block font-medium">Default meta title suffix</span>
            <input
              value={metaSuffix}
              onChange={(e) => setMetaSuffix(e.target.value)}
              className="w-full rounded-lg border border-border px-3 py-2 text-sm outline-none focus:border-primary"
            />
          </label>
          <div className="rounded-lg bg-surface-soft px-3 py-2 text-sm text-muted">
            Difficulty labels: Beginner · Intermediate · Expert
          </div>
        </AdminCard>

        <AdminCard className="space-y-4">
          <h2 className="font-semibold text-navy">Analytics (GA4)</h2>
          <label className="flex items-center gap-2 text-sm">
            <input type="checkbox" checked={ga4} onChange={(e) => setGa4(e.target.checked)} />
            Mark GA4 as connected (powers Dashboard traffic cards)
          </label>
          <p className="text-xs text-muted">
            When connected, Dashboard shows last 24h / 7d / 30d / 12m visitors from analytics.
          </p>
        </AdminCard>

        <AdminCard className="space-y-4">
          <h2 className="font-semibold text-navy">Google AdSense</h2>
          <label className="flex items-center gap-2 text-sm">
            <input
              type="checkbox"
              checked={adsense}
              onChange={(e) => setAdsense(e.target.checked)}
            />
            Mark AdSense as connected
          </label>
          <label className="block text-sm">
            <span className="mb-1 block font-medium">Publisher ID</span>
            <input
              value={publisherId}
              onChange={(e) => setPublisherId(e.target.value)}
              placeholder="ca-pub-xxxxxxxxxxxxxxxx"
              className="w-full rounded-lg border border-border px-3 py-2 text-sm outline-none focus:border-primary"
            />
          </label>
          <p className="text-xs text-muted">
            Earnings on Dashboard need AdSense API / Ad Manager. This settings form stores connection
            metadata for the money view.
          </p>
        </AdminCard>

        <AdminPrimaryButton type="submit">{saved ? "Saved" : "Save settings"}</AdminPrimaryButton>
      </form>
    </div>
  );
}
