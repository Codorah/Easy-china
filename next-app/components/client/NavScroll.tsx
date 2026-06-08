"use client";
import { useEffect, useState } from "react";

export function NavScroll({ children }: { children: React.ReactNode }) {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <div className="nav-wrap" data-scrolled={scrolled ? "" : undefined}>
      {children}
    </div>
  );
}
