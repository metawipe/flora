"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import type { HeroSlide } from "@/data/products";
import { ChevronLeftIcon, ChevronRightIcon } from "./Icons";

type HeroProps = {
  slides: HeroSlide[];
};

export function Hero({ slides }: HeroProps) {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const id = window.setInterval(() => {
      setIndex((prev) => (prev + 1) % slides.length);
    }, 5000);
    return () => window.clearInterval(id);
  }, [slides.length]);

  const go = (dir: -1 | 1) => {
    setIndex((prev) => (prev + dir + slides.length) % slides.length);
  };

  return (
    <section className="hero">
      {slides.map((slide, i) => (
        <Link
          key={slide.id}
          href={slide.href}
          className={`hero__slide${i === index ? " is-active" : ""}`}
          aria-hidden={i !== index}
          tabIndex={i === index ? 0 : -1}
        >
          <Image
            src={slide.image}
            alt={slide.title}
            fill
            priority={i === 0}
            className="hero__image"
            sizes="100vw"
          />
          <div className="hero__overlay" />
          <h1 className="hero__title">{slide.title}</h1>
        </Link>
      ))}

      <div className="hero__controls">
        <div className="hero__dots">
          {slides.map((slide, i) => (
            <button
              key={slide.id}
              className={`hero__dot${i === index ? " is-active" : ""}`}
              aria-label={`Слайд ${i + 1}`}
              onClick={() => setIndex(i)}
            />
          ))}
        </div>
        <div className="hero__arrows">
          <button
            className="hero__arrow"
            aria-label="Назад"
            onClick={() => go(-1)}
          >
            <ChevronLeftIcon />
          </button>
          <button
            className="hero__arrow"
            aria-label="Вперёд"
            onClick={() => go(1)}
          >
            <ChevronRightIcon />
          </button>
        </div>
      </div>
    </section>
  );
}
