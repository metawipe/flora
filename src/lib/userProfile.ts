export type UserProfile = {
  login: string;
  phone: string;
  name?: string;
  lastName?: string;
  email?: string;
  address?: string;
};

type StoredAccount = UserProfile & {
  passwordHash: string;
};

export const USER_KEY = "zamin-user";
export const USERS_KEY = "zamin-users";
const LEGACY_USER_KEY = "loveflowers-user";

async function sha256(text: string): Promise<string> {
  const data = new TextEncoder().encode(text);
  const buf = await crypto.subtle.digest("SHA-256", data);
  return Array.from(new Uint8Array(buf))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}

function readAccounts(): StoredAccount[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(USERS_KEY);
    return raw ? (JSON.parse(raw) as StoredAccount[]) : [];
  } catch {
    return [];
  }
}

function writeAccounts(accounts: StoredAccount[]) {
  window.localStorage.setItem(USERS_KEY, JSON.stringify(accounts));
}

function migrateLegacySession() {
  if (typeof window === "undefined") return;
  try {
    if (!window.localStorage.getItem(USER_KEY)) {
      const legacy = window.localStorage.getItem(LEGACY_USER_KEY);
      if (legacy) {
        window.localStorage.setItem(USER_KEY, legacy);
        window.localStorage.removeItem(LEGACY_USER_KEY);
      }
    }
  } catch {
    /* ignore */
  }
}

export function loadUserProfile(): UserProfile | null {
  if (typeof window === "undefined") return null;
  migrateLegacySession();
  try {
    const raw = window.localStorage.getItem(USER_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as UserProfile;
    if (!parsed?.login) return null;
    return parsed;
  } catch {
    return null;
  }
}

export function saveUserProfile(profile: UserProfile) {
  const { login, phone, name, lastName, email, address } = profile;
  window.localStorage.setItem(
    USER_KEY,
    JSON.stringify({ login, phone, name, lastName, email, address }),
  );
}

export function clearUserSession() {
  window.localStorage.removeItem(USER_KEY);
}

export async function registerAccount(
  profile: UserProfile,
  password: string,
): Promise<{ ok: true } | { ok: false; error: "exists" | "weak" }> {
  if (password.length < 6) return { ok: false, error: "weak" };
  const accounts = readAccounts();
  const loginKey = profile.login.trim().toLowerCase();
  if (accounts.some((a) => a.login.toLowerCase() === loginKey)) {
    return { ok: false, error: "exists" };
  }
  const passwordHash = await sha256(`${loginKey}:${password}`);
  const next: StoredAccount = {
    login: profile.login.trim(),
    phone: profile.phone,
    name: profile.name,
    lastName: profile.lastName,
    email: profile.email,
    address: profile.address,
    passwordHash,
  };
  writeAccounts([...accounts, next]);
  saveUserProfile(next);
  return { ok: true };
}

export async function loginAccount(
  login: string,
  password: string,
): Promise<{ ok: true; profile: UserProfile } | { ok: false; error: "bad" }> {
  const accounts = readAccounts();
  const loginKey = login.trim().toLowerCase();
  const account = accounts.find((a) => a.login.toLowerCase() === loginKey);
  if (!account) return { ok: false, error: "bad" };
  const passwordHash = await sha256(`${loginKey}:${password}`);
  if (passwordHash !== account.passwordHash) {
    return { ok: false, error: "bad" };
  }
  const profile: UserProfile = {
    login: account.login,
    phone: account.phone,
    name: account.name,
    lastName: account.lastName,
    email: account.email,
    address: account.address,
  };
  saveUserProfile(profile);
  return { ok: true, profile };
}
