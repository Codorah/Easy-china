// @ts-nocheck
import { useState, useEffect, useRef } from "react";
import { cn } from "@/lib/utils";

// Inline hook — will be moved to @/hooks later
function useScrollReveal(options = {}) {
  const [isVisible, setIsVisible] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          if (options.once) {
            observer.unobserve(entry.target);
          }
        } else if (!options.once) {
          setIsVisible(false);
        }
      },
      { threshold: options.threshold || 0.1, ...options }
    );

    const currentRef = ref.current;
    if (currentRef) {
      observer.observe(currentRef);
    }

    return () => {
      if (currentRef) {
        observer.unobserve(currentRef);
      }
    };
  }, [options.once, options.threshold]);

  return [ref, isVisible];
}

export function ScrollReveal({
  children,
  delay = 0,
  direction = "up",
  duration = 0.8,
  style = {},
  className = "",
}) {
  const [ref, isVisible] = useScrollReveal({ once: true, threshold: 0.1 });

  const dist = 16;
  const hidden = {
    up: `translateY(${dist}px)`,
    down: `translateY(-${dist}px)`,
    left: `translateX(${dist}px)`,
    right: `translateX(-${dist}px)`,
  }[direction] || `translateY(${dist}px)`;

  return (
    <div
      ref={ref}
      className={cn("will-change-[opacity,transform,filter]", className)}
      style={{
        opacity: isVisible ? 1 : 0,
        transform: isVisible ? "translate(0,0)" : hidden,
        filter: isVisible ? "blur(0px)" : "blur(8px)",
        transition: [
          `opacity ${duration}s cubic-bezier(0.32,0.72,0,1) ${delay}s`,
          `transform ${duration}s cubic-bezier(0.32,0.72,0,1) ${delay}s`,
          `filter ${duration}s cubic-bezier(0.32,0.72,0,1) ${delay}s`,
        ].join(", "),
        ...style,
      }}
    >
      {children}
    </div>
  );
}

// Re-export the hook so other primitives (AnimatedCounter) can use it
export { useScrollReveal };
