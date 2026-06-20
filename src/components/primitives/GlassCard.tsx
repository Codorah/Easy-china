// @ts-nocheck
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";

export function GlassCard({ children, tilt = true, className = "", style = {} }) {
  return (
    /* Double-Bezel outer shell */
    <motion.div
      className="p-1.5 rounded-[1.5rem] bg-black/[0.03] ring-1 ring-black/[0.06] transition-all duration-700 ease-[cubic-bezier(0.32,0.72,0,1)]"
      whileHover={
        tilt
          ? {
              y: -4,
              boxShadow: "0 12px 40px rgba(26,20,16,0.1)",
            }
          : {}
      }
      transition={{ duration: 0.7, ease: [0.32, 0.72, 0, 1] }}
    >
      {/* Double-Bezel inner card */}
      <div
        className={cn(
          "rounded-[calc(1.5rem-0.375rem)] bg-white/80 backdrop-blur-sm p-8",
          "shadow-[inset_0_1px_1px_rgba(255,255,255,0.6)]",
          "shadow-[0_8px_30px_rgba(26,20,16,0.08)]",
          "transition-all duration-700 ease-[cubic-bezier(0.32,0.72,0,1)]",
          className
        )}
        style={style}
      >
        <div className="relative z-[2] h-full flex flex-col">
          {children}
        </div>
      </div>
    </motion.div>
  );
}
