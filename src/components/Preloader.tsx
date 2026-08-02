"use client";

import Image from "next/image";
import { useEffect, useState } from "react";

export function Preloader() {
  const [phase, setPhase] = useState<"loading" | "leaving" | "done">("loading");
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    document.documentElement.classList.add("is-booting");
    document.documentElement.classList.remove("app-ready");

    let frame = 0;
    let value = 0;
    let raf = 0;

    const tick = () => {
      frame += 1;
      const target = frame < 42 ? 92 : 100;
      value += (target - value) * 0.08;
      setProgress(Math.min(100, value));

      if (value < 99.5) {
        raf = window.requestAnimationFrame(tick);
      } else {
        setProgress(100);
        setPhase("leaving");
        window.setTimeout(() => {
          document.documentElement.classList.remove("is-booting");
          document.documentElement.classList.add("app-ready");
          setPhase("done");
        }, 520);
      }
    };

    const start = window.setTimeout(() => {
      raf = window.requestAnimationFrame(tick);
    }, 120);

    return () => {
      window.clearTimeout(start);
      window.cancelAnimationFrame(raf);
      document.documentElement.classList.remove("is-booting");
    };
  }, []);

  if (phase === "done") return null;

  return (
    <div
      className={`preloader${phase === "leaving" ? " is-leaving" : ""}`}
      aria-hidden={phase !== "loading"}
      aria-busy={phase === "loading"}
    >
      <div className="preloader__inner">
        <Image
          src="/logo-flower-v3.png"
          alt=""
          width={104}
          height={80}
          className="preloader__flower"
          priority
        />
        <div className="preloader__track" aria-hidden>
          <span
            className="preloader__bar"
            style={{ transform: `scaleX(${Math.max(0.04, progress / 100)})` }}
          />
        </div>
      </div>
    </div>
  );
}
