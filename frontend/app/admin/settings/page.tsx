"use client";

import { FormEvent, useEffect, useState } from "react";
import {
  adminInputClass,
  adminLabelClass,
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
      <AdminPageHeader
        title="Settings"
        description="Site and monetization settings stored in SQL Server."
      />
      {error ? (
        <p className="mb-3 rounded-xl border border-hard/20 bg-hard/10 px-3 py-2 text-sm text-hard">
          {error}
        </p>
      ) : null}
      {settings ? (
        <form onSubmit={onSubmit} className="grid max-w-3xl gap-4">
          <AdminCard className="space-y-4 bg-gradient-to-br from-primary/5 to-white">
            <h2 className="font-bold text-navy">Site</h2>
            <label className="block text-sm">
              <span className={adminLabelClass}>Site name</span>
              <input
                value={settings.siteName}
                onChange={(e) => setSettings({ ...settings, siteName: e.target.value })}
                className={adminInputClass}
              />
            </label>
            <label className="block text-sm">
              <span className={adminLabelClass}>Meta suffix</span>
              <input
                value={settings.metaSuffix}
                onChange={(e) => setSettings({ ...settings, metaSuffix: e.target.value })}
                className={adminInputClass}
              />
            </label>
          </AdminCard>
          <AdminCard className="space-y-4 bg-gradient-to-br from-accent/5 to-white">
            <h2 className="font-bold text-navy">Integrations</h2>
            <label className="flex items-center gap-2 rounded-xl border border-primary/15 bg-white px-3 py-2.5 text-sm font-medium">
              <input
                type="checkbox"
                checked={settings.ga4Connected}
                onChange={(e) => setSettings({ ...settings, ga4Connected: e.target.checked })}
                className="accent-primary"
              />
              GA4 connected
            </label>
            <label className="flex items-center gap-2 rounded-xl border border-accent/20 bg-white px-3 py-2.5 text-sm font-medium">
              <input
                type="checkbox"
                checked={settings.adsenseConnected}
                onChange={(e) =>
                  setSettings({ ...settings, adsenseConnected: e.target.checked })
                }
                className="accent-accent"
              />
              AdSense connected
            </label>
            <label className="block text-sm">
              <span className={adminLabelClass}>Publisher ID</span>
              <input
                value={settings.adsensePublisherId || ""}
                onChange={(e) =>
                  setSettings({ ...settings, adsensePublisherId: e.target.value })
                }
                className={adminInputClass}
                placeholder="ca-pub-xxxxxxxx"
              />
              <span className="mt-1 block text-xs text-muted">
                Same ID as ads.txt and the site-wide AdSense snippet. Live dollar
                amounts need the AdSense Management API (Google OAuth).
              </span>
            </label>
          </AdminCard>
          <AdminPrimaryButton type="submit">{saved ? "Saved ✓" : "Save settings"}</AdminPrimaryButton>
        </form>
      ) : null}
    </div>
  );
}
