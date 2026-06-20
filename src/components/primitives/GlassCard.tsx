// @ts-nocheck
import { motion } from "framer-motion";

export function GlassCard({ children, tilt = true, style = {}, className = "" }) {
  return (
    <motion.div
      className={className}
      whileHover={tilt ? {
        y: -3,
        boxShadow: "0 12px 32px rgba(26,20,16,0.12), 0 4px 8px rgba(26,20,16,0.06)",
        borderColor: "rgba(201,48,44,0.18)",
      } : {}}
      transition={{ duration: 0.15, ease: "easeOut" }}
      style={{
        position: "relative",
        borderRadius: "var(--radius-md)",
        background: "var(--surface)",
        border: "1px solid var(--border)",
        padding: "var(--space-8)",
        boxShadow: "var(--shadow-sm)",
        cursor: "default",
        ...style,
      }}
    >
      <div style={{ position: "relative", zIndex: 2, height: "100%", display: "flex", flexDirection: "column" }}>
        {children}
      </div>
    </motion.div>
  );
}
