"use client";

import { usePathname } from "next/navigation";
import { useEffect } from "react";
import { PUBLIC_API_BASE } from "@/lib/public-api";

const VID_KEY = "ih_vid";

function visitorId() {
  try {
    const existing = window.localStorage.getItem(VID_KEY);
    if (existing && /^[a-zA-Z0-9-]{8,80}$/.test(existing)) return existing;
    const created = crypto.randomUUID();
    window.localStorage.setItem(VID_KEY, created);
    return created;
  } catch {
    return "";
  }
}

function sendPageView(path: string) {
  const payload = JSON.stringify({
    path,
    referrer: document.referrer || "",
    vid: visitorId(),
  });
  const localUrl = "/api/page-views";
  const remoteUrl = `${PUBLIC_API_BASE}/api/public/page-views`;

  const ping = async (url: string) => {
    const res = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: payload,
      keepalive: true,
      credentials: "omit",
      cache: "no-store",
    });
    if (!res.ok) throw new Error(`track ${res.status}`);
  };

  ping(localUrl).catch(() => {
    ping(remoteUrl).catch(() => {});
  });
}

export function PageViewTracker() {
  const pathname = usePathname();

  useEffect(() => {
    if (!pathname || pathname.startsWith("/admin")) return;
    sendPageView(pathname);
  }, [pathname]);

  return null;
}
