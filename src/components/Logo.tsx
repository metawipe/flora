import Image from "next/image";
import Link from "next/link";
import { site } from "@/data/products";

type LogoProps = {
  className?: string;
  priority?: boolean;
};

export function Logo({ className = "", priority = false }: LogoProps) {
  return (
    <Link
      href="/"
      className={`logo${className ? ` ${className}` : ""}`}
      aria-label={site.name}
    >
      <Image
        src="/logo-flower-v3.png"
        alt=""
        width={84}
        height={64}
        className="logo__mark"
        priority={priority}
      />
      <span className="logo__text">
        <span className="logo__name">Zamin</span>
        <span className="logo__script">Gullari</span>
      </span>
    </Link>
  );
}
