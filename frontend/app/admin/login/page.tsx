"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { isAdminAuthenticated } from "@/lib/admin/auth";

export default function AdminLoginPage() {
  const router = useRouter();

  useEffect(() => {
    router.replace(isAdminAuthenticated() ? "/admin" : "/login");
  }, [router]);

  return (
    <div className="flex min-h-screen items-center justify-center text-sm text-muted">
      Loading…
    </div>
  );
}
