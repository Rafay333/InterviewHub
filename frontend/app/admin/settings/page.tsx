"use client";

import { FormEvent, useEffect, useState } from "react";
import {
  AdminCard,
  AdminPageHeader,
  AdminPrimaryButton,
} from "@/components/admin/AdminUi";
import { adminApi } from "@/lib/admin/api";
import type { SiteSettings } from "@/lib/admin/types";

export default function AdminSettingsPage() {
  const [settings, setSettings] = useState<SiteSettings | null>(null);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    adminApi
      .getSettings()
      .then(setSettings)
      .catch((err) => setError(err.message));
  }, []);

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!settings) return;
    try {
      const next = await adminApi.updateSettings(settings);
      setSettings(next);
      setSaved(true);
      setTimeout(() => setSaved(false), 1500);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Save failed");
    }
  };

  if (!settings && !error) return <p className="text-sm text-muted">Loading…</p>;

  return (
    <div>
      <AdminPageHeader title="Settings" description="Stored in SQL Server site_settings." />
      {error ? <p className="mb-3 text-sm text-hard">{error}</p> : null}
      {settings ? (
        <form onSubmit={onSubmit} className="grid max-w-3xl gap-4">
          <AdminCard className="space-y-4">
            <label className="block text-sm">
              <span className="mb-1 block font-medium">Site name</span>
              <input
                value={settings.siteName}
                onChange={(e) => setSettings({ ...settings, siteName: e.target.value })}
                className="w-full rounded-lg border border-border px-3 py-2 text-sm"
              />
            </label>
            <label className="block text-sm">
              <span className="mb-1 block font-medium">Meta suffix</span>
              <input
                value={settings.metaSuffix}
                onChange={(e) => setSettings({ ...settings, metaSuffix: e.target.value })}
                className="w-full rounded-lg border border-border px-3 py-2 text-sm"
              />
            </label>
          </AdminCard>
          <AdminCard className="space-y-4">
            <label className="flex items-center gap-2 text-sm">
              <input
                type="checkbox"
                checked={settings.ga4Connected}
                onChange={(e) => setSettings({ ...settings, ga4Connected: e.target.checked })}
              />
              GA4 connected
            </label>
            <label className="flex items-center gap-2 text-sm">
              <input
                type="checkbox"
                checked={settings.adsenseConnected}
                onChange={(e) =>
                  setSettings({ ...settings, adsenseConnected: e.target.checked })
                }
              />
              AdSense connected
            </label>
            <label className="block text-sm">
              <span className="mb-1 block font-medium">Publisher ID</span>
              <input
                value={settings.adsensePublisherId || ""}
                onChange={(e) =>
                  setSettings({ ...settings, adsensePublisherId: e.target.value })
                }
                className="w-full rounded-lg border border-border px-3 py-2 text-sm"
                placeholder="ca-pub-xxxxxxxx"
              />
            </label>
          </AdminCard>
          <AdminPrimaryButton type="submit">{saved ? "Saved" : "Save settings"}</AdminPrimaryButton>
        </form>
      ) : null}
    </div>
  );
}
