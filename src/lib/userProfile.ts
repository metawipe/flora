export type UserProfile = {
  login: string;
  phone: string;
  name?: string;
  lastName?: string;
  email?: string;
  address?: string;
};

export const USER_KEY = "loveflowers-user";

export function loadUserProfile(): UserProfile | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = window.localStorage.getItem(USER_KEY);
    return raw ? (JSON.parse(raw) as UserProfile) : null;
  } catch {
    return null;
  }
}

export function saveUserProfile(profile: UserProfile) {
  window.localStorage.setItem(USER_KEY, JSON.stringify(profile));
}
