// @ts-nocheck
import { useState, useEffect } from "react";
import { useScrollReveal } from "@/components/primitives/ScrollReveal";

// Inline hook — will be moved to @/hooks later
function useCountUp(target, duration = 2, isTriggered = true) {
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (!isTriggered) return;

    let start = 0;
    const end = parseInt(target, 10);
    if (isNaN(end)) return;
    if (start === end) return;

    const totalMiliseconds = duration * 1000;
    const startTime = performance.now();
    let animationFrameId;

    const animate = (currentTime) => {
      const elapsedTime = currentTime - startTime;
      if (elapsedTime >= totalMiliseconds) {
        setCount(end);
        return;
      }

      const progress = elapsedTime / totalMiliseconds;
      const easeProgress = progress === 1 ? 1 : 1 - Math.pow(2, -10 * progress);
      const currentCount = Math.floor(easeProgress * end);
      setCount(currentCount);

      animationFrameId = requestAnimationFrame(animate);
    };

    animationFrameId = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(animationFrameId);
  }, [target, duration, isTriggered]);

  return count;
}

export function AnimatedCounter({ value, suffix = "+", duration = 2.5 }) {
  const [ref, isVisible] = useScrollReveal({ once: true, threshold: 0.1 });
  const count = useCountUp(value, duration, isVisible);

  return (
    <span ref={ref} style={{ display: "inline-block" }}>
      {count}{suffix}
    </span>
  );
}
