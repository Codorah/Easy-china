"use client";
import { useEffect, useRef, useState } from "react";

interface Props {
  children: React.ReactNode;
  delay?: number;
  direction?: "up" | "left" | "right" | "none";
  className?: string;
}

export function ScrollReveal({ children, delay = 0, direction = "up", className = "" }: Props) {
  const ref     = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    // Set CSS custom property imperatively — avoids JSX style prop
    el.style.setProperty("--reveal-delay", `${delay}s`);

    const obs = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) { setVisible(true); obs.disconnect(); } },
      { threshold: 0.12, rootMargin: "0px 0px -40px 0px" },
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, [delay]);

  return (
    <div
      ref={ref}
      className={`reveal ${className}`}
      data-dir={direction}
      data-visible={visible ? "" : undefined}
    >
      {children}
    </div>
  );
}
