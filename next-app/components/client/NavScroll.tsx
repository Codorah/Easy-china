"use client";
import { useEffect, useState } from "react";

// Wraps the nav and applies shrink-on-scroll styles via a data attribute
export function NavScroll({ children }: { children: React.ReactNode }) {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <div
      data-scrolled={scrolled ? "true" : undefined}
      className="
        fixed top-0 left-0 right-0 z-[1000] transition-all duration-500
        data-[scrolled]:top-3 data-[scrolled]:left-[3%] data-[scrolled]:right-[3%]
        data-[scrolled]:rounded-[var(--radius-xl)]
        data-[scrolled]:shadow-[var(--shadow-raise)]
      "
    >
      {children}
    </div>
  );
}
