export const ADMIN_TOKEN_KEY = "interviewhub_admin_token";
export const ADMIN_AUTH_KEY = "interviewhub_admin_auth";

export function getAdminToken(): string | null {
  if (typeof window === "undefined") return null;
  return window.localStorage.getItem(ADMIN_TOKEN_KEY);
}

export function isAdminAuthenticated(): boolean {
  return Boolean(getAdminToken());
}

export function setAdminSession(token: string | null) {
  if (typeof window === "undefined") return;
  if (token) {
    window.localStorage.setItem(ADMIN_TOKEN_KEY, token);
    window.localStorage.setItem(ADMIN_AUTH_KEY, "1");
  } else {
    window.localStorage.removeItem(ADMIN_TOKEN_KEY);
    window.localStorage.removeItem(ADMIN_AUTH_KEY);
  }
}

export function setAdminAuthenticated(value: boolean) {
  if (!value) setAdminSession(null);
}
