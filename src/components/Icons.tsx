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

/** Rounded catalog grid — matches stroke style of Search/User */
export function CatalogIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6">
      <rect x="3.5" y="3.5" width="7" height="7" rx="2.4" />
      <rect x="13.5" y="3.5" width="7" height="7" rx="2.4" />
      <rect x="3.5" y="13.5" width="7" height="7" rx="2.4" />
      <rect x="13.5" y="13.5" width="7" height="7" rx="2.4" />
    </svg>
  );
}

/** Cart icon from vsrap.shop (aspro-premier #cart-20-18) */
export function BagIcon() {
  return (
    <svg viewBox="0 0 20 18" fill="currentColor" aria-hidden>
      <path
        fillRule="evenodd"
        d="M0.723 0.048 C 0.009 0.240,-0.229 1.171,0.300 1.700 C 0.581 1.981,0.588 1.982,1.958 1.994 L 3.166 2.004 3.183 2.077 C 3.192 2.117,3.546 4.055,3.968 6.383 C 4.391 8.712,4.759 10.707,4.788 10.817 C 5.041 11.800,5.894 12.631,6.933 12.908 L 7.217 12.983 11.717 12.983 C 16.799 12.983,16.366 13.006,16.967 12.711 C 17.234 12.580,17.331 12.508,17.586 12.253 C 18.099 11.740,18.078 11.799,18.873 8.633 L 19.547 5.950 19.549 5.500 C 19.550 5.119,19.538 5.012,19.472 4.800 C 19.204 3.942,18.569 3.325,17.700 3.079 C 17.494 3.020,17.194 3.017,11.429 3.008 L 5.374 2.999 5.317 2.674 C 5.052 1.180,4.994 1.019,4.568 0.596 C 4.273 0.304,3.956 0.128,3.583 0.050 C 3.268 -0.016,0.967 -0.018,0.723 0.048 M17.299 5.058 C 17.465 5.142,17.567 5.309,17.566 5.497 C 17.564 5.716,16.323 10.653,16.241 10.763 C 16.206 10.811,16.127 10.884,16.066 10.925 L 15.955 11.001 11.669 10.992 L 7.383 10.983 7.243 10.908 C 7.165 10.867,7.050 10.787,6.986 10.731 C 6.746 10.520,6.736 10.480,6.234 7.716 C 5.978 6.305,5.760 5.116,5.750 5.075 L 5.732 5.000 11.458 5.000 C 16.842 5.000,17.190 5.004,17.299 5.058 M5.150 15.046 C 4.751 15.144,4.335 15.469,4.167 15.816 C 3.948 16.269,3.949 16.730,4.170 17.191 C 4.268 17.395,4.605 17.732,4.809 17.830 C 5.430 18.128,6.079 18.025,6.552 17.552 C 7.131 16.973,7.150 16.092,6.597 15.487 C 6.242 15.098,5.662 14.922,5.150 15.046 M16.142 15.051 C 15.550 15.211,15.128 15.676,15.024 16.283 C 14.861 17.235,15.765 18.139,16.717 17.976 C 17.373 17.864,17.864 17.373,17.976 16.717 C 18.150 15.703,17.138 14.783,16.142 15.051"
      />
    </svg>
  );
}

export function OrdersIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6">
      <path d="M7 4h10l1 16H6L7 4z" strokeLinejoin="round" />
      <path d="M9 9h6M9 13h6M9 17h4" strokeLinecap="round" />
    </svg>
  );
}

export function HelpIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6">
      <circle cx="12" cy="12" r="9" />
      <path
        d="M9.6 9.2a2.4 2.4 0 114.2 1.6c-.8.9-1.8 1.3-1.8 2.7"
        strokeLinecap="round"
      />
      <circle cx="12" cy="17" r="0.9" fill="currentColor" stroke="none" />
    </svg>
  );
}

export function ProfileEditIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6">
      <circle cx="12" cy="8" r="3.2" />
      <path d="M5.5 19c1.4-3 3.8-4.5 6.5-4.5s5.1 1.5 6.5 4.5" strokeLinecap="round" />
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
