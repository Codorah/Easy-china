// @ts-nocheck
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";

export function GlassCard({ children, tilt = true, className = "", style = {} }) {
  return (
    <motion.div
      className={cn(
        "relative bg-white/70 backdrop-blur-md border border-border rounded-xl p-8 shadow-md hover:shadow-lg transition-all duration-300 cursor-default",
        className
      )}
      style={style}
      whileHover={
        tilt
          ? {
              y: -3,
              boxShadow:
                "0 12px 32px rgba(26,20,16,0.12), 0 4px 8px rgba(26,20,16,0.06)",
              borderColor: "rgba(201,48,44,0.18)",
            }
          : {}
      }
      transition={{ duration: 0.15, ease: "easeOut" }}
    >
      <div className="relative z-[2] h-full flex flex-col">
        {children}
      </div>
    </motion.div>
  );
}
