// @ts-nocheck
import { useState, useEffect, useRef } from "react";

// Inline hook — will be moved to @/hooks later
function useScrollReveal(options = {}) {
  const [isVisible, setIsVisible] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        setIsVisible(true);
        if (options.once) {
          observer.unobserve(entry.target);
        }
      } else if (!options.once) {
        setIsVisible(false);
      }
    }, { threshold: options.threshold || 0.1, ...options });

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

export function ScrollReveal({ children, delay = 0, direction = "up", duration = 0.5, style = {}, className = "" }) {
  const [ref, isVisible] = useScrollReveal({ once: true, threshold: 0.1 });

  const dist = 14;
  const hidden = {
    up:    `translateY(${dist}px)`,
    down:  `translateY(-${dist}px)`,
    left:  `translateX(${dist}px)`,
    right: `translateX(-${dist}px)`,
  }[direction] || `translateY(${dist}px)`;

  return (
    <div
      ref={ref}
      className={className}
      style={{
        opacity: isVisible ? 1 : 0,
        transform: isVisible ? "translate(0,0)" : hidden,
        transition: `opacity ${duration}s cubic-bezier(0.16,1,0.3,1) ${delay}s, transform ${duration}s cubic-bezier(0.16,1,0.3,1) ${delay}s`,
        ...style,
      }}
    >
      {children}
    </div>
  );
}

// Re-export the hook so other primitives (AnimatedCounter) can use it
export { useScrollReveal };
