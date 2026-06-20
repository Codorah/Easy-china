import { useState, useEffect } from "react";

export function useCountUp(
  target: number | string,
  duration: number = 2,
  isTriggered: boolean = true
): number {
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (!isTriggered) return;

    const end = parseInt(String(target), 10);
    if (isNaN(end)) return;
    if (0 === end) return;

    const totalMiliseconds = duration * 1000;
    const startTime = performance.now();
    let animationFrameId: number;

    const animate = (currentTime: number) => {
      const elapsedTime = currentTime - startTime;
      if (elapsedTime >= totalMiliseconds) {
        setCount(end);
        return;
      }

      const progress = elapsedTime / totalMiliseconds;
      const easeProgress =
        progress === 1 ? 1 : 1 - Math.pow(2, -10 * progress);
      const currentCount = Math.floor(easeProgress * end);
      setCount(currentCount);

      animationFrameId = requestAnimationFrame(animate);
    };

    animationFrameId = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(animationFrameId);
  }, [target, duration, isTriggered]);

  return count;
}
