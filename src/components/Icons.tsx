export function SearchIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6">
      <circle cx="11" cy="11" r="7" />
      <path d="M20 20l-3.5-3.5" strokeLinecap="round" />
    </svg>
  );
}

export function UserIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6">
      <circle cx="12" cy="8" r="3.5" />
      <path d="M5 19c1.5-3.5 4-5 7-5s5.5 1.5 7 5" strokeLinecap="round" />
    </svg>
  );
}

export function HeartIcon({ filled = false }: { filled?: boolean }) {
  return (
    <svg viewBox="0 0 20 20" fill={filled ? "currentColor" : "none"} stroke="currentColor" strokeWidth="1.5" width="18" height="18">
      <path
        d="M10 17.5L3.2 11.1A4.5 4.5 0 0110 4.3a4.5 4.5 0 016.8 6.8L10 17.5z"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function BagIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6">
      <path d="M6 8h12l-1 12H7L6 8z" strokeLinejoin="round" />
      <path d="M9 8V6a3 3 0 016 0v2" strokeLinecap="round" />
    </svg>
  );
}

export function BoltIcon() {
  return (
    <svg width="11" height="14" viewBox="0 0 11 14" fill="currentColor" aria-hidden>
      <path d="M6.4 0 0 7.6h3.7L3.2 14 11 5.7H6.8L6.4 0Z" />
    </svg>
  );
}

export function ArrowRightIcon() {
  return (
    <svg viewBox="0 0 22 22" fill="none" stroke="currentColor" strokeWidth="1.6">
      <path d="M5 11h12M12 5l6 6-6 6" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export function ChevronLeftIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.6">
      <path d="M10 3L5 8l5 5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export function ChevronRightIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.6">
      <path d="M6 3l5 5-5 5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export function TrashIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6">
      <path d="M4 7h16M9 7V5a1 1 0 011-1h4a1 1 0 011 1v2M10 11v6M14 11v6M6 7l1 13a1 1 0 001 1h8a1 1 0 001-1l1-13" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}
