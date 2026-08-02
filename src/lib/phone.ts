/** Digits only, max 9 after country code. */
export function uzPhoneDigits(value: string): string {
  const digits = value.replace(/\D/g, "");
  if (digits.startsWith("998")) return digits.slice(3, 12);
  return digits.slice(0, 9);
}

/** Format as +998 XX XXX XX XX */
export function formatUzPhone(value: string): string {
  const d = uzPhoneDigits(value);
  const parts = [
    d.slice(0, 2),
    d.slice(2, 5),
    d.slice(5, 7),
    d.slice(7, 9),
  ].filter(Boolean);
  return parts.length ? `+998 ${parts.join(" ")}` : "+998 ";
}

export function normalizeUzPhone(value: string): string {
  const d = uzPhoneDigits(value);
  return d.length === 9 ? `+998${d}` : "";
}

export function isValidUzPhone(value: string): boolean {
  return /^\+998\d{9}$/.test(normalizeUzPhone(value));
}
