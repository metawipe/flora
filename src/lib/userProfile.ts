export type UserProfile = {
  login: string;
  phone: string;
  name?: string;
  lastName?: string;
  email?: string;
  address?: string;
  role?: "customer" | "admin";
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
  const { login, phone, name, lastName, email, address, role } = profile;
  window.localStorage.setItem(
    USER_KEY,
    JSON.stringify({ login, phone, name, lastName, email, address, role }),
  );
}

export function clearUserSession() {
  window.localStorage.removeItem(USER_KEY);
}

async function supabaseMode(): Promise<boolean> {
  try {
    const res = await fetch("/api/auth/me", { cache: "no-store" });
    if (!res.ok) return false;
    const json = (await res.json()) as { mode?: string };
    return json.mode === "supabase";
  } catch {
    return false;
  }
}

/** Sync session from server (Supabase) into local cache. */
export async function refreshSessionProfile(): Promise<UserProfile | null> {
  try {
    const res = await fetch("/api/auth/me", { cache: "no-store" });
    if (!res.ok) return loadUserProfile();
    const json = (await res.json()) as {
      mode?: string;
      profile?: UserProfile | null;
    };
    if (json.mode !== "supabase") return loadUserProfile();
    if (json.profile) {
      saveUserProfile(json.profile);
      return json.profile;
    }
    clearUserSession();
    return null;
  } catch {
    return loadUserProfile();
  }
}

export async function registerAccount(
  profile: UserProfile,
  password: string,
): Promise<{ ok: true } | { ok: false; error: "exists" | "weak" | "phone" | "login_min" | "failed" }> {
  if (await supabaseMode()) {
    const res = await fetch("/api/auth/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        login: profile.login,
        phone: profile.phone,
        password,
        name: profile.name || profile.login,
      }),
    });
    const json = (await res.json().catch(() => ({}))) as {
      error?: string;
      profile?: UserProfile;
    };
    if (!res.ok) {
      const err = json.error;
      if (err === "exists" || err === "weak" || err === "phone" || err === "login_min") {
        return { ok: false, error: err };
      }
      return { ok: false, error: "failed" };
    }
    if (json.profile) saveUserProfile(json.profile);
    return { ok: true };
  }

  if (password.length < 6) return { ok: false, error: "weak" };
  const { isAdminLogin } = await import("@/lib/adminAccess");
  if (isAdminLogin(profile.login)) return { ok: false, error: "exists" };
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
    role: "customer",
    passwordHash,
  };
  writeAccounts([...accounts, next]);
  saveUserProfile(next);
  return { ok: true };
}

export async function loginAccount(
  login: string,
  password: string,
): Promise<
  | { ok: true; profile: UserProfile }
  | { ok: false; error: "bad" }
> {
  if (await supabaseMode()) {
    const res = await fetch("/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ login, password }),
    });
    if (!res.ok) return { ok: false, error: "bad" };
    const json = (await res.json()) as { profile: UserProfile };
    saveUserProfile(json.profile);
    return { ok: true, profile: json.profile };
  }

  const accounts = readAccounts();
  const loginKey = login.trim().toLowerCase();
  const account = accounts.find((a) => a.login.toLowerCase() === loginKey);
  if (!account) return { ok: false, error: "bad" };
  const passwordHash = await sha256(`${loginKey}:${password}`);
  if (passwordHash !== account.passwordHash) {
    return { ok: false, error: "bad" };
  }
  const { isAdminLogin } = await import("@/lib/adminAccess");
  const profile: UserProfile = {
    login: account.login,
    phone: account.phone,
    name: account.name,
    lastName: account.lastName,
    email: account.email,
    address: account.address,
    role: isAdminLogin(account.login) ? "admin" : "customer",
  };
  saveUserProfile(profile);
  return { ok: true, profile };
}

export async function logoutAccount() {
  clearUserSession();
  try {
    await fetch("/api/auth/logout", { method: "POST" });
  } catch {
    /* ignore */
  }
}
