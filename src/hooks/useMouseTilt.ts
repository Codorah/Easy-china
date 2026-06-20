import { useState, useCallback } from "react";

interface TiltState {
  rotateX: number;
  rotateY: number;
  glareX: number;
  glareY: number;
  isHovered: boolean;
}

export function useMouseTilt(
  ref: React.RefObject<HTMLElement | null>,
  maxDeg: number = 8
) {
  const [tilt, setTilt] = useState<TiltState>({
    rotateX: 0,
    rotateY: 0,
    glareX: 0,
    glareY: 0,
    isHovered: false,
  });

  const handleMouseMove = useCallback(
    (e: MouseEvent) => {
      if (!ref.current) return;
      const rect = ref.current.getBoundingClientRect();
      const width = rect.width;
      const height = rect.height;

      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      const px = x / width - 0.5;
      const py = y / height - 0.5;

      const rotateX = -(py * maxDeg * 2);
      const rotateY = px * maxDeg * 2;

      setTilt({
        rotateX,
        rotateY,
        glareX: (x / width) * 100,
        glareY: (y / height) * 100,
        isHovered: true,
      });
    },
    [ref, maxDeg]
  );

  const handleMouseLeave = useCallback(() => {
    setTilt({
      rotateX: 0,
      rotateY: 0,
      glareX: 0,
      glareY: 0,
      isHovered: false,
    });
  }, []);

  return { tilt, handleMouseMove, handleMouseLeave };
}
