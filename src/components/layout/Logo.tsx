// @ts-nocheck
import { motion } from "framer-motion";

export function Logo({ onClick, size = "md" }) {
  const h = size === "sm" ? 64 : 88;
  return (
    <motion.div
      onClick={onClick}
      whileHover={{ scale: 1.04 }}
      whileTap={{ scale: 0.97 }}
      transition={{ type: "spring", stiffness: 400, damping: 20 }}
      style={{ cursor: "pointer", userSelect: "none", display: "flex", alignItems: "center" }}
    >
      <img src="/logo.png" alt="Easy China" style={{ height: h, width: "auto", objectFit: "contain", display: "block" }} />
    </motion.div>
  );
}
