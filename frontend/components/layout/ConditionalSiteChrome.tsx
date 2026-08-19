"use client";

import { usePathname } from "next/navigation";
import { PageViewTracker } from "@/components/analytics/PageViewTracker";
import { SiteFooter } from "@/components/layout/SiteFooter";
import { SiteHeader } from "@/components/layout/SiteHeader";

export function ConditionalSiteChrome({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const isAdmin = pathname.startsWith("/admin");
  const isAuth = pathname === "/login" || pathname === "/signup";

  if (isAdmin) {
    return <>{children}</>;
  }

  return (
    <>
      <PageViewTracker />
      <SiteHeader />
      <div className="flex-1">{children}</div>
      {isAuth ? null : <SiteFooter />}
    </>
  );
}
