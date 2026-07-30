export const ADMIN_AUTH_KEY = "interviewhub_admin_auth";

export function isAdminAuthenticated(): boolean {
  if (typeof window === "undefined") return false;
  return window.localStorage.getItem(ADMIN_AUTH_KEY) === "1";
}

export function setAdminAuthenticated(value: boolean) {
  if (typeof window === "undefined") return;
  if (value) window.localStorage.setItem(ADMIN_AUTH_KEY, "1");
  else window.localStorage.removeItem(ADMIN_AUTH_KEY);
}
