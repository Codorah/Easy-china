// @ts-nocheck
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

export function Logo({ onClick, size = "md" }) {
  return (
    <motion.div
      onClick={onClick}
      whileHover={{ scale: 1.04 }}
      whileTap={{ scale: 0.97 }}
      transition={{ type: "spring", stiffness: 400, damping: 20 }}
      className="cursor-pointer select-none flex items-center"
    >
      <img
        src="/logo.png"
        alt="Easy China"
        className={cn(
          "w-auto object-contain block",
          size === "sm" ? "h-16" : "h-[88px]"
        )}
      />
    </motion.div>
  );
}
