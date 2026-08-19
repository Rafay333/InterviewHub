export type PublicUser = {
  id: string;
  name: string;
  email: string;
  lastLoginAt?: string | null;
  createdAt?: string | null;
};

export const USER_TOKEN_KEY = "interviewhub_user_token";
export const USER_PROFILE_KEY = "interviewhub_user";

export function getUserToken(): string | null {
  if (typeof window === "undefined") return null;
  return window.localStorage.getItem(USER_TOKEN_KEY);
}

export function getStoredUser(): PublicUser | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = window.localStorage.getItem(USER_PROFILE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as PublicUser;
    if (!parsed?.id || !parsed?.email) return null;
    return parsed;
  } catch {
    return null;
  }
}

export function setUserSession(token: string | null, user?: PublicUser | null) {
  if (typeof window === "undefined") return;
  if (token && user) {
    window.localStorage.setItem(USER_TOKEN_KEY, token);
    window.localStorage.setItem(USER_PROFILE_KEY, JSON.stringify(user));
  } else {
    window.localStorage.removeItem(USER_TOKEN_KEY);
    window.localStorage.removeItem(USER_PROFILE_KEY);
  }
  window.dispatchEvent(new Event("interviewhub-auth"));
}

export function clearUserSession() {
  setUserSession(null);
}
