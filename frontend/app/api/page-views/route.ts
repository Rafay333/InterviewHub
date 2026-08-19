import { PUBLIC_API_BASE } from "@/lib/public-api";

export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  let body: unknown = {};
  try {
    body = await request.json();
  } catch {
    body = {};
  }

  const forwardedFor =
    request.headers.get("x-forwarded-for") ||
    request.headers.get("x-real-ip") ||
    "";
  const userAgent = request.headers.get("user-agent") || "";

  try {
    await fetch(`${PUBLIC_API_BASE}/api/public/page-views`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "User-Agent": userAgent,
        "X-Forwarded-For": forwardedFor,
      },
      body: JSON.stringify(body),
      cache: "no-store",
    });
  } catch {
    // Tracking must never break page rendering.
  }

  return new Response(null, { status: 204 });
}
