import { PUBLIC_API_BASE } from "@/lib/public-api";
import { getUserToken, type PublicUser } from "@/lib/user-auth";

export type AuthResponse = {
  token: string;
  user: PublicUser;
};

async function userRequest<T>(path: string, options: RequestInit = {}): Promise<T> {
  const headers = new Headers(options.headers || {});
  const token = getUserToken();
  if (token) headers.set("Authorization", `Bearer ${token}`);
  if (options.body && !headers.has("Content-Type")) {
    headers.set("Content-Type", "application/json");
  }

  const res = await fetch(`${PUBLIC_API_BASE}/api/public${path}`, {
    cache: "no-store",
    ...options,
    headers,
  });

  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    throw new Error(data.message || "Request failed");
  }
  return data as T;
}

export const userApi = {
  register(payload: { name: string; email: string; password: string }) {
    return userRequest<AuthResponse>("/auth/register", {
      method: "POST",
      body: JSON.stringify(payload),
    });
  },

  login(email: string, password: string) {
    return userRequest<AuthResponse>("/auth/login", {
      method: "POST",
      body: JSON.stringify({ email, password }),
    });
  },

  me() {
    return userRequest<{ user: PublicUser }>("/auth/me");
  },
};
