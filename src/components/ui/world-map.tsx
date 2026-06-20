// @ts-nocheck
"use client";
import { useRef, useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import DottedMap from "dotted-map";

interface MapProps {
  dots?: Array<{
    start: { lat: number; lng: number; label?: string };
    end: { lat: number; lng: number; label?: string };
  }>;
  lineColor?: string;
  showLabels?: boolean;
  animationDuration?: number;
  loop?: boolean;
}

export function WorldMap({
  dots = [],
  lineColor = "#c9302c",
  showLabels = true,
  animationDuration = 2,
  loop = true,
}: MapProps) {
  const svgRef = useRef(null);
  const [hoveredLocation, setHoveredLocation] = useState(null);

  const map = useMemo(() => new DottedMap({ height: 100, grid: "diagonal" }), []);

  const svgMap = useMemo(
    () =>
      map.getSVG({
        radius: 0.22,
        color: "#00000040",
        shape: "circle",
        backgroundColor: "transparent",
      }),
    [map]
  );

  const projectPoint = (lat, lng) => {
    const x = (lng + 180) * (800 / 360);
    const y = (90 - lat) * (400 / 180);
    return { x, y };
  };

  const createCurvedPath = (start, end) => {
    const midX = (start.x + end.x) / 2;
    const midY = Math.min(start.y, end.y) - 50;
    return `M ${start.x} ${start.y} Q ${midX} ${midY} ${end.x} ${end.y}`;
  };

  const staggerDelay = 0.3;
  const totalAnimationTime = dots.length * staggerDelay + animationDuration;
  const pauseTime = 2;
  const fullCycleDuration = totalAnimationTime + pauseTime;

  return (
    <div className="w-full aspect-[2/1] md:aspect-[2.5/1] lg:aspect-[2/1] bg-bg rounded-xl relative font-body overflow-hidden">
      <img
        src={`data:image/svg+xml;utf8,${encodeURIComponent(svgMap)}`}
        className="h-full w-full pointer-events-none select-none object-cover"
        style={{ maskImage: "linear-gradient(to bottom, transparent, white 10%, white 90%, transparent)" }}
        alt="world map"
        draggable={false}
      />
      <svg
        ref={svgRef}
        viewBox="0 0 800 400"
        className="w-full h-full absolute inset-0 pointer-events-auto select-none"
        preserveAspectRatio="xMidYMid meet"
      >
        <defs>
          <linearGradient id="path-gradient" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="white" stopOpacity="0" />
            <stop offset="5%" stopColor={lineColor} stopOpacity="1" />
            <stop offset="95%" stopColor={lineColor} stopOpacity="1" />
            <stop offset="100%" stopColor="white" stopOpacity="0" />
          </linearGradient>
          <filter id="glow">
            <feMorphology operator="dilate" radius="0.5" />
            <feGaussianBlur stdDeviation="1" result="coloredBlur" />
            <feMerge>
              <feMergeNode in="coloredBlur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        {dots.map((dot, i) => {
          const startPoint = projectPoint(dot.start.lat, dot.start.lng);
          const endPoint = projectPoint(dot.end.lat, dot.end.lng);
          const startTime = (i * staggerDelay) / fullCycleDuration;
          const endTime = (i * staggerDelay + animationDuration) / fullCycleDuration;
          const resetTime = totalAnimationTime / fullCycleDuration;

          return (
            <g key={`path-group-${i}`}>
              <motion.path
                d={createCurvedPath(startPoint, endPoint)}
                fill="none"
                stroke="url(#path-gradient)"
                strokeWidth="1"
                initial={{ pathLength: 0 }}
                animate={loop ? { pathLength: [0, 0, 1, 1, 0] } : { pathLength: 1 }}
                transition={
                  loop
                    ? { duration: fullCycleDuration, times: [0, startTime, endTime, resetTime, 1], ease: "easeInOut", repeat: Infinity, repeatDelay: 0 }
                    : { duration: animationDuration, delay: i * staggerDelay, ease: "easeInOut" }
                }
              />
            </g>
          );
        })}

        {dots.map((dot, i) => {
          const startPoint = projectPoint(dot.start.lat, dot.start.lng);
          const endPoint = projectPoint(dot.end.lat, dot.end.lng);
          return (
            <g key={`points-group-${i}`}>
              <g>
                <circle cx={startPoint.x} cy={startPoint.y} r="3" fill={lineColor} filter="url(#glow)" />
                <circle cx={startPoint.x} cy={startPoint.y} r="3" fill={lineColor} opacity="0.5">
                  <animate attributeName="r" from="3" to="12" dur="2s" repeatCount="indefinite" />
                  <animate attributeName="opacity" from="0.6" to="0" dur="2s" repeatCount="indefinite" />
                </circle>
                {showLabels && dot.start.label && (
                  <motion.g initial={{ opacity: 0, y: 5 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 * i + 0.3, duration: 0.5 }} className="pointer-events-none">
                    <foreignObject x={startPoint.x - 50} y={startPoint.y - 35} width="100" height="30">
                      <div className="flex items-center justify-center h-full">
                        <span className="text-xs font-medium px-2 py-0.5 rounded-md bg-white/95 text-text border border-border shadow-sm">{dot.start.label}</span>
                      </div>
                    </foreignObject>
                  </motion.g>
                )}
              </g>
              <g>
                <circle cx={endPoint.x} cy={endPoint.y} r="3" fill={lineColor} filter="url(#glow)" />
                <circle cx={endPoint.x} cy={endPoint.y} r="3" fill={lineColor} opacity="0.5">
                  <animate attributeName="r" from="3" to="12" dur="2s" begin="0.5s" repeatCount="indefinite" />
                  <animate attributeName="opacity" from="0.6" to="0" dur="2s" begin="0.5s" repeatCount="indefinite" />
                </circle>
                {showLabels && dot.end.label && (
                  <motion.g initial={{ opacity: 0, y: 5 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 * i + 0.5, duration: 0.5 }} className="pointer-events-none">
                    <foreignObject x={endPoint.x - 50} y={endPoint.y - 35} width="100" height="30">
                      <div className="flex items-center justify-center h-full">
                        <span className="text-xs font-medium px-2 py-0.5 rounded-md bg-white/95 text-text border border-border shadow-sm">{dot.end.label}</span>
                      </div>
                    </foreignObject>
                  </motion.g>
                )}
              </g>
            </g>
          );
        })}
      </svg>

      <AnimatePresence>
        {hoveredLocation && (
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 10 }}
            className="absolute bottom-4 left-4 bg-white/90 text-text px-3 py-2 rounded-lg text-sm font-medium backdrop-blur-sm sm:hidden border border-border">
            {hoveredLocation}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
